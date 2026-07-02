const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('nexoraplus')
		.setDescription('View information about Nexora+'),
	async execute(interaction) {
		const embed = new EmbedBuilder()
			.setColor('#FFD700')
			.setTitle('Nexora+ Information')
			.setDescription('Premium features coming soon!')
			.addFields(
				{ name: 'Status', value: 'Coming Soon', inline: false },
			)
			.setFooter({ text: 'More information will be added soon', iconURL: interaction.client.user.displayAvatarURL() })
			.setTimestamp();

		await interaction.reply({ embeds: [embed] });
	},
};

