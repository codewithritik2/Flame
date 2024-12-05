const {
  MessageEmbed
} = require('discord.js');

module.exports = {
  name: "mute",
  aliases: ["timeout"],
  category: 'mod',
  run: async (client, message, args) => {
    if (!message.member.permissions.has("TIMEOUT_MEMBERS")) {
      return message.reply({
        embeds: [new MessageEmbed().setColor(client.color).setDescription(`${client.emoji.cross} | You must have \`Timeout Members\` permissions to use this command.`)]
      })
    }

    if (!message.guild.me.permissions.has('TIMEOUT_MEMBERS')) {
      return message.reply({
        embeds: [new MessageEmbed().setColor(client.color).setDescription(`${client.emoji.cross} | I must have \`Timeout Members\` permissions to run this command.`)]
      })
    }

    let member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
    if (!member) {
      return message.reply({
        embeds: [new MessageEmbed().setColor(client.color).setDescription(`${client.emoji.cross} | You didn't mention the member whom you want to mute.`)]
      })
    }

    const timeArg = args[1];
    const unitArg = args[2]?.toLowerCase();

    if (!timeArg || !unitArg || isNaN(timeArg)) {
      return message.reply({
        embeds: [new MessageEmbed().setColor(client.color).setDescription(`${client.emoji.cross} | Please provide a valid time and unit (minutes/hours/days). Example: \`5 minutes\``)]
      })
    }

    let minutes = 0;
    const time = parseInt(timeArg);

    if (unitArg.startsWith('minute') || unitArg === 'min' || unitArg === 'm') {
      minutes = time;
    } else if (unitArg.startsWith('hour') || unitArg === 'hr' || unitArg === 'h') {
      minutes = time * 60;
    } else if (unitArg.startsWith('day') || unitArg === 'd') {
      minutes = time * 1440;
    } else {
      return message.reply({
        embeds: [new MessageEmbed().setColor(client.color).setDescription(`${client.emoji.cross} | Please use minutes, hours, or days as time units.`)]
      })
    }

    if (minutes < 1) {
      return message.reply({
        embeds: [new MessageEmbed().setColor(client.color).setDescription(`${client.emoji.cross} | The duration must be at least 1 minute.`)]
      })
    }

    if (minutes > 43200) {
      return message.reply({
        embeds: [new MessageEmbed().setColor(client.color).setDescription(`${client.emoji.cross} | The duration cannot exceed 30 days.`)]
      })
    }

    let reason = args.slice(3).join(" ").trim();
    if (!reason) reason = "No Reason";
    const moderator = `${message.author.tag} (${message.author.id})`;
    const fullReason = `${moderator} | ${reason}`;

    const response = await timeout(message.member, member, minutes, fullReason);

    try {
      const dmEmbed = new MessageEmbed()
      .setColor(client.color)
      .setTitle('You have been muted!')
      .setDescription(`You have been muted in **${message.guild.name}**`)
      .addFields(
        {
          name: 'Moderator', value: message.author.tag, inline: true
        },
        {
          name: 'Duration', value: formatDuration(minutes), inline: true
        },
        {
          name: 'Reason', value: reason
        }
      )
      .setTimestamp();

      await member.send({
        embeds: [dmEmbed]
      }).catch(() => {
        message.channel.send(`${client.emoji.info} | Could not DM ${member.user.tag} about their mute.`);
      });
    } catch (err) {
      console.error("Failed to send DM:", err);
    }

    await message.reply(response);
  }
};

function formatDuration(minutes) {
  if (minutes < 60) return `${minutes} minute${minutes !== 1 ? 's': ''}`;
  if (minutes < 1440) {
    const hours = Math.floor(minutes / 60);
    return `${hours} hour${hours !== 1 ? 's': ''}`;
  }
  const days = Math.floor(minutes / 1440);
  return `${days} day${days !== 1 ? 's': ''}`;
}

async function timeout(issuer, target, minutes, reason) {
  const response = await timeoutTarget(issuer, target, minutes, reason);
  if (typeof response === "boolean") {
    return getEmbed(`${target.client.emoji.tick} | Successfully muted <@${target.user.id}> for ${formatDuration(minutes)}!`, target.client);
  }
  if (response === "BOT_PERM") return getEmbed(`${target.client.emoji.cross} | I do not have permission to mute <@${target.user.id}>`, target.client);
  else if (response === "MEMBER_PERM") return getEmbed(`${target.client.emoji.cross} | You do not have permission to mute <@${target.user.id}>`, target.client);
  else if (response === "ALREADY_TIMEOUT") return getEmbed(`${target.client.emoji.cross} | <@${target.user.id}> is already muted!`, target.client);
  else return getEmbed(`${target.client.emoji.cross} | I don't have enough perms to mute <@${target.user.id}>.`, target.client);
}

function memberInteract(issuer, target) {
  const {
    guild
  } = issuer;
  if (guild.ownerId === issuer.id) return true;
  if (guild.ownerId === target.id) return false;
  return issuer.roles.highest.position > target.roles.highest.position;
}

async function timeoutTarget(issuer, target, minutes, reason) {
  if (!memberInteract(issuer, target)) return "MEMBER_PERM";
  if (!memberInteract(issuer.guild.me, target)) return "BOT_PERM";
  if (target.communicationDisabledUntilTimestamp - Date.now() > 0) return "ALREADY_TIMEOUT";

  try {
    await target.timeout(minutes * 60 * 1000, reason);
    return true;
  } catch (ex) {
    console.error("Timeout error:", ex);
    return "ERROR";
  }
}

function getEmbed(title, client) {
  let embed = new MessageEmbed()
  .setColor(client.color)
  .setDescription(title)
  return {
    embeds: [embed]
  };
}
