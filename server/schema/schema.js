import graphql from "graphql";
const { GraphQLSchema } = graphql;

import RootQueryType from "./types/root_query_type.js";
import mutation from "./mutations.js";

export default new GraphQLSchema({
  query: RootQueryType,
  mutation,
});
