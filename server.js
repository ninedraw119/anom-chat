const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);
const path = require("path");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");

const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, "public")));

io.on("connection", (socket) => {
  let username = "Anônimo";

  socket.on("join", (name) => {
    username = name || "Anônimo";
    console.log(`${username} entrou no chat`);
  });

  socket.on("msg", (msg) => {
    const message = `<strong>${username}:</strong> ${msg}`;
    io.emit("msg", message);
  });

  socket.on("file", (fileData) => {
    const ext = path.extname(fileData.filename);
    const fileId = uuidv4();
    const filename = `${fileId}${ext}`;
    const savePath = path.join(__dirname, "public", "uploads", filename);

    // Garante que a pasta "uploads" exista
    const uploadsDir = path.join(__dirname, "public", "uploads");
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    fs.writeFile(savePath, Buffer.from(fileData.data), (err) => {
      if (err) {
        console.error("Erro ao salvar arquivo:", err);
        return;
      }

      const fileUrl = `/uploads/${filename}`;
      io.emit("file", {
        filename: fileData.filename,
        url: fileUrl
      });
    });
  });
});

http.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
