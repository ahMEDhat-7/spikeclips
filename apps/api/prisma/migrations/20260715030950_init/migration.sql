-- AlterTable
ALTER TABLE "User" ADD COLUMN     "analysesResetAt" TIMESTAMP(3),
ADD COLUMN     "oauthProvider" TEXT,
ADD COLUMN     "oauthProviderId" TEXT,
ALTER COLUMN "passwordHash" DROP NOT NULL;
