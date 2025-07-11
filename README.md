# Teste Técnico Backend de Geração de OTP (BTG)

Serviço backend para geração e validação de tokens OTP (One-Time Password), desenvolvido em Node.js com TypeScript, utilizando Express e Redis para armazenamento temporário dos tokens.

## Objetivo

Este projeto tem como objetivo fornecer uma API simples e eficiente para geração e validação de tokens OTP, com TTL (Time To Live) configurável, ideal para fluxos de autenticação de dois fatores ou validação temporária de ações sensíveis.

## Principais Decisões Técnicas

- **Geração Manual de OTP:** Inicialmente foi utilizada a biblioteca `otplib`, mas optou-se por implementar a lógica de geração manualmente para maior controle e flexibilidade.
- **Armazenamento no Redis:** Os tokens gerados são salvos no Redis, utilizando o `expirationTimeInSeconds` passado como parâmetro como TTL do Redis.
- **Express:** A API foi implementada utilizando Express, mas a estrutura permite fácil adaptação para AWS Lambda utilizando bibliotecas de adaptação (ex: `aws-serverless-express`).
- **Injeção de Dependência & Factory:** Utilização de injeção de dependência e padrão Factory para instanciar e injetar as dependências nos controllers e use cases.
- **Clean Architecture (parcial):** Alguns conceitos de Clean Architecture foram aplicados, mas sem excesso de abstração, priorizando simplicidade e clareza.
- **Padrão DAO:** Utilização do padrão Data Access Object (DAO) para acesso aos dados, em vez do padrão Repository, por ser mais simples e adequado ao contexto do projeto.
- **Validação de Parâmetros:** Não foi utilizada uma biblioteca de validação (como Joi ou Zod) devido à simplicidade dos parâmetros, mas a estrutura permite fácil inclusão dessas ferramentas se necessário.

## Estrutura do Projeto

```
src/
  controllers/
    otp-controller.ts      # Controller principal da API OTP
  db/
    dao/
      otp-redis-dao.ts    # Implementação DAO para Redis
    interfaces/
      otp.ts              # Interface do DAO
    memory/
      otp-memory-dao.ts   # Implementação DAO em memória (para testes)
  factories/
    otp-factory.ts        # Factory para injeção de dependências
  use-cases/
    generate-otp.ts       # Caso de uso: geração de OTP
    validate-otp.ts       # Caso de uso: validação de OTP
  index.ts                # Ponto de entrada da aplicação
tests/
  controllers/
    otp-controller.test.ts
  use-cases/
    generate-otp.test.ts
    validate-otp.test.ts
docker-compose.yml        # Configuração do Redis para desenvolvimento
```

## Como Executar

### Pré-requisitos

- Docker (para rodar o Redis e a aplicação Node.js)

### Executando a Aplicação

```bash
docker-compose up
```

A API estará disponível em `http://localhost:3000`.

### Executando os Testes

```bash
npm test (precisa entrar no container antes com um "docker exec -it <container_id>")
```

## Exemplos de Uso

### Gerar OTP

**POST** `/otp/generate`

**Body:**
```json
{
  "expiresInSeconds": 300
}
```

**Resposta:**
```json
{
    "message": "OTP generated successfully",
    "data": {
        "otp": <otp_id>,
        "tokenId": <token_id>,
        "expiresAt": Date
    }
}
```

### Validar OTP

**POST** `/otp/validate`

**Body:**
```json
{
   "tokenId": <token_id>,
   "otp": <otp_id>
}
```

**Resposta:**
```json
{
   "message": "OTP validated successfully",
   "isValid": true
}
```

## Possíveis Extensões

- **Deploy como Lambda:** A estrutura permite fácil adaptação para AWS Lambda utilizando bibliotecas como `aws-serverless-express`.
- **Validação de Parâmetros:** Pode-se adicionar facilmente validação de parâmetros com Joi, Zod ou outras libs.
- **Outros Backends:** Implementação de outros DAOs para diferentes backends de armazenamento, se necessário.

## Observações

- O projeto prioriza simplicidade e clareza, aplicando padrões e abstrações apenas quando necessário.
- O uso do padrão DAO facilita a troca do backend de armazenamento (Redis, memória, etc).
- Testes de integração cobrem os principais casos de uso e controllers.