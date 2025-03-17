# Turno Vagas

Sumário

- [Sobre](#sobre)
- [Primeiros Passos](#primeiros-passos)
- [Requisitos](#requisitos)
- [Instalação](#instalação)

## Sobre

Turno Vagas é um sistema de agendamento e gestão de turnos, permitindo a organização eficiente de vagas para diferentes profissionais.

## Primeiros passos

### Requisitos

Você precisará ter instalado na sua máquina:

- [Node.js](https://nodejs.org/en/)
- [Docker](https://www.docker.com/)

### Instalação

1. Instale as dependências

```bash
npm i
```

2. Copie os 2 arquivos de env `.example`

```bash
cp db.env.example db.env
cp .env.example .env.local
```

3. Inicie o banco de dados

```bash
docker compose up -d
```

4. Inicie a aplicação

```bash
npm run dev
```

5. Acesse http://localhost:3000

6. Para gerenciar os dados do banco de dados, execute o comando abaixo após iniciar o banco de dados

```bash
# NOTA: Usamos o script “prisma” para configurar o "prisma env", então use “npm run prisma...” em vez de “npx prisma...”
npm run prisma studio
```

Você pode acessar o gerenciado do banco de dados em http://localhost:5555

---

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).
