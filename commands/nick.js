const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('nick')
		.setDescription('Change a user\'s nickname')
		.addUserOption(option =>
			option.setName('user')
				.setDescription('The user to change nickname for')
				.setRequired(true))
		.addStringOption(option =>
			option.setName('nickname')
				.setDescription('The new nickname (leave empty to reset)')
				.setRequired(false))
		.setDefaultMemberPermissions(PermissionFlagsBits.ManageNicknames),
	async execute(interaction) {
		const user = interaction.options.getUser('user');
		const nickname = interaction.options.getString('nickname') || null;

		try {
			const member = await interaction.guild.members.fetch(user.id);
			await member.setNickname(nickname);
			if (nickname) {
				await interaction.reply(`✅ **${user.tag}**'s nickname has been changed to **${nickname}**.`);
			} else {
				await interaction.reply(`✅ **${user.tag}**'s nickname has been reset.`);
			}
		} catch (error) {
			await interaction.reply({ content: `❌ Failed to change nickname: ${error.message}`, ephemeral: true });
		}
	},
};

