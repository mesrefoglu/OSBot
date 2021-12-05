const Event = require('../structures/Event.js');

module.exports = new Event('ready', client => {
	console.log('OSBot is ready!');
})