import { Client, GatewayIntentBits } from 'discord.js';

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

client.on('ready', () => {
  console.log(`✅ Logged in as ${client.user.tag}`);
  console.log(`🤖 Bot is ready and running!`);
});

client.on('messageCreate', (message) => {
  if (message.author.bot) return;
  
  if (message.content === '!ping') {
    message.reply('🏓 Pong!');
  }
});

const token = process.env.DISCORD_BOT_TOKEN;
if (!token) {
  console.error('❌ Error: DISCORD_BOT_TOKEN environment variable not set');
  console.log('Please add your Discord bot token in the Settings > Environment Variables');
  process.exit(1);
}

client.login(token).catch(err => {
  console.error('❌ Failed to login:', err.message);
  process.exit(1);
});
