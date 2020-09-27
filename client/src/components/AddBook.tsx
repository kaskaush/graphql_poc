import React, { useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Select from "@material-ui/core/Select";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import Snackbar from "@material-ui/core/Snackbar";
import Divider from "@material-ui/core/Divider";
import { GET_AUTHORS, ADD_BOOK, GET_BOOKS } from "../queries/queries";

interface Author {
  name: String;
  id: string;
  age: Number;
}

const initialState = {
  bookName: "",
  bookGenre: "",
  authorId: "",
};

const AddBook = () => {
  const { loading, error, data } = useQuery(GET_AUTHORS);

  const [values, setValues] = useState(initialState);
  const [isSuccess, setIsSuccess] = useState(false);

  const [addBook] = useMutation(ADD_BOOK, {
    onCompleted() {
      setIsSuccess(!isSuccess);
      setValues(initialState);
    },
  });

  // Since MUI Select in not a real select element you will need to cast e.target.value using as Type and type the handler as React.ChangeEvent<{ value: unknown }>
  const handleValueChange = (e: any) => {
    setValues({
      ...values,
      [e.target.name as string]: e.target.value as string,
    });
  };

  const handleFormSubmit = (e: any) => {
    e.preventDefault();
    addBook({
      variables: {
        name: values.bookName,
        genre: values.bookGenre,
        authorId: values.authorId,
      },
      refetchQueries: [{ query: GET_BOOKS }],
    });
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error!</p>;

  return (
    <Paper style={{ padding: 20, margin: 20 }}>
      <div className="add-book-form">
        <Typography variant="h6">Add book</Typography>
        <Divider />
        <Snackbar
          anchorOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          open={isSuccess}
          autoHideDuration={1000}
          message="Book added!"
        />
        <Grid container spacing={2}>
          <Grid item xs={12} lg={6}>
            <form
              method="POST"
              style={{ display: "flex", flexDirection: "column" }}
              onSubmit={handleFormSubmit}
            >
              <FormControl className="input-field">
                <TextField
                  name="bookName"
                  label="Name"
                  value={values.bookName}
                  onChange={handleValueChange}
                  required
                />
              </FormControl>
              <FormControl className="input-field" style={{ marginTop: 16 }}>
                <TextField
                  name="bookGenre"
                  label="Genre"
                  value={values.bookGenre}
                  onChange={handleValueChange}
                  required
                />
              </FormControl>
              <FormControl className="input-field" style={{ marginTop: 16 }}>
                <InputLabel htmlFor="author">Author</InputLabel>
                <Select
                  id="author"
                  onChange={handleValueChange}
                  name="authorId"
                  value={values.authorId}
                >
                  <MenuItem disabled selected>
                    Select
                  </MenuItem>
                  {data.authors.map((author: Author) => {
                    return (
                      <MenuItem key={author.id} value={author.id}>
                        {author.name}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
              <Button
                variant="contained"
                color="primary"
                type="submit"
                style={{ marginTop: 16 }}
              >
                Add
              </Button>
            </form>
          </Grid>
        </Grid>
      </div>
    </Paper>
  );
};

export default AddBook;
