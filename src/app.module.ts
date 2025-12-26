import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';

import { PrismaModule } from './prisma/prisma.module';
import { OrganizationModule } from './modules/organization/organization.module';
import { CustomerModule } from './modules/customer/customer.module';
import { TaskModule } from './modules/task/task.module';
import { ActivityModule } from './modules/activity/activity.module';
import { AuthModule } from './modules/auth/auth.module';

import { JwtAuthGuard } from './modules/auth/guards/jwt-auth.guard';

@Module({
    imports: [
        PrismaModule,
        OrganizationModule,
        CustomerModule,
        TaskModule,
        ActivityModule,
        AuthModule,
    ],
    providers: [
        {
            provide: APP_GUARD,
            useClass: JwtAuthGuard,
        },
    ],
})
export class AppModule { }
