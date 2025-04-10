
const { EmbedBuilder } = require("discord.js");
const { getSettings } = require("@schemas/Guild");

/**
 * @param {import('@src/structures').BotClient} client
 * @param {import('discord.js').Message} oldMessage
 * @param {import('discord.js').Message} newMessage
 */
module.exports = async (client, oldMessage, newMessage) => {
  if (!oldMessage.guild || !newMessage.guild) return;
  if (oldMessage.author?.bot || newMessage.author?.bot) return;
  if (oldMessage.content === newMessage.content) return;

  const settings = await getSettings(oldMessage.guild);
  if (!settings.modlog_channel) return;

  const logChannel = oldMessage.guild.channels.cache.get(settings.modlog_channel);
  if (!logChannel) return;

  const embed = new EmbedBuilder()
    .setTitle("Message Edited")
    .setAuthor({ name: oldMessage.author.tag, iconURL: oldMessage.author.displayAvatarURL() })
    .setDescription(
      `**Channel:** ${oldMessage.channel.toString()}\n` +
      `**Old Content:** ${oldMessage.content}\n` +
      `**New Content:** ${newMessage.content}`
    )
    .setFooter({ text: `Message ID: ${oldMessage.id}` })
    .setTimestamp()
    .setColor(settings.embed_color);

  logChannel.send({ embeds: [embed] }).catch(() => {});
};
