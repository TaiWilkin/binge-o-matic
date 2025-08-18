import { MockedProvider } from "@apollo/client/testing";
import { render, screen } from "@testing-library/react";
import React from "react";
import { BrowserRouter } from "react-router-dom";

import Nav from "../../src/components/Nav.jsx";

// Mock the Nav query
jest.mock("../../src/queries/Nav", () => ({
  __esModule: true,
  default: {
    kind: "Document",
    definitions: [
      {
        kind: "OperationDefinition",
        operation: "query",
        name: { kind: "Name", value: "Nav" },
      },
    ],
  },
}));

// Mock the child components to avoid complex dependency chains
jest.mock("../../src/components/AuthButton.jsx", () => {
  return function MockAuthButton() {
    return <button>Mock Auth Button</button>;
  };
});

jest.mock("../../src/components/NavLists.jsx", () => {
  return function MockNavLists({ title }) {
    return <div data-testid="nav-lists">{title}</div>;
  };
});

jest.mock("../../src/components/QueryHandler.jsx", () => {
  return function MockQueryHandler({ children }) {
    const mockData = {
      user: {
        id: "1",
        email: "test@example.com",
        lists: [{ id: "1", name: "My List" }],
      },
      lists: [{ id: "2", name: "Public List" }],
    };
    const mockClient = {};
    const loading = false;

    return children({ data: mockData, client: mockClient, loading });
  };
});

// Wrapper component to provide Router and Apollo context
const TestWrapper = ({ children }) => (
  <MockedProvider mocks={[]} addTypename={false}>
    <BrowserRouter>{children}</BrowserRouter>
  </MockedProvider>
);

describe("Nav Component", () => {
  describe("Rendering", () => {
    it("should render the <nav> element", () => {
      render(
        <TestWrapper>
          <Nav />
        </TestWrapper>,
      );

      const navElement = screen.getByRole("navigation");
      expect(navElement).toBeInTheDocument();
    });

    it("should render About button", () => {
      render(
        <TestWrapper>
          <Nav />
        </TestWrapper>,
      );

      const aboutButton = screen.getByRole("button", { name: /about/i });
      expect(aboutButton).toBeInTheDocument();
    });

    it("should render New List button when user is logged in", () => {
      render(
        <TestWrapper>
          <Nav />
        </TestWrapper>,
      );

      const newListButton = screen.getByRole("button", { name: /new list/i });
      expect(newListButton).toBeInTheDocument();
    });

    it("should render nav lists sections", () => {
      render(
        <TestWrapper>
          <Nav />
        </TestWrapper>,
      );

      const navLists = screen.getAllByTestId("nav-lists");
      expect(navLists).toHaveLength(2);
      expect(navLists[0]).toHaveTextContent("User-Managed Lists");
      expect(navLists[1]).toHaveTextContent("My Lists");
    });

    it("should render auth button", () => {
      render(
        <TestWrapper>
          <Nav />
        </TestWrapper>,
      );

      expect(screen.getByText("Mock Auth Button")).toBeInTheDocument();
    });
  });

  describe("Component Integration", () => {
    it("should render without Router context error", () => {
      expect(() => {
        render(
          <TestWrapper>
            <Nav />
          </TestWrapper>,
        );
      }).not.toThrow();
    });

    it("should be exported as default", () => {
      expect(Nav).toBeDefined();
      expect(typeof Nav).toBe("function");
    });

    it("should handle Apollo Provider correctly", () => {
      expect(() => {
        render(
          <TestWrapper>
            <Nav />
          </TestWrapper>,
        );
      }).not.toThrow();
    });
  });
});
