import { gql } from "@apollo/client";

import ListsQuery from "../../src/queries/Lists.js";

describe("Lists Query", () => {
  it("should be defined", () => {
    expect(ListsQuery).toBeDefined();
  });

  it("should have the correct operation type", () => {
    expect(ListsQuery.definitions[0].operation).toBe("query");
  });

  it("should have the correct structure", () => {
    const definition = ListsQuery.definitions[0];
    expect(definition.kind).toBe("OperationDefinition");
    expect(definition.operation).toBe("query");
  });

  it("should not have variables", () => {
    const variables = ListsQuery.definitions[0].variableDefinitions;
    expect(variables).toHaveLength(0);
  });

  it("should select lists fields", () => {
    const listsSelection =
      ListsQuery.definitions[0].selectionSet.selections.find(
        (selection) => selection.name.value === "lists",
      );

    expect(listsSelection).toBeDefined();

    const listFields = listsSelection.selectionSet.selections.map(
      (selection) => selection.name.value,
    );

    expect(listFields).toContain("id");
    expect(listFields).toContain("name");
    expect(listFields).toContain("user");
  });

  it("should be a valid GraphQL query", () => {
    expect(() => {
      gql`
        ${ListsQuery.loc.source.body}
      `;
    }).not.toThrow();
  });

  it("should match expected query string", () => {
    const expectedQuery = `
      query GetLists {
        lists {
          id
          __typename
          name
          user
        }
      }
    `;

    // Parse both queries to compare structure rather than exact string
    const parsedExpected = gql(expectedQuery);
    expect(ListsQuery.definitions).toEqual(parsedExpected.definitions);
  });

  it("should have exactly one top-level selection", () => {
    const selections = ListsQuery.definitions[0].selectionSet.selections;
    expect(selections).toHaveLength(1);

    const selectionNames = selections.map((selection) => selection.name.value);
    expect(selectionNames).toContain("lists");
  });
});
