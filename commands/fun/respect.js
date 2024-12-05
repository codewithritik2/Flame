const Discord = require("discord.js");

module.exports = {
  name: "respect",
  category: "fun",
  description: "Returns Random Respect GIF",
  botPerms: ["EMBED_LINKS"],
  run: async (client, message, args) => {
    const user = message.mentions.members.first();
    if (!user) {
      return message.channel.send("You need to mention someone");
    }
    var gif = [
      `https://images-ext-1.discordapp.net/external/zmTW6ksH5W-8KeVMuk_MraO8fX0CELelamRjDTXK448/https/media.tenor.com/images/0eb1f1ff68936dbde97bebfa4145e6f0/tenor.gif?width=275&height=148`,
      `https://images-ext-1.discordapp.net/external/7Yx906bZqFB6NI14AZyrKT9RuRECMx72LV3XoKbnZJ0/https/media.tenor.com/images/aff79a052e44a086ae473277d7da8a16/tenor.gif?width=275&height=297`,
      `https://images-ext-1.discordapp.net/external/lsa-s32wJkUjqQmfVufUAw2oCpGdWBkHNVyJVc04VIs/https/media.tenor.com/images/81e0044564919b3804681952f4191621/tenor.gif?width=275&height=133`,
      `https://images-ext-1.discordapp.net/external/pS6lDsP0t8lzJZBKgSZ4iXe5ErtdWYnm9shsWgCPTFc/https/media.tenor.com/images/67e34fd8928748888c93894e0fc07c1d/tenor.gif?width=275&height=152`,
      `https://images-ext-1.discordapp.net/external/jTKzyoCYwG59GEIKIm3Ip6CctSSJPQAGk1ry_TsvsB8/https/media.tenor.com/images/6c6d4aef595b236fa1e925ab1ab43502/tenor.gif?width=275&height=130`,
      `https://images-ext-1.discordapp.net/external/YqWm2SEbbKZ253bbQbwwxWO7RyMTOntw1ozNcKBo3S4/https/media.tenor.com/images/045b1c2e205826ccc7418bb13cc1bcd7/tenor.gif?width=275&height=155`,
      `https://images-ext-1.discordapp.net/external/MTG2I-s6cXsktCg-U8a6d3BPsZoDPFmuekAtjiq-i5E/https/media.tenor.com/images/e56d320cdc20d4f8602be39b4e460d49/tenor.gif?width=275&height=235`,
      `https://images-ext-1.discordapp.net/external/hIo4TxXAwNrk7L9A5a2eOAXAeyLfRPJgRvA5evP-HF0/https/media.tenor.com/images/cb6989d452a97107bcff9e6aa8c4ba3d/tenor.gif?width=275&height=176`,
      `https://images-ext-1.discordapp.net/external/OGnGf8aG-c9W8GBcOKmv-i420B8WNll3JZbMJogabPo/https/media.tenor.com/images/a697ff336053aa2eb4d9ed9a8b8526ea/tenor.gif?width=275&height=155`,
      `https://images-ext-1.discordapp.net/external/xNMFeTV4hBQz2zKQKG0XgyDsVJuDqHK19xGjQz1LBXY/https/media.tenor.com/images/4363c864b009e851dacc13b259a9d75c/tenor.gif?width=275&height=275`,
      `https://images-ext-1.discordapp.net/external/aRmZnyEmqTObapINNFWlGB-BkRhKRl53hqWLz7dZO9Q/https/media.tenor.com/images/d73aac94ff4e9b22a94a223ffd9ec651/tenor.gif?width=275&height=208`,
    ];
    const embed = new Discord.MessageEmbed()
      .setTitle(`${message.author.username} respects ${user.displayName}`)
      .setImage(`${gif[Math.floor(Math.random() * gif.length)]}`)
      .setColor('#ff5c00');

    message.channel.send({embeds: [embed]});
  },
};