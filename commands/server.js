const { SlashCommandBuilder } = require('@discordjs/builders');

const monthNames = [ "January", "February", "March", "April", "May", "June",
"July", "August", "September", "October", "November", "December" ];

module.exports = {
	data: new SlashCommandBuilder().setName('server').setDescription('Displays server\'s info!'),
	async execute(args) {
		await interaction.reply(
			`Server name: ${interaction.guild.name}\n` +
			`Total members: ${interaction.guild.memberCount}\n` +
			`Date created: ${monthNames[interaction.guild.createdAt.getMonth()]} ` +
			`${interaction.guild.createdAt.getDate()}, ${interaction.guild.createdAt.getFullYear()}`);
	},
};