# Infinity AI System - Backend

<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

## Table of Contents

- [Overview](#overview)
- [Installation and Setup](#installation-and-setup)
- [Project Structure](#project-structure)
- [Component Details](#component-details)
- [Extending the Project](#extending-the-project)
- [Contribution Guidelines](#contribution-guidelines)
- [License Information](#license-information)

## Overview

Infinity AI System is a comprehensive AI-powered platform that integrates social media management capabilities with content creation and business management features. The system serves as a unified dashboard for businesses to manage their online presence, automate content creation, schedule posts, track analytics, and monetize services.

### Core Features

- **AI-Powered Content Generation**: Generate optimized content for various social media platforms.
- **Multi-Platform Social Media Integration**: Connect and publish to Facebook, Instagram, Twitter, LinkedIn, and others.
- **Content Management System**: Create, store, organize, and manage web content and social posts.
- **Automated Publishing**: Schedule posts for optimal engagement times across platforms.
- **Analytics & Performance Tracking**: Monitor and analyze content performance metrics.
- **Subscription Management**: Tiered subscription plans with different feature sets.
- **Affiliate & Referral System**: Track and reward referrals with commission management.
- **Business Management**: Company, client, and team member organization.
- **Project & Task Management**: Track and manage projects with sprints and tasks.

### Target Users

- **Digital Marketing Agencies**
- **Content Creators**
- **Social Media Managers**
- **Small to Medium Businesses**
- **Freelancers**

## Installation and Setup

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- PostgreSQL database

### Environment Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/infinity-ai-backend.git
   cd infinity-ai-backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory with the following variables:
   ```
   DATABASE_URL="postgresql://username:password@localhost:5432/infinity_ai_db"
   JWT_SECRET="your-jwt-secret"
   JWT_EXPIRES_IN="1d"
   ```

4. Run database migrations:
   ```bash
   npx prisma migrate dev
   ```

5. Seed the database:
   ```bash
   npx prisma db seed
   ```

### Running the Application

```bash
# development
npm run start

# watch mode
npm run start:dev

# production mode
npm run start:prod
```

### Testing

```bash
# unit tests
npm run test

# e2e tests
npm run test:e2e

# test coverage
npm run test:cov
```

## Project Structure

The backend follows a modular architecture pattern using NestJS framework:

### Root Directory Structure

- `src/` - Source code of the application
- `prisma/` - Prisma ORM schema and migrations
- `docs/` - Documentation files
- `test/` - End-to-end and integration tests

### Core Directories

#### `src/`

- **api-modules/** - Core business domain modules
- **common/** - Shared utilities, decorators, and interfaces
- **prisma/** - Prisma service and utilities
- **lib/** - Integration libraries and external services
- **app.module.ts** - Main application module
- **main.ts** - Application entry point

### Database Schema

The database uses PostgreSQL with Prisma ORM. Key models include:

- **User** - User accounts and authentication
- **Company** - Business entities that use the platform
- **Client** - Customers of companies using the platform
- **SocialAccount** - Connected social media accounts
- **SocialPost** - Content for social media platforms
- **WebContent** - Web-based content (blogs, landing pages)
- **AIProviderConfig** - AI service provider connections
- **Subscription/SubscriptionPlan** - Payment and access tiers
- **MarketingCampaign** - Organized marketing initiatives
- **Task/Project/Sprint** - Project management structure

## Component Details

### Authentication (`src/auth/`)

**Purpose**: Manages user authentication, authorization, and security.

**Key Components**:
- JWT-based authentication strategy
- Role-based access control (RBAC)
- OAuth integration with social platforms

**Extension Points**:
- Additional OAuth providers in `src/auth/strategies/`
- Enhanced permissions in `src/auth/guards/roles.guard.ts`

### Social Media Integration (`src/lib/social-providers/`)

**Purpose**: Connects to and manages interactions with social media platforms.

**Key Components**:
- Platform-specific authentication (OAuth)
- Content publishing interfaces
- API client wrappers

**Extension Points**:
- New platforms in `src/lib/social-providers/`
- Enhanced content types in platform-specific services

### AI Generation (`src/ai-generator/`)

**Purpose**: Provides AI-powered content creation capabilities.

**Key Components**:
- Multiple AI provider support (OpenAI, Anthropic, Gemini)
- Content prompts and templates
- Result processing and formatting

**Extension Points**:
- Additional AI providers in `src/ai-generator/ai-generator.service.ts`
- New content generation templates in `src/ai-generator/templates/`

### Content Management (`src/web-content/` and `src/social-post/`)

**Purpose**: Manages content creation, storage, and organization.

**Key Components**:
- Web content (blogs, landing pages)
- Social media posts
- Categories and tags for organization

**Extension Points**:
- New content types in respective modules
- Enhanced metadata in DTOs

### Content Scheduling (`src/content-schedule/` and `src/content-scheduler/`)

**Purpose**: Schedules content for automated publishing.

**Key Components**:
- Scheduling logic for optimized posting times
- Recurring post patterns
- Cron job management

**Extension Points**:
- Advanced scheduling algorithms in scheduler service
- Platform-specific timing optimizations

### Campaign Management (`src/marketing-campaign/`)

**Purpose**: Organizes marketing content into cohesive campaigns.

**Key Components**:
- Campaign creation and management
- Campaign performance tracking
- Post association and organization

**Extension Points**:
- Campaign templates in campaign service
- Advanced analytics in campaign-performance module

### Subscription System (`src/subscription/` and `src/subscription-plan/`)

**Purpose**: Manages access tiers, billing, and feature availability.

**Key Components**:
- Subscription plans and pricing
- Feature access control
- Subscription lifecycle management

**Extension Points**:
- Payment gateway integrations
- Feature flag system in subscription service

### Affiliate System (`src/affiliate/` and `src/referral/`)

**Purpose**: Tracks and rewards user referrals and affiliate activities.

**Key Components**:
- Referral tracking
- Commission calculation
- Affiliate tier management

**Extension Points**:
- Advanced commission models in commission service
- Marketing materials for affiliates

### Business Management (`src/company/` and `src/client/`)

**Purpose**: Manages company and client relationships and data.

**Key Components**:
- Company profiles and settings
- Client management
- Team member organization

**Extension Points**:
- Advanced organizational structures
- Client portal features

### Project Management (`src/project/` `src/task/` and `src/sprint/`)

**Purpose**: Facilitates project organization, task tracking, and team collaboration.

**Key Components**:
- Project creation and management
- Task assignment and status tracking
- Sprint planning and organization

**Extension Points**:
- Advanced workflow customization
- Additional task templates and types

## Extending the Project

### Adding New Features

1. **Create a New Module**:
   ```bash
   nest generate module feature-name
   nest generate controller feature-name
   nest generate service feature-name
   ```

2. **Update Database Schema**:
   Add models to `prisma/schema.prisma` and run:
   ```bash
   npx prisma migrate dev --name feature-name
   ```

3. **Add to App Module**:
   Import and add your module to `src/app.module.ts`

### Integration Patterns

#### Adding a New Social Media Platform

1. Create a new folder in `src/lib/social-providers/`
2. Implement the provider using the existing interfaces
3. Update the social-providers module to include the new platform

#### Adding an AI Provider

1. Add the provider's client library:
   ```bash
   npm install your-ai-provider-sdk
   ```
2. Add provider implementation to the `callAIProvider` method in `src/ai-generator/ai-generator.service.ts`

## Contribution Guidelines

### Code Style

- Follow NestJS style guidelines
- Use TypeScript's strict mode
- Document all public-facing interfaces and methods

### Commit Messages

Follow the conventional commit format:
```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

Example: `feat(social-providers): add TikTok integration`

### Pull Request Process

1. Create a branch from `develop` with a descriptive name
2. Make your changes with appropriate tests
3. Submit a PR against the `develop` branch
4. Address any review comments

## License Information

This project is [MIT licensed](LICENSE).

---

Built with [NestJS](https://nestjs.com/) • Powered by TypeScript
