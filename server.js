const express = require("express");
const path = require("path");
const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http);

// Servir arquivos estáticos da pasta 'public' (incluindo as imagens de pré-visualização)
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

io.on("connection", (socket) => {
  console.log("Novo usuário conectado");

  // Receber e enviar a mensagem
  socket.on("msg", (message) => {
    let previewImage = "txt.png";  // Valor padrão para a pré-visualização

    // Definir o tipo de pré-visualização com base na extensão do arquivo
    if (message.endsWith(".mp3")) {
      previewImage = "mp3.png";
    } else if (message.endsWith(".pdf")) {
      previewImage = "pdf.png";
    }

    // Enviar a mensagem com o caminho da imagem de pré-visualização
    io.emit("msg", {
      message: message,
      previewImage: `/previews/${previewImage}`, // Caminho da imagem de pré-visualização
      fileUrl: `/previews/${previewImage}`       // Caminho para o arquivo de download
    });
  });
});

http.listen(3000, () => {
  console.log("Servidor rodando na porta 3000");
});
