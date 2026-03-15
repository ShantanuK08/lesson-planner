const bcrypt = require('bcryptjs');
const pool = require('../../db/pool');
const { generateToken } = require('../../middleware/auth');

const authResolvers = {
  Mutation: {
    register: async (_, { name, email, password, role }) => {
      const existingUser = await pool.query(
        'SELECT * FROM users WHERE email = $1',
        [email]
      );

      if (existingUser.rows.length > 0) {
        throw new Error('User already exists');
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const result = await pool.query(
        'INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING *',
        [name, email, hashedPassword, role || 'teacher']
      );

      const user = result.rows[0];
      const token = generateToken(user);

      return { token, user };
    },

    login: async (_, { email, password }) => {
      const result = await pool.query(
        'SELECT * FROM users WHERE email = $1',
        [email]
      );

      if (result.rows.length === 0) {
        throw new Error('User not found');
      }

      const user = result.rows[0];
      const validPassword = await bcrypt.compare(password, user.password);

      if (!validPassword) {
        throw new Error('Invalid password');
      }

      const token = generateToken(user);
      return { token, user };
    }
  },

  Query: {
    me: async (_, __, { user }) => {
      if (!user) throw new Error('Not authenticated');

      const result = await pool.query(
        'SELECT * FROM users WHERE id = $1',
        [user.id]
      );

      return result.rows[0];
    }
  }
};

module.exports = { authResolvers };