const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('server')
    .setDescription('Get ERLC server info')
    .addStringOption(option =>
      option
        .setName('servername')
        .setDescription('The ERLC server name')
        .setRequired(true)
    ),
  async execute(interaction) {
    const serverName = interaction.options.getString('servername');
    // TODO: Implement actual ERLC server lookup
    await interaction.reply(`Fetching info for server: **${serverName}**`);
  },
};

