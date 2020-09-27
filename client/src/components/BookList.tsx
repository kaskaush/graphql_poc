import React, { useState } from "react";
import { useQuery } from "@apollo/client";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import { GET_BOOKS } from "../queries/queries";
import BookDetails from "./BookDetails";
import Divider from "@material-ui/core/Divider";

interface Book {
  id: string;
  name: String;
  genre: String;
}

const BookList = () => {
  const { loading, error, data } = useQuery(GET_BOOKS);
  const [selectedBook, setSelectedBook] = useState("");

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error!</p>;

  const getBookDetails = (id: string) => {
    setSelectedBook(id);
  };

  return (
    <>
      <Paper style={{ padding: 20, margin: 20 }}>
        <div className="book-list-section">
          <Typography variant="h6">Book list</Typography>
          <Divider />
          <List className="book-list">
            {data.books.map((book: Book, index: Number) => {
              return (
                <>
                  <ListItem
                    key={book.id}
                    onClick={() => getBookDetails(book.id)}
                    style={{ cursor: "pointer" }}
                  >
                    {book.name}
                  </ListItem>
                  {data.books.length - 1 !== index && <Divider />}
                </>
              );
            })}
          </List>
        </div>
      </Paper>
      {selectedBook && (
        <Paper style={{ padding: 20, margin: 20 }}>
          <BookDetails selected={selectedBook} />
        </Paper>
      )}
    </>
  );
};

export default BookList;
