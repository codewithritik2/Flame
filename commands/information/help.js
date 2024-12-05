const { MessageEmbed, MessageActionRow, MessageButton, MessageSelectMenu } = require('discord.js');

module.exports = {
    name: 'help',
    aliases: ['h'],
    category: 'info',
    premium: false,
    run: async (client, message, args) => {
        // Create a MessageSelectMenu
        const selectMenu = new MessageSelectMenu()
            .setCustomId('categorySelect')
            .setPlaceholder('❯ Flame Get Started')
            .addOptions([
                { label: 'AntiNuke', value: 'antinuke', emoji: '<:Black_Antinuke:1313036217704517682>' },
                { label: 'Moderation', value: 'mod', emoji: '<:Black_Mod:1313036317743120474>' },
                { label: 'Utility', value: 'info', emoji: '<:Black_Utility:1313036656076652624>' },
                { label: 'Welcomer', value: 'welcomer', emoji: '<:Black_Welcome:1313038776150392882>' },
                { label: 'Automod', value: 'automod', emoji: '<:Black_Automod:1313036386240303144>' },
                { label: 'Voice', value: 'voice', emoji: '<:Black_Voice:1313036830219960331>' },
                { label: 'Logging', value: 'logging', emoji: '<:Black_Logs:1313036895856492595>' },
                { label: 'Fun', value: 'fun', emoji: '<:Black_Fun:1313039840308363274>' },
                { label: 'Join To Create', value: 'join to create', emoji: '<:Black_J2C:1313037117227536455>' },
                { label: 'Custom Role', value: 'customrole', emoji: '<:premiumdev:1312688091823214644>' },
                { label: 'Giveaway', value: 'giveaway', emoji: '<:flame_gift:1299106878986649683>' },
            ]);

        const row1 = new MessageActionRow().addComponents(
            new MessageButton()
                .setCustomId('antinuke')
                .setLabel('AntiNuke')
                .setStyle('SECONDARY')
                .setEmoji('1313036217704517682'),
            new MessageButton()
                .setCustomId('mod')
                .setLabel('Moderation')
                .setStyle('SECONDARY')
                .setEmoji('1313036317743120474'),
            new MessageButton()
                .setCustomId('info')
                .setLabel('Utility')
                .setStyle('SECONDARY')
                .setEmoji('1313036656076652624'),
            new MessageButton()
                .setCustomId('welcomer')
                .setLabel('Welcomer')
                .setStyle('SECONDARY')
                .setEmoji('1313038776150392882')
        );

        const row2 = new MessageActionRow().addComponents(
            new MessageButton()
                .setCustomId('automod')
                .setLabel('Automod')
                .setStyle('SECONDARY')
                .setEmoji('1313036386240303144'),
            new MessageButton()
                .setCustomId('voice')
                .setLabel('Voice')
                .setStyle('SECONDARY')
                .setEmoji('1313036830219960331'),
            new MessageButton()
                .setCustomId('logging')
                .setLabel('Logging')
                .setStyle('SECONDARY')
                .setEmoji('1313036895856492595'),
            new MessageButton()
                .setCustomId('fun')
                .setLabel('Fun')
                .setStyle('SECONDARY')
                .setEmoji('1313039840308363274'),
            new MessageButton()
                .setCustomId('join to create')
                .setLabel('Join To Create')
                .setStyle('SECONDARY')
                .setEmoji('1313037117227536455'),
            new MessageButton()
                .setCustomId('customrole')
                .setLabel('Custom Role')
                .setStyle('SECONDARY')
                .setEmoji('1312688091823214644'),
            new MessageButton()
                .setCustomId('giveaway')
                .setLabel('Giveaway')
                .setStyle('SECONDARY')
                .setEmoji('1299106878986649683')
        );

        const embed = new MessageEmbed()
            .setColor(client.color)
            .setAuthor({
                name: message.author.tag,
                iconURL: message.author.displayAvatarURL({ dynamic: true })
            })
            .setThumbnail(client.user.displayAvatarURL())
            .setFooter({ text: "Developed With ❤️ By The Ankush </>", iconURL: 'https://images-ext-1.discordapp.net/external/MW0QYX5ViX71OED6HRihHIUkdo-6039u4MuW-WR6vZQ/%3Fsize%3D2048/https/cdn.discordapp.com/avatars/239496212699545601/2dcd4f7fd19e6d4e533eb5a72848465a.webp' })
            .setDescription(
                "**Help Menu & Support Panel**\n```yaml\n- <> = required argument\n- [] = optional argument```"
            )
            .addField(
                '<:Black_Modules:1313042849880735744> **__Modules__**',
                `
                > <:Black_Antinuke:1313036217704517682> \`:\` **[AntiNuke](https://discord.gg/hBvdRJgXzM)**\n > <:Black_Mod:1313036317743120474> \`:\` **[Moderation](https://discord.gg/hBvdRJgXzM)**\n > <:Black_Welcome:1313038776150392882> \`:\` **[Welcomer](https://discord.gg/hBvdRJgXzM)**\n > <:Black_Automod:1313036386240303144> \`:\` **[Automod](https://discord.gg/hBvdRJgXzM)**\n > <:Black_Utility:1313036656076652624> \`:\` **[Utility](https://discord.gg/hBvdRJgXzM)**\n > <:Black_Voice:1313036830219960331> \`:\` **[Voice](https://discord.gg/hBvdRJgXzM)**\n > <:Black_Logs:1313036895856492595> \`:\` **[Logging](https://discord.gg/hBvdRJgXzM)**\n > <:Black_Fun:1313039840308363274> \`:\` **[Fun](https://discord.gg/hBvdRJgXzM)**\n > <:Black_J2C:1313037117227536455> \`:\` **[Join To Create](https://discord.gg/hBvdRJgXzM)**\n > <:premiumdev:1312688091823214644> \`:\` **[Custom Role](https://discord.gg/hBvdRJgXzM)**\n > <:flame_gift:1299106878986649683> \`:\` **[Giveaway](https://discord.gg/hBvdRJgXzM)**  
                `,
                true 
            )
            .addField(
                '<:link:1286984985814765600>  **__Links__**',
                `
                [Invite](https://discord.com/oauth2/authorize?client_id=1259218811131793479&permissions=8&integration_type=0&scope=bot+applications.commands) | [Support](https://discord.gg/hBvdRJgXzM) | [Vote](https://top.gg/bot/1259218811131793479/vote)
                `,
                false
            );

        const helpMessage = await message.channel.send({ embeds: [embed], components: [new MessageActionRow().addComponents(selectMenu)] });

        const collector = helpMessage.createMessageComponentCollector({
            filter: (i) => i.user && (i.isButton() || i.isSelectMenu()),
            time: 60000
        });

        collector.on('collect', async (i) => {
            if (i.isButton()) {
                const category = i.customId;
                let commands = [];
                switch (category) {
                    case 'antinuke':
                        commands = client.commands
                            .filter((x) => x.category && x.category === 'security')
                            .map((x) => `\`${x.name}\``);
                        break;
                    case 'mod':
                        commands = client.commands
                            .filter((x) => x.category && x.category === 'mod')
                            .map((x) => `\`${x.name}\``);
                        break;
                    case 'info':
                        commands = client.commands
                            .filter((x) => x.category && x.category === 'info')
                            .map((x) => `\`${x.name}\``);
                        break;
                    case 'welcomer':
                        commands = client.commands
                            .filter((x) => x.category && x.category === 'welcomer')
                            .map((x) => `\`${x.name}\``);
                        break;
                    case 'automod':
                        commands = client.commands
                            .filter((x) => x.category && x.category === 'automod')
                            .map((x) => `\`${x.name}\``);
                        break;      
                    case 'utility':
                        commands = client.commands
                            .filter((x) => x.category && x.category === 'utility')
                            .map((x) => `\`${x.name}\``);
                        break;   
                    case 'voice':
                        commands = client.commands
                            .filter((x) => x.category && x.category === 'voice')
                            .map((x) => `\`${x.name}\``);
                        break;
                        case 'logging':
                        commands = client.commands
                            .filter((x) => x.category && x.category === 'logging')
                            .map((x) => `\`${x.name}\``);
                        break;
                        case 'fun':
                        commands = client.commands
                            .filter((x) => x.category && x.category === 'fun')
                            .map((x) => `\`${x.name}\``);
                        break;
                        case 'join to create':
                        commands = client.commands
                            .filter((x) => x.category && x.category === 'join to create')
                            .map((x) => `\`${x.name}\``);
                        break;
                        case 'customrole':
                        commands = client.commands
                            .filter((x) => x.category && x.category === 'customrole')
                            .map((x) => `\`${x.name}\``);
                        break;
                        case 'giveaway':
                        commands = client.commands
                            .filter((x) => x.category && x.category === 'giveaway')
                            .map((x) => `\`${x.name}\``);
                        break;
                }
                const categoryEmbed = new MessageEmbed()
                    .setColor(client.color)
                    .setAuthor({
                        name: client.user.username,
                        iconURL: client.user.displayAvatarURL()
                    })
                    .setThumbnail(client.user.displayAvatarURL())
                    .setDescription(`**${i.customId.charAt(0).toUpperCase() + i.customId.slice(1)} Commands**\n${commands.join(', ')}`);
                i.reply({ embeds: [categoryEmbed], ephemeral: true });
            } else if (i.isSelectMenu()) {
                const selectedCategory = i.values[0];
                let commands = [];
                switch (selectedCategory) {
                    case 'antinuke':
                        commands = client.commands
                            .filter((x) => x.category && x.category === 'security')
                            .map((x) => `\`${x.name}\``);
                        break;
                    case 'mod':
                        commands = client.commands
                            .filter((x) => x.category && x.category === 'mod')
                            .map((x) => `\`${x.name}\``);
                        break;
                    case 'info':
                        commands = client.commands
                            .filter((x) => x.category && x.category === 'info')
                            .map((x) => `\`${x.name}\``);
                        break;
                    case 'welcomer':
                        commands = client.commands
                            .filter((x) => x.category && x.category === 'welcomer')
                            .map((x) => `\`${x.name}\``);
                        break;
                    case 'automod':
                        commands = client.commands
                            .filter((x) => x.category && x.category === 'automod')
                            .map((x) => `\`${x.name}\``);
                        break;      
                    case 'utility':
                        commands = client.commands
                            .filter((x) => x.category && x.category === 'utility')
                            .map((x) => `\`${x.name}\``);
                        break;   
                    case 'voice':
                        commands = client.commands
                            .filter((x) => x.category && x.category === 'voice')
                            .map((x) => `\`${x.name}\``);
                        break;
                        case 'logging':
                        commands = client.commands
                            .filter((x) => x.category && x.category === 'logging')
                            .map((x) => `\`${x.name}\``);
                        break;
                        case 'fun':
                        commands = client.commands
                            .filter((x) => x.category && x.category === 'fun')
                            .map((x) => `\`${x.name}\``);
                        break;
                        case 'join to create':
                        commands = client.commands
                            .filter((x) => x.category && x.category === 'join to create')
                            .map((x) => `\`${x.name}\``);
                        break;
                        case 'customrole':
                        commands = client.commands
                            .filter((x) => x.category && x.category === 'customrole')
                            .map((x) => `\`${x.name}\``);
                        break;
                        case 'giveaway':
                        commands = client.commands
                            .filter((x) => x.category && x.category === 'giveaway')
                            .map((x) => `\`${x.name}\``);
                        break;
                }
                const categoryEmbed = new MessageEmbed()
                    .setColor(client.color)
                    .setAuthor({
                        name: client.user.username,
                        iconURL: client.user.displayAvatarURL()
                    })
                    .setThumbnail(client.user.displayAvatarURL())
                    .setDescription(`**${selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)} Commands**\n${commands.join(', ')}`);
                i.reply({ embeds: [categoryEmbed], ephemeral: true });
            }
        });
    },
};
