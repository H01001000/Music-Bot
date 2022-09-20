import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import Players from '../structure/Players';

export default {
  data: new SlashCommandBuilder()
    .setName('remove')
    .setDescription('Removes the song with the given ID in the queue')
    .addIntegerOption((option) => option.setName('index').setDescription('The index of the song you want to remove').setRequired(true)),
  async execute(interaction: ChatInputCommandInteraction) {
    if (!interaction.guild) {
      interaction.reply({ content: 'You are not currently in a guild!', ephemeral: true });
      return;
    }
    const voiceChannel = interaction.guild.members.cache
      .get(interaction.user.id)?.voice.channel;

    if (!voiceChannel) {
      interaction.reply({ content: 'You are not currently in a voice channel!', ephemeral: true });
      return;
    }
    const player = Players.get(interaction.guild.id);
    if (!player) {
      interaction.reply({ content: 'no music in queue', ephemeral: true });
      return;
    }
    const index = interaction.options.getInteger('index', true);
    if (player.queue.size < index) {
      interaction.reply({ content: 'index out of range', ephemeral: true });
      return;
    }
    player.queue.remove(index - 1);
    interaction.reply({ content: 'removed', ephemeral: false });
  },
};
