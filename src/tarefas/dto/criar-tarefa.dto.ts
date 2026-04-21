import { IsEnum, IsOptional, IsString, MinLength } from 'class-validator';
import { TarefaStatus } from '../interfaces/tarefa.enum';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CriarTarefaDto {
  @ApiProperty({ example: 'Estudar NestJS' })
  @IsString()
  @MinLength(3)
  titulo: string;

  @ApiPropertyOptional({ example: 'Focar nos módulos e guards' })
  @IsString()
  @IsOptional()
  descricao?: string;

  @ApiPropertyOptional({ enum: TarefaStatus, example: TarefaStatus.PENDENTE })
  @IsEnum(TarefaStatus)
  @IsOptional()
  status?: TarefaStatus;
}
