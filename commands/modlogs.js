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
		.setName('modlogs')
		.setDescription('View moderation logs for a user')
		.addUserOption(option =>
			option.setName('user')
				.setDescription('The user to view modlogs for')
				.setRequired(true))
		.setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),
	async execute(interaction) {
		const user = interaction.options.getUser('user');
		const warnings = loadWarnings();
		const userWarnings = warnings[user.id] || [];

		if (userWarnings.length === 0) {
			return await interaction.reply(`✅ **${user.tag}** has no moderation logs.`);
		}

		const embed = new EmbedBuilder()
			.setColor('#FF0000')
			.setTitle(`Moderation Logs for ${user.tag}`)
			.setThumbnail(user.displayAvatarURL({ dynamic: true }))
			.setDescription(`Total Infractions: **${userWarnings.length}**`);

		userWarnings.forEach((warn, index) => {
			const date = new Date(warn.timestamp);
			embed.addFields({
				name: `Infraction #${index + 1}`,
				value: `**Type:** Warning\n**Reason:** ${warn.reason}\n**Moderator:** ${warn.moderator}\n**Date:** <t:${Math.floor(date.getTime() / 1000)}:F>`,
				inline: false,
			});
		});

		embed.setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() })
			.setTimestamp();

		await interaction.reply({ embeds: [embed] });
	},
};

