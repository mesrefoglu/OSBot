const Command = require("../../structures/Command.js");

var challenges = [];
var games = [];

function challengeExists (player, forOrFrom = "both") {
	
	for(let i = 0; i < challenges.length; i++) {
		if (forOrFrom == "both") {
			if (challenges[i][0].id == player.id || challenges[i][1].id == player.id) return i;
		}
		else if (forOrFrom == "from") {
			if (challenges[i][0].id == player.id) return i;
		}
		else if (forOrFrom == "for") {
			if (challenges[i][1].id == player.id) return i;
		}
	}

	return -1;
}

function gameExists (player) {
	
	for(let i = 0; i < games.length; i++) {
		if (games[i][0].id == player.id || games[i][1].id == player.id) return i;
	}

	return -1;
}

module.exports = new Command({
	name: "chess",
	description: "Play chess.",
	permission: "SEND_MESSAGES",

	async run(message, args, client) {
		/**
		 * @type Discord.User
		 */
		const player0 = message.author;
		var player1;

		if (args.length === 1 || args.length > 2 || args[1] == "help") { // no arguments
			return message.reply(
				"Please use the chess command with an argument:\n" +
				"`os!chess [user_tag]` to challenge someone. (e.g. `os!chess @" +
				player0.tag +
				"`)\n" +
				"`os!chess [move_notation]` to make a move. (e.g. `os!chess Ke2`)\n" +
				"`os!chess ff` to forfeit.\n" +
				"`os!chess draw` to offer a draw.\n" +
				"`os!chess stats` to check your stats.\n" +
				"`os!chess block` to block incoming challenges.\n" +
				"`os!chess help` brings up this message.");
			}
		else if (message.mentions.users.size === 1) { // a user was tagged
			player1 = message.mentions.users.first();
			if (player0 === player1)	// user tagged themselves
				message.channel.send("You can't challenge yourself.");
			else if (player1.bot)		// challenged a bot
				message.channel.send("You wouldn't want to challenge a bot, would you? (You can't.)");
			else {						// successfully challenged a player
				let i = challengeExists(player0);
				let j = challengeExists(player1);

				if(i > -1) 
				{
					if (challengeExists(player0, "for") > -1){
						message.channel.send(
							"You are already challenged!\n" +
							"Use `os!chess reject` first to challenge someone else.");
					}
					else {
						message.channel.send(
							"You already challenged somone!\n" +
							"Use `os!chess cancel` first to challenge someone else.");
					}
					return;
				}
				else if(j > -1) 
				{
					if (challengeExists(player1, "for") > -1){
						message.channel.send("That player is already challenged!");
					}
					else {
						message.channel.send("That player already challenged someone else!");
					}
					return;
				}
				else if(gameExists(player0) > -1) {
					message.channel.send("You are already in a game!");
					return;
				}
				else if(gameExists(player1) > -1) {
					message.channel.send("That player is already in a game!");
					return;
				}
				
				challenges.push([player0, player1]);
				message.channel.send(
					"<@!" + player1 + ">, do you accept <@!" + player0 + ">\'s chess challenge?\n" + 
					"Respond with \`os!chess accept\` or \`os!chess reject\` in 1 minute.");
			}
		}
		else if (args[1] === "accept" || args[1] === "reject" || args[1] === "cancel") {
			
			let i = challengeExists(player0, "for");
			let j = challengeExists(player0, "from");

			if (i == -1 && args[1] != "cancel") {
				message.channel.send("There is no challenge against you!");
			}
			else if (args[1] === "accept") {
				message.channel.send("<@!" + challenges[i][1] + ">, has accepted <@!" + challenges[i][0] + ">\'s challenge.");
				games.push(challenges[i]);
				challenges.splice(i, 1);
			}
			else if (args[1] === "reject") {
				message.channel.send("<@!" + challenges[i][1] + ">, has rejected <@!" + challenges[i][0] + ">\'s challenge.");
				challenges.splice(i, 1);
			}
			else if (j == -1) {
				message.channel.send("You have not challenged anyone!");
			}
			else {
				message.channel.send("You have successfully cancelled your challenge against <@!" + challenges[j][1] + ">.");
				challenges.splice(j, 1);
			}
		}
	},
});