const Discord = require("discord.js");
const Command = require("./Command.js");
const Event = require("./Event.js");
const config = require('../data/config.json');
const intents = new Discord.Intents(32767);

const fs = require('fs');		

class Client extends Discord.Client {
	constructor() {
		super({ intents });

		/**
		 * @type {Discord.Collection<string, Command>}
		 */
		this.commands = new Discord.Collection();

		this.prefix = config.prefix;
	}

	start(token) {
		// Gets the commands from multiple folders
		fs.readdirSync("./src/commands/fun").filter(file => file.endsWith('.js')).forEach(file => {
			/**
			 * @type {Command}
			 */
			const command = require(`../commands/fun/${file}`);
			console.log(`Command ${command.name} loaded!`);
			this.commands.set(command.name, command);
		});
		fs.readdirSync("./src/commands/moderation").filter(file => file.endsWith('.js')).forEach(file => {
			/**
			 * @type {Command}
			 */
			const command = require(`../commands/moderation/${file}`);
			console.log(`Command ${command.name} loaded!`);
			this.commands.set(command.name, command);
		});
		fs.readdirSync("./src/commands/roles").filter(file => file.endsWith('.js')).forEach(file => {
			/**
			 * @type {Command}
			 */
			const command = require(`../commands/roles/${file}`);
			console.log(`Command ${command.name} loaded!`);
			this.commands.set(command.name, command);
		});
		fs.readdirSync("./src/commands/tools").filter(file => file.endsWith('.js')).forEach(file => {
			/**
			 * @type {Command}
			 */
			const command = require(`../commands/tools/${file}`);
			console.log(`Command ${command.name} loaded!`);
			this.commands.set(command.name, command);
		});

		// Gets the events from events folder
		fs.readdirSync("./src/events").filter(file => file.endsWith('.js')).forEach(file => {
			/**
			 * @type {Event}
			 */
			const event = require(`../events/${file}`);
			console.log(`Event ${event.event} loaded!`);
			this.on(event.event, event.run.bind(null, this));
		});

		this.login(token);
	}
}

module.exports = Client;
