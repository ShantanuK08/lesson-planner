import { gql } from '@apollo/client';

export const GET_ME = gql`
  query GetMe {
    me {
      id
      name
      email
      role
    }
  }
`;

export const GET_MY_LESSONS = gql`
  query GetMyLessons {
    myLessons {
      id
      title
      subject
      grade
      objectives
      content
      is_published
      created_at
      updated_at
      owner {
        id
        name
      }
    }
  }
`;

export const GET_LESSONS = gql`
  query GetLessons {
    lessons {
      id
      title
      subject
      grade
      objectives
      is_published
      created_at
      owner {
        id
        name
      }
    }
  }
`;

export const GET_LESSON = gql`
  query GetLesson($id: ID!) {
    lesson(id: $id) {
      id
      title
      subject
      grade
      objectives
      content
      is_published
      created_at
      updated_at
      owner {
        id
        name
      }
      comments {
        id
        content
        created_at
        user {
          id
          name
        }
      }
    }
  }
`;