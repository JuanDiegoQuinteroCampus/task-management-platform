import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
// This module defines a global PrismaModule that provides the PrismaService, allowing it to be injected into other modules without needing to import it explicitly each time.