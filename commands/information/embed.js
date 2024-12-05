const discord = require("discord.js");

module.exports = {
    name: "embed",
    aliases: ["emb"],
    description: "quickly embed your message with default format",
    category: "info",
    usage: "embed <message>",
    userPermissions: ["ADMINISTRATOR"],
    botPermissions: ["EMBED_LINKS", "MANAGE_MESSAGES"],

    async run(client, message, args) {
        let msg = args.join(" ");
        if (!message.member.permissions.has('ADMINISTRATOR')) {
            return message.channel.send({
                embeds: [
                    new discord.MessageEmbed({
                        description: client.emoji.fail + "| Cannot send an empty message.",
                        color: client.color
                    })
                ]
            })
        }

        message.delete();

        const embed = new discord.MessageEmbed({
            description: msg,
            color: client.color
        })
        return message.channel.send({ embeds: [embed] });
    }
};