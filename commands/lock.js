const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('lock')
		.setDescription('Lock the channel (prevent @everyone from sending messages)')
		.addStringOption(option =>
			option.setName('reason')
				.setDescription('Reason for locking')
				.setRequired(false))
		.setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),
	async execute(interaction) {
		const reason = interaction.options.getString('reason') || 'No reason provided';

		try {
			await interaction.channel.permissionOverwrites.edit(interaction.guild.id, {
				SendMessages: false,
			});
			await interaction.reply(`🔒 Channel has been locked.\n**Reason:** ${reason}`);
		} catch (error) {
			await interaction.reply({ content: `❌ Failed to lock channel: ${error.message}`, ephemeral: true });
		}
	},
};

