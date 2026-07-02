const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

const warningsFile = path.join(__dirname, '../data/warnings.json');

function loadWarnings() {
	if (!fs.existsSync(warningsFile)) {
		return {};
	}
	return JSON.parse(fs.readFileSync(warningsFile, 'utf8'));
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName('warnings')
		.setDescription('View warnings for a user')
		.addUserOption(option =>
			option.setName('user')
				.setDescription('The user to check warnings for')
				.setRequired(true))
		.setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),
	async execute(interaction) {
		const user = interaction.options.getUser('user');
		const warnings = loadWarnings();
		const userWarnings = warnings[user.id] || [];

		if (userWarnings.length === 0) {
			return await interaction.reply(`✅ **${user.tag}** has no warnings.`);
		}

		const embed = new EmbedBuilder()
			.setColor('#FFA500')
			.setTitle(`Warnings for ${user.tag}`)
			.setDescription(`Total Warnings: **${userWarnings.length}**`);

		userWarnings.forEach((warn, index) => {
			embed.addFields({
				name: `Warning #${index + 1}`,
				value: `**Reason:** ${warn.reason}\n**Moderator:** ${warn.moderator}\n**Date:** ${new Date(warn.timestamp).toLocaleString()}`,
				inline: false,
			});
		});

		await interaction.reply({ embeds: [embed] });
	},
};

