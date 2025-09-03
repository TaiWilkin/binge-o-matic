import { MockedProvider } from "@apollo/client/testing";
import { render, screen, waitFor } from "@testing-library/react";
import React from "react";
import { BrowserRouter } from "react-router-dom";

import Nav from "../../src/components/Nav.jsx";
import CurrentUserQuery from "../../src/queries/CurrentUser";

// Mock react-router-dom hooks
const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

// Mock the child components to avoid complex dependency chains
jest.mock("../../src/components/AuthButton.jsx", () => {
  return function MockAuthButton({ user }) {
    return <button>{user ? "Logout" : "Login"}</button>;
  };
});

jest.mock("../../src/components/NavLists.jsx", () => {
  return function MockNavLists({ title }) {
    return <div data-testid="nav-lists">{title}</div>;
  };
});

// Create Apollo mocks for different user states
const createUserLoggedInMock = () => ({
  request: {
    query: CurrentUserQuery,
  },
  result: {
    data: {
      user: {
        id: "1",
        email: "test@example.com",
      },
    },
  },
});

const createUserLoggedOutMock = () => ({
  request: {
    query: CurrentUserQuery,
  },
  result: {
    data: {
      user: null,
    },
  },
});

// Wrapper component to provide Router and Apollo context
const TestWrapper = ({ children, mocks = [] }) => (
  <MockedProvider mocks={mocks}>
    <BrowserRouter>{children}</BrowserRouter>
  </MockedProvider>
);

describe("Nav Component", () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  describe("Rendering", () => {
    it("should render the <nav> element", async () => {
      const mocks = [createUserLoggedInMock()];

      render(
        <TestWrapper mocks={mocks}>
          <Nav />
        </TestWrapper>,
      );

      const navElement = screen.getByRole("navigation");
      expect(navElement).toBeInTheDocument();
    });

    it("should render About link", async () => {
      const mocks = [createUserLoggedInMock()];

      render(
        <TestWrapper mocks={mocks}>
          <Nav />
        </TestWrapper>,
      );

      const aboutLink = screen.getByRole("link", { name: /about/i });
      expect(aboutLink).toBeInTheDocument();
      expect(aboutLink).toHaveAttribute("href", "/about");
    });

    it("should render New List link when user is logged in", async () => {
      const mocks = [createUserLoggedInMock()];

      render(
        <TestWrapper mocks={mocks}>
          <Nav />
        </TestWrapper>,
      );

      // Wait for the query to resolve
      await waitFor(() => {
        const newListLink = screen.getByRole("link", { name: /new list/i });
        expect(newListLink).toBeInTheDocument();
        expect(newListLink).toHaveAttribute("href", "/newlist");
      });
    });

    it("should NOT render New List link when user is NOT logged in", async () => {
      const mocks = [createUserLoggedOutMock()];

      render(
        <TestWrapper mocks={mocks}>
          <Nav />
        </TestWrapper>,
      );

      // Wait for the query to resolve
      await waitFor(() => {
        const newListLink = screen.queryByRole("link", { name: /new list/i });
        expect(newListLink).not.toBeInTheDocument();
      });
    });

    it("should render nav lists sections when logged in", async () => {
      const mocks = [createUserLoggedInMock()];

      render(
        <TestWrapper mocks={mocks}>
          <Nav />
        </TestWrapper>,
      );

      await waitFor(() => {
        const navLists = screen.getAllByTestId("nav-lists");
        expect(navLists).toHaveLength(2);
        expect(navLists[0]).toHaveTextContent("Lists");
        expect(navLists[1]).toHaveTextContent("My Lists");
      });
    });

    it("should NOT render nav lists sections when NOT logged in", async () => {
      const mocks = [createUserLoggedOutMock()];

      render(
        <TestWrapper mocks={mocks}>
          <Nav />
        </TestWrapper>,
      );

      await waitFor(() => {
        const navLists = screen.queryAllByTestId("nav-lists");
        // When logged out, should show just the public "Lists" section
        expect(navLists).toHaveLength(1);
        expect(navLists[0]).toHaveTextContent("Lists");
      });
    });

    it("should render auth button when logged in", async () => {
      const mocks = [createUserLoggedInMock()];

      render(
        <TestWrapper mocks={mocks}>
          <Nav />
        </TestWrapper>,
      );

      await waitFor(() => {
        expect(screen.getByText("Logout")).toBeInTheDocument();
      });
    });

    it("should render auth button when logged out", async () => {
      const mocks = [createUserLoggedOutMock()];

      render(
        <TestWrapper mocks={mocks}>
          <Nav />
        </TestWrapper>,
      );

      await waitFor(() => {
        expect(screen.getByText("Login")).toBeInTheDocument();
      });
    });
  });

  describe("Link Navigation", () => {
    it("should have correct href for About link", async () => {
      const mocks = [createUserLoggedInMock()];

      render(
        <TestWrapper mocks={mocks}>
          <Nav />
        </TestWrapper>,
      );

      const aboutLink = screen.getByRole("link", { name: /about/i });
      expect(aboutLink).toHaveAttribute("href", "/about");
    });

    it("should have correct href for New List link", async () => {
      const mocks = [createUserLoggedInMock()];

      render(
        <TestWrapper mocks={mocks}>
          <Nav />
        </TestWrapper>,
      );

      await waitFor(() => {
        const newListLink = screen.getByRole("link", { name: /new list/i });
        expect(newListLink).toHaveAttribute("href", "/newlist");
      });
    });
  });

  describe("User Authentication State", () => {
    it("should render logged-in user UI when data.user exists", async () => {
      const mocks = [createUserLoggedInMock()];

      render(
        <TestWrapper mocks={mocks}>
          <Nav />
        </TestWrapper>,
      );

      await waitFor(() => {
        // Should show both "Lists" and "My Lists" when logged in
        const navLists = screen.getAllByTestId("nav-lists");
        expect(navLists).toHaveLength(2);
        expect(navLists[0]).toHaveTextContent("Lists");
        expect(navLists[1]).toHaveTextContent("My Lists");

        // Should show "New List" link when logged in
        expect(
          screen.getByRole("link", { name: /new list/i }),
        ).toBeInTheDocument();
      });
    });

    it("should render logged-out user UI when no user data", async () => {
      const mocks = [createUserLoggedOutMock()];

      render(
        <TestWrapper mocks={mocks}>
          <Nav />
        </TestWrapper>,
      );

      await waitFor(() => {
        // Should only show "Lists" when logged out (not "My Lists")
        const navLists = screen.getAllByTestId("nav-lists");
        expect(navLists).toHaveLength(1);
        expect(navLists[0]).toHaveTextContent("Lists");

        // Should NOT show "New List" link when logged out
        expect(
          screen.queryByRole("link", { name: /new list/i }),
        ).not.toBeInTheDocument();
      });
    });
  });

  describe("Component Integration", () => {
    it("should render without Router context error", () => {
      const mocks = [createUserLoggedInMock()];

      expect(() => {
        render(
          <TestWrapper mocks={mocks}>
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
      const mocks = [createUserLoggedInMock()];

      expect(() => {
        render(
          <TestWrapper mocks={mocks}>
            <Nav />
          </TestWrapper>,
        );
      }).not.toThrow();
    });
  });
});
