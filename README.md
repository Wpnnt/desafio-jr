# 🐶 Tikki Petshop | Desafio Fullstack Jr.

![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)
![TailwindCSS](https://img.shields.io/badge/Tailwind-CSS-38bdf8?style=flat-square&logo=tailwindcss)
![Prisma](https://img.shields.io/badge/Prisma-ORM-2d3748?style=flat-square&logo=prisma)
![Docker](https://img.shields.io/badge/Docker-Compose-2496ed?style=flat-square&logo=docker)
![Playwright](https://img.shields.io/badge/Testing-Playwright-45ba4b?style=flat-square&logo=playwright)

> **Uma dashboard moderna, segura e robusta para gerenciamento de Petshops.**
> Este projeto foi desenvolvido como solução para o desafio técnico "InteraTo - Desenvolvedor Fullstack Jr."

---

## ✨ Diferenciais da Solução

Além dos requisitos básicos, este projeto foca em **Experiência do Usuário (UX)**, **Segurança** e **Arquitetura Escalável**.

### 🎨 UI/UX Premium ("Tikki Identity")
- **Design System Consistente**: Identidade visual própria com paleta "Deep Zinc" e acentos em laranja.
- **Micro-interações**: Animações suaves em hover, focos de input e transições de modal.
- **Mobile-First**: Interface totalmente adaptada para celulares (com Menu Hambúrguer e Floating Actions).
- **Feedback Visual**: Loaders, Toasts de sucesso/erro e estados de "Empty" ricos.

### 🛡️ Segurança & Robustez (Backend)
- **Ownership Validation**: Middleware e validações de API garantem que usuários só manipulem seus próprios dados (Prevenção de IDOR).
- **Zod Schemas**: Validação rigorosa de todos os inputs (Frontend e Backend).
- **Server Actions**: Mutação de dados segura e tipada, sem expor APIs públicas desnecessárias.
- **NextAuth v5**: Implementação de autenticação moderna e segura.

---

## 🏗️ Arquitetura do Projeto

O projeto segue uma estrutura modular para facilitar a manutenção e escalabilidade:

```bash
src/
├── app/                 # Next.js App Router (Páginas e APIs)
├── modules/             # Funcionalidades isoladas (Domain Driven design)
│   ├── auth/            # Lógica de Autenticação (Forms, Schemas)
│   ├── pets/            # Domínio de Pets (Components, Hooks, Types)
│   └── shared/          # Componentes Reutilizáveis (UI Kit, Hooks Globais)
├── lib/                 # Configurações (Prisma, Utils)
└── tests/               # Testes E2E com Playwright
```

---

## 🚀 Como Rodar o Projeto

### Pré-requisitos
- Node.js 18+ (para rodar localmente)
- Docker & Docker Compose (Opcional, mas recomendado)

### 🐳 Opção 1: Via Docker (Recomendado)
A maneira mais simples de ver tudo funcionando sem configurar ambiente.

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/seu-usuario/desafio-jr.git
   cd desafio-jr
   ```

2. **Inicie a aplicação:**
   ```bash
   docker-compose up --build
   ```
   
3. **Acesse:**
   Abra [http://localhost:3000](http://localhost:3000) no seu navegador.

### 🛠️ Opção 2: Rodando Manualmente

1. **Instale as dependências:**
   ```bash
   npm install
   ```

2. **Configure o Ambiente:**
   Crie um arquivo `.env` na raiz do projeto (use o `.env.example` como base):
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/petshop"
   AUTH_SECRET="qualquer-segredo-super-secreto"
   ```

3. **Inicie o Banco (Postgres):**
   Certifique-se de ter um Postgres rodando e atualize a `DATABASE_URL`.

4. **Gerencie o Banco:**
   ```bash
   npx prisma migrate dev --name init  # Cria as tabelas
   npx prisma db seed                  # Popula com dados de teste
   ```

5. **Rode o servidor:**
   ```bash
   npm run dev
   ```

---

## 🧪 Testes Automatizados (QA)

A aplicação possui cobertura de testes E2E (End-to-End) utilizando **Playwright**, garantindo que os fluxos críticos funcionem perfeitamente.

Execute os testes com:
```bash
npx playwright test
```

**O que é testado?**
- ✅ Fluxo completo de Registro e Login.
- ✅ Ciclo de vida (CRUD) de um Pet.
- ✅ Regras de autorização (Usuário A não pode apagar Pet do Usuário B).
- ✅ Persistência de sessão.

---

## 🛠️ Stack Tecnológica

| Categoria | Tecnologias |
|-----------|-------------|
| **Frontend** | Next.js 15, React 19, TailwindCSS, Lucide Icons |
| **UI Library** | Shadcn UI (Radix Primitives) |
| **Backend** | Next.js Server Actions, API Routes |
| **Database** | PostgreSQL, Prisma ORM |
| **Auth** | NextAuth.js (Auth.js v5) |
| **Validation** | Zod, React Hook Form |
| **Infra** | Docker, Docker Compose |
| **Tests** | Playwright |

---

> _Este projeto foi desenvolvido seguindo as diretrizes do desafio técnico. As instruções originais podem ser encontradas em [docs/DESAFIO.md](./docs/DESAFIO.md)._
