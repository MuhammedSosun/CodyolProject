-- CreateEnum
CREATE TYPE "FileStatus" AS ENUM ('ACTIVE', 'INACTIVE');

-- CreateEnum
CREATE TYPE "SourceLinkType" AS ENUM ('FRONTEND', 'BACKEND', 'LIVE', 'OTHER');

-- CreateTable
CREATE TABLE "ContractFile" (
    "id" TEXT NOT NULL,
    "createdByUserId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "status" "FileStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "ContractFile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SourceCodeLink" (
    "id" TEXT NOT NULL,
    "createdByUserId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "type" "SourceLinkType" NOT NULL DEFAULT 'OTHER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "SourceCodeLink_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "License" (
    "id" TEXT NOT NULL,
    "createdByUserId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "provider" TEXT,
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),
    "status" "FileStatus" NOT NULL DEFAULT 'ACTIVE',
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "License_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HostingInfo" (
    "id" TEXT NOT NULL,
    "createdByUserId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "provider" TEXT,
    "ip" TEXT,
    "domain" TEXT,
    "dbPassword" TEXT,
    "note" TEXT,
    "status" "FileStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "HostingInfo_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ContractFile_createdByUserId_idx" ON "ContractFile"("createdByUserId");

-- CreateIndex
CREATE INDEX "ContractFile_status_idx" ON "ContractFile"("status");

-- CreateIndex
CREATE INDEX "ContractFile_deletedAt_idx" ON "ContractFile"("deletedAt");

-- CreateIndex
CREATE INDEX "SourceCodeLink_createdByUserId_idx" ON "SourceCodeLink"("createdByUserId");

-- CreateIndex
CREATE INDEX "SourceCodeLink_type_idx" ON "SourceCodeLink"("type");

-- CreateIndex
CREATE INDEX "SourceCodeLink_deletedAt_idx" ON "SourceCodeLink"("deletedAt");

-- CreateIndex
CREATE INDEX "License_createdByUserId_idx" ON "License"("createdByUserId");

-- CreateIndex
CREATE INDEX "License_status_idx" ON "License"("status");

-- CreateIndex
CREATE INDEX "License_deletedAt_idx" ON "License"("deletedAt");

-- CreateIndex
CREATE INDEX "HostingInfo_createdByUserId_idx" ON "HostingInfo"("createdByUserId");

-- CreateIndex
CREATE INDEX "HostingInfo_status_idx" ON "HostingInfo"("status");

-- CreateIndex
CREATE INDEX "HostingInfo_deletedAt_idx" ON "HostingInfo"("deletedAt");

-- AddForeignKey
ALTER TABLE "ContractFile" ADD CONSTRAINT "ContractFile_createdByUserId_fkey" FOREIGN KEY ("createdByUserId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SourceCodeLink" ADD CONSTRAINT "SourceCodeLink_createdByUserId_fkey" FOREIGN KEY ("createdByUserId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "License" ADD CONSTRAINT "License_createdByUserId_fkey" FOREIGN KEY ("createdByUserId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HostingInfo" ADD CONSTRAINT "HostingInfo_createdByUserId_fkey" FOREIGN KEY ("createdByUserId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
