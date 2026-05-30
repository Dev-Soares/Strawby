-- CreateEnum
CREATE TYPE "ConnectionRequestStatus" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED', 'EXPIRED');

-- CreateTable
CREATE TABLE "ConnectionRequest" (
    "id" TEXT NOT NULL,
    "status" "ConnectionRequestStatus" NOT NULL DEFAULT 'PENDING',
    "nutritionistId" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ConnectionRequest_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ConnectionRequest_nutritionistId_idx" ON "ConnectionRequest"("nutritionistId");

-- CreateIndex
CREATE INDEX "ConnectionRequest_patientId_idx" ON "ConnectionRequest"("patientId");

-- AddForeignKey
ALTER TABLE "ConnectionRequest" ADD CONSTRAINT "ConnectionRequest_nutritionistId_fkey" FOREIGN KEY ("nutritionistId") REFERENCES "Nutritionist"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConnectionRequest" ADD CONSTRAINT "ConnectionRequest_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE CASCADE ON UPDATE CASCADE;
