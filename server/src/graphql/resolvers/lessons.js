const pool = require('../../db/pool');

const lessonResolvers = {
  Query: {
    lessons: async () => {
      const result = await pool.query(
        'SELECT * FROM lessons WHERE is_published = true ORDER BY created_at DESC'
      );
      return result.rows;
    },

    myLessons: async (_, __, { user }) => {
      if (!user) throw new Error('Not authenticated');
      const result = await pool.query(
        'SELECT * FROM lessons WHERE owner_id = $1 ORDER BY created_at DESC',
        [user.id]
      );
      return result.rows;
    },

    lesson: async (_, { id }) => {
      const result = await pool.query(
        'SELECT * FROM lessons WHERE id = $1',
        [id]
      );
      if (result.rows.length === 0) throw new Error('Lesson not found');
      return result.rows[0];
    }
  },

  Mutation: {
    createLesson: async (_, { title, subject, grade, objectives, content }, { user }) => {
      if (!user) throw new Error('Not authenticated');
      const result = await pool.query(
        'INSERT INTO lessons (title, subject, grade, objectives, content, owner_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
        [title, subject, grade, objectives, content, user.id]
      );
      return result.rows[0];
    },

    updateLesson: async (_, { id, ...fields }, { user }) => {
      if (!user) throw new Error('Not authenticated');
      const lesson = await pool.query('SELECT * FROM lessons WHERE id = $1', [id]);
      if (lesson.rows[0].owner_id !== user.id) throw new Error('Not authorized');

      const result = await pool.query(
        `UPDATE lessons SET 
          title = COALESCE($1, title),
          subject = COALESCE($2, subject),
          grade = COALESCE($3, grade),
          objectives = COALESCE($4, objectives),
          content = COALESCE($5, content),
          is_published = COALESCE($6, is_published),
          updated_at = NOW()
        WHERE id = $7 RETURNING *`,
        [fields.title, fields.subject, fields.grade, fields.objectives, fields.content, fields.is_published, id]
      );
      return result.rows[0];
    },

    deleteLesson: async (_, { id }, { user }) => {
      if (!user) throw new Error('Not authenticated');
      const lesson = await pool.query('SELECT * FROM lessons WHERE id = $1', [id]);
      if (lesson.rows[0].owner_id !== user.id) throw new Error('Not authorized');
      await pool.query('DELETE FROM lessons WHERE id = $1', [id]);
      return true;
    },

    addComment: async (_, { lesson_id, content }, { user }) => {
      if (!user) throw new Error('Not authenticated');
      const result = await pool.query(
        'INSERT INTO comments (lesson_id, user_id, content) VALUES ($1, $2, $3) RETURNING *',
        [lesson_id, user.id, content]
      );
      return result.rows[0];
    },

    addCollaborator: async (_, { lesson_id, user_id, permission }, { user }) => {
      if (!user) throw new Error('Not authenticated');
      const result = await pool.query(
        'INSERT INTO collaborators (lesson_id, user_id, permission) VALUES ($1, $2, $3) RETURNING *',
        [lesson_id, user_id, permission || 'view']
      );
      return result.rows[0];
    }
  },

  Lesson: {
    owner: async (lesson) => {
      const result = await pool.query('SELECT * FROM users WHERE id = $1', [lesson.owner_id]);
      return result.rows[0];
    }
  }
};

module.exports = { lessonResolvers };