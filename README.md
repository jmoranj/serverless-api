# serverless-api

API HTTP de **requests** (tickets) em **AWS Lambda** + **API Gateway HTTP API**, persistência em **Amazon RDS MySQL** via **Prisma**.

## Pré-requisitos


| Ferramenta         | Uso                                                                                       |
| ------------------ | ----------------------------------------------------------------------------------------- |
| **Node.js 20+**    | Runtime alinhado ao Lambda (`nodejs20.x`).                                                |
| **AWS CLI**        | Configurado (`aws configure`) com permissão para deploy na conta/região.                  |
| **Arquivo `.env`** | Variáveis para deploy e/ou desenvolvimento local (ver tabela). |


## Variáveis de ambiente

Conexão com o MySQL usa **só** `DB_*`:


| Variável      | Descrição                                                                                                                                                                            |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `DB_USER`     | Necessário apenas para acessar bancos fora da AWS.                                                                                                                                   |
| `DB_PASSWORD` | Senha (também usada no parâmetro CloudFormation `DBPassword`).                                                                                                                       |
| `DB_NAME`     | Nome do banco criado na instância RDS (e no local).                                                                                                                                  |
| `VPC_ID`      | ID da VPC onde serão criadas subnets privadas, NAT e o RDS.                                                                                                                          |
| `DB_HOST`     | Só no **local** (host do MySQL, ex. `127.0.0.1`). Na AWS o RDS já recebe o host pelo deploy. |
| `DB_PORT`     | Opcional; padrão `3306`.                                                                                                                                                             |


`NODE_ENV` segue o stage do Serverless (`npm run deploy` usa stage **prod** por padrão).

## Por que RDS (MySQL) e não só DynamoDB?

- **Modelo relacional**: entidades com campos fixos, status e datas — encaixa bem em tabelas SQL e **integridade** por schema.  
- **Consultas e evolução**: filtros, ordenação e relatórios futuros com **SQL** e **migrations** (Prisma), sem desnormalizar tudo em padrões de acesso key-value.  
- **Transações ACID** quando precisar garantir consistência entre escritas relacionadas.  
- **DynamoDB** é forte em escala por chave de partição e padrões específicos; para este domínio pequeno/médio, **RDS + SQL** reduz complexidade de modelagem e consultas ad hoc.

## Desenvolvimento local

```bash
npm install
npm predeploy
```

Subir a API localmente (MySQL acessível). No `.env`, além de `DB_USER`, `DB_PASSWORD` e `DB_NAME`, defina **`DB_HOST`** (apenas para o local).

```bash
npm migrate:local
npm run dev
```

A API fica em `http://localhost:3000` (porta padrão do `serverless-offline`; ajuste se mudar no `serverless.yml`).

## Deploy e migrate

```bash
npm run deploy    # gera Prisma Client (predeploy) e faz serverless deploy
npm run migrate   # invoca a Lambda `migrate` no AWS (cria/atualiza tabela no RDS)
```

O script `migrate` chama `serverless-api-prod-migrate` (alinhado ao `deploy` em **prod**). Para outro stage, rode o `aws lambda invoke` com o nome correspondente.

Após o deploy, o terminal mostra o **endpoint** da HTTP API — use essa URL como base nos exemplos abaixo.

## API em produção (evidência de deploy)

**Base URL** :

```
https://53djo9piw6.execute-api.us-east-1.amazonaws.com/
```

## Exemplos com curl

**POST** — criar request:

```bash
curl -s -X POST "https://53djo9piw6.execute-api.us-east-1.amazonaws.com/requests" \
  -H "Content-Type: application/json" \
  -d '{"title":"Bug no login","description":"Erro ao salvar senha","priority":"HIGH","createdBy":"joao"}'
```

**GET** — listar (opcional: `createdBy`, `status`):

```bash
curl -s "https://53djo9piw6.execute-api.us-east-1.amazonaws.com/requests"
curl -s "https://53djo9piw6.execute-api.us-east-1.amazonaws.com/requests?createdBy=joao&status=OPEN"
```

**GET** — por id:

```bash
curl -s "https://53djo9piw6.execute-api.us-east-1.amazonaws.com/requests/SEU_UUID_AQUI"
```

## Testes

```bash
npm test
```

