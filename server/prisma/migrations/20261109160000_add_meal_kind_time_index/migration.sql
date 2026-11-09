-- O cron de lembrete de refeição planejada roda a cada 10 min e filtra por
-- (kind, time). O índice estava declarado no schema.prisma mas nunca foi
-- migrado, então em produção a query varria a tabela inteira.
CREATE INDEX "Meal_kind_time_idx" ON "Meal"("kind", "time");
