#!/usr/bin/env node
const fs = require('fs');
const Discord = require('discord.js');
const client = new Discord.Client();
const { prefix, token } = require('./config.json');

// Set-up command handling
client.cmds = new Discord.Collection();
{
    files = fs.readdirSync('./cmds').filter(f => f.endsWith('.js'));
    for (f of files) {
        c = require(`./cmds/${f}`);
        client.cmds.set(c.name, c);
    }
}

// Set-up word filters
const filter = new RegExp(fs.readFileSync('./filters', 'utf8')
                          .split('\n')
                          .map(x => x.trim())
                          .filter(x => !x.startsWith('#'))
                          .join('|'),
                          'gi');

client.once('ready', () => {
    console.log('Ready');
});

client.on('message', msg => {
    if (msg.author.bot) return;

    // Execute a command
    if (msg.content.startsWith(prefix)) {
        args = msg.content.slice(prefix.length).trim().split(/ +/);
        cmd = args.shift().toLowerCase();
        try {
            client.cmds.get(cmd).execute(msg, args)
        } catch (err) {
            console.error(err);
            msg.reply('Error executing command!');
        }
    }

    // Look for filtered words
    if (msg.content.match(filter)) {
        msg.react('350710110215208960');
    }
});

client.login(token);
