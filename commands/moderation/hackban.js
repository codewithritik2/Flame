const { MessageEmbed } = require("discord.js")

module.exports = {
    name : "hackban",
    aliases : ["hb"],
    category : 'mod',
    run : async(client,message,args,prefix) => {
        if(!args[0])
        {
            return message.channel.send({embeds : [new MessageEmbed().setColor('#ff5c00').setDescription(`${client.emoji.cross} | Command Usage : \`${prefix}hackban <user> [reason]\``)]})
        }
        let user = args[0] || message.guild.members.cache.get(args[0]) || message.mentions.members.first();
        let reason = args.slice(1).join(' ');
        if(!reason) reason = `No reason given`;
        if(!user) return message.channel.send({embeds : [new MessageEmbed().setColor('#ff5c00').setDescription(`${client.emoji.cross} | Please provide me a valid user.`)]});
        if(user.id === message.guild.ownerId) return message.channel.send({embeds : [new MessageEmbed().setColor('#ff5c00').setDescription(`${client.emoji.cross} | You cannot touch even Server Owner.`)]})
        if(client.config.owner.includes(user.id)) return message.channel.send({embeds : [new MessageEmbed().setColor('#ff5c00').setDescription(`${client.emoji.cross} | I cannot **HACK** and **BAN** my owner.`)]})
        if(user.id === message.member.id) return message.channel.send({embeds : [new MessageEmbed().setColor('#ff5c00').setDescription(`${client.emoji.cross} | You cannot perform this hack on yourself.`)]})
        
        message.guild.members.ban(user,{reason : `${message.author.tag} | ${reason}`}).then(ban => {
            return message.channel.send({embeds : [new MessageEmbed().setColor('#ff5c00').setDescription(`${client.emoji.tick} | SuccessFully **Hacked** and **Banned** <@${user}> exectued by : ${message.author.tag}\n${client.emoji.arrow} Reason : ${reason}`)]});
        })
    }
}