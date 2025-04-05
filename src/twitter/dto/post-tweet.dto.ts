import { IsString } from 'class-validator';

export class PostTweetDto {
  @IsString()
  accessToken!: string;

  @IsString()
  accessTokenSecret!: string;

  @IsString()
  status!: string;
}
