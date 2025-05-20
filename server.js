const { httpServer } = require('./src/app');
const PORT = 8080;

httpServer.listen(PORT, () => {
  console.log(`Servidor escuchando en puerto ${PORT}`);
});