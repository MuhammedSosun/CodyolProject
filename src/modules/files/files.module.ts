import { Module } from '@nestjs/common';
import { ContractsModule } from './contracts/contracts.module';
import { SourceLinksModule } from './source-links/source-links.module';
import { LicensesModule } from './licenses/licenses.module';
import { HostingModule } from './hosting/hosting.module';

@Module({
  imports: [ContractsModule, SourceLinksModule, LicensesModule, HostingModule],
})
export class FilesModule { }