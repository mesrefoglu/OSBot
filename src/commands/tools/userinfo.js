const Command = require('../../structures/Command.js');
const Discord = require('discord.js');

const monthNames = [ "January", "February", "March", "April", "May", "June",
"July", "August", "September", "October", "November", "December" ];

module.exports = new Command({
	name: 'userinfo',
	description: 'Display information about the user.',
	permission: 'SEND_MESSAGES',
	
	async run(message, args, client) {
		/**
		 * @type Discord.User
		 */
		var user = message.author;
		
		if(args.length === 2) {
			if (message.mentions.users.size === 0) {
				message.channel.send('That is not a valid user or that user is not in this server.');
				return;
			}
			else user = message.mentions.users.first();
		}
		else if (args.length > 2) {
			message.reply('Can only look up one user at a time. Please use 0 or 1 parameter.');
			return;
		}
		
		const forceFetchedUser = await client.users.fetch(user, { force: true });

		const embed = new Discord.MessageEmbed();
		embed.setTitle(`${user.username}\'s User Info`)
		.setAuthor(user.username, user.avatarURL( { dynamic: true }))
		.setThumbnail(user.avatarURL( {dynamic: true}))
		.setColor(forceFetchedUser.accentColor)
		.addField('User Tag', user.tag)
		.addField('User ID', user.id)
		.addField('Account Created',
			`${monthNames[user.createdAt.getMonth()]} ` +
			`${user.createdAt.getDate()}, ${user.createdAt.getFullYear()}`);
		
		message.channel.send({ embeds: [embed] });
	}
});