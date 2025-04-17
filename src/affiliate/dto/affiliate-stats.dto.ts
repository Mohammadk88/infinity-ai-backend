import { ApiProperty } from '@nestjs/swagger';

export class AffiliateStatsDto {
  @ApiProperty({
    description: 'Referral code for the user / كود الإحالة الخاص بالمستخدم',
    example: 'XZY123',
  })
  referralCode!: string;

  @ApiProperty({
    description:
      'Total number of referred users / عدد المستخدمين الذين تم إحالتهم',
    example: 15,
  })
  totalReferrals!: number;

  @ApiProperty({
    description:
      'Total earned commissions / إجمالي الأرباح الناتجة عن الإحالات',
    example: 120.5,
  })
  totalEarnings!: number;

  @ApiProperty({
    description: 'Approved referrals / عدد الإحالات التي تم اعتمادها',
    example: 10,
  })
  totalApprovedReferrals!: number;

  @ApiProperty({
    description: 'Pending referrals / عدد الإحالات المعلقة',
    example: 3,
  })
  totalPendingReferrals!: number;

  @ApiProperty({
    description: 'Rejected referrals / عدد الإحالات المرفوضة',
    example: 2,
  })
  totalRejectedReferrals!: number;

  @ApiProperty({
    description: 'Approved earnings / الأرباح المعتمدة فقط',
    example: 80.25,
  })
  totalApprovedEarnings!: number;

  @ApiProperty({
    description: 'Affiliate tier or rank / رتبة أو تصنيف المستخدم كمسوّق',
    example: 'Gold',
    required: false,
  })
  tier?: string;
  @ApiProperty({
    description: 'Affiliate tier or rank / رتبة أو تصنيف المستخدم كمسوّق',
    example: 'Gold',
    required: false,
  })
  status!: string;
}
