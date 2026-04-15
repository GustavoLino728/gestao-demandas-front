# 📋 Demand Manager

Sistema de gestão de demandas no estilo Kanban, desenvolvido com Next.js e integrado a uma API FastAPI.

***

## 🚀 Stack

| Camada | Tecnologia |
|---|---|
| Framework | Next.js 15 (App Router) |
| Estilização | Tailwind CSS v4 + shadcn/ui (Luma preset) |
| Estado global | Zustand |
| Fetching / cache | TanStack Query v5 |
| Drag & Drop | @dnd-kit/core + @dnd-kit/sortable |
| Formulários | React Hook Form + Zod |
| Autenticação | NextAuth v5 (Auth.js) |
| HTTP Client | Axios |
| Icons | Lucide React |
| Linguagem | TypeScript |

> O backend é uma API separada em **FastAPI**. Este repositório contém **apenas o frontend**.

***

## 📁 Estrutura do Projeto

```
src/
├── app/
│   ├── (auth)/               # Rotas públicas (login, registro)
│   ├── (app)/                # Rotas protegidas (dashboard, boards)
│   │   └── boards/[boardId]/ # Kanban view
│   └── api/auth/             # Único API route — NextAuth
│
├── components/
│   ├── ui/                   # Componentes shadcn (auto-gerado)
│   ├── board/                # KanbanBoard, BoardColumn, BoardCard
│   └── shared/               # AppSidebar, TopBar, CommandPalette
│
├── services/                 # Camada de comunicação com a API
│   ├── api.ts                # Instância Axios + interceptors JWT
│   ├── boards.service.ts
│   └── cards.service.ts
│
├── hooks/                    # TanStack Query hooks por entidade
│   ├── useBoards.ts
│   └── useCards.ts
│
├── store/                    # Zustand stores
│   ├── boardStore.ts         # Estado otimista do kanban
│   └── uiStore.ts
│
├── types/                    # Tipagens globais
└── lib/                      # auth.ts, utils.ts
```

***

## ⚙️ Configuração do Ambiente

### Pré-requisitos

- Node.js 20+
- npm ou pnpm
- API FastAPI rodando (ver repositório do backend)

### Instalação

```bash
# 1. Clonar o repositório
git clone https://github.com/seu-usuario/demand-manager.git
cd demand-manager

# 2. Instalar dependências
npm install

# 3. Configurar variáveis de ambiente
cp .env.example .env.local
```

### Variáveis de Ambiente

Edite o arquivo `.env.local`:

```env
# URL base da API FastAPI
NEXT_PUBLIC_API_URL=http://localhost:8000

# Segredo para o NextAuth (gere com: openssl rand -base64 32)
AUTH_SECRET=sua-chave-secreta-aqui

# URL do frontend
AUTH_URL=http://localhost:3000
```

***

## 🧑‍💻 Rodando em Desenvolvimento

```bash
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000)

> **Atenção:** o backend FastAPI precisa estar rodando em `http://localhost:8000` (ou a URL configurada em `NEXT_PUBLIC_API_URL`) para o login e as funcionalidades do board funcionarem.

***

## 🏗️ Build para Produção

```bash
npm run build
npm run start
```

***

## 🔐 Autenticação

O fluxo de autenticação utiliza `NextAuth v5` com `CredentialsProvider`:

1. O usuário preenche login e senha no formulário
2. O NextAuth envia as credenciais para `POST /auth/login` no FastAPI
3. O FastAPI retorna um `access_token` (JWT)
4. O token é armazenado na sessão do NextAuth e injetado automaticamente em todas as requisições via interceptor do Axios

***

## 🔄 Fluxo de Drag & Drop

O kanban utiliza `@dnd-kit` com **atualizações otimistas**:

1. Usuário arrasta um card → UI atualiza imediatamente (Zustand)
2. Requisição `PATCH /cards/{id}` é disparada em background (TanStack Query)
3. Em caso de erro, o estado é revertido automaticamente

***

## 📜 Scripts Disponíveis

| Comando | Descrição |
|---|---|
| `npm run dev` | Inicia servidor de desenvolvimento |
| `npm run build` | Gera build de produção |
| `npm run start` | Inicia servidor de produção |
| `npm run lint` | Executa ESLint |
| `npm run type-check` | Valida tipagem TypeScript |