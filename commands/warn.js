const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const fs = require('fs');
const path = require('path');

const warningsFile = path.join(__dirname, '../data/warnings.json');

function loadWarnings() {
	if (!fs.existsSync(path.dirname(warningsFile))) {
		fs.mkdirSync(path.dirname(warningsFile), { recursive: true });
	}
	if (!fs.existsSync(warningsFile)) {
		fs.writeFileSync(warningsFile, '{}');
	}
	return JSON.parse(fs.readFileSync(warningsFile, 'utf8'));
}

function saveWarnings(warnings) {
	fs.writeFileSync(warningsFile, JSON.stringify(warnings, null, 2));
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName('warn')
		.setDescription('Warn a user')
		.addUserOption(option =>
			option.setName('user')
				.setDescription('The user to warn')
				.setRequired(true))
		.addStringOption(option =>
			option.setName('reason')
				.setDescription('Reason for the warning')
				.setRequired(false))
		.setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),
	async execute(interaction) {
		const user = interaction.options.getUser('user');
		const reason = interaction.options.getString('reason') || 'No reason provided';

		const warnings = loadWarnings();
		const userId = user.id;

		if (!warnings[userId]) {
			warnings[userId] = [];
		}

		warnings[userId].push({
			reason,
			timestamp: new Date().toISOString(),
			moderator: interaction.user.tag,
		});

		saveWarnings(warnings);

		const warnCount = warnings[userId].length;
		await interaction.reply(`⚠️ **${user.tag}** has been warned.\n**Reason:** ${reason}\n**Total Warnings:** ${warnCount}`);
	},
};

