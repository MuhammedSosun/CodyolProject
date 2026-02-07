import { Module } from "@nestjs/common";
import { TeamsController } from "./teams.controller";
import { TeamsService } from "./teams.service";
import { PrismaModule } from "src/prisma/prisma.module";
import { LeavesModule } from "./leaves/leaves.module";
import { PayrollModule } from "./payroll/payroll.module";

@Module({
  imports: [
    PrismaModule,LeavesModule,PayrollModule
  ],
  controllers: [TeamsController],
  providers: [TeamsService],
})
export class TeamsModule {}
