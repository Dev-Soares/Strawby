-- CreateTable
CREATE TABLE "PrivateFood" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "calories" DOUBLE PRECISION NOT NULL,
    "protein" DOUBLE PRECISION NOT NULL,
    "carbs" DOUBLE PRECISION NOT NULL,
    "fat" DOUBLE PRECISION NOT NULL,
    "fiber" DOUBLE PRECISION,
    "sodium" DOUBLE PRECISION,
    "servingSize" TEXT,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PrivateFood_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PrivateFood_userId_idx" ON "PrivateFood"("userId");

-- AddForeignKey
ALTER TABLE "PrivateFood" ADD CONSTRAINT "PrivateFood_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
