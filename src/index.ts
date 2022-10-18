import dotenv from 'dotenv';
import commands from './commands';
import client from './structure/client';
import logger from './util/logger';
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
    logger.error(error);

    if (interaction.replied) {
      interaction.editReply({ content: 'There was an error while executing this command!' });
    } else {
      interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
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
