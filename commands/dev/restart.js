const {
    Message,
    Client,
    MessageEmbed,
    MessageActionRow,
    MessageButton
} = require('discord.js')
this.config = require(`${process.cwd()}/config.json`)
module.exports = {
    name: 'restart',
    aliases: [],
    category: 'owner',

    run: async (client, message, args) => {
        if (!this.config.owner.includes(message.author.id)) return
        const embed = new MessageEmbed()
            .setColor('#ff5c00') // Black color
            .setTitle(' **Bot Restart Confirmation** ')
            .setDescription(' **Are you sure you want to restart the bot?** ')
            .setTimestamp();

        // Create buttons
        const row = new MessageActionRow().addComponents(
            new MessageButton()
                .setCustomId('restart_confirm')
                .setLabel('Restart')
                .setStyle('DANGER'),
            new MessageButton()
                .setCustomId('restart_cancel')
                .setLabel('Cancel')
                .setStyle('SECONDARY')
        );

        // Send the embed with buttons
        const confirmationMessage = await message.channel.send({
            embeds: [embed],
            components: [row]
        });

        // Create a collector to handle button clicks
        const filter = (interaction) => interaction.user.id === message.author.id;
        const collector = confirmationMessage.createMessageComponentCollector({ filter, time: 15000 });

        collector.on('collect', async (interaction) => {
            if (interaction.customId === 'restart_confirm') {
                // Send restart message to restart logs channel
                const restartLogsChannelId = '1291732402032476242'; // Replace with your restart logs channel ID
                const restartEmbed = new MessageEmbed()
                    .setColor('#ff5c00')
                    .setTitle(' **Bot Restarting** ')
                    .setDescription(' **The bot is restarting...** ')
                    .setTimestamp();

                const restartLogsChannel = client.channels.cache.get(restartLogsChannelId);
                if (restartLogsChannel) {
                    restartLogsChannel.send({ embeds: [restartEmbed] });
                } else {
                    console.error(`Could not find the restart logs channel with ID: ${restartLogsChannelId}`);
                }

                // Send a confirmation message in the current channel
                await interaction.update({ content: ' **Restarting the bot...** ', embeds: [], components: [] });

                // Restart the bot
                await restartBot();
            } else if (interaction.customId === 'restart_cancel') {
                // Cancel the restart
                await interaction.update({ content: ' **Bot restart canceled.** ', embeds: [], components: [] });
            }
        });

        collector.on('end', (collected) => {
            if (collected.size === 0) {
                confirmationMessage.edit({ content: ' **No response received, bot restart canceled.** ', embeds: [], components: [] });
            }
        });

        async function restartBot() {
            try {
                // Perform actions needed before restarting (if any)
                console.log('Bot restarting...');

                // Restart the bot (for example, by exiting the process which will be restarted by the process manager)
                process.exit();
            } catch (error) {
                console.error('Error while restarting bot:', error);
            }
        }
    }
};