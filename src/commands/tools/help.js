const Command = require('../../structures/Command.js');

module.exports = new Command({
	name: 'help',
	description: 'Displays the things you can do with bot.',
	permission: 'SEND_MESSAGES',

	async run(message, args, client) {
		message.channel.send("Commands you can use:\n"+
    "`os!chess` to play chess with someone else.\n"+
    "`os!userinfo ?[user]` to learn about yourself or another user.\n"+
    "`os!serverinfo` to learn about to server.\n"+
    "`os!ping` to see the delay of this bot.\n"+
    "`os!ban [user]` and `os!kick [user]` for, well, banning and kicking people.");
	}
});