/* eslint-env node, browser */

const WebSocketServer = require('ws').Server;
const http = require('http');
const express = require('express');

const app = express();
const fs = require('fs');
const config = require('../config/config.js').config;

const NODE_ENV = process.env.NODE_ENV;
const port = config[NODE_ENV].port;

require.extensions['.html'] = function (module, filename) {
  // eslint-disable-next-line no-param-reassign
  module.exports = fs.readFileSync(filename, 'utf8');
};

const server = http.createServer(app);
server.listen(port);

console.log('Http server (dev/hot) listening on port %d .', port);

const wss = new WebSocketServer({ server });
console.log('Websocket server (dev/hot) created.');

wss.on('connection', (ws) => {
  const id = setInterval(() => {
    const message = { midiTest: true };
    console.log('Sending msg (dev/hot)..');
    ws.send(JSON.stringify(message), () => {});
  }, 1000);

  console.log('Websocket connection (dev/hot) opened.');
  ws.on('close', () => {
    console.log('Websocket connection (dev/hot) closed.');
    clearInterval(id);
  });
});
