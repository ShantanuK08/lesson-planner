const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type User {
    id: ID!
    name: String!
    email: String!
    role: String!
    created_at: String
  }

  type Lesson {
    id: ID!
    title: String!
    subject: String!
    grade: String!
    objectives: String
    content: String
    owner_id: ID!
    is_published: Boolean
    created_at: String
    updated_at: String
    owner: User
    comments: [Comment]
  }

  type Comment {
    id: ID!
    lesson_id: ID!
    user_id: ID!
    content: String!
    created_at: String
    user: User
  }

  type Collaborator {
    id: ID!
    lesson_id: ID!
    user_id: ID!
    permission: String!
    user: User
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  type Query {
    me: User
    lessons: [Lesson]
    lesson(id: ID!): Lesson
    myLessons: [Lesson]
  }

  type Mutation {
    register(name: String!, email: String!, password: String!, role: String): AuthPayload
    login(email: String!, password: String!): AuthPayload
    createLesson(title: String!, subject: String!, grade: String!, objectives: String, content: String): Lesson
    updateLesson(id: ID!, title: String, subject: String, grade: String, objectives: String, content: String, is_published: Boolean): Lesson
    deleteLesson(id: ID!): Boolean
    addComment(lesson_id: ID!, content: String!): Comment
    addCollaborator(lesson_id: ID!, user_id: ID!, permission: String): Collaborator
  }
`;

module.exports = { typeDefs };