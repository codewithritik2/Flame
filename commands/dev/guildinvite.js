const { MessageEmbed } = require('discord.js');
this.config = require(`${process.cwd()}/config.json`);

module.exports = {
    name: 'guildinvite',
    aliases: [],
    category: 'Owner',
    description: 'Generates an invite link for a server by ID',
    usage: 'getinvite <serverID>',
    run: async (client, message, args) => {
        if (!this.config.owner.includes(message.author.id)) return message.reply("You do not have permission to use this command.");

        const serverId = args[0];
        if (!serverId) return message.reply("Please provide a server ID.");

        const guild = client.guilds.cache.get(serverId);
        if (!guild) return message.reply("I'm not in that server or the server ID is invalid.");

        try {
            // Find a channel where the bot has permissions to create an invite
            const channel = guild.channels.cache.find(ch => 
                ch.permissionsFor(guild.me).has('CREATE_INSTANT_INVITE') && ch.type === 'GUILD_TEXT'
            );
            
            if (!channel) return message.reply("I don't have permission to create an invite in any channel of that server.");

            // Create the invite
            const invite = await channel.createInvite({ maxAge: 0, maxUses: 0 });
            const embed = new MessageEmbed()
                .setTitle(`Invite Link For ${guild.name}`)
                .setDescription(`[Click Here To Join ${guild.name}](${invite.url})`)
                .setColor('#ff5c00')
                .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL());

            return message.channel.send({ embeds: [embed] });
        } catch (error) {
            console.error(error);
            return message.reply("An error occurred while trying to create an invite.");
        }
    },
};
