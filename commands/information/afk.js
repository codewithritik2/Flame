const { MessageEmbed } = require('discord.js');
const db = require('../../models/afk.js');

module.exports = {
    name: 'afk',
    description: "Set's you as Away From Keyboard globally",
    category: 'info',
    aliases: ['away'],
    cooldown: 10,
    run: async (client, message, args) => {
        try {
            // Check if user is already AFK
            const data = await db.findOne({ Member: message.author.id });
            
            // Get the AFK reason
            let reason = args.join(' ');
            if (reason.length > 100) {
                reason = reason.slice(0, 100) + '...';
            }
            if (!reason) reason = "I'm AFK :)";

            if (data) {
                // User is already AFK, show how long they've been AFK
                const timePassed = Math.floor((Date.now() - data.Time) / 1000);
                const embed = new MessageEmbed()
                    .setAuthor({
                        name: `${message.author.username} is already AFK!`,
                        iconURL: message.author.displayAvatarURL({ dynamic: true })
                    })
                    .setDescription(`You went AFK <t:${Math.floor(data.Time / 1000)}:R>\nReason: **${data.Reason}**`)
                    .setColor(client.color)
                    .setFooter({ text: 'Use the same command to remove your AFK status' })
                    .setTimestamp();
                
                return message.channel.send({ embeds: [embed] });
            } else {
                // Set user as AFK
                const newData = new db({
                    Member: message.author.id,
                    Reason: reason,
                    Time: Date.now()
                });
                
                await newData.save();

                // Try to set nickname with AFK prefix if bot has permissions
                try {
                    if (message.guild.me.permissions.has('MANAGE_NICKNAMES') &&
                        message.member.manageable &&
                        !message.member.nickname?.startsWith('[AFK]')) {
                        const oldNick = message.member.nickname || message.author.username;
                        await message.member.setNickname(`[AFK] ${oldNick.slice(0, 26)}`);
                    }
                } catch (err) {
                    // Silently fail if nickname can't be changed
                }

                const embed = new MessageEmbed()
                    .setAuthor({
                        name: `${message.author.username} is now AFK!`,
                        iconURL: message.author.displayAvatarURL({ dynamic: true })
                    })
                    .setDescription(`**Reason:** ${reason}\n\n`)
                    .setColor(client.color)
                    .setFooter({ text: 'Your AFK status will be removed when you send a message' })
                    .setTimestamp();

                // Add AFK role if it exists
                const afkRole = message.guild.roles.cache.find(r => r.name.toLowerCase() === 'afk');
                if (afkRole && message.guild.me.permissions.has('MANAGE_ROLES')) {
                    try {
                        await message.member.roles.add(afkRole);
                    } catch (err) {
                        // Silently fail if role can't be added
                    }
                }

                return message.channel.send({ 
                    embeds: [embed],
                    content: `<a:sleeping:1294182472720056380>` 
                });
            }
        } catch (error) {
            console.error('AFK Command Error:', error);
            return message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor('RED')
                        .setDescription('❌ There was an error while setting your AFK status. Please try again later.')
                ]
            });
        }
    }
};