const {
  PermissionFlagsBits,
  ChannelType,
  PermissionsBitField,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");

const ROLES = [
  { name: "Admin", color: 0xe74c3c, hoist: true },
  { name: "Mod", color: 0x3498db, hoist: true },
];

const CHANNELS = [
  {
    name: "welcome",
    position: 0,
    overwrites: (everyoneId, adminId, modId) => [
      {
        id: everyoneId,
        allow: [
          PermissionFlagsBits.ViewChannel,
          PermissionFlagsBits.ReadMessageHistory,
        ],
        deny: [PermissionFlagsBits.SendMessages, PermissionFlagsBits.AddReactions],
      },
      {
        id: adminId,
        allow: [PermissionFlagsBits.SendMessages, PermissionFlagsBits.ManageMessages],
      },
      {
        id: modId,
        allow: [PermissionFlagsBits.SendMessages, PermissionFlagsBits.ManageMessages],
      },
    ],
  },
  {
    name: "general",
    overwrites: (everyoneId, adminId, modId) => [
      {
        id: everyoneId,
        allow: [
          PermissionFlagsBits.ViewChannel,
          PermissionFlagsBits.SendMessages,
          PermissionFlagsBits.EmbedLinks,
          PermissionFlagsBits.AttachFiles,
          PermissionFlagsBits.AddReactions,
          PermissionFlagsBits.ReadMessageHistory,
        ],
      },
      {
        id: adminId,
        allow: [PermissionFlagsBits.SendMessages, PermissionFlagsBits.ManageMessages],
      },
      {
        id: modId,
        allow: [PermissionFlagsBits.SendMessages, PermissionFlagsBits.ManageMessages],
      },
    ],
  },
  {
    name: "latest-videos",
    overwrites: (everyoneId, adminId, modId) => [
      {
        id: everyoneId,
        allow: [
          PermissionFlagsBits.ViewChannel,
          PermissionFlagsBits.ReadMessageHistory,
          PermissionFlagsBits.AddReactions,
        ],
        deny: [PermissionFlagsBits.SendMessages],
      },
      {
        id: adminId,
        allow: [PermissionFlagsBits.SendMessages, PermissionFlagsBits.ManageMessages],
      },
      {
        id: modId,
        allow: [PermissionFlagsBits.SendMessages, PermissionFlagsBits.ManageMessages],
      },
    ],
  },
  {
    name: "steps-to-start-clipping",
    overwrites: (everyoneId, adminId, modId) => [
      {
        id: everyoneId,
        allow: [
          PermissionFlagsBits.ViewChannel,
          PermissionFlagsBits.ReadMessageHistory,
        ],
        deny: [PermissionFlagsBits.SendMessages, PermissionFlagsBits.AddReactions],
      },
      {
        id: adminId,
        allow: [PermissionFlagsBits.SendMessages, PermissionFlagsBits.ManageMessages],
      },
      {
        id: modId,
        allow: [PermissionFlagsBits.SendMessages, PermissionFlagsBits.ManageMessages],
      },
    ],
  },
  {
    name: "links",
    overwrites: (everyoneId, adminId, modId) => [
      {
        id: everyoneId,
        allow: [
          PermissionFlagsBits.ViewChannel,
          PermissionFlagsBits.ReadMessageHistory,
        ],
        deny: [PermissionFlagsBits.SendMessages, PermissionFlagsBits.AddReactions],
      },
      {
        id: adminId,
        allow: [PermissionFlagsBits.SendMessages, PermissionFlagsBits.ManageMessages],
      },
      {
        id: modId,
        allow: [PermissionFlagsBits.SendMessages, PermissionFlagsBits.ManageMessages],
      },
    ],
  },
  {
    name: "live",
    isTicketPanel: true,
    overwrites: (everyoneId, adminId, modId) => [
      {
        id: everyoneId,
        allow: [
          PermissionFlagsBits.ViewChannel,
          PermissionFlagsBits.ReadMessageHistory,
        ],
        deny: [PermissionFlagsBits.SendMessages, PermissionFlagsBits.AddReactions],
      },
      {
        id: adminId,
        allow: [PermissionFlagsBits.SendMessages, PermissionFlagsBits.ManageMessages],
      },
      {
        id: modId,
        allow: [PermissionFlagsBits.SendMessages, PermissionFlagsBits.ManageMessages],
      },
    ],
  },
  {
    name: "how-to-start-going-live",
    overwrites: (everyoneId, adminId, modId) => [
      {
        id: everyoneId,
        allow: [
          PermissionFlagsBits.ViewChannel,
          PermissionFlagsBits.ReadMessageHistory,
        ],
        deny: [PermissionFlagsBits.SendMessages, PermissionFlagsBits.AddReactions],
      },
      {
        id: adminId,
        allow: [PermissionFlagsBits.SendMessages, PermissionFlagsBits.ManageMessages],
      },
      {
        id: modId,
        allow: [PermissionFlagsBits.SendMessages, PermissionFlagsBits.ManageMessages],
      },
    ],
  },
];

async function execute(interaction) {
  const { guild, member } = interaction;

  if (!guild) {
    return interaction.reply({ content: "This command can only be used in a server.", ephemeral: true });
  }

  const isAdmin = member.permissions.has(PermissionFlagsBits.Administrator);
  const isOwner = member.id === process.env.OWNER_ID;
  if (!isAdmin && !isOwner) {
    return interaction.reply({
      content: "You need **Administrator** permission to run this command.",
      ephemeral: true,
    });
  }

  const botMember = guild.members.me;
  if (!botMember.permissions.has(PermissionFlagsBits.Administrator)) {
    return interaction.reply({
      content: "I need the **Administrator** permission to set up channels and roles properly. Please update my role in Server Settings > Roles.",
      ephemeral: true,
    });
  }

  await interaction.deferReply();

  const summary = [];

  // --- Roles ---
  const roleMap = {};
  for (const roleDef of ROLES) {
    try {
      let role = guild.roles.cache.find((r) => r.name === roleDef.name);
      if (role) {
        const updates = {};
        if (role.color !== roleDef.color) updates.color = roleDef.color;
        if (role.hoist !== roleDef.hoist) updates.hoist = roleDef.hoist;

        if (Object.keys(updates).length > 0) {
          await role.edit(updates);
          summary.push(`Updated role **${roleDef.name}**`);
        } else {
          summary.push(`Role **${roleDef.name}** already up to date`);
        }
      } else {
        role = await guild.roles.create({
          name: roleDef.name,
          color: roleDef.color,
          hoist: roleDef.hoist,
          reason: "/setup bootstrap",
        });
        summary.push(`Created role **${roleDef.name}**`);
      }
      roleMap[roleDef.name] = role;
    } catch (err) {
      console.error(`Failed to create/update role ${roleDef.name}:`, err.message);
      summary.push(`Failed role **${roleDef.name}**: ${err.message}`);
    }
  }

  if (!roleMap["Admin"] || !roleMap["Mod"]) {
    return interaction.editReply(
      `**Setup Failed** — could not create required roles.\n\n${summary.map((s) => `• ${s}`).join("\n")}`,
    );
  }

  const everyoneId = guild.roles.everyone.id;
  const adminRoleId = roleMap["Admin"].id;
  const modRoleId = roleMap["Mod"].id;

  // --- Channels ---
  for (const chDef of CHANNELS) {
    try {
      const desiredOverwrites = chDef.overwrites(everyoneId, adminRoleId, modRoleId);
      let channel = guild.channels.cache.find(
        (c) => c.name === chDef.name && c.type === ChannelType.GuildText,
      );

      if (channel) {
        await channel.permissionOverwrites.set(
          desiredOverwrites.map((ow) => ({
            id: ow.id,
            allow: new PermissionsBitField(ow.allow),
            deny: ow.deny ? new PermissionsBitField(ow.deny) : undefined,
          })),
          "/setup permission sync",
        );
        summary.push(`Updated overwrites for **#${chDef.name}**`);
      } else {
        const createOptions = {
          name: chDef.name,
          type: ChannelType.GuildText,
          permissionOverwrites: desiredOverwrites,
          reason: "/setup bootstrap",
        };
        if (chDef.position != null) createOptions.position = chDef.position;
        channel = await guild.channels.create(createOptions);
        summary.push(`Created channel **#${chDef.name}**`);
      }

      if (chDef.isTicketPanel) {
        await sendTicketPanel(channel);
        summary.push(`Sent ticket panel in **#${chDef.name}**`);
      }
    } catch (err) {
      console.error(`Failed to create/update channel #${chDef.name}:`, err.message);
      summary.push(`Failed **#${chDef.name}**: ${err.message}`);
    }
  }

  await interaction.editReply(
    `**Server Setup Complete**\n\n${summary.map((s) => `• ${s}`).join("\n")}`,
  );
}

async function sendTicketPanel(channel) {
  const existing = (await channel.messages.fetch({ limit: 20 })).find(
    (m) => m.author.id === channel.client.user.id && m.components.length > 0,
  );
  if (existing) return;

  const embed = new EmbedBuilder()
    .setTitle("Go Live — Open a Ticket")
    .setDescription(
      "Want to learn how to go live? Click the button below to open a private ticket. " +
      "An admin or mod will walk you through the process.",
    )
    .setColor(0x57f287);

  const row = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId("open_live_ticket")
      .setLabel("Open Ticket")
      .setStyle(ButtonStyle.Success)
      .setEmoji("🎟️"),
  );

  await channel.send({ embeds: [embed], components: [row] });
}

async function handleTicketOpen(interaction) {
  const { guild, user } = interaction;

  const ticketName = `ticket-${user.username}`.toLowerCase().replace(/[^a-z0-9-]/g, "-");
  const existing = guild.channels.cache.find(
    (c) => c.name === ticketName && c.type === ChannelType.GuildText,
  );
  if (existing) {
    return interaction.reply({
      content: `You already have an open ticket: ${existing}`,
      ephemeral: true,
    });
  }

  await interaction.deferReply({ ephemeral: true });

  const adminRole = guild.roles.cache.find((r) => r.name === "Admin");
  const modRole = guild.roles.cache.find((r) => r.name === "Mod");

  const overwrites = [
    {
      id: guild.roles.everyone.id,
      deny: [PermissionFlagsBits.ViewChannel],
    },
    {
      id: user.id,
      allow: [
        PermissionFlagsBits.ViewChannel,
        PermissionFlagsBits.SendMessages,
        PermissionFlagsBits.ReadMessageHistory,
        PermissionFlagsBits.AttachFiles,
        PermissionFlagsBits.EmbedLinks,
      ],
    },
  ];

  if (adminRole) {
    overwrites.push({
      id: adminRole.id,
      allow: [
        PermissionFlagsBits.ViewChannel,
        PermissionFlagsBits.SendMessages,
        PermissionFlagsBits.ManageMessages,
        PermissionFlagsBits.ReadMessageHistory,
      ],
    });
  }
  if (modRole) {
    overwrites.push({
      id: modRole.id,
      allow: [
        PermissionFlagsBits.ViewChannel,
        PermissionFlagsBits.SendMessages,
        PermissionFlagsBits.ManageMessages,
        PermissionFlagsBits.ReadMessageHistory,
      ],
    });
  }

  const ticket = await guild.channels.create({
    name: ticketName,
    type: ChannelType.GuildText,
    permissionOverwrites: overwrites,
    reason: `Live ticket opened by ${user.tag}`,
  });

  const welcomeEmbed = new EmbedBuilder()
    .setTitle("Live Ticket")
    .setDescription(
      `Hey ${user}, welcome! An admin or mod will be with you shortly to help you get started going live.\n\n` +
      "When you're done, click **Close Ticket** below.",
    )
    .setColor(0x57f287);

  const closeRow = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId("close_ticket")
      .setLabel("Close Ticket")
      .setStyle(ButtonStyle.Danger)
      .setEmoji("🔒"),
  );

  await ticket.send({ embeds: [welcomeEmbed], components: [closeRow] });

  await interaction.editReply(`Your ticket has been created: ${ticket}`);
}

async function handleTicketClose(interaction) {
  const { channel, member } = interaction;

  if (!channel.name.startsWith("ticket-")) {
    return interaction.reply({ content: "This isn't a ticket channel.", ephemeral: true });
  }

  const isStaff =
    member.permissions.has(PermissionFlagsBits.Administrator) ||
    member.roles.cache.some((r) => r.name === "Admin" || r.name === "Mod");

  const isTicketOwner = channel.name === `ticket-${member.user.username}`.toLowerCase().replace(/[^a-z0-9-]/g, "-");

  if (!isStaff && !isTicketOwner) {
    return interaction.reply({ content: "Only the ticket owner or staff can close this ticket.", ephemeral: true });
  }

  await interaction.reply("🔒 Closing this ticket in 5 seconds...");
  setTimeout(() => channel.delete("Ticket closed").catch(console.error), 5000);
}

module.exports = { execute, handleTicketOpen, handleTicketClose };
