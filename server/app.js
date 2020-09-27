const express = require("express");
const cors = require("cors");
const { graphqlHTTP } = require("express-graphql");
const schema = require("./gql-schema/schema");
const mongoose = require("mongoose");
const app = express();

app.use(cors());

mongoose
  .connect(
    "mongodb+srv://carter:Test@123@cluster0.oel5h.mongodb.net/gql-poc?retryWrites=true&w=majority",
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .catch((err) => {
    console.log("Failed to connect to DB with error: ", err);
  });

mongoose.connection.once("open", () => {
  console.log("Connected to DB");
});

app.use("/graphql", graphqlHTTP({ schema, graphiql: true })); //schema -> to define graph schema

app.listen(4000, () => {
  console.log("Running a GraphQL API server on port 4000");
});
