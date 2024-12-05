const { Message, Client, MessageEmbed, MessageActionRow, MessageButton } = require('discord.js')

module.exports = {
    name: 'steal',
    aliases: ['addemoji', 'addsticker', 'addemote'],
    cooldown: 5,
    category: 'info',
    run: async (client, message, args) => {
        // Check manage emojis permission for the user
        if (!message.member.permissions.has('MANAGE_EMOJIS')) {
            return message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor(client.color)
                        .setDescription(
                            `${client.emoji.cross} | You must have \`Manage Emoji\` perms to use this command.`
                        )
                ]
            })
        }

        // Check manage emojis permission for the bot
        if (!message.guild.me.permissions.has('MANAGE_EMOJIS')) {
            return message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor(client.color)
                        .setDescription(
                            `${client.emoji.cross} | I must have \`Manage Emoji\` perms to use this command.`
                        )
                ]
            })
        }

        // Check if an emoji or sticker is provided
        let input = args[0]
        if (!input) {
            return message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor(client.color)
                        .setDescription(
                            `${client.emoji.cross} | You didn't provide any emoji or sticker to add.`
                        )
                ]
            })
        }

        // Detect if input is an emoji or a sticker
        let type = null
        let inputId = null
        
        // Check for custom emoji
        const emojiMatch = input.match(/^<a?:[\w]+:([0-9]+)>$/)
        if (emojiMatch) {
            type = 'emoji'
            inputId = emojiMatch[1]
        }

        // Check for sticker
        const stickerMatch = input.match(/^<[\w]+:([0-9]+)>$/)
        if (stickerMatch) {
            type = 'sticker'
            inputId = stickerMatch[1]
        }

        // Validate input
        if (!inputId) {
            return message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor(client.color)
                        .setDescription(
                            `${client.emoji.cross} | You provided an invalid emoji or sticker.`
                        )
                ]
            })
        }

        // Determine name (use provided name or default)
        let name = args[1] || (type === 'emoji' ? 'stolen_emoji' : 'stolen_sticker')

        // Create confirmation buttons
        const row = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId('confirm_emoji')
                    .setLabel(`Add ${type}`)
                    .setStyle('SUCCESS'),
                new MessageButton()
                    .setCustomId('cancel_steal')
                    .setLabel('Cancel')
                    .setStyle('DANGER')
            )

        // Send confirmation message
        const confirmMessage = await message.channel.send({
            embeds: [
                new MessageEmbed()
                    .setColor(client.color)
                    .setDescription(`Do you want to add this ${type}?`)
                    .setImage(`https://cdn.discordapp.com/emojis/${inputId}`)
            ],
            components: [row]
        })

        // Create collector for button interactions
        const filter = i => i.user.id === message.author.id
        const collector = confirmMessage.createMessageComponentCollector({ 
            filter, 
            max: 1, 
            time: 60000 
        })

        collector.on('collect', async i => {
            if (i.customId === 'cancel_steal') {
                return i.update({ 
                    embeds: [
                        new MessageEmbed()
                            .setColor(client.color)
                            .setDescription(`${client.emoji.cross} | ${type.charAt(0).toUpperCase() + type.slice(1)} addition canceled.`)
                    ],
                    components: [] 
                })
            }

            try {
                if (type === 'emoji') {
                    // Add emoji
                    const link = `https://cdn.discordapp.com/emojis/${inputId}`
                    const newEmoji = await message.guild.emojis.create(link, name)
                    
                    await i.update({ 
                        embeds: [
                            new MessageEmbed()
                                .setColor(client.color)
                                .setDescription(
                                    `${client.emoji.tick} | Successfully added the emoji ${newEmoji.toString()}.`
                                )
                        ],
                        components: [] 
                    })
                } else if (type === 'sticker') {
                    // Add sticker
                    const link = `https://cdn.discordapp.com/stickers/${inputId}`
                    const newSticker = await message.guild.stickers.create({
                        file: link,
                        name: name,
                        tags: name
                    })
                    
                    await i.update({ 
                        embeds: [
                            new MessageEmbed()
                                .setColor(client.color)
                                .setDescription(
                                    `${client.emoji.tick} | Successfully added the sticker.`
                                )
                        ],
                        components: [] 
                    })
                }
            } catch (err) {
                await i.update({ 
                    embeds: [
                        new MessageEmbed()
                            .setColor(client.color)
                            .setDescription(
                                `${client.emoji.cross} | I was unable to add the ${type}.\nPossible Reasons: \`Mass ${type}s added\`, \`Slots are Full\`.`
                            )
                    ],
                    components: [] 
                })
            }
        })

        collector.on('end', async (collected, reason) => {
            if (reason === 'time') {
                await confirmMessage.edit({ 
                    embeds: [
                        new MessageEmbed()
                            .setColor(client.color)
                            .setDescription(`${client.emoji.cross} | ${type.charAt(0).toUpperCase() + type.slice(1)} addition timed out.`)
                    ],
                    components: [] 
                })
            }
        })
    }
}