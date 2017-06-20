'use strict';

module.exports = function Client(socket, nickname) {
  this.socket = socket;
  this.nickname = nickname || `user_${Math.random()}`;
};
