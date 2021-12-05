const Command = require('../structures/Command.js');
const Discord = require('discord.js');

const monthNames = [ "January", "February", "March", "April", "May", "June",
"July", "August", "September", "October", "November", "December" ];

module.exports = new Command({
	name: 'serverinfo',
	description: 'Display information about the server.',
	
	async run(message, args, client) {
		const guild = message.guild;
		const embed = new Discord.MessageEmbed();
		embed.setTitle(`${guild.name}\'s Server Info`)
		.setAuthor(guild.name, guild.iconURL( { dynamic: true } ))
		.setThumbnail(guild.iconURL( { dynamic: true } ))
		.setColor(0xFF0000)
		.addField('Server Name', guild.name)
		.addField('Number Of Members', guild.memberCount.toString())
		.addField('Server Created',
			`${monthNames[guild.createdAt.getMonth()]} ` +
			`${guild.createdAt.getDate()}, ${guild.createdAt.getFullYear()}`);
		
		message.channel.send({ embeds: [embed] });
	}
});