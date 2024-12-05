const { MessageEmbed, MessageActionRow, MessageButton, Modal, TextInputComponent } = require('discord.js');

module.exports = {
    name: 'jointocreate',
    aliases: ['join2vc'],
    category: 'join to create',
    description: 'Sets up Join to Create functionality in a category.',
    usage: '',
    run: async (client, message, args) => {
        if (!message.member.permissions.has('ADMINISTRATOR')) {
            return message.reply('You need to have administrator permissions to use this command.');
        }

        const author = message.author;
        let category;
        let voiceChannel;
        let interactionMessage; // Store the message with the interface buttons

        // Helper function to ask a question and wait for user response
        const askQuestion = async (question) => {
            const embed = new MessageEmbed()
                .setColor('#ff5c00')
                .setTitle('Join to Create Setup')
                .setDescription(question)
                .setFooter(client.user.username, client.user.displayAvatarURL({ dynamic: true }));

            const questionMessage = await message.channel.send({ embeds: [embed] });

            try {
                const response = await message.channel.awaitMessages({
                    filter: m => m.author.id === author.id,
                    max: 1,
                    time: 60000, // 60 seconds
                    errors: ['time']
                });

                // Delete the question message after getting the response
                await questionMessage.delete();

                return response.first().content;
            } catch (error) {
                console.error('Error waiting for response:', error);
                return null;
            }
        };

        // Ask for category name
        const categoryName = await askQuestion('Enter the name of the category you wish to create the channels in: (e.g. Voice Channels)');
        if (!categoryName) return message.reply('No category name provided or timeout.');

        // Create the category
        try {
            category = await message.guild.channels.create(categoryName, {
                type: 'GUILD_CATEGORY',
                reason: `${author.tag} requested creation of category for Join to Create setup.`
            });
        } catch (error) {
            console.error('Error creating category:', error);
            return message.reply('Could not create the category. Please try again later.');
        }

        // Ask for voice channel name
        const voiceChannelName = await askQuestion('Enter the name of the voice channel: (e.g. Join To Create)');
        if (!voiceChannelName) return message.reply('No voice channel name provided or timeout.');

        // Create the voice channel in the category
        try {
            voiceChannel = await message.guild.channels.create(voiceChannelName, {
                type: 'GUILD_VOICE',
                parent: category.id,
                reason: `${author.tag} requested creation of voice channel for Join to Create setup.`
            });
        } catch (error) {
            console.error('Error creating voice channel:', error);
            return message.reply('Could not create the voice channel. Please try again later.');
        }

        // Function to update the message with the interactive interface
        const updateInteractionMessage = async () => {
            const successEmbed = new MessageEmbed()
                .setColor('#ff5c00')
                .setTitle('Join to Create Setup Complete')
                .setDescription('You are all set up!')
                .addField('Category', category.name)
                .addField('Voice Channel', voiceChannel.name)
                .setFooter(client.user.username, client.user.displayAvatarURL({ dynamic: true }));

            const row = new MessageActionRow()
                .addComponents(
                    new MessageButton()
                        .setCustomId('lockButton')
                        .setLabel('Lock')
                        .setStyle('PRIMARY'),
                    new MessageButton()
                        .setCustomId('unlockButton')
                        .setLabel('Unlock')
                        .setStyle('SUCCESS'),
                    new MessageButton()
                        .setCustomId('hideButton')
                        .setLabel('Hide')
                        .setStyle('DANGER'),
                    new MessageButton()
                        .setCustomId('unhideButton')
                        .setLabel('Unhide')
                        .setStyle('SECONDARY'),
                    new MessageButton()
                        .setCustomId('userLimitButton')
                        .setLabel('Set User Limit')
                        .setStyle('SECONDARY')
                );

            // If interactionMessage already exists, edit it. Otherwise, send a new message.
            if (interactionMessage) {
                await interactionMessage.edit({ embeds: [successEmbed], components: [row] });
            } else {
                interactionMessage = await message.channel.send({ embeds: [successEmbed], components: [row] });
            }
        };

        // Initial setup message
        await updateInteractionMessage();

        // Function to handle button interactions
        const handleButtonInteraction = async (interaction) => {
            const member = message.guild.members.cache.get(interaction.user.id);
            if (!member || !member.voice.channel || member.voice.channel.parentId !== category.id) {
                return interaction.reply({ content: 'You are not in a voice channel in this category.', ephemeral: true });
            }

            const channel = member.voice.channel;
            const buttonId = interaction.customId;
            switch (buttonId) {
                case 'lockButton':
                    try {
                        await channel.permissionOverwrites.edit(message.guild.roles.everyone, {
                            CONNECT: false,
                            SPEAK: false,
                            STREAM: false
                        });
                        await interaction.reply({ content: 'Voice channel locked successfully.', ephemeral: true });
                    } catch (error) {
                        console.error('Error locking voice channel:', error);
                        await interaction.reply({ content: 'Failed to lock voice channel.', ephemeral: true });
                    }
                    break;
                case 'unlockButton':
                    try {
                        await channel.permissionOverwrites.edit(message.guild.roles.everyone, {
                            CONNECT: true,
                            SPEAK: true,
                            STREAM: true
                        });
                        await interaction.reply({ content: 'Voice channel unlocked successfully.', ephemeral: true });
                    } catch (error) {
                        console.error('Error unlocking voice channel:', error);
                        await interaction.reply({ content: 'Failed to unlock voice channel.', ephemeral: true });
                    }
                    break;
                case 'hideButton':
                    try {
                        await channel.permissionOverwrites.edit(message.guild.roles.everyone, {
                            VIEW_CHANNEL: false
                        });
                        await interaction.reply({ content: 'Voice channel hidden successfully.', ephemeral: true });
                    } catch (error) {
                        console.error('Error hiding voice channel:', error);
                        await interaction.reply({ content: 'Failed to hide voice channel.', ephemeral: true });
                    }
                    break;
                case 'unhideButton':
                    try {
                        await channel.permissionOverwrites.edit(message.guild.roles.everyone, {
                            VIEW_CHANNEL: true
                        });
                        await interaction.reply({ content: 'Voice channel unhidden successfully.', ephemeral: true });
                    } catch (error) {
                        console.error('Error unhiding voice channel:', error);
                        await interaction.reply({ content: 'Failed to unhide voice channel.', ephemeral: true });
                    }
                    break;
                case 'userLimitButton':
                    // Open a modal to ask for user limit
                    const modal = new Modal()
                        .setCustomId('userLimitModal')
                        .setTitle('Set User Limit');

                    const userLimitInput = new TextInputComponent()
                        .setCustomId('userLimitInput')
                        .setLabel('Max Users:')
                        .setStyle('SHORT');

                    const firstActionRow = new MessageActionRow().addComponents(userLimitInput);

                    modal.addComponents(firstActionRow);

                    await interaction.showModal(modal);

                    // Handle the modal submission
                    const collected = await interaction.awaitModalSubmit({ time: 60000 });
                    const userLimitStr = collected.fields.getTextInputValue('userLimitInput');
                    const userLimit = parseInt(userLimitStr);
                    if (!isNaN(userLimit) && userLimit > 0) {
                        try {
                            await channel.setUserLimit(userLimit);
                            await collected.reply({ content: `User limit set to ${userLimit} successfully.`, ephemeral: true });
                        } catch (error) {
                            console.error('Error setting user limit:', error);
                            await collected.reply({ content: 'Failed to set user limit.', ephemeral: true });
                        }
                    } else {
                        await collected.reply({ content: 'Invalid user limit. Please enter a valid number greater than 0.', ephemeral: true });
                    }
                    break;
                default:
                    break;
            }

            // Update the interaction message after handling interaction
            await updateInteractionMessage();
        };

        // Listen for button interactions
        client.on('interactionCreate', async (interaction) => {
            if (!interaction.isButton() && !interaction.isModalSubmit()) return;

            if (interaction.isButton()) {
                handleButtonInteraction(interaction).catch(console.error);
            } else if (interaction.isModalSubmit()) {
                if (interaction.customId === 'userLimitModal') {
                    handleButtonInteraction(interaction).catch(console.error);
                }
            }
        });

        // Function to create a new user channel when they join the voice channel
        const createUserChannel = async (member) => {
            const newVCName = `${member.user.username}'s Channel`;

            try {
                const newVC = await message.guild.channels.create(newVCName, {
                    type: 'GUILD_VOICE',
                    parent: category.id,
                    reason: `${member.user.tag} joined ${voiceChannel.name}.`
                });

                await member.voice.setChannel(newVC);

                // Update interaction message after creating user channel
                await updateInteractionMessage();
            } catch (error) {
                console.error('Error creating user channel:', error);
            }
        };

        // Listen for users joining the voice channel
        client.on('voiceStateUpdate', async (oldState, newState) => {
            // Check if someone joined the specified voice channel
            if (newState.channelId === voiceChannel.id && !oldState.channelId) {
                const member = await newState.guild.members.fetch(newState.id);
                createUserChannel(member);
            }

            // Check if someone left or disconnected from a user-created voice channel
            if (oldState.channel && oldState.channel.parentId === category.id && oldState.channel.id !== voiceChannel.id && !newState.channelId) {
                if (oldState.channel.members.size === 0) {
                    try {
                        await oldState.channel.delete();
                        console.log(`Deleted empty user-created voice channel: ${oldState.channel.name}`);
                    } catch (error) {
                        console.error('Error deleting empty user-created voice channel:', error);
                    }
                }
            }
        });

        // Function to check and delete empty user-created voice channels periodically
        const checkEmptyChannels = async () => {
            try {
                const fetchedCategory = await message.guild.channels.fetch(category.id);
                const channels = fetchedCategory.children.filter(c => c.type === 'GUILD_VOICE' && c.id !== voiceChannel.id);
                channels.forEach(async channel => {
                    if (channel.members.size === 0) {
                        try {
                            await channel.delete();
                            console.log(`Deleted empty user-created voice channel: ${channel.name}`);
                        } catch (error) {
                            console.error('Error deleting empty user-created voice channel:', error);
                        }
                    }
                });
            } catch (error) {
                console.error('Error fetching category channels:', error);
            }

            // Update the interaction message after checking empty channels
            await updateInteractionMessage();
        };

        // Run the check every 5 minutes (300000 milliseconds)
        setInterval(checkEmptyChannels, 300000); // Adjust interval as needed
    },
};