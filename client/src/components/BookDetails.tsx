import React from "react";
import { useQuery } from "@apollo/client";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import { GET_BOOK } from "../queries/queries";

interface BookDetailsProps {
  selected: String;
}

interface Book {
  name: String;
  id: string;
}

const BookDetails = ({ selected }: BookDetailsProps) => {
  const { loading, error, data } = useQuery(GET_BOOK, {
    variables: { id: selected },
  });

  return data && data.book ? (
    <div className="book-details">
      <Typography variant="h6">Book details</Typography>
      <Divider />
      <Typography variant="body1">Book name</Typography>
      <p>{data.book.name}</p>
      <Typography variant="body1">Book genre</Typography>
      <p>{data.book.genre}</p>
      <Typography variant="body1">Author</Typography>
      <p>{data.book.author.name}</p>
      <Typography variant="body1">Other books by author</Typography>
      <Typography variant="body2">
        {data.book.author.books.map((book: Book) => {
          return <p key={book.id}>{book.name}</p>;
        })}
      </Typography>
    </div>
  ) : null;
};

export default BookDetails;
