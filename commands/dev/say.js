const {
    Message,
    Client,
    MessageEmbed,
    MessageActionRow,
    MessageButton
} = require('discord.js')
this.config = require(`${process.cwd()}/config.json`)

module.exports = {
    name: "say",
    category: "owner",
    aliases: [],
     run: async (client, message, args) => {
        
        if (!this.config.owner.includes(message.author.id)) return;
      
      const ankush = client.users.cache.get('239496212699545601');
  
   const sayMessage = message.content.split(' ').slice(1).join(' ');
    if (!sayMessage) {
      const me = new MessageEmbed()
        .setColor(client.color)
        .setAuthor({name: `Hey ${message.author.tag} Developed By Ankush </>`, iconURL: ankush.displayAvatarURL({dynamic: true})})
      return message.reply({embeds: [me]})
    }

    if (sayMessage) {
      message.delete();
   message.channel.send({content: `${sayMessage}`}), {
      allowedMentions: { parse: ["users"] },
    };
     }
  },
};