const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('serverinfo')
		.setDescription('Display information about the server'),
	async execute(interaction) {
		const guild = interaction.guild;

		const embed = new EmbedBuilder()
			.setColor('#0099ff')
			.setTitle(`${guild.name} Server Information`)
			.setThumbnail(guild.iconURL({ dynamic: true }))
			.addFields(
				{ name: 'Server ID', value: guild.id, inline: true },
				{ name: 'Owner', value: `<@${guild.ownerId}>`, inline: true },
				{ name: 'Created', value: `<t:${Math.floor(guild.createdTimestamp / 1000)}:F>`, inline: true },
				{ name: 'Members', value: `${guild.memberCount}`, inline: true },
				{ name: 'Roles', value: `${guild.roles.cache.size}`, inline: true },
				{ name: 'Channels', value: `${guild.channels.cache.size}`, inline: true },
				{ name: 'Verification Level', value: guild.verificationLevel.toString(), inline: true },
				{ name: 'Boost Level', value: `${guild.premiumTier}`, inline: true },
				{ name: 'Boosts', value: `${guild.premiumSubscriptionCount}`, inline: true },
			)
			.setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() })
			.setTimestamp();

		await interaction.reply({ embeds: [embed] });
	},
};

