const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'ownerinfo',
    description: 'Information Of Owner',
    emoji: '<a:OWNER:1286958811352928290>',
    userperm: ['SEND_MESSAGES'],
    botperm: ['SEND_MESSAGES'],
    /**
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */
    run: async (client, message, args) => {
        const ownerId = '239496212699545601'; // Replace with your owner's ID
        try {
            const owner = await client.users.fetch(ownerId);
            const embed1 = new MessageEmbed()
            .setTitle('<a:OWNER:1286958811352928290> Owner Info')
                .setThumbnail(owner.displayAvatarURL({ dynamic: true }))
                .addFields(
                    { name: 'Name', value: owner.username },
                    { name: 'Discord tag', value: owner.tag },
                    { name: 'Working on', value: 'Bot Development, YouTuber, Discord Bots' },
                    {
                        name: 'Socials',
                        value: '[Website](https://devankush.netlify.app/) | [GitHub](https://github.com/Ankush26030/Ankush)',
                    },
                    { name: 'Discord', value: '[Join Discord](https://discord.gg/hBvdRJgXzM)' }
                )
                .setColor(owner.hexAccentColor || '#800080');
            message.channel.send({ embeds: [embed1] });
        } catch (error) {
            console.error('Error fetching owner:', error);
            message.channel.send('An error occurred while fetching owner information.');
        }
    },
};