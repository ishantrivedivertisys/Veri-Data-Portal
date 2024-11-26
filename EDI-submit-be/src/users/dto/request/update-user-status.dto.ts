import { IsEnum, IsNotEmpty, IsNumber } from 'class-validator';
import { Transform } from 'class-transformer';
import { UsersStatus } from 'src/common/model/usersStatus';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserStatusDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  id?: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsEnum(UsersStatus)
  @Transform(({ value }) => value || UsersStatus.INACTIVE)
  status?: string;
}
