/*
  Warnings:

  - You are about to drop the column `age` on the `Patient` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Patient" DROP COLUMN "age",
ADD COLUMN     "birthDate" TIMESTAMP(3);
