require('dotenv').config();
const { createServer } = require('http');
const { Server } = require('socket.io');
const app = require('./config/app');
const socketManager = require('./utils/socketManager');
const connectDB = require('./config/db');

connectDB();

const httpServer = createServer(app);
const io = new Server(httpServer);

socketManager(io);

const PORT = process.env.PORT || 8080;

httpServer.listen(PORT, () => {
  console.log(`✅ Server corriendo en http://localhost:${PORT}`);
});
