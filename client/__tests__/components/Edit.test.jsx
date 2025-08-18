import { MockedProvider } from "@apollo/client/testing";
import { render } from "@testing-library/react";
import React from "react";
import { BrowserRouter } from "react-router-dom";

// Mock react-router-dom hooks
const mockNavigate = jest.fn();
const mockParams = { id: "123" };

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
  useParams: () => mockParams,
}));

// Mock the mutations and queries
jest.mock("../../src/mutations/DeleteList", () => ({
  __esModule: true,
  default: {
    kind: "Document",
    definitions: [
      {
        kind: "OperationDefinition",
        operation: "mutation",
        name: { kind: "Name", value: "DeleteList" },
        selectionSet: {
          kind: "SelectionSet",
          selections: [
            {
              kind: "Field",
              name: { kind: "Name", value: "deleteList" },
              arguments: [
                {
                  kind: "Argument",
                  name: { kind: "Name", value: "id" },
                  value: {
                    kind: "Variable",
                    name: { kind: "Name", value: "id" },
                  },
                },
              ],
            },
          ],
        },
      },
    ],
  },
}));

jest.mock("../../src/mutations/EditList", () => ({
  __esModule: true,
  default: {
    kind: "Document",
    definitions: [
      {
        kind: "OperationDefinition",
        operation: "mutation",
        name: { kind: "Name", value: "EditList" },
        selectionSet: {
          kind: "SelectionSet",
          selections: [
            {
              kind: "Field",
              name: { kind: "Name", value: "editList" },
              arguments: [
                {
                  kind: "Argument",
                  name: { kind: "Name", value: "id" },
                  value: {
                    kind: "Variable",
                    name: { kind: "Name", value: "id" },
                  },
                },
                {
                  kind: "Argument",
                  name: { kind: "Name", value: "name" },
                  value: {
                    kind: "Variable",
                    name: { kind: "Name", value: "name" },
                  },
                },
              ],
            },
          ],
        },
      },
    ],
  },
}));

jest.mock("../../src/queries/List", () => ({
  __esModule: true,
  default: {
    kind: "Document",
    definitions: [
      {
        kind: "OperationDefinition",
        operation: "query",
        name: { kind: "Name", value: "List" },
        selectionSet: {
          kind: "SelectionSet",
          selections: [
            {
              kind: "Field",
              name: { kind: "Name", value: "list" },
              selectionSet: {
                kind: "SelectionSet",
                selections: [
                  { kind: "Field", name: { kind: "Name", value: "id" } },
                  { kind: "Field", name: { kind: "Name", value: "name" } },
                ],
              },
            },
          ],
        },
      },
    ],
  },
}));

// Mock the HOC
jest.mock("../../src/components/requireAuth", () => {
  return (Component) => {
    const MockedComponent = (props) => <Component {...props} />;
    MockedComponent.displayName = `requireAuth(${Component.displayName || Component.name || "Component"})`;
    return MockedComponent;
  };
});

// Import after mocking
import Edit from "../../src/components/Edit.jsx";

// Wrapper component to provide Router context
const RouterWrapper = ({ children }) => (
  <MockedProvider addTypename={false}>
    <BrowserRouter>{children}</BrowserRouter>
  </MockedProvider>
);

describe("Edit Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Rendering", () => {
    it("should render without crashing", () => {
      render(
        <RouterWrapper>
          <Edit />
        </RouterWrapper>,
      );

      // The component should render something (likely loading initially)
      expect(document.body).toContainHTML("<div");
    });
  });

  describe("Component Integration", () => {
    it("should render without Router context error", () => {
      expect(() => {
        render(
          <RouterWrapper>
            <Edit />
          </RouterWrapper>,
        );
      }).not.toThrow();
    });

    it("should be exported as default", () => {
      expect(Edit).toBeDefined();
      expect(typeof Edit).toBe("function");
    });
  });
});
