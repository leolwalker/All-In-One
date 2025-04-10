const { ApplicationCommandOptionType, ChannelType } = require("discord.js");

/**
 * @type {import("@structures/Command")}
 */
module.exports = {
  name: "modlog",
  description: "enable or disable moderation logs",
  category: "ADMIN",
  userPermissions: ["ManageGuild"],
  command: {
    enabled: true,
    usage: "<#channel|off>",
    minArgsCount: 1,
  },
  slashCommand: {
    enabled: true,
    ephemeral: true,
    options: [
      {
        name: "channel",
        description: "channels to send mod logs",
        required: false,
        type: ApplicationCommandOptionType.Channel,
        channelTypes: [ChannelType.GuildText],
      },
    ],
  },

  async messageRun(message, args, data) {
    const input = args[0].toLowerCase();
    let targetChannel;

    if (input === "none" || input === "off" || input === "disable") targetChannel = null;
    else {
      if (message.mentions.channels.size === 0) return message.safeReply("Incorrect command usage");
      targetChannel = message.mentions.channels.first();
    }

    const response = await setChannel(targetChannel, data.settings);
    return message.safeReply(response);
  },

  async interactionRun(interaction, data) {
    const channel = interaction.options.getChannel("channel");
    const response = await setChannel(channel, data.settings);
    return interaction.followUp(response);
  },
};

async function setChannel(targetChannel, settings) {
  if (!targetChannel && !settings.modlog_channel) {
    return "It is already disabled";
  }

  if (targetChannel) {
    const perms = ["ViewChannel", "SendMessages", "EmbedLinks"];
    const missing = targetChannel.permissionsFor(targetChannel.guild.members.me).missing(perms);
    if (missing.length > 0) {
      return `I need the following permissions in ${targetChannel}: ${missing.join(", ")}`;
    }
  }

  settings.modlog_channel = targetChannel?.id;
  await settings.save();
  return `Configuration saved! Modlog channel ${targetChannel ? "updated" : "removed"}`;
}
