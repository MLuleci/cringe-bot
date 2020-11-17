#!/usr/bin/env node
const fs = require('fs');
const Discord = require('discord.js');
const client = new Discord.Client();
const { prefix, token } = require('./config.json');
const { Sequelize, DataTypes } = require('sequelize');

// Utilities
function loadDir(path, fn)
{
    const dir = fs.readdirSync(path).filter(f => f.endsWith('.js'));
    for (f of dir) {
        e = require(`${path}/${f}`);
        fn(e);
    }
}

// Set-up database
const sql = new Sequelize({
    dialect: 'sqlite',
    logging: false,
    storage: 'db.sqlite'
});
loadDir('./mdls', e => {
    e(sql, DataTypes);
});
sql.sync();
const Users = sql.model('Users');

// Set-up command handling
client.cmds = new Discord.Collection();
loadDir('./cmds', e => {
    client.cmds.set(e.name, e);
});

// Set-up word filters
const filter = new RegExp(fs.readFileSync('./filters.txt', 'utf8')
                          .split('\n')
                          .map(x => x.trim())
                          .filter(x => !x.startsWith('#'))
                          .join('|')
                          .slice(0, -1),
                          'gi');

client.once('ready', () => {
    console.log('Up and running!');
});

client.on('message', msg => {
    if (msg.author.bot) return;

    // Execute a command
    if (msg.content.startsWith(prefix)) {
        const args = msg.content.slice(prefix.length).trim().split(/ +/);
        const cmd = args.shift().toLowerCase();
        const fn = client.cmds.get(cmd);
        if (fn != undefined) {
            fn.execute.call(sql, msg, args);
        } else {
            msg.react('350710108684025857');
        }
    }

    // Look for filtered words
    if (msg.content.match(filter)) {
        const target = msg.author;
        const errfn = err => {
            console.error(err);
            msg.react('350710109367828481');
        };
        Users.findByPk(target.id).then(
            usr => {
                if (usr) {
                    usr.amount += 1;
                    return usr.save();
                } else {
                    return Users.create({
                        id: target.id,
                        username: target.username,
                        amount: 1
                    });
                }
            }, errfn).then(
                ok => {
                    msg.react('350710110215208960');
                }, errfn);
    }
});

client.login(token);
