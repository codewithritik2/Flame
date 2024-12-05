const { MessageEmbed } = require("discord.js");


module.exports = {
  name: "gay",
  category: 'fun',
  aliases: ['gay'],
  run: async (client, message, args) => {
    let user = message.mentions.members.first() ||
               message.guild.members.cache.get(args[0]) ||
               message.member;
    
    const ID = user.user.id;

    let rng = Math.floor(Math.random() * 100) + 1;

    const howgayembed = new MessageEmbed()
      .setAuthor(user.user.username, user.user.displayAvatarURL({ dynamic: true }))
      .setDescription(`<@${ID}> is ` + rng + "% Gay🌈")
      .setColor('#ff5c00'); // Replace with your desired embed color or use client.color

    message.channel.send({ embeds: [howgayembed] });
  },
};