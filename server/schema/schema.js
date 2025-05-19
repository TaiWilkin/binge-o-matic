import graphql from "graphql";

import mutation from "./mutations.js";
import RootQueryType from "./types/root_query_type.js";

const { GraphQLSchema } = graphql;

export default new GraphQLSchema({
  query: RootQueryType,
  mutation,
});
