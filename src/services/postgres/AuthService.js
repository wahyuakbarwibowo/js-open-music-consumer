const { Pool } = require('pg');
const InvariantError = require('../../exceptions/InvariantError');

class AuthService {
  constructor() {
    this._tokenStorage = new Pool(); // e.g., PostgreSQL wrapper class
  }

  async addRefreshToken(token) {
    const query = {
      text: 'INSERT INTO authentications VALUES($1)',
      values: [token],
    };
    await this._tokenStorage.query(query);
  }

  async verifyRefreshToken(token) {
    const query = {
      text: 'SELECT token FROM authentications WHERE token = $1',
      values: [token],
    };
    const result = await this._tokenStorage.query(query);
    if (!result.rowCount) {
      throw new InvariantError('Refresh token tidak valid');
    }
  }

  async deleteRefreshToken(token) {
    const query = {
      text: 'DELETE FROM authentications WHERE token = $1',
      values: [token],
    };
    await this._tokenStorage.query(query);
  }
}

module.exports = AuthService;
