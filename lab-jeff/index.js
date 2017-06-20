'use strict';

const net = require('net');
const server = net.createServer();
const Client = require('./lib/client.js');
let clientPool = [];

server.on('connection', (socket) => {
  let client = new Client(socket);
  console.log(`${client.nickname} has joined the chat`);

  clientPool.forEach((user) => {
    user.socket.write(`${client.nickname} has joined the chat`);
  });
  clientPool = [...clientPool, socket];

  let handleDisconnect = () =>  {
    console.log(`${client.nickname} has left the chat.`);

    clientPool.forEach((user) => {
      user.socket.write(`${client.nickname} has left the chat`);
    });

    clientPool = clientPool.filter(user =>
    user.socket !== client.socket);
  };
  let handleError = () => {
    console.log('Error!');
  };

  socket.on('close', handleDisconnect);
  socket.on('error', handleError);

  client.socket.on('data', (buffer) => {
    let data = buffer.toString();
    if(data.startsWith('/nick')) {
      client.nickname = data.split('/nick')[1] || client.nickname;
      client.nickname = client.nickname.trim();
      client.socket.write(`Your new username is ${client.nickname}.`);
      return;
    }

    if(data.startsWith('/dm')) {
      let message = data.split('/dm ')[1] || '';
      let to = message.split(' ')[0];
      clientPool.forEach((user) => {
        if(to === user.nickname);
        user.socket.write(`${message}`);
      });
      return;
    }
    if(data.trim() === '/quit') {
      clientPool.forEach((user) => {
        user.socket.write(`${user.nickname} has left the chat`);
      });
      client.socket.end();
    }
    clientPool.forEach((user) => {
      user.socket.write(`${client.nickname}: ${data}.`);
    });
  });
});

server.listen(3000, () => {
  console.log('The server is running on port 3000.');
});
