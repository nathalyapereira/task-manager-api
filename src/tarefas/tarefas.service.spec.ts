import { Test, TestingModule } from '@nestjs/testing';
import { TarefasService } from './tarefas.service';
import { Usuario } from 'src/usuarios/entities/usuario/usuario.entity';
import { Tarefa } from './entities/tarefa/tarefa.entity';
import { TarefaStatus } from './interfaces/tarefa.enum';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { AtualizarTarefaDto } from './dto/atualizar-tarefa.dto';

const criarUsuarioMock = (override = {}): Usuario =>
  ({
    id: 'usuario-123',
    email: 'teste@email.com',
    senha: 'hasheada',
    nome: 'Usuário Teste',
    criadoEm: new Date(),
    tarefas: [],
    ...override,
  }) as Usuario;

const criarTarefaMock = (override = {}): Tarefa =>
  ({
    id: 'tarefa-123',
    titulo: 'Tarefa teste',
    descricao: 'Descrição teste',
    status: TarefaStatus.PENDENTE,
    usuarioId: 'usuario-123',
    criadoEm: new Date(),
    atualizadoEm: new Date(),
    ...override,
  }) as Tarefa;

const mockQueryBuilder = {
  where: jest.fn().mockReturnThis(),
  andWhere: jest.fn().mockReturnThis(),
  orderBy: jest.fn().mockReturnThis(),
  getMany: jest.fn(),
};

const mockTarefaRepository = {
  create: jest.fn(),
  save: jest.fn(),
  findOne: jest.fn(),
  remove: jest.fn(),
  createQueryBuilder: jest.fn(() => mockQueryBuilder),
};

describe('TarefasService', () => {
  let service: TarefasService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TarefasService,
        {
          provide: getRepositoryToken(Tarefa),
          useValue: mockTarefaRepository,
        },
      ],
    }).compile();

    service = module.get<TarefasService>(TarefasService);
  });

  it('Deve estar definido', () => {
    expect(service).toBeDefined();
  });

  afterEach(() => jest.clearAllMocks());

  describe('criar', () => {
    it('deve criar uma tarefa com sucesso', async () => {
      const usuario = criarUsuarioMock();
      const dto = { titulo: 'Nova tarefa', descricao: 'Descrição' };
      const tarefaMock = criarTarefaMock();

      mockTarefaRepository.create.mockReturnValue(tarefaMock);
      mockTarefaRepository.save.mockResolvedValue(tarefaMock);

      const resultado = await service.criar(dto, usuario);

      expect(resultado).toEqual(tarefaMock);
      expect(mockTarefaRepository.create).toHaveBeenCalledWith({
        ...dto,
        usuarioId: usuario.id,
      });
    });
  });

  describe('obterFiltrados', () => {
    it('deve retornar tarefas do usuário sem filtro', async () => {
      const usuario = criarUsuarioMock();
      const tarefas = [
        criarTarefaMock(),
        criarTarefaMock({ id: 'tarefa-456' }),
      ] as Tarefa[];

      mockQueryBuilder.getMany.mockResolvedValue(tarefas);

      const resultado = await service.obterFiltrados(usuario, {});

      expect(resultado).toEqual(tarefas);
      expect(mockQueryBuilder.where).toHaveBeenCalledWith(
        'tarefa.usuarioId = :usuarioId',
        { usuarioId: usuario.id },
      );
      expect(mockQueryBuilder.andWhere).not.toHaveBeenCalled();
    });

    it('deve filtrar por status quando informado', async () => {
      const usuario = criarUsuarioMock();
      mockQueryBuilder.getMany.mockResolvedValue([]);

      await service.obterFiltrados(usuario, {
        status: TarefaStatus.PENDENTE,
      });

      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'tarefa.status = :status',
        { status: TarefaStatus.PENDENTE },
      );
    });
  });

  describe('buscarUma', () => {
    it('deve retornar a tarefa se pertencer ao usuário', async () => {
      const usuario = criarUsuarioMock();
      const tarefa = criarTarefaMock({ usuarioId: usuario.id });

      mockTarefaRepository.findOne.mockResolvedValue(tarefa);

      const resultado = await service.findOne(tarefa.id, usuario);

      expect(resultado).toEqual(tarefa);
    });

    it('deve lançar NotFoundException se tarefa não existir', async () => {
      const usuario = criarUsuarioMock();
      mockTarefaRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne('id-inexistente', usuario)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('deve lançar ForbiddenException se tarefa pertencer a outro usuário', async () => {
      const usuario = criarUsuarioMock();
      const tarefa = criarTarefaMock({ usuarioId: 'outro-usuario-999' });

      mockTarefaRepository.findOne.mockResolvedValue(tarefa);

      await expect(service.findOne(tarefa.id, usuario)).rejects.toThrow(
        ForbiddenException,
      );
    });
  });

  describe('atualizar', () => {
    it('deve atualizar a tarefa com sucesso', async () => {
      const usuario = criarUsuarioMock();
      const tarefa = criarTarefaMock({ usuarioId: usuario.id });
      const dto = {
        titulo: 'Título atualizado',
        descricao: 'Descrição atualizada',
        status: TarefaStatus.CONCLUIDA,
      } as AtualizarTarefaDto;

      mockTarefaRepository.findOne.mockResolvedValue(tarefa);
      mockTarefaRepository.save.mockResolvedValue({ ...tarefa, ...dto });

      const resultado = await service.atualizar(tarefa.id, dto, usuario);

      expect(resultado.status).toBe(TarefaStatus.CONCLUIDA);
    });
  });

  describe('remover', () => {
    it('deve remover a tarefa com sucesso', async () => {
      const usuario = criarUsuarioMock();
      const tarefa = criarTarefaMock({ usuarioId: usuario.id });

      mockTarefaRepository.findOne.mockResolvedValue(tarefa);
      mockTarefaRepository.remove.mockResolvedValue(tarefa);

      const resultado = await service.remover(tarefa.id, usuario);

      expect(resultado).toEqual({ mensagem: 'Tarefa removida com sucesso' });
      expect(mockTarefaRepository.remove).toHaveBeenCalledWith(tarefa);
    });
  });
});
