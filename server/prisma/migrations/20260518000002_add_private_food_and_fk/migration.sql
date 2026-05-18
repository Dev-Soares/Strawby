-- DropForeignKey
ALTER TABLE "MealItem" DROP CONSTRAINT "MealItem_foodId_fkey";

-- AlterTable
ALTER TABLE "MealItem" ADD COLUMN     "privateFoodId" TEXT,
ALTER COLUMN "foodId" DROP NOT NULL,
ALTER COLUMN "calories" DROP DEFAULT,
ALTER COLUMN "protein" DROP DEFAULT,
ALTER COLUMN "carbs" DROP DEFAULT,
ALTER COLUMN "fat" DROP DEFAULT;

-- CreateTable
CREATE TABLE "PrivateFood" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "calories" DOUBLE PRECISION NOT NULL,
    "protein" DOUBLE PRECISION NOT NULL,
    "carbs" DOUBLE PRECISION NOT NULL,
    "fat" DOUBLE PRECISION NOT NULL,
    "fiber" DOUBLE PRECISION,
    "sodium" DOUBLE PRECISION,
    "servingSize" TEXT,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PrivateFood_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PrivateFood_userId_idx" ON "PrivateFood"("userId");

-- CreateIndex
CREATE INDEX "MealItem_mealId_idx" ON "MealItem"("mealId");

-- AddForeignKey
ALTER TABLE "PrivateFood" ADD CONSTRAINT "PrivateFood_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MealItem" ADD CONSTRAINT "MealItem_foodId_fkey" FOREIGN KEY ("foodId") REFERENCES "Food"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MealItem" ADD CONSTRAINT "MealItem_privateFoodId_fkey" FOREIGN KEY ("privateFoodId") REFERENCES "PrivateFood"("id") ON DELETE SET NULL ON UPDATE CASCADE;
