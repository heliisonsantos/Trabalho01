const express = require("express");
const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");

const app = express();

const swaggerOptions = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "API da Biblioteca Escolar",
            version: "1.0.0",
            description: "API para gerenciamento de livros, estudantes e empréstimos"
        },
        servers: [
            {
                url: "http://localhost:3000"
            }
        ]
    },
    apis: ["./server.js"]
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

app.use(express.json());
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

function respostaErro(res, status, codigo, mensagem) {
    return res.status(status).json({
        erro: {
            codigo: codigo,
            mensagem: mensagem
        }
    });
}

let livros = [
    {
        id: 1,
        titulo: "O Pequeno Príncipe",
        autor: "Antoine de Saint-Exupéry"
    },
    {
        id: 2,
        titulo: "Dom Casmurro",
        autor: "Machado de Assis"
    }
];

let estudantes = [
    {
        id: 1,
        nome: "João Silva",
        matricula: "2026001"
    },
    {
        id: 2,
        nome: "Maria Santos",
        matricula: "2026002"
    }
];

let emprestimos = [
    {
        id: 1,
        livroId: 1,
        estudanteId: 1,
        dataEmprestimo: "2026-09-03"
    },
    {
        id: 2,
        livroId: 2,
        estudanteId: 2,
        dataEmprestimo: "2026-09-03"
    }
];

app.get("/", (req, res) => {
    res.json({
        mensagem: "Bem-vindo à API da Biblioteca Escolar!"
    });
});


/**
 * @swagger
 * /livros:
 *   get:
 *     summary: Lista todos os livros
 *     parameters:
 *       - in: query
 *         name: titulo
 *         schema:
 *           type: string
 *         description: Busca livros pelo título
 *       - in: query
 *         name: autor
 *         schema:
 *           type: string
 *         description: Filtra livros pelo autor
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           example: 1
 *         description: Número da página
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           example: 10
 *         description: Quantidade de itens por página
 *     responses:
 *       200:
 *         description: Lista de livros retornada com sucesso
 *         content:
 *           application/json:
 *             example:
 *               total: 2
 *               page: 1
 *               totalPages: 1
 *               dados:
 *                 - id: 1
 *                   titulo: O Pequeno Príncipe
 *                   autor: Antoine de Saint-Exupéry
 *                 - id: 2
 *                   titulo: Dom Casmurro
 *                   autor: Machado de Assis
 *       400:
 *         description: Dados inválidos
 *         content:
 *           application/json:
 *             example:
 *               erro:
 *                 codigo: DADOS_INVALIDOS
 *                 mensagem: page e limit devem ser números maiores que zero
 */

app.get("/livros", (req, res) => {
    const { titulo, autor, page = 1, limit = 10 } = req.query;

    let resultado = livros;

    if (titulo) {
        resultado = resultado.filter(livro =>
            livro.titulo.toLowerCase().includes(titulo.toLowerCase())
        );
    }

    if (autor) {
        resultado = resultado.filter(livro =>
            livro.autor.toLowerCase().includes(autor.toLowerCase())
        );
    }

    const pageNumero = Number(page);
    const limitNumero = Number(limit);

    if (
        pageNumero <= 0 ||
        limitNumero <= 0 ||
        isNaN(pageNumero) ||
        isNaN(limitNumero)
    ) {
        return respostaErro(
            res,
            400,
            "DADOS_INVALIDOS",
            "page e limit devem ser números maiores que zero"
        );
    }

    const inicio = (pageNumero - 1) * limitNumero;
    const fim = inicio + limitNumero;

    const livrosPaginados = resultado.slice(inicio, fim);

    const totalPages = Math.ceil(
        resultado.length / limitNumero
    );

    res.json({
        total: resultado.length,
        page: pageNumero,
        totalPages: totalPages,
        dados: livrosPaginados
    });
});


/**
 * @swagger
 * /livros/{id}:
 *   get:
 *     summary: Busca um livro pelo ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     responses:
 *       200:
 *         description: Livro encontrado
 *         content:
 *           application/json:
 *             example:
 *               id: 1
 *               titulo: O Pequeno Príncipe
 *               autor: Antoine de Saint-Exupéry
 *       404:
 *         description: Livro não encontrado
 *         content:
 *           application/json:
 *             example:
 *               erro:
 *                 codigo: RECURSO_NAO_ENCONTRADO
 *                 mensagem: Livro não encontrado
 */

app.get("/livros/:id", (req, res) => {
    const id = Number(req.params.id);

    const livro = livros.find(livro => livro.id === id);

    if (!livro) {
        return respostaErro(
            res,
            404,
            "RECURSO_NAO_ENCONTRADO",
            "Livro não encontrado"
        );
    }

    res.json(livro);
});


/**
 * @swagger
 * /livros:
 *   post:
 *     summary: Cadastra um novo livro
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             id: 3
 *             titulo: A Revolução dos Bichos
 *             autor: George Orwell
 *     responses:
 *       201:
 *         description: Livro criado com sucesso
 *         content:
 *           application/json:
 *             example:
 *               id: 3
 *               titulo: A Revolução dos Bichos
 *               autor: George Orwell
 *       400:
 *         description: Dados inválidos
 *         content:
 *           application/json:
 *             example:
 *               erro:
 *                 codigo: DADOS_INVALIDOS
 *                 mensagem: Os campos id, titulo e autor são obrigatórios
 *       409:
 *         description: Livro duplicado
 *         content:
 *           application/json:
 *             example:
 *               erro:
 *                 codigo: RECURSO_DUPLICADO
 *                 mensagem: Já existe um livro com este ID
 */

app.post("/livros", (req, res) => {
    const novoLivro = req.body;

    if (!novoLivro.id || !novoLivro.titulo || !novoLivro.autor) {
        return respostaErro(
            res,
            400,
            "DADOS_INVALIDOS",
            "Os campos id, titulo e autor são obrigatórios"
        );
    }

    if (
        typeof novoLivro.id !== "number" ||
        typeof novoLivro.titulo !== "string" ||
        typeof novoLivro.autor !== "string"
    ) {
        return respostaErro(
            res,
            400,
            "DADOS_INVALIDOS",
            "O id deve ser um número e titulo e autor devem ser textos"
        );
    }

    const livroExistente = livros.find(
        livro => livro.id === novoLivro.id
    );

    if (livroExistente) {
        return respostaErro(
            res,
            409,
            "RECURSO_DUPLICADO",
            "Já existe um livro com este ID"
        );
    }

    livros.push(novoLivro);

    res.status(201).json(novoLivro);
});


/**
 * @swagger
 * /livros/{id}:
 *   put:
 *     summary: Atualiza completamente um livro
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             titulo: O Pequeno Príncipe - Nova Edição
 *             autor: Antoine de Saint-Exupéry
 *     responses:
 *       200:
 *         description: Livro atualizado
 *         content:
 *           application/json:
 *             example:
 *               id: 1
 *               titulo: O Pequeno Príncipe - Nova Edição
 *               autor: Antoine de Saint-Exupéry
 *       400:
 *         description: Dados inválidos
 *         content:
 *           application/json:
 *             example:
 *               erro:
 *                 codigo: DADOS_INVALIDOS
 *                 mensagem: Os campos titulo e autor são obrigatórios
 *       404:
 *         description: Livro não encontrado
 *         content:
 *           application/json:
 *             example:
 *               erro:
 *                 codigo: RECURSO_NAO_ENCONTRADO
 *                 mensagem: Livro não encontrado
 */

app.put("/livros/:id", (req, res) => {
    const id = Number(req.params.id);

    const livro = livros.find(livro => livro.id === id);

    if (!livro) {
        return respostaErro(
            res,
            404,
            "RECURSO_NAO_ENCONTRADO",
            "Livro não encontrado"
        );
    }

    if (!req.body.titulo || !req.body.autor) {
        return respostaErro(
            res,
            400,
            "DADOS_INVALIDOS",
            "Os campos titulo e autor são obrigatórios"
        );
    }

    if (
        typeof req.body.titulo !== "string" ||
        typeof req.body.autor !== "string"
    ) {
        return respostaErro(
            res,
            400,
            "DADOS_INVALIDOS",
            "titulo e autor devem ser textos"
        );
    }

    livro.titulo = req.body.titulo;
    livro.autor = req.body.autor;

    res.json(livro);
});


/**
 * @swagger
 * /livros/{id}:
 *   patch:
 *     summary: Atualiza parcialmente um livro
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             titulo: O Pequeno Príncipe Atualizado
 *     responses:
 *       200:
 *         description: Livro atualizado
 *         content:
 *           application/json:
 *             example:
 *               id: 1
 *               titulo: O Pequeno Príncipe Atualizado
 *               autor: Antoine de Saint-Exupéry
 *       400:
 *         description: Dados inválidos
 *         content:
 *           application/json:
 *             example:
 *               erro:
 *                 codigo: DADOS_INVALIDOS
 *                 mensagem: titulo deve ser um texto
 *       404:
 *         description: Livro não encontrado
 *         content:
 *           application/json:
 *             example:
 *               erro:
 *                 codigo: RECURSO_NAO_ENCONTRADO
 *                 mensagem: Livro não encontrado
 */

app.patch("/livros/:id", (req, res) => {
    const id = Number(req.params.id);

    const livro = livros.find(livro => livro.id === id);

    if (!livro) {
        return respostaErro(
            res,
            404,
            "RECURSO_NAO_ENCONTRADO",
            "Livro não encontrado"
        );
    }

    if (
        req.body.titulo !== undefined &&
        typeof req.body.titulo !== "string"
    ) {
        return respostaErro(
            res,
            400,
            "DADOS_INVALIDOS",
            "titulo deve ser um texto"
        );
    }

    if (
        req.body.autor !== undefined &&
        typeof req.body.autor !== "string"
    ) {
        return respostaErro(
            res,
            400,
            "DADOS_INVALIDOS",
            "autor deve ser um texto"
        );
    }

    if (req.body.titulo !== undefined) {
        livro.titulo = req.body.titulo;
    }

    if (req.body.autor !== undefined) {
        livro.autor = req.body.autor;
    }

    res.json(livro);
});


/**
 * @swagger
 * /livros/{id}:
 *   delete:
 *     summary: Remove um livro
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     responses:
 *       204:
 *         description: Livro removido
 *       404:
 *         description: Livro não encontrado
 *         content:
 *           application/json:
 *             example:
 *               erro:
 *                 codigo: RECURSO_NAO_ENCONTRADO
 *                 mensagem: Livro não encontrado
 */

app.delete("/livros/:id", (req, res) => {
    const id = Number(req.params.id);

    const indice = livros.findIndex(
        livro => livro.id === id
    );

    if (indice === -1) {
        return respostaErro(
            res,
            404,
            "RECURSO_NAO_ENCONTRADO",
            "Livro não encontrado"
        );
    }

    livros.splice(indice, 1);

    res.status(204).send();
});


/**
 * @swagger
 * /estudantes:
 *   get:
 *     summary: Lista todos os estudantes
 *     responses:
 *       200:
 *         description: Lista de estudantes
 *         content:
 *           application/json:
 *             example:
 *               - id: 1
 *                 nome: João Silva
 *                 matricula: "2026001"
 *               - id: 2
 *                 nome: Maria Santos
 *                 matricula: "2026002"
 */

app.get("/estudantes", (req, res) => {
    res.json(estudantes);
});


/**
 * @swagger
 * /estudantes/{id}:
 *   get:
 *     summary: Busca um estudante pelo ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do estudante
 *         schema:
 *           type: integer
 *         example: 1
 *     responses:
 *       200:
 *         description: Estudante encontrado com sucesso
 *         content:
 *           application/json:
 *             example:
 *               id: 1
 *               nome: João Silva
 *               matricula: "2026001"
 *       404:
 *         description: Estudante não encontrado
 *         content:
 *           application/json:
 *             example:
 *               erro:
 *                 codigo: RECURSO_NAO_ENCONTRADO
 *                 mensagem: Estudante não encontrado
 */

app.get("/estudantes/:id", (req, res) => {
    const id = Number(req.params.id);

    const estudante = estudantes.find(
        estudante => estudante.id === id
    );

    if (!estudante) {
        return respostaErro(
            res,
            404,
            "RECURSO_NAO_ENCONTRADO",
            "Estudante não encontrado"
        );
    }

    res.json(estudante);
});


/**
 * @swagger
 * /estudantes:
 *   post:
 *     summary: Cadastra um novo estudante
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             id: 3
 *             nome: Pedro Oliveira
 *             matricula: "2026003"
 *     responses:
 *       201:
 *         description: Estudante criado com sucesso
 *         content:
 *           application/json:
 *             example:
 *               id: 3
 *               nome: Pedro Oliveira
 *               matricula: "2026003"
 *       400:
 *         description: Dados inválidos
 *         content:
 *           application/json:
 *             example:
 *               erro:
 *                 codigo: DADOS_INVALIDOS
 *                 mensagem: Os campos id, nome e matricula são obrigatórios
 *       409:
 *         description: Estudante duplicado
 *         content:
 *           application/json:
 *             example:
 *               erro:
 *                 codigo: RECURSO_DUPLICADO
 *                 mensagem: Já existe um estudante com este ID
 */

app.post("/estudantes", (req, res) => {
    const novoEstudante = req.body;

    if (
        !novoEstudante.id ||
        !novoEstudante.nome ||
        !novoEstudante.matricula
    ) {
        return respostaErro(
            res,
            400,
            "DADOS_INVALIDOS",
            "Os campos id, nome e matricula são obrigatórios"
        );
    }

    if (
        typeof novoEstudante.id !== "number" ||
        typeof novoEstudante.nome !== "string" ||
        typeof novoEstudante.matricula !== "string"
    ) {
        return respostaErro(
            res,
            400,
            "DADOS_INVALIDOS",
            "id deve ser número e nome e matricula devem ser textos"
        );
    }

    const estudanteExistente = estudantes.find(
        estudante => estudante.id === novoEstudante.id
    );

    if (estudanteExistente) {
        return respostaErro(
            res,
            409,
            "RECURSO_DUPLICADO",
            "Já existe um estudante com este ID"
        );
    }

    const matriculaExistente = estudantes.find(
        estudante =>
            estudante.matricula === novoEstudante.matricula
    );

    if (matriculaExistente) {
        return respostaErro(
            res,
            409,
            "RECURSO_DUPLICADO",
            "Já existe um estudante com esta matrícula"
        );
    }

    estudantes.push(novoEstudante);

    res.status(201).json(novoEstudante);
});


/**
 * @swagger
 * /estudantes/{id}:
 *   put:
 *     summary: Atualiza completamente um estudante
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do estudante
 *         schema:
 *           type: integer
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             nome: João da Silva
 *             matricula: "2026001"
 *     responses:
 *       200:
 *         description: Estudante atualizado com sucesso
 *         content:
 *           application/json:
 *             example:
 *               id: 1
 *               nome: João da Silva
 *               matricula: "2026001"
 *       400:
 *         description: Dados inválidos
 *         content:
 *           application/json:
 *             example:
 *               erro:
 *                 codigo: DADOS_INVALIDOS
 *                 mensagem: Os campos nome e matricula são obrigatórios
 *       404:
 *         description: Estudante não encontrado
 *         content:
 *           application/json:
 *             example:
 *               erro:
 *                 codigo: RECURSO_NAO_ENCONTRADO
 *                 mensagem: Estudante não encontrado
 */

app.put("/estudantes/:id", (req, res) => {
    const id = Number(req.params.id);

    const estudante = estudantes.find(
        estudante => estudante.id === id
    );

    if (!estudante) {
        return respostaErro(
            res,
            404,
            "RECURSO_NAO_ENCONTRADO",
            "Estudante não encontrado"
        );
    }

    if (!req.body.nome || !req.body.matricula) {
        return respostaErro(
            res,
            400,
            "DADOS_INVALIDOS",
            "Os campos nome e matricula são obrigatórios"
        );
    }

    if (
        typeof req.body.nome !== "string" ||
        typeof req.body.matricula !== "string"
    ) {
        return respostaErro(
            res,
            400,
            "DADOS_INVALIDOS",
            "nome e matricula devem ser textos"
        );
    }

    estudante.nome = req.body.nome;
    estudante.matricula = req.body.matricula;

    res.json(estudante);
});


/**
 * @swagger
 * /estudantes/{id}:
 *   patch:
 *     summary: Atualiza parcialmente um estudante
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do estudante
 *         schema:
 *           type: integer
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             nome: João Silva Atualizado
 *     responses:
 *       200:
 *         description: Estudante atualizado parcialmente com sucesso
 *         content:
 *           application/json:
 *             example:
 *               id: 1
 *               nome: João Silva Atualizado
 *               matricula: "2026001"
 *       400:
 *         description: Dados inválidos
 *         content:
 *           application/json:
 *             example:
 *               erro:
 *                 codigo: DADOS_INVALIDOS
 *                 mensagem: nome deve ser um texto
 *       404:
 *         description: Estudante não encontrado
 *         content:
 *           application/json:
 *             example:
 *               erro:
 *                 codigo: RECURSO_NAO_ENCONTRADO
 *                 mensagem: Estudante não encontrado
 */

app.patch("/estudantes/:id", (req, res) => {
    const id = Number(req.params.id);

    const estudante = estudantes.find(
        estudante => estudante.id === id
    );

    if (!estudante) {
        return respostaErro(
            res,
            404,
            "RECURSO_NAO_ENCONTRADO",
            "Estudante não encontrado"
        );
    }

    if (
        req.body.nome !== undefined &&
        typeof req.body.nome !== "string"
    ) {
        return respostaErro(
            res,
            400,
            "DADOS_INVALIDOS",
            "nome deve ser um texto"
        );
    }

    if (
        req.body.matricula !== undefined &&
        typeof req.body.matricula !== "string"
    ) {
        return respostaErro(
            res,
            400,
            "DADOS_INVALIDOS",
            "matricula deve ser um texto"
        );
    }

    if (req.body.nome !== undefined) {
        estudante.nome = req.body.nome;
    }

    if (req.body.matricula !== undefined) {
        estudante.matricula = req.body.matricula;
    }

    res.json(estudante);
});


/**
 * @swagger
 * /estudantes/{id}:
 *   delete:
 *     summary: Remove um estudante
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do estudante
 *         schema:
 *           type: integer
 *         example: 1
 *     responses:
 *       204:
 *         description: Estudante removido com sucesso
 *       404:
 *         description: Estudante não encontrado
 *         content:
 *           application/json:
 *             example:
 *               erro:
 *                 codigo: RECURSO_NAO_ENCONTRADO
 *                 mensagem: Estudante não encontrado
 */

app.delete("/estudantes/:id", (req, res) => {
    const id = Number(req.params.id);

    const indice = estudantes.findIndex(
        estudante => estudante.id === id
    );

    if (indice === -1) {
        return respostaErro(
            res,
            404,
            "RECURSO_NAO_ENCONTRADO",
            "Estudante não encontrado"
        );
    }

    estudantes.splice(indice, 1);

    res.status(204).send();
});


/**
 * @swagger
 * /estudantes/{id}/emprestimos:
 *   get:
 *     summary: Lista empréstimos de um estudante
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     responses:
 *       200:
 *         description: Lista de empréstimos
 *         content:
 *           application/json:
 *             example:
 *               - id: 1
 *                 livroId: 1
 *                 estudanteId: 1
 *                 dataEmprestimo: "2026-09-03"
 *       404:
 *         description: Estudante não encontrado
 *         content:
 *           application/json:
 *             example:
 *               erro:
 *                 codigo: RECURSO_NAO_ENCONTRADO
 *                 mensagem: Estudante não encontrado
 */

app.get("/estudantes/:id/emprestimos", (req, res) => {
    const id = Number(req.params.id);

    const estudante = estudantes.find(
        estudante => estudante.id === id
    );

    if (!estudante) {
        return respostaErro(
            res,
            404,
            "RECURSO_NAO_ENCONTRADO",
            "Estudante não encontrado"
        );
    }

    const emprestimosDoEstudante = emprestimos.filter(
        emprestimo => emprestimo.estudanteId === id
    );

    res.json(emprestimosDoEstudante);
});


/**
 * @swagger
 * /emprestimos:
 *   get:
 *     summary: Lista todos os empréstimos
 *     responses:
 *       200:
 *         description: Lista de empréstimos
 *         content:
 *           application/json:
 *             example:
 *               - id: 1
 *                 livroId: 1
 *                 estudanteId: 1
 *                 dataEmprestimo: "2026-09-03"
 *               - id: 2
 *                 livroId: 2
 *                 estudanteId: 2
 *                 dataEmprestimo: "2026-09-03"
 */

app.get("/emprestimos", (req, res) => {
    res.json(emprestimos);
});


/**
 * @swagger
 * /emprestimos/{id}:
 *   get:
 *     summary: Busca um empréstimo pelo ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do empréstimo
 *         schema:
 *           type: integer
 *         example: 1
 *     responses:
 *       200:
 *         description: Empréstimo encontrado com sucesso
 *         content:
 *           application/json:
 *             example:
 *               id: 1
 *               livroId: 1
 *               estudanteId: 1
 *               dataEmprestimo: "2026-09-03"
 *       404:
 *         description: Empréstimo não encontrado
 *         content:
 *           application/json:
 *             example:
 *               erro:
 *                 codigo: RECURSO_NAO_ENCONTRADO
 *                 mensagem: Empréstimo não encontrado
 */

app.get("/emprestimos/:id", (req, res) => {
    const id = Number(req.params.id);

    const emprestimo = emprestimos.find(
        emprestimo => emprestimo.id === id
    );

    if (!emprestimo) {
        return respostaErro(
            res,
            404,
            "RECURSO_NAO_ENCONTRADO",
            "Empréstimo não encontrado"
        );
    }

    res.json(emprestimo);
});


/**
 * @swagger
 * /emprestimos:
 *   post:
 *     summary: Cria um novo empréstimo
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             id: 3
 *             livroId: 1
 *             estudanteId: 2
 *             dataEmprestimo: "2026-09-06"
 *     responses:
 *       201:
 *         description: Empréstimo criado com sucesso
 *         content:
 *           application/json:
 *             example:
 *               id: 3
 *               livroId: 1
 *               estudanteId: 2
 *               dataEmprestimo: "2026-09-06"
 *       400:
 *         description: Dados inválidos
 *         content:
 *           application/json:
 *             example:
 *               erro:
 *                 codigo: DADOS_INVALIDOS
 *                 mensagem: Os campos id, livroId, estudanteId e dataEmprestimo são obrigatórios
 *       404:
 *         description: Livro ou estudante não encontrado
 *         content:
 *           application/json:
 *             example:
 *               erro:
 *                 codigo: RECURSO_NAO_ENCONTRADO
 *                 mensagem: Livro não encontrado
 *       409:
 *         description: Empréstimo duplicado
 *         content:
 *           application/json:
 *             example:
 *               erro:
 *                 codigo: RECURSO_DUPLICADO
 *                 mensagem: Já existe um empréstimo com este ID
 */

app.post("/emprestimos", (req, res) => {
    const novoEmprestimo = req.body;

    if (
        !novoEmprestimo.id ||
        !novoEmprestimo.livroId ||
        !novoEmprestimo.estudanteId ||
        !novoEmprestimo.dataEmprestimo
    ) {
        return respostaErro(
            res,
            400,
            "DADOS_INVALIDOS",
            "Os campos id, livroId, estudanteId e dataEmprestimo são obrigatórios"
        );
    }

    if (
        typeof novoEmprestimo.id !== "number" ||
        typeof novoEmprestimo.livroId !== "number" ||
        typeof novoEmprestimo.estudanteId !== "number" ||
        typeof novoEmprestimo.dataEmprestimo !== "string"
    ) {
        return respostaErro(
            res,
            400,
            "DADOS_INVALIDOS",
            "id, livroId e estudanteId devem ser números e dataEmprestimo deve ser texto"
        );
    }

    const emprestimoExistente = emprestimos.find(
        emprestimo => emprestimo.id === novoEmprestimo.id
    );

    if (emprestimoExistente) {
        return respostaErro(
            res,
            409,
            "RECURSO_DUPLICADO",
            "Já existe um empréstimo com este ID"
        );
    }

    const livro = livros.find(
        livro => livro.id === novoEmprestimo.livroId
    );

    if (!livro) {
        return respostaErro(
            res,
            404,
            "RECURSO_NAO_ENCONTRADO",
            "Livro não encontrado"
        );
    }

    const estudante = estudantes.find(
        estudante => estudante.id === novoEmprestimo.estudanteId
    );

    if (!estudante) {
        return respostaErro(
            res,
            404,
            "RECURSO_NAO_ENCONTRADO",
            "Estudante não encontrado"
        );
    }

    emprestimos.push(novoEmprestimo);

    res.status(201).json(novoEmprestimo);
});


/**
 * @swagger
 * /emprestimos/{id}:
 *   put:
 *     summary: Atualiza completamente um empréstimo
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do empréstimo
 *         schema:
 *           type: integer
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             livroId: 2
 *             estudanteId: 1
 *             dataEmprestimo: "2026-09-06"
 *     responses:
 *       200:
 *         description: Empréstimo atualizado com sucesso
 *         content:
 *           application/json:
 *             example:
 *               id: 1
 *               livroId: 2
 *               estudanteId: 1
 *               dataEmprestimo: "2026-09-06"
 *       400:
 *         description: Dados inválidos
 *         content:
 *           application/json:
 *             example:
 *               erro:
 *                 codigo: DADOS_INVALIDOS
 *                 mensagem: Os campos livroId, estudanteId e dataEmprestimo são obrigatórios
 *       404:
 *         description: Empréstimo, livro ou estudante não encontrado
 *         content:
 *           application/json:
 *             example:
 *               erro:
 *                 codigo: RECURSO_NAO_ENCONTRADO
 *                 mensagem: Empréstimo não encontrado
 */

app.put("/emprestimos/:id", (req, res) => {
    const id = Number(req.params.id);

    const emprestimo = emprestimos.find(
        emprestimo => emprestimo.id === id
    );

    if (!emprestimo) {
        return respostaErro(
            res,
            404,
            "RECURSO_NAO_ENCONTRADO",
            "Empréstimo não encontrado"
        );
    }

    if (
        !req.body.livroId ||
        !req.body.estudanteId ||
        !req.body.dataEmprestimo
    ) {
        return respostaErro(
            res,
            400,
            "DADOS_INVALIDOS",
            "Os campos livroId, estudanteId e dataEmprestimo são obrigatórios"
        );
    }

    if (
        typeof req.body.livroId !== "number" ||
        typeof req.body.estudanteId !== "number" ||
        typeof req.body.dataEmprestimo !== "string"
    ) {
        return respostaErro(
            res,
            400,
            "DADOS_INVALIDOS",
            "livroId e estudanteId devem ser números e dataEmprestimo deve ser texto"
        );
    }

    const livro = livros.find(
        livro => livro.id === req.body.livroId
    );

    if (!livro) {
        return respostaErro(
            res,
            404,
            "RECURSO_NAO_ENCONTRADO",
            "Livro não encontrado"
        );
    }

    const estudante = estudantes.find(
        estudante => estudante.id === req.body.estudanteId
    );

    if (!estudante) {
        return respostaErro(
            res,
            404,
            "RECURSO_NAO_ENCONTRADO",
            "Estudante não encontrado"
        );
    }

    emprestimo.livroId = req.body.livroId;
    emprestimo.estudanteId = req.body.estudanteId;
    emprestimo.dataEmprestimo = req.body.dataEmprestimo;

    res.json(emprestimo);
});


/**
 * @swagger
 * /emprestimos/{id}:
 *   patch:
 *     summary: Atualiza parcialmente um empréstimo
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do empréstimo
 *         schema:
 *           type: integer
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             dataEmprestimo: "2026-09-07"
 *     responses:
 *       200:
 *         description: Empréstimo atualizado parcialmente com sucesso
 *         content:
 *           application/json:
 *             example:
 *               id: 1
 *               livroId: 1
 *               estudanteId: 1
 *               dataEmprestimo: "2026-09-07"
 *       400:
 *         description: Dados inválidos
 *         content:
 *           application/json:
 *             example:
 *               erro:
 *                 codigo: DADOS_INVALIDOS
 *                 mensagem: dataEmprestimo deve ser um texto
 *       404:
 *         description: Empréstimo, livro ou estudante não encontrado
 *         content:
 *           application/json:
 *             example:
 *               erro:
 *                 codigo: RECURSO_NAO_ENCONTRADO
 *                 mensagem: Empréstimo não encontrado
 */

app.patch("/emprestimos/:id", (req, res) => {
    const id = Number(req.params.id);

    const emprestimo = emprestimos.find(
        emprestimo => emprestimo.id === id
    );

    if (!emprestimo) {
        return respostaErro(
            res,
            404,
            "RECURSO_NAO_ENCONTRADO",
            "Empréstimo não encontrado"
        );
    }

    if (req.body.livroId !== undefined) {

        if (typeof req.body.livroId !== "number") {
            return respostaErro(
                res,
                400,
                "DADOS_INVALIDOS",
                "livroId deve ser um número"
            );
        }

        const livro = livros.find(
            livro => livro.id === req.body.livroId
        );

        if (!livro) {
            return respostaErro(
                res,
                404,
                "RECURSO_NAO_ENCONTRADO",
                "Livro não encontrado"
            );
        }

        emprestimo.livroId = req.body.livroId;
    }

    if (req.body.estudanteId !== undefined) {

        if (typeof req.body.estudanteId !== "number") {
            return respostaErro(
                res,
                400,
                "DADOS_INVALIDOS",
                "estudanteId deve ser um número"
            );
        }

        const estudante = estudantes.find(
            estudante => estudante.id === req.body.estudanteId
        );

        if (!estudante) {
            return respostaErro(
                res,
                404,
                "RECURSO_NAO_ENCONTRADO",
                "Estudante não encontrado"
            );
        }

        emprestimo.estudanteId = req.body.estudanteId;
    }

    if (req.body.dataEmprestimo !== undefined) {

        if (typeof req.body.dataEmprestimo !== "string") {
            return respostaErro(
                res,
                400,
                "DADOS_INVALIDOS",
                "dataEmprestimo deve ser um texto"
            );
        }

        emprestimo.dataEmprestimo = req.body.dataEmprestimo;
    }

    res.json(emprestimo);
});


/**
 * @swagger
 * /emprestimos/{id}:
 *   delete:
 *     summary: Remove um empréstimo
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do empréstimo
 *         schema:
 *           type: integer
 *         example: 1
 *     responses:
 *       204:
 *         description: Empréstimo removido com sucesso
 *       404:
 *         description: Empréstimo não encontrado
 *         content:
 *           application/json:
 *             example:
 *               erro:
 *                 codigo: RECURSO_NAO_ENCONTRADO
 *                 mensagem: Empréstimo não encontrado
 */

app.delete("/emprestimos/:id", (req, res) => {
    const id = Number(req.params.id);

    const indice = emprestimos.findIndex(
        emprestimo => emprestimo.id === id
    );

    if (indice === -1) {
        return respostaErro(
            res,
            404,
            "RECURSO_NAO_ENCONTRADO",
            "Empréstimo não encontrado"
        );
    }

    emprestimos.splice(indice, 1);

    res.status(204).send();
});


app.use((err, req, res, next) => {
    console.error(err.stack);

    respostaErro(
        res,
        500,
        "ERRO_INTERNO",
        "Erro interno do servidor"
    );
});


const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});