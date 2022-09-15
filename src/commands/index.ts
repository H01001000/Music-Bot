import { SlashCommandBuilder } from '@discordjs/builders';
import { Collection, CommandInteraction } from 'discord.js';
import fs from 'fs';
import { join } from 'path';

const commandFiles = fs.readdirSync(`${__dirname}`);
type Command = {
  data: SlashCommandBuilder,
  execute: (interaction: CommandInteraction) => Promise<void>
}
const commands = new Collection<string, Command>();

commandFiles.forEach(async (file) => {
  if (file === 'index.ts' || file === 'index.js') return;
  // eslint-disable-next-line import/no-dynamic-require
  const command = require(join(__dirname, file)).default;
  commands.set(command.data.name, command);
});

export default commands;
