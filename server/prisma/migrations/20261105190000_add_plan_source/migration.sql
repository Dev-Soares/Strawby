-- CreateEnum
CREATE TYPE "PlanSource" AS ENUM ('ASSISTANT', 'MANUAL', 'NUTRITIONIST');

-- AlterTable
ALTER TABLE "Plan" ADD COLUMN     "source" "PlanSource" NOT NULL DEFAULT 'MANUAL';
