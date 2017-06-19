'use strict';

const net = require('net');
const server = net.createServer();

let clientPool = [];

server.on('connection', (socket) => {

  socket.nickname = `user_${Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5)}`;

  clientPool = [...clientPool, socket];

  socket.on('data', (buffer) => {
    let data = buffer.toString();
    if(data.startsWith('/nick')) {
      socket.nickname = data.split('/nick')[1] || socket.nickname;
      socket.nickname = socket.nickname.trim();
      socket.write(`Your new username is ${socket.nickname}.`);
      return;
    }

  });

});

server.listen(3000, () => {
  console.log('The server is running on port 3000.');
});
