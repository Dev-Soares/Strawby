-- RenameTable
ALTER TABLE "MealItem" RENAME TO "FoodItem";

-- RenameIndex
ALTER INDEX "MealItem_mealId_idx" RENAME TO "FoodItem_mealId_idx";

-- RenameConstraint
ALTER TABLE "FoodItem" RENAME CONSTRAINT "MealItem_pkey" TO "FoodItem_pkey";
ALTER TABLE "FoodItem" RENAME CONSTRAINT "MealItem_foodId_fkey" TO "FoodItem_foodId_fkey";
ALTER TABLE "FoodItem" RENAME CONSTRAINT "MealItem_mealId_fkey" TO "FoodItem_mealId_fkey";
ALTER TABLE "FoodItem" RENAME CONSTRAINT "MealItem_privateFoodId_fkey" TO "FoodItem_privateFoodId_fkey";
