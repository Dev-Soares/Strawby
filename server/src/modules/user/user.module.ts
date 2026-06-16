import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { DatabaseModule } from '../database/database.module';
import { HashModule } from 'src/common/hash/hash.module';
import { AuthGuardModule } from 'src/common/guards/auth/auth.module';
import { EmailModule } from '../email/email.module';
import { PatientModule } from '../patient/patient.module';

@Module({
  controllers: [UserController],
  providers: [UserService],
  imports: [DatabaseModule, HashModule, AuthGuardModule, EmailModule, PatientModule],
  exports: [UserService],
})
export class UserModule {}
