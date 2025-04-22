const express = require("express");
const path = require("path");
const multer = require("multer");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);

// Configuração do Multer para upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "_" + file.originalname),
});
const upload = multer({ storage });

// Static files
app.use(express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public/index.html"));
});

// Upload de arquivos
app.post("/upload", upload.single("file"), (req, res) => {
  const file = req.file;
  if (file) {
    io.emit("file", {
      filename: file.originalname,
      url: `/uploads/${file.filename}`,
    });
    res.sendStatus(200);
  } else {
    res.sendStatus(400);
  }
});

// Mensagens de texto
io.on("connection", (socket) => {
  socket.on("message", (data) => {
    io.emit("message", data);
  });
});

http.listen(3000, () => {
  console.log("Servidor rodando em http://localhost:3000");
});
