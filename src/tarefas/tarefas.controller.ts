import { CriarTarefaDto } from './dto/criar-tarefa.dto';
import { TarefasService } from './tarefas.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { FiltrarTarefaDto } from './dto/filtrar-tarefa.dto';
import { GetUsuario } from 'src/auth/decorators/get-usuario.decorator';
import { Usuario } from 'src/usuarios/entities/usuario/usuario.entity';
import { AtualizarTarefaDto } from './dto/atualizar-tarefa.dto';

@UseGuards(JwtAuthGuard)
@Controller('tarefas')
export class TarefasController {
  constructor(private readonly tarefasService: TarefasService) {}

  @Get('filtrados')
  filtrarTarefas(
    @Query() filtro: FiltrarTarefaDto,
    @GetUsuario() usuario: Usuario,
  ) {
    return this.tarefasService.obterFiltrados(usuario, filtro);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @GetUsuario() usuario: Usuario) {
    return this.tarefasService.findOne(id, usuario);
  }

  @Post('criar')
  criar(@Body() dto: CriarTarefaDto, @GetUsuario() usuario: Usuario) {
    return this.tarefasService.criar(dto, usuario);
  }

  @Patch(':id')
  atualizar(
    @Param('id') id: string,
    @Body() dto: AtualizarTarefaDto,
    @GetUsuario() usuario: Usuario,
  ) {
    return this.tarefasService.atualizar(id, dto, usuario);
  }

  @Delete(':id')
  remover(@Param('id') id: string, @GetUsuario() usuario: Usuario) {
    return this.tarefasService.remover(id, usuario);
  }
}
