module.exports = {
    name: 'no',
    description: 'Refute the bot\'s decision',
    execute(msg, args) {
        const Users = this.model('Users');
        if (Math.random() <= .1) {
            errfn = err => {
                console.error(err);
                msg.react('❌');
            };
            Users.findByPk(msg.author.id).then(
                usr => {
                    if (usr) {
                        usr.amount += 1;
                        return usr.save();
                    } else {
                        msg.reply(`You don't have anything in the jar, ${usr.username}`);
                    }
                }, errfn).then(
                    ok => {
                        msg.react('✔');
                    }, errfn);
        } else {
            msg.react('❌');
        }
    }
};
