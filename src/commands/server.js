const Command = require('../structures/Command.js');

const monthNames = [ "January", "February", "March", "April", "May", "June",
"July", "August", "September", "October", "November", "December" ];

module.exports = new Command({
	name: 'server',
	description: 'Display information about the server.',
	
	async run(message, args, client) {
		message.channel.send(`${message.guild.iconURL()}`);
		message.channel.send(
			`Server name: ${message.guild.name}\n` +
			`Total members: ${message.guild.memberCount}\n` +
			`Date created: ${monthNames[message.guild.createdAt.getMonth()]} ` +
			`${message.guild.createdAt.getDate()}, ${message.guild.createdAt.getFullYear()}`);
	}
});