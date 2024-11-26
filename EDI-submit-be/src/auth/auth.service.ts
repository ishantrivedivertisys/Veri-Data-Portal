import { Body, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TemplateTypes } from 'src/common/helpers/mail/enums/template.code.enum';
import { MailService } from 'src/common/helpers/mail/mail.service';
import { IMail } from 'src/common/model/interface/IMail';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { CreateUserDto } from 'src/users/dto/request/create-user.dto';
import { Messages } from 'src/common/constants/messages';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { RolePermission } from 'src/role-permission/entities/role-permission.entity';
const moment = require('moment');

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private mailService: MailService,
    private jwtService: JwtService,
    @InjectRepository(User) private usersRepository: Repository<User>,
    @InjectRepository(RolePermission) private rolePermissionRepository: Repository<RolePermission>,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    if (user && (await bcrypt.compareSync(password, user.password))) {
      const { password: hashedPassword, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: LoginDto) {
    let result: any;
    let data = await this.validateUser(user.email, user.password);
    if (data) {
      if(data.status == "inactive"){
        return {
          statusCode: 403,
          message: `${Messages.AuthModule.AccountInactive}`,
        };
      }

      // const otp = this.generateRandomOTP(6);
      // const date = moment(new Date).format('YYYY-MM-DD HH:mm:ss')
      // await this.usersRepository.update(data.id, { otp: otp, date: date });

      // var mail: IMail = {
      //   to: data['email'],
      //   // otp: otp,
      //   subject: 'Verify User',
      //   data: data,
      //   cc: '',
      // };
      // await this.mailService.sendingMail(mail, TemplateTypes.user_register);

      // // delete data.otp;

      // return {
      //   statusCode: HttpStatus.OK,
      //   message: `${Messages.AuthModule.OTPSuccess}`,
      //   data: data
      // };

      //await this.usersRepository.update(data.id, { otp: null, date: null });
      let payload = { email: data.email, sub: data.id };
        
        const user = await this.usersRepository.createQueryBuilder('user')
        .leftJoinAndSelect('user.role', 'role')
        .where({
          id: data.id,
          email: data.email
        }) 
        .getOne();

        const permission = await this.rolePermissionRepository.createQueryBuilder('rolePermission')
        .select(["permission.permissionKey AS permissionKey"])
        .leftJoin('rolePermission.permission', 'permission')
        .where(`rolePermission.roleId = '${Number(user.roleId)}'`)
        .andWhere(`rolePermission.status = 'active'`)
        .getRawMany();

        let permissions = permission.map((x) => {
          return x.PERMISSIONKEY;
        })
        result = [user.role].map((x) => {
          return { ...user, permission: permissions}
        })
        payload['permission'] = permissions;

    
        delete user.password;
        return {
          statusCode: HttpStatus.OK,
          message: `${Messages.Login.Authorised}`,
          data: { access_token: this.jwtService.sign(payload), ...result[0] },
        };

    } else {
      return {
        statusCode: HttpStatus.FORBIDDEN,
        message: `${Messages.AuthModule.NotMatch}`,
      };
    }
  }

  generateRandomOTP(digits: number): string {
    const min = Math.pow(10, digits - 1);
    const max = Math.pow(10, digits) - 1;
    const otp = Math.floor(Math.random() * (max - min + 1)) + min;
    return otp.toString().padStart(digits, '0');
  }

  async registerUser(@Body() body: CreateUserDto) {
    return this.usersService.create(body);
  }
}
