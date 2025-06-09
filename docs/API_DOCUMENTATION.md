# Infinity AI System - API Documentation

## Overview
The Infinity AI System is a comprehensive SaaS AI-powered marketing management platform built with NestJS, Prisma, and PostgreSQL. This API provides full functionality for social media management, content creation, campaign management, CRM, analytics, team collaboration, and more.

## Authentication
All endpoints require JWT Bearer token authentication unless otherwise specified.

### Base URL
- Development: `http://localhost:3001`
- Production: Your deployed URL

### Authentication Headers
```
Authorization: Bearer <your-jwt-token>
```

## API Endpoints Overview

### 🔐 Authentication & User Management
- `POST /auth/login` - User login
- `POST /auth/register` - User registration
- `POST /auth/logout` - User logout
- `GET /auth/profile` - Get user profile
- `POST /auth/refresh` - Refresh JWT token
- `POST /auth/forgot-password` - Request password reset
- `POST /auth/reset-password` - Reset password with token

### 👤 User Management
- `GET /users` - Get all users (admin only)
- `GET /users/:id` - Get user by ID
- `PUT /users/:id` - Update user
- `DELETE /users/:id` - Delete user
- `GET /me` - Get current user profile
- `PUT /me` - Update current user profile

### 🏢 Company & Team Management
- `GET /company` - Get companies
- `POST /company` - Create company
- `GET /company/:id` - Get company by ID
- `PUT /company/:id` - Update company
- `DELETE /company/:id` - Delete company
- `POST /company/:id/members` - Add team member
- `GET /company/:id/members` - Get team members
- `PUT /company/:id/members/:userId` - Update member role
- `DELETE /company/:id/members/:userId` - Remove team member

### 📊 Project Management
- `GET /project` - Get projects
- `POST /project` - Create project
- `GET /project/:id` - Get project by ID
- `PUT /project/:id` - Update project
- `DELETE /project/:id` - Delete project
- `GET /project/:id/tasks` - Get project tasks
- `GET /project/:id/sprints` - Get project sprints
- `GET /project/:id/analytics` - Get project analytics

### 🎯 Task Management
- `GET /task` - Get tasks with filtering
- `POST /task` - Create task
- `GET /task/:id` - Get task by ID
- `PUT /task/:id` - Update task
- `DELETE /task/:id` - Delete task
- `PUT /task/:id/status` - Update task status
- `POST /task/:id/assign` - Assign task to user
- `POST /task/:id/comments` - Add comment to task
- `GET /task/:id/history` - Get task history

### 🏃‍♂️ Sprint Management
- `GET /sprint` - Get sprints
- `POST /sprint` - Create sprint
- `GET /sprint/:id` - Get sprint by ID
- `PUT /sprint/:id` - Update sprint
- `DELETE /sprint/:id` - Delete sprint
- `POST /sprint/:id/start` - Start sprint
- `POST /sprint/:id/complete` - Complete sprint
- `GET /sprint/:id/burndown` - Get sprint burndown chart

### 🤖 AI Content Generation
- `POST /ai-generator/content` - Generate AI content
- `POST /ai-generator/social-post` - Generate social media post
- `POST /ai-generator/blog-post` - Generate blog post
- `POST /ai-generator/email-campaign` - Generate email campaign
- `POST /ai-generator/ad-copy` - Generate advertisement copy
- `GET /ai-generator/templates` - Get content templates
- `POST /ai-generator/custom` - Custom AI generation

### 📱 Social Media Management
- `GET /social-accounts` - Get connected social accounts
- `POST /social-accounts/connect` - Connect social account
- `DELETE /social-accounts/:id` - Disconnect social account
- `GET /social-post` - Get social posts
- `POST /social-post` - Create social post
- `PUT /social-post/:id` - Update social post
- `DELETE /social-post/:id` - Delete social post
- `POST /social-post/:id/publish` - Publish social post
- `POST /social-post/:id/schedule` - Schedule social post

### 📅 Content Scheduling
- `GET /content-schedule` - Get scheduled content
- `POST /content-schedule` - Schedule content
- `PUT /content-schedule/:id` - Update scheduled content
- `DELETE /content-schedule/:id` - Cancel scheduled content
- `GET /content-schedule/calendar` - Get calendar view
- `POST /content-schedule/bulk` - Bulk schedule content

### 🎯 Campaign Management
- `GET /marketing-campaign` - Get campaigns
- `POST /marketing-campaign` - Create campaign
- `GET /marketing-campaign/:id` - Get campaign by ID
- `PUT /marketing-campaign/:id` - Update campaign
- `DELETE /marketing-campaign/:id` - Delete campaign
- `POST /marketing-campaign/:id/start` - Start campaign
- `POST /marketing-campaign/:id/pause` - Pause campaign
- `GET /marketing-campaign/:id/performance` - Get campaign performance

### 👥 CRM & Lead Management
- `GET /clients` - Get clients
- `POST /clients` - Create client
- `GET /clients/:id` - Get client by ID
- `PUT /clients/:id` - Update client
- `DELETE /clients/:id` - Delete client
- `GET /lead` - Get leads
- `POST /lead` - Create lead
- `PUT /lead/:id` - Update lead
- `DELETE /lead/:id` - Delete lead
- `PUT /lead/:id/status` - Update lead status

### 📈 Analytics & Reporting
- `GET /analytics/dashboard` - Get dashboard analytics
- `GET /analytics/projects` - Get project analytics
- `GET /analytics/marketing` - Get marketing analytics
- `GET /analytics/users` - Get user analytics
- `GET /analytics/revenue` - Get revenue analytics
- `GET /analytics/performance` - Get performance metrics
- `GET /analytics/reports` - Get detailed reports

### 🔔 Notifications
- `GET /notification` - Get notifications
- `PUT /notification/:id/read` - Mark notification as read
- `PUT /notification/read-all` - Mark all notifications as read
- `DELETE /notification/:id` - Delete notification
- `GET /notification/unread` - Get unread notifications count

### 💳 Subscription & Payments
- `GET /subscription` - Get user subscriptions
- `POST /subscription/create` - Create subscription
- `PUT /subscription/:id/cancel` - Cancel subscription
- `PUT /subscription/:id/upgrade` - Upgrade subscription
- `GET /subscription/plans` - Get available plans
- `GET /payments` - Get payment history
- `POST /payments/webhook` - Payment webhook (Paddle)

### 🎁 Points & Rewards
- `GET /user-point` - Get user points
- `GET /user-point/history` - Get points history
- `POST /user-point/redeem` - Redeem points
- `GET /reward-redemption` - Get redemption history
- `GET /award` - Get available awards

### 🤝 Affiliate Program
- `GET /affiliate` - Get affiliate data
- `POST /affiliate/register` - Register as affiliate
- `GET /affiliate/stats` - Get affiliate statistics
- `GET /affiliate/commissions` - Get commission history
- `POST /affiliate/withdraw` - Request withdrawal

### ⚙️ AI Provider Configuration
- `GET /aiprovider-config` - Get AI provider configs
- `POST /aiprovider-config` - Add AI provider
- `PUT /aiprovider-config/:id` - Update AI provider
- `DELETE /aiprovider-config/:id` - Remove AI provider
- `POST /aiprovider-config/:id/test` - Test AI provider connection

### 🔧 System Configuration
- `GET /role` - Get user roles
- `POST /role` - Create role
- `PUT /role/:id` - Update role
- `DELETE /role/:id` - Delete role
- `GET /categories` - Get categories
- `POST /categories` - Create category
- `GET /tags` - Get tags
- `POST /tags` - Create tag

## Data Models

### User
```typescript
{
  id: string
  name: string
  email: string
  phone?: string
  image?: string
  userType: 'PERSONAL' | 'BUSINESS' | 'AGENCY'
  isActive: boolean
  isVerified: boolean
  createdAt: Date
  updatedAt: Date
}
```

### Company
```typescript
{
  id: string
  name: string
  type: 'STARTUP' | 'SME' | 'ENTERPRISE' | 'AGENCY'
  website?: string
  phone?: string
  address?: string
  industry?: string
  size?: string
  ownerId: string
  createdAt: Date
  updatedAt: Date
}
```

### Project
```typescript
{
  id: string
  name: string
  description?: string
  status: 'active' | 'completed' | 'cancelled' | 'on_hold'
  type: 'internal' | 'external' | 'personal'
  priority: number
  startDate: Date
  endDate: Date
  budget?: number
  currency: string
  clientId?: string
  companyId: string
  createdBy: string
  createdAt: Date
  updatedAt: Date
}
```

### Task
```typescript
{
  id: string
  title: string
  description?: string
  status: 'TODO' | 'IN_PROGRESS' | 'REVIEW' | 'DONE'
  priority: number
  projectId: string
  sprintId?: string
  assignedTo?: string
  startDate?: Date
  dueDate?: Date
  tags?: string
  createdBy: string
  createdAt: Date
  updatedAt: Date
}
```

### Campaign
```typescript
{
  id: string
  name: string
  description?: string
  type: 'EMAIL' | 'SOCIAL' | 'DISPLAY' | 'SEARCH' | 'VIDEO'
  status: 'draft' | 'active' | 'paused' | 'completed'
  budget?: number
  startDate?: Date
  endDate?: Date
  targetAudience?: string
  objectives?: string
  companyId: string
  createdBy: string
  createdAt: Date
  updatedAt: Date
}
```

## Error Responses

### Standard Error Format
```typescript
{
  statusCode: number
  message: string | string[]
  error: string
  timestamp: string
  path: string
}
```

### Common HTTP Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `409` - Conflict
- `422` - Unprocessable Entity
- `500` - Internal Server Error

## Permissions & Access Control

### Role-Based Permissions
The system uses fine-grained permissions based on user roles:

#### Company Owner Permissions
- Full access to company data
- Manage team members
- Access all projects and tasks
- Billing and subscription management

#### Admin Permissions
- Manage company settings
- Create/edit projects
- Assign tasks
- View analytics
- Manage campaigns

#### Manager Permissions
- View company projects
- Create/edit tasks
- Assign team members
- View team analytics

#### Member Permissions
- View assigned projects
- Update own tasks
- View limited analytics
- Submit time entries

#### Client Permissions
- View designated projects
- Submit feedback
- View project progress

### API Access Control
Each endpoint is protected with:
1. JWT Authentication
2. Role-based permissions
3. Resource ownership validation
4. Company membership verification

## Rate Limiting
- General API: 100 requests per minute
- AI Generation: 50 requests per hour
- File uploads: 10 requests per minute
- Webhooks: No limit

## File Upload
### Supported Endpoints
- `POST /file-upload/image` - Upload images
- `POST /file-upload/document` - Upload documents
- `POST /file-upload/avatar` - Upload user avatar

### File Restrictions
- Max file size: 10MB
- Supported formats: JPG, PNG, PDF, DOCX
- Images are automatically optimized

## Webhooks
### Paddle Payment Webhooks
- `POST /payments/webhook` - Handles payment events
- Supported events: subscription_created, subscription_updated, payment_succeeded

## SDK & Integration Examples

### JavaScript/TypeScript Example
```typescript
const apiClient = axios.create({
  baseURL: 'http://localhost:3001',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
});

// Get projects
const projects = await apiClient.get('/project');

// Create task
const newTask = await apiClient.post('/task', {
  title: 'New Task',
  description: 'Task description',
  projectId: 'project-id',
  priority: 2
});
```

### cURL Example
```bash
# Login
curl -X POST http://localhost:3001/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "password"}'

# Get projects
curl -X GET http://localhost:3001/project \
  -H "Authorization: Bearer your-jwt-token"
```

## Support & Resources
- API Documentation (Swagger): `/docs`
- Support Email: support@infinityai.com
- GitHub Repository: [Repository URL]
- Status Page: [Status URL]

## Changelog
### v1.0.0 (Current)
- Initial API release
- Full CRUD operations for all entities
- JWT authentication
- Role-based permissions
- AI content generation
- Social media integration
- Analytics and reporting
- Subscription management
- Real-time notifications

---

**Last Updated**: December 2024
**API Version**: 1.0.0
