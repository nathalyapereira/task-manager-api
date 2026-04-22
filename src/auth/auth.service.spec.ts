import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { Usuario } from 'src/usuarios/entities/usuario/usuario.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import {
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common/exceptions';

jest.mock('bcryptjs', () => ({
  hash: jest.fn().mockResolvedValue('senha_hasheada'),
  compare: jest.fn(),
}));
import * as bcrypt from 'bcryptjs';

const mockUsuarioRepository = {
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
};

const mockJwtService = {
  sign: jest.fn(),
};
describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(Usuario),
          useValue: mockUsuarioRepository,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('Deve estar definido', () => {
    expect(service).toBeDefined();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('registrar', () => {
    const registrarDto = {
      email: 'teste@email.com',
      senha: 'senha123',
      nome: 'Usuário Teste',
    };

    it('deve criar um usuário com sucesso', async () => {
      mockUsuarioRepository.findOne.mockResolvedValue(null);
      mockUsuarioRepository.create.mockReturnValue({ ...registrarDto });
      mockUsuarioRepository.save.mockResolvedValue({
        id: '123',
        ...registrarDto,
      });

      const resultado = await service.registrar(registrarDto);

      expect(resultado).toEqual({ message: 'Usuário criado com sucesso' });
      expect(mockUsuarioRepository.findOne).toHaveBeenCalledWith({
        where: { email: registrarDto.email },
      });
      expect(mockUsuarioRepository.save).toHaveBeenCalledTimes(1);
    });

    it('deve lançar ConflictException se email já existir', async () => {
      mockUsuarioRepository.findOne.mockResolvedValue({
        id: '123',
        email: registrarDto.email,
      });

      await expect(service.registrar(registrarDto)).rejects.toThrow(
        ConflictException,
      );

      expect(mockUsuarioRepository.save).not.toHaveBeenCalled();
    });

    it('deve fazer hash da senha antes de salvar', async () => {
      mockUsuarioRepository.findOne.mockResolvedValue(null);

      const bcryptSpy = jest.spyOn(bcrypt, 'hash');

      mockUsuarioRepository.create.mockReturnValue({ ...registrarDto });
      mockUsuarioRepository.save.mockResolvedValue({ id: '123' });

      await service.registrar(registrarDto);

      expect(bcryptSpy).toHaveBeenCalledWith(registrarDto.senha, 10);
    });
  });

  describe('login', () => {
    const loginDto = {
      email: 'teste@email.com',
      senha: 'senha123',
    };

    const usuarioMock = {
      id: '123',
      email: 'teste@email.com',
      senha: '$2b$10$hasheada',
    };

    it('deve retornar access_token com credenciais válidas', async () => {
      mockUsuarioRepository.findOne.mockResolvedValue(usuarioMock);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true as never);
      mockJwtService.sign.mockReturnValue('token_fake_jwt');

      const resultado = await service.login(loginDto);

      expect(resultado).toEqual({ access_token: 'token_fake_jwt' });
      expect(mockJwtService.sign).toHaveBeenCalledWith({
        sub: usuarioMock.id,
        email: usuarioMock.email,
      });
    });

    it('deve lançar UnauthorizedException se usuário não existir', async () => {
      mockUsuarioRepository.findOne.mockResolvedValue(null);

      await expect(service.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('deve lançar UnauthorizedException se senha estiver errada', async () => {
      mockUsuarioRepository.findOne.mockResolvedValue(usuarioMock);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(false as never);

      await expect(service.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });
});
