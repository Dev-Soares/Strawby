-- Set role default to 'user' (must run after enum value is committed)
ALTER TABLE "User" ALTER COLUMN "role" SET DEFAULT 'user';
