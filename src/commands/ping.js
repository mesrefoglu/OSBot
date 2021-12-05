const Command = require('../structures/Command.js');

module.exports = new Command({
	name: 'ping',
	description: 'Displays the delay of the bot.',
	permission: 'SEND_MESSAGE',

	async run(message, args, client) {
		const msg = await message.reply(`Ping: ${client.ws.ping} ms.`);

		msg.edit(`Ping: ${client.ws.ping} ms.\n` +
		`Message ping: ${msg.createdTimestamp - message.createdTimestamp} ms.`);
	}
});