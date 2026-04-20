import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Tarefa } from './entities/tarefa/tarefa.entity';
import { Repository } from 'typeorm';
import { CriarTarefaDto } from './dto/criar-tarefa.dto';
import { Usuario } from 'src/usuarios/entities/usuario/usuario.entity';
import { FiltrarTarefaDto } from './dto/filtrar-tarefa.dto';

@Injectable()
export class TarefasService {
  constructor(
    @InjectRepository(Tarefa)
    private readonly tarefaRepository: Repository<Tarefa>,
  ) {}

  async criar(dto: CriarTarefaDto, usuario: Usuario): Promise<Tarefa> {
    const tarefa = this.tarefaRepository.create({ ...dto, usuario });
    return this.tarefaRepository.save(tarefa);
  }

  async obterFiltrados(
    usuario: Usuario,
    filtro: FiltrarTarefaDto,
  ): Promise<Tarefa[]> {
    const query = this.tarefaRepository.createQueryBuilder('tarefa');

    query.where('tarefa.usuarioId = :usuarioId', { usuarioId: usuario.id });

    if (filtro.status) {
      query.andWhere('tarefa.status = :status', { status: filtro.status });
    }

    query.orderBy('tarefa.criadoEm', 'DESC');

    return query.getMany();
  }

  async findOne(id: string, usuario: Usuario): Promise<Tarefa> {
    const tarefa = await this.tarefaRepository.findOne({ where: { id } });

    if (!tarefa) {
      throw new NotFoundException('Tarefa não encontrada');
    }

    if (tarefa.usuarioId !== usuario.id) {
      throw new ForbiddenException('Acesso negado');
    }

    return tarefa;
  }

  async atualizar(
    id: string,
    dto: CriarTarefaDto,
    usuario: Usuario,
  ): Promise<Tarefa> {
    const tarefa = await this.findOne(id, usuario);
    Object.assign(tarefa, dto);
    return this.tarefaRepository.save(tarefa);
  }

  async remover(id: string, usuario: Usuario): Promise<{ mensagem: string }> {
    const tarefa = await this.findOne(id, usuario);
    await this.tarefaRepository.remove(tarefa);
    return { mensagem: 'Tarefa removida com sucesso' };
  }
}
