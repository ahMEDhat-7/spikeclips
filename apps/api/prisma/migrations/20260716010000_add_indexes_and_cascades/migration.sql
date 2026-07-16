-- CreateIndex
CREATE INDEX "User_stripeCustomerId_idx" ON "User"("stripeCustomerId");

-- CreateIndex
CREATE INDEX "User_oauthProvider_oauthProviderId_idx" ON "User"("oauthProvider", "oauthProviderId");

-- CreateIndex
CREATE INDEX "Job_userId_idx" ON "Job"("userId");

-- CreateIndex
CREATE INDEX "Job_status_idx" ON "Job"("status");

-- CreateIndex
CREATE INDEX "Job_userId_status_idx" ON "Job"("userId", "status");

-- CreateIndex
CREATE INDEX "Job_userId_createdAt_idx" ON "Job"("userId", "createdAt" DESC);

-- CreateIndex
CREATE INDEX "Clip_jobId_idx" ON "Clip"("jobId");

-- CreateIndex
CREATE INDEX "Clip_status_idx" ON "Clip"("status");

-- CreateIndex
CREATE INDEX "Clip_jobId_sceneIndex_idx" ON "Clip"("jobId", "sceneIndex");

-- AlterTable: Add onDelete Cascade
ALTER TABLE "Job" DROP CONSTRAINT "Job_userId_fkey",
    ADD CONSTRAINT "Job_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Clip" DROP CONSTRAINT "Clip_jobId_fkey",
    ADD CONSTRAINT "Clip_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "Job"("id") ON DELETE CASCADE ON UPDATE CASCADE;
