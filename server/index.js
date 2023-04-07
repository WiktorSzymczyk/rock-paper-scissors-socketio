const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {

    console.log(socket.id)

    socket.on('sendChoice', (data) => {
        console.log(`Received choice: ${data.choice}`);
        socket.broadcast.emit('receiveChoice', data);
      });

    socket.on("gameOver", (data) => {
        console.log(`Game over. ${data.winner} wins!`);
        io.emit("gameOver", data);
    });

    socket.on('disconnect', () => {
        console.log('A user has disconnected.');
    });
});

server.listen(3001, () => {
  console.log("SERVER IS RUNNING");
});
