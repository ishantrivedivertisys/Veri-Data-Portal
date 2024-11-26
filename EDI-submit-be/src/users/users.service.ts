import { BadRequestException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Messages } from 'src/common/constants/messages';
import { NotFoundException } from 'src/common/helpers/exception/NotFoundException';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/request/create-user.dto';
import { UpdateUserDto } from './dto/request/update-user.dto';
import { updatePasswordDto } from './dto/request/update-password.dto';
import { UserResponse } from './dto/response/users-response';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcryptjs';
import { MailService } from 'src/common/helpers/mail/mail.service';
import { IMail } from 'src/common/model/interface/IMail';
import { TemplateTypes } from 'src/common/helpers/mail/enums/template.code.enum';
import { UsersStatus } from 'src/common/model/usersStatus';
import { VerifyOtpDto } from './dto/request/verify-otp.dto';
import { JwtService } from '@nestjs/jwt';
import { IFindAllUsers } from './interface/user.find';
import { UpdateUserStatusDto } from './dto/request/update-user-status.dto';
import { ChangePasswordDto } from './dto/request/change-password.dto';
const moment = require('moment');

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
    private mailService: MailService,
    private jwtService: JwtService,
  ) {}

  async create(request: CreateUserDto): Promise<any> {
    const otp = this.generateRandomOTP(6);
    request.otp = otp;
    request.date = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
    
    const existingUserEmail = await this.usersRepository.findOne({
      where: { email: request.email },
    });
    if (existingUserEmail) {
      throw new BadRequestException(`${Messages.Register.AlreadyExist}`);
    }
    if(request.dob > moment(new Date()).format('YYYY-MM-DD')) {
      throw new BadRequestException(`${Messages.UserModule.Birth}`);
    }
    if (request.password) {
      await this.checkPasswordValidity(request.password);
      request.password = await bcrypt.hashSync(request.password, 10);
    }
    const result = await this.usersRepository.save(request);

    var mail: IMail = {
      to: request.email,
      otp: otp,
      subject: 'User Registration',
      data: request,
      cc: '',
    };

    await this.mailService.sendingMail(mail, TemplateTypes.user_register);

    // await this.usersRepository.save(result);
    if (result) {
      delete result.otp;
      delete result.password;
    }
    return {
      statusCode: HttpStatus.OK,
      message: `${Messages.UserModule.Email}`,
      data: result,
    };
  }

  async verifyOtp(verifyOtpDto: VerifyOtpDto): Promise<any> {
    const res = await this.usersRepository.createQueryBuilder('user')
    .where({
      id: verifyOtpDto.id,
      email: verifyOtpDto.email,
      otp: verifyOtpDto.otp,
    })
    .getOne();

    if(!res){
      return { statusCode: HttpStatus.UNAUTHORIZED, message: `${Messages.UserModule.EmailOrOtpNotExist}` };
    }

    let currentTime  = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
    let startTime  = moment(res.date).format('YYYY-MM-DD HH:mm:ss');
    let endTime = moment(startTime).add(30, "minutes").format('YYYY-MM-DD HH:mm:ss');
    if(!moment(currentTime).isBetween(startTime, endTime)) {
      throw new HttpException(`${Messages.UserModule.ResendOtp}`, HttpStatus.GATEWAY_TIMEOUT)
    } else {
      if (res && verifyOtpDto.type == 'register') {
        await this.usersRepository.update(res.id, {
          status: UsersStatus.ACTIVE,
          otp: null,
          date: null
        });
        delete res.otp;
        delete res.password;
        return {
          statusCode: HttpStatus.OK,
          data: res,
          message: `${Messages.UserModule.AccountCreated}`,
        };
      } 
      // else if (res && verifyOtpDto.type == 'login') {
      //   await this.usersRepository.update(res.id, { otp: null, date: null });
      //   let payload = { email: res.email, sub: res.id };
        
      //   const user = await this.usersRepository.createQueryBuilder('user')
      //   .where({
      //     id: res.id,
      //     email: res.email
      //   }) 
      //   .getOne();

    
      //   delete user.otp;
      //   delete user.password;
      //   return {
      //     statusCode: HttpStatus.OK,
      //     message: `${Messages.Login.Authorised}`,
      //     data: { access_token: this.jwtService.sign(payload), ...user },
      //   };
      // } 
      else {
        return { statusCode: HttpStatus.UNAUTHORIZED, message: `${Messages.UserModule.Otp}` };
      }
    }
  }

  async findAll(options: IFindAllUsers): Promise<any> {
    const query = await this.usersRepository.createQueryBuilder('user');
    if (options.search) {
      query.andWhere('user.firstName like :firstName', {
        firstName: `%${options.search}%`,
      });
      query.orWhere('user.lastName like :lastName', {
        lastName: `%${options.search}%`,
      });
      query.orWhere('user.email like :email', {
        email: `%${options.search}%`,
      });
      query.orWhere('user.address like :address', {
        address: `%${options.search}%`,
      });
      query.orWhere('user.city like :city', {
        city: `%${options.search}%`,
      });
      query.orWhere('user.state like :state', {
        state: `%${options.search}%`,
      });
      query.orWhere('user.phone like :phone', {
        phone: `%${options.search}%`,
      });
    }

    if (options.skip) query.offset(options.skip);

    if (options.limit) query.limit(options.limit);

    if (options.sortColumn) {
      query.orderBy(`user.${options.sortColumn}`, options.sortType);
    }

    const [result, count] = await query.getManyAndCount();
    let sNo:number =0;
    result.map((user) => {
      sNo = sNo + 1; 
      user["sNo"] = sNo;
      delete user.otp;
      delete user.password;
    });
    if (result.length > 0) {
      return {
        statusCode: HttpStatus.OK,
        message: `${Messages.UserModule.UserFound}`,
        totalRows: count,
        data: result,
      };
    } else {
      return {
        statusCode: HttpStatus.NO_CONTENT,
        message: `${Messages.UserModule.UserNotFound}`,
      };
    }
  }

  async findOne(userId: number): Promise<any> {
    try {
      let user = await this.usersRepository.findOne({
        where: { id: userId },
      });
      if (user) {
        delete user.otp;
        delete user.password;
        return {
          statusCode: HttpStatus.OK,
          message: `${Messages.UserModule.UserFound}`,
          data: user,
        };
      } else {
        return {
          statusCode: HttpStatus.NO_CONTENT,
          message: `${Messages.UserModule.UserNotFound}`,
        };
      }
    } catch (error) {
      return {
        statusCode: HttpStatus.NO_CONTENT,
        message: `${Messages.UserModule.UserNotFound}`,
      };
    }
  }

  async update(userId: number, request: UpdateUserDto): Promise<any> {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
    });
    if (user) {

      if(request.email) {
        throw new BadRequestException(`${Messages.UserModule.EmailModified}`);
      }

      if(request.dob > moment(new Date()).format('YYYY-MM-DD')) {
        throw new BadRequestException(`${Messages.UserModule.Birth}`);
      }

      if (request.password) {
        await this.checkPasswordValidity(request.password);
        request.password = await bcrypt.hashSync(request.password, 10);
      }
      
      let requesWithOutSkills = request;
      delete requesWithOutSkills.skills;

      const result = await this.usersRepository.update(userId, requesWithOutSkills);

      if (!result) {
        throw new NotFoundException(`${Messages.UserModule.UserNotFound}`);
      }

      const updateUser = await this.usersRepository.findOne({
        where: { id: userId },
      });
      if (updateUser) {
        delete updateUser.otp;
        delete updateUser.password;
      }
      return {
        statusCode: HttpStatus.OK,
        message: `${Messages.UserModule.UserUpdated}`,
        data: updateUser,
      };
    } else {
      return {
        statusCode: HttpStatus.NO_CONTENT,
        message: `${Messages.UserModule.UserNotFound}`,
      };
    }
  }

  async remove(userId: number): Promise<any> {
    const deletedUser = await this.usersRepository.findOne({
      where: {
        id: userId,
      },
    });
    if (deletedUser) {
      await this.usersRepository.delete(userId);
      delete deletedUser.otp;
      delete deletedUser.password;
      return {
        statusCode: HttpStatus.OK,
        message: `${Messages.UserModule.UserFound}`,
        data: deletedUser,
      };
    } else {
      return {
        statusCode: HttpStatus.NO_CONTENT,
        message: `${Messages.UserModule.UserNotFound}`,
      }
    }
  }

  async customQuery() {
    return this.usersRepository
      .createQueryBuilder('user')
      .select('name')
      .orderBy('name');
  }

  async findByEmail(email: string): Promise<UserResponse> {
    return await this.usersRepository.findOne({ where: { email: email } });
  }

  async resendOtp(data: any): Promise<any> {
    const otp = this.generateRandomOTP(6);
    const User = await this.usersRepository.find({
      where: { email: data.email },
    });
    User.map((user) => {
      delete user.otp;
      delete user.password;
    });
    if (User.length > 0) {
      const date = moment(new Date).format('YYYY-MM-DD HH:mm:ss')
      await this.usersRepository.update(User[0].id, { otp: otp, date: date });
      var mail: IMail = {
        to: data.email,
        otp: otp,
        subject: data.subject,
        cc: '',
      };

      await this.mailService.sendingMail(mail, TemplateTypes.user_register);
      return {
        statusCode: HttpStatus.OK,
        message: `${Messages.UserModule.OtpSuccess}`,
        data: User[0],
      };
    } else {
      return {
        statusCode: HttpStatus.FORBIDDEN,
        message: `${Messages.UserModule.EmailNotExist}`,
      };
    }
  }

  async updatePassword(updatePasswordDto: updatePasswordDto) {
    try {
      const result = await this.usersRepository.findOne({
        where: {
          id: updatePasswordDto.id,
          email: updatePasswordDto.email,
          otp: updatePasswordDto.otp,
        },
      });

      if (result) {
        await this.usersRepository.update(result.id, {
          password: await bcrypt.hashSync(updatePasswordDto.password, 10),
          otp: null,
        });
        delete result.otp;
        delete result.password;
        return {
          statusCode: HttpStatus.OK,
          message: `${Messages.UserModule.PasswordUpdate}`,
          data: result,
        };
      } else {
        return {
          statusCode: HttpStatus.UNAUTHORIZED,
          message: `${Messages.UserModule.EmailOrOtpNotExist}`,
        };
      }
    } catch (error) {
      console.log(error);
    }
  }

  generateRandomOTP(digits: number): string {
    const min = Math.pow(10, digits - 1);
    const max = Math.pow(10, digits) - 1;
    const otp = Math.floor(Math.random() * (max - min + 1)) + min;
    return otp.toString().padStart(digits, '0');
  }

  async updateUserStatus(updateUserStatusDto: UpdateUserStatusDto) {
    try {
      const result = await this.usersRepository.findOne({
        where: {
          id: updateUserStatusDto.id,
        }
      });

      if (result) {
        await this.usersRepository.update(result.id, {
          status: updateUserStatusDto.status
        });
        
        let message;
        if(updateUserStatusDto.status == UsersStatus.ACTIVE){
          message = `${Messages.UserModule.UserActive}`;
        }else{
          message = `${Messages.UserModule.UserTemporarily}`;
        }

        delete result.otp;
        delete result.password;
        return {
          statusCode: HttpStatus.OK,
          message: message,
          data: result,
        };
      } else {
        return {
          statusCode: HttpStatus.NO_CONTENT,
          message: `${Messages.UserModule.UserNotFound}`,
        };
      }
    } catch (error) {
      console.log(error);
    }
  }

  async changePassword(changePassword: ChangePasswordDto) {
    const user = await this.usersRepository.findOne({
      where:
        { id: changePassword.userId, status: UsersStatus.ACTIVE }
    });
    try {
      if (user) {
        const isMatch = await bcrypt.compare(changePassword.currentPassword, user.password);
        if (isMatch) {
          if(changePassword.newPassword) {
            await this.checkPasswordValidity(changePassword.newPassword);
          }
          if(changePassword.newPassword === changePassword.currentPassword) {
            throw new BadRequestException(`${Messages.UserModule.Password}`);
          }
          await this.usersRepository.update(changePassword.userId, {
            password: await bcrypt.hashSync(changePassword.newPassword, 10),
          })
          return {
            status: HttpStatus.OK,
            message: `${Messages.UserModule.PasswordChanged}`
          }
        }
        throw new BadRequestException(`${Messages.UserModule.PasswordCorrect}`);
      }
      throw new BadRequestException(`${Messages.UserModule.ValidUser}`);
    }
    catch (err) {
      throw (err)
    }
  }

  /**
 * @param {string} value: passwordValue
 */
  async checkPasswordValidity(value) {
    const isValidLength = /^.{8,20}$/;
    if (!isValidLength.test(value)) {
      throw new BadRequestException(`${Messages.UserModule.PasswordLength}`);
    }

    const isContainsUppercase = /^(?=.*[A-Z]).*$/;
    if (!isContainsUppercase.test(value)) {
      throw new BadRequestException(`${Messages.UserModule.PasswordUppercase}`);
    }

    const isContainsSymbol =
      /^(?=.*[~`!@#$%^&*()--+={}\[\]|\\:;"'<>,.?/_₹]).*$/;
    if (!isContainsSymbol.test(value)) {
      throw new BadRequestException(`${Messages.UserModule.PasswordSpecialChars}`);
    }

    return null;
  }


  async createAdmin(request: CreateUserDto): Promise<any> {
    const existingUserEmail = await this.usersRepository.findOne({
      where: { email: request.email },
    });
    if (existingUserEmail) {
      throw new BadRequestException(`${Messages.Register.AlreadyExist}`);
    }
    if(request.dob > moment(new Date()).format('YYYY-MM-DD')) {
      throw new BadRequestException(`${Messages.UserModule.Birth}`);
    }
    if (request.password) {
      await this.checkPasswordValidity(request.password);
      request.password = await bcrypt.hashSync(request.password, 10);
    }
    const result = this.usersRepository.create(request);
    await this.usersRepository.save(result);
    if (result) {
      delete result.otp;
      delete result.password;
    }
    return {
      statusCode: HttpStatus.OK,
      message: `${Messages.UserModule.Email}`,
      data: result,
    };
  }
}
