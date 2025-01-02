# Chat WebSocket Project

Este projeto foi desenvolvido com o objetivo de testar o uso do protocolo de comunicação WebSocket. Ele consiste em um servidor backend implementado com Node.js e um frontend estático (HTML, CSS e JavaScript). O projeto permite a interação entre usuários em tempo real através de um chat utilizando WebSocket.

## Tecnologias Utilizadas

- **Node.js** (versão 18 ou superior)
- **Socket.IO**: Para gerenciar conexões WebSocket e fallback para polling.
- **Express.js**: Para servir os arquivos estáticos do frontend.

## Pré-requisitos

- **Node.js** (versão 18 ou superior) instalado em sua máquina.

## Instalação e Execução

1. Clone este repositório:

   ```bash
   git clone https://github.com/gustavodesousalima/ChatWebSocket.git
   ```

2. Navegue até a pasta do backend:

   ```bash
   cd backend
   ```

3. Instale as dependências do projeto:

   ```bash
   npm install
   ```

4. Inicie o servidor:

   ```bash
   npm run start
   ```

5. Acesse a aplicação no navegador em: [http://localhost:3000](http://localhost:3000)

## Funcionamento

1. O servidor Node.js (arquivo `index.js`) gerencia as conexões WebSocket utilizando o Socket.IO.
2. O backend serve os arquivos estáticos localizados na pasta `frontend`.
3. Quando um usuário se conecta, ele pode escolher um nome de usuário e entrar no chat.
4. As mensagens enviadas por um usuário são retransmitidas para todos os usuários conectados em tempo real.
5. Ao desconectar, o usuário é removido da lista de participantes ativos.

## Dependências

As dependências do backend são especificadas no arquivo `package.json` e incluem:

- **express**: Para criação e gerenciamento do servidor web.
- **socket.io**: Para comunicação em tempo real entre o cliente e o servidor.

## Configuração no AWS EC2

Para o deploy desta aplicação, foi utilizado o serviço EC2 da AWS. Durante a configuração do servidor, foram instalados e configurados os seguintes pacotes: Node.js, Nginx, Certbot (para gerenciamento de certificados SSL) e PM2 (gerenciador de processos para aplicações Node.js).

## Contribuição

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues ou pull requests para melhorar este projeto.

## Licença

Este projeto está sob a licença [MIT](LICENSE).

