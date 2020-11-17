module.exports = {
    name: 'stats',
    description: 'Show stats for yourself or others',
    async execute(msg, args) {
        const Users = this.model('Users');
        let out = '';
        if (args.length) {
            for (u of msg.mentions.users.array()) {
                let r = await Users.findByPk(u.id);
                if (r)
                    out += `${r.username} has put $${r.amount} in the jar\n`;
                else
                    out += `${u.username} has been a good boy\n`;
            }
        } else {
            let u = await Users.findByPk(msg.author.id);
            if (u)
                out += `${u.username} has put $${u.amount} in the jar`;
            else
                out += 'You\'re good...'
        }
        msg.channel.send((out === '' ? 'lolwut?' : out));
    }
};
