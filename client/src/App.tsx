import React from "react";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
import BookList from "./components/BookList";
import Header from "./components/Header";
import AddBook from "./components/AddBook";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";

const client = new ApolloClient({
  uri: "http://localhost:4000/graphql",
  cache: new InMemoryCache(),
});

const App = () => {
  return (
    <ApolloProvider client={client}>
      <div className="main">
        <Header />
        <Container>
          <Grid container spacing={2}>
            <Grid item sm={12} md={6}>
              <BookList />
            </Grid>
            <Grid item sm={12} md={6}>
              <AddBook />
            </Grid>
          </Grid>
        </Container>
      </div>
    </ApolloProvider>
  );
};

export default App;
