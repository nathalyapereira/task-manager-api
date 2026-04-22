# 📋 Task Manager API

API REST de gerenciamento de tarefas com autenticação JWT, desenvolvida com NestJS e PostgreSQL.

🔗 **[Documentação Swagger]([https://seu-app.onrender.com/docs](https://task-manager-api-s4t0.onrender.com/api-docs))**

---

## 🚀 Tecnologias

![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)
![TypeORM](https://img.shields.io/badge/TypeORM-FE0803?style=for-the-badge&logo=typeorm&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)
![Swagger](https://img.shields.io/badge/Swagger-85EA2D?style=for-the-badge&logo=swagger&logoColor=black)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
![Render](https://img.shields.io/badge/Render-46E3B7?style=for-the-badge&logo=render&logoColor=white)

---

## ✅ Funcionalidades

### Autenticação
- Cadastro de usuário com hash de senha via **bcrypt**
- Login com geração de **token JWT**
- Rotas protegidas com **Guards** do NestJS

### Tarefas
- Criar, listar, editar e deletar tarefas **(CRUD completo)**
- Filtro por status: `pendente`, `em_progresso`, `concluida`
- Cada tarefa pertence ao usuário autenticado (relacionamento `ManyToOne`)
- Usuário só acessa as próprias tarefas

### Qualidade
- Validação de dados com **class-validator**
- Documentação automática com **Swagger/OpenAPI**
- Variáveis de ambiente com **ConfigModule**
- Testes unitários e E2E com **Jest**

---

## 📐 Arquitetura

```
src/
├── auth/
│   ├── decorators/       # @GetUsuario() decorator customizado
│   ├── dto/              # RegistrarDto, LoginDto
│   ├── auth.controller.ts
│   ├── auth.service.ts
│   ├── auth.module.ts
│   ├── jwt.strategy.ts
│   └── jwt-auth.guard.ts
├── tarefas/
│   ├── dto/              # CriarTarefaDto, AtualizarTarefaDto, FiltrarTarefaDto
│   ├── entities/         # Tarefa entity
│   ├── interfaces/       # TarefaStatus
│   ├── tarefas.controller.ts
│   ├── tarefas.service.ts
│   └── tarefas.module.ts
├── usuarios/
│   └── entities/         # Usuario entity
├── app.module.ts
└── main.ts
```

---

## 🔗 Endpoints

### Auth
| Método | Rota | Descrição |
|--------|------|-----------|
| POST | `/auth/registrar` | Criar conta |
| POST | `/auth/login` | Login e retorno do token JWT |

### Tasks — 🔒 requer token JWT
| Método | Rota | Descrição |
|--------|------|-----------|
| POST | `/tarefas` | Criar tarefa |
| GET | `/tarefas` | Listar tarefas do usuário |
| GET | `/tarefas/filtrados?status=pending` | Filtrar por status |
| GET | `/tarefas/:id` | Buscar tarefa por ID |
| PATCH | `/tarefas/:id` | Editar tarefa |
| DELETE | `/tarefas/:id` | Deletar tarefa |

---

## ⚙️ Rodando localmente

### Pré-requisitos
- Node.js 18+
- Conta no [Supabase](https://supabase.com) (banco PostgreSQL)

### Instalação

```bash
# Clonar o repositório
git clone https://github.com/seu-usuario/task-manager-api.git
cd task-manager-api

# Instalar dependências
npm install
```

### Configurar variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
DATABASE_URL=postgresql://postgres.xxx:senha@aws-0-xxx.pooler.supabase.com:5432/postgres
JWT_SECRET=sua_chave_secreta
JWT_EXPIRES_IN=7d
NODE_ENV=development
```

### Rodar

```bash
npm run start:dev
```

Acesse a documentação em: `http://localhost:3000/api-docs`

---
 
## 🧪 Testes
 
O projeto conta com testes unitários e E2E. Os testes E2E usam banco SQLite em memória — não precisam de conexão com o Supabase para rodar.
 
```bash
# testes unitários
npm run test
 
# testes unitários em modo watch
npm run test:watch
 
# testes E2E
npm run test:e2e
 
# cobertura de código
npm run test:cov
```
 
### O que é testado
 
**Unitários — `AuthService`**
- Criação de usuário com hash de senha via bcrypt
- Rejeição de email duplicado com `ConflictException`
- Verificação de que o bcrypt é chamado com os parâmetros corretos
- Login com credenciais válidas retornando token JWT
- Rejeição de usuário inexistente com `UnauthorizedException`
- Rejeição de senha errada com `UnauthorizedException`
**Unitários — `TarefasService`**
- Criação de tarefa vinculada ao usuário autenticado
- Listagem de tarefas filtradas por usuário
- Filtro por status com QueryBuilder
- Busca por ID com validação de ownership
- `NotFoundException` para tarefa inexistente
- `ForbiddenException` para tarefa de outro usuário
- Atualização e remoção de tarefa
**E2E — fluxo completo**
- Cadastro, login e rejeição de credenciais inválidas
- CRUD completo de tarefas via HTTP
- Proteção de rotas sem token JWT
- Filtro por status via query param
- Retorno 404 após deletar tarefa
---

## 🌐 Deploy

- **API:** [Render](https://render.com)
- **Banco de dados:** [Supabase](https://supabase.com) (PostgreSQL)

---

## 👩‍💻 Autora

Feito por **Nathalya Pereira**

[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/nathalya-psilva/)
[![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/nathalyapereira)
