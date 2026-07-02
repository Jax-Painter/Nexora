const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('kick')
		.setDescription('Kick a user from the server')
		.addUserOption(option =>
			option.setName('user')
				.setDescription('The user to kick')
				.setRequired(true))
		.addStringOption(option =>
			option.setName('reason')
				.setDescription('Reason for the kick')
				.setRequired(false))
		.setDefaultMemberPermissions(PermissionFlagsBits.KickMembers),
	async execute(interaction) {
		const user = interaction.options.getUser('user');
		const reason = interaction.options.getString('reason') || 'No reason provided';

		try {
			await interaction.guild.members.kick(user, reason);
			await interaction.reply(`✅ **${user.tag}** has been kicked.\n**Reason:** ${reason}`);
		} catch (error) {
			await interaction.reply({ content: `❌ Failed to kick user: ${error.message}`, ephemeral: true });
		}
	},
};

