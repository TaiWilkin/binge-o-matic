import { MockedProvider } from "@apollo/client/testing";
import { render, screen } from "@testing-library/react";
import React from "react";
import { BrowserRouter } from "react-router-dom";

import Nav from "../../src/components/Nav.jsx";

// Mock react-router-dom hooks
const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

// Mock the Nav query
jest.mock("../../src/queries/Lists", () => ({
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
const TestWrapper = ({ children, mocks = [] }) => (
  <MockedProvider mocks={mocks} addTypename={false}>
    <BrowserRouter>{children}</BrowserRouter>
  </MockedProvider>
);

describe("Nav Component", () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

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

    it("should render About link", () => {
      render(
        <TestWrapper>
          <Nav />
        </TestWrapper>,
      );

      const aboutLink = screen.getByRole("link", { name: /about/i });
      expect(aboutLink).toBeInTheDocument();
      expect(aboutLink).toHaveAttribute("href", "/about");
    });

    it("should render New List link when user is logged in", () => {
      render(
        <TestWrapper>
          <Nav />
        </TestWrapper>,
      );

      const newListLink = screen.getByRole("link", { name: /new list/i });
      expect(newListLink).toBeInTheDocument();
      expect(newListLink).toHaveAttribute("href", "/newlist");
    });

    it("should render nav lists sections", () => {
      render(
        <TestWrapper>
          <Nav />
        </TestWrapper>,
      );

      const navLists = screen.getAllByTestId("nav-lists");
      expect(navLists).toHaveLength(2);
      expect(navLists[0]).toHaveTextContent("Lists");
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

  describe("Link Navigation", () => {
    it("should have correct href for About link", () => {
      render(
        <TestWrapper>
          <Nav />
        </TestWrapper>,
      );

      const aboutLink = screen.getByRole("link", { name: /about/i });
      expect(aboutLink).toHaveAttribute("href", "/about");
    });

    it("should have correct href for New List link", () => {
      render(
        <TestWrapper>
          <Nav />
        </TestWrapper>,
      );

      const newListLink = screen.getByRole("link", { name: /new list/i });
      expect(newListLink).toHaveAttribute("href", "/newlist");
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
