import { Usuario } from './usuario.entity';

describe('Usuario', () => {
  it('should be defined', () => {
    expect(new Usuario()).toBeDefined();
  });
});
