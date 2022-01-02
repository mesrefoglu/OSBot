const Command = require('../../structures/Command.js');

function kickMember(member, self, message) {
    var username = member.user.username;
    if (member == self) {
        message.channel.send("You can't kick yourself!");
    } else if (member.roles.highest.position > self.roles.highest.position) {
        message.channel.send("You can't kick " + username + " because of role hierarchy.");
    } else if(!member.kickable) {
        message.channel.send("Can't kick " + username + "!");
    } else {
        member.kick();
        message.channel.send(username + " was kicked successfully.");
    }
}

module.exports = new Command({
	name: 'kick',
	description: 'Kick a user or multiple users.',
	permission: 'KICK_MEMBERS',

	async run(message, args, client) {
        // no parameters or some parameters are not users
		if(args.length == 1 || (args.length >= 3 && message.mentions.users.size < args.length - 1)) {
			message.reply('Correct usage `os!kick [user_tag]+`');
        } else if (message.mentions.users.size === 0) { // no tags
            message.channel.send('You did not tag any user. (or they are not in this server right now.)');
        } else if (args.length == 2 && message.mentions.users.size === 1) { // one tag
            kickMember(message.mentions.members.first(), message.member, message);
        } else { // more than 1 user (and all parameters are users)
            for (let i = 0; i < message.mentions.members.size; i++) { // kick the members
                kickMember(message.mentions.members.at(i), message.member, message);
            }
        }
	}
});