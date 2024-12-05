const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'boostcount',
    category: 'info',
    aliases: ['bc', 'bcount'],
    premium: false,

    run: async (client, message, args) => {
        
        const boostCount = message.guild.premiumSubscriptionCount || message.guild.premiumTier;

        const embed = new MessageEmbed()
            .setColor('#ff5c00')
            .setTitle('Boosts')
            .setDescription(`<a:BOOST:1286959739506393193> **${boostCount} Boosts** `)
            .setTimestamp();

        // Send the embed to the channel
        message.channel.send({ embeds: [embed] });
    }
};