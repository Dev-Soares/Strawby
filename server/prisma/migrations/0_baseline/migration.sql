-- Extensions
CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE EXTENSION IF NOT EXISTS unaccent;

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "public"."ConnectionRequestStatus" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "public"."FoodSource" AS ENUM ('TACO', 'USDA_FOUNDATION', 'USDA_SR_LEGACY', 'CNF', 'LIVS', 'OFF', 'MANUAL');

-- CreateEnum
CREATE TYPE "public"."MealKind" AS ENUM ('DAILY', 'PLAN');

-- CreateEnum
CREATE TYPE "public"."Role" AS ENUM ('patient', 'nutritionist');

-- CreateTable
CREATE TABLE "public"."ConnectionRequest" (
    "id" TEXT NOT NULL,
    "status" "public"."ConnectionRequestStatus" NOT NULL DEFAULT 'PENDING',
    "nutritionistId" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ConnectionRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."DailyScore" (
    "id" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "score" DOUBLE PRECISION NOT NULL,
    "patientId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DailyScore_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Food" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "nameOriginal" TEXT,
    "source" "public"."FoodSource" NOT NULL,
    "sourceId" TEXT,
    "category" TEXT,
    "priority" INTEGER NOT NULL DEFAULT 0,
    "calories" DOUBLE PRECISION NOT NULL,
    "protein" DOUBLE PRECISION NOT NULL,
    "carbs" DOUBLE PRECISION NOT NULL,
    "fat" DOUBLE PRECISION NOT NULL,
    "fiber" DOUBLE PRECISION,
    "sodium" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "servingSize" TEXT,
    "sourceUrl" TEXT,

    CONSTRAINT "Food_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."FoodItem" (
    "id" TEXT NOT NULL,
    "quantity" DOUBLE PRECISION NOT NULL,
    "calories" DOUBLE PRECISION NOT NULL,
    "protein" DOUBLE PRECISION NOT NULL,
    "carbs" DOUBLE PRECISION NOT NULL,
    "fat" DOUBLE PRECISION NOT NULL,
    "mealId" TEXT,
    "recipeId" TEXT,
    "foodId" TEXT,
    "privateFoodId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FoodItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Meal" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "kind" "public"."MealKind" NOT NULL DEFAULT 'DAILY',
    "mealType" TEXT,
    "time" TEXT,
    "patientId" TEXT NOT NULL,

    CONSTRAINT "Meal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Nutritionist" (
    "id" TEXT NOT NULL,
    "code" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Nutritionist_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Patient" (
    "id" TEXT NOT NULL,
    "nutritionistId" TEXT,
    "weight" DOUBLE PRECISION,
    "height" DOUBLE PRECISION,
    "age" INTEGER,
    "gender" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Patient_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Plan" (
    "id" TEXT NOT NULL,
    "calories" DOUBLE PRECISION NOT NULL,
    "protein" DOUBLE PRECISION NOT NULL,
    "carbs" DOUBLE PRECISION NOT NULL,
    "fat" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "patientId" TEXT NOT NULL,

    CONSTRAINT "Plan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."PrivateFood" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "calories" DOUBLE PRECISION NOT NULL,
    "protein" DOUBLE PRECISION NOT NULL,
    "carbs" DOUBLE PRECISION NOT NULL,
    "fat" DOUBLE PRECISION NOT NULL,
    "fiber" DOUBLE PRECISION,
    "sodium" DOUBLE PRECISION,
    "servingSize" TEXT,
    "patientId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PrivateFood_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Recipe" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Recipe_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "role" "public"."Role" NOT NULL,
    "termsAcceptedAt" TIMESTAMP(3),
    "termsVersion" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."_MealToRecipe" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_MealToRecipe_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "ConnectionRequest_nutritionistId_idx" ON "public"."ConnectionRequest"("nutritionistId" ASC);

-- CreateIndex
CREATE INDEX "ConnectionRequest_patientId_idx" ON "public"."ConnectionRequest"("patientId" ASC);

-- CreateIndex
CREATE INDEX "DailyScore_patientId_date_idx" ON "public"."DailyScore"("patientId" ASC, "date" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "DailyScore_patientId_date_key" ON "public"."DailyScore"("patientId" ASC, "date" ASC);

-- CreateIndex
CREATE INDEX "Food_priority_name_idx" ON "public"."Food"("priority" DESC, "name" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "Food_source_sourceId_key" ON "public"."Food"("source" ASC, "sourceId" ASC);

-- CreateIndex
CREATE INDEX "FoodItem_mealId_idx" ON "public"."FoodItem"("mealId" ASC);

-- CreateIndex
CREATE INDEX "FoodItem_recipeId_idx" ON "public"."FoodItem"("recipeId" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "Nutritionist_code_key" ON "public"."Nutritionist"("code" ASC);

-- CreateIndex
CREATE INDEX "PrivateFood_patientId_idx" ON "public"."PrivateFood"("patientId" ASC);

-- CreateIndex
CREATE INDEX "Recipe_patientId_idx" ON "public"."Recipe"("patientId" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "public"."User"("email" ASC);

-- CreateIndex
CREATE INDEX "_MealToRecipe_B_index" ON "public"."_MealToRecipe"("B" ASC);

-- AddForeignKey
ALTER TABLE "public"."Patient" ADD CONSTRAINT "Patient_nutritionistId_fkey" FOREIGN KEY ("nutritionistId") REFERENCES "public"."Nutritionist"("id") ON DELETE SET NULL ON UPDATE CASCADE;
