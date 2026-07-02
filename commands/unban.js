const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('unban')
		.setDescription('Unban a user from the server')
		.addStringOption(option =>
			option.setName('userid')
				.setDescription('The user ID to unban')
				.setRequired(true))
		.setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),
	async execute(interaction) {
		const userId = interaction.options.getString('userid');

		try {
			await interaction.guild.bans.remove(userId);
			await interaction.reply(`✅ User with ID **${userId}** has been unbanned.`);
		} catch (error) {
			await interaction.reply({ content: `❌ Failed to unban user: ${error.message}`, ephemeral: true });
		}
	},
};

