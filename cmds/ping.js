module.exports = {
    name: 'ping',
    description: 'Ping the bot',
    execute(msg, args) {
        msg.channel.send('pong.');
    }
};
