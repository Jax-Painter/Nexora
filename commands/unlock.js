const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('unlock')
		.setDescription('Unlock the channel')
		.setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),
	async execute(interaction) {
		try {
			await interaction.channel.permissionOverwrites.edit(interaction.guild.id, {
				SendMessages: null,
			});
			await interaction.reply(`🔓 Channel has been unlocked.`);
		} catch (error) {
			await interaction.reply({ content: `❌ Failed to unlock channel: ${error.message}`, ephemeral: true });
		}
	},
};

