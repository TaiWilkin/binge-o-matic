import { gql } from "@apollo/client";

import CurrentUserQuery from "../../src/queries/CurrentUser.js";

describe("CurrentUser Query", () => {
  it("should be defined", () => {
    expect(CurrentUserQuery).toBeDefined();
  });

  it("should have the correct operation type", () => {
    expect(CurrentUserQuery.definitions[0].operation).toBe("query");
  });

  it("should have the correct structure", () => {
    const definition = CurrentUserQuery.definitions[0];
    expect(definition.kind).toBe("OperationDefinition");
    expect(definition.operation).toBe("query");
  });

  it("should select user fields", () => {
    const userSelection =
      CurrentUserQuery.definitions[0].selectionSet.selections.find(
        (selection) => selection.name.value === "user",
      );

    expect(userSelection).toBeDefined();

    const userFields = userSelection.selectionSet.selections.map(
      (selection) => selection.name.value,
    );

    expect(userFields).toContain("id");
    expect(userFields).toContain("email");
  });

  it("should be a valid GraphQL query", () => {
    expect(() => {
      gql`
        ${CurrentUserQuery.loc.source.body}
      `;
    }).not.toThrow();
  });

  it("should match expected query string", () => {
    const expectedQuery = `
      {
        user {
          id
          __typename
          email
        }
      }
    `;

    // Parse both queries to compare structure rather than exact string
    const parsedExpected = gql(expectedQuery);
    expect(CurrentUserQuery.definitions).toEqual(parsedExpected.definitions);
  });
});
