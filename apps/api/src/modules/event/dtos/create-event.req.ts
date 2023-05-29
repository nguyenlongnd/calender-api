import { ApiProperty, ApiPropertyOptional, OmitType } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  Min,
  IsNumberString,
  Matches,
  IsEmail,
  ValidateNested,
  ArrayNotEmpty,
  IsObject,
  IsArray,
  IsNotEmptyObject,
  IsDateString,
  IsBoolean
} from 'class-validator'

export class CreateEventReq {}
