import { IsEnum, IsOptional, IsString, MinLength } from 'class-validator';
import { TarefaStatus } from '../interfaces/tarefa.enum';

export class AtualizarTarefaDto {
  @IsString()
  @MinLength(3)
  titulo: string;

  @IsString()
  @IsOptional()
  descricao?: string;

  @IsEnum(TarefaStatus)
  @IsOptional()
  status?: TarefaStatus;
}
