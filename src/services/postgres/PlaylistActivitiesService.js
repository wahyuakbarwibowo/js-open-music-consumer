const { nanoid } = require('nanoid');
const { Pool } = require('pg');

class PlaylistActivitiesService {
  constructor() {
    this._pool = new Pool();
  }

  async addActivity({
    playlistId, songId, userId, action,
  }) {
    const id = `activity-${nanoid(16)}`;
    const query = {
      text: `INSERT INTO playlist_song_activities (id, playlist_id, song_id, user_id, action)
             VALUES ($1, $2, $3, $4, $5)`,
      values: [id, playlistId, songId, userId, action],
    };
    await this._pool.query(query);
  }

  async getActivities(playlistId) {
    const query = {
      text: `
        SELECT users.username, songs.title, psa.action, psa.time
        FROM playlist_song_activities psa
        JOIN users ON psa.user_id = users.id
        JOIN songs ON psa.song_id = songs.id
        WHERE psa.playlist_id = $1
        ORDER BY psa.time ASC
      `,
      values: [playlistId],
    };

    const result = await this._pool.query(query);
    return result.rows;
  }
}

module.exports = PlaylistActivitiesService;
