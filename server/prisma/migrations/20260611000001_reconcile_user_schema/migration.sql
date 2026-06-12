-- Add 'user' variant to Role enum
DO $$ BEGIN
  ALTER TYPE "Role" ADD VALUE IF NOT EXISTS 'user';
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- AlterTable User: make password nullable
ALTER TABLE "User" ALTER COLUMN "password" DROP NOT NULL;

-- AlterTable User: add missing columns
ALTER TABLE "User"
  ADD COLUMN IF NOT EXISTS "emailVerified" BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS "passwordResetToken" TEXT,
  ADD COLUMN IF NOT EXISTS "passwordResetTokenExpiresAt" TIMESTAMP(3);

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "User_passwordResetToken_key" ON "User"("passwordResetToken");
