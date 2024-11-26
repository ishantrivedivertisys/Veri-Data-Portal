import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class ChangePasswordDto {
    @ApiProperty()
    @IsNotEmpty()
    userId: number;
  
    @ApiProperty()
    @IsNotEmpty()
    currentPassword: string;
  
    @ApiProperty()
    @IsNotEmpty()
    newPassword: string;
}