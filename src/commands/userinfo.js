const Command = require('../structures/Command.js');

const monthNames = [ "January", "February", "March", "April", "May", "June",
"July", "August", "September", "October", "November", "December" ];

module.exports = new Command({
	name: 'userinfo',
	description: 'Display information about the user.',
	
	async run(message, args, client) {
		if(args.length === 1) {
			message.channel.send(`${message.author.displayAvatarURL()}`);
			message.channel.send(
				`User tag: ${message.author.tag}\n` +
				`User ID: ${message.author.id}\n` +
				`Account created: ${monthNames[message.author.createdAt.getMonth()]} ` +
				`${message.author.createdAt.getDate()}, ${message.author.createdAt.getFullYear()}`);
		}
		// else if(args.length === 2) {
		// 	message.reply(
		// 		`Server name: ${message.guild.name}\n` +
		// 		`Total members: ${message.guild.memberCount}\n` +
		// 		`Date created: ${monthNames[message.guild.createdAt.getMonth()]} ` +
		// 		`${message.guild.createdAt.getDate()}, ${message.guild.createdAt.getFullYear()}`);
		// }
		// else {

		// }
	}
});