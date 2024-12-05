const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'rolecreate',
    category: 'mod',
    description: 'Create a new role with a random color.',
    usage: '$rolecreate <role name>',
    run: async (client, message, args) => {
        // Check if the user has permission to manage roles
        if (!message.member.permissions.has('MANAGE_ROLES')) {
            const noPermissionEmbed = new MessageEmbed()
                .setColor('#ff5c00')
                .setDescription('<a:cross:1289282294904918138> **You must have the `Manage Roles` permission to use this command.** ');

            return message.reply({ embeds: [noPermissionEmbed] });
        }

        // Check if role name is provided
        const roleName = args.join(' ');
        if (!roleName) {
            const usageEmbed = new MessageEmbed()
                .setColor('#ff5c00')
                .setDescription(`<:warn:1289287659767988224> **Usage: $rolecreate <role name>** `);

            return message.reply({ embeds: [usageEmbed] });
        }

        try {
            // Create the role with a random color
            const role = await message.guild.roles.create({
                name: roleName,
                color: 'RANDOM', // Random color
                reason: `Role created by ${message.author.tag}`
            });

            // Success message with embed
            const successEmbed = new MessageEmbed()
                .setColor('#ff5c00')
                .setDescription(`<a:Check:1291744468629717013> **Role **${role.name}** has been created successfully.** `);

            message.channel.send({ embeds: [successEmbed] });
        } catch (error) {
            console.error('<a:cross:1289282294904918138> **Error creating role:** ', error);

            // Error message with embed
            const errorEmbed = new MessageEmbed()
                .setColor('#ff5c00')
                .setDescription('<a:cross:1289282294904918138> **Failed to create the role. Please try again later.** ');

            message.reply({ embeds: [errorEmbed] });
        }
    },
};