const axios = require('axios');
const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'ip',
    category: 'fun', // Adjust category as needed
    description: 'Look up information about an IP address.',
    usage: '<IP address>',
    run: async (client, message, args) => {
        const ipAddress = args[0];

        if (!ipAddress) {
            const embedError = new MessageEmbed()
                .setColor('#ff0000')
                .setTitle('IP Address Lookup')
                .setDescription('Please provide an IP address to look up.')
                .setFooter(client.user.username, client.user.displayAvatarURL({ dynamic: true }));

            return message.reply({ embeds: [embedError] });
        }

        try {
            const response = await axios.get(`http://ip-api.com/json/${ipAddress}`);
            const data = response.data;

            if (data.status === 'fail') {
                const embedFail = new MessageEmbed()
                    .setColor('#ff0000')
                    .setTitle('IP Address Lookup')
                    .setDescription('Invalid IP address or no results found.')
                    .setFooter(client.user.username, client.user.displayAvatarURL({ dynamic: true }));

                return message.reply({ embeds: [embedFail] });
            }

            const embed = new MessageEmbed()
                .setColor('#00ff00')
                .setTitle('IP Address Lookup')
                .addField('IP', data.query)
                .addField('City', data.city || 'Unknown', true)
                .addField('Region', data.regionName || 'Unknown', true)
                .addField('Country', `${data.country} (${data.countryCode})`, true)
                .addField('ISP', data.isp || 'Unknown')
                .addField('Organization', data.org || 'Unknown')
                .addField('AS', data.as || 'Unknown')
                .addField('ZIP Code', data.zip || 'Unknown')
                .setFooter(client.user.username, client.user.displayAvatarURL({ dynamic: true }));

            message.channel.send({ embeds: [embed] });
        } catch (error) {
            console.error('Error occurred while looking up IP:', error);
            message.reply('Failed to look up IP address. Please try again later.');
        }
    },
};