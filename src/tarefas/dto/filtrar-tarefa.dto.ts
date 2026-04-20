import { IsEnum, IsOptional } from 'class-validator';
import { TarefaStatus } from '../interfaces/tarefa.enum';

export class FiltrarTarefaDto {
  @IsEnum(TarefaStatus)
  @IsOptional()
  status?: TarefaStatus;
}
