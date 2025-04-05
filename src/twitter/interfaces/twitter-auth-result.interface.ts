export interface TwitterAuthResult {
  oauth_token: string;
  oauth_token_secret: string;
  user_id: string;
  screen_name: string;
}

export interface TwitterTweetResponse {
  id: string;
  text: string;
  created_at: string;
}
