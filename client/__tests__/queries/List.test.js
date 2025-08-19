import gql from "graphql-tag";

import ListQuery from "../../src/queries/List.js";

describe("List Query", () => {
  it("should be defined", () => {
    expect(ListQuery).toBeDefined();
  });

  it("should have the correct operation type", () => {
    expect(ListQuery.definitions[0].operation).toBe("query");
  });

  it("should have the correct name", () => {
    expect(ListQuery.definitions[0].name.value).toBe("List");
  });

  it("should have the correct structure", () => {
    const definition = ListQuery.definitions[0];
    expect(definition.kind).toBe("OperationDefinition");
    expect(definition.operation).toBe("query");
  });

  it("should have optional ID variable", () => {
    const variables = ListQuery.definitions[0].variableDefinitions;
    expect(variables).toHaveLength(1);

    const idVar = variables[0];
    expect(idVar.variable.name.value).toBe("id");
    expect(idVar.type.name.value).toBe("ID");
    // Should be optional (not NonNullType)
    expect(idVar.type.kind).toBe("NamedType");
  });

  it("should select user fields", () => {
    const userSelection = ListQuery.definitions[0].selectionSet.selections.find(
      (selection) => selection.name.value === "user",
    );

    expect(userSelection).toBeDefined();

    const userFields = userSelection.selectionSet.selections.map(
      (selection) => selection.name.value,
    );

    expect(userFields).toContain("id");
  });

  it("should select list fields with comprehensive media data", () => {
    const listSelection = ListQuery.definitions[0].selectionSet.selections.find(
      (selection) => selection.name.value === "list",
    );

    expect(listSelection).toBeDefined();
    expect(listSelection.arguments[0].name.value).toBe("id");

    const listFields = listSelection.selectionSet.selections.map(
      (selection) => selection.name.value,
    );

    expect(listFields).toContain("id");
    expect(listFields).toContain("name");
    expect(listFields).toContain("media");
    expect(listFields).toContain("user");

    // Check media fields
    const mediaSelection = listSelection.selectionSet.selections.find(
      (selection) => selection.name.value === "media",
    );
    const mediaFields = mediaSelection.selectionSet.selections.map(
      (selection) => selection.name.value,
    );

    expect(mediaFields).toContain("id");
    expect(mediaFields).toContain("media_id");
    expect(mediaFields).toContain("title");
    expect(mediaFields).toContain("release_date");
    expect(mediaFields).toContain("poster_path");
    expect(mediaFields).toContain("media_type");
    expect(mediaFields).toContain("number");
    expect(mediaFields).toContain("isWatched");
    expect(mediaFields).toContain("parent_show");
    expect(mediaFields).toContain("parent_season");
    expect(mediaFields).toContain("episode");
    expect(mediaFields).toContain("show_children");
  });

  it("should be a valid GraphQL query", () => {
    expect(() => {
      gql`
        ${ListQuery.loc.source.body}
      `;
    }).not.toThrow();
  });

  it("should match expected query string", () => {
    const expectedQuery = `
      query List($id: ID) {
        user {
          id
        }
        list(id: $id) {
          id
          name
          media {
            id
            media_id
            title
            release_date
            poster_path
            media_type
            number
            isWatched
            parent_show
            parent_season
            episode
            show_children
          }
          user
        }
      }
    `;

    // Parse both queries to compare structure rather than exact string
    const parsedExpected = gql(expectedQuery);
    expect(ListQuery.definitions).toEqual(parsedExpected.definitions);
  });

  it("should pass ID variable correctly", () => {
    const listSelection = ListQuery.definitions[0].selectionSet.selections.find(
      (selection) => selection.name.value === "list",
    );

    const argument = listSelection.arguments[0];
    expect(argument.name.value).toBe("id");
    expect(argument.value.kind).toBe("Variable");
    expect(argument.value.name.value).toBe("id");
  });

  it("should have exactly two top-level selections", () => {
    const selections = ListQuery.definitions[0].selectionSet.selections;
    expect(selections).toHaveLength(2);

    const selectionNames = selections.map((selection) => selection.name.value);
    expect(selectionNames).toContain("user");
    expect(selectionNames).toContain("list");
  });
});
