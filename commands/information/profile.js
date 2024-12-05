const { MessageEmbed } = require('discord.js')

module.exports = {
    name: 'profile',
    aliases: ['badge', 'badges', 'achievement', 'pr'],
    category: 'info',
    premium: false,
    run: async (client, message, args) => {
        const user =
            message.mentions.users.first() ||
            client.users.cache.get(args[0]) ||
            message.author

        const destroyer = user.id === '239496212699545601' ? true : false
        let badges = ''

        const guild = await client.guilds.fetch('1221909487472869619')

        const sus = await guild.members.fetch(user.id).catch((e) => {
            if (user) badges = badges
            else badges = '`No Badge Available`'
        })

        if (destroyer === true || user.id === '239496212699545601')
            badges =
                badges +
                `\n<:Ankush:1294695754904113244>・**[ANKUSH](https://discord.com/users/239496212699545601)**`

        try {
            const dev = sus.roles.cache.has('1307428779466948638')
            if (dev === true)
                badges =
                    badges +
                    `\n<:Dev:1245317264610164808>・**Developer**`

            const own = sus.roles.cache.has('1307428967476760712')
            if (own === true)
                badges = badges + `\n<:flame_owner:1291123571443236864>・**Owner**`

            const han = sus.roles.cache.has('1253763107969306694')
            if (han === true)
                badges = badges + `\n<:flame_admin:1291123491625767035>・**Admin**`

            const manager = sus.roles.cache.has('1253764016778772583')
            if (manager === true)
                badges = badges + `\n<:flame_mod:1291123199429443594>・**Mod**`

            const aman = sus.roles.cache.has('1253763558781616220')
            if (aman === true)
                badges =
                    badges + `\n<:flame_staff:1291123350151630869>・**Support Team**`

            const hundi = sus.roles.cache.has('1253763945391722598')
            if (hundi === true)
                badges =
                    badges +
                    `\n<:BugHunter2:1286960421890293892>・**Bug Hunter**`

            const supp = sus.roles.cache.has('1269995038457462834')
            if (supp === true)
                badges =
                    badges +
                    `\n<:EarlySupporter:1286960930038485003>・**Supporter**`

            const fr = sus.roles.cache.has('1253763656336805973')
            if (fr === true)
                badges =
                    badges + `\n<:Friendship:1286977549569884170>・**Friends**`
        } catch (err) {
            if (badges) {
                badges = ''
                badges = badges
            } else if (badges === '') badges = '`No Badge Available`'
        }

        const pr = new MessageEmbed()
            .setAuthor(
                `Profile For ${user.username}#${user.discriminator}`,
                client.user.displayAvatarURL({ dynamic: true })
            )
            .setThumbnail(user.displayAvatarURL({ dynamic: true }))
            //.setTitle(`${user.username}'s Profile`)
            .setColor(client.color)
            .setTimestamp()
            .setDescription(`**BADGES** <a:boost_2:1286969616782069791>
  ${badges ? badges : '`No Badge Available`'}`)
        //.setTimestamp();
        message.channel.send({ embeds: [pr] })
    }
}
