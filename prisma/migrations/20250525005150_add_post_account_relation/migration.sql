-- CreateTable
CREATE TABLE "PostAccount" (
    "id" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "socialAccountId" TEXT NOT NULL,

    CONSTRAINT "PostAccount_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PostAccount_postId_socialAccountId_key" ON "PostAccount"("postId", "socialAccountId");

-- AddForeignKey
ALTER TABLE "PostAccount" ADD CONSTRAINT "PostAccount_postId_fkey" FOREIGN KEY ("postId") REFERENCES "SocialPost"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostAccount" ADD CONSTRAINT "PostAccount_socialAccountId_fkey" FOREIGN KEY ("socialAccountId") REFERENCES "SocialAccount"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
