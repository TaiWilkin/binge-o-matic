import gql from "graphql-tag";

import MediaQuery from "../../src/queries/Media.js";

describe("Media Query", () => {
  it("should be defined", () => {
    expect(MediaQuery).toBeDefined();
  });

  it("should have the correct operation type", () => {
    expect(MediaQuery.definitions[0].operation).toBe("query");
  });

  it("should have the correct name", () => {
    expect(MediaQuery.definitions[0].name.value).toBe("Media");
  });

  it("should have the correct structure", () => {
    const definition = MediaQuery.definitions[0];
    expect(definition.kind).toBe("OperationDefinition");
    expect(definition.operation).toBe("query");
  });

  it("should have required variables", () => {
    const variables = MediaQuery.definitions[0].variableDefinitions;
    expect(variables).toHaveLength(1);

    const searchQueryVar = variables[0];
    expect(searchQueryVar.variable.name.value).toBe("searchQuery");
    expect(searchQueryVar.type.type.name.value).toBe("String");
    expect(searchQueryVar.type.kind).toBe("NonNullType");
  });

  it("should select media fields", () => {
    const mediaSelection =
      MediaQuery.definitions[0].selectionSet.selections.find(
        (selection) => selection.name.value === "media",
      );

    expect(mediaSelection).toBeDefined();
    expect(mediaSelection.arguments[0].name.value).toBe("searchQuery");

    const mediaFields = mediaSelection.selectionSet.selections.map(
      (selection) => selection.name.value,
    );

    expect(mediaFields).toContain("id");
    expect(mediaFields).toContain("title");
    expect(mediaFields).toContain("release_date");
    expect(mediaFields).toContain("poster_path");
    expect(mediaFields).toContain("media_type");
    expect(mediaFields).toContain("number");
  });

  it("should be a valid GraphQL query", () => {
    expect(() => {
      gql`
        ${MediaQuery.loc.source.body}
      `;
    }).not.toThrow();
  });

  it("should match expected query string", () => {
    const expectedQuery = `
      query Media($searchQuery: String!) {
        media(searchQuery: $searchQuery) {
          id
          title
          release_date
          poster_path
          media_type
          number
        }
      }
    `;

    // Parse both queries to compare structure rather than exact string
    const parsedExpected = gql(expectedQuery);
    expect(MediaQuery.definitions).toEqual(parsedExpected.definitions);
  });

  it("should pass variables correctly", () => {
    const mediaSelection =
      MediaQuery.definitions[0].selectionSet.selections.find(
        (selection) => selection.name.value === "media",
      );

    const argument = mediaSelection.arguments[0];
    expect(argument.name.value).toBe("searchQuery");
    expect(argument.value.kind).toBe("Variable");
    expect(argument.value.name.value).toBe("searchQuery");
  });
});
