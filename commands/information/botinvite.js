const { MessageEmbed } = require('discord.js');

// Create a map to keep track of cooldowns
const cooldowns = new Map();

module.exports = {
    name: 'botinvite',
    aliases: ['botinvites', 'binvites'],
    category: 'info',
    premium: false,

    run: async (client, message, args) => {
        const cooldownTime = 60000; // 1 minute cooldown in milliseconds
        const userId = message.author.id;

        // Check if the user is in the cooldown map and if the cooldown hasn't expired
        if (cooldowns.has(userId)) {
            const expirationTime = cooldowns.get(userId) + cooldownTime;
            const now = Date.now();
            if (now < expirationTime) {
                const timeLeft = (expirationTime - now) / 1000;
                const embed = new MessageEmbed()
                    .setColor('#ff5c00')
                    .setDescription(`Please wait ${timeLeft.toFixed(1)} more seconds before using this command again.`);
                return message.reply({ embeds: [embed] });
            }
        }

        
        cooldowns.set(userId, Date.now());

        try {
            
            const requestedBy = message.author;

            
            const userMention = message.mentions.users.first();
            const user = userMention || requestedBy;

           
            await client.guilds.fetch();

           
            let invitedGuilds = [];

            
            const inviteFetchPromises = client.guilds.cache.map(async guild => {
                try {
                    // Ensure the bot has permission to manage guild invites
                    if (!guild.me.permissions.has('MANAGE_GUILD')) {
                        return;
                    }

                    // Fetch invites for the guild
                    const invites = await guild.invites.fetch({ cache: false });
                    // Check if the user has invited the bot
                    const invite = invites.find(inv => inv.inviter && inv.inviter.id === user.id);
                    if (invite && !invitedGuilds.some(g => g.guild.id === guild.id)) {
                        invitedGuilds.push({ guild, invite });
                    }
                } catch (error) {
                    console.error(`Error fetching invites for guild ${guild.id}:`, error);
                }
            });

            // Wait for all invite fetch promises to resolve
            await Promise.all(inviteFetchPromises);

            // Check if there are any invited guilds
            if (invitedGuilds.length === 0) {
                const embed = new MessageEmbed()
                    .setColor('#ff5c00')
                    .setDescription(`${user.username} has not invited the bot to any servers.`);
                return message.reply({ embeds: [embed] });
            }

            // Prepare the embed
            const embed = new MessageEmbed()
                .setColor('#ff5c00')
                .setTitle(`**${client.user.username} Invited by ${user.username}**`)
                .setDescription(`**${user.username} has invited ${client.user.username} to the following servers:**`)
                .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))  // Add bot's avatar as thumbnail
                .setImage('');  

            
            const guildChunks = chunkArray(invitedGuilds, 5); 

            
            guildChunks.forEach((chunk, chunkIndex) => {
                chunk.forEach((guildInfo, index) => {
                    const { guild, invite } = guildInfo;
                    let description = `
                        <:MekoInvite:1289286398288859146> **[Server Invite](${invite.url})**
                        <:Meko_Search:1276254078728667239> **Server Members : ${guild.memberCount}**
                    `;
                    embed.addField(`${chunkIndex * 10 + index + 1}. ${guild.name}`, description);
                });
            });

            
            embed.setFooter(`Requested by ${requestedBy.tag}`, requestedBy.displayAvatarURL({ dynamic: true }));

            
            message.channel.send({ embeds: [embed] });

            a
            invitedGuilds = [];

        } catch (error) {
            console.error('Error in botinvite command:', error);
            const embed = new MessageEmbed()
                .setColor('#ff5c00')
                .setDescription('An error occurred while fetching bot info. Please try again later.');
            message.channel.send({ embeds: [embed] });
        } finally {
            
            setTimeout(() => cooldowns.delete(userId), cooldownTime);
        }
    }
};


function chunkArray(array, chunkSize) {
    const chunkedArr = [];
    let index = 0;
    while (index < array.length) {
        chunkedArr.push(array.slice(index, index + chunkSize));
        index += chunkSize;
    }
    return chunkedArr;
}
