const prefix = process.env.prefix || '&'
const status = `${prefix}help`;


module.exports = {
  bot: {
    info: {
      prefix: process.env.prefix || '&',
      token: process.env.token,
      invLink: 'https://discord.gg/hBvdRJgXzM',
    },
    options: {
      founders: ['239496212699545601'],
      privateMode: false,
    },
    presence: {
      name: process.env.statusText || status,
      type: 'streaming',
      url: 'https://twitch.tv/phv08'
    },
    credits: {
      developerId: '239496212699545601',
      developer: 'Ankush',
    }
  }
}