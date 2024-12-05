const { MessageEmbed } = require("discord.js");
const moment = require("moment");
const BADGES = {
  DISCORD_EMPLOYEE: '<:discord_employee:1286960101281763431>',
  DISCORD_PARTNER: '<:partners:1286960221343973457>',
  BUGHUNTER_LEVEL_1: '<:bug_hunter:1286960328629813341>',
  BUGHUNTER_LEVEL_2: '<:BugHunter2:1286960421890293892>',
  HYPESQUAD_EVENTS: '<:hypesquad_events:1286960507495911517>',
  HOUSE_BRAVERY: '<:bravery:1286960721695080552>',
  HOUSE_BRILLIANCE: '<:brilliance:1286960633987862619>',
  HOUSE_BALANCE: '<:balance:1286960846890598504>',
  EARLY_SUPPORTER: '<:EarlySupporter:1286960930038485003>',
  TEAM_USER: '<:TEAM_USER:1286961014205845515>',
  SYSTEM: '<:system:1289272305356374099>',
  VERIFIED_BOT: '<:VerifiedBot:1286961118643753005>',
  VERIFIED_DEVELOPER: '<a:bot_developer:1286961333958610974>',
  ACTIVE_DEVELOPER: '<:active_developer:1289271988640288768>'
};

module.exports = {
  name: "userinfo",
  aliases: ["ui"],
  category: "info",
  description: "Get information about a user.",
  run: async (client, message, args) => {
    try {
      let user;
      if (!args[0]) {
        user = message.author;
      } else {
        // Try to fetch user by mention or ID
        user = message.mentions.users.first() || 
               await client.users.fetch(args[0]).catch(() => null);
      }

      if (!user) {
        // Create a system embed for user not found
        const systemEmbed = new MessageEmbed()
          .setColor('#ff5c00')
          .setTitle('⚠️ User Not Found')
          .setDescription('Unable to retrieve user information.')
          .addFields(
            { 
              name: 'Possible Reasons', 
              value: '• User does not exist\n• Invalid User ID\n• User is not in any shared server' 
            },
            { 
              name: 'Troubleshooting', 
              value: '• Check the User ID\n• Ensure the user is in a server with the bot\n• Try mentioning the user' 
            }
          )
          .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL({ dynamic: true }));

        return message.channel.send({ embeds: [systemEmbed] });
      }

      // Fetch member information (if in the guild)
      const member = message.guild.members.cache.get(user.id);

      // Process user badges
      const badges = user.flags?.toArray().map(flag => BADGES[flag] || '').join(' ') || '<:cross:1277611886820593780> No Badges';

      // Create main user info embed
      const embed = new MessageEmbed()
        .setColor('#ff5c00')
        .setAuthor(`${user.tag}'s Information`, user.displayAvatarURL({ dynamic: true }))
        .setThumbnail(user.displayAvatarURL({ dynamic: true }))
        .addFields(
          {
            name: '__General Information__', 
            value: `**Username**: ${user.username}\n**User ID**: ${user.id}\n**Bot?**: ${user.bot ? 'Yes': 'No'}\n**Discord Badges**: ${badges}\n**Account Created**: ${moment(user.createdAt).format('llll')}`
          },
          {
            name: '__Server Information__', 
            value: member 
              ? `**Nickname**: ${member.nickname || 'None'}\n**Joined Server**: ${moment(member.joinedAt).format('llll')}` 
              : 'User is not in this server.'
          },
          {
            name: '__Roles Info__', 
            value: member 
              ? `**Highest Role**: ${member.roles.highest}\n**Roles [${member.roles.cache.size}]:** ${member.roles.cache.size > 0 
                  ? member.roles.cache.sort((a, b) => b.position - a.position).map(role => `<@&${role.id}>`).join(', ') 
                  : 'No Roles'}` 
              : 'N/A'
          },
          {
            name: '__Key Permissions__', 
            value: member 
              ? `${member.permissions.toArray().sort().join(', ')}` 
              : 'N/A'
          },
          {
            name: '__Acknowledgement__', 
            value: member && member.user.id === message.guild.ownerId 
              ? 'Server Owner' 
              : 'Server Member'
          }
        )
        .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL({ dynamic: true }));

      message.channel.send({ embeds: [embed] });
    } catch (error) {
      // Handle any unexpected errors
      console.error('User Info Command Error:', error);
      const errorEmbed = new MessageEmbed()
        .setColor('#ff5c00')
        .setTitle('⚠️ System Error')
        .setDescription('An unexpected error occurred while fetching user information.')
        .addField('Error Details', error.message)
        .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL({ dynamic: true }));

      message.channel.send({ embeds: [errorEmbed] });
    }
  },
};