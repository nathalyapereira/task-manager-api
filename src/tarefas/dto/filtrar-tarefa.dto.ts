import { IsEnum, IsOptional } from 'class-validator';
import { TarefaStatus } from '../interfaces/tarefa.enum';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class FiltrarTarefaDto {
  @ApiPropertyOptional({ enum: TarefaStatus, example: TarefaStatus.PENDENTE })
  @IsEnum(TarefaStatus)
  @IsOptional()
  status?: TarefaStatus;
}
