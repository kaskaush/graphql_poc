import { gql } from "@apollo/client";

const GET_BOOKS = gql`
  {
    books {
      name
      genre
      id
    }
  }
`;

const GET_AUTHORS = gql`
  {
    authors {
      name
      age
      id
    }
  }
`;

const ADD_BOOK = gql`
  mutation addBook($name: String!, $genre: String!, $authorId: String!) {
    addBook(name: $name, genre: $genre, authorId: $authorId) {
      name
      id
    }
  }
`;

const GET_BOOK = gql`
  query($id: ID!) {
    book(id: $id) {
      id
      name
      genre
      author {
        id
        name
        age
        books {
          name
          id
        }
      }
    }
  }
`;

export { GET_BOOKS, GET_AUTHORS, ADD_BOOK, GET_BOOK };
