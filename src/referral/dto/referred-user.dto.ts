import { ApiProperty } from '@nestjs/swagger';

export class ReferredUserDto {
  @ApiProperty() id!: string;
  @ApiProperty() email!: string;
  @ApiProperty() fullName!: string;
}

export class ReferralResponseDto {
  @ApiProperty() id!: string;
  @ApiProperty() earnings!: number;
  @ApiProperty() status!: string;
  @ApiProperty() referredAt!: string;

  @ApiProperty({ type: () => ReferredUserDto })
  referredUser!: ReferredUserDto;
}
