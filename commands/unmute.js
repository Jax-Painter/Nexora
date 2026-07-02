const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('unmute')
		.setDescription('Unmute a user')
		.addUserOption(option =>
			option.setName('user')
				.setDescription('The user to unmute')
				.setRequired(true))
		.setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),
	async execute(interaction) {
		const user = interaction.options.getUser('user');

		try {
			const member = await interaction.guild.members.fetch(user.id);
			const mutedRole = interaction.guild.roles.cache.find(r => r.name === 'Muted');
			if (mutedRole) {
				await member.roles.remove(mutedRole);
			}
			await interaction.reply(`🔊 **${user.tag}** has been unmuted.`);
		} catch (error) {
			await interaction.reply({ content: `❌ Failed to unmute user: ${error.message}`, ephemeral: true });
		}
	},
};

