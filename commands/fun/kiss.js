const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'kiss',
    aliases: [],
    category: 'fun',
    premium: false,
    usage: 'kiss <@user>',
    run: async (client, message, args) => {
        // Helper function to send error messages in an embed
        const sendErrorEmbed = (errorMsg) => {
            const errorEmbed = new MessageEmbed()
                .setColor('#ff5c00')
                .setTitle(' **Kiss** ')
                .setDescription(errorMsg)
                .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL({ dynamic: true }));
            message.channel.send({ embeds: [errorEmbed] });
        };

        // Check if a user is mentioned
        if (!message.mentions.users.size) {
            return sendErrorEmbed(' **Please mention a user to kiss.**');
        }

        // Get the mentioned user
        const user = message.mentions.users.first();

        // Prevent users from kissing themselves
        if (user.id === message.author.id) {
            return sendErrorEmbed(' **You cannot kiss yourself.** ');
        }

        // Prevent users from kissing the bot
        if (user.id === client.user.id) {
            return sendErrorEmbed(' **You cannot kiss the bot.** ');
        }

        // URLs for the kiss GIFs (you can replace these with your own GIFs)
        const kissGifs = [
            'https://images-ext-1.discordapp.net/external/-rsDXekdH7hhHWXzViRz0R4iQT-kkuJnxsH4CrvUAsY/%3Fcid%3D73b8f7b19oy3edtpelxxxq5ubj6ptc0quvg4aku437vklikc%26ep%3Dv1_gifs_gifId%26rid%3Dgiphy.mp4%26ct%3Dg/https/media1.giphy.com/media/FqBTvSNjNzeZG/giphy.mp4',
            'https://images-ext-1.discordapp.net/external/ULouwHsM5_by8u999RMMlzI-s0DcRVeMmSFUqlwpLks/%3Fcid%3D73b8f7b1vlo76f28sfale77qrwxr099dbjt7vitbq4zylbzb%26ep%3Dv1_gifs_gifId%26rid%3Dgiphy.mp4%26ct%3Dg/https/media2.giphy.com/media/kU586ictpGb0Q/giphy.mp4',
            'https://images-ext-1.discordapp.net/external/iRps9I6P6a3zoz9YFGA7DHrwN_MpDyi0fzWj4QhqR4w/%3Fcid%3D73b8f7b169j41k2ar7so9qs4d4j2teuitvmvmltrvfw402nd%26ep%3Dv1_gifs_gifId%26rid%3Dgiphy.mp4%26ct%3Dg/https/media2.giphy.com/media/12VXIxKaIEarL2/giphy.mp4',
            'https://images-ext-1.discordapp.net/external/q13h5tDyX_l0nTy1zEw4qoBSN7SD4vC-BKt02icOh5Q/%3Fcid%3D73b8f7b1sklyixuahqszd2s0ei05qqn96vr55hwpprrlacvn%26ep%3Dv1_gifs_gifId%26rid%3Dgiphy.mp4%26ct%3Dg/https/media1.giphy.com/media/bGm9FuBCGg4SY/giphy.mp4'
        ];

        // Select a random kiss GIF
        const kissGif = kissGifs[Math.floor(Math.random() * kissGifs.length)];

        // Create an embed to display the kiss action
        const embed = new MessageEmbed()
            .setColor('#ff5c00')
            .setTitle(`${message.author.username} kisses ${user.username}!`)
            .setImage(kissGif)
            .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL({ dynamic: true }));

        // Send the embed to the channel
        message.channel.send({ embeds: [embed] });
    },
};