import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import Players from '../Players';

export default {
  data: new SlashCommandBuilder()
    .setName('resume')
    .setDescription('Resumes playing the current song'),
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
      interaction.reply({ content: 'No music is playing', ephemeral: true });
      return;
    }
    player.play();
    interaction.reply({ content: 'resumed playing song', ephemeral: false });
  },
};
