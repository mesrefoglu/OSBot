const Command = require('../../structures/Command.js');
const Discord = require('discord.js');

module.exports = new Command({
	name: 'kick',
	description: 'Kick a user or multiple users.',
	permission: 'KICK_MEMBERS',
	
	async run(message, args, client) {
		
        // get user
		if(args.length == 1 || (args.length >= 3 && message.mentions.users.size < args.length - 1)) { // no parameters or parameters without users
			message.reply('Correct usage `os!kick [user_tag]+`');
            return;
        } else if (message.mentions.users.size === 0) { // no tags
            message.channel.send('You did not tag any user. (or they are not in this server right now.)');
            return;
        } else if (args.length == 2 && message.mentions.users.size === 1) { // one tag
            try {
                username = message.mentions.users.first().username;
                message.mentions.members.first().kick();
                message.channel.send(username + " was kicked successfully.");
            } catch (e) {
                message.channel.send("There was an error when kicking " + username + ": " + e);
            } finally { return; }
        } else { // more than 1 user (and all parameters are users)
            for (let i = 0; i < message.mentions.members.size; i++) { // kick the members
                var username = message.mentions.members.at(i).user.username;
                try {
                    message.mentions.members.at(i).kick();
                    message.channel.send(username + " was kicked successfully.");
                } catch (e) {
                    message.channel.send("There was an error when kicking " + username + ": " + e);
                }
            }
        }
	}
});