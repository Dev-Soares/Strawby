-- CreateEnum
CREATE TYPE "MealKind" AS ENUM ('DAILY', 'PLAN');

-- AlterTable: add kind column to Meal (default DAILY for existing rows)
ALTER TABLE "Meal" ADD COLUMN "kind" "MealKind" NOT NULL DEFAULT 'DAILY';

-- Migrate existing PlanMeal rows into Meal as kind=PLAN
INSERT INTO "Meal" ("id", "name", "kind", "mealType", "time", "date", "userId", "createdAt", "updatedAt")
SELECT
  "id",
  "name",
  'PLAN'::"MealKind",
  "type",
  NULL,
  "date",
  "userId",
  "createdAt",
  "updatedAt"
FROM "PlanMeal";

-- Migrate existing PlanMealItem rows into MealItem
INSERT INTO "MealItem" ("id", "quantity", "calories", "protein", "carbs", "fat", "mealId", "foodId", "createdAt", "updatedAt")
SELECT
  "id",
  "quantity",
  "calories",
  "protein",
  "carbs",
  "fat",
  "planMealId",
  "foodId",
  "createdAt",
  "updatedAt"
FROM "PlanMealItem";

-- DropForeignKey
ALTER TABLE "PlanMealItem" DROP CONSTRAINT IF EXISTS "PlanMealItem_planMealId_fkey";
ALTER TABLE "PlanMealItem" DROP CONSTRAINT IF EXISTS "PlanMealItem_foodId_fkey";
ALTER TABLE "PlanMeal" DROP CONSTRAINT IF EXISTS "PlanMeal_userId_fkey";

-- DropTable
DROP TABLE "PlanMealItem";
DROP TABLE "PlanMeal";

-- CreateIndex
CREATE INDEX "Meal_userId_kind_date_idx" ON "Meal"("userId", "kind", "date");
