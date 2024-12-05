module.exports.guildMemberAdd = async (client, member) => {
    // Add extensive logging
    console.log(`Member Joined: ${member.user.tag}`)
    console.log(`Guild ID: ${member.guild.id}`)

    // Explicit null checks
    if (!client || !client.db) {
        console.error('Client or database not properly initialized')
        return
    }

    // Retrieve anti-alt settings with explicit error handling
    let isAntiAltEnabled, minAccountAge;
    try {
        isAntiAltEnabled = await client.db.get(`antialt_${member.guild.id}`)
        minAccountAge = await client.db.get(`antialtage_${member.guild.id}`)
    } catch (dbError) {
        console.error('Database retrieval error:', dbError)
        return
    }

    // Default values if not set
    isAntiAltEnabled = isAntiAltEnabled ?? false
    minAccountAge = minAccountAge ?? 2

    console.log(`Anti-Alt Enabled: ${isAntiAltEnabled}`)
    console.log(`Minimum Account Age: ${minAccountAge} days`)

    if (!isAntiAltEnabled) return

    const accountCreatedAt = member.user.createdAt
    const accountAgeInDays = Math.floor((Date.now() - accountCreatedAt) / (1000 * 60 * 60 * 24))

    console.log(`Account Age: ${accountAgeInDays} days`)

    if (accountAgeInDays < minAccountAge) {
        try {
            // Verify bot has necessary permissions before kicking
            if (!member.guild.me.permissions.has('KICK_MEMBERS')) {
                console.error('Bot lacks KICK_MEMBERS permission')
                return
            }

            await member.kick(`Anti-Alt: Account less than ${minAccountAge} days old`)
            console.log(`Successfully kicked ${member.user.tag}`)

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
            console.error('Kick Failed:', error)
        }
    }
}