-- AlterTable: Remove email/password auth fields from User table
ALTER TABLE "User" DROP COLUMN IF EXISTS "passwordHash";
ALTER TABLE "User" DROP COLUMN IF EXISTS "failedLoginAttempts";
ALTER TABLE "User" DROP COLUMN IF EXISTS "lockedUntil";
