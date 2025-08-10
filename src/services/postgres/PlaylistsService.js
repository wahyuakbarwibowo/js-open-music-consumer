const { Pool } = require('pg');

class PlaylistsService {
  constructor() {
    this._pool = new Pool();
  }

  async getPlaylistWithSongs(playlistId) {
    const query = {
      text: `
        SELECT 
          p.id,
          p.name,
          u.username,
          COALESCE(
            json_agg(
              json_build_object(
                'id', s.id,
                'title', s.title,
                'performer', s.performer
              )
            ) FILTER (WHERE s.id IS NOT NULL),
            '[]'
          ) AS songs
        FROM playlists p
        LEFT JOIN users u ON u.id = p.owner
        LEFT JOIN playlist_songs ps ON ps.playlist_id = p.id
        LEFT JOIN songs s ON s.id = ps.song_id
        WHERE p.id = $1
        GROUP BY p.id, u.username
      `,
      values: [playlistId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new Error('Playlist tidak ditemukan');
    }

    return result.rows[0];
  }
}

module.exports = PlaylistsService;
