const { Client, GatewayIntentBits, Collection, ChannelType } = require('discord.js');
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

console.log('🤖 Nexora Bot Starting...');
console.log('Environment loaded');

// Load commands
const commandsPath = path.join(__dirname, 'commands');
if (fs.existsSync(commandsPath)) {
  const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
  console.log(`📂 Found ${commandFiles.length} command files`);
  for (const file of commandFiles) {
    try {
      const filePath = path.join(commandsPath, file);
      const command = require(filePath);
      if (command.data && command.execute) {
        client.commands.set(command.data.name, command);
        console.log(`✓ Loaded command: ${command.data.name}`);
      }
    } catch (error) {
      console.error(`✗ Error loading command ${file}:`, error);
    }
  }
} else {
  console.log('📂 Commands directory not found (this is okay, add commands later)');
}

// Load events
const eventsPath = path.join(__dirname, 'events');
if (fs.existsSync(eventsPath)) {
  const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));
  console.log(`📂 Found ${eventFiles.length} event files`);
  for (const file of eventFiles) {
    try {
      const filePath = path.join(eventsPath, file);
      const event = require(filePath);
      if (event.name && event.execute) {
        if (event.once) {
          client.once(event.name, (...args) => event.execute(...args, client));
        } else {
          client.on(event.name, (...args) => event.execute(...args, client));
        }
        console.log(`✓ Loaded event: ${event.name}`);
      }
    } catch (error) {
      console.error(`✗ Error loading event ${file}:`, error);
    }
  }
} else {
  console.log('📂 Events directory not found (this is okay, add events later)');
}

// Validate token before login
if (!process.env.DISCORD_TOKEN) {
  console.error('❌ ERROR: DISCORD_TOKEN is not set in environment variables!');
  console.error('Make sure to set DISCORD_TOKEN in your Railway variables');
  process.exit(1);
}

console.log('🔐 DISCORD_TOKEN found in environment');
console.log('🌐 Connecting to Discord...');

// Login with error handling
client.login(process.env.DISCORD_TOKEN).catch(error => {
  console.error('❌ Failed to login to Discord:', error.message);
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

// Fallback ready event if not defined in events
if (!fs.existsSync(path.join(eventsPath, 'ready.js'))) {
  client.once('ready', () => {
    console.log(`✓✓✓ BOT ONLINE ✓✓✓`);
    console.log(`Logged in as: ${client.user.tag}`);
    console.log(`Bot ID: ${client.user.id}`);
    client.user.setPresence({
      status: 'online',
      activities: [{
        name: 'ERLC Servers',
        type: 'WATCHING'
      }]
    }).catch(err => console.error('Error setting presence:', err));
  });
}
