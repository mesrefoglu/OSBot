const Command = require("../../structures/Command.js");
const { Chess } = require('chess.js')
const Discord = require('discord.js');

/** 
 * Pairs of players active challenges, and whether first player is white, and server id
 * (first player is the challenger, second player is the challenged).
 * @type {Array.<[Discord.User, Discord.User, boolean, string]>}
 */
var challenges = [];

/** 
 * Pairs of players that are in a game, a number to indicate turn, and server id
 * (The first player is white).
 * @type {Array.<[Discord.User, Discord.User, boolean, string]>}
 */
var games = [];

/** 
 * Active chess games, and the server id
 * @type {Array.<[Chess, string]>}
 */
var chesss = [];

/**
 * Returns the index of the challenge if a challenge exists, -1 otherwise.
 * @param {Discord.User} player 
 * @param {string} forOrFrom 
 * @param {string} guildId 
 * @returns {number}
 */
function challengeExists(player, forOrFrom, guildId) {

    for (let i = 0; i < challenges.length; i++) {
        if (forOrFrom == "both") {
            if ((challenges[i][0].id == player.id ||
                challenges[i][1].id == player.id) &&
                challenges[i][3] == guildId) return i;
        } else if (forOrFrom == "from") {
            if (challenges[i][0].id == player.id && challenges[i][3] == guildId) return i;
        } else if (forOrFrom == "for") {
            if (challenges[i][1].id == player.id && challenges[i][3] == guildId) return i;
        }
    }

    return -1;
}

/**
 * Returns the index of the game if a game exists, -1 otherwise.
 * @param {Discord.User} player 
 * @param {string} guildId 
 * @returns {number}
 */
function gameExists(player, guildId) {

    for (let i = 0; i < games.length; i++) {
        if ((games[i][0].id == player.id ||
            games[i][1].id == player.id) &&
            games[i][3] == guildId) return i;
    }

    return -1;
}

function helpMessaage(message) {
	return message.reply(
		"Please use the chess command with an argument:\n" +
		"`os!chess [user_tag] [white/black/random]` to challenge someone. (e.g. `os!chess @" +
		message.author.tag +
		"`)\n" +
		"`os!chess [move_notation]` to make a move. (e.g. `os!chess Ke2`)\n" +
		"`os!chess ff` to forfeit.\n" +
		"`os!chess draw` to offer a draw.\n" +
		"`os!chess stats [user_tag]` to check your (or others') stats.\n" +
		"`os!chess block` to block incoming challenges.\n" +
		"`os!chess help` brings up this message.");
}

function printBoard(game, perspective) {
	var str = "";
	const bottomWhite = "`    a  b  c  d  e  f  g  h `";
	const bottomBlack = "`    h  g  f  e  d  c  b  a `";
	if (perspective == "white") {
		for(let i = 0; i < 8; i++) {
			str += "` " + (8 - i) + " `";
			for(let j = 0; j < 8; j++) {
				if(game.board()[i][j] == null) {
					str += chessEmoji((i + j) % 2 == 0 ? "w" : "b");
				} else {
					str += chessEmoji(game.board()[i][j].color +
						((8 - i + j) % 2 == 0 ? "w" : "b") + game.board()[i][j].type);
				}
			}
			str += "\n";
		}
		str += bottomWhite;
	}
	else {
		for(let i = 0; i < 8; i++) {
			str += "` " + (i + 1)  + " `";
			for(let j = 0; j < 8; j++) {
				if(game.board()[7 - i][7 - j] == null) {
					str += chessEmoji((i + j) % 2 == 0 ? "w" : "b");
				} else {
					str += chessEmoji(game.board()[7 - i][7 - j].color +
						((i + j) % 2 == 0 ? "w" : "b") + game.board()[7 - i][7 - j].type);
				}
			}
			str += "\n";
		}
		str += bottomBlack;
	}
	return str;
}

function chessEmoji(str) {
	switch(str) {
		case "w":
			return "<:wOSBot:918317658758320138>";
		case "b":
			return "<:bOSBot:918317658707992656>";
		case "bbr":
			return "<:bbrOSBot:918317658305355836>";
		case "bbn":
			return "<:bbnOSBot:918317658259218455>";
		case "bbb":
			return "<:bbbOSBot:918317658364059658>";
		case "bbq":
			return "<:bbqOSBot:918317658305351680>";
		case "bbk":
			return "<:bbkOSBot:918293113892642837>";
		case "bbp":
			return "<:bbpOSBot:918317658309550090>";
		case "bwr":
			return "<:bwrOSBot:918317658951266345>";
		case "bwn":
			return "<:bwnOSBot:918293113993322517>";
		case "bwb":
			return "<:bwbOSBot:918317658443771914>";
		case "bwq":
			return "<:bwqOSBot:918290957147983902>";
		case "bwk":
			return "<:bwkOSBot:918317658565382225>";
		case "bwp":
			return "<:bwpOSBot:918317658418610186>";
		case "wbr":
			return "<:wbrOSBot:918317658372452393>";
		case "wbn":
			return "<:wbnOSBot:918317658309546056>";
		case "wbb":
			return "<:wbbOSBot:918293114236575796>";
		case "wbq":
			return "<:wbqOSBot:918317658242449409>";
		case "wbk":
			return "<:wbkOSBot:918317658477322281>";
		case "wbp":
			return "<:wbpOSBot:918317658695421992>";
		case "wwr":
			return "<:wwrOSBot:918317658838011905>";
		case "wwn":
			return "<:wwnOSBot:918317658733178930>";
		case "wwb":
			return "<:wwbOSBot:918317658766721084>";
		case "wwq":
			return "<:wwqOSBot:918317658775101542>";
		case "wwk":
			return "<:wwkOSBot:918317658963857439>";
		case "wwp":
			return "<:wwpOSBot:918317658821263440>";
	  }
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

        if (args.length === 1 || args[1] == "help") { // no arguments or asked for help
            helpMessaage(message);
        } else if (message.mentions.users.size === 1) { // a user was tagged
            player1 = message.mentions.users.first();
            if (player0 === player1) // user tagged themselves
                message.channel.send("You can't challenge yourself.");
            else if (player1.bot) // challenged a bot
                message.channel.send("You wouldn't want to challenge a bot, would you? (You can't.)");
            else { // successfully tagged another user in the server
                let i = challengeExists(player0, "both", message.guildId);
                let j = challengeExists(player1, "both", message.guildId);

                if (i > -1) // if the player already has an active challenge
                {
                    if (challengeExists(player0, "for", message.guildId) > -1) { // if the challenge is for player0
                        message.channel.send(
                            "You are already challenged!\n" +
                            "Use `os!chess reject` first to challenge someone else.");
                    } else { // if the challenge is from player1
                        message.channel.send(
                            "You already challenged somone!\n" +
                            "Use `os!chess cancel` first to challenge someone else.");
                    }
                    return;
                } else if (j > -1) { // if the challenged player already has an active challenge
                    if (challengeExists(player1, "for", message.guildId) > -1) { // if the challenge is for them
                        message.channel.send("That player is already challenged!");
                    } else { // if the challenge is from them
                        message.channel.send("That player already challenged someone else!");
                    }
                    return;
                } else if (gameExists(player0, message.guildId) > -1) { // if challenger player is already in a game
                    message.channel.send("You are already in a game!");
                    return;
                } else if (gameExists(player1, message.guildId) > -1) { // if challenged player is already in a game
                    message.channel.send("That player is already in a game!");
                    return;
                } else if (args.length == 2 || args[2] == "random") { // if everything is good to go, can challenge, random colors
					let p0white = Math.round(Math.random()); // if 1, then player0 is white
                    challenges.push([player0, player1, (p0white == 1 ? true : false), message.guildId]);
                    message.channel.send(
                        "<@!" + player1 + ">, do you accept <@!" + player0 + ">\'s chess challenge with random colors?\n" +
                        "Respond with \`os!chess accept\` or \`os!chess reject\` in 1 minute.");
                } else if (args[2] == "white") { // player0 plays white, player1 plays black
					challenges.push([player0, player1, true, message.guildId]);
                    message.channel.send(
                        "<@!" + player1 + ">, do you accept <@!" + player0 + ">\'s chess challenge with you playing with black pieces?\n" +
                        "Respond with \`os!chess accept\` or \`os!chess reject\` in 1 minute.");
				} else if (args[2] == "black") { // player0 plays black, player1 plays white
					challenges.push([player0, player1, false, message.guildId]);
                    message.channel.send(
                        "<@!" + player1 + ">, do you accept <@!" + player0 + ">\'s chess challenge with you playing with white pieces?\n" +
                        "Respond with \`os!chess accept\` or \`os!chess reject\` in 1 minute.");
				}
            }
        }
		// accept/reject a challenge for them, or cancel a challenge from them
		else if (args[1] === "accept" || args[1] === "reject" || args[1] === "cancel") {

            let i = challengeExists(player0, "for", message.guildId);
            let j = challengeExists(player0, "from", message.guildId);

            if (i == -1 && args[1] != "cancel") { //if no challenge found for the player and not using cancel
                message.channel.send("There is no challenge against you!");
            } else if (args[1] === "accept") { // if the player accepts
                message.channel.send("<@!" + challenges[i][1] + "> has accepted <@!" + challenges[i][0] + ">\'s challenge.");
				if(challenges[i][2]) { // player0 is white
					games.push([challenges[i][0], challenges[i][1], true, message.guildId]);
				} else {
					games.push([challenges[i][1], challenges[i][0], true, message.guildId]);
				}
				chesss.push(new Chess());
				const embed = new Discord.MessageEmbed();
                i = gameExists(player0, message.guildId);
				embed.setTitle(`${games[i][0].username} vs ${games[i][1].username}`)
					.setColor(0xFFFFFF)
					.addField(`${games[i][0].username}'s Turn`, "Current position:");
				
				message.channel.send({ embeds: [embed] });
				message.channel.send(printBoard(new Chess(), "white"));
                j = challengeExists(player0, "both", message.guildId);
                challenges.splice(j, 1);
            } else if (args[1] === "reject") { // if the player rejects
                message.channel.send("<@!" + challenges[i][1] + "> has rejected <@!" + challenges[i][0] + ">\'s challenge.");
                challenges.splice(i, 1);
            } else if (j == -1) { // if they did not challenge anyone (from the if/else if statements we know they used cancel)
                message.channel.send("You have not challenged anyone!");
            } else { // if they cancel their challenge
                message.channel.send("You have successfully cancelled your challenge against <@!" + challenges[j][1] + ">.");
                challenges.splice(j, 1);
            }
        } else if (args[1] === "inside") {
			message.channel.send("Challenges:" + challenges);
			message.channel.send("Games:" + games);
		} else if(args[1] === "ff") { // forfeits the game if there is an active game
			
			let i = gameExists(player0, message.guildId);
			if (i > -1) {
                message.channel.send(
					"<@!" + player0 + "> forfeited from their game with <@!" +
					(player0 === games[i][0] ? games[i][1] : games[i][0]) + ">, making them victorious!");
				games.splice(i, 1);
				chesss.splice(i, 1);
			}
			else {
				message.channel.send("You are not in a game!");
			}
		} else if(args[1] === "draw") { // asks for a draw from the opponent
			// TO DO
			message.channel.send("Not yet implemented lol");
		} else if(args[1] === "stats") { // shows your or other player's stats
			// TO DO
			message.channel.send("Not yet implemented lol");
		} else { // since no command worked so far, assume this command is to make a move
			let i = gameExists(player0, message.guildId);
			if (i == -1) { // if there is no active game to move
				helpMessaage(message);
			} else if (player0 != (games[i][2] ? games[i][0] : games[i][1])) { // if it's not the players turn
				message.channel.send("It's not your turn! It's " + (games[i][2] ? games[i][0].username : games[i][0].username) + "'s turn.");
			} else if (chesss[i].move(args[1]) == null) { // if the move isn't valid
				message.channel.send("Not a valid move.");
			} else { // if there is an active game, it's the player's turn and the move is valid
				const embed = new Discord.MessageEmbed();

				if(chesss[i].game_over()) { // if the game is over after the last move
					if(chesss[i].in_checkmate()) { // checkmate
						const forceFetchedUser = await client.users.fetch((games[i][2] ? games[i][0] : games[i][1]), { force: true });
						embed.setTitle(`${games[i][0].username} vs ${games[i][1].username}`)
							.setColor(forceFetchedUser.accentColor)
							.addField((games[i][2] ? games[i][0] : games[i][1]).username + " checkmates!", "Final position:");
						message.channel.send({ embeds: [embed] });
						message.channel.send(printBoard(chesss[i], "white"));
					} else if(chesss[i].in_stalemate()) { // stealmate
						embed.setTitle(`${games[i][0].username} vs ${games[i][1].username}`)
							.setColor(0xFFFFFF)
							.addField("Draw: Stealmate.", "Final position:");
						message.channel.send({ embeds: [embed] });
						message.channel.send(printBoard(chesss[i], "white"));
					} else if(chesss[i].in_threefold_repetition()) { // 3fold repetition
						embed.setTitle(`${games[i][0].username} vs ${games[i][1].username}`)
							.setColor(0xFFFFFF)
							.addField("Draw: Threefold repetition.", "Final position:");
						message.channel.send({ embeds: [embed] });
						message.channel.send(printBoard(chesss[i], "white"));
					} else if(chesss[i].insufficient_material()) { // insufficient material
						embed.setTitle(`${games[i][0].username} vs ${games[i][1].username}`)
							.setColor(0xFFFFFF)
							.addField("Draw: Insufficient material.", "Final position:");
						message.channel.send({ embeds: [embed] });
						message.channel.send(printBoard(chesss[i], "white"));
					} else if(chesss[i].insufficient_material()) { // insufficient material
						embed.setTitle(`${games[i][0].username} vs ${games[i][1].username}`)
							.setColor(0xFFFFFF)
							.addField("Draw: Insufficient material.", "Final position:");
						message.channel.send({ embeds: [embed] });
						message.channel.send(printBoard(chesss[i], "white"));
					} else {  // 50 move rule
						embed.setTitle(`${games[i][0].username} vs ${games[i][1].username}`)
							.setColor(0xFFFFFF)
							.addField("Draw: 50-move rule.", "Final position:");
						message.channel.send({ embeds: [embed] });
						message.channel.send(printBoard(chesss[i], "white"));
					}
					chesss.splice(i, 1);
					games.splice(i, 1);
				} else { // if the game keeps going
					games[i][2] = !games[i][2];
					embed.setTitle(`${games[i][0].username} vs ${games[i][1].username}`)
						.setColor(0xFFFFFF)
						.addField((games[i][2] ? games[i][0].username : games[i][1].username) + "'s Turn", "Current position:");
					
					message.channel.send({ embeds: [embed] });
					message.channel.send(printBoard(chesss[i], (games[i][2] ? "white" : "black")));
				}
			}
		}
    },
});