const { MessageEmbed } = require('discord.js')

module.exports = {
    name: 'antialt',
    aliases: ['antinewaccount'],
    cooldown: 5,
    category: 'automod',
    subcommand: ['enable', 'disable', 'set'],
    premium: false,
    run: async (client, message, args) => {
        // Check if user has administrator permissions
        if (!message.member.permissions.has('ADMINISTRATOR')) {
            return message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor(client.color)
                        .setDescription(
                            `${client.emoji.cross} | You must have \`Administrator\` permissions to use this command.`
                        )
                ]
            })
        }

        // Check if bot has necessary permissions
        if (!message.guild.me.permissions.has(['KICK_MEMBERS', 'ADMINISTRATOR'])) {
            return message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor(client.color)
                        .setDescription(
                            `${client.emoji.cross} | I don't have \`Kick Members\` or \`Administrator\` permissions to execute this command.`
                        )
                ]
            })
        }

        let prefix = message.guild.prefix || '&'
        const option = args[0]

        // Default help embed
        const antiAltEmbed = new MessageEmbed()
            .setThumbnail(client.user.avatarURL({ dynamic: true }))
            .setColor(client.color)
            .setTitle('__**Anti-Alt Protection**__')
            .setDescription("Protect your server from new, potentially suspicious accounts!")
            .addField(
                '__**Enable Anti-Alt**__',
                `To Enable Anti-Alt, use \`${prefix}antialt enable\``
            )
            .addField(
                '__**Disable Anti-Alt**__',
                `To Disable Anti-Alt, use \`${prefix}antialt disable\``
            )
            .addField(
                '__**Set Account Age**__',
                `Set minimum account age: \`${prefix}antialt set <days>\``
            )
            .setTimestamp()
            .setFooter(client.user.username, client.user.displayAvatarURL())

        // Check if no option is provided
        if (!option) {
            return message.channel.send({ embeds: [antiAltEmbed] })
        }

        // Get current anti-alt settings
        const isAntiAltEnabled = 
            (await client.db.get(`antialt_${message.guild.id}`)) ?? false
        const currentAltAge = 
            (await client.db.get(`antialtage_${message.guild.id}`)) ?? 2

        switch (option) {
            case 'enable':
                if (!isAntiAltEnabled) {
                    // Enable anti-alt with default 2 days
                    await client.db.set(`antialt_${message.guild.id}`, true)
                    await client.db.set(`antialtage_${message.guild.id}`, 2)

                    const enableEmbed = new MessageEmbed()
                        .setColor(client.color)
                        .setTitle('Anti-Alt Protection Enabled')
                        .setDescription('**Anti-Alt protection has been activated!**')
                        .addField(
                            'Current Settings',
                            `Minimum Account Age: 2 days\nStatus: Enabled`
                        )
                        .setTimestamp()
                        .setFooter(
                            client.user.username,
                            client.user.displayAvatarURL()
                        )

                    return message.channel.send({ embeds: [enableEmbed] })
                } else {
                    const alreadyEnabledEmbed = new MessageEmbed()
                        .setColor(client.color)
                        .setTitle('Anti-Alt Protection')
                        .setDescription('**Anti-Alt protection is already enabled.**')
                        .addField(
                            'Current Settings',
                            `Minimum Account Age: ${currentAltAge} days\nStatus: Enabled`
                        )
                        .setTimestamp()
                        .setFooter(
                            client.user.username,
                            client.user.displayAvatarURL()
                        )

                    return message.channel.send({ embeds: [alreadyEnabledEmbed] })
                }

            case 'disable':
                if (isAntiAltEnabled) {
                    await client.db.set(`antialt_${message.guild.id}`, false)

                    const disableEmbed = new MessageEmbed()
                        .setColor(client.color)
                        .setTitle('Anti-Alt Protection Disabled')
                        .setDescription('**Anti-Alt protection has been deactivated.**')
                        .addField(
                            'Impact',
                            'New accounts will no longer be automatically kicked.'
                        )
                        .setTimestamp()
                        .setFooter(
                            client.user.username,
                            client.user.displayAvatarURL()
                        )

                    return message.channel.send({ embeds: [disableEmbed] })
                } else {
                    const alreadyDisabledEmbed = new MessageEmbed()
                        .setColor(client.color)
                        .setTitle('Anti-Alt Protection')
                        .setDescription('**Anti-Alt protection is already disabled.**')
                        .setTimestamp()
                        .setFooter(
                            client.user.username,
                            client.user.displayAvatarURL()
                        )

                    return message.channel.send({ embeds: [alreadyDisabledEmbed] })
                }

            case 'set':
                const days = parseInt(args[1])
                if (isNaN(days) || days < 1) {
                    return message.channel.send({
                        embeds: [
                            new MessageEmbed()
                                .setColor(client.color)
                                .setDescription('**Please provide a valid number of days (minimum 1).**')
                        ]
                    })
                }

                await client.db.set(`antialtage_${message.guild.id}`, days)
                
                const setEmbed = new MessageEmbed()
                    .setColor(client.color)
                    .setTitle('Anti-Alt Age Configured')
                    .setDescription('**Minimum account age has been updated.**')
                    .addField(
                        'New Settings',
                        `Minimum Account Age: ${days} days`
                    )
                    .setTimestamp()
                    .setFooter(
                        client.user.username,
                        client.user.displayAvatarURL()
                    )

                return message.channel.send({ embeds: [setEmbed] })

            default:
                return message.channel.send({ embeds: [antiAltEmbed] })
        }
    }
}

// Event listener for guildMemberAdd
module.exports.guildMemberAdd = async (client, member) => {
    // Check if anti-alt is enabled for this guild
    const isAntiAltEnabled = 
        (await client.db.get(`antialt_${member.guild.id}`)) ?? false
    
    if (!isAntiAltEnabled) return

    // Get the configured minimum account age
    const minAccountAge = 
        (await client.db.get(`antialtage_${member.guild.id}`)) ?? 2

    // Calculate account age in days
    const accountCreatedAt = member.user.createdAt
    const accountAgeInDays = Math.floor((Date.now() - accountCreatedAt) / (1000 * 60 * 60 * 24))

    // Check if account is younger than the minimum age
    if (accountAgeInDays < minAccountAge) {
        try {
            await member.kick(`Anti-Alt: Account less than ${minAccountAge} days old`)
            
            // Optional: Send log message to a log channel
            const logChannel = member.guild.channels.cache.find(
                ch => ch.name === 'mod-logs' || ch.name === 'logs'
            )
            
            if (logChannel) {
                const kickEmbed = new MessageEmbed()
                    .setColor('#FF0000')
                    .setTitle('Anti-Alt Kick')
                    .setDescription(`**User ${member.user.tag} was kicked**`)
                    .addField('Reason', `Account less than ${minAccountAge} days old`)
                    .addField('Account Created', accountCreatedAt.toUTCString())
                    .setTimestamp()

                logChannel.send({ embeds: [kickEmbed] })
            }
        } catch (error) {
            console.error('Failed to kick member:', error)
        }
    }
}