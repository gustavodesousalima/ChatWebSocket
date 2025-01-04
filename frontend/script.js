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
    
    // Notifica o servidor sobre o novo usuário
    socket.emit('joinChat', username);
    console.log('Evento joinChat emitido');
  } else {
    alert('Por favor, insira seu nome para entrar no chat.');
  }
});

// Função para enviar mensagem
function sendMessage() {
  const message = messageInput.value.trim(); // Captura a mensagem e remove espaços extras
  
  if (message) {
    const chatMessage = {
      username: username,
      text: message,
    };

    socket.emit('sendMessage', chatMessage); // Envia a mensagem para o servidor
    messageInput.value = ''; // Limpa o campo de entrada
    scrollToBottom(); // Rola para o final após enviar a mensagem
  }
}

// Evento de tecla para enviar mensagem
messageInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    sendMessage();
  }
});

// Evento de clique para enviar mensagem
sendMessageButton.addEventListener('click', sendMessage);

// Função para rolar para o final da lista de mensagens
function scrollToBottom() {
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

// Escuta o evento de histórico de mensagens do servidor
socket.on('messageHistory', (messages) => {
  messages.forEach((data) => {
    const newMessage2 = document.createElement('div');
    const newMessage = document.createElement('p');

    if (data.username === username) {
      newMessage2.textContent = `Eu`;
      newMessage.classList.add('myMessage');
      newMessage2.classList.add('mymessagediv');
    } else {
      newMessage2.textContent = `${data.username}`;
      newMessage.classList.add('otherMessage');
      newMessage2.classList.add('otherMessagediv');
    }

    newMessage.textContent = `${data.message}`;
    newMessage2.appendChild(newMessage);
    messagesDiv.appendChild(newMessage2);
  });
  scrollToBottom();
});

// Quando o servidor envia uma mensagem
socket.on('newMessage', (data) => {
  const newMessage2 = document.createElement('div');
  const newMessage = document.createElement('p');

  if (data.username === username) {
    newMessage2.textContent = `Eu`;
    newMessage.classList.add('myMessage');
    newMessage2.classList.add('mymessagediv');
  } else {
    newMessage2.textContent = `${data.username}`;
    newMessage.classList.add('otherMessage');
    newMessage2.classList.add('otherMessagediv');
  }

  newMessage.textContent = `${data.message}`;
  newMessage2.appendChild(newMessage);
  messagesDiv.appendChild(newMessage2);
  scrollToBottom();
});