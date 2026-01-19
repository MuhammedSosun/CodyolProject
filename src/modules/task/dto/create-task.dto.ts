import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  IsUUID,
  IsDateString,
} from 'class-validator';
import { TaskStatus } from '../enums/task-status.enum';

export class CreateTaskDto {
  @ApiProperty({
  example: 'customer-uuid',
  description: 'Görevin ait olduğu müşteri',
})
@IsUUID('4', { message: 'Geçerli bir müşteri seçilmelidir.' })
@IsNotEmpty({ message: 'Müşteri zorunludur.' })
customerId: string;


  @ApiProperty({ example: 'Teklif hazırlığı' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(160)
  title: string;

  @ApiProperty({
  example: 'Teklif hazırlık süreci açıklaması',
  description: 'Görev açıklaması',
})
@IsString()
@IsNotEmpty({ message: 'Açıklama zorunludur.' })
@MaxLength(1000)
description: string;


  @ApiProperty({
  enum: TaskStatus,
  example: TaskStatus.NEW,
  description: 'Görev durumu',
})
@IsEnum(TaskStatus, {
  message: 'Geçerli bir görev durumu seçilmelidir.',
})
@IsNotEmpty({ message: 'Görev durumu zorunludur.' })
status: TaskStatus;



  @ApiProperty({
  example: '2025-01-10',
  description: 'Görev başlangıç tarihi',
})
@IsDateString({}, { message: 'Geçerli bir başlangıç tarihi girilmelidir.' })
@IsNotEmpty({ message: 'Başlangıç tarihi zorunludur.' })
startDate: string;


  @ApiProperty({
  example: '2025-01-20',
  description: 'Görev bitiş tarihi',
})
@IsDateString({}, { message: 'Geçerli bir bitiş tarihi girilmelidir.' })
@IsNotEmpty({ message: 'Bitiş tarihi zorunludur.' })
endDate: string;

}
