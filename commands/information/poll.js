const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'poll',
    category: 'info',
    description: 'Create a poll with multiple options.',
    usage: '<question> | option1 | option2 | ...',
    
    run: async (client, message, args) => {
        if (!message.member.permissions.has('MANAGE_MESSAGES')) {
            return message.reply('You do not have permission to use this command.');
        }

        const pollArgs = message.content.slice('!poll'.length).trim().split('|');
        if (pollArgs.length < 2) {
            return message.reply('Usage: poll <question> | option1 | option2 | ...');
        }

        const question = pollArgs[0].trim();
        const options = pollArgs.slice(1).map(option => option.trim());

        const embed = new MessageEmbed()
            .setColor('#ff5c00')
            .setTitle('Poll')
            .setDescription(question)
            .addField('Options:', options.map((opt, index) => `${index + 1}. ${opt}`).join('\n'))
            .setFooter(client.user.username, client.user.displayAvatarURL({ dynamic: true }));

        try {
            const pollMessage = await message.channel.send({ embeds: [embed] });

            for (let i = 0; i < options.length; i++) {
                await pollMessage.react(getEmoji(i + 1));
            }

            message.reply('Poll created!');
        } catch (error) {
            console.error('Error occurred while creating poll:', error);
            message.reply('Failed to create poll. Please try again later.');
        }
    },
};

function getEmoji(number) {
    const emojiArray = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣'];
    return emojiArray[number - 1] || '❔';
}