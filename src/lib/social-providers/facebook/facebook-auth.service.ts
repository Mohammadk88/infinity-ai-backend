import {
  Injectable,
  UnauthorizedException,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SocialSessionStore } from '../redis/social-session.redis';
// Update the import path if the file exists elsewhere, for example:
// Update the path below to the correct location of social-accounts.service.ts
import { SocialAccountsService } from '../../../social-accounts/social-accounts.service';
import { PrismaService } from '../../../prisma/prisma.service';
import axios from 'axios';

// facebook-auth.service.ts

@Injectable()
export class FacebookAuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly sessionStore: SocialSessionStore,
    @Inject(forwardRef(() => SocialAccountsService))
    private readonly socialAccountsService: SocialAccountsService,
    private readonly prisma: PrismaService,
  ) {}

  getAuthorizationUrl(): string {
    const clientId = this.configService.get('FACEBOOK_APP_ID') as string;
    const redirectUri = this.configService.get(
      'FACEBOOK_CALLBACK_URL',
    ) as string;
    const state = 'secure-random-state'; // لاحقاً يمكن توليده ديناميكياً

    return `https://www.facebook.com/v18.0/dialog/oauth?client_id=${clientId}&redirect_uri=${redirectUri}&state=${state}&scope=pages_show_list,pages_read_engagement,pages_manage_posts`;
  }

  async getAuthUrl(userId: string, clientId: string): Promise<{ url: string }> {
    const appId = this.configService.get('FACEBOOK_APP_ID') as string;
    const redirectUri = this.configService.get(
      'FACEBOOK_CALLBACK_URL',
    ) as string; // لازم تكون نفس الرابط يلي فوق

    const state = `${userId}:${clientId}`;
    const authUrl =
      `https://www.facebook.com/v18.0/dialog/oauth?` +
      `client_id=${appId}&redirect_uri=${encodeURIComponent(redirectUri)}` +
      `&scope=pages_show_list,pages_manage_posts,instagram_basic,instagram_content_publish` +
      `&response_type=code&state=${encodeURIComponent(state)}`;

    await this.sessionStore.delete(`facebook:${state}`);
    await this.sessionStore.set(`facebook:${state}`, { userId, clientId });
    return { url: authUrl };
  }

  async handleCallback(code: string, state: string) {
    try {
      console.log(`🔄 Starting Facebook OAuth callback for state: ${state}`);
      
      const [userId, clientId] = state.split(':');
      const stored = await this.sessionStore.get(`facebook:${state}`);
      if (!stored) {
        console.error(`❌ Invalid session for state: ${state}`);
        throw new UnauthorizedException('Invalid session');
      }

      const appId = this.configService.get<string>('FACEBOOK_APP_ID');
      const appSecret = this.configService.get<string>('FACEBOOK_APP_SECRET');
      const redirectUri = this.configService.get<string>(
        'FACEBOOK_CALLBACK_URL',
      );

      console.log(`🔑 Exchanging code for access token for user: ${userId}`);
      
      const tokenRes = await axios.get<{ access_token: string }>(
        'https://graph.facebook.com/v18.0/oauth/access_token',
        {
          params: {
            client_id: appId,
            client_secret: appSecret,
            redirect_uri: redirectUri,
            code,
          },
        },
      );

      if (!tokenRes.data || typeof tokenRes.data.access_token !== 'string') {
        console.error(
          '❌ Invalid token response from Facebook:',
          tokenRes.data,
        );
        throw new UnauthorizedException('Invalid token response from Facebook');
      }
      const accessToken = tokenRes.data.access_token;
      
      console.log(`✅ Successfully obtained access token for user: ${userId}`);

      interface FacebookPagesResponse {
        data: {
          access_token: string;
          category: string;
          name: string;
          id: string;
          tasks: string[];
          clientId?: string; // Optional, if you want to include clientId
        }[];
      }

      console.log(`📄 Fetching Facebook pages for user: ${userId}`);

      const pagesRes = await axios.get<FacebookPagesResponse>(
        'https://graph.facebook.com/me/accounts',
        {
          params: { access_token: accessToken },
        },
      );

      const pages = pagesRes.data.data;
      
      if (!pages || pages.length === 0) {
        console.log(`⚠️ No Facebook pages found for user: ${userId}`);
        return {
          redirectUrl: `http://localhost:3000/dashboard/social-accounts?success=1&message=no-pages`,
          accessToken,
          pages: [],
          savedAccounts: [],
          userId,
          clientId,
          message: 'No Facebook pages found for this account',
        };
      }
      
      console.log(
        `📊 Found ${pages.length} Facebook pages for user: ${userId}`,
      );

      // استخدام Promise.all للمعالجة المتزامنة لجميع صفحات الفيسبوك
      const processedAccounts = await Promise.all(
        pages.map(async (page) => {
          // التحقق من وجود الحساب
          const exists = await this.prisma.socialAccount.findFirst({
            where: {
              userId,
              platform: 'FACEBOOK',
              pageId: page.id,
            },
          });

          if (!exists) {
            // إنشاء حساب جديد
            const newAccount = await this.prisma.socialAccount.create({
              data: {
                userId,
                platform: 'FACEBOOK',
                accountName: page.name,
                pageId: page.id,
                externalId: page.id,
                accessToken: page.access_token,
                tokenExpiresAt: new Date(Date.now() + 60 * 60 * 24 * 60 * 1000), // 60 days expiry
              },
            });

            console.log(
              `✅ CREATED new Facebook page: ${page.name} (${page.id}) for user ${userId}`,
            );

            return { ...newAccount, action: 'created' };
          } else {
            // تحديث الـ access token للحساب الموجود
            const updatedAccount = await this.prisma.socialAccount.update({
              where: { id: exists.id },
              data: {
                accessToken: page.access_token,
                accountName: page.name, // تحديث اسم الصفحة أيضاً في حالة تغييره
                tokenExpiresAt: new Date(Date.now() + 60 * 60 * 24 * 60 * 1000), // 60 days expiry
              },
            });

            console.log(
              `🔄 UPDATED access token for Facebook page: ${page.name} (${page.id}) for user ${userId}`,
            );

            return { ...updatedAccount, action: 'updated' };
          }
        }),
      );

      console.log(
        `🎉 Successfully processed ${processedAccounts.length} Facebook pages for user ${userId}`,
      );

      // إضافة معلومات تفصيلية عن العمليات المنجزة
      const createdCount = processedAccounts.filter(
        (acc) => acc.action === 'created',
      ).length;
      const updatedCount = processedAccounts.filter(
        (acc) => acc.action === 'updated',
      ).length;

      console.log(
        `📊 Summary: ${createdCount} pages created, ${updatedCount} pages updated for user ${userId}`,
      );

      // 2. إعادة التوجيه لواجهة معينة بالفرونت إند بعد الربط:
      return {
        redirectUrl: `http://localhost:3000/dashboard/social-accounts?success=1`,
        accessToken,
        pages,
        savedAccounts: processedAccounts,
        userId,
        clientId,
        message: `Successfully processed ${processedAccounts.length} Facebook pages`,
      };
    } catch (error) {
      console.error(`❌ Facebook OAuth Error for user ${state}:`, error);
      throw error;
    }
  }
}
