-- DropForeignKey
ALTER TABLE IF EXISTS "PushSubscription" DROP CONSTRAINT IF EXISTS "PushSubscription_userId_fkey";

-- DropTable
DROP TABLE IF EXISTS "PushSubscription";

-- CreateTable
CREATE TABLE "NotificationToken" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "NotificationToken_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "NotificationToken_token_key" ON "NotificationToken"("token");

-- CreateIndex
CREATE INDEX "NotificationToken_userId_idx" ON "NotificationToken"("userId");

-- AddForeignKey
ALTER TABLE "NotificationToken" ADD CONSTRAINT "NotificationToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
