import gql from "graphql-tag";

import NavQuery from "../../src/queries/Nav.js";

describe("Nav Query", () => {
  it("should be defined", () => {
    expect(NavQuery).toBeDefined();
  });

  it("should have the correct operation type", () => {
    expect(NavQuery.definitions[0].operation).toBe("query");
  });

  it("should have the correct structure", () => {
    const definition = NavQuery.definitions[0];
    expect(definition.kind).toBe("OperationDefinition");
    expect(definition.operation).toBe("query");
  });

  it("should not have variables", () => {
    const variables = NavQuery.definitions[0].variableDefinitions;
    expect(variables).toHaveLength(0);
  });

  it("should select user fields", () => {
    const userSelection = NavQuery.definitions[0].selectionSet.selections.find(
      (selection) => selection.name.value === "user",
    );

    expect(userSelection).toBeDefined();

    const userFields = userSelection.selectionSet.selections.map(
      (selection) => selection.name.value,
    );

    expect(userFields).toContain("id");
    expect(userFields).toContain("email");
    expect(userFields).toContain("lists");

    // Check nested lists fields
    const listsSelection = userSelection.selectionSet.selections.find(
      (selection) => selection.name.value === "lists",
    );
    const listFields = listsSelection.selectionSet.selections.map(
      (selection) => selection.name.value,
    );
    expect(listFields).toContain("id");
    expect(listFields).toContain("name");
  });

  it("should select top-level lists fields", () => {
    const listsSelection = NavQuery.definitions[0].selectionSet.selections.find(
      (selection) => selection.name.value === "lists",
    );

    expect(listsSelection).toBeDefined();

    const listFields = listsSelection.selectionSet.selections.map(
      (selection) => selection.name.value,
    );

    expect(listFields).toContain("id");
    expect(listFields).toContain("name");
  });

  it("should be a valid GraphQL query", () => {
    expect(() => {
      gql`
        ${NavQuery.loc.source.body}
      `;
    }).not.toThrow();
  });

  it("should match expected query string", () => {
    const expectedQuery = `
      {
        user {
          id
          email
          lists {
            id
            name
          }
        }
        lists {
          id
          name
        }
      }
    `;

    // Parse both queries to compare structure rather than exact string
    const parsedExpected = gql(expectedQuery);
    expect(NavQuery.definitions).toEqual(parsedExpected.definitions);
  });

  it("should have exactly two top-level selections", () => {
    const selections = NavQuery.definitions[0].selectionSet.selections;
    expect(selections).toHaveLength(2);

    const selectionNames = selections.map((selection) => selection.name.value);
    expect(selectionNames).toContain("user");
    expect(selectionNames).toContain("lists");
  });
});
