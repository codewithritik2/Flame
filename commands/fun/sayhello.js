const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'sayhello',
    category: 'fun', // Adjust category as needed
    description: 'Say hello with a hand emoji and user avatar.',
    run: async (client, message, args) => {
        const emoji = '👋'; // Hand emoji

        // Create embed for the greeting
        const embed = new MessageEmbed()
            .setColor('#ff5c00') // Black color
            .setDescription(`${emoji} Hello, ${message.author}!`)
            .setThumbnail(message.author.displayAvatarURL({ dynamic: true }))
            .setFooter(client.user.username, client.user.displayAvatarURL({ dynamic: true }));

        // Send the embed as a reply
        try {
            await message.channel.send({ embeds: [embed] });
        } catch (error) {
            console.error('Failed to send hello message:', error);
            message.reply('Failed to send hello message. Please try again later.');
        }
    },
};