const { MessageEmbed } = require('discord.js');

// Command
module.exports = {
    name: 'status',
    aliases: [],
    category: 'info',
    premium: false,

    run: async (client, message, args) => {
        // Get bot's status
        const status = {
            online: 'Online',
            idle: 'Idle',
            dnd: 'Do Not Disturb',
            offline: 'Offline'
        };

        const clientStatus = status[client.presence.status] || 'Unknown';

        // Get bot's activity
        const activities = client.presence.activities.map(activity => `${activity.type}: ${activity.name}`).join('\n') || 'None';

        // Get bot's device status
        const devices = client.presence.clientStatus || {};
        const deviceIcons = {
            desktop: '<:dekstop:1291745489087107153>',
            mobile: '<:Mobile:1291745539779727380>',
            web: '<a:web:1291756234692755526>'
        };

        // Function to get random device
        const getRandomDeviceStatus = () => {
            const deviceTypes = ['desktop', 'mobile', 'web'];
            const randomDevice = deviceTypes[Math.floor(Math.random() * deviceTypes.length)];
            return `${deviceIcons[randomDevice]} ${randomDevice.charAt(0).toUpperCase() + randomDevice.slice(1)}: Online`;
        };

        const deviceStatus = Object.keys(devices).map(device => `${deviceIcons[device] || ''} ${device.charAt(0).toUpperCase() + device.slice(1)}: ${status[devices[device]]}`)
            .join('\n') || getRandomDeviceStatus();

        // Create embed
        const embed = new MessageEmbed()
            .setColor('#ff5c00') // Black color
            .setTitle(' **Bot Status** ')
            .addFields(
                { name: '<a:Status:1291745832365719563> **Status** ', value: clientStatus, inline: false },
                { name: '<:Meko_Activity:1291756300224561195> **Activity** ', value: activities, inline: false },
                { name: '<:Devices:1291746292812222471> **Device** ', value: deviceStatus, inline: false }
            )
            .setTimestamp();

        // Send the embed
        await message.channel.send({ embeds: [embed] });
    }
};