const fs = require('fs');

const path = require('path');



const dataPath = path.join(__dirname, 'users.json');



// Função para ler os usuarios do arquivo JSON

function getUser(res) {

  fs.readFile(dataPath, 'utf8', (err, data) => {

    if (err) {

      res.writeHead(500, { 'Content-Type': 'text/plain' });

      res.end('Erro ao ler os dados');

    } else {

      res.writeHead(200, { 'Content-Type': 'application/json' });

      res.end(data);

    }

  });

}

// Função para adicionar usuarios no arquivo JSON

function addUser(req, res) {
  const newUser = req.body;

  fs.readFile(dataPath, 'utf8', (err, data) => {
    if (err) {
      res.status(500).send('Erro ao ler os dados');
    } else {
      const users = JSON.parse(data);
      newUser.id = users.length + 1;
      users.push(newUser);

      fs.writeFile(dataPath, JSON.stringify(users, null, 2), err => {
        if (err) {
          res.status(500).send('Erro ao salvar o usuario');
        } else {
          res.status(201).json(newUser);
        }
      });
    }
  });
}




// Função para atualizar um usuario

function updateUser(req, res, id) {
  const updateUser = req.body;

  fs.readFile(dataPath, 'utf8', (err, data) => {
    if (err) {
      res.status(500).send('Erro ao ler os dados');
    } else {
      let users = JSON.parse(data);
      const userIndex = users.findIndex(user => user.id === parseInt(id));

      if (userIndex === -1) {
        res.status(404).send('Usuario não encontrado');
      } else {
        users[userIndex] = { ...users[userIndex], ...updateUser };

        fs.writeFile(dataPath, JSON.stringify(users, null, 2), err => {
          if (err) {
            res.status(500).send('Erro ao salvar as mudanças');
          } else {
            res.status(200).json(users[userIndex]);
          }
        });
      }
    }
  });
}


// Função para deletar um usuario

function deleteUser(res, id) {

  fs.readFile(dataPath, 'utf8', (err, data) => {

    if (err) {

      res.writeHead(500, { 'Content-Type': 'text/plain' });

      res.end('Erro ao ler os dados');

    } else {

      let users = JSON.parse(data);

      const filteredusers = users.filter(user => user.id !== parseInt(id));



      fs.writeFile(dataPath, JSON.stringify(filteredusers, null, 2), err => {

        if (err) {

          res.writeHead(500, { 'Content-Type': 'text/plain' });

          res.end('Erro ao deletar o usuario');

        } else {

          res.writeHead(200, { 'Content-Type': 'text/plain' });

          res.end('Usuario deletado com sucesso');

        }

      });

    }

  });

}
function searchUser(req, res) {
  const { nome,email, campo } = req.query;

  fs.readFile(dataPath, 'utf8', (err, data) => {
    if (err) {
      res.status(500).send('Erro ao ler os dados');
    } else {
      let users = JSON.parse(data);

      if (nome) {
        users = users.filter(u => u.nome.toLowerCase().includes(nome.toLowerCase()));
      }
      if (email) {
        users = users.filter(u => u.email.toLowerCase().includes(email.toLowerCase()));
      }

      // Novo filtro: retornar somente nome ou email
      if (campo === 'nome') {
        users = users.map(u => ({ nome: u.nome }));
      } else if (campo === 'email') {
        users = users.map(u => ({ email: u.email }));
      }

      res.status(200).json(users);
    }
  });
}

module.exports = { getUser, addUser, updateUser, deleteUser,searchUser};

