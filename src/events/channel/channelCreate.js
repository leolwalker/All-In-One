
const { EmbedBuilder } = require("discord.js");
const { getSettings } = require("@schemas/Guild");

/**
 * @param {import('@src/structures').BotClient} client
 * @param {import('discord.js').GuildChannel} channel
 */
module.exports = async (client, channel) => {
  if (!channel.guild) return;

  const settings = await getSettings(channel.guild);
  if (!settings.modlog_channel) return;

  const logChannel = channel.guild.channels.cache.get(settings.modlog_channel);
  if (!logChannel) return;

  const embed = new EmbedBuilder()
    .setTitle("Channel Created")
    .setDescription(
      `**Name:** ${channel.name}\n` +
      `**Type:** ${channel.type}\n` +
      `**Category:** ${channel.parent?.name || "None"}`
    )
    .setFooter({ text: `Channel ID: ${channel.id}` })
    .setTimestamp()
    .setColor(settings.embed_color);

  logChannel.send({ embeds: [embed] }).catch(() => {});
};
