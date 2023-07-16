const { getConfig } = require('@confly-dev/confly-js')
const JSON_config = require('./config.json')
const discord = require('discord.js')
const client = new discord.Client({intents: [discord.IntentsBitField.Flags.Guilds, discord.IntentsBitField.Flags.GuildMessages]})


client.on('ready', async () => {
    let configs = await getConfigs()
    let statuses = configs.botStatus?.split('\n').map(status => ({name: status}))
    let i = 0;

    console.log(`${statuses.length} status found!`)

    setInterval(async () => {
        configs = await getConfigs()
        i++
        if(i == statuses.length) i = 0

        client.user.setPresence({activities: [statuses[i]], status: 'online' })
    }, 15000); // 15 seconds

    // botStatus is a string with multiple lines (separated by \n) that will be randomly selected as the bot's status

    client.user.setUsername(configs.botName)
    console.log(`Logged in as ${client.user.tag}!`)
    
})

client.on('messageCreate', async (msg) => {
    let configs = await getConfigs()
    if (msg.author.bot) return

    msg.reply({
        embeds: [
            new discord.EmbedBuilder()
            .setTitle('Hello!')
            .setDescription('This is an example of a message sent by a bot using Confly!')
            .setColor(configs.embedColor)
        ]
            
    })
})


client.login(JSON_config.discord_token)

async function getConfigs() {
    return await getConfig(JSON_config.confly_token)
}