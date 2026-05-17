-- CreateEnum
CREATE TYPE "MealKind" AS ENUM ('DAILY', 'PLAN');

-- AlterTable: add new columns to Meal
ALTER TABLE "Meal" ADD COLUMN IF NOT EXISTS "kind" "MealKind" NOT NULL DEFAULT 'DAILY';
ALTER TABLE "Meal" ADD COLUMN IF NOT EXISTS "mealType" TEXT;
ALTER TABLE "Meal" ADD COLUMN IF NOT EXISTS "time" TEXT;

-- Add macro columns to MealItem if missing
ALTER TABLE "MealItem" ADD COLUMN IF NOT EXISTS "calories" DOUBLE PRECISION NOT NULL DEFAULT 0;
ALTER TABLE "MealItem" ADD COLUMN IF NOT EXISTS "protein" DOUBLE PRECISION NOT NULL DEFAULT 0;
ALTER TABLE "MealItem" ADD COLUMN IF NOT EXISTS "carbs" DOUBLE PRECISION NOT NULL DEFAULT 0;
ALTER TABLE "MealItem" ADD COLUMN IF NOT EXISTS "fat" DOUBLE PRECISION NOT NULL DEFAULT 0;

-- Add macro columns to PlanMealItem if missing
ALTER TABLE "PlanMealItem" ADD COLUMN IF NOT EXISTS "calories" DOUBLE PRECISION NOT NULL DEFAULT 0;
ALTER TABLE "PlanMealItem" ADD COLUMN IF NOT EXISTS "protein" DOUBLE PRECISION NOT NULL DEFAULT 0;
ALTER TABLE "PlanMealItem" ADD COLUMN IF NOT EXISTS "carbs" DOUBLE PRECISION NOT NULL DEFAULT 0;
ALTER TABLE "PlanMealItem" ADD COLUMN IF NOT EXISTS "fat" DOUBLE PRECISION NOT NULL DEFAULT 0;

-- Migrate existing PlanMeal rows into Meal as kind=PLAN
INSERT INTO "Meal" ("id", "name", "kind", "mealType", "time", "date", "userId", "createdAt", "updatedAt")
SELECT "id", "name", 'PLAN'::"MealKind", NULL, NULL, "date", "userId", "createdAt", "updatedAt"
FROM "PlanMeal";

-- Migrate existing PlanMealItem rows into MealItem
INSERT INTO "MealItem" ("id", "quantity", "calories", "protein", "carbs", "fat", "mealId", "foodId", "createdAt", "updatedAt")
SELECT "id", "quantity", "calories", "protein", "carbs", "fat", "planMealId", "foodId", "createdAt", "updatedAt"
FROM "PlanMealItem";

-- DropForeignKey
ALTER TABLE "PlanMealItem" DROP CONSTRAINT IF EXISTS "PlanMealItem_planMealId_fkey";
ALTER TABLE "PlanMealItem" DROP CONSTRAINT IF EXISTS "PlanMealItem_foodId_fkey";
ALTER TABLE "PlanMeal" DROP CONSTRAINT IF EXISTS "PlanMeal_userId_fkey";

-- DropTable
DROP TABLE IF EXISTS "PlanMealItem";
DROP TABLE IF EXISTS "PlanMeal";

-- CreateIndex
CREATE INDEX IF NOT EXISTS "Meal_userId_kind_date_idx" ON "Meal"("userId", "kind", "date");
