import dotenv from 'dotenv';
import commands from './commands';
import client from './structure/client';
import { interactionPreprocessing } from './util/utils';

dotenv.config();

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const command = commands.get(interaction.commandName);

  if (!command) return;

  const preprocessingResult = interactionPreprocessing(interaction);
  if (preprocessingResult.skip) return;
  try {
    await command.execute(interaction, preprocessingResult);
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
