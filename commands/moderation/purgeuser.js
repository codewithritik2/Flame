const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'purgeuser',
    aliases: ['puser'],
    category: 'mod',
    premium: false,

    run: async (client, message, args) => {
        // Check if the user has MANAGE_MESSAGES permission
        if (!message.member.permissions.has('MANAGE_MESSAGES')) {
            const permissionEmbed = new MessageEmbed()
                .setColor('#ff5c00')
                .setDescription('<a:cross:1289282294904918138> **You do not have permission to use this command.** ');
            return message.reply({ embeds: [permissionEmbed] });
        }

        // Check if a user mention is provided
        const user = message.mentions.users.first();
        if (!user) {
            const mentionEmbed = new MessageEmbed()
                .setColor('#ff5c00')
                .setDescription('<a:cross:1289282294904918138> **Please mention the user whose messages you want to purge.** ');
            return message.reply({ embeds: [mentionEmbed] });
        }

        // Fetch the member from the guild
        const member = message.guild.members.cache.get(user.id);
        if (!member) {
            const memberNotFoundEmbed = new MessageEmbed()
                .setColor('#ff5c00')
                .setDescription('<a:cross:1289282294904918138> **The mentioned user is not found in this server.** ');
            return message.reply({ embeds: [memberNotFoundEmbed] });
        }

        // Fetch the number of messages to delete (default is 100, maximum is 100)
        let amount = parseInt(args[1]) || 100;
        if (isNaN(amount) || amount <= 0 || amount > 100) {
            amount = 100; // Default to 100 if invalid amount is provided
        }

        // Fetch messages from the channel sent by the mentioned user
        try {
            const fetchedMessages = await message.channel.messages.fetch({
                limit: amount + 1 // Fetch one more to include the command message
            });

            // Filter out messages sent by the mentioned user
            const userMessages = fetchedMessages.filter(m => m.author.id === user.id);

            // Delete the filtered messages
            await message.channel.bulkDelete(userMessages, true);

            // Respond with a success message
            const embed = new MessageEmbed()
                .setColor('#ff5c00')
                .setDescription(`<a:Check:1291744468629717013> **Successfully deleted ${userMessages.size} messages from ${user}.** `);
            message.channel.send({ embeds: [embed] }).then(m => m.delete({ timeout: 5000 }));

        } catch (error) {
            console.error('Error purging messages:', error);
            message.reply('<a:cross:1289282294904918138> **There was an error purging messages. Please try again later.** ');
        }
    }
};