const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');

// Cooldown set to track command usage
const cooldowns = new Set();

module.exports = {
    name: 'audit',
    aliases: ['alogs'],
    category: 'info',
    premium: false,

    run: async (client, message, args) => {
        // Check if user has 'VIEW_AUDIT_LOG' permission
        if (!message.member.permissions.has('VIEW_AUDIT_LOG')) {
            const noPermissionEmbed = new MessageEmbed()
                .setColor('#ff5c00') 
                .setDescription('<a:cross:1289282294904918138> **You must have `View Audit Log` permissions to use this command.**');

            message.channel.send({ embeds: [noPermissionEmbed] });
            return;
        }

        // Check if command is on cooldown
        if (cooldowns.has(message.author.id)) {
            const cooldownEmbed = new MessageEmbed()
                .setColor('#ff5c00') 
                .setDescription('<:flame_timer:1291737455208300658> **Please wait before using this command again.**');

            message.channel.send({ embeds: [cooldownEmbed] });
            return;
        }

        // Add user to cooldown set
        cooldowns.add(message.author.id);
        setTimeout(() => {
            cooldowns.delete(message.author.id);
        }, 5000); // 5 seconds cooldown

        const logoUrl = 'https://media.discordapp.net/attachments/1255850060843843718/1260450812207960144/fd49339450119c69e2b7e9dbbc2618a0.png?ex=668f5dcb&is=668e0c4b&hm=23dae08e9d3924af7a2dabaf0477194f4eac4d1d991294a5100fd1425db8a4be&=&format=webp&quality=lossless&width=671&height=671'; // Replace with the URL of your logo

        const fetchLatestAuditLog = async () => {
            try {
                const auditLogs = await message.guild.fetchAuditLogs({ limit: 1 }); // Fetching last 5 audit logs
                const logsArray = Array.from(auditLogs.entries.values()); // Get array of audit log entries
                return logsArray.map(entry => ({
                    target: entry.target.tag || entry.target.username || entry.target.id,
                    action: entry.action,
                    executor: entry.executor.tag,
                    reason: entry.reason || 'No reason',
                    id: entry.id,
                    timestamp: entry.createdTimestamp,
                    messages: entry.extra && entry.extra.messages ? entry.extra.messages.map(m => `**Content:** ${m.content}\n**Author:** ${m.author.tag}`).join('\n\n') : 'No messages logged'
                }));
            } catch (error) {
                console.error('Error fetching audit logs:', error);
                throw error;
            }
        };

        const getEmojiForAction = (action) => {
            const emojis = {
                'MekoType': '<:flame_Type:1291737900882329641>',
                'MekoModeration': '<:Moderation:1291738004418723945>',
                'MekoUser': '<:User:1291738065538125864>',
                'MekoTimer': '<:flame_timer:1291737455208300658> ',
                'MekoRuby': '<:Ruby:1291738170492321794>'
            };

            return emojis[action] || '<:flame_Type:1291737900882329641>'; // Default emoji if action doesn't match
        };

        const createAuditEmbed = (logs) => {
            const embed = new MessageEmbed()
                .setColor('#ff5c00')
                .setTitle('Latest Audit Logs')
                .setThumbnail(logoUrl)
                .setFooter(`Requested by: ${message.author.username}#${message.author.discriminator}`);

            logs.forEach(log => {
                embed.addField(`${getEmojiForAction(log.action)} Action: ${log.action}`, `
                    ${getEmojiForAction('MekoModeration')} Action By: ${log.executor}
                    ${getEmojiForAction('MekoUser')} Target: ${log.target}
                    ${getEmojiForAction('MekoTimer')} Action Time: <t:${Math.floor(log.timestamp / 1000)}:R>
                    ${getEmojiForAction('MekoRuby')} Reason: ${log.reason || 'None'}
                    **Messages:**
                    ${log.messages}`);
            });

            return embed;
        };

        try {
            let latestLogs = await fetchLatestAuditLog();
            let embed = createAuditEmbed(latestLogs);

            const row = new MessageActionRow()
                .addComponents(
                    new MessageButton()
                        .setCustomId('refresh_audit')
                        .setLabel('Refresh')
                        .setStyle('PRIMARY') // Purple button
                        .setEmoji('<:stolen_emoji:1291738833645342804>') // Emoji for refresh
                );

            const sentMessage = await message.channel.send({ embeds: [embed], components: [row] });

            const filter = i => i.customId === 'refresh_audit' && i.user.id === message.author.id;
            const collector = sentMessage.createMessageComponentCollector({ filter, time: 60000 });

            collector.on('collect', async i => {
                if (i.customId === 'refresh_audit') {
                    const newLogs = await fetchLatestAuditLog();
                    if (newLogs.some(newLog => !latestLogs.find(latestLog => latestLog.id === newLog.id))) {
                        latestLogs = newLogs;
                        embed = createAuditEmbed(latestLogs);
                        await i.update({ embeds: [embed], components: [row] });
                    } else {
                        await i.update({ content: '**No new audit logs.**', components: [row] });
                    }
                }
            });

            collector.on('end', collected => {
                row.components[0].setDisabled(true);
                sentMessage.edit({ components: [row] });
            });
        } catch (error) {
            const errorEmbed = new MessageEmbed()
                .setColor('#ff5c00')
                .setDescription('Failed to fetch audit logs. Please try again later.');
            message.channel.send({ embeds: [errorEmbed] });
        }
    },
};