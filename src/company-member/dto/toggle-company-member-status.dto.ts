// src/company-members/dto/toggle-company-member-status.dto.ts
import { IsBoolean } from 'class-validator';

export class ToggleCompanyMemberStatusDto {
  @IsBoolean()
  isActive!: boolean;
}
