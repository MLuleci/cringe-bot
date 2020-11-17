module.exports = {
    name: 'help',
    description: 'Display help',
    execute(msg, args) {
        msg.channel.send('Usage:\n```' +
                         '!stats [users]  Show stats for yourself or others\n' +
                         '!no             Refute the bot\'s decision (9:1 odds)\n' +
                         '!help           Display this message```');
    }
};
