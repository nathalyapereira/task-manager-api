import { Tarefa } from './tarefa.entity';

describe('Tarefa', () => {
  it('Deve estar definido', () => {
    expect(new Tarefa()).toBeDefined();
  });
});
