-- Normaliza coluna `date` para DATE (sem componente de hora)
ALTER TABLE "DailyScore"
  ALTER COLUMN "date" TYPE DATE USING "date"::date;

-- Remove duplicatas (mantém a mais recente por (userId, date))
DELETE FROM "DailyScore" a
USING "DailyScore" b
WHERE a."userId" = b."userId"
  AND a."date"   = b."date"
  AND a."createdAt" < b."createdAt";

-- Cria constraint única (userId, date)
CREATE UNIQUE INDEX "DailyScore_userId_date_key"
  ON "DailyScore"("userId", "date");
