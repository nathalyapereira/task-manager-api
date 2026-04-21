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
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { TarefaStatus } from './interfaces/tarefa.enum';

@ApiTags('Tarefas')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('tarefas')
export class TarefasController {
  constructor(private readonly tarefasService: TarefasService) {}

  @Get('filtrados')
  @ApiOperation({ summary: 'Listar tarefas do usuário autenticado' })
  @ApiQuery({ name: 'status', enum: TarefaStatus, required: false })
  @ApiResponse({ status: 200, description: 'Lista de tarefas' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  obterFiltrados(
    @Query() filtro: FiltrarTarefaDto,
    @GetUsuario() usuario: Usuario,
  ) {
    return this.tarefasService.obterFiltrados(usuario, filtro);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar tarefa por ID' })
  @ApiParam({ name: 'id', description: 'UUID da tarefa' })
  @ApiResponse({ status: 200, description: 'Tarefa encontrada' })
  @ApiResponse({ status: 404, description: 'Tarefa não encontrada' })
  @ApiResponse({ status: 403, description: 'Acesso negado' })
  findOne(@Param('id') id: string, @GetUsuario() usuario: Usuario) {
    return this.tarefasService.findOne(id, usuario);
  }

  @Post('criar')
  @ApiOperation({ summary: 'Criar nova tarefa' })
  @ApiResponse({ status: 201, description: 'Tarefa criada com sucesso' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  criar(@Body() dto: CriarTarefaDto, @GetUsuario() usuario: Usuario) {
    return this.tarefasService.criar(dto, usuario);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Editar tarefa' })
  @ApiParam({ name: 'id', description: 'UUID da tarefa' })
  @ApiResponse({ status: 200, description: 'Tarefa atualizada' })
  @ApiResponse({ status: 404, description: 'Tarefa não encontrada' })
  atualizar(
    @Param('id') id: string,
    @Body() dto: AtualizarTarefaDto,
    @GetUsuario() usuario: Usuario,
  ) {
    return this.tarefasService.atualizar(id, dto, usuario);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Deletar tarefa' })
  @ApiParam({ name: 'id', description: 'UUID da tarefa' })
  @ApiResponse({ status: 200, description: 'Tarefa deletada com sucesso' })
  @ApiResponse({ status: 404, description: 'Tarefa não encontrada' })
  remover(@Param('id') id: string, @GetUsuario() usuario: Usuario) {
    return this.tarefasService.remover(id, usuario);
  }
}
