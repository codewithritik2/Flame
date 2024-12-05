const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'suggest',
    category: 'info',
    description: 'Make a suggestion to improve the server or bot.',
    usage: '<your suggestion>',
    run: async (client, message, args) => {
        // Check if there's a suggestion
        const suggestion = args.join(' ');
        if (!suggestion) {
            return message.reply('**Please provide a suggestion.**');
        }

        // Send suggestion confirmation to the user via DM
        const embed = new MessageEmbed()
            .setColor('#ff5c00')
            .setTitle('Suggestion Received')
            .setDescription(`Your suggestion "${suggestion}" has been received!`)
            .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL({ dynamic: true }) });

        try {
            await message.author.send({ embeds: [embed] });
        } catch (error) {
            console.error(`Failed to send DM to ${message.author.tag} with suggestion confirmation.`, error);
            return message.reply('Failed to send you a DM with the suggestion confirmation. Please check your privacy settings.');
        }

        // Log the suggestion in a private channel
        const suggestionsChannelId = '1293602567342919680'; // Replace with your private channel ID
        const suggestionsChannel = client.channels.cache.get(suggestionsChannelId);
        if (!suggestionsChannel) {
            console.error('Could not find the suggestions channel.');
            return;
        }

        // Check if message author is valid before accessing ID
        if (!message.author || !message.author.id) {
            console.error('Message author or author ID is null or undefined.');
            return;
        }

        const suggestEmbed = new MessageEmbed()
            .setColor('#ff5c00') // Set embed color to black
            .setAuthor(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
            .setTitle('New Suggestion')
            .setDescription(suggestion)
            .setFooter({ text: `User ID: ${message.author.id}`, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
            .setTimestamp();

        try {
            await suggestionsChannel.send({ embeds: [suggestEmbed] });
            message.reply('Your suggestion has been submitted!');
        } catch (error) {
            console.error('Failed to log suggestion.', error);
            message.reply('Failed to submit your suggestion. Please try again later.');
        }
    },
};
