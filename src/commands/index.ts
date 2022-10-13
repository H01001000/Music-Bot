import { Collection, CommandInteraction, SlashCommandBuilder } from 'discord.js';
import fs from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { PreprocessingResult } from '../util/utils';

// eslint-disable-next-line no-underscore-dangle
const __dirname = dirname(fileURLToPath(import.meta.url));

const commandFiles = fs.readdirSync(`${__dirname}`);
type Command = {
  data: SlashCommandBuilder,
  execute: (interaction: CommandInteraction, preprocessingResult: PreprocessingResult) => Promise<void>
}
const commands = new Collection<string, Command>();

commandFiles.forEach(async (file) => {
  if (file === 'index.ts' || file === 'index.js') return;
  // eslint-disable-next-line import/no-dynamic-require
  const command = (await import(`file://${join(__dirname, file)}`)).default;
  commands.set(command.data.name, command);
});

export default commands;
