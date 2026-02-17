-- AlterTable
ALTER TABLE "ProgramCard" ADD COLUMN     "assigneeUserId" TEXT;

-- CreateIndex
CREATE INDEX "ProgramCard_assigneeUserId_idx" ON "ProgramCard"("assigneeUserId");

-- AddForeignKey
ALTER TABLE "ProgramCard" ADD CONSTRAINT "ProgramCard_assigneeUserId_fkey" FOREIGN KEY ("assigneeUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
