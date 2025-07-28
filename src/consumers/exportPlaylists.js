const ExportPlaylists = async (msg, playlistsService, mailSender) => {
  try {
    const { playlistId, targetEmail } = JSON.parse(msg.content.toString());

    const playlist = await playlistsService.getSongsFromPlaylist(playlistId);

    const result = {
      playlist: {
        id: playlist.id,
        name: playlist.name,
        songs: playlist.songs,
      },
    };

    await mailSender.sendEmail(targetEmail, result);
  } catch (error) {
    console.error('Gagal memproses export playlist:', error);
  }
};

module.exports = ExportPlaylists;
