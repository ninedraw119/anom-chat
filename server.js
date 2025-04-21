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

io.on('connection', (socket) => {
  console.log('Nova conexão anônima.');

  socket.on('msg', (data) => {
    io.emit('msg', data); // reenvia a msg criptografada
  });

  socket.on('disconnect', () => {
    console.log('Desconectado.');
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor no ar em http://localhost:${PORT}`);
});
