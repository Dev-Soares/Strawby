-- Cleanup orphaned records before adding foreign keys
DELETE FROM "ConnectionRequest" WHERE "nutritionistId" NOT IN (SELECT "id" FROM "Nutritionist");
DELETE FROM "ConnectionRequest" WHERE "patientId" NOT IN (SELECT "id" FROM "Patient");

-- AddColumn: streak fields on Patient
ALTER TABLE "Patient" ADD COLUMN IF NOT EXISTS "currentStreak" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "Patient" ADD COLUMN IF NOT EXISTS "bestStreak" INTEGER NOT NULL DEFAULT 0;

-- AddForeignKey: Patient → User (via shared id)
ALTER TABLE "Patient" ADD CONSTRAINT "Patient_id_fkey" FOREIGN KEY ("id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey: Nutritionist → User (via shared id)
ALTER TABLE "Nutritionist" ADD CONSTRAINT "Nutritionist_id_fkey" FOREIGN KEY ("id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey: DailyScore → Patient
ALTER TABLE "DailyScore" ADD CONSTRAINT "DailyScore_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey: FoodItem → Meal
ALTER TABLE "FoodItem" ADD CONSTRAINT "FoodItem_mealId_fkey" FOREIGN KEY ("mealId") REFERENCES "Meal"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey: FoodItem → Recipe
ALTER TABLE "FoodItem" ADD CONSTRAINT "FoodItem_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "Recipe"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey: FoodItem → Food
ALTER TABLE "FoodItem" ADD CONSTRAINT "FoodItem_foodId_fkey" FOREIGN KEY ("foodId") REFERENCES "Food"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey: FoodItem → PrivateFood
ALTER TABLE "FoodItem" ADD CONSTRAINT "FoodItem_privateFoodId_fkey" FOREIGN KEY ("privateFoodId") REFERENCES "PrivateFood"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- CreateIndex: Meal (patientId, kind, date)
CREATE INDEX IF NOT EXISTS "Meal_patientId_kind_date_idx" ON "Meal"("patientId" ASC, "kind" ASC, "date" ASC);

-- AddForeignKey: Meal → Patient
ALTER TABLE "Meal" ADD CONSTRAINT "Meal_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- CreateIndex: Plan patientId unique
CREATE UNIQUE INDEX IF NOT EXISTS "Plan_patientId_key" ON "Plan"("patientId" ASC);

-- AddForeignKey: Plan → Patient
ALTER TABLE "Plan" ADD CONSTRAINT "Plan_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey: PrivateFood → Patient
ALTER TABLE "PrivateFood" ADD CONSTRAINT "PrivateFood_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey: Recipe → Patient
ALTER TABLE "Recipe" ADD CONSTRAINT "Recipe_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- CreateIndex: Food name GIN (trigram search)
CREATE INDEX IF NOT EXISTS "Food_name_idx" ON "Food" USING GIN ("name" gin_trgm_ops);

-- AddForeignKey: ConnectionRequest → Nutritionist
ALTER TABLE "ConnectionRequest" ADD CONSTRAINT "ConnectionRequest_nutritionistId_fkey" FOREIGN KEY ("nutritionistId") REFERENCES "Nutritionist"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey: ConnectionRequest → Patient
ALTER TABLE "ConnectionRequest" ADD CONSTRAINT "ConnectionRequest_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey: _MealToRecipe → Meal
ALTER TABLE "_MealToRecipe" ADD CONSTRAINT "_MealToRecipe_A_fkey" FOREIGN KEY ("A") REFERENCES "Meal"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey: _MealToRecipe → Recipe
ALTER TABLE "_MealToRecipe" ADD CONSTRAINT "_MealToRecipe_B_fkey" FOREIGN KEY ("B") REFERENCES "Recipe"("id") ON DELETE CASCADE ON UPDATE CASCADE;
