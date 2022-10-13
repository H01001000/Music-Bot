import dotenv from 'dotenv';

import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v10';
import commands from './commands';

dotenv.config();

if (!process.env.token || !process.env.clientId) {
  console.log('Missing token or clientId');
  process.exit(1);
}

const rest = new REST({ version: '10' }).setToken(process.env.token);

try {
  await rest.put(
    Routes.applicationCommands(process.env.clientId),
    { body: commands.map((command) => command.data.toJSON()) },
  );
  console.log('Successfully registered application commands.');
} catch (error) {
  console.error(error);
}
