// src/company-members/dto/update-company-member-role.dto.ts
import { IsUUID } from 'class-validator';

export class UpdateCompanyMemberRoleDto {
  @IsUUID()
  roleId!: string;
}
