const { authResolvers } = require('./auth');
const { lessonResolvers } = require('./lessons');

const resolvers = {
  Query: {
    ...authResolvers.Query,
    ...lessonResolvers.Query
  },
  Mutation: {
    ...authResolvers.Mutation,
    ...lessonResolvers.Mutation
  },
  Lesson: {
    ...lessonResolvers.Lesson
  }
};

module.exports = { resolvers };