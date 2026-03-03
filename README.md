# Brevly - Encurtador de URLs <img src="web/src/assets/Logo.svg" alt="Brevly Logo" width="120" height="120" style="vertical-align: middle;">

<div align="center">
  
  ![License](https://img.shields.io/badge/license-MIT-blue.svg)
  ![Node](https://img.shields.io/badge/node-%3E%3D20.0.0-green.svg)
  ![TypeScript](https://img.shields.io/badge/typescript-5.x-blue.svg)
  
</div>

---

Um encurtador de URLs moderno e completo desenvolvido como parte da **Fase 1** da pós-graduação **Full-Stack 360º com Inteligência Artificial** da **[Rocketseat](https://www.rocketseat.com.br/faculdade)**.

O **Brev.ly** é uma aplicação que demonstra a aplicação prática de conceitos fundamentais de desenvolvimento full-stack, incluindo arquitetura de APIs RESTful, gerenciamento de estado, containerização e boas práticas de engenharia de software.

A aplicação permite criar, gerenciar e monitorar links encurtados com recursos avançados como contador de acessos, exportação de relatórios em CSV e interface responsiva totalmente alinhada com o design do Figma.

> 💜 **Design**: [Acesse o Figma do projeto](https://www.figma.com/community/file/1477335071553579816/encurtador-de-links)

## 🚀 Tecnologias

### Backend

- ✅ **Node.js** com **TypeScript** - Runtime e linguagem
- ✅ **Fastify** - Framework web rápido e eficiente
- ✅ **Drizzle ORM** - ORM TypeScript-first para migrations e queries
- ✅ **PostgreSQL** - Banco de dados relacional
- ✅ **Zod** - Validação de schemas e dados
- ✅ **@fastify/cors** - Configuração de CORS
- ✅ **@fastify/swagger** - Documentação automática da API

### Frontend

- ✅ **React** com **TypeScript** - Biblioteca UI e linguagem
- ✅ **Vite** - Build tool e dev server (sem framework SSR)
- ✅ **React Router** - Roteamento SPA
- ✅ **TanStack Query** (React Query) - Gerenciamento de estado assíncrono
- ✅ **Tailwind CSS** - Framework CSS utilitário
- ✅ **React Hook Form** - Gerenciamento de formulários
- ✅ **Zod** - Validação client-side

### Infraestrutura

- 🐳 **Docker** e **Docker Compose** - Containerização e orquestração
- 🔨 **tsx** - Execução TypeScript para desenvolvimento
- 📦 **npm** - Gerenciador de pacotes

## 📋 Pré-requisitos

- [Node.js](https://nodejs.org/) (versão 20 ou superior)
- [Docker](https://www.docker.com/) e Docker Compose
- [Git](https://git-scm.com/)

## 🔧 Instalação

Clone o repositório:

```bash
git clone https://github.com/avcneto/ftr-pos360-challenge-phase-1-brevly
cd ftr-pos360-challenge-phase-1-brevly
```

## 🐳 Executar com Docker Compose (Recomendado)

A forma mais simples de executar o projeto é usando Docker Compose, que inicia todos os serviços automaticamente.

### Iniciar todos os serviços

```bash
docker compose up -d
```

### Acessar a aplicação

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3333/ping
- **Documentação API (Swagger)**: http://localhost:3333/docs
- **PostgreSQL**: localhost:5432

### Parar os serviços

```bash
docker compose down
```

### Limpar dados do banco (reset completo)

```bash
docker compose down -v
```

## 💻 Executar localmente (Desenvolvimento)

Para desenvolvimento ativo com hot-reload, você pode executar os serviços separadamente.

### 1. Instalar dependências

```bash
# Backend
cd server
npm install

# Frontend
cd ../web
npm install
```

### 2. Configurar variáveis de ambiente

Os arquivos `.env.local` já estão pré-configurados:

**server/.env.local:**

```env
PORT=3333
NODE_ENV=development
DATABASE_URL=postgresql://user_links:password_links@localhost:5432/link
```

**web/.env.local:**

```env
VITE_API_URL=http://localhost:3333
```

### 3. Iniciar PostgreSQL

Use Docker apenas para o banco de dados:

```bash
docker compose up postgres -d
```

Aguarde o PostgreSQL inicializar (cerca de 10 segundos).

### 4. Executar migrations do banco

```bash
cd server
npm run db:migrate
```

### 5. Iniciar os serviços

Abra dois terminais diferentes:

**Terminal 1 - Backend:**

```bash
cd server
npm run dev
```

**Terminal 2 - Frontend:**

```bash
cd web
npm run dev
```

### Acessar a aplicação

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3333

## 📚 Scripts Disponíveis

### Backend (server/)

```bash
npm run dev          # Inicia servidor em modo desenvolvimento com hot-reload
npm run build        # Compila TypeScript para JavaScript
npm run db:migrate   # Executa migrations do banco de dados
```

### Frontend (web/)

```bash
npm run dev          # Inicia dev server com Vite
npm run build        # Build de produção
npm run preview      # Preview do build de produção
npm run lint         # Executa ESLint
```

## 🔄 Alternância entre modos de execução

### De Docker para Local

```bash
# Parar apenas backend e frontend (manter PostgreSQL)
docker compose stop backend frontend

# Iniciar localmente
cd server && npm run dev    # Terminal 1
cd web && npm run dev       # Terminal 2
```

### De Local para Docker

```bash
# Parar processos npm (Ctrl+C nos terminais)

# Iniciar todos os serviços
docker compose up -d
```

## 📖 Estrutura do Projeto

```
.
├── server/                 # Backend (API)
│   ├── src/
│   │   ├── env.ts         # Configuração de variáveis de ambiente
│   │   └── infra/
│   │       ├── db/        # Database (Drizzle ORM, schemas, migrations)
│   │       ├── http/      # HTTP (Fastify, routers)
│   │       └── services/  # Lógica de negócio
│   ├── Dockerfile
│   └── package.json
│
├── web/                    # Frontend (React)
│   ├── src/
│   │   ├── components/    # Componentes React
│   │   ├── hooks/         # Custom hooks (React Query)
│   │   ├── pages/         # Páginas/Rotas
│   │   ├── types/         # TypeScript types
│   │   ├── ui/            # Componentes UI base
│   │   └── utils/         # Utilitários
│   ├── Dockerfile
│   └── package.json
│
├── docker/                 # Scripts de inicialização do banco
├── docker-compose.yml      # Orquestração dos containers
└── README.md
```

## 🔑 Funcionalidades e Regras de Negócio

### Backend (API)

#### Funcionalidades Obrigatórias

- ✅ **Criar link encurtado** - Personalizado pelo usuário
- ✅ **Listar todos os links** - Com informações completas e de forma performática
- ✅ **Deletar link** - Remover link cadastrado
- ✅ **Obter URL original** - Via URL encurtada
- ✅ **Incrementar contador de acessos** - Registro de cada acesso ao link
- ✅ **Exportar relatório CSV** - Com URL original, encurtada, acessos e data de criação
- ✅ **Geração de nome único para CSV** - Nome aleatório e único

#### 📚 Documentação Interativa

Acesse a documentação completa e interativa (Swagger) em: **http://localhost:3333/docs**

### Endpoints Disponíveis

#### Links

| Método   | Endpoint              | Descrição                        | Body/Params                                 |
| -------- | --------------------- | -------------------------------- | ------------------------------------------- |
| `GET`    | `/links`              | Lista todos os links cadastrados | -                                           |
| `POST`   | `/links`              | Cria um novo link encurtado      | `{ originalUrl: string, shortUrl: string }` |
| `DELETE` | `/links/:id`          | Deleta um link específico        | `id` (param)                                |
| `GET`    | `/links/original-url` | Obtém a URL original             | `?shortUrl=xxx` (query)                     |
| `PATCH`  | `/links/:id/access`   | Incrementa contador de acessos   | `id` (param)                                |
| `GET`    | `/links/export/csv`   | Exporta relatório CSV            | -                                           |

#### Health Check

| Método | Endpoint | Descrição              |
| ------ | -------- | ---------------------- |
| `GET`  | `/ping`  | Verifica status da API |

### Exemplos de Requisições

#### Criar Link

```bash
POST /links
Content-Type: application/json

{
  "originalUrl": "https://www.example.com/very/long/url/path",
  "shortUrl": "exemplo"
}
```

**Resposta:**

```json
{
  "id": "uuid",
  "originalUrl": "https://www.example.com/very/long/url/path",
  "shortUrl": "exemplo",
  "accessCount": "0",
  "createdAt": "2026-03-02T12:00:00.000Z"
}
```

#### Listar Links

```bash
GET /links
```

**Resposta:**

```json
[
  {
    "id": "uuid",
    "originalUrl": "https://www.example.com",
    "shortUrl": "exemplo",
    "accessCount": "42",
    "createdAt": "2026-03-02T12:00:00.000Z"
  }
]
```

#### Obter URL Original

```bash
GET /links/original-url?shortUrl=exemplo
```

**Resposta:**

```json
{
  "id": "uuid",
  "originalUrl": "https://www.example.com"
}
```

#### Exportar CSV

```bash
GET /links/export/csv
```

**Resposta:** Arquivo CSV com os campos:

- URL Original
- URL Encurtada
- Contagem de Acessos
- Data de Criação

#### Páginas da Aplicação

1. **Página Raiz (`/`)** - Formulário de cadastro + listagem de links
2. **Página de Redirecionamento (`/:url-encurtada`)** - Busca e redireciona para URL original
3. **Página 404** - Recurso não encontrado / URL encurtada inexistente

## 🛠️ Troubleshooting

### Porta já em uso

Se você receber erro de porta já alocada:

1. Verifique qual processo está usando a porta:

   ```bash
   # Linux/Mac
   lsof -i :3333  # Backend
   lsof -i :5173  # Frontend
   lsof -i :5432  # PostgreSQL
   ```

2. Pare o processo ou altere a porta nos arquivos de configuração

### Backend não conecta ao PostgreSQL

1. Verifique se o PostgreSQL está rodando:

   ```bash
   docker ps | grep postgres
   ```

2. Verifique a `DATABASE_URL` no arquivo `.env.local`

3. Aguarde o PostgreSQL terminar a inicialização (healthcheck)

### Erro de CORS no navegador

O CORS está configurado para aceitar requisições de qualquer origem em desenvolvimento. Se ainda encontrar problemas:

1. Limpe o cache do navegador
2. Verifique se o backend está rodando
3. Confirme que `VITE_API_URL` está configurado corretamente

### Migrations falharam

Execute manualmente:

```bash
cd server
npm run db:migrate
```

Se o erro persistir, verifique:

- Conexão com o banco de dados
- Credenciais no `DATABASE_URL`
- Se o PostgreSQL está acessível

### Frontend não carrega ou fica em branco

1. Verifique os logs do navegador (F12 → Console)
2. Confirme que o backend está rodando
3. Verifique a variável `VITE_API_URL` no `.env.local`
4. Tente limpar o cache e recarregar (Ctrl+Shift+R)

### Características de UX Implementadas

- ✅ **Empty State** - Mensagem amigável quando não há links cadastrados
- ✅ **Loading States** - Indicadores visuais de carregamento em todas as operações
- ✅ **Feedback Visual** - Toast/banners para sucesso e erro
- ✅ **Responsividade Mobile-First** - Layout adaptável para todos os dispositivos
- ✅ **Ícones Intuitivos** - Interface clara e autoexplicativa
- ✅ **Bloqueio de Ações** - Desabilita botões durante processamento

## 📚 Recursos e Referências

- 📖 [Documentação do Desafio - Rocketseat](https://docs-rocketseat.notion.site/Desafio-Fase-1-Brev-ly-1a8395da577080649fb5d515416e9e34)
- 🎨 [Design no Figma](https://www.figma.com/community/file/1477335071553579816/encurtador-de-links)
- 🚀 [Rocketseat](https://www.rocketseat.com.br/)

## 📞 Suporte

Acesse meu GitHub para sugestões e dúvidas: [@avcneto](https://github.com/avcneto)

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

<div align="center">
  
  Desenvolvido com 💜 por [Anderson Neto](https://github.com/avcneto)
  
  Parte da pós-graduação **Full-Stack 360º com Inteligência Artificial** da [Rocketseat](https://www.rocketseat.com.br/faculdade)
  
</div>
