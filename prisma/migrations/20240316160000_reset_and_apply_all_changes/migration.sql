-- Drop existing tables
DROP TABLE IF EXISTS "Claim";
DROP TABLE IF EXISTS "Brand";
DROP TABLE IF EXISTS "_prisma_migrations";

-- Recreate _prisma_migrations table
CREATE TABLE "_prisma_migrations" (
    "id" VARCHAR(36) NOT NULL,
    "checksum" VARCHAR(64) NOT NULL,
    "finished_at" TIMESTAMP WITH TIME ZONE,
    "migration_name" VARCHAR(255) NOT NULL,
    "logs" TEXT,
    "rolled_back_at" TIMESTAMP WITH TIME ZONE,
    "started_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    "applied_steps_count" INTEGER NOT NULL DEFAULT 0,
    PRIMARY KEY ("id")
);

-- Recreate User table
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "isAdmin" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- Recreate Claim table with new structure
CREATE TABLE "Claim" (
    "id" TEXT NOT NULL,
    "orderNumber" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "street" TEXT,
    "postalCode" TEXT,
    "city" TEXT,
    "phoneNumber" TEXT NOT NULL,
    "brand" TEXT NOT NULL,
    "problemDescription" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "submissionDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "notificationAcknowledged" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "Claim_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "Claim_orderNumber_key" ON "Claim"("orderNumber");

-- Create Brand table
CREATE TABLE "Brand" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "notification" TEXT NOT NULL,
    CONSTRAINT "Brand_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "Brand_name_key" ON "Brand"("name");
