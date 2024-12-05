const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const { aliases } = require('../moderation/warn');

module.exports = {
    name: 'slowmode',
    category: 'mod',
    aliases: ['smode'],
    usage: 'enable|disable|timer <seconds>',
    permissions: ['MANAGE_CHANNELS'],
    premium: false,

    run: async (client, message, args) => {
        if (!message.member.permissions.has('MANAGE_CHANNELS')) {
            return message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor('#ff5c00')
                        .setDescription(' **You do not have permission to manage channels.** ')
                ]
            });
        }

        const action = args[0];

        if (!action || (action !== 'enable' && action !== 'disable' && action !== 'timer')) {
            const embed = new MessageEmbed()
                .setColor('#ff5c00')
                .setTitle('Slowmode Command')
                .setDescription(' **To enable slowmode, type `slowmode enable`.\nTo disable slowmode, type `slowmode disable`.\nTo set a custom slowmode timer, type `slowmode timer <seconds>`.** ')
            return message.channel.send({ embeds: [embed] });
        }

        if (action === 'enable') {
            const embed = new MessageEmbed()
                .setColor('#ff5c00')
                .setDescription(' **Slowmode enabled. Type `slowmode timer <seconds>` to set a custom slowmode timer.** ');
            await message.channel.send({ embeds: [embed] });
        } else if (action === 'disable') {
            try {
                await message.channel.setRateLimitPerUser(0);
                const embed = new MessageEmbed()
                    .setColor('#ff5c00')
                    .setDescription(' **Slowmode disabled.** ');
                return message.channel.send({ embeds: [embed] });
            } catch (error) {
                console.error('Failed to disable slowmode:', error);
                return message.channel.send({
                    embeds: [
                        new MessageEmbed()
                            .setColor('#ff5c00')
                            .setDescription(' **Failed to disable slowmode. Please try again later.** ')
                    ]
                });
            }
        } else if (action === 'timer') {
            const time = parseInt(args[1]);
            if (isNaN(time) || time < 0 || time > 21600) {
                return message.channel.send({
                    embeds: [
                        new MessageEmbed()
                            .setColor('#ff5c00')
                            .setDescription(' **Please provide a valid number of seconds (0-21600).**')
                    ]
                });
            }
            try {
                await message.channel.setRateLimitPerUser(time);
                const embed = new MessageEmbed()
                    .setColor('#ff5c00')
                    .setDescription(` **Slowmode enabled with a custom timer of ${time} seconds.** `);
                return message.channel.send({ embeds: [embed] });
            } catch (error) {
                console.error('Failed to set custom slowmode timer:', error);
                return message.channel.send({
                    embeds: [
                        new MessageEmbed()
                            .setColor('#ff5c00')
                            .setDescription(' **Failed to set custom slowmode timer. Please try again later.** ')
                    ]
                });
            }
        }
    }
};