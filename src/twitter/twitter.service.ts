import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import OAuth from 'oauth-1.0a';
import * as crypto from 'crypto';
import * as qs from 'qs';
import { TwitterCallbackDto } from './dto/twitter-callback.dto';
import { PostTweetDto } from './dto/post-tweet.dto';
import { TwitterAuthResult } from './interfaces/twitter-auth-result.interface';
import { CreateTwitterPostDto } from './dto/create-twitter-post.dto';
import { JwtPayload } from 'src/common/interfaces/jwt-payload.interface';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TwitterService {
  private readonly oauth: OAuth;
  private readonly requestTokenURL =
    'https://api.twitter.com/oauth/request_token';
  private readonly accessTokenURL =
    'https://api.twitter.com/oauth/access_token';
  private readonly authenticateURL =
    'https://api.twitter.com/oauth/authenticate';
  constructor(
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {
    this.oauth = new OAuth({
      consumer: {
        key: this.configService.get<string>('TWITTER_CONSUMER_KEY') || '',
        secret: this.configService.get<string>('TWITTER_CONSUMER_SECRET') || '',
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

  async getAuthUrl(): Promise<string> {
    const oauthCallback = this.configService.get<string>(
      'TWITTER_CALLBACK_URL',
    );

    const request_data = {
      url: this.requestTokenURL,
      method: 'POST',
      data: { oauth_callback: oauthCallback },
    };

    const headers = this.oauth.toHeader(this.oauth.authorize(request_data));
    const response = await axios.post(this.requestTokenURL, null, { headers });

    const result = qs.parse(response.data as string);
    return `${this.authenticateURL}?oauth_token=${result.oauth_token as string}`;
  }

  async handleCallback(
    oauth_token: string,
    oauth_verifier: string,
    query: TwitterCallbackDto,
  ): Promise<TwitterAuthResult> {
    const request_data = {
      url: this.accessTokenURL,
      method: 'POST',
      data: {
        oauth_token: query.oauth_token,
        oauth_verifier: query.oauth_verifier,
      },
    };

    const headers = this.oauth.toHeader(this.oauth.authorize(request_data));
    const response = await axios.post(this.accessTokenURL, null, {
      headers,
      params: request_data.data,
    });

    const result = qs.parse(response.data as string);
    return {
      oauth_token: result.oauth_token as string,
      oauth_token_secret: result.oauth_token_secret as string,
      user_id: result.user_id as string,
      screen_name: result.screen_name as string,
    };
  }

  async postTweet(data: PostTweetDto): Promise<any> {
    const url = 'https://api.twitter.com/1.1/statuses/update.json';
    const request_data = {
      url,
      method: 'POST',
      data: { status: data.status },
    };

    const headers = this.oauth.toHeader(
      this.oauth.authorize(request_data, {
        key: data.accessToken,
        secret: data.accessTokenSecret,
      }),
    );

    const response = await axios.post(url, null, {
      headers,
      params: request_data.data,
    });

    return response.data;
  }
  async publishTweet(dto: CreateTwitterPostDto, user: JwtPayload) {
    const socialAccount = await this.prisma.socialAccount.findFirst({
      where: {
        id: dto.socialAccountId,
        userId: user.id,
        platform: 'TWITTER',
      },
    });

    if (!socialAccount) {
      throw new BadRequestException('Invalid or unauthorized Twitter account.');
    }

    const url = 'https://api.twitter.com/1.1/statuses/update.json';
    const request_data = {
      url,
      method: 'POST',
      data: { status: dto.status },
    };

    const headers = this.oauth.toHeader(
      this.oauth.authorize(request_data, {
        key: socialAccount.accessToken,
        secret: socialAccount.refreshToken ?? '',
      }),
    );

    const response = await axios.post(url, null, {
      headers,
      params: request_data.data,
    });

    // Save to SocialPost
    const socialPost = await this.prisma.socialPost.create({
      data: {
        userId: user.id,
        clientId: user.clientId,
        content: dto.status,
        mediaUrl: dto.mediaUrl,
        status: 'PUBLISHED',
        publishedAt: new Date(),
        socialAccountId: dto.socialAccountId,
        isAIGenerated: false,
        postTags: { create: dto.tagIds?.map((tagId) => ({ tagId })) ?? [] },
        postCategories: {
          create: dto.categoryIds?.map((categoryId) => ({ categoryId })) ?? [],
        },
      },
    });

    return { tweet: response.data, savedPost: socialPost };
  }
}
