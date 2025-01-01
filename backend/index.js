const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

// Inicializando o express e o servidor HTTP
const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Servindo arquivos estáticos (ajustando o caminho da pasta)
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

// Handler para a função serverless
module.exports = (req, res) => {
  // Conectando o express com o Vercel handler
  server.emit('request', req, res);
};
