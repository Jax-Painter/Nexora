const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('mute')
		.setDescription('Mute a user (remove send messages permission)')
		.addUserOption(option =>
			option.setName('user')
				.setDescription('The user to mute')
				.setRequired(true))
		.addStringOption(option =>
			option.setName('reason')
				.setDescription('Reason for the mute')
				.setRequired(false))
		.setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),
	async execute(interaction) {
		const user = interaction.options.getUser('user');
		const reason = interaction.options.getString('reason') || 'No reason provided';

		try {
			const member = await interaction.guild.members.fetch(user.id);
			await member.roles.add(interaction.guild.roles.cache.find(r => r.name === 'Muted') || 
				await interaction.guild.roles.create({ name: 'Muted', permissions: [] }));
			await interaction.reply(`🔇 **${user.tag}** has been muted.\n**Reason:** ${reason}`);
		} catch (error) {
			await interaction.reply({ content: `❌ Failed to mute user: ${error.message}`, ephemeral: true });
		}
	},
};

