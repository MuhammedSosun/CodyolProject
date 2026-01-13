import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';

import { PrismaModule } from './prisma/prisma.module';
import { CustomerModule } from './modules/customer/customer.module';
import { TaskModule } from './modules/task/task.module';
import { ActivityModule } from './modules/activity/activity.module';
import { AuthModule } from './modules/auth/auth.module';

import { JwtAuthGuard } from './modules/auth/guards/jwt-auth.guard';
import { ProposalModule } from './modules/Proposal/proposal.module';
import { ProfileModule } from './modules/profile/profile.module';
import { TeamsModule } from './team/teams.module';

@Module({
    imports: [
        PrismaModule,
        CustomerModule,
        TaskModule,
        ActivityModule,
        AuthModule,
        ProposalModule,
        ProfileModule,
        TeamsModule
    ],
    providers: [
        {
            provide: APP_GUARD,
            useClass: JwtAuthGuard,
        },
    ],
})
export class AppModule { }
