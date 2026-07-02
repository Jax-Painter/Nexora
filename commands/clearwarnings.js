const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const fs = require('fs');
const path = require('path');

const warningsFile = path.join(__dirname, '../data/warnings.json');

function loadWarnings() {
	if (!fs.existsSync(warningsFile)) {
		return {};
	}
	return JSON.parse(fs.readFileSync(warningsFile, 'utf8'));
}

function saveWarnings(warnings) {
	fs.writeFileSync(warningsFile, JSON.stringify(warnings, null, 2));
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName('clearwarnings')
		.setDescription('Clear all warnings for a user')
		.addUserOption(option =>
			option.setName('user')
				.setDescription('The user to clear warnings for')
				.setRequired(true))
		.setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),
	async execute(interaction) {
		const user = interaction.options.getUser('user');
		const warnings = loadWarnings();

		if (!warnings[user.id]) {
			return await interaction.reply(`✅ **${user.tag}** has no warnings to clear.`);
		}

		delete warnings[user.id];
		saveWarnings(warnings);

		await interaction.reply(`✅ All warnings for **${user.tag}** have been cleared.`);
	},
};

