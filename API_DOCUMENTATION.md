# Infinity AI System - Complete API Documentation

## Overview

The Infinity AI System is a comprehensive SaaS AI-powered marketing management platform built with NestJS, Prisma, and PostgreSQL. This system provides a complete solution for agencies, companies, and individual marketers to manage their social media presence, content creation, campaigns, projects, teams, and analytics.

## System Architecture

### Core Technologies
- **Backend**: NestJS with TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT with role-based permissions
- **Documentation**: Swagger/OpenAPI
- **File Storage**: Local file system with configurable paths
- **Caching**: Redis integration
- **Scheduling**: NestJS Schedule module for automated tasks

### Security Features
- JWT Authentication with Bearer tokens
- Role-based access control (RBAC)
- Fine-grained permissions system
- CSRF protection
- Rate limiting (ThrottlerGuard)
- Helmet security headers
- Input validation with class-validator

## API Endpoints Overview

### Authentication & Authorization (`/auth`)
- `POST /auth/login` - User login
- `POST /auth/register` - User registration
- `POST /auth/refresh` - Token refresh
- `POST /auth/logout` - User logout
- `GET /auth/profile` - Get current user profile

### User Management (`/users`)
- Full CRUD operations for user management
- User profile management
- Password reset functionality

### Company & Team Management
#### Companies (`/company`)
- `GET /company` - List all companies
- `POST /company` - Create new company
- `GET /company/:id` - Get company details
- `PATCH /company/:id` - Update company
- `DELETE /company/:id` - Delete company

#### Company Members (`/company-member`)
- `GET /company-member` - List company members
- `POST /company-member` - Add member to company
- `PATCH /company-member/:id` - Update member role
- `DELETE /company-member/:id` - Remove member

#### Roles & Permissions (`/role`)
- Dynamic role management
- Permission-based access control
- Company-specific role assignments

### Project Management
#### Projects (`/projects`)
- `GET /projects` - List all projects (with filtering)
- `POST /projects` - Create new project
- `GET /projects/:id` - Get project details
- `PATCH /projects/:id` - Update project
- `DELETE /projects/:id` - Delete project
- `GET /projects/:id/tasks` - Get project tasks
- `GET /projects/:id/sprints` - Get project sprints

#### Tasks (`/tasks`)
- `GET /tasks` - List all tasks (with filtering)
- `POST /tasks` - Create new task
- `GET /tasks/:id` - Get task details
- `PATCH /tasks/:id` - Update task
- `DELETE /tasks/:id` - Delete task
- `PATCH /tasks/:id/status` - Update task status
- `POST /tasks/:id/assign` - Assign task to user

#### Sprints (`/sprints`)
- `GET /sprints` - List all sprints
- `POST /sprints` - Create new sprint
- `GET /sprints/:id` - Get sprint details
- `PATCH /sprints/:id` - Update sprint
- `DELETE /sprints/:id` - Delete sprint
- `POST /sprints/:id/start` - Start sprint
- `POST /sprints/:id/complete` - Complete sprint

### Social Media Management
#### Social Accounts (`/social-accounts`)
- Connect and manage multiple social media accounts
- Support for Twitter, Facebook, Instagram, LinkedIn
- OAuth integration for secure account linking

#### Social Posts (`/social-post`)
- Create, schedule, and publish social media posts
- Multi-platform posting capabilities
- Post performance tracking

#### Content Scheduling (`/content-schedule`)
- Schedule posts across multiple platforms
- Recurring post scheduling
- Content calendar management

### AI-Powered Features
#### AI Generator (`/ai-generator`)
- AI-powered content generation
- Multiple AI provider support
- Content optimization suggestions

#### AI Provider Configuration (`/aiprovider-config`)
- Manage AI service providers
- API key management
- Provider usage limits and monitoring

### Marketing Campaigns
#### Campaigns (`/marketing-campaign`)
- Create and manage marketing campaigns
- Campaign performance tracking
- ROI analysis

#### Campaign Posts (`/campaign-post`)
- Manage campaign-specific content
- Post scheduling within campaigns

#### Campaign Performance (`/campaign-performance`)
- Detailed campaign analytics
- Performance metrics and KPIs

### Client & Lead Management
#### Clients (`/clients`)
- Complete client relationship management
- Client project associations
- Communication history

#### Leads (`/lead`)
- Lead capture and management
- Lead scoring and qualification
- Pipeline management

#### Pipeline Stages (`/pipeline-stage`)
- Customizable sales pipeline
- Stage-based lead tracking

### Analytics & Reporting (`/analytics`)
- `GET /analytics/dashboard/:companyId` - Company dashboard analytics
- `GET /analytics/project/:projectId` - Project-specific analytics
- `GET /analytics/marketing/:companyId` - Marketing campaign analytics
- `GET /analytics/user` - User personal analytics

### Notifications (`/notifications`)
- `GET /notifications/user/:userId` - Get user notifications
- `GET /notifications/user/:userId/unread` - Get unread notifications
- `POST /notifications` - Create notification
- `PATCH /notifications/:id/read` - Mark as read
- `DELETE /notifications/:id` - Delete notification

### Points & Rewards System
#### User Points (`/user-point`)
- Point balance management
- Point transaction history

#### Point Events (`/point-event`)
- Point earning/spending events
- Event tracking and history

#### Awards (`/award`)
- Achievement system
- Badge and reward management

#### Reward Redemption (`/reward-redemption`)
- Point redemption system
- Reward catalog management

### Subscription & Billing
#### Subscription Plans (`/subscription-plan`)
- Manage subscription tiers
- Feature limitations per plan

#### Subscriptions (`/subscription`)
- User subscription management
- Billing cycle management

#### Payments (`/payments`)
- Payment processing integration
- Payment history and invoicing

### Affiliate Program
#### Affiliates (`/affiliate`)
- Affiliate partner management
- Commission tracking

#### Referrals (`/referral`)
- Referral link generation
- Referral tracking and rewards

#### Commissions (`/commission`)
- Commission calculation and payment

### Content Management
#### Web Content (`/web-content`)
- Website content management
- SEO optimization features

#### Categories & Tags
- Content categorization system
- Tag-based content organization

### File Management (`/file-upload`)
- Secure file upload handling
- Image and document management
- File access control

### Communication
#### Mail (`/mail`)
- Email template management
- Automated email campaigns

#### Invitations (`/invitation`)
- Team member invitations
- Client invitation system

### System Management
#### Usage Limits (`/usage-limit`)
- API usage monitoring
- Rate limiting configuration

#### Countries (`/country`)
- Geographic data management
- Localization support

## Authentication Flow

1. **Registration**: User creates account with email/password
2. **Login**: Returns JWT access token and refresh token
3. **Authorization**: All protected routes require Bearer token
4. **Token Refresh**: Automatic token renewal system
5. **Logout**: Token invalidation

## Permission System

The system implements a comprehensive permission-based access control:

### Permission Types
- `create:project` - Create new projects
- `read:project` - View project details
- `update:project` - Modify project information
- `delete:project` - Remove projects
- `manage:team` - Team management permissions
- `view:analytics` - Access to analytics data
- `manage:campaigns` - Campaign management
- `manage:clients` - Client relationship management

### Role Hierarchy
- **Super Admin**: Full system access
- **Company Admin**: Company-wide management
- **Project Manager**: Project-specific management
- **Team Member**: Limited project access
- **Client**: Read-only access to assigned projects

## Data Models & Relationships

### Core Entities
- **User**: System users with authentication
- **Company**: Organization/agency entities
- **Project**: Individual project management
- **Task**: Granular work items
- **Client**: Customer management
- **Campaign**: Marketing campaign entities

### Key Relationships
- Users belong to Companies through CompanyMember
- Projects belong to Companies and have assigned Users
- Tasks belong to Projects and can be assigned to Users
- Campaigns belong to Companies and can be linked to Projects
- Social posts can be part of Campaigns

## Error Handling

The API uses standard HTTP status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `422` - Validation Error
- `500` - Internal Server Error

## Rate Limiting

- Short-term rate limit: 10 requests per minute per IP
- Configurable through ThrottlerModule
- Different limits for different endpoint types

## Development Setup

1. **Environment Configuration**:
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/infinity_ai"
   JWT_SECRET="your-jwt-secret"
   PORT=4040
   NODE_ENV="development"
   ```

2. **Database Setup**:
   ```bash
   npx prisma migrate dev
   npx prisma generate
   npx prisma seed
   ```

3. **Start Development Server**:
   ```bash
   npm run start:dev
   ```

4. **Access API Documentation**:
   - Swagger UI: `http://localhost:4040/docs`

## Production Deployment

1. **Build Application**:
   ```bash
   npm run build
   ```

2. **Run Migrations**:
   ```bash
   npx prisma migrate deploy
   ```

3. **Start Production Server**:
   ```bash
   npm run start:prod
   ```

## Advanced Features

### Smart Notifications
- Real-time notification system
- Context-aware notifications based on user activity
- Email and in-app notification delivery

### Advanced Analytics
- Company performance dashboards
- Project progress tracking
- Marketing campaign ROI analysis
- User engagement metrics

### AI Integration
- Content generation assistance
- Performance optimization suggestions
- Automated social media posting

### Multi-tenant Architecture
- Company-based data isolation
- Scalable resource allocation
- Per-company customization options

## Security Considerations

1. **Data Protection**: All sensitive data encrypted at rest
2. **API Security**: Rate limiting and input validation
3. **Authentication**: Secure JWT implementation
4. **Authorization**: Fine-grained permission system
5. **File Upload**: Secure file handling with validation
6. **CORS**: Properly configured cross-origin policies

## Monitoring & Logging

- Comprehensive error logging
- Performance monitoring
- Usage analytics
- Security event logging

## Support & Maintenance

- Automated database backups
- Health check endpoints
- Performance optimization
- Regular security updates

This documentation provides a comprehensive overview of the Infinity AI System's capabilities and implementation details. For specific endpoint details, refer to the Swagger documentation available at `/docs` when running the application.
