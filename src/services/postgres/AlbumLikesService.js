const { nanoid } = require('nanoid');
const { Pool } = require('pg');

class AlbumLikesService {
  constructor(cacheService) {
    this._cacheService = cacheService;
    this._pool = new Pool();
  }

  async likeAlbum(albumId, userId) {
    const id = `like-${nanoid(16)}`;
    const query = {
      text: 'INSERT INTO user_album_likes VALUES ($1, $2, $3) ON CONFLICT DO NOTHING',
      values: [id, userId, albumId],
    };
    await this._pool.query(query);
    await this._cacheService.delete(`album_likes:${albumId}`);
  }

  async unlikeAlbum(albumId, userId) {
    const query = {
      text: 'DELETE FROM user_album_likes WHERE album_id = $1 AND user_id = $2',
      values: [albumId, userId],
    };
    await this._pool.query(query);
    await this._cacheService.delete(`album_likes:${albumId}`);
  }

  async hasUserLiked(albumId, userId) {
    const query = {
      text: 'SELECT 1 FROM user_album_likes WHERE album_id = $1 AND user_id = $2',
      values: [albumId, userId],
    };
    const result = await this._pool.query(query);
    return result.rowCount > 0;
  }

  async getAlbumLikes(albumId) {
    try {
      const result = await this._cacheService.get(`album_likes:${albumId}`);
      return { count: parseInt(result, 10), fromCache: true };
    } catch {
      const query = {
        text: 'SELECT COUNT(*) FROM user_album_likes WHERE album_id = $1',
        values: [albumId],
      };
      const result = await this._pool.query(query);
      const count = parseInt(result.rows[0].count, 10);
      await this._cacheService.set(`album_likes:${albumId}`, count, 1800); // 30 menit
      return { count, fromCache: false };
    }
  }
}

module.exports = AlbumLikesService;
