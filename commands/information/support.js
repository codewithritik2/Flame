const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');

module.exports = {
    name: 'support',
    category: 'info',
    aliases: [],
    description: 'Get The Invite Link To The Support Server.',
    premium: false,

    run: async (client, message, args) => {
        const embed = new MessageEmbed()
            .setColor('#ff5c00')
            .setTitle('<:Support:1291751934516269077> **Need Help ??** ')
            .setDescription(' **Click The Button Below To Join Our Support Server!!** ')
        
        const row = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setLabel('Support Server')
                    .setStyle('LINK')
                    .setURL('https://discord.gg/hBvdRJgXzM') 
            );
        
        await message.channel.send({ embeds: [embed], components: [row] });
    }
};
