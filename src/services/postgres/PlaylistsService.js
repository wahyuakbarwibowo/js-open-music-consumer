const { Pool } = require('pg');

class PlaylistsService {
  constructor() {
    this._pool = new Pool();
  }

  async getSongsFromPlaylist(playlistId) {
    const query = {
      text: `
        SELECT s.id, s.title, s.performer
        FROM songs s
        JOIN playlist_songs ps ON ps.song_id = s.id
        WHERE ps.playlist_id = $1
      `,
      values: [playlistId],
    };
    const result = await this._pool.query(query);
    return result.rows;
  }
}

module.exports = PlaylistsService;
