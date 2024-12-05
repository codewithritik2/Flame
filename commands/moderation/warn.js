const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'warn',
    aliases: ['chetaavane'],
    category: 'mod',
    premium: false,

    run: async (client, message, args) => {

        if (!message.member.permissions.has('MANAGE_ROLES')) {
            const permissionEmbed = new MessageEmbed()
                .setColor('#ff5c00')
                .setDescription('<a:cross:1289282294904918138> You do not have permission to use this command.');
            return message.reply({ embeds: [permissionEmbed] });
        }


        const user = message.mentions.users.first();
        if (!user) {
            const mentionEmbed = new MessageEmbed()
                .setColor('#ff5c00')
                .setDescription('<a:cross:1289282294904918138> Please mention the user to warn.');
            return message.reply({ embeds: [mentionEmbed] });
        }


        const reason = args.slice(1).join(' ') || ' **No reason provided** ';


        const member = message.guild.members.cache.get(user.id);


        try {
            await user.send(`<:warn:1289287659767988224> You have been warned in ${message.guild.name} for: ${reason}`);
        } catch (err) {
            console.log(`<a:cross:1289282294904918138> Failed to DM user ${user.tag}: ${err}`);
        }


        const embed = new MessageEmbed()
            .setColor('#ff5c00')
            .setTitle(`User Warned: ${user.tag}`)
            .addField('User', `${user} (${user.id})`)
            .addField('Moderator', `${message.author} (${message.author.id})`)
            .addField('Reason', reason)
            .setTimestamp();


        const modLogChannel = message.guild.channels.cache.find(channel => channel.name === 'mod-log');
        if (modLogChannel) {
            modLogChannel.send({ embeds: [embed] });
        } else {
            message.channel.send({ embeds: [embed] });
        }


        if (!client.warns.has(user.id)) {
            client.warns.set(user.id, []);
        }
        client.warns.get(user.id).push({
            moderator: message.author.tag,
            reason,
            timestamp: new Date().toLocaleString()
        });

 
        const successEmbed = new MessageEmbed()
            .setColor('#ff5c00')
            .setDescription(`<:tick:1277612193965412364> Successfully warned ${user.tag}.`);
        message.channel.send({ embeds: [successEmbed] });

        // Optionally, you can add code here to automate further actions like kicking or banning after a certain number of warnings.
    }
};