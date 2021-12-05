const Command = require('../structures/Command.js');
const Discord = require('discord.js');

const monthNames = [ "January", "February", "March", "April", "May", "June",
"July", "August", "September", "October", "November", "December" ];

module.exports = new Command({
	name: 'userinfo',
	description: 'Display information about the user.',
	
	async run(message, args, client) {
		if(args.length === 1) {
			
			/**
			 * @type Discord.User
			 */
			const user = message.author;
			const forceFetchedUser = await client.users.fetch(
				user, { force: true });

			const embed = new Discord.MessageEmbed();
			embed.setTitle(`${user.username}\'s User Info`)
			.setAuthor(user.username, user.avatarURL( { dynamic: true } ))
			.setThumbnail(user.avatarURL( {dynamic: true} ))
			.setColor(forceFetchedUser.accentColor)
			.addField('User Tag', user.tag)
			.addField('User ID', user.id)
			.addField('Account Created',
				`${monthNames[user.createdAt.getMonth()]} ` +
				`${user.createdAt.getDate()}, ${user.createdAt.getFullYear()}`);
			
			message.channel.send({ embeds: [embed] });
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