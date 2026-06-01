-- Cleanup orphaned records before adding foreign keys
DELETE FROM "ConnectionRequest" WHERE "nutritionistId" NOT IN (SELECT "id" FROM "Nutritionist");
DELETE FROM "ConnectionRequest" WHERE "patientId" NOT IN (SELECT "id" FROM "Patient");

-- AddForeignKey
ALTER TABLE "ConnectionRequest" ADD CONSTRAINT "ConnectionRequest_nutritionistId_fkey" FOREIGN KEY ("nutritionistId") REFERENCES "Nutritionist"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConnectionRequest" ADD CONSTRAINT "ConnectionRequest_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MealToRecipe" ADD CONSTRAINT "_MealToRecipe_A_fkey" FOREIGN KEY ("A") REFERENCES "Meal"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MealToRecipe" ADD CONSTRAINT "_MealToRecipe_B_fkey" FOREIGN KEY ("B") REFERENCES "Recipe"("id") ON DELETE CASCADE ON UPDATE CASCADE;
