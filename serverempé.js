// serverempé.js
const fetch = require('node-fetch'); // Instalar node-fetch

function startKeepAlive() {
  // Realiza o ping para o seu servidor a cada 5 minutos
  setInterval(() => {
    fetch('https://anom-chat.onrender.com')
      .then(() => console.log('Ping enviado para anom-chat'))
      .catch((err) => console.error('Erro no ping:', err));
  }, 5 * 60 * 1000); // A cada 5 minutos
}

module.exports = startKeepAlive;
