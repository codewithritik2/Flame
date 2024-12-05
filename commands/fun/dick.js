const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'dick',
    aliases: ['loda', 'lund'],
    category: 'fun',
    premium: false,

    run: async (client, message, args) => {
        const dickEmojis = ['======D', '=======D', '==========D', '====D', '=D', '================D', '==================D', '====D', '=====D', 'Gay !', '=D'];
        const randomDickEmoji = dickEmojis[Math.floor(Math.random() * dickEmojis.length)];

        const embed = new MessageEmbed()
            .setColor('#ff5c00')
            .setTitle(` **Dick Size for ${message.author.username}** `) // Mentioning the user in the title
            .setDescription(`The dick size is: ${randomDickEmoji}`);

        message.channel.send({ embeds: [embed] });
    },
};
