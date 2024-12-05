const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'ship',
    aliases: ['love', 'pyar'],
    category: 'fun',
    premium: false,
    usage: 'ship <@user>',
    run: async (client, message, args) => {
        // Check if a user is mentioned
        if (!message.mentions.users.size) {
            return message.reply('Please mention a user to ship with!');
        }

        // Get the mentioned user
        const user = message.mentions.users.first();

        // Generate a random love percentage (0-100)
        const lovePercentage = Math.floor(Math.random() * 101);

        // URLs for the ship images (you can replace these with your own images)
        const shipImages = [
            'https://example.com/ship-1.png',
            'https://example.com/ship-2.png',
            'https://example.com/ship-3.png',
            'https://example.com/ship-4.png',
            ''
        ];

        // Select a random ship image
        const shipImage = shipImages[Math.floor(Math.random() * shipImages.length)];

        // Create an embed to display the ship result
        const embed = new MessageEmbed()
            .setColor('#ff5c00')
            .setTitle(`Shipping Results ❤️ ${message.author.username} x ${user.username}`)
            .setDescription(`You are ${lovePercentage}% in love with ${user}`)
            .addField('Love Meter', `${'❤️'.repeat(Math.ceil(lovePercentage / 10))}${'🖤'.repeat(Math.floor((100 - lovePercentage) / 10))}`)
            .setImage(shipImage)
            .setThumbnail(message.author.displayAvatarURL({ dynamic: true }))
            .setFooter('💖 Your Shipping Result.');

        // Send the embed to the channel
        message.channel.send({ embeds: [embed] });
    },
};