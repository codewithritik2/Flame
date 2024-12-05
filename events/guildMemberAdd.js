const { EmbedBuilder } = require('discord.js');
const ms = require('ms'); // For time calculations
const { getSettingsar } = require('../models/autorole');

/**
 * @param {import('@src/structures').BotClient} client
 */
module.exports = (client) => {
    client.on('guildMemberAdd', async (member) => {
        if (!member || !member.guild) return;

        const { guild } = member;

        // Check if the guild is blacklisted
        const isBlacklisted = await client.util.BlacklistCheck(guild);
        if (isBlacklisted) return;

        // Fetch autorole and welcome settings
        const settings = await getSettingsar(guild);

        // --- Anti-Alt Detection ---
        const guildSettings = await client.util.getGuildSettings(guild.id);
        if (guildSettings && guildSettings.antiAlt && guildSettings.antiAlt.enabled) {
            const { minAccountAge, action, alertChannelId } = guildSettings.antiAlt;
            const minAgeMs = ms(minAccountAge || '2d'); // Default to 7 days if not set
            const accountAge = Date.now() - member.user.createdTimestamp;

            if (accountAge < minAgeMs) {
                // Notify admins or a specific channel
                const alertChannel = guild.channels.cache.get(alertChannelId);
                if (alertChannel) {
                    const embed = new EmbedBuilder()
                        .setTitle('🚨 Alt Account Detected!')
                        .setDescription(`${member.user.tag} (ID: ${member.id}) joined but was flagged as an alt account.`)
                        .addFields(
                            { name: 'Account Created', value: `<t:${Math.floor(member.user.createdTimestamp / 1000)}:R>` },
                            { name: 'Action Taken', value: `${action || 'None'}` }
                        )
                        .setColor('RED')
                        .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
                        .setFooter({ text: `User ID: ${member.id}` });

                    await alertChannel.send({ embeds: [embed] });
                }

                // Take action based on anti-alt settings
                try {
                    if (action === 'kick') {
                        await member.kick('Anti-Alt: Account too new');
                        return; // Stop further processing
                    } else if (action === 'ban') {
                        await member.ban({ reason: 'Anti-Alt: Account too new' });
                        return; // Stop further processing
                    } else if (action === 'restrict') {
                        const restrictedRole = guild.roles.cache.find(role => role.name === 'Restricted');
                        if (restrictedRole) {
                            await member.roles.add(restrictedRole, 'Anti-Alt: Account too new');
                        }
                    }
                } catch (err) {
                    console.error(`Failed to take action on ${member.user.tag}:`, err);
                }
            }
        }

        // --- Autorole Assignment ---
        if (settings.autorole.length > 0) {
            const rolesToAssign = [];
            for (const roleId of settings.autorole) {
                const role = guild.roles.cache.get(roleId);
                if (
                    role &&
                    !role.permissions.has(
                        'ADMINISTRATOR',
                        'KICK_MEMBERS',
                        'BAN_MEMBERS',
                        'MANAGE_CHANNELS',
                        'MANAGE_GUILD',
                        'MENTION_EVERYONE',
                        'MANAGE_ROLES',
                        'MANAGE_WEBHOOKS'
                    )
                ) {
                    rolesToAssign.push(role);
                }
            }

            try {
                await member.roles.add(rolesToAssign, 'Flame Autorole');
            } catch (err) {
                if (err.code === 429) {
                    await client.util.handleRateLimit();
                } else {
                    console.error('Failed to assign roles:', err);
                }
            }
        }

        // --- Welcome Message ---
        if (settings.welcome && settings.welcome.enabled) {
            client.util.sendWelcome(member, settings);
        }
    });
};
