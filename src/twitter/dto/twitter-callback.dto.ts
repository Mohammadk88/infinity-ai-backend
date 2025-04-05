import { IsString } from 'class-validator';

export class TwitterCallbackDto {
  @IsString()
  oauth_token!: string;

  @IsString()
  oauth_verifier!: string;
}
