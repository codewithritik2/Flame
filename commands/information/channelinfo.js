const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'channelinfo',
    aliases: ['cinfo'],
    category: 'info',
    premium: false,

    run: async (client, message, args) => {
        // Get the channel mentioned or the channel where the command was used
        const channel = message.mentions.channels.first() || message.channel;

        // Ensure the channel is valid
        if (!channel) {
            return message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor('#ff5c00')
                        .setDescription(`<a:cross:1289282294904918138> | No valid channel mentioned or found.`)
                ]
            });
        }

        // Gather channel information
        const embed = new MessageEmbed()
            .setTitle(`<:Threads:1291750974976954400> **Information for #${channel.name}** `)
            .setColor('#ff5c00')
            .addField('<a:flame_arrow:1276257667345813624> **ID**', channel.id, false)
            .addField('<a:flame_arrow:1276257667345813624> **Type**', channel.type, false)
            .addField('<a:flame_arrow:1276257667345813624> **Created At**', channel.createdAt.toDateString(), false)
            .addField('<a:flame_arrow:1276257667345813624> **Topic**', channel.topic || 'No topic', false)
            .addField('<a:flame_arrow:1276257667345813624> **NSFW**', channel.nsfw ? 'Yes' : 'No', false)
            .addField('<a:flame_arrow:1276257667345813624> **Position**', channel.position.toString(), false)
            .addField('<a:flame_arrow:1276257667345813624> **Category**', channel.parent ? channel.parent.name : 'No category', false)
            .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL({ dynamic: false }))
            .setTimestamp();

        // Additional information for text channels
        if (channel.isText()) {
            embed.addField('<a:flame_arrow:1276257667345813624> **Slowmode**', `${channel.rateLimitPerUser} seconds`, false)
                .addField('<a:flame_arrow:1276257667345813624> **Topic**', channel.topic || 'No topic', false);
        }

        // Additional information for voice channels
        if (channel.isVoice()) {
            embed.addField('<a:flame_arrow:1276257667345813624> **User Limit', channel.userLimit ? channel.userLimit.toString() : 'No limit** ', false)
                .addField('<a:flame_arrow:1276257667345813624> **Bitrate', `${channel.bitrate / 1000} kbps** `, false);
        }

        // Send the embed
        return message.channel.send({ embeds: [embed] });
    }
};