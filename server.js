const express = require("express");
const path = require("path");
const multer = require("multer"); // Importando o multer
const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http);

// Configuração do multer para salvar os arquivos na pasta 'uploads'
const upload = multer({ dest: "uploads/" });

// Servir arquivos estáticos (imagens e outros arquivos)
app.use(express.static(path.join(__dirname, "public")));

// Rota principal
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Manipulação do upload de arquivos
app.post("/upload", upload.single("file"), (req, res) => {
  const file = req.file;

  // Envia a URL do arquivo para o cliente
  if (file) {
    const fileUrl = `/uploads/${file.filename}`;
    io.emit("fileUploaded", { fileUrl, filename: file.originalname, type: file.mimetype });
    res.status(200).send("File uploaded successfully");
  } else {
    res.status(400).send("No file uploaded");
  }
});

io.on("connection", (socket) => {
  console.log("Novo usuário conectado");

  // Recebe mensagem e envia ao cliente
  socket.on("msg", (message) => {
    let previewImage = "txt.png"; // Previsão para arquivos de texto
    let fileType = "text"; // Tipo padrão do arquivo é texto

    // Definindo a imagem de pré-visualização e o tipo do arquivo
    if (message.endsWith(".mp3")) {
      previewImage = "mp3.png";
      fileType = "audio";
    } else if (message.endsWith(".pdf")) {
      previewImage = "pdf.png";
      fileType = "pdf";
    }

    // Emitindo mensagem com a pré-visualização
    io.emit("msg", {
      message,
      previewImage: `/previews/${previewImage}`,
      fileUrl: `/uploads/${message}`,
      fileType,
    });
  });
});

http.listen(3000, () => {
  console.log("Servidor rodando na porta 3000");
});
