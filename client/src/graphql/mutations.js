import { gql } from '@apollo/client';

export const REGISTER = gql`
  mutation Register($name: String!, $email: String!, $password: String!, $role: String) {
    register(name: $name, email: $email, password: $password, role: $role) {
      token
      user {
        id
        name
        email
        role
      }
    }
  }
`;

export const LOGIN = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        id
        name
        email
        role
      }
    }
  }
`;

export const CREATE_LESSON = gql`
  mutation CreateLesson($title: String!, $subject: String!, $grade: String!, $objectives: String, $content: String) {
    createLesson(title: $title, subject: $subject, grade: $grade, objectives: $objectives, content: $content) {
      id
      title
      subject
      grade
      objectives
      content
      is_published
      created_at
    }
  }
`;

export const UPDATE_LESSON = gql`
  mutation UpdateLesson($id: ID!, $title: String, $subject: String, $grade: String, $objectives: String, $content: String, $is_published: Boolean) {
    updateLesson(id: $id, title: $title, subject: $subject, grade: $grade, objectives: $objectives, content: $content, is_published: $is_published) {
      id
      title
      subject
      grade
      objectives
      content
      is_published
      updated_at
    }
  }
`;

export const DELETE_LESSON = gql`
  mutation DeleteLesson($id: ID!) {
    deleteLesson(id: $id)
  }
`;

export const ADD_COMMENT = gql`
  mutation AddComment($lesson_id: ID!, $content: String!) {
    addComment(lesson_id: $lesson_id, content: $content) {
      id
      content
      created_at
      user {
        id
        name
      }
    }
  }
`;