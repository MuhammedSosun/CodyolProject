import { Module } from '@nestjs/common';
import { ProposalController } from './proposal.controller';
import { ProposalService } from './proposal.service';
import { ProposalRepository } from './proposal.repository';
import { ActivityModule } from '../activity/activity.module';

@Module({
  imports: [ActivityModule],
  controllers: [ProposalController],
  providers: [ProposalService, ProposalRepository],
})
export class ProposalModule { }
