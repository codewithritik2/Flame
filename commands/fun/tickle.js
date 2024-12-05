const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'tickle',
    aliases: ['tickles'],
    category: 'fun',
    premium: false,
    usage: 'tickle <@user>',
    run: async (client, message, args) => {
        // Check if a user is mentioned
        if (!message.mentions.users.size) {
            const errorEmbed = new MessageEmbed()
                .setColor('#ff5c00')
                .setTitle(' **Tickle** ')
                .setDescription(' **Please mention a user to tickle.** ')
                .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL({ dynamic: true }));
            return message.channel.send({ embeds: [errorEmbed] });
        }

        // Get the mentioned user
        const user = message.mentions.users.first();

        // Prevent users from tickling themselves
        if (user.id === message.author.id) {
            const errorEmbed = new MessageEmbed()
                .setColor('#ff5c00')
                .setTitle(' **Tickle** ')
                .setDescription(' **You cannot tickle yourself.** ')
                .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL({ dynamic: true }));
            return message.channel.send({ embeds: [errorEmbed] });
        }

        // Prevent users from tickling the bot
        if (user.id === client.user.id) {
            const errorEmbed = new MessageEmbed()
                .setColor('#ff5c00')
                .setTitle(' **Tickle** ')
                .setDescription(' **You cannot tickle the bot.** ')
                .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL({ dynamic: true }));
            return message.channel.send({ embeds: [errorEmbed] });
        }

        // URLs for the tickle GIFs (you can replace these with your own GIFs)
        const tickleGifs = [
            'https://images-ext-1.discordapp.net/external/wDoIwLHsbu8Vulhmg95LXKq2I2AM0TofEd__Klswt9w/https/cdn.nekos.life/tickle/tickle_012.gif?width=600&height=337',
            'https://images-ext-1.discordapp.net/external/XlNGLLreUzdZUFCe7nh64fvyBNjiAO_93bgF6VaO2vM/https/i.pinimg.com/originals/6d/86/c3/6d86c39fe68fd0b6e97cc13a1c3b48c3.gif?width=500&height=281',
            'https://images-ext-1.discordapp.net/external/cfGuMCTB-vNZEmLq4Hv_mQe7Vksm0ehfHITM3kv7ZcM/https/media.tenor.com/PXL1ONAO9CEAAAPo/tickle-laugh.mp4',
            'https://images-ext-1.discordapp.net/external/RZuJ5mCycRZOZvGe9m8pSETio-HzOEQj_FF_-37lqHc/https/cdn.nekos.life/tickle/tickle_015.gif?width=625&height=312',
            'https://images-ext-1.discordapp.net/external/OJpuPuuCtm1bd0FYTkjoM69nj4mdcvoF_VP3IPCG--k/https/media.tenor.com/l3c7tV1zYD4AAAPo/date-a-live-date-a-live-iv.mp4'
        ];

        // Select a random tickle GIF
        const tickleGif = tickleGifs[Math.floor(Math.random() * tickleGifs.length)];

        // Create an embed to display the tickle action
        const embed = new MessageEmbed()
            .setColor('#ff5c00')
            .setTitle(` **${message.author.username} tickles ${user.username}** `)
            .setImage(tickleGif)
            .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL({ dynamic: true }));

        // Send the embed to the channel
        message.channel.send({ embeds: [embed] });
    },
};