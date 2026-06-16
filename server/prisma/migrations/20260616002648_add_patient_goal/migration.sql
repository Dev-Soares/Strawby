/*
  Warnings:

  - You are about to drop the column `weight` on the `Patient` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "EnumPatientGoal" AS ENUM ('lose', 'gain', 'mantain');

-- AlterTable
ALTER TABLE "Patient" DROP COLUMN "weight",
ADD COLUMN     "goal" "EnumPatientGoal";

-- CreateTable
CREATE TABLE "PatientWeight" (
    "id" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "weight" DOUBLE PRECISION NOT NULL,
    "date" DATE NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PatientWeight_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PatientWeight_patientId_date_idx" ON "PatientWeight"("patientId", "date");

-- AddForeignKey
ALTER TABLE "PatientWeight" ADD CONSTRAINT "PatientWeight_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE CASCADE ON UPDATE CASCADE;
