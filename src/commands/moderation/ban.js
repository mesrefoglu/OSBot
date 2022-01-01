const Command = require('../../structures/Command.js');
const Discord = require('discord.js');

function banMember(member, message) {
    var username = member.user.username;
    if(member.bannable) {
        member.ban();
        message.channel.send(username + " was banned successfully.");
    } else {
        message.channel.send("Can't ban " + username + "!");
    }
}

module.exports = new Command({
	name: 'ban',
	description: 'Ban a member or multiple members.',
	permission: 'BAN_MEMBERS',

	async run(message, args, client) {

		if(args.length == 1 || (args.length >= 3 && message.mentions.users.size < args.length - 1)) { // no parameters or parameters without users
			message.reply('Correct usage `os!ban [user_tag]+`');
        } else if (message.mentions.users.size === 0) { // no tags
            message.channel.send('You did not tag any user. (or they are not in this server right now.)');
        } else if (args.length == 2 && message.mentions.users.size === 1) { // one tag
            banMember(message.mentions.members.first(), message);
        } else { // more than 1 user (and all parameters are users)
            for (let i = 0; i < message.mentions.members.size; i++) { // ban the members
                banMember(message.mentions.members.at(i), message);
            }
        }
	}
});