import { Usuario } from './usuario.entity';

describe('Usuario', () => {
  it('Deve estar definido', () => {
    expect(new Usuario()).toBeDefined();
  });
});
