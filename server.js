const express = require("express");
const socketIO = require("socket.io");
const fs = require("fs");
const path = require("path");

const app = express();
const server = app.listen(3000, () => {
  console.log("Servidor rodando na porta 3000");
});

const io = socketIO(server);

app.use(express.static("public"));

io.on("connection", (socket) => {
  console.log("Novo usuário conectado!");

  socket.on("join", (username) => {
    console.log(`${username} entrou no chat`);
    socket.username = username;
  });

  socket.on("msg", (message) => {
    io.emit("msg", `${socket.username}: ${message}`);
  });

  socket.on("file", (fileData) => {
    const filename = fileData.filename;
    const fileType = fileData.type; // Tipo de arquivo (imagem, vídeo, etc.)
    const savePath = path.join(__dirname, "public", "uploads", filename);

    fs.writeFile(savePath, Buffer.from(fileData.data), (err) => {
      if (err) {
        console.error("Erro ao salvar arquivo:", err);
        return;
      }

      const fileUrl = `/uploads/${filename}`;
      io.emit("file", {
        filename: fileData.filename,
        url: fileUrl,
        type: fileType // Envia o tipo (imagem, vídeo, etc.)
      });
    });
  });
});
