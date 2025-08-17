import { describe, expect, it } from "@jest/globals";
import { print } from "graphql";

import CurrentUser from "../../src/queries/CurrentUser.js";

describe("CurrentUser Query", () => {
  it("should have the correct GraphQL query structure", () => {
    const queryString = print(CurrentUser);

    // Verify the query contains the expected fields
    expect(queryString).toContain("user");
    expect(queryString).toContain("id");
    expect(queryString).toContain("email");
  });

  it("should be a valid GraphQL document", () => {
    expect(CurrentUser).toBeDefined();
    expect(CurrentUser.kind).toBe("Document");
    expect(CurrentUser.definitions).toHaveLength(1);
  });

  it("should have the correct operation type", () => {
    const definition = CurrentUser.definitions[0];
    expect(definition.kind).toBe("OperationDefinition");
    expect(definition.operation).toBe("query");
  });

  it("should request user fields correctly", () => {
    const definition = CurrentUser.definitions[0];
    const userSelection = definition.selectionSet.selections[0];

    expect(userSelection.name.value).toBe("user");
    expect(userSelection.selectionSet.selections).toHaveLength(2);

    const fieldNames = userSelection.selectionSet.selections.map(
      (selection) => selection.name.value,
    );

    expect(fieldNames).toContain("id");
    expect(fieldNames).toContain("email");
  });

  it("should match the expected query string format", () => {
    const queryString = print(CurrentUser);
    const normalizedQuery = queryString.replace(/\s+/g, " ").trim();

    expect(normalizedQuery).toBe("{ user { id email } }");
  });
});
