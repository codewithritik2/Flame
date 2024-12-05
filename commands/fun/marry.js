const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'marry',
    aliases: [],
    category: 'fun',
    premium: false,
    usage: 'marry <@user>',
    run: async (client, message, args) => {
        // Helper function to send error messages in an embed
        const sendErrorEmbed = (errorMsg) => {
            const errorEmbed = new MessageEmbed()
                .setColor('#ff5c00')
                .setTitle(' **Marry** ')
                .setDescription(errorMsg)
                .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL({ dynamic: true }));
            message.channel.send({ embeds: [errorEmbed] });
        };

        // Check if a user is mentioned
        if (!message.mentions.users.size) {
            return sendErrorEmbed(' **Please mention a user to marry.** ');
        }

        // Get the mentioned user
        const user = message.mentions.users.first();

        // Prevent users from proposing to themselves
        if (user.id === message.author.id) {
            return sendErrorEmbed(' **You cannot marry yourself.** ');
        }

        // Prevent users from proposing to the bot
        if (user.id === client.user.id) {
            return sendErrorEmbed(' **You cannot marry the bot.** ');
        }

        // Create a marriage proposal embed
        const proposalEmbed = new MessageEmbed()
            .setColor('#ff5c00')
            .setTitle(` **${message.author.username} proposes to ${user.username}!** `)
            .setDescription(` **${user.username}, do you accept the proposal?** `)
            .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL({ dynamic: true }));

        // Send the proposal embed to the channel
        const proposalMessage = await message.channel.send({ embeds: [proposalEmbed] });

        // React to the proposal message with yes and no emojis
        await proposalMessage.react('✅'); // Yes
        await proposalMessage.react('❌'); // No

        // Create a filter to only collect reactions from the mentioned user
        const filter = (reaction, reactionUser) => {
            return ['✅', '❌'].includes(reaction.emoji.name) && reactionUser.id === user.id;
        };

        // Wait for the mentioned user to react
        proposalMessage.awaitReactions({ filter, max: 1, time: 60000, errors: ['time'] })
            .then(collected => {
                const reaction = collected.first();

                if (reaction.emoji.name === '✅') {
                    // User accepted the proposal
                    const acceptedEmbed = new MessageEmbed()
                        .setColor('#ff5c00')
                        .setTitle(` **${user.username} said YES!** `)
                        .setDescription(`🥀**${message.author.username} and ${user.username} are now married!** `)
                        .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL({ dynamic: true }));

                    message.channel.send({ embeds: [acceptedEmbed] });
                } else {
                    // User declined the proposal
                    const declinedEmbed = new MessageEmbed()
                        .setColor('#ff5c00')
                        .setTitle(` **${user.username} said NO!** `)
                        .setDescription(`😔 **${message.author.username}, better luck next time!** `)
                        .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL({ dynamic: true }));

                    message.channel.send({ embeds: [declinedEmbed] });
                }
            })
            .catch(() => {
                // User did not react in time
                const noResponseEmbed = new MessageEmbed()
                    .setColor('#ff5c00')
                    .setTitle('<:icons:1258049705120764000> **No response!** ')
                    .setDescription(`❌ **${user.username} did not respond in time.**`)
                    .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL({ dynamic: true }));

                message.channel.send({ embeds: [noResponseEmbed] });
            });
    },
};