const { MessageActionRow, MessageButton, MessageEmbed } = require("discord.js");

function createCodeEmbed(client) {
  const embed = new MessageEmbed()
    .setColor(client.color)
    .setAuthor(client.user.tag, client.user.displayAvatarURL())
    .setDescription("Click the button below.");

  return embed;
}

function createCodeButton() {
  const button = new MessageActionRow().addComponents(
    new MessageButton()
      .setLabel("Instagram")
      .setStyle("LINK")
      .setURL(`https://www.instagram.com/ankush_26025/profilecard/?igsh=MTd3enViN3Uyb2RqbQ==`)
  );

  return button;
}

module.exports = {
  name: "instagram",
  category: 'info',
  aliases: ['ig'],
  run: async (client, message, args) => {
    const embed = createCodeEmbed(client);
    const button = createCodeButton();
      
    message.channel.send({ embeds: [embed], components: [button] });
  },
};