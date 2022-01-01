const Command = require('../../structures/Command.js');

function banMember(member, self, message) {
    var username = member.user.username;
    if (member == self) {
        message.channel.send("You can't ban yourself!");
    } else if (member.roles.highest.position > self.roles.highest.position) {
        message.channel.send("You can't ban " + username + " because of role hierarchy.");
    } else if(!member.bannable) {
        message.channel.send("Can't ban " + username + "!");
    } else {
        member.ban();
        message.channel.send(username + " was banned successfully.");
    }
}

module.exports = new Command({
	name: 'ban',
	description: 'Ban a user or multiple users.',
	permission: 'BAN_MEMBERS',

	async run(message, args, client) {
        // no parameters or parameters without users
		if(args.length == 1 || (args.length >= 3 && message.mentions.users.size < args.length - 1)) {
			message.reply('Correct usage `os!ban [user_tag]+`');
        } else if (message.mentions.users.size === 0) { // no tags
            message.channel.send('You did not tag any user. (or they are not in this server right now.)');
        } else if (args.length == 2 && message.mentions.users.size === 1) { // one tag
            banMember(message.mentions.members.first(), message.member, message);
        } else { // more than 1 user (and all parameters are users)
            for (let i = 0; i < message.mentions.members.size; i++) { // ban the members
                banMember(message.mentions.members.at(i), message.member, message);
            }
        }
	}
});