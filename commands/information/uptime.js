const { MessageEmbed } = require('discord.js');
const moment = require('moment');

// Create a cooldown collection to manage command cooldowns
const cooldowns = new Map();

module.exports = {
    name: 'uptime',
    description: 'Displays how long the bot has been online since last restart.',
    category: 'info',
    aliases: ['up'],
    cooldown: 2, // Cooldown in seconds
    run: async (client, message, args) => {
        // Check if the user is on cooldown for this command
        if (cooldowns.has(message.author.id)) {
            const cooldownEmbed = new MessageEmbed()
                .setColor('#ff5c00') // Black color
                .setTitle('<:cooldown:1291752727168159806> **Bot Command Cooldown** ')
                .setDescription(`<:Activity:1291756300224561195> **Please wait ${cooldowns.get(message.author.id)} more second(s) before reusing the \`${module.exports.name}\` command.** `)
                .setFooter(`Requested By ${message.author.tag}`, message.author.displayAvatarURL({ dynamic: true }));
            
            return message.channel.send({ embeds: [cooldownEmbed] });
        }

        // Calculate bot uptime
        const uptime = moment.duration(client.uptime).humanize();

        // Create and send the embed message
        const embed = new MessageEmbed()
            .setColor('#ff5c00') // Black color
            .setTitle('<:Activity:1291756300224561195> **Bot Uptime** ')
            .setDescription(`<a:Status:1276073825599229953> **The bot has been online for ${uptime}.** `)
            .setFooter(`Requested By ${message.author.tag}`, message.author.displayAvatarURL({ dynamic: true }));

        message.channel.send({ embeds: [embed] });

        // Add user to cooldown
        cooldowns.set(message.author.id, module.exports.cooldown);
        setTimeout(() => cooldowns.delete(message.author.id), module.exports.cooldown * 1000);
    },
};
