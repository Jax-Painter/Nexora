const { Client, GatewayIntentBits, Collection } = require('discord.js');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.DirectMessages,
  ],
});

client.commands = new Collection();
client.cooldowns = new Collection();

// Load commands
const commandsPath = path.join(__dirname, 'commands');
if (fs.existsSync(commandsPath)) {
  const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
  console.log(`Loading ${commandFiles.length} commands...`);
  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    if (command.data && command.execute) {
      client.commands.set(command.data.name, command);
      console.log(`✓ Loaded command: ${command.data.name}`);
    }
  }
} else {
  console.warn('⚠ Commands directory does not exist');
}

// Load events
const eventsPath = path.join(__dirname, 'events');
if (fs.existsSync(eventsPath)) {
  const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));
  console.log(`Loading ${eventFiles.length} events...`);
  for (const file of eventFiles) {
    const filePath = path.join(eventsPath, file);
    const event = require(filePath);
    if (event.once) {
      client.once(event.name, (...args) => event.execute(...args, client));
    } else {
      client.on(event.name, (...args) => event.execute(...args, client));
    }
    console.log(`✓ Loaded event: ${event.name}`);
  }
} else {
  console.warn('⚠ Events directory does not exist');
}

// Error handling for login
if (!process.env.DISCORD_TOKEN) {
  console.error('❌ DISCORD_TOKEN is not set in environment variables!');
  process.exit(1);
}

console.log('🤖 Attempting to log in to Discord...');
client.login(process.env.DISCORD_TOKEN).catch(error => {
  console.error('❌ Failed to login:', error);
  process.exit(1);
});

// Global error handlers
process.on('unhandledRejection', error => {
  console.error('❌ Unhandled Promise Rejection:', error);
});

process.on('uncaughtException', error => {
  console.error('❌ Uncaught Exception:', error);
  process.exit(1);
});

// Listen for ready event if not in events folder
client.once('ready', () => {
  console.log(`✓ Bot is online as ${client.user.tag}`);
});
