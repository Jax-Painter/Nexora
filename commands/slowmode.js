const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('slowmode')
		.setDescription('Set slowmode for the channel')
		.addIntegerOption(option =>
			option.setName('seconds')
				.setDescription('Slowmode duration in seconds (0 to disable)')
				.setRequired(true)
				.setMinValue(0)
				.setMaxValue(21600))
		.setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),
	async execute(interaction) {
		const seconds = interaction.options.getInteger('seconds');

		try {
			await interaction.channel.setRateLimitPerUser(seconds);
			if (seconds === 0) {
				await interaction.reply(`✅ Slowmode has been disabled.`);
			} else {
				await interaction.reply(`⏱️ Slowmode set to **${seconds}** seconds.`);
			}
		} catch (error) {
			await interaction.reply({ content: `❌ Failed to set slowmode: ${error.message}`, ephemeral: true });
		}
	},
};

