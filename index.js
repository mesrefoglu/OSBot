// Require the necessary discord.js classes
const { Client, Intents } = require('discord.js');
const { token } = require('./config.json');

// Create a new client instance
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

// When the client is ready, run this code (only once)
client.once('ready', () => {
	console.log('Ready!');
});

// Listen for commands from the client
client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

	const { commandName } = interaction;
	
	const monthNames = [ "January", "February", "March", "April", "May", "June",
	"July", "August", "September", "October", "November", "December" ];

	switch (commandName) {
		case 'ping':
			await interaction.reply('Pong!');
			break;
		case 'server':
			await interaction.reply(
				`Server name: ${interaction.guild.name}\n` +
				`Total members: ${interaction.guild.memberCount}\n` +
				`Date created: ${monthNames[interaction.guild.createdAt.getMonth()]} ` +
				`${interaction.guild.createdAt.getDate()}, ${interaction.guild.createdAt.getFullYear()}`);
			break;
		case 'user':
			await interaction.reply(
				`Your tag: ${interaction.user.tag}\n` +
				`Your id: ${interaction.user.id}\n` +
				`Your join date: ${monthNames[interaction.user.createdAt.getMonth()]} ` +
				`${interaction.user.createdAt.getDate()}, ${interaction.user.createdAt.getFullYear()}`);
			break;
	}
});

// Login to Discord with your client's token
client.login(token);