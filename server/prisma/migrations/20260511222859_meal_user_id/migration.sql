/*
  Warnings:

  - You are about to drop the column `planId` on the `Meal` table. All the data in the column will be lost.
  - Added the required column `userId` to the `Meal` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Meal" DROP CONSTRAINT "Meal_planId_fkey";

-- AlterTable
ALTER TABLE "Meal" DROP COLUMN "planId",
ADD COLUMN     "userId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Meal" ADD CONSTRAINT "Meal_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
