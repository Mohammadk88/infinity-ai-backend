import {
  Injectable,
  HttpException,
  HttpStatus,
  Logger,
  Get,
  BadRequestException,
} from '@nestjs/common';
import OAuth from 'oauth-1.0a';
import * as crypto from 'crypto';
import { SocialAccountsService } from '../../../social-accounts/social-accounts.service';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../../prisma/prisma.service';
import { HttpService } from '@nestjs/axios';
import { randomUUID } from 'crypto';
import { generateCodeChallenge, generateCodeVerifier } from '../../pkce.util';
import { SocialSessionStore } from '../redis/social-session.redis'; // افترضنا عندك store جاهز
import axios from 'axios';
import qs from 'qs';
import { Prisma } from '@prisma/client';
@Injectable()
export class TwitterAuthService {
  private readonly logger = new Logger(TwitterAuthService.name);
  private readonly oauth: OAuth;
  private readonly consumerKey: string;
  private readonly consumerSecret: string;
  private readonly callbackUrl: string;
  constructor(
    private readonly socialAccountService: SocialAccountsService,
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
    private readonly httpService: HttpService,
    private readonly RedisStore: SocialSessionStore,
  ) {
    // لتقليل الاعتماد على التكوين، يمكن جلب مفاتيح تويتر من متغيرات البيئة
    this.consumerKey =
      this.configService.get<string>('TWITTER_CONSUMER_KEY') || '';
    this.consumerSecret =
      this.configService.get<string>('TWITTER_CONSUMER_SECRET') || '';
    this.callbackUrl =
      this.configService.get<string>('TWITTER_CALLBACK_URL') || '';

    // إنشاء كائن OAuth للتعامل مع طلبات تويتر
    this.oauth = new OAuth({
      consumer: {
        key: this.consumerKey,
        secret: this.consumerSecret,
      },
      signature_method: 'HMAC-SHA1',
      hash_function(baseString, key) {
        return crypto
          .createHmac('sha1', key)
          .update(baseString)
          .digest('base64');
      },
    });
  }
  async getAccessToken(
    userId: string,
    clientId?: string,
  ): Promise<string | null> {
    const account = await this.prisma.socialAccount.findFirst({
      where: {
        userId,
        clientId,
        platform: 'TWITTER',
      },
    });

    return account?.accessToken || null;
  }

  /**
   * الحصول على توكن الطلب الأولي من تويتر
   */
  async getRequestToken(): Promise<{
    oauth_token: string;
    oauth_token_secret: string;
    oauth_callback_confirmed: string | null;
  }> {
    try {
      this.logger.log('جاري الحصول على توكن الطلب من تويتر');

      const requestData = {
        url: 'https://api.twitter.com/oauth/request_token',
        method: 'POST',
        data: { oauth_callback: this.callbackUrl },
      };

      const headers = this.oauth.toHeader(this.oauth.authorize(requestData));

      const response = await axios({
        url: requestData.url,
        method: requestData.method,
        headers: {
          ...headers,
        },
      });

      if (response.status !== 200) {
        throw new HttpException(
          'فشل الاتصال بواجهة برمجة تويتر',
          HttpStatus.BAD_GATEWAY,
        );
      }

      const responseData = new URLSearchParams(response.data as string);
      const oauth_token = responseData.get('oauth_token');
      const oauth_token_secret = responseData.get('oauth_token_secret');
      const oauth_callback_confirmed = responseData.get(
        'oauth_callback_confirmed',
      );

      if (!oauth_token || !oauth_token_secret) {
        throw new HttpException(
          'بيانات الاستجابة من تويتر غير صالحة',
          HttpStatus.BAD_GATEWAY,
        );
      }

      this.logger.log('تم الحصول على توكن الطلب بنجاح');

      return {
        oauth_token,
        oauth_token_secret,
        oauth_callback_confirmed,
      };
    } catch (error) {
      this.logger.error('خطأ في الحصول على توكن الطلب:', error);
      throw new HttpException(
        `فشل الحصول على توكن الطلب من تويتر: ${error instanceof Error ? error.message : 'خطأ غير معروف'}`,
        HttpStatus.BAD_GATEWAY,
      );
    }
  }
  /**
   * الحصول على معلومات المستخدم من تويتر باستخدام توكن الوصول
   */
  async getUserInfo(
    accessToken: string,
    accessTokenSecret: string,
  ): Promise<any> {
    try {
      const requestData = {
        url: 'https://api.twitter.com/1.1/account/verify_credentials.json',
        method: 'GET',
      };

      const token = {
        key: accessToken,
        secret: accessTokenSecret,
      };

      const headers = this.oauth.toHeader(
        this.oauth.authorize(requestData, token),
      );

      const response = await axios({
        url: requestData.url,
        method: requestData.method,
        headers: {
          ...headers,
        },
      });

      if (response.status !== 200) {
        throw new Error('فشل الحصول على معلومات المستخدم من تويتر');
      }

      return response.data;
    } catch (error) {
      this.logger.error('خطأ في الحصول على معلومات المستخدم', error);
      throw new Error(
        `فشل الحصول على معلومات المستخدم: ${error instanceof Error ? error.message : 'خطأ غير معروف'}`,
      );
    }
  }

  /**
   * معالجة رد التفويض من تويتر
   * */
  async getAuthUrl(clientId: string, userId: string): Promise<string> {
    const clientIdTwitter = process.env.TWITTER_CLIENT_ID!;
    const redirectUri = 'http://localhost:4040/twitter/callback';
    const scope = 'tweet.read users.read offline.access tweet.write';
    const state = randomUUID();

    const codeVerifier = generateCodeVerifier();
    const codeChallenge = generateCodeChallenge(codeVerifier);

    console.log('codeVerifier', codeVerifier);
    console.log('codeChallenge', codeChallenge);
    console.log('state', state);
    // 🧠 خزّن الـ verifier والبيانات بالـ session store
    const dataRedis = JSON.stringify({
      codeVerifier,
      clientId,
      userId,
      createdAt: Date.now(),
    });
    await this.RedisStore.delete(`twitter:auth:${state}`);
    await this.RedisStore.set(`twitter:auth:${state}`, dataRedis, 300); // TTL 5 دقائق مثلًا

    const url = `https://twitter.com/i/oauth2/authorize?response_type=code&client_id=${clientIdTwitter}&redirect_uri=${encodeURIComponent(
      redirectUri,
    )}&scope=${encodeURIComponent(scope)}&state=${state}&code_challenge=${codeChallenge}&code_challenge_method=S256`;

    return Promise.resolve(url);
  }

  @Get('callback')
  async handleCallback(
    code: string,
    state: string,
  ): Promise<{
    success: boolean;
    userId?: string;
    accessToken?: string;
    message?: string;
  }> {
    const clientIdTwitter = process.env.TWITTER_CLIENT_ID!;
    const clientSecretTwitter = process.env.TWITTER_CLIENT_SECRET!;
    const redirectUri = 'http://localhost:4040/twitter/callback';

    console.log('query params:', { state, code });
    // Remove or comment out this line since we don't have the request object
    // console.log('full url:', request.url); // إذا ضفت @Req() request
    if (!state || !code) {
      this.logger.error('🚨 Missing state or code in callback', {
        state,
        code,
      });
      throw new BadRequestException('Missing Twitter OAuth state or code');
    }
    console.log('handleCallback: state', state);
    console.log('handleCallback: code', code);
    const session = await this.RedisStore.get<{
      codeVerifier: string;
      clientId: string;
      userId: string;
      createdAt: number;
    }>(`twitter:auth:${state}`);
    if (!session) throw new Error('Invalid or expired session');

    const { codeVerifier, clientId, userId } = session;
    console.log({
      code,
      client_id: clientIdTwitter,
      redirect_uri: redirectUri,
      code_verifier: codeVerifier,
    });
    const credentials = `${clientIdTwitter}:${clientSecretTwitter}`;
    const encodedCredentials = Buffer.from(credentials).toString('base64');
    const res = await axios.post(
      'https://api.twitter.com/2/oauth2/token',
      new URLSearchParams({
        code: code,
        grant_type: 'authorization_code',
        client_id: clientIdTwitter,
        redirect_uri: redirectUri,
        code_verifier: codeVerifier,
      }),
      {
        headers: {
          Authorization: `Basic ${encodedCredentials}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      },
    );

    const { access_token, refresh_token, expires_in, scope, token_type } =
      res.data as {
        access_token: string;
        refresh_token: string;
        expires_in: number;
        scope: string;
        token_type: string;
      };

    // 🧠 هون احفظ التوكنات بقاعدة البيانات
    console.log({
      clientId,
      userId,
      access_token,
      refresh_token,
      expires_in,
      scope,
      token_type,
    });

    // يمكنك تخزينهم بـ SocialAccount أو حسب ما عندك
    const expiresAt = new Date(Date.now() + expires_in * 1000); // وقت انتهاء التوكن
    // استرجع أو أنشئ SocialAccount
    const existingAccount = await this.prisma.socialAccount.findFirst({
      where: {
        userId,
        clientId,
        platform: 'TWITTER',
      },
    });

    // expiresAt is already declared above

    if (existingAccount) {
      // ✅ تحديث التوكنات إذا الحساب موجود
      await this.prisma.socialAccount.update({
        where: { id: existingAccount.id },
        data: {
          accessToken: access_token,
          refreshToken: refresh_token,
          tokenExpiresAt: expiresAt,
          updatedAt: new Date(),
        },
      });
    } else {
      // ✅ إنشاء حساب جديد
      const socialAccountData: Prisma.SocialAccountCreateInput = {
        platform: 'TWITTER',
        pageId: '',
        accountName: 'Twitter Account',
        accessToken: access_token,
        refreshToken: refresh_token,
        tokenExpiresAt: expiresAt.toISOString(),
        user: { connect: { id: userId } },
      };
      if (clientId) {
        socialAccountData.client = { connect: { id: clientId } };
      }

      await this.prisma.socialAccount.create({
        data: socialAccountData,
      });
    }

    // Return the required response object
    return {
      success: true,
      userId: userId,
      accessToken: access_token,
      message: 'Twitter authentication successful',
    };
  }
  /**
   * تويتر لا يدعم التوكن القابل للتجديد، لذا هذا التابع فقط placeholder
   */
  refreshAccessTokenIfNeeded(): void {
    return;
  }
  async publish(
    userId: string,
    clientId: string | undefined,
    content: string,
  ): Promise<{ tweetId: string; status: string; text: string }> {
    // 1. استرجاع الحساب من قاعدة البيانات
    console.log('publish: userId', userId);
    const account = await this.prisma.socialAccount.findFirst({
      where: {
        userId,
        platform: 'TWITTER',
        ...(clientId ? { clientId } : {}),
      },
    });

    console.log('publish: account', account);
    if (!account || !account.accessToken) {
      throw new Error('No linked Twitter account found.');
    }

    const accessToken = account.accessToken;
    // const accessTokenSecret = account.refreshToken; // في تويتر، refreshToken يخزن accessTokenSecret
    const tweetContent = content;

    // 2. إرسال الطلب إلى Twitter API v2 باستخدام OAuth 1.0a
    try {
      this.logger.log('Attempting to publish tweet', { userId, clientId });

      // تكوين طلب OAuth 1.0a
      const requestData = {
        url: 'https://api.twitter.com/2/tweets',
        method: 'POST',
      };

      // const token = {
      //   key: accessToken,
      //   secret: accessTokenSecret || '',
      // };

      // const oauthHeaders = this.oauth.toHeader(
      //   this.oauth.authorize(requestData, token),
      // );

      // استخدام axios مباشرة بدلاً من httpService
      const response = await axios({
        url: requestData.url,
        method: requestData.method,
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        data: { text: tweetContent },
      });

      if (!response?.data || typeof response.data !== 'object') {
        this.logger.error('Tweet response missing ID', response.data);
        throw new Error('Failed to post tweet');
      }

      const responseData = response.data || {};
      if (response.status !== 201) {
        this.logger.error('Failed to post tweet', responseData);
        throw new Error('Failed to post tweet');
      }

      // Type guard to ensure data exists and has the expected structure
      if (
        !responseData ||
        typeof responseData !== 'object' ||
        !('data' in responseData) ||
        !responseData.data ||
        typeof responseData.data !== 'object' ||
        !('id' in responseData.data)
      ) {
        this.logger.error(
          'Invalid Twitter API response structure',
          responseData,
        );
        throw new Error('Invalid Twitter API response structure');
      }

      return {
        tweetId: responseData.data.id as string,
        text:
          'text' in responseData.data &&
          typeof responseData.data.text === 'string'
            ? responseData.data.text
            : tweetContent,
        status: 'success',
      };
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      throw new Error(`Twitter API Error: ${errorMessage}`);
    }
  }
}
