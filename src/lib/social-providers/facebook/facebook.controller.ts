import {
  Controller,
  Get,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { FacebookAuthService } from './facebook-auth.service';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import { JwtPayload } from '../../../common/interfaces/jwt-payload.interface';
import { FacebookCallbackDto } from './dto/facebook-auth.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@ApiTags('Facebook Auth')
@Controller('facebook')
export class FacebookController {
  constructor(private readonly facebookService: FacebookAuthService) {}

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('auth-url')
  @ApiOperation({ summary: 'Get Facebook OAuth URL' })
  async getAuthUrl(@CurrentUser() user: JwtPayload) {
    if (!user) {
      throw new Error('User not authenticated');
    }
    return this.facebookService.getAuthUrl(user.id, user.clientId);
  }

  @Get('callback')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  @ApiQuery({
    name: 'state',
    required: true,
    description: 'State param with userId:clientId',
  })
  @ApiQuery({
    name: 'code',
    required: true,
    description: 'Authorization code from Facebook',
  })
  async handleCallback(
    @Query() query: FacebookCallbackDto,
    @Res() res: Response,
  ) {
    try {
      const result = await this.facebookService.handleCallback(
        query.code,
        query.state,
      );

      // إرسال استجابة HTML محسّنة مع JavaScript للتواصل مع النافذة الأصلية
      const successResponse = `
        <html>
          <head>
            <title>Connecting Facebook Account...</title>
            <style>
              body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                display: flex;
                align-items: center;
                justify-content: center;
                flex-direction: column;
                height: 100vh;
                margin: 0;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                text-align: center;
              }
              .container {
                background: rgba(255, 255, 255, 0.1);
                padding: 2rem;
                border-radius: 15px;
                backdrop-filter: blur(10px);
                border: 1px solid rgba(255, 255, 255, 0.2);
                box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
              }
              .spinner {
                border: 3px solid rgba(255, 255, 255, 0.3);
                border-radius: 50%;
                border-top: 3px solid white;
                width: 30px;
                height: 30px;
                animation: spin 1s linear infinite;
                margin: 0 auto 1rem;
              }
              @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }
              h3 {
                margin: 0;
                font-weight: 300;
              }
              .success-icon {
                font-size: 2rem;
                margin-bottom: 1rem;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="success-icon">✅</div>
              <h3>Successfully connected ${result.savedAccounts?.length || 0} Facebook page(s)!</h3>
              <p>Redirecting to dashboard...</p>
            </div>
            <script>
              // بيانات النتيجة
              const resultData = {
                type: 'OAUTH_SUCCESS',
                provider: 'facebook',
                redirectUrl: ${JSON.stringify(result.redirectUrl)},
                success: true,
                data: {
                  userId: ${JSON.stringify(result.userId)},
                  clientId: ${JSON.stringify(result.clientId)},
                  pagesCount: ${result.savedAccounts?.length || 0},
                  message: ${JSON.stringify(result.message)}
                }
              };
              
              console.log('🎉 Facebook OAuth Success:', resultData);
              
              // إرسال رسالة للنافذة الأصلية بنجاح العملية
              if (window.opener && !window.opener.closed) {
                try {
                  window.opener.postMessage(resultData, "*");
                  console.log('✅ Message sent to parent window');
                  
                  // محاولة إعادة توجيه النافذة الأصلية
                  if (resultData.redirectUrl) {
                    setTimeout(() => {
                      try {
                        window.opener.location.href = resultData.redirectUrl;
                      } catch (e) {
                        console.log('Could not redirect parent window:', e);
                      }
                    }, 1000);
                  }
                } catch (e) {
                  console.error('Error communicating with parent window:', e);
                }
                
                // إغلاق النافذة بعد 2 ثانية
                setTimeout(() => {
                  try {
                    window.close();
                  } catch (e) {
                    console.log('Could not close window:', e);
                  }
                }, 2000);
              } else {
                // في حالة عدم وجود نافذة أصلية، إعادة التوجيه المباشر
                console.log('No parent window found, redirecting directly');
                setTimeout(() => {
                  window.location.href = resultData.redirectUrl || 'http://localhost:3000/dashboard/social-accounts?success=1';
                }, 1500);
              }
            </script>
          </body>
        </html>
      `;

      return res.send(successResponse);
    } catch (error) {
      // في حالة حدوث خطأ، إرسال رسالة خطأ للنافذة الأصلية
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';

      console.error('❌ Facebook OAuth Error:', error);

      const errorResponse = `
        <html>
          <head>
            <title>Connection Error</title>
            <style>
              body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                display: flex;
                align-items: center;
                justify-content: center;
                flex-direction: column;
                height: 100vh;
                margin: 0;
                background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%);
                color: white;
                text-align: center;
              }
              .container {
                background: rgba(255, 255, 255, 0.1);
                padding: 2rem;
                border-radius: 15px;
                backdrop-filter: blur(10px);
                border: 1px solid rgba(255, 255, 255, 0.2);
                box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
              }
              .error-icon {
                font-size: 2rem;
                margin-bottom: 1rem;
              }
              h3 {
                margin: 0 0 1rem 0;
                font-weight: 300;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="error-icon">❌</div>
              <h3>Failed to connect Facebook account</h3>
              <p>Please try again later.</p>
            </div>
            <script>
              // بيانات الخطأ
              const errorData = {
                type: 'OAUTH_ERROR',
                provider: 'facebook',
                error: ${JSON.stringify(errorMessage)},
                success: false
              };
              
              console.error('❌ Facebook OAuth Error:', errorData);
              
              // إرسال رسالة خطأ للنافذة الأصلية
              if (window.opener && !window.opener.closed) {
                try {
                  window.opener.postMessage(errorData, "*");
                  console.log('✅ Error message sent to parent window');
                } catch (e) {
                  console.error('Error communicating with parent window:', e);
                }
                
                // إغلاق النافذة بعد 3 ثواني
                setTimeout(() => {
                  try {
                    window.close();
                  } catch (e) {
                    console.log('Could not close window:', e);
                  }
                }, 3000);
              } else {
                // في حالة عدم وجود نافذة أصلية، إعادة التوجيه للصفحة الرئيسية
                console.log('No parent window found, redirecting to dashboard');
                setTimeout(() => {
                  window.location.href = 'http://localhost:3000/dashboard/social-accounts?error=1';
                }, 2000);
              }
            </script>
          </body>
        </html>
      `;

      return res.send(errorResponse);
    }
  }
}
