# Infinity AI System - API Documentation

**Total Endpoints:** 214
**Generated:** 6/9/2025, 11:24:12 PM

## App.controller.ts Module

### GET /
**Handler:** getHello
**File:** app.controller.ts

## Commission Module

### GET /affiliate/commissions
**Handler:** ApiOperation
**File:** commission/commission.controller.ts

### POST /affiliate/commissions
**Description:** Get user commissions
**Handler:** UseGuards
**File:** commission/commission.controller.ts

## Affiliate Module

### GET /affiliate/me
**Handler:** ApiOkResponse
**File:** affiliate/affiliate.controller.ts

### POST /affiliate/request
**Description:** Get current user affiliate info
**Handler:** ApiOperation
**File:** affiliate/affiliate.controller.ts

## Referral Module

### GET /affiliate/referrals
**Handler:** ApiOkResponse
**File:** referral/referral.controller.ts

### GET /affiliate/referrals/earnings
**Handler:** getEarningsSummary
**File:** referral/referral.controller.ts

## Ai-generator Module

### POST /ai-generator/generate
**Handler:** UseGuards
**File:** ai-generator/ai-generator.controller.ts

## Aiprovider-config Module

### GET /ai-provider-config
**Handler:** findAll
**File:** aiprovider-config/aiprovider-config.controller.ts

### POST /ai-provider-config
**Handler:** create
**File:** aiprovider-config/aiprovider-config.controller.ts

### DELETE /ai-provider-config/:id
**Handler:** remove
**File:** aiprovider-config/aiprovider-config.controller.ts

### GET /ai-provider-config/:id
**Handler:** findOne
**File:** aiprovider-config/aiprovider-config.controller.ts

### PATCH /ai-provider-config/:id
**Handler:** update
**File:** aiprovider-config/aiprovider-config.controller.ts

### GET /ai-provider-config/active
**Handler:** getActiveProvider
**File:** aiprovider-config/aiprovider-config.controller.ts

## Analytics Module

### GET /analytics/dashboard/:companyId
**Handler:** ApiOperation
**File:** analytics/analytics.controller.ts

### GET /analytics/marketing/:companyId
**Description:** Get company dashboard analytics
**Handler:** ApiOperation
**File:** analytics/analytics.controller.ts

### GET /analytics/project/:projectId
**Description:** Get company dashboard analytics
**Handler:** ApiOperation
**File:** analytics/analytics.controller.ts

### GET /analytics/user
**Description:** Get company dashboard analytics
**Handler:** ApiOperation
**File:** analytics/analytics.controller.ts

## Auth Module

### GET /auth/csrf-token
**Description:** Register a new company with owner
**Handler:** getCsrfToken
**File:** auth/auth.controller.ts

### POST /auth/login
**Description:** Register a new company with owner
**Handler:** login
**File:** auth/auth.controller.ts

### POST /auth/logout
**Description:** Register a new company with owner
**Handler:** logout
**File:** auth/auth.controller.ts

### GET /auth/me
**Description:** Register a new company with owner
**Handler:** UseGuards
**File:** auth/auth.controller.ts

### POST /auth/register
**Handler:** register
**File:** auth/auth.controller.ts

### POST /auth/register-company
**Handler:** HttpCode
**File:** auth/auth.controller.ts

### POST /auth/register-from-invitation
**Description:** Register a new company with owner
**Handler:** ApiOperation
**File:** auth/auth.controller.ts

## Award Module

### GET /awards
**Description:** Create a new award
**Handler:** ApiOperation
**File:** award/award.controller.ts

### POST /awards
**Handler:** ApiOperation
**File:** award/award.controller.ts

### DELETE /awards/:id
**Description:** Create a new award
**Handler:** ApiOperation
**File:** award/award.controller.ts

### GET /awards/:id
**Description:** Create a new award
**Handler:** ApiOperation
**File:** award/award.controller.ts

### PATCH /awards/:id
**Description:** Create a new award
**Handler:** ApiOperation
**File:** award/award.controller.ts

### GET /awards/points
**Description:** Create a new award
**Handler:** getUserPoints
**File:** award/award.controller.ts

### GET /awards/points/history
**Description:** Create a new award
**Handler:** getUserPointHistory
**File:** award/award.controller.ts

### POST /awards/rewards/redeem
**Description:** Create a new award
**Handler:** redeemAward
**File:** award/award.controller.ts

### GET /awards/rewards/redemptions
**Description:** Create a new award
**Handler:** getUserRedemptions
**File:** award/award.controller.ts

## Campaign-performance Module

### GET /campaign-performance
**Description:** Create performance metric
**Handler:** ApiOperation
**File:** campaign-performance/campaign-performance.controller.ts

### POST /campaign-performance
**Handler:** ApiOperation
**File:** campaign-performance/campaign-performance.controller.ts

### DELETE /campaign-performance/:id
**Description:** Create performance metric
**Handler:** ApiOperation
**File:** campaign-performance/campaign-performance.controller.ts

### GET /campaign-performance/:id
**Description:** Create performance metric
**Handler:** ApiOperation
**File:** campaign-performance/campaign-performance.controller.ts

### PATCH /campaign-performance/:id
**Description:** Create performance metric
**Handler:** ApiOperation
**File:** campaign-performance/campaign-performance.controller.ts

## Campaign-post Module

### GET /campaign-posts
**Description:** Create a campaign post
**Handler:** ApiOperation
**File:** campaign-post/campaign-post.controller.ts

### POST /campaign-posts
**Handler:** ApiOperation
**File:** campaign-post/campaign-post.controller.ts

### DELETE /campaign-posts/:id
**Description:** Create a campaign post
**Handler:** ApiOperation
**File:** campaign-post/campaign-post.controller.ts

### GET /campaign-posts/:id
**Description:** Create a campaign post
**Handler:** ApiOperation
**File:** campaign-post/campaign-post.controller.ts

### PATCH /campaign-posts/:id
**Description:** Create a campaign post
**Handler:** ApiOperation
**File:** campaign-post/campaign-post.controller.ts

## Categories Module

### GET /categories
**Description:** Create new category
**Handler:** ApiOperation
**File:** categories/categories.controller.ts

### POST /categories
**Handler:** ApiOperation
**File:** categories/categories.controller.ts

### DELETE /categories/:id
**Description:** Create new category
**Handler:** ApiOperation
**File:** categories/categories.controller.ts

### GET /categories/:id
**Description:** Create new category
**Handler:** ApiOperation
**File:** categories/categories.controller.ts

### PATCH /categories/:id
**Description:** Create new category
**Handler:** ApiOperation
**File:** categories/categories.controller.ts

## Client-note Module

### POST /client-notes
**Handler:** ApiOperation
**File:** client-note/client-note.controller.ts

### DELETE /client-notes/:id
**Description:** إضافة ملاحظة جديدة لعميل
**Handler:** ApiOperation
**File:** client-note/client-note.controller.ts

### GET /client-notes/:id
**Description:** إضافة ملاحظة جديدة لعميل
**Handler:** ApiOperation
**File:** client-note/client-note.controller.ts

### PATCH /client-notes/:id
**Description:** إضافة ملاحظة جديدة لعميل
**Handler:** ApiOperation
**File:** client-note/client-note.controller.ts

### GET /client-notes/client/:clientId
**Description:** إضافة ملاحظة جديدة لعميل
**Handler:** ApiOperation
**File:** client-note/client-note.controller.ts

## Clients Module

### GET /clients
**Description:** إنشاء عميل جديد
**Handler:** ApiOperation
**File:** clients/clients.controller.ts

### POST /clients
**Handler:** ApiOperation
**File:** clients/clients.controller.ts

### DELETE /clients/:id
**Description:** إنشاء عميل جديد
**Handler:** ApiOperation
**File:** clients/clients.controller.ts

### GET /clients/:id
**Description:** إنشاء عميل جديد
**Handler:** ApiOperation
**File:** clients/clients.controller.ts

### PATCH /clients/:id
**Description:** إنشاء عميل جديد
**Handler:** ApiOperation
**File:** clients/clients.controller.ts

### PATCH /clients/:id/assign-subscription
**Description:** إنشاء عميل جديد
**Handler:** ApiOperation
**File:** clients/clients.controller.ts

## Company Module

### GET /companies/:id
**Handler:** ApiOperation
**File:** company/company.controller.ts

### PUT /companies/:id
**Description:** Get company by ID including settings
**Handler:** HttpCode
**File:** company/company.controller.ts

## Company-setting Module

### GET /companies/:id/setting
**Handler:** HttpCode
**File:** company-setting/company-setting.controller.ts

### PUT /companies/:id/setting
**Description:** Get company settings by company ID
**Handler:** HttpCode
**File:** company-setting/company-setting.controller.ts

## Company-member Module

### POST /company-members
**Handler:** create
**File:** company-member/company-member.controller.ts

### GET /company-members/:companyId
**Handler:** findAll
**File:** company-member/company-member.controller.ts

### GET /company-members/:id
**Handler:** findOne
**File:** company-member/company-member.controller.ts

### PATCH /company-members/:id
**Handler:** update
**File:** company-member/company-member.controller.ts

### DELETE /company-members/:memberId
**Handler:** remove
**File:** company-member/company-member.controller.ts

### PATCH /company-members/:memberId/role
**Handler:** updateRole
**File:** company-member/company-member.controller.ts

### PATCH /company-members/:memberId/toggle-status
**Handler:** toggleStatus
**File:** company-member/company-member.controller.ts

### POST /company-members/add-member
**Handler:** addMember
**File:** company-member/company-member.controller.ts

## Content-schedule Module

### GET /content-schedule
**Description:** Create content schedule
**Handler:** ApiOperation
**File:** content-schedule/content-schedule.controller.ts

### POST /content-schedule
**Handler:** ApiOperation
**File:** content-schedule/content-schedule.controller.ts

### DELETE /content-schedule/:id
**Description:** Create content schedule
**Handler:** ApiOperation
**File:** content-schedule/content-schedule.controller.ts

### GET /content-schedule/:id
**Description:** Create content schedule
**Handler:** ApiOperation
**File:** content-schedule/content-schedule.controller.ts

### PATCH /content-schedule/:id
**Description:** Create content schedule
**Handler:** ApiOperation
**File:** content-schedule/content-schedule.controller.ts

## Content-scheduler Module

### GET /content-scheduler
**Description:** تشغيل الجدولة يدويًا (نشر المحتوى المجدول)
**Handler:** ApiOperation
**File:** content-scheduler/content-scheduler.controller.ts

### POST /content-scheduler/check
**Description:** تشغيل الجدولة يدويًا (نشر المحتوى المجدول)
**Handler:** ApiOperation
**File:** content-scheduler/content-scheduler.controller.ts

### POST /content-scheduler/manual-publish
**Description:** تشغيل الجدولة يدويًا (نشر المحتوى المجدول)
**Handler:** ApiOperation
**File:** content-scheduler/content-scheduler.controller.ts

### POST /content-scheduler/run-now
**Handler:** ApiOperation
**File:** content-scheduler/content-scheduler.controller.ts

## Country Module

### GET /countries
**Handler:** findAll
**File:** country/country.controller.ts

## Lib Module

### GET /facebook/auth-url
**Handler:** ApiOperation
**File:** lib/social-providers/facebook/facebook.controller.ts

### GET /facebook/callback
**Description:** Get Facebook OAuth URL
**Handler:** UsePipes
**File:** lib/social-providers/facebook/facebook.controller.ts

### GET /instagram/auth-url
**Handler:** ApiOperation
**File:** lib/social-providers/Instagram/instagram.controller.ts

### GET /instagram/callback
**Description:** Generate Instagram OAuth URL
**Handler:** ApiOperation
**File:** lib/social-providers/Instagram/instagram.controller.ts

### GET /linkedin/auth-url
**Handler:** UseGuards
**File:** lib/social-providers/linkedin/linkedin.controller.ts

### GET /linkedin/callback
**Description:** Get LinkedIn auth URL
**Handler:** HttpCode
**File:** lib/social-providers/linkedin/linkedin.controller.ts

### GET /linkedin/callback
**Description:** Get LinkedIn auth URL
**Handler:** HttpCode
**File:** lib/social-providers/linkedin/linkedin.controller.ts

### POST /linkedin/publish
**Description:** Get LinkedIn auth URL
**Handler:** UseGuards
**File:** lib/social-providers/linkedin/linkedin.controller.ts

### GET /twitter/auth-url
**Handler:** ApiOperation
**File:** lib/social-providers/twitter/twitter.controller.ts

### GET /twitter/callback
**Description:** Get Twitter OAuth URL
**Handler:** ApiOperation
**File:** lib/social-providers/twitter/twitter.controller.ts

### POST /twitter/publish
**Description:** Get Twitter OAuth URL
**Handler:** ApiOperation
**File:** lib/social-providers/twitter/twitter.controller.ts

## File-upload Module

### GET /file-upload
**Description:** Upload a new file
**Handler:** ApiOperation
**File:** file-upload/file-upload.controller.ts

### POST /file-upload
**Handler:** ApiOperation
**File:** file-upload/file-upload.controller.ts

### DELETE /file-upload/:id
**Description:** Upload a new file
**Handler:** ApiOperation
**File:** file-upload/file-upload.controller.ts

### GET /file-upload/:id
**Description:** Upload a new file
**Handler:** ApiOperation
**File:** file-upload/file-upload.controller.ts

### PATCH /file-upload/:id
**Description:** Upload a new file
**Handler:** ApiOperation
**File:** file-upload/file-upload.controller.ts

## Interaction Module

### GET /interactions
**Description:** Create a new interaction
**Handler:** findAll
**File:** interaction/interaction.controller.ts

### POST /interactions
**Description:** Create a new interaction
**Handler:** UseGuards
**File:** interaction/interaction.controller.ts

### DELETE /interactions/:id
**Description:** Create a new interaction
**Handler:** remove
**File:** interaction/interaction.controller.ts

### GET /interactions/:id
**Description:** Create a new interaction
**Handler:** findOne
**File:** interaction/interaction.controller.ts

### PATCH /interactions/:id
**Description:** Create a new interaction
**Handler:** update
**File:** interaction/interaction.controller.ts

## Invitation Module

### POST /invitations
**Handler:** HttpCode
**File:** invitation/invitation.controller.ts

### GET /invitations/:token
**Description:** Create new company invitation
**Handler:** ApiOperation
**File:** invitation/invitation.controller.ts

### POST /invitations/:token/accept
**Description:** Create new company invitation
**Handler:** HttpCode
**File:** invitation/invitation.controller.ts

### POST /invitations/:token/cancel
**Description:** Create new company invitation
**Handler:** HttpCode
**File:** invitation/invitation.controller.ts

## Lead Module

### GET /leads
**Description:** إنشاء lead جديد
**Handler:** ApiOperation
**File:** lead/lead.controller.ts

### POST /leads
**Handler:** ApiOperation
**File:** lead/lead.controller.ts

### DELETE /leads/:id
**Description:** إنشاء lead جديد
**Handler:** ApiOperation
**File:** lead/lead.controller.ts

### GET /leads/:id
**Description:** إنشاء lead جديد
**Handler:** ApiOperation
**File:** lead/lead.controller.ts

### PATCH /leads/:id
**Description:** إنشاء lead جديد
**Handler:** ApiOperation
**File:** lead/lead.controller.ts

## Marketing-campaign Module

### GET /marketing-campaigns
**Description:** Create a new marketing campaign
**Handler:** ApiOperation
**File:** marketing-campaign/marketing-campaign.controller.ts

### POST /marketing-campaigns
**Handler:** ApiOperation
**File:** marketing-campaign/marketing-campaign.controller.ts

### DELETE /marketing-campaigns/:id
**Description:** Create a new marketing campaign
**Handler:** ApiOperation
**File:** marketing-campaign/marketing-campaign.controller.ts

### GET /marketing-campaigns/:id
**Description:** Create a new marketing campaign
**Handler:** ApiOperation
**File:** marketing-campaign/marketing-campaign.controller.ts

### PATCH /marketing-campaigns/:id
**Description:** Create a new marketing campaign
**Handler:** ApiOperation
**File:** marketing-campaign/marketing-campaign.controller.ts

## Me Module

### GET /me
**Handler:** ApiBearerAuth
**File:** me/me.controller.ts

### GET /me/affiliates/referrals
**Handler:** ApiBearerAuth
**File:** me/me.controller.ts

## Notification Module

### POST /notifications
**Handler:** ApiOperation
**File:** notification/notification.controller.ts

### DELETE /notifications/:id
**Description:** Create a new notification
**Handler:** ApiOperation
**File:** notification/notification.controller.ts

### PATCH /notifications/:id/read
**Description:** Create a new notification
**Handler:** ApiOperation
**File:** notification/notification.controller.ts

### GET /notifications/client/:clientId
**Description:** Create a new notification
**Handler:** ApiOperation
**File:** notification/notification.controller.ts

### GET /notifications/user/:userId
**Description:** Create a new notification
**Handler:** ApiOperation
**File:** notification/notification.controller.ts

### GET /notifications/user/:userId/unread
**Description:** Create a new notification
**Handler:** ApiOperation
**File:** notification/notification.controller.ts

## Payments Module

### POST /payments/paddle/create-checkout
**Handler:** createPaddleCheckout
**File:** payments/payments.controller.ts

### POST /payments/webhooks/paddle
**Handler:** handlePaddleWebhook
**File:** payments/payments.controller.ts

## Pipeline-stage Module

### GET /pipeline-stages
**Description:** إنشاء مرحلة جديدة ضمن المسار
**Handler:** ApiOperation
**File:** pipeline-stage/pipeline-stage.controller.ts

### POST /pipeline-stages
**Handler:** ApiOperation
**File:** pipeline-stage/pipeline-stage.controller.ts

### DELETE /pipeline-stages/:id
**Description:** إنشاء مرحلة جديدة ضمن المسار
**Handler:** ApiOperation
**File:** pipeline-stage/pipeline-stage.controller.ts

### GET /pipeline-stages/:id
**Description:** إنشاء مرحلة جديدة ضمن المسار
**Handler:** ApiOperation
**File:** pipeline-stage/pipeline-stage.controller.ts

### PATCH /pipeline-stages/:id
**Description:** إنشاء مرحلة جديدة ضمن المسار
**Handler:** ApiOperation
**File:** pipeline-stage/pipeline-stage.controller.ts

### POST /pipeline-stages/reorder
**Description:** إنشاء مرحلة جديدة ضمن المسار
**Handler:** ApiOperation
**File:** pipeline-stage/pipeline-stage.controller.ts

## Point-event Module

### GET /point-events
**Description:** Create a new point event
**Handler:** ApiOperation
**File:** point-event/point-event.controller.ts

### POST /point-events
**Handler:** ApiOperation
**File:** point-event/point-event.controller.ts

### DELETE /point-events/:id
**Description:** Create a new point event
**Handler:** ApiOperation
**File:** point-event/point-event.controller.ts

### GET /point-events/:id
**Description:** Create a new point event
**Handler:** ApiOperation
**File:** point-event/point-event.controller.ts

### PATCH /point-events/:id
**Description:** Create a new point event
**Handler:** ApiOperation
**File:** point-event/point-event.controller.ts

## Project Module

### GET /projects
**Description:** Create a new project
**Handler:** ApiOperation
**File:** project/project.controller.ts

### POST /projects
**Handler:** ApiOperation
**File:** project/project.controller.ts

### DELETE /projects/:id
**Description:** Create a new project
**Handler:** ApiOperation
**File:** project/project.controller.ts

### GET /projects/:id
**Description:** Create a new project
**Handler:** ApiOperation
**File:** project/project.controller.ts

### PATCH /projects/:id
**Description:** Create a new project
**Handler:** ApiOperation
**File:** project/project.controller.ts

### GET /projects/:id/stats
**Description:** Create a new project
**Handler:** ApiOperation
**File:** project/project.controller.ts

### GET /projects/my-projects
**Description:** Create a new project
**Handler:** ApiOperation
**File:** project/project.controller.ts

## Reward-redemption Module

### GET /rewards
**Description:** Redeem an award using points
**Handler:** ApiOperation
**File:** reward-redemption/reward-redemption.controller.ts

### GET /rewards/me
**Description:** Redeem an award using points
**Handler:** ApiOperation
**File:** reward-redemption/reward-redemption.controller.ts

### POST /rewards/redeem/:awardId
**Handler:** ApiOperation
**File:** reward-redemption/reward-redemption.controller.ts

## Role Module

### GET /roles
**Handler:** getRolesByCompany
**File:** role/role.controller.ts

### GET /roles
**Handler:** findAll
**File:** role/role.controller.ts

### POST /roles
**Handler:** create
**File:** role/role.controller.ts

### DELETE /roles/:id
**Handler:** remove
**File:** role/role.controller.ts

### GET /roles/:id
**Handler:** findOne
**File:** role/role.controller.ts

### PATCH /roles/:id
**Handler:** update
**File:** role/role.controller.ts

## Social-accounts Module

### GET /social-accounts
**Description:** Link a new social account
**Handler:** ApiOperation
**File:** social-accounts/social-accounts.controller.ts

### POST /social-accounts
**Handler:** ApiOperation
**File:** social-accounts/social-accounts.controller.ts

### DELETE /social-accounts/:id
**Description:** Link a new social account
**Handler:** ApiOperation
**File:** social-accounts/social-accounts.controller.ts

### GET /social-accounts/:id
**Description:** Link a new social account
**Handler:** ApiOperation
**File:** social-accounts/social-accounts.controller.ts

### PATCH /social-accounts/:id
**Description:** Link a new social account
**Handler:** ApiOperation
**File:** social-accounts/social-accounts.controller.ts

### POST /social-accounts/get-account-stats
**Description:** Link a new social account
**Handler:** ApiOperation
**File:** social-accounts/social-accounts.controller.ts

### GET /social-accounts/grouped
**Handler:** UseGuards
**File:** social-accounts/social-accounts.controller.ts

### POST /social-accounts/my-social-accounts
**Description:** Link a new social account
**Handler:** ApiOperation
**File:** social-accounts/social-accounts.controller.ts

### GET /social-accounts/oauth/:platform/authorize
**Description:** Link a new social account
**Handler:** getOAuthUrl
**File:** social-accounts/social-accounts.controller.ts

### POST /social-accounts/oauth/:platform/callback
**Description:** Link a new social account
**Handler:** handleOAuthCallback
**File:** social-accounts/social-accounts.controller.ts

## Social-post Module

### GET /social-posts
**Description:** Create new post
**Handler:** ApiOperation
**File:** social-post/social-post.controller.ts

### POST /social-posts
**Handler:** ApiOperation
**File:** social-post/social-post.controller.ts

### DELETE /social-posts/:id
**Description:** Create new post
**Handler:** ApiOperation
**File:** social-post/social-post.controller.ts

### GET /social-posts/:id
**Description:** Create new post
**Handler:** ApiOperation
**File:** social-post/social-post.controller.ts

### PATCH /social-posts/:id
**Description:** Create new post
**Handler:** ApiOperation
**File:** social-post/social-post.controller.ts

### POST /social-posts/generate-only
**Description:** Create new post
**Handler:** UseGuards
**File:** social-post/social-post.controller.ts

## Sprint Module

### GET /sprints
**Description:** Create a new sprint
**Handler:** ApiOperation
**File:** sprint/sprint.controller.ts

### POST /sprints
**Handler:** ApiOperation
**File:** sprint/sprint.controller.ts

### DELETE /sprints/:id
**Description:** Create a new sprint
**Handler:** ApiOperation
**File:** sprint/sprint.controller.ts

### GET /sprints/:id
**Description:** Create a new sprint
**Handler:** ApiOperation
**File:** sprint/sprint.controller.ts

### PATCH /sprints/:id
**Description:** Create a new sprint
**Handler:** ApiOperation
**File:** sprint/sprint.controller.ts

### GET /sprints/:id/stats
**Description:** Create a new sprint
**Handler:** ApiOperation
**File:** sprint/sprint.controller.ts

## Subscription-plan Module

### GET /subscription-plans
**Description:** Create a new subscription plan
**Handler:** ApiOperation
**File:** subscription-plan/subscription-plan.controller.ts

### POST /subscription-plans
**Handler:** ApiOperation
**File:** subscription-plan/subscription-plan.controller.ts

### DELETE /subscription-plans/:id
**Description:** Create a new subscription plan
**Handler:** ApiOperation
**File:** subscription-plan/subscription-plan.controller.ts

### GET /subscription-plans/:id
**Description:** Create a new subscription plan
**Handler:** ApiOperation
**File:** subscription-plan/subscription-plan.controller.ts

### PATCH /subscription-plans/:id
**Description:** Create a new subscription plan
**Handler:** ApiOperation
**File:** subscription-plan/subscription-plan.controller.ts

## Subscription Module

### POST /subscriptions
**Handler:** ApiOperation
**File:** subscription/subscription.controller.ts

### DELETE /subscriptions/:id
**Description:** Create a new subscription
**Handler:** UseGuards
**File:** subscription/subscription.controller.ts

### GET /subscriptions/:id
**Description:** Create a new subscription
**Handler:** ApiOperation
**File:** subscription/subscription.controller.ts

### PATCH /subscriptions/:id
**Description:** Create a new subscription
**Handler:** UseGuards
**File:** subscription/subscription.controller.ts

### POST /subscriptions/activate
**Description:** Create a new subscription
**Handler:** UseGuards
**File:** subscription/subscription.controller.ts

### GET /subscriptions/me
**Handler:** getMySubscription
**File:** subscription/subscription.controller.ts

## Tags Module

### GET /tags
**Description:** Create new tag
**Handler:** ApiOperation
**File:** tags/tags.controller.ts

### POST /tags
**Handler:** ApiOperation
**File:** tags/tags.controller.ts

### DELETE /tags/:id
**Description:** Create new tag
**Handler:** ApiOperation
**File:** tags/tags.controller.ts

### GET /tags/:id
**Description:** Create new tag
**Handler:** ApiOperation
**File:** tags/tags.controller.ts

### PATCH /tags/:id
**Description:** Create new tag
**Handler:** ApiOperation
**File:** tags/tags.controller.ts

## Task Module

### GET /tasks
**Description:** إنشاء مهمة جديدة
**Handler:** ApiOperation
**File:** task/task.controller.ts

### POST /tasks
**Handler:** ApiOperation
**File:** task/task.controller.ts

### DELETE /tasks/:id
**Description:** إنشاء مهمة جديدة
**Handler:** ApiOperation
**File:** task/task.controller.ts

### GET /tasks/:id
**Description:** إنشاء مهمة جديدة
**Handler:** ApiOperation
**File:** task/task.controller.ts

### PATCH /tasks/:id
**Description:** إنشاء مهمة جديدة
**Handler:** ApiOperation
**File:** task/task.controller.ts

### PATCH /tasks/:id/assign/:assigneeId
**Description:** إنشاء مهمة جديدة
**Handler:** ApiOperation
**File:** task/task.controller.ts

### PATCH /tasks/:id/status/:status
**Description:** إنشاء مهمة جديدة
**Handler:** ApiOperation
**File:** task/task.controller.ts

### GET /tasks/project/:projectId
**Description:** إنشاء مهمة جديدة
**Handler:** ApiOperation
**File:** task/task.controller.ts

### GET /tasks/status/:status
**Description:** إنشاء مهمة جديدة
**Handler:** ApiOperation
**File:** task/task.controller.ts

## Usage-limit Module

### GET /usage-limit
**Handler:** getLimits
**File:** usage-limit/usage-limit.controller.ts

### POST /usage-limit/increment
**Handler:** incrementUsage
**File:** usage-limit/usage-limit.controller.ts

## User-point Module

### GET /user-points
**Handler:** ApiOperation
**File:** user-point/user-point.controller.ts

### POST /user-points
**Description:** Get all user points
**Handler:** ApiOperation
**File:** user-point/user-point.controller.ts

### GET /user-points/:userId
**Description:** Get all user points
**Handler:** ApiOperation
**File:** user-point/user-point.controller.ts

### PATCH /user-points/:userId
**Description:** Get all user points
**Handler:** ApiOperation
**File:** user-point/user-point.controller.ts

### PATCH /user-points/:userId/add
**Description:** Get all user points
**Handler:** ApiOperation
**File:** user-point/user-point.controller.ts

### PATCH /user-points/:userId/deduct
**Description:** Get all user points
**Handler:** ApiOperation
**File:** user-point/user-point.controller.ts

## Web-content Module

### GET /web-content
**Description:** إنشاء محتوى ويب جديد
**Handler:** ApiOperation
**File:** web-content/web-content.controller.ts

### POST /web-content
**Handler:** ApiOperation
**File:** web-content/web-content.controller.ts

### DELETE /web-content/:id
**Description:** إنشاء محتوى ويب جديد
**Handler:** ApiOperation
**File:** web-content/web-content.controller.ts

### GET /web-content/:id
**Description:** إنشاء محتوى ويب جديد
**Handler:** ApiOperation
**File:** web-content/web-content.controller.ts

### PATCH /web-content/:id
**Description:** إنشاء محتوى ويب جديد
**Handler:** ApiOperation
**File:** web-content/web-content.controller.ts

