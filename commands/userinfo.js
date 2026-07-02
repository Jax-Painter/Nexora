const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('userinfo')
		.setDescription('Display information about a user')
		.addUserOption(option =>
			option.setName('user')
				.setDescription('The user to get info about')
				.setRequired(false)),
	async execute(interaction) {
		const user = interaction.options.getUser('user') || interaction.user;
		const member = await interaction.guild.members.fetch(user.id).catch(() => null);

		const embed = new EmbedBuilder()
			.setColor('#0099ff')
			.setTitle(`${user.tag} User Information`)
			.setThumbnail(user.displayAvatarURL({ dynamic: true }))
			.addFields(
				{ name: 'User ID', value: user.id, inline: true },
				{ name: 'Account Created', value: `<t:${Math.floor(user.createdTimestamp / 1000)}:F>`, inline: true },
				{ name: 'Bot', value: user.bot ? 'Yes' : 'No', inline: true },
			);

		if (member) {
			embed.addFields(
				{ name: 'Joined Server', value: `<t:${Math.floor(member.joinedTimestamp / 1000)}:F>`, inline: true },
				{ name: 'Nickname', value: member.nickname || 'None', inline: true },
				{ name: 'Roles', value: member.roles.cache.size > 1 ? member.roles.cache.map(r => r.toString()).join(', ') : 'None', inline: false },
			);
		}

		embed.setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() })
			.setTimestamp();

		await interaction.reply({ embeds: [embed] });
	},
};

