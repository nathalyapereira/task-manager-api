import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { Usuario } from 'src/usuarios/entities/usuario/usuario.entity';
import { RegistrarDto } from './dto/registrar.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
    private readonly jwtService: JwtService,
  ) {}

  async registrar(dto: RegistrarDto) {
    const exists = await this.usuarioRepository.findOne({
      where: { email: dto.email },
    });

    if (exists) {
      throw new ConflictException('Email já cadastrado');
    }

    const hashedPassword = await bcrypt.hash(dto.senha, 10);

    const usuario = this.usuarioRepository.create({
      email: dto.email,
      senha: hashedPassword,
      nome: dto.nome,
    });

    await this.usuarioRepository.save(usuario);

    return { message: 'Usuário criado com sucesso' };
  }

  async login(dto: LoginDto) {
    const usuario = await this.usuarioRepository.findOne({
      where: { email: dto.email },
    });

    if (!usuario) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const senhaMatch = await bcrypt.compare(dto.senha, usuario.senha);

    if (!senhaMatch) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const payload = { sub: usuario.id, email: usuario.email };
    const token = this.jwtService.sign(payload);

    return { access_token: token };
  }
}
