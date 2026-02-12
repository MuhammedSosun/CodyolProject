import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';

import { PrismaModule } from './prisma/prisma.module';
import { CustomerModule } from './modules/customer/customer.module';
import { TaskModule } from './modules/task/task.module';
import { ActivityModule } from './modules/activity/activity.module';
import { AuthModule } from './modules/auth/auth.module';
import { ProposalModule } from './modules/Proposal/proposal.module';
import { ProfileModule } from './modules/profile/profile.module';
import { TeamsModule } from './modules/team/teams.module';
import { TransactionModule } from './modules/transaction/transaction.module';
import { LeavesModule } from './modules/team/leaves/leaves.module';
import { PayrollModule } from './modules/team/payroll/payroll.module';

import { JwtAuthGuard } from './modules/auth/guards/jwt-auth.guard';
import { UserModule } from './modules/user/user.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';

import { FilesModule } from './modules/files/files.module';

@Module({
  imports: [
    PrismaModule,
    CustomerModule,
    TaskModule,
    ActivityModule,
    AuthModule,
    ProposalModule,
    ProfileModule,
    TeamsModule,
    LeavesModule,
    PayrollModule,
    TransactionModule,
    UserModule,
    DashboardModule,

    FilesModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule { }