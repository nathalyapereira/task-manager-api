import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';
import { RegistrarDto } from 'src/auth/dto/registrar.dto';
import { Tarefa } from 'src/tarefas/entities/tarefa/tarefa.entity';
import { TarefaStatus } from 'src/tarefas/interfaces/tarefa.enum';
import { Usuario } from 'src/usuarios/entities/usuario/usuario.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;
  let accessToken: string;
  let tarefaId: string;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideModule(TypeOrmModule)
      .useModule(
        TypeOrmModule.forRoot({
          type: 'better-sqlite3',
          database: ':memory:',
          entities: [Usuario, Tarefa],
          synchronize: true,
        }),
      )
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, transform: true }),
    );
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Auth', () => {
    it('POST /auth/registrar — deve criar conta', async () => {
      const resposta = await request(app.getHttpServer())
        .post('/auth/registrar')
        .send({
          nome: 'Nathalya',
          email: 'nathalya@teste.com',
          senha: 'senha123',
        } as RegistrarDto);

      expect(resposta.status).toBe(201);
      expect(resposta.body).toEqual({ message: 'Usuário criado com sucesso' });
    });

    it('POST /auth/registrar — deve rejeitar email duplicado', async () => {
      const resposta = await request(app.getHttpServer())
        .post('/auth/registrar')
        .send({
          nome: 'Nathalya',
          email: 'nathalya@teste.com', // mesmo email
          senha: 'senha123',
        } as RegistrarDto);

      expect(resposta.status).toBe(409);
    });

    it('POST /auth/login — deve retornar token JWT', async () => {
      const resposta = (await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'nathalya@teste.com',
          senha: 'senha123',
        })) as {
        status: number;
        body: { access_token: string };
      };

      expect(resposta.status).toBe(200);
      expect(resposta.body).toHaveProperty('access_token');

      accessToken = resposta.body.access_token;
    });

    it('POST /auth/login — deve rejeitar senha errada', async () => {
      const resposta = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'nathalya@teste.com',
          senha: 'senha_errada',
        });

      expect(resposta.status).toBe(401);
    });
  });

  describe('Tarefas', () => {
    it('POST /tarefas — deve criar tarefa', async () => {
      const resposta = (await request(app.getHttpServer())
        .post('/tarefas')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          titulo: 'Estudar NestJS',
          descricao: 'Focar nos guards e modules',
        })) as {
        status: number;
        body: Tarefa;
      };

      expect(resposta.status).toBe(201);
      expect(resposta.body).toHaveProperty('id');
      expect(resposta.body.titulo).toBe('Estudar NestJS');

      tarefaId = resposta.body.id;
    });

    it('POST /tarefas — deve rejeitar sem token', async () => {
      const resposta = await request(app.getHttpServer())
        .post('/tarefas')
        .send({ titulo: 'Tarefa sem auth' });

      expect(resposta.status).toBe(401);
    });

    it('GET /tarefas — deve listar tarefas do usuário', async () => {
      const resposta = (await request(app.getHttpServer())
        .get('/tarefas')
        .set('Authorization', `Bearer ${accessToken}`)) as {
        status: number;
        body: { length: number };
      };

      expect(resposta.status).toBe(200);
      expect(Array.isArray(resposta.body)).toBe(true);
      expect(resposta.body.length).toBeGreaterThan(0);
    });

    it('GET /tarefas?status=pendente — deve filtrar por status', async () => {
      const resposta = (await request(app.getHttpServer())
        .get('/tarefas?status=pendente')
        .set('Authorization', `Bearer ${accessToken}`)) as {
        status: number;
        body: Tarefa[];
      };

      expect(resposta.status).toBe(200);
      expect(
        resposta.body.every((t: Tarefa) => t.status === TarefaStatus.PENDENTE),
      ).toBe(true);
    });

    it('GET /tarefas/:id — deve buscar tarefa por id', async () => {
      const resposta = (await request(app.getHttpServer())
        .get(`/tarefas/${tarefaId}`)
        .set('Authorization', `Bearer ${accessToken}`)) as {
        status: number;
        body: Tarefa;
      };

      expect(resposta.status).toBe(200);
      expect(resposta.body.id).toBe(tarefaId);
    });

    it('PATCH /tarefas/:id — deve atualizar status', async () => {
      const resposta = (await request(app.getHttpServer())
        .patch(`/tarefas/${tarefaId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ status: 'em_andamento' })) as {
        status: number;
        body: Tarefa;
      };

      expect(resposta.status).toBe(200);
      expect(resposta.body.status).toBe('em_andamento');
    });

    it('DELETE /tarefas/:id — deve deletar tarefa', async () => {
      const resposta = await request(app.getHttpServer())
        .delete(`/tarefas/${tarefaId}`)
        .set('Authorization', `Bearer ${accessToken}`);

      expect(resposta.status).toBe(200);
      expect(resposta.body).toEqual({ message: 'Tarefa deletada com sucesso' });
    });

    it('GET /tarefas/:id — deve retornar 404 após deletar', async () => {
      const resposta = await request(app.getHttpServer())
        .get(`/tarefas/${tarefaId}`)
        .set('Authorization', `Bearer ${accessToken}`);

      expect(resposta.status).toBe(404);
    });
  });
});
