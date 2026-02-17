-- CreateEnum
CREATE TYPE "ProjectStatus" AS ENUM ('TEKLIF', 'GELISTIRME', 'TEST');

-- CreateEnum
CREATE TYPE "ProjectType" AS ENUM ('WEB', 'MOBIL', 'YAZILIM', 'TASARIM', 'DIGER');

-- CreateTable
CREATE TABLE "Project" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "customerId" TEXT,
    "type" "ProjectType" NOT NULL DEFAULT 'DIGER',
    "status" "ProjectStatus" NOT NULL DEFAULT 'TEKLIF',
    "price" DECIMAL(12,2),
    "currency" TEXT NOT NULL DEFAULT 'TRY',
    "deliveryDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Project_customerId_idx" ON "Project"("customerId");

-- CreateIndex
CREATE INDEX "Project_status_idx" ON "Project"("status");

-- CreateIndex
CREATE INDEX "Project_type_idx" ON "Project"("type");

-- CreateIndex
CREATE INDEX "Project_deletedAt_idx" ON "Project"("deletedAt");

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE SET NULL ON UPDATE CASCADE;
