const socket = io();

function joinChat() {
  const username = document.getElementById("username").value;
  if (username) {
    document.querySelector(".container").style.display = "none";
    document.getElementById("chat-container").style.display = "block";
    socket.emit("join", username); // Enviar nome ao servidor
  } else {
    alert("Por favor, escolha um nome.");
  }
}

function sendMessage() {
  const messageInput = document.getElementById("message-input");
  const message = messageInput.value;
  if (message.trim() !== "") {
    socket.emit("msg", { message: message, type: 'text' }); // Enviar a mensagem ao servidor
    messageInput.value = ""; // Limpar o campo de entrada
  }
}

socket.on("msg", (data) => {
  const messageContainer = document.getElementById("messages");
  const messageElement = document.createElement("div");
  messageElement.classList.add("message");

  // Exibir conteúdo baseado no tipo de arquivo
  if (data.type === 'image' || data.type === 'video') {
    const mediaElement = document.createElement(data.type === 'image' ? 'img' : 'video');
    mediaElement.src = data.url;
    if (data.type === 'video') mediaElement.controls = true;
    mediaElement.classList.add("media");
    messageElement.appendChild(mediaElement);
  } else if (data.type === 'text') {
    const preElement = document.createElement("pre");
    preElement.textContent = data.content || data.message;
    messageElement.appendChild(preElement);
  }

  // Adicionar o botão de download se existir
  if (data.url) {
    const downloadButton = document.createElement("button");
    downloadButton.classList.add("download-button");
    downloadButton.textContent = "Download";
    downloadButton.onclick = function () {
      window.location.href = data.url;
    };
    messageElement.appendChild(downloadButton);
  }

  // Adicionar mensagens autodestrutivas
  if (data.type === 'text' && data.selfDestruct) {
    const countdownElement = document.createElement("div");
    countdownElement.classList.add("countdown");
    countdownElement.textContent = "Esta mensagem se autodestruirá em 5 segundos...";
    messageElement.appendChild(countdownElement);

    setTimeout(() => {
      messageElement.remove();
    }, 5000);
  }

  messageContainer.appendChild(messageElement);
  messageContainer.scrollTop = messageContainer.scrollHeight;
});
