import { SetMetadata } from '@nestjs/common';

export interface RequiredPermission {
  resource: string;
  action: string;
  companyId?: string;
  projectId?: string;
}

export const RequirePermissions = (...permissions: RequiredPermission[]) =>
  SetMetadata('permissions', permissions);

// Common permission constants
export const PERMISSIONS = {
  // Project permissions
  PROJECT_CREATE: { resource: 'project', action: 'create' },
  PROJECT_READ: { resource: 'project', action: 'read' },
  PROJECT_UPDATE: { resource: 'project', action: 'update' },
  PROJECT_DELETE: { resource: 'project', action: 'delete' },
  PROJECT_MANAGE: { resource: 'project', action: 'manage' },

  // Task permissions
  TASK_CREATE: { resource: 'task', action: 'create' },
  TASK_READ: { resource: 'task', action: 'read' },
  TASK_UPDATE: { resource: 'task', action: 'update' },
  TASK_DELETE: { resource: 'task', action: 'delete' },
  TASK_ASSIGN: { resource: 'task', action: 'assign' },

  // Sprint permissions
  SPRINT_CREATE: { resource: 'sprint', action: 'create' },
  SPRINT_READ: { resource: 'sprint', action: 'read' },
  SPRINT_UPDATE: { resource: 'sprint', action: 'update' },
  SPRINT_DELETE: { resource: 'sprint', action: 'delete' },

  // Client permissions
  CLIENT_CREATE: { resource: 'client', action: 'create' },
  CLIENT_READ: { resource: 'client', action: 'read' },
  CLIENT_UPDATE: { resource: 'client', action: 'update' },
  CLIENT_DELETE: { resource: 'client', action: 'delete' },

  // Lead permissions
  LEAD_CREATE: { resource: 'lead', action: 'create' },
  LEAD_READ: { resource: 'lead', action: 'read' },
  LEAD_UPDATE: { resource: 'lead', action: 'update' },
  LEAD_DELETE: { resource: 'lead', action: 'delete' },

  // Campaign permissions
  CAMPAIGN_CREATE: { resource: 'campaign', action: 'create' },
  CAMPAIGN_READ: { resource: 'campaign', action: 'read' },
  CAMPAIGN_UPDATE: { resource: 'campaign', action: 'update' },
  CAMPAIGN_DELETE: { resource: 'campaign', action: 'delete' },

  // Content permissions
  CONTENT_CREATE: { resource: 'content', action: 'create' },
  CONTENT_READ: { resource: 'content', action: 'read' },
  CONTENT_UPDATE: { resource: 'content', action: 'update' },
  CONTENT_DELETE: { resource: 'content', action: 'delete' },
  CONTENT_PUBLISH: { resource: 'content', action: 'publish' },

  // Analytics permissions
  ANALYTICS_READ: { resource: 'analytics', action: 'read' },
  ANALYTICS_EXPORT: { resource: 'analytics', action: 'export' },

  // Company permissions
  COMPANY_MANAGE: { resource: 'company', action: 'manage' },
  COMPANY_INVITE: { resource: 'company', action: 'invite' },
  COMPANY_REMOVE_MEMBER: { resource: 'company', action: 'remove-member' },

  // Settings permissions
  SETTINGS_READ: { resource: 'settings', action: 'read' },
  SETTINGS_UPDATE: { resource: 'settings', action: 'update' },

  // Billing permissions
  BILLING_READ: { resource: 'billing', action: 'read' },
  BILLING_MANAGE: { resource: 'billing', action: 'manage' },
} as const;
