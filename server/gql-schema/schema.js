const graphql = require("graphql");
const RootQuery = require("./root-query");
const Mutations = require("./mutations");

const { GraphQLSchema } = graphql;

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutations,
});
