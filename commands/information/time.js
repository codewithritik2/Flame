const { MessageEmbed } = require(`discord.js`);

module.exports = {
  name: "time",
  description: `displays current date and time`,
  userPermissions: [],
  botPermissions: [],
  category: "info",
  cooldown: 5,

  run: async (client, message, args, prefix) => {
    // Code


    message.delete()

    let date_ob = new Date();

    let date = date_ob.toLocaleString('en-IN', { timeZone: 'IST' });
    let arg = date.split(",")
    let emb = new MessageEmbed()
      .setTitle("DATE AND TIME [IST]")
      .addFields(
        {
        name:"Current Date :", 
        value:`╰-𒆕 ` + arg[0]
      },
      {
      name:"Current Time :",
        value:`╰-𒆕 ` + arg[1]
      })
      .setThumbnail(message.guild.iconURL({ dynamic: true }))
      .setColor("RANDOM")

    message.channel.send({ embeds: [emb] })



  }
}