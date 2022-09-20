import dotenv from 'dotenv';

import {
  Client, GatewayIntentBits, Partials,
} from 'discord.js';
import commands from './commands';

dotenv.config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.GuildVoiceStates,
  ],
  partials: [
    Partials.Message,
    Partials.Channel,
    Partials.Reaction,
  ],
});

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const command = commands.get(interaction.commandName);

  if (!command) return;

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    try {
      await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
    } catch {
      await interaction.editReply({ content: 'There was an error while executing this command!' });
    }
  }
});

client.on('ready', () => {
  console.log('ready');
});

process.on('SIGINT', () => {
  client.destroy();
});

client.login(process.env.token);
