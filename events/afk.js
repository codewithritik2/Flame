const { MessageEmbed } = require('discord.js');
const db = require('../models/afk.js');

module.exports = async (client) => {
    client.on('messageCreate', async (message) => {
        // Skip processing for bot messages, system messages, or DMs
        if (message.author.bot || message.author.system || !message.guild) return;
        
        // Check if guild is blacklisted
        let check = await client.util.BlacklistCheck(message.guild);
        if (check) return;

        try {
            // Check if message author is AFK
            const authorData = await db.findOne({ Member: message.author.id });
            
            if (authorData) {
                // Remove AFK status
                await db.deleteOne({ Member: message.author.id });
                
                // Try to remove [AFK] from nickname if it exists
                if (message.member.manageable && 
                    message.guild.me.permissions.has('MANAGE_NICKNAMES') && 
                    message.member.nickname?.startsWith('[AFK]')) {
                    try {
                        const newNick = message.member.nickname.replace(/^\[AFK\]\s*/i, '');
                        await message.member.setNickname(newNick);
                    } catch (err) {
                        // Silently fail if nickname can't be changed
                    }
                }

                // Try to remove AFK role if it exists
                const afkRole = message.guild.roles.cache.find(r => r.name.toLowerCase() === 'afk');
                if (afkRole && message.member.roles.cache.has(afkRole.id) && 
                    message.guild.me.permissions.has('MANAGE_ROLES')) {
                    try {
                        await message.member.roles.remove(afkRole);
                    } catch (err) {
                        // Silently fail if role can't be removed
                    }
                }

                const embed = new MessageEmbed()
                    .setColor(client.color)
                    .setDescription(`Welcome back! You were AFK for <t:${Math.floor(authorData.Time / 1000)}:R>`)
                    .setFooter({ text: `Your AFK status has been removed` });

                await message.reply({ embeds: [embed] }).then(msg => {
                    setTimeout(() => msg.delete().catch(() => {}), 10000);
                });
            }

            // Check for mentioned users who are AFK
            const mentions = [...new Set([...message.mentions.users.values()])];
            if (mentions.length > 0) {
                for (const mentioned of mentions) {
                    if (mentioned.id === message.author.id) continue;
                    
                    const userData = await db.findOne({ Member: mentioned.id });
                    if (userData) {
                        // Send notification in the channel
                        const channelEmbed = new MessageEmbed()
                            .setColor(client.color)
                            .setAuthor({
                                name: `${mentioned.tag} is currently AFK!`,
                                iconURL: mentioned.displayAvatarURL({ dynamic: true })
                            })
                            .setDescription(`They went AFK <t:${Math.floor(userData.Time / 1000)}:R>\n**Reason:** ${userData.Reason}`)
                            .setFooter({ text: `` });

                        await message.reply({ embeds: [channelEmbed] }).then(msg => {
                            setTimeout(() => msg.delete().catch(() => {}), 10000);
                        });

                        // Create message link
                        const messageLink = `https://discord.com/channels/${message.guild.id}/${message.channel.id}/${message.id}`;

                        // Create and send DM
                        const dmEmbed = new MessageEmbed()
                            .setColor(client.color)
                            .setTitle(`<:Flame_Ping:1307416898992079012> New Mention While AFK`)
                            .setDescription(`**You were mentioned in ${message.guild.name} by ${message.author.tag}**\n[Jump to Message](${messageLink})\n\n**Their Message:**\n\`\`${message.content}\`\``)
                            .setThumbnail(message.guild.iconURL({ dynamic: true }))
                            .addFields(
                                { name: 'Channel', value: `<#${message.channel.id}>`, inline: true },
                                { name: 'Sent At', value: `<t:${Math.floor(Date.now() / 1000)}:R>`, inline: true }
                            )
                            .setFooter({ 
                                text: `You're currently AFK with reason: ${userData.Reason}`,
                                iconURL: mentioned.displayAvatarURL({ dynamic: true })
                            });

                        try {
                            await mentioned.send({ embeds: [dmEmbed] });
                        } catch (err) {
                            // Silently fail if DM cannot be sent (user has DMs closed)
                        }
                    }
                }
            }
        } catch (error) {
            console.error('AFK Event Error:', error);
        }
    });
};