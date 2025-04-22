const express = require('express');
const swaggerUi = require('swagger-ui-express');
const path = require('path');
const fs = require('fs');
const userController = require('./UserController');


const app = express();

// Middleware para entender JSON no corpo da requisição
app.use(express.json());



// Caminho para o swagger.json
const swaggerPath = path.join(__dirname, 'swagger.json');

if (!fs.existsSync(swaggerPath)) {
  console.error('swagger.json não encontrado!');
  process.exit(1);
}

// Rota para a documentação do Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(require(swaggerPath)));

// Rotas da API de livros
app.get('/users', (req, res) => {
  userController.getUser(res);
});

app.post('/users', (req, res) => {
  userController.addUser(req, res);
});

app.put('/users/:id', (req, res) => {
  const { id } = req.params;
  userController.updateUser(req, res, id);
});

app.delete('/users/:id', (req, res) => {
  const { id } = req.params;
  userController.deleteUser(res, id);
});

app.get('/users/search', (req, res) => {
  userController.searchUser(req, res);
});

// Iniciar o servidor
app.listen(3000, () => {
  console.log('Servidor rodando na porta 3000');
  console.log('Swagger UI rodando em http://localhost:3000/api-docs');
});
