const socket = io(); // Conecta ao servidor

// Seleciona os elementos do DOM
const nameSection = document.getElementById('nameSection');
const chatSection = document.getElementById('chatSection');
const usernameInput = document.getElementById('username');
const enterChatButton = document.getElementById('enterChat');
const messageInput = document.getElementById('messageInput');
const sendMessageButton = document.getElementById('sendMessage');
const messagesDiv = document.getElementById('messages');
const chatWithSpan = document.getElementById('chatWith');

let username = ""; // Armazena o nome do usuário

// Quando o usuário entra no chat
enterChatButton.addEventListener('click', () => {
  username = usernameInput.value.trim(); // Captura o nome e remove espaços extras

  if (username) {
    nameSection.classList.add('hidden'); // Oculta a seção de nome
    nameSection.style.display = 'none'; // Oculta a seção de nome
    chatSection.classList.remove('hidden'); // Mostra a seção do chat
    chatSection.style.display = 'flex'; // Mostra a seção do chat
    chatWithSpan.textContent = "Todos"; // Pode ser ajustado para um nome específico se necessário

    // Notifica o servidor sobre o novo usuário
    socket.emit('joinChat', username);
  } else {
    alert('Por favor, insira seu nome para entrar no chat.');
  }
});

// Quando o usuário envia uma mensagem
sendMessageButton.addEventListener('click', () => {
  const message = messageInput.value.trim(); // Captura a mensagem e remove espaços extras

  if (message) {
    const chatMessage = {
      username: username,
      text: message,
    };

    socket.emit('sendMessage', chatMessage); // Envia a mensagem para o servidor
    messageInput.value = ''; // Limpa o campo de entrada
  }
});

// Quando o servidor envia uma mensagem
socket.on('newMessage', (data) => {
  const newMessage = document.createElement('p');
  
  if (data.username === username) {
    newMessage.classList.add('myMessage');
  }
  newMessage.textContent = `${data.username}: ${data.text}`; // Exibe o nome e a mensagem
  messagesDiv.appendChild(newMessage);
});
