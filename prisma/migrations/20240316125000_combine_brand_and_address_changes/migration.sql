-- CreateTable
CREATE TABLE IF NOT EXISTS "Brand" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "notification" TEXT NOT NULL,

    CONSTRAINT "Brand_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "Brand_name_key" ON "Brand"("name");

-- AlterTable
ALTER TABLE "Claim" 
ADD COLUMN IF NOT EXISTS "street" TEXT,
ADD COLUMN IF NOT EXISTS "postalCode" TEXT,
ADD COLUMN IF NOT EXISTS "city" TEXT,
ADD COLUMN IF NOT EXISTS "notificationAcknowledged" BOOLEAN DEFAULT false;

-- Update existing records
UPDATE "Claim" SET 
  "street" = "address",
  "postalCode" = '',
  "city" = ''
WHERE "address" IS NOT NULL AND "street" IS NULL;

-- You may choose to drop the old address column if you no longer need it
-- ALTER TABLE "Claim" DROP COLUMN IF EXISTS "address";
