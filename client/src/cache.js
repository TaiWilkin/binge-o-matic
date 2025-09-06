import { InMemoryCache } from "@apollo/client";

export default new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        list: {
          keyArgs: ["id"],
          read(existing, { args, toReference }) {
            return (
              existing ||
              toReference({
                __typename: "ListType",
                id: args?.id,
              })
            );
          },
        },
        media: {
          keyArgs: ["searchQuery"],
        },
      },
    },
    UserType: {
      keyFields: ["id"],
    },
    ListType: {
      keyFields: ["id"],
      fields: {
        media: {
          keyArgs: false,
          merge(existing = [], incoming = []) {
            const merged = [...existing];
            incoming.forEach((item) => {
              if (!merged.some((ref) => ref.__ref === item.__ref)) {
                merged.push(item);
              }
            });
            return merged;
          },
        },
      },
    },
    MediaType: {
      keyFields: ["id"],
    },
  },
});
