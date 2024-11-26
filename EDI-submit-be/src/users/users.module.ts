import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { MailService } from 'src/common/helpers/mail/mail.service';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from 'src/auth/constants';

@Module({
  imports: [JwtModule.register({
    secret: jwtConstants.secret //, signOptions: { expiresIn: '600s' }
  }),TypeOrmModule.forFeature([User])],
  controllers: [UsersController],
  providers: [UsersService, MailService],
  exports: [UsersService]
})
export class UsersModule { }
