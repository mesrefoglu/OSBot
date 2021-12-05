/** @format */

console.clear();

const Client = require('./structures/Client.js');
const config = require('./data/config.json');

const client = new Client();
client.start(config.token);