module.exports = async (client) => {
    client.on('ready', async () => {
        client.user.setPresence({
            activities: [
                {
                    name: `SecuringYourServer`,
                    type: `WATCHING`
                }
            ],
            status: `online`
        })
        client.logger.log(`Logged in to ${client.user.tag}`, 'ready')
    })

}
