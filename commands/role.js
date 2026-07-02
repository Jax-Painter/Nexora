const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('role')
		.setDescription('Add or remove a role from a user')
		.addSubcommand(subcommand =>
			subcommand
				.setName('add')
				.setDescription('Add a role to a user')
				.addUserOption(option =>
					option.setName('user')
						.setDescription('The user to add the role to')
						.setRequired(true))
				.addRoleOption(option =>
					option.setName('role')
						.setDescription('The role to add')
						.setRequired(true)))
		.addSubcommand(subcommand =>
			subcommand
				.setName('remove')
				.setDescription('Remove a role from a user')
				.addUserOption(option =>
					option.setName('user')
						.setDescription('The user to remove the role from')
						.setRequired(true))
				.addRoleOption(option =>
					option.setName('role')
						.setDescription('The role to remove')
						.setRequired(true)))
		.setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles),
	async execute(interaction) {
		const subcommand = interaction.options.getSubcommand();
		const user = interaction.options.getUser('user');
		const role = interaction.options.getRole('role');

		try {
			const member = await interaction.guild.members.fetch(user.id);

			if (subcommand === 'add') {
				await member.roles.add(role);
				await interaction.reply(`✅ Role **${role.name}** has been added to **${user.tag}**.`);
			} else if (subcommand === 'remove') {
				await member.roles.remove(role);
				await interaction.reply(`✅ Role **${role.name}** has been removed from **${user.tag}**.`);
			}
		} catch (error) {
			await interaction.reply({ content: `❌ Failed to manage role: ${error.message}`, ephemeral: true });
		}
	},
};

