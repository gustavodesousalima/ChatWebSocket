const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Servindo arquivos estáticos
app.use(express.static(path.join(__dirname, '../frontend')));

// Lista de usuários conectados
const users = {};

io.on('connection', (socket) => {
  console.log('Um usuário se conectou:', socket.id);

  // Quando um usuário entra no chat
  socket.on('joinChat', (username) => {
    users[socket.id] = username; // Armazenando o nome do usuário
    console.log(`${username} entrou no chat.`);
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
