# Tikki Petshop 🐾 Desafio Fullstack

Uma plataforma robusta para gerenciamento de petshops, desenvolvida como solução para o desafio técnico Fullstack Jr. da Interato. O foco principal deste projeto é a **segurança de dados**, **arquitetura modular** e uma **experiência de usuário fluida**.

---

## 🚀 Destaques Técnicos

Este projeto vai além do CRUD básico, implementando padrões de software modernos:

- **Controle de Acesso (RBAC/Ownership)**: Validação rigorosa tanto no Frontend quanto no Backend (API Routes) para garantir que usuários editem/deletem apenas seus próprios registros, mantendo a visibilidade global para leitura.
- **Arquitetura Modular**: Estrutura organizada por domínios (`modules/`), facilitando a manutenção e testes isolados.
- **Prisma 7 Integration**: Utilização da versão mais recente do Prisma, com configurações centralizadas no `prisma.config.ts`.
- **E2E Testing**: Suíte de testes automatizados com Playwright cobrindo fluxos críticos de autenticação e manipulação de dados.

---

## 🛠️ Stack Tecnológica

| Categoria | Tecnologias |
|-----------|-------------|
| **Core** | Next.js 15 (App Router), React 19, TypeScript |
| **Estilização** | TailwindCSS, Lucide Icons |
| **Banco de Dados** | PostgreSQL, Prisma ORM |
| **Autenticação** | Auth.js (NextAuth v5) |
| **Validação** | Zod, React Hook Form |
| **Infra/Testes** | Docker, Playwright |

---

## 🏁 Como Rodar o Projeto

### 🐳 Via Docker (Recomendado)
A maneira mais rápida de subir o ambiente completo (App + Banco):

```bash
# Clone e entre no diretório
git clone https://github.com/seu-usuario/desafio-jr.git
cd desafio-jr

# Suba os containers
docker-compose up --build
```
Acesse em: [http://localhost:3000](http://localhost:3000)

### 💻 Localmente (Manual)
1. **Dependências**: `npm install`
2. **Ambiente**: Configure o `.env` com `DATABASE_URL` e `AUTH_SECRET`.
3. **Banco de Dados**:
   ```bash
   npx prisma migrate dev --name init
   npx prisma db seed
   ```
4. **Execução**: `npm run dev`

---

## 🧪 Verificação e Qualidade

Para garantir a integridade da aplicação, execute os testes de integração:
```bash
npx playwright test
```

Os testes cobrem:
- Fluxo de Registro e Login.
- CRUD Completo de Pets.
- Validação de permissões cruzadas (Segurança).

---

## 📄 Requisitos do Desafio
A implementação seguiu rigorosamente os requisitos definidos em [docs/DESAFIO.md](./docs/DESAFIO.md), incluindo:
- CRUD funcional (Listar, Criar, Editar, Excluir).
- Pesquisa unificada por Nome do Animal ou Nome do Dono.
- Layout responsivo (Mobile First).
- Validação de propriedade de dados no servidor.

---
Desenvolvido com foco em qualidade técnica e boas práticas de engenharia de software.
