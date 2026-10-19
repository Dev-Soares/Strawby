-- AlterEnum
ALTER TYPE "FoodSource" ADD VALUE 'TBCA';
-- CreateTable
CREATE TABLE "FoodMeasure" (
    "id" TEXT NOT NULL,
    "foodId" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "grams" DOUBLE PRECISION NOT NULL,
    "unit" TEXT NOT NULL DEFAULT 'g',
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "FoodMeasure_pkey" PRIMARY KEY ("id")
);
-- CreateIndex
CREATE INDEX "FoodMeasure_foodId_idx" ON "FoodMeasure"("foodId");
-- CreateIndex
CREATE UNIQUE INDEX "FoodMeasure_foodId_label_key" ON "FoodMeasure"("foodId", "label");
-- AddForeignKey
ALTER TABLE "FoodMeasure" ADD CONSTRAINT "FoodMeasure_foodId_fkey" FOREIGN KEY ("foodId") REFERENCES "Food"("id") ON DELETE CASCADE ON UPDATE CASCADE;
