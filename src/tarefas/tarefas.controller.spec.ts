import { Test, TestingModule } from '@nestjs/testing';
import { TarefasController } from './tarefas.controller';

describe('TarefasController', () => {
  let controller: TarefasController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TarefasController],
    }).compile();

    controller = module.get<TarefasController>(TarefasController);
  });

  it('Deve estar definido', () => {
    expect(controller).toBeDefined();
  });
});
