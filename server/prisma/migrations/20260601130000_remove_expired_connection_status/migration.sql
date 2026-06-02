-- Remove EXPIRED value from ConnectionRequestStatus enum
-- Safe: no records with status = 'EXPIRED' exist in production

-- Step 1: drop the column default (it references the old enum)
ALTER TABLE "ConnectionRequest" ALTER COLUMN "status" DROP DEFAULT;

-- Step 2: create new enum without EXPIRED
CREATE TYPE "ConnectionRequestStatus_new" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED');

-- Step 3: alter the column to use the new type
ALTER TABLE "ConnectionRequest"
  ALTER COLUMN "status" TYPE "ConnectionRequestStatus_new"
  USING "status"::text::"ConnectionRequestStatus_new";

-- Step 4: drop old type
DROP TYPE "ConnectionRequestStatus";

-- Step 5: rename new type to original name
ALTER TYPE "ConnectionRequestStatus_new" RENAME TO "ConnectionRequestStatus";

-- Step 6: re-add the default with the new type
ALTER TABLE "ConnectionRequest" ALTER COLUMN "status" SET DEFAULT 'PENDING';
