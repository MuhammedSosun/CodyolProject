import { Module } from "@nestjs/common";
import { TeamsController } from "./teams.controller";
import { TeamsService } from "./teams.service";
import { PrismaModule } from "src/prisma/prisma.module";
import { LeavesModule } from "./leaves/leaves.module";

@Module({
  imports: [
    PrismaModule,LeavesModule,
  ],
  controllers: [TeamsController],
  providers: [TeamsService],
})
export class TeamsModule {}
