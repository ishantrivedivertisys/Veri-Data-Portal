import {
    IsDefined,
    IsEmail,
    IsNotEmptyObject,
    IsObject,
    IsOptional,
    IsString,
    ValidateNested,
  } from 'class-validator';
  import { Type } from 'class-transformer';
  import { Stream } from 'stream';

  export class CommonMailDto {
    to: string;
  
  }
  

  