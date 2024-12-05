const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'hug',
    aliases: ['embrace'],
    category: 'fun',
    premium: false,
    usage: 'hug <@user>',
    run: async (client, message, args) => {
        // Check if a user is mentioned
        if (!message.mentions.users.size) {
            const errorEmbed = new MessageEmbed()
                .setColor('#ff5c00')
                .setTitle(' **Hug** ')
                .setDescription(' **Please mention a user to hug.** ')
                .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL({ dynamic: true }));
            return message.channel.send({ embeds: [errorEmbed] });
        }

        // Get the mentioned user
        const user = message.mentions.users.first();

        // Prevent users from hugging themselves
        if (user.id === message.author.id) {
            const errorEmbed = new MessageEmbed()
                .setColor('#ff5c00')
                .setTitle(' **Hug** ')
                .setDescription(' **You cannot hug yourself.** ')
                .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL({ dynamic: true }));
            return message.channel.send({ embeds: [errorEmbed] });
        }

        // Prevent users from hugging the bot
        if (user.id === client.user.id) {
            const errorEmbed = new MessageEmbed()
                .setColor('#ff5c00')
                .setTitle(' **Hug** ')
                .setDescription(' **You cannot hug the bot.** ')
                .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL({ dynamic: true }));
            return message.channel.send({ embeds: [errorEmbed] });
        }

        // URLs for the hug GIFs (you can replace these with your own GIFs)
        const hugGifs = [
            'https://images-ext-1.discordapp.net/external/g2JaJlC98T2YgNkVBuC0XGPYy0qQKM-1uIsIZl6zOnA/%3Fcid%3D73b8f7b1msy2zme8kp3i5we2og1864cd005apa18afaki7et%26ep%3Dv1_gifs_gifId%26rid%3Dgiphy.mp4%26ct%3Dg/https/media0.giphy.com/media/od5H3PmEG5EVq/giphy.mp4',
            'https://images-ext-1.discordapp.net/external/-Nig3oPEETdnXsV8P2uhflbP3b556m3qBhZPbw73OHI/%3Fcid%3D73b8f7b1rflie3xntnsxk5u3drbn6kgcstr7p220a113erng%26ep%3Dv1_gifs_gifId%26rid%3Dgiphy.mp4%26ct%3Dg/https/media1.giphy.com/media/l2QDM9Jnim1YVILXa/giphy.mp4',
            'https://images-ext-1.discordapp.net/external/EcE4Jx2pt436jKW6NUnGeA6vGxq0FbNug5d89Nx0w1c/https/media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExeWI4cWpxZzdkc2Qza2o4aG90dDdiNHB6bXkybTd1bWwxNDkzMHFvbyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/aD1fI3UUWC4/giphy.webp?format=webp&width=485&height=272',
            'https://images-ext-1.discordapp.net/external/DKUhZBmcf_wtADodVFJdT6j67rlwJfzZS8ncQQgap08/https/media.tenor.com/DQLvs_3NTkYAAAAC/establife-anime-hug.gif?width=622&height=350',
            'https://images-ext-1.discordapp.net/external/lQ9R8tse4Ke0tOVuRiwZqQPi5GQWNDzAdg-QXTjQFXg/https/media.tenor.com/ovNCUj6S8ycAAAAC/aharen-san-anime-hug.gif?width=622&height=350',
            'https://images-ext-1.discordapp.net/external/oYT4MbELR0JRaniJ5Gy8OgRBFqglTnp8D6MbpwUpfOE/https/media.tenor.com/PCIu5V-_c1QAAAAC/iloveyousomuch-iloveyou.gif?width=500&height=283'
        ];

        // Select a random hug GIF
        const hugGif = hugGifs[Math.floor(Math.random() * hugGifs.length)];

        // Create an embed to display the hug action
        const embed = new MessageEmbed()
            .setColor('#ff5c00')
            .setTitle(`** ${message.author.username} gives hugged to ${user.username}** `)
            .setImage(hugGif)
            .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL({ dynamic: true }));

        // Send the embed to the channel
        message.channel.send({ embeds: [embed] });
    },
};
