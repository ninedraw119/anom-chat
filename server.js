const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: { origin: "*" },
  maxHttpBufferSize: 1e6 // limita o tamanho da mensagem (evita abusos)
});

app.use(express.static('public'));

let users = {}; // Para armazenar os nomes dos usuários

// Quando um cliente se conecta
io.on('connection', (socket) => {
  console.log('Novo usuário conectado.');

  // Quando o nome do usuário é definido
  socket.on('setUsername', (username) => {
    users[socket.id] = username; // Associa o nome ao socket
    console.log(`${username} entrou no chat.`);
  });

  // Quando o usuário envia uma mensagem
  socket.on('msg', (data) => {
    const username = users[socket.id] || 'Usuário Anônimo'; // Pega o nome associado ao socket
    io.emit('msg', { username, message: data.message });
  });

  // Quando o usuário se desconecta
  socket.on('disconnect', () => {
    console.log('Usuário desconectado.');
    delete users[socket.id]; // Remove o usuário quando desconectar
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor no ar em http://localhost:${PORT}`);
});
