# API Biblioteca Escolar

API REST desenvolvida em Node.js e Express para representar um sistema de biblioteca escolar.

O projeto foi desenvolvido com dados mantidos em memória, sem utilização de banco de dados nesta etapa.

**Integrantes:**
- Helison Santos Cerqueira
- GERFFERSON OLIVEIRA MACHADO

## Tecnologias utilizadas

* Node.js
* Express
* JavaScript
* OpenAPI 3.0
* Swagger UI
* Postman

## Como executar o projeto

### 1. Instalar as dependências

Após baixar ou clonar o projeto, abra o terminal na pasta do projeto e execute:

```bash
npm install
```

### 2. Iniciar o servidor

Execute:

```bash
node server.js
```

O servidor será iniciado em:

http://localhost:3000

### 3. Acessar a documentação

A documentação interativa da API pode ser acessada em:

http://localhost:3000/docs

A documentação utiliza Swagger UI e apresenta os endpoints, parâmetros, exemplos de requisições e respostas.

## Recursos da API

A API possui três recursos principais:

* Livros
* Estudantes
* Empréstimos

Os empréstimos possuem relação com estudantes e livros.

## Endpoints

### Livros

| Método | Endpoint      | Descrição                      |
| ------ | ------------- | ------------------------------ |
| GET    | `/livros`     | Lista os livros                |
| GET    | `/livros/:id` | Consulta um livro              |
| POST   | `/livros`     | Cadastra um livro              |
| PUT    | `/livros/:id` | Substitui um livro             |
| PATCH  | `/livros/:id` | Atualiza parcialmente um livro |
| DELETE | `/livros/:id` | Remove um livro                |

### Estudantes

| Método | Endpoint                      | Descrição                            |
| ------ | ----------------------------- | ------------------------------------ |
| GET    | `/estudantes`                 | Lista os estudantes                  |
| GET    | `/estudantes/:id`             | Consulta um estudante                |
| POST   | `/estudantes`                 | Cadastra um estudante                |
| PUT    | `/estudantes/:id`             | Substitui um estudante               |
| PATCH  | `/estudantes/:id`             | Atualiza parcialmente um estudante   |
| DELETE | `/estudantes/:id`             | Remove um estudante                  |
| GET    | `/estudantes/:id/emprestimos` | Lista os empréstimos de um estudante |

### Empréstimos

| Método | Endpoint           | Descrição                           |
| ------ | ------------------ | ----------------------------------- |
| GET    | `/emprestimos`     | Lista os empréstimos                |
| GET    | `/emprestimos/:id` | Consulta um empréstimo              |
| POST   | `/emprestimos`     | Cadastra um empréstimo              |
| PUT    | `/emprestimos/:id` | Substitui um empréstimo             |
| PATCH  | `/emprestimos/:id` | Atualiza parcialmente um empréstimo |
| DELETE | `/emprestimos/:id` | Remove um empréstimo                |

## Filtros e busca

A API permite realizar filtros e buscas através de parâmetros de consulta.

Exemplo de busca por título:

```text
GET /livros?titulo=dom
```

Exemplo de filtro por autor:

```text
GET /livros?autor=Machado
```

## Paginação

A listagem de livros possui paginação através dos parâmetros `page` e `limit`.

Exemplo:

```text
GET /livros?page=1&limit=5
```

A resposta apresenta informações de paginação, como:

* `total`
* `page`
* `totalPages`
* `dados`

## Validação e tratamento de erros

A API realiza validações dos dados enviados nas requisições.

Os principais códigos utilizados são:

* `200` — Requisição realizada com sucesso
* `201` — Recurso criado com sucesso
* `204` — Recurso excluído com sucesso
* `400` — Dados inválidos
* `404` — Recurso não encontrado
* `409` — Conflito ou recurso duplicado
* `500` — Erro interno do servidor

Os erros seguem um formato padronizado:

```json
{
  "erro": {
    "codigo": "RECURSO_NAO_ENCONTRADO",
    "mensagem": "Livro com id 42 não encontrado"
  }
}
```

## Documentação OpenAPI

O projeto possui o arquivo:

```text
openapi.yaml
```

A documentação interativa pode ser acessada através do Swagger UI:

```text
http://localhost:3000/docs
```

## Testes

A API possui uma coleção do Postman localizada na pasta:

```text
postman/
```

A coleção contém requisições para testar os principais endpoints da API, incluindo casos de sucesso e erros como:

* 400 — Dados inválidos
* 404 — Recurso não encontrado
* 409 — Recurso duplicado

## Estrutura do projeto

```text
bibliotecaescolar/
├── .postman/
├── postman/
│   └── API-Biblioteca-Escolar.postman_collection.json
├── openapi.yaml
├── package-lock.json
├── package.json
├── README.md
└── server.js
```

## Observação

Os dados utilizados pela API são armazenados somente em memória. Dessa forma, os dados são perdidos quando o servidor é encerrado.

A utilização de banco de dados será realizada em uma etapa posterior do projeto.
