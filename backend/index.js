const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  transports: ['websocket', 'polling'] // Configuração para usar WebSocket e fallback para polling
});

// Servindo os arquivos estáticos do frontend
app.use(express.static(path.join(__dirname, '../frontend')));

// Lista de usuários conectados
const users = {};

// Verificar se o usuário já existe
function userExists(username) {
  return Object.values(users).includes(username);
}

// Quando um usuário se conecta
io.on('connection', (socket) => {
  console.log('Novo usuário conectado:', socket.id);

  // Quando um usuário entra no chat
  socket.on('joinChat', (username) => {
    if (userExists(username)) {
      socket.emit('alreadyJoined', 'Este nome já está em uso.');
      return;
    } else {
      users[socket.id] = username;
      socket.emit('joined', 'Você entrou no chat.');
      io.emit('userList', Object.values(users)); // Notifica todos os usuários sobre o novo usuário
    }
  });

  // Quando uma mensagem é enviada
  socket.on('sendMessage', (message) => {
    console.log('Mensagem recebida:', message);
    io.emit('newMessage', message); // Reenvia a mensagem para todos os usuários
  });

  // Quando um usuário se desconecta
  socket.on('disconnect', () => {
    const username = users[socket.id];
    console.log(`${username || 'Usuário desconhecido'} desconectou-se.`);
    delete users[socket.id]; // Removendo o usuário da lista
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});