import { Module } from '@nestjs/common';
import { DrizzleModule } from 'src/drizzle/drizzle.module';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [DrizzleModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
