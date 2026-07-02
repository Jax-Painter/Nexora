const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('timeout')
		.setDescription('Timeout a user (prevent them from sending messages)')
		.addUserOption(option =>
			option.setName('user')
				.setDescription('The user to timeout')
				.setRequired(true))
		.addIntegerOption(option =>
			option.setName('duration')
				.setDescription('Duration in minutes (max 40320)')
				.setRequired(true)
				.setMinValue(1)
				.setMaxValue(40320))
		.addStringOption(option =>
			option.setName('reason')
				.setDescription('Reason for the timeout')
				.setRequired(false))
		.setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),
	async execute(interaction) {
		const user = interaction.options.getUser('user');
		const duration = interaction.options.getInteger('duration');
		const reason = interaction.options.getString('reason') || 'No reason provided';

		try {
			const member = await interaction.guild.members.fetch(user.id);
			await member.timeout(duration * 60 * 1000, reason);
			await interaction.reply(`⏱️ **${user.tag}** has been timed out for **${duration}** minutes.\n**Reason:** ${reason}`);
		} catch (error) {
			await interaction.reply({ content: `❌ Failed to timeout user: ${error.message}`, ephemeral: true });
		}
	},
};

