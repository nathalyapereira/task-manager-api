import { IsEnum, IsOptional, IsString, MinLength } from 'class-validator';
import { TarefaStatus } from '../interfaces/tarefa.enum';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class AtualizarTarefaDto {
  @ApiProperty({ example: 'Estudar NestJS avançado' })
  @IsString()
  @MinLength(3)
  titulo: string;

  @ApiPropertyOptional({ example: 'Focar em interceptors e pipes' })
  @IsString()
  @IsOptional()
  descricao?: string;

  @ApiPropertyOptional({ enum: TarefaStatus, example: TarefaStatus.PENDENTE })
  @IsEnum(TarefaStatus)
  @IsOptional()
  status?: TarefaStatus;
}
