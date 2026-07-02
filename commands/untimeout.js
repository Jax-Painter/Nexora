const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('untimeout')
		.setDescription('Remove timeout from a user')
		.addUserOption(option =>
			option.setName('user')
				.setDescription('The user to remove timeout from')
				.setRequired(true))
		.setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),
	async execute(interaction) {
		const user = interaction.options.getUser('user');

		try {
			const member = await interaction.guild.members.fetch(user.id);
			await member.timeout(null);
			await interaction.reply(`✅ Timeout removed from **${user.tag}**.`);
		} catch (error) {
			await interaction.reply({ content: `❌ Failed to remove timeout: ${error.message}`, ephemeral: true });
		}
	},
};

