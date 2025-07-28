class Listener {
  constructor(playlistService, mailSender) {
    this._playlistService = playlistService;
    this._mailSender = mailSender;

    this.listen = this.listen.bind(this);
  }

  async listen(msg) {
    try {
      const { playlistId, targetEmail } = JSON.parse(msg.content.toString());
      const playlist = await this._playlistService.getPlaylistWithSongs(playlistId);
      const result = await this._mailSender.sendEmail(targetEmail, JSON.stringify(playlist));

      console.log('Email sent:', result);
    } catch (error) {
      console.error('Error processing export:', error);
    }
  }
}

module.exports = Listener;
