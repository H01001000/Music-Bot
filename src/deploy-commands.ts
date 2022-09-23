import dotenv from 'dotenv';

import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v10';
import commands from './commands';

dotenv.config();

if (!process.env.token || !process.env.clientId) process.exit(1);

const rest = new REST({ version: '10' }).setToken(process.env.token);

rest.put(
  Routes.applicationCommands(process.env.clientId),
  { body: commands.map((command) => command.data.toJSON()) },
).then(() => console.log('Successfully registered application commands.'))
  .catch(console.error);
