const { Client, GatewayIntentBits } = require("discord.js");
const setup = require("./commands/setup");
require("dotenv").config();

const client = new Client({
  intents: [GatewayIntentBits.Guilds],
});

client.once("ready", () => {
  console.log(`Logged in as ${client.user.tag}`);
});

client.on("interactionCreate", async (interaction) => {
  if (interaction.isChatInputCommand() && interaction.commandName === "setup") {
    try {
      await setup.execute(interaction);
    } catch (err) {
      console.error("Setup command failed:", err);
      const msg = "Something went wrong running `/setup`. Check the bot console for details.";
      if (interaction.deferred || interaction.replied) {
        await interaction.editReply(msg).catch(() => {});
      } else {
        await interaction.reply({ content: msg, ephemeral: true }).catch(() => {});
      }
    }
    return;
  }

  if (interaction.isButton()) {
    try {
      if (interaction.customId === "open_live_ticket") {
        await setup.handleTicketOpen(interaction);
      } else if (interaction.customId === "close_ticket") {
        await setup.handleTicketClose(interaction);
      }
    } catch (err) {
      console.error("Button handler failed:", err);
      const msg = "Something went wrong. Check the bot console for details.";
      if (interaction.deferred || interaction.replied) {
        await interaction.editReply(msg).catch(() => {});
      } else {
        await interaction.reply({ content: msg, ephemeral: true }).catch(() => {});
      }
    }
  }
});

client.login(process.env.DISCORD_TOKEN);
