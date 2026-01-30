# PetManager - Desafio Fullstack Jr.

Aplicação de gerenciamento de pets (CRUD) com autenticação e controle de acesso.

## Tecnologias

- **Frontend**: Next.js 15 (App Router), TailwindCSS, Shadcn UI
- **Backend**: Next.js API Routes, NextAuth.js (Auth.js v5)
- **Database**: PostgreSQL (Docker), Prisma ORM
- **Validação**: Zod, React Hook Form

## Pré-requisitos

- Node.js 18+
- Docker & Docker Compose

## Passo a Passo para Rodar

1.  **Clone o repositório e instale as dependências:**
    ```bash
    npm install
    ```

2.  **Configure o Banco de Dados:**
    Certifique-se de que o Docker está rodando e inicie o container do PostgreSQL:
    ```bash
    docker-compose up -d
    ```

3.  **Configuração de Ambiente (.env):**
    O arquivo `.env` já deve estar configurado para o ambiente local Docker:
    ```ini
    DATABASE_URL="postgresql://user:password@localhost:5432/petshop?schema=public"
    AUTH_SECRET="seu-segredo-gerado" # (Já configurado no setup)
    ```

4.  **Execute as Migrations do Banco:**
    ```bash
    npx prisma migrate dev --name init
    ```

5.  **Inicie a Aplicação:**
    ```bash
    npm run dev
    ```
    Acesse: `http://localhost:3000`

## Funcionalidades

- **Cadastro/Login**: Crie uma conta para acessar o sistema.
- **Dashboard**: Visualize todos os pets cadastrados.
- **Pesquisa**: Filtre por nome do pet ou do dono.
- **Novo Pet**: Cadastre um novo pet.
- **Edição/Exclusão**: Apenas o dono que cadastrou o pet pode editá-lo ou excluí-lo.

## Testes

1.  Crie um usuário A e cadastre um pet.
2.  Crie um usuário B.
3.  O usuário B verá o pet do A na lista, mas os botões de editar/excluir não aparecerão.
4.  O usuário B pode cadastrar seus próprios pets.
