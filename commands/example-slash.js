const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  // Slash command configuration
  data: new SlashCommandBuilder()
    .setName('hello')
    .setDescription('Says hello to you!'),
  
  // Slash command execution
  async execute(interaction) {
    await interaction.reply(`👋 Hello ${interaction.user.username}!`);
  },
};
