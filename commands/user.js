const { SlashCommandBuilder } = require('@discordjs/builders');

const monthNames = [ "January", "February", "March", "April", "May", "June",
"July", "August", "September", "October", "November", "December" ];

module.exports = {
	data: new SlashCommandBuilder().setName('user-info').setDescription('Displays user info!')
	.addUserOption(option => option.setName('user').setDescription('The user whose info will be displayed')),
	async execute(args) {
		const user = interaction.options.getUser('user');
		if (user) {
			return interaction.reply(
				`User's tag: ${user.tag}\n` +
				`User's id: ${user.id}\n` +
				`User's account created: ${monthNames[user.createdAt.getMonth()]} ` +
				`${user.createdAt.getDate()}, ${user.createdAt.getFullYear()}`);
		}
		else {
			return interaction.reply(
				`User's tag: ${interaction.user.tag}\n` +
				`User's id: ${interaction.user.id}\n` +
				`User's account created: ${monthNames[interaction.user.createdAt.getMonth()]} ` +
				`${interaction.user.createdAt.getDate()}, ${interaction.user.createdAt.getFullYear()}`);
		}
	},
};