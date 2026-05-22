import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { DatabaseModule } from '../database/database.module';
import { HashModule } from 'src/common/hash/hash.module';
import { AuthGuardModule } from 'src/common/guards/auth/auth.module';

@Module({
  controllers: [UserController],
  providers: [UserService],
  imports: [DatabaseModule, HashModule, AuthGuardModule],
  exports: [UserService],
})
export class UserModule {}
