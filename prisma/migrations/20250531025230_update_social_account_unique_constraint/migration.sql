-- DropIndex
DROP INDEX "SocialAccount_userId_platform_key";

-- CreateIndex
CREATE UNIQUE INDEX "SocialAccount_userId_platform_pageId_key" ON "SocialAccount"("userId", "platform", "pageId");
