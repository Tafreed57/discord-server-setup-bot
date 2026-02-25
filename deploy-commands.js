const path = require("path");
const { REST, Routes, SlashCommandBuilder } = require("discord.js");
require("dotenv").config({ path: path.resolve(__dirname, ".env") });

const commands = [
  new SlashCommandBuilder()
    .setName("setup")
    .setDescription("Bootstrap server roles and channels with correct permissions"),
];

const rest = new REST({ version: "10" }).setToken(process.env.DISCORD_TOKEN);

(async () => {
  if (!process.env.CLIENT_ID) {
    console.error("CLIENT_ID is missing from .env — cannot register commands.");
    process.exit(1);
  }

  try {
    const commandData = commands.map((c) => c.toJSON());

    if (process.env.GUILD_ID) {
      console.log(`Registering commands to guild ${process.env.GUILD_ID}...`);
      await rest.put(
        Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
        { body: commandData },
      );
    } else {
      console.log("Registering commands globally (may take up to 1 hour to propagate)...");
      await rest.put(
        Routes.applicationCommands(process.env.CLIENT_ID),
        { body: commandData },
      );
    }

    console.log("Slash commands registered successfully.");
  } catch (err) {
    console.error("Failed to register commands:", err);
  }
})();
