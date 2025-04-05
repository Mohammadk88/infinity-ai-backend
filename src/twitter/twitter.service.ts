import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import OAuth from 'oauth-1.0a';
import crypto from 'crypto';

@Injectable()
export class TwitterService {
  private readonly oauth: OAuth;
  private readonly requestTokenURL =
    'https://api.twitter.com/oauth/request_token';
  private readonly accessTokenURL =
    'https://api.twitter.com/oauth/access_token';
  private readonly authenticateURL =
    'https://api.twitter.com/oauth/authenticate';

  constructor(private configService: ConfigService) {
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
    const params = new URLSearchParams(response.data as string);
    const oauth_token = params.get('oauth_token');

    return `${this.authenticateURL}?oauth_token=${oauth_token}`;
  }

  async handleCallback(oauthToken: string, oauthVerifier: string) {
    const request_data = {
      url: this.accessTokenURL,
      method: 'POST',
      data: {
        oauth_token: oauthToken,
        oauth_verifier: oauthVerifier,
      },
    };

    const headers = this.oauth.toHeader(this.oauth.authorize(request_data));
    const response = await axios.post(this.accessTokenURL, null, {
      headers,
      params: {
        oauth_token: oauthToken,
        oauth_verifier: oauthVerifier,
      },
    });

    const result = new URLSearchParams(response.data as string);
    return {
      oauth_token: result.get('oauth_token'),
      oauth_token_secret: result.get('oauth_token_secret'),
      user_id: result.get('user_id'),
      screen_name: result.get('screen_name'),
    };
  }
}
