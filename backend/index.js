const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');
const mongoose = require('mongoose');
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  transports: ['websocket', 'polling']
});

// Configuração do MongoDB
mongoose.connect(process.env.MONGODB_URI || 'URI DO BANCO DE DADOS', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Conectado ao MongoDB');
}).catch((error) => {
  console.error('Erro ao conectar ao MongoDB:', error);
});

// Modelo de mensagens
const messageSchema = new mongoose.Schema({
  username: { type: String, required: true },
  message: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

const Message = mongoose.model('Message', messageSchema);

// Servindo os arquivos estáticos do frontend
app.use(express.static(path.join(__dirname, '../frontend')));

// Lista de usuários conectados
const users = {};

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

    // Enviar histórico de mensagens
    Message.find().sort({ timestamp: 1 }).then((messages) => {
      console.log('Mensagens carregadas do banco de dados:', messages);
      socket.emit('messageHistory', messages);
    }).catch((error) => {
      console.error('Erro ao carregar histórico de mensagens:', error);
      socket.emit('error', 'Erro ao carregar histórico de mensagens');
    });

    io.emit('userList', Object.values(users)); // Notifica todos os usuários sobre o novo usuário
  }
});

  // Quando uma mensagem é enviada
  socket.on('sendMessage', (data) => {
    console.log('Mensagem recebida:', data);

    if (!data.username || !data.text) {
      console.error('Dados da mensagem inválidos:', data);
      return;
    }

    const newMessage = new Message({
      username: data.username,
      message: data.text,
    });

    newMessage.save().then(() => {
      console.log('Mensagem salva no banco de dados:', newMessage);
      io.emit('newMessage', { username: data.username, message: data.text });
    }).catch((error) => {
      console.error('Erro ao salvar a mensagem:', error);
    });
  });

  // Quando um usuário se desconecta
  socket.on('disconnect', () => {
    const username = users[socket.id];
    console.log(`${username || 'Usuário desconhecido'} desconectou-se.`);
    delete users[socket.id]; // Removendo o usuário da lista
    io.emit('userList', Object.values(users)); // Atualiza a lista de usuários para todos
  });
});

// Verificar se o usuário já existe
function userExists(username) {
  return Object.values(users).includes(username);
}

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});