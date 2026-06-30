import { Module } from '@nestjs/common';
import { AuthGuard } from './auth.guard';
import { OptionalAuthGuard } from './optionalAuth.guard';
import { OwnershipGuard } from './ownership.guard';
import { RolesGuard } from './roles.guard';

@Module({
  providers: [AuthGuard, OptionalAuthGuard, OwnershipGuard, RolesGuard],
  exports: [AuthGuard, OptionalAuthGuard, OwnershipGuard, RolesGuard],
})
export class AuthGuardModule {}
