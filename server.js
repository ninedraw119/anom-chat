const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: { origin: "*" },
  maxHttpBufferSize: 1e7 // suporta arquivos até ~10MB
});

// Configuração do upload
const upload = multer({ dest: path.join(__dirname, 'public/uploads/') });

app.use(express.static('public'));

let users = {};

// Upload de arquivos via formulário
app.post('/upload', upload.single('file'), (req, res) => {
  const file = req.file;
  if (!file) return res.status(400).send('Nenhum arquivo enviado.');

  const ext = path.extname(file.originalname);
  const newName = file.filename + ext;
  const newPath = path.join(file.destination, newName);

  fs.renameSync(file.path, newPath); // Renomeia para manter a extensão

  const fileUrl = `/uploads/${newName}`;
  res.json({ fileUrl });
});

// WebSocket
io.on('connection', (socket) => {
  console.log('Usuário conectado');

  socket.on('join', (username) => {
    users[socket.id] = username;
    console.log(`${username} entrou`);
  });

  socket.on('msg', (data) => {
    const username = users[socket.id] || 'Anônimo';
    io.emit('msg', { username, message: data.message, isFile: data.isFile });
  });

  socket.on('disconnect', () => {
    console.log('Usuário desconectado');
    delete users[socket.id];
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
