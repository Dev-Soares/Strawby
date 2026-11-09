-- Limpeza: o mesmo aparelho acumulava uma linha por rotação do token FCM
-- (upsert era chaveado pelo token, não pelo aparelho), então o usuário recebia
-- a mesma push 2-3x. Remove tokens mortos e mantém só o mais recente por usuário.
DELETE FROM "NotificationToken"
WHERE "createdAt" < NOW() - INTERVAL '30 days';

DELETE FROM "NotificationToken" t
WHERE EXISTS (
  SELECT 1
  FROM "NotificationToken" n
  WHERE n."userId" = t."userId"
    AND n."createdAt" > t."createdAt"
);

-- AlterTable
ALTER TABLE "NotificationToken" ADD COLUMN     "deviceId" TEXT;
ALTER TABLE "NotificationToken" ADD COLUMN     "updatedAt" TIMESTAMP(3);

-- Backfill: linhas antigas não têm aparelho conhecido. O deviceId aleatório
-- nunca casa com o do cliente, então o próximo re-registro substitui a linha
-- (o service remove o registro antigo que detém o token antes do upsert).
UPDATE "NotificationToken" SET "deviceId" = gen_random_uuid()::text WHERE "deviceId" IS NULL;
UPDATE "NotificationToken" SET "updatedAt" = "createdAt" WHERE "updatedAt" IS NULL;

ALTER TABLE "NotificationToken" ALTER COLUMN "deviceId" SET NOT NULL;
ALTER TABLE "NotificationToken" ALTER COLUMN "updatedAt" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "NotificationToken_userId_deviceId_key" ON "NotificationToken"("userId", "deviceId");
