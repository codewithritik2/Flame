const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'slap',
    aliases: ['thapad'],
    category: 'fun',
    premium: false,
    usage: 'slap <@user>',
    run: async (client, message, args) => {
        // Helper function to send error messages in an embed
        const sendErrorEmbed = (errorMsg) => {
            const errorEmbed = new MessageEmbed()
                .setColor('#ff5c00')
                .setTitle(' **Slap** ')
                .setDescription(errorMsg)
                .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL({ dynamic: true }));
            message.channel.send({ embeds: [errorEmbed] });
        };

        // Check if a user is mentioned
        if (!message.mentions.users.size) {
            return sendErrorEmbed(' **Please mention a user to slap!** ');
        }

        // Get the mentioned user
        const user = message.mentions.users.first();

        // Prevent users from slapping themselves
        if (user.id === message.author.id) {
            return sendErrorEmbed(' **You cannot slap yourself!** ');
        }

        // Prevent users from slapping the bot
        if (user.id === client.user.id) {
            return sendErrorEmbed(' **You cannot slap the bot!** ');
        }

        // URLs for the slap GIFs (you can replace these with your own GIFs)
        const slapGifs = [
            'https://images-ext-1.discordapp.net/external/Ao1AAAOe_cf8A-QvUmZH04-9LUDBB3xQ5hekxSKc3fs/%3Fcid%3D73b8f7b10gyeatuhaoynuub9e2l474fdxdqyj6flryz0si91%26ep%3Dv1_gifs_gifId%26rid%3Dgiphy.mp4%26ct%3Dg/https/media3.giphy.com/media/Gf3AUz3eBNbTW/giphy.mp4',
            'https://media.discordapp.net/attachments/1298930848565035018/1298953867727212574/girl-slap.gif?ex=671b708f&is=671a1f0f&hm=723f36cb9c88e96f5f5ae6714b94e7a7c420fd9145523bb9e54f833832215e12&',
            'https://images-ext-1.discordapp.net/external/c2sF6DCt7DXjHzuukQwlNQgp8KOxyllLCa5ad6knwhU/%3Fcid%3D73b8f7b1ry4l6rn5mm7407ejkbu6msri2260h2g8hsxhy5dv%26ep%3Dv1_gifs_gifId%26rid%3Dgiphy.mp4%26ct%3Dg/https/media0.giphy.com/media/mEtSQlxqBtWWA/giphy.mp4',
            'https://images-ext-1.discordapp.net/external/eyS2pyrLnz6YjczOTlXX7ziLL4hRVN_aIPcRRiaiZa4/%3Fcid%3D73b8f7b1nj5tvskn6i6bh2x03ymmgxlptbjyle5uq6gp34id%26ep%3Dv1_gifs_gifId%26rid%3Dgiphy.mp4%26ct%3Dg/https/media4.giphy.com/media/3XlEk2RxPS1m8/giphy.mp4',
            'https://media.discordapp.net/attachments/1298930848565035018/1298944956286636052/saki-saki-mukai-naoya.gif?ex=671b6842&is=671a16c2&hm=d32fc63627267b6cf33be9449801f87880cb4cef90b2766c238dd5c8997970d7&=&width=622&height=371'
        ];

        // Select a random slap GIF
        const slapGif = slapGifs[Math.floor(Math.random() * slapGifs.length)];

        // Create an embed to display the slap action
        const embed = new MessageEmbed()
            .setColor('#ff5c00')
            .setTitle(`${message.author.username} slaps ${user.username}!`)
            .setImage(slapGif)
            .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL({ dynamic: true }));

        // Send the embed to the channel
        message.channel.send({ embeds: [embed] });
    },
};