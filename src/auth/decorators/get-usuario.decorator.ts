import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Usuario } from 'src/usuarios/entities/usuario/usuario.entity';

export const GetUsuario = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): Usuario => {
    const request = ctx.switchToHttp().getRequest<{ usuario: Usuario }>();
    return request.usuario;
  },
);
