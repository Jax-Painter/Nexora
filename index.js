const { Client, GatewayIntentBits, Collection } = require('discord.js');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

console.log('='.repeat(50));
console.log('🤖 NEXORA BOT STARTING');
console.log('='.repeat(50));
console.log(`Timestamp: ${new Date().toISOString()}`);
console.log(`Node Version: ${process.version}`);
console.log('');

// Check environment variables
console.log('📋 Environment Variables:');
console.log(`DISCORD_TOKEN: ${process.env.DISCORD_TOKEN ? '✓ SET' : '✗ NOT SET'}`);
console.log(`CLIENT_ID: ${process.env.CLIENT_ID ? '✓ SET' : '✗ NOT SET'}`);
console.log('');

// Validate token before creating client
if (!process.env.DISCORD_TOKEN) {
  console.error('❌ CRITICAL: DISCORD_TOKEN is not set!');
  process.exit(1);
}

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

console.log('✓ Discord.js Client created');
console.log('✓ Intents configured');
console.log('');

// Load commands
const commandsPath = path.join(__dirname, 'commands');
console.log(`📂 Loading commands from: ${commandsPath}`);
if (fs.existsSync(commandsPath)) {
  const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
  console.log(`   Found ${commandFiles.length} command files`);
  for (const file of commandFiles) {
    try {
      const filePath = path.join(commandsPath, file);
      const command = require(filePath);
      if (command.data && command.execute) {
        client.commands.set(command.data.name, command);
        console.log(`   ✓ Loaded: ${command.data.name}`);
      }
    } catch (error) {
      console.error(`   ✗ Error loading ${file}:`, error.message);
    }
  }
} else {
  console.log('   Directory does not exist yet (ok for now)');
}
console.log('');

// Load events
const eventsPath = path.join(__dirname, 'events');
console.log(`📂 Loading events from: ${eventsPath}`);
if (fs.existsSync(eventsPath)) {
  const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));
  console.log(`   Found ${eventFiles.length} event files`);
  for (const file of eventFiles) {
    try {
      const filePath = path.join(eventsPath, file);
      const event = require(filePath);
      if (event.name && event.execute) {
        if (event.once) {
          client.once(event.name, (...args) => event.execute(...args, client));
          console.log(`   ✓ Loaded (once): ${event.name}`);
        } else {
          client.on(event.name, (...args) => event.execute(...args, client));
          console.log(`   ✓ Loaded: ${event.name}`);
        }
      }
    } catch (error) {
      console.error(`   ✗ Error loading ${file}:`, error.message);
    }
  }
} else {
  console.log('   Directory does not exist yet (ok for now)');
}
console.log('');

// Event listeners
client.on('error', error => {
  console.error('❌ CLIENT ERROR:', error);
});

client.on('warn', warning => {
  console.warn('⚠️  WARNING:', warning);
});

// Ready event - fires when bot connects
client.once('ready', () => {
  console.log('='.repeat(50));
  console.log('✓✓✓ BOT IS NOW ONLINE ✓✓✓');
  console.log('='.repeat(50));
  console.log(`Username: ${client.user.username}`);
  console.log(`Tag: ${client.user.tag}`);
  console.log(`Bot ID: ${client.user.id}`);
  console.log(`Guilds: ${client.guilds.cache.size}`);
  console.log('');
  
  // Set bot status
  client.user.setPresence({
    status: 'online',
    activities: [{
      name: 'ERLC Servers',
      type: 'WATCHING'
    }]
  }).catch(err => console.error('Could not set presence:', err.message));
});

// Interaction handler
client.on('interactionCreate', async (interaction) => {
  if (!interaction.isChatInputCommand()) return;
  
  const command = client.commands.get(interaction.commandName);
  if (!command) return;

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error('Error executing command:', error);
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({ content: 'There was an error executing this command!', ephemeral: true });
    } else {
      await interaction.reply({ content: 'There was an error executing this command!', ephemeral: true });
    }
  }
});

// Global error handlers
process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', error => {
  console.error('❌ Uncaught Exception:', error);
  process.exit(1);
});

// Login
console.log('🔐 Attempting to login...');
console.log('Token (first 10 chars):', process.env.DISCORD_TOKEN.substring(0, 10) + '...');
console.log('');

client.login(process.env.DISCORD_TOKEN)
  .then(() => {
    console.log('✓ Login successful, waiting for ready event...');
  })
  .catch(error => {
    console.error('❌ LOGIN FAILED:', error.message);
    console.error('Possible causes:');
    console.error('  1. Invalid token');
    console.error('  2. Token is revoked');
    console.error('  3. Network error');
    process.exit(1);
  });

// Keep process running
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down...');
  client.destroy();
  process.exit(0);
});
