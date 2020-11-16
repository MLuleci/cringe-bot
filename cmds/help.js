module.exports = {
    name: 'help',
    description: 'Display help',
    execute(msg, args) {
        msg.channel.send('Usage:\n```' +
                         'stats [users]  Show server stats\n' +
                         'help           Display this help\n' +
                         '```');
    }
};
