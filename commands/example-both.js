const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  // Slash command configuration
  data: new SlashCommandBuilder()
    .setName('echo')
    .setDescription('Repeats what you say')
    .addStringOption(option => 
      option.setName('text')
        .setDescription('Text to echo')
        .setRequired(true)
    ),
  
  // Slash command execution
  async execute(interaction) {
    const text = interaction.options.getString('text');
    await interaction.reply(`🔊 ${text}`);
  },
  
  // Prefix command configuration
  prefix: 'echo',
  
  // Prefix command execution
  async executePrefix(message, args) {
    if (args.length === 0) {
      return message.reply('❌ Please provide text to echo!');
    }
    const text = args.join(' ');
    message.reply(`🔊 ${text}`);
  },
};
