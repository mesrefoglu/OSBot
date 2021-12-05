/** @format */

console.clear();

const Client = require('./structures/Client.js');
const Command = require('./structures/Command.js');
const config = require('./data/config.json');
const client = new Client();

const fs = require('fs');
fs.readdirSync("./src/commands").filter(file => file.endsWith('.js')).forEach(file => {
	/**
	 * @type {Command}
	 */
	const command = require(`./commands/${file}`);
	console.log(`Command ${command.name} loaded!`);
	client.commands.set(command.name, command);
});

client.on("ready", () => console.log("OSBot is ready!"));

client.on("messageCreate", message => {
	
	if(!message.content.startsWith(config.prefix)) return;
	
	const args = message.content.substring(config.prefix.length).split(/ +/);

	const command = client.commands.find(command => command.name == args[0]);

	if (!command) return message.reply(`${args[0]} is not a valid command!`);

	command.run(message, args, client);
});

client.login(config.token);