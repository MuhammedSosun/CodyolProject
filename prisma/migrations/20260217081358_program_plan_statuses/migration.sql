-- CreateEnum
CREATE TYPE "ProgramStatus" AS ENUM ('NEXT', 'IN_PROGRESS', 'WAITING', 'DONE');

-- CreateEnum
CREATE TYPE "ProgramType" AS ENUM ('MOBIL', 'WEB', 'TASARIM', 'BACKEND', 'FRONTEND', 'DIGER');

-- CreateEnum
CREATE TYPE "ProgramStage" AS ENUM ('ANALIZ', 'TASARIM', 'KODLAMA', 'TEST', 'YAYIN', 'DIGER');

-- CreateTable
CREATE TABLE "ProgramPlan" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "type" "ProgramType" NOT NULL DEFAULT 'DIGER',
    "projectName" TEXT,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "stage" "ProgramStage" NOT NULL DEFAULT 'DIGER',
    "status" "ProgramStatus" NOT NULL DEFAULT 'NEXT',
    "assigneeId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProgramPlan_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ProgramPlan" ADD CONSTRAINT "ProgramPlan_assigneeId_fkey" FOREIGN KEY ("assigneeId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
