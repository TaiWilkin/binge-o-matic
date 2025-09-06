import { gql } from "@apollo/client";
import { MockedProvider } from "@apollo/client/testing";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import React from "react";
import { BrowserRouter } from "react-router-dom";

import NavLists from "../../src/components/NavLists.jsx";

// Define the same query that NavLists uses
const GET_LISTS = gql`
  query GetLists {
    lists {
      id
      name
      user
    }
  }
`;

// Mock with delay to test loading state
const GET_LISTS_LOADING_MOCK = {
  request: {
    query: GET_LISTS,
  },
  result: {
    data: {
      lists: [
        { id: "1", name: "My First List", user: "user1" },
        { id: "2", name: "My Second List", user: "user1" },
        { id: "3", name: "Public List", user: "user2" },
      ],
    },
  },
  delay: 100, // Add delay to see loading state
};

// Mock the GET_LISTS query
const GET_LISTS_MOCK = {
  request: {
    query: GET_LISTS,
  },
  result: {
    data: {
      lists: [
        { id: "1", name: "My First List", user: "user1" },
        { id: "2", name: "My Second List", user: "user1" },
        { id: "3", name: "Public List", user: "user2" },
      ],
    },
  },
};

// Mock for error state
const GET_LISTS_ERROR_MOCK = {
  request: {
    query: GET_LISTS,
  },
  error: new Error("Failed to fetch lists"),
};

// Wrapper component to provide Router context and Apollo client
const TestWrapper = ({ children, mocks = [GET_LISTS_MOCK] }) => (
  <MockedProvider mocks={mocks}>
    <BrowserRouter>{children}</BrowserRouter>
  </MockedProvider>
);

describe("NavLists Component", () => {
  describe("Rendering", () => {
    it("should render dropdown without triggering query initially", () => {
      render(
        <TestWrapper>
          <NavLists title="My Lists" />
        </TestWrapper>,
      );

      const dropdown = screen.getByRole("listitem");
      expect(dropdown).toBeInTheDocument();
      expect(dropdown).toHaveClass("dropdown");

      const titleButton = screen.getByRole("button", { name: "My Lists" });
      expect(titleButton).toBeInTheDocument();
      expect(titleButton).toHaveClass("btn-nav");
    });

    it("should trigger query on mouse enter and show loading", async () => {
      render(
        <TestWrapper mocks={[GET_LISTS_LOADING_MOCK]}>
          <NavLists title="My Lists" userId="user1" />
        </TestWrapper>,
      );

      const dropdown = screen.getByRole("listitem");
      fireEvent.mouseEnter(dropdown);

      // Should show loading state
      expect(await screen.findByText("Loading...")).toBeInTheDocument();
    });

    it("should render list links after data loads for user's own lists", async () => {
      render(
        <TestWrapper>
          <NavLists title="My Lists" userId="user1" />
        </TestWrapper>,
      );

      const dropdown = screen.getByRole("listitem");
      fireEvent.mouseEnter(dropdown);

      // Wait for data to load and links to appear
      await waitFor(() => {
        expect(
          screen.getByRole("link", { name: "My First List" }),
        ).toBeInTheDocument();
        expect(
          screen.getByRole("link", { name: "My Second List" }),
        ).toBeInTheDocument();
      });

      // Should not show the public list (different user)
      expect(
        screen.queryByRole("link", { name: "Public List" }),
      ).not.toBeInTheDocument();
    });

    it("should filter lists when excludeUser is true", async () => {
      render(
        <TestWrapper>
          <NavLists title="Public Lists" userId="user1" excludeUser />
        </TestWrapper>,
      );

      const dropdown = screen.getByRole("listitem");
      fireEvent.mouseEnter(dropdown);

      // Wait for data to load
      await waitFor(() => {
        expect(
          screen.getByRole("link", { name: "Public List" }),
        ).toBeInTheDocument();
      });

      // Should not show user's own lists
      expect(
        screen.queryByRole("link", { name: "My First List" }),
      ).not.toBeInTheDocument();
      expect(
        screen.queryByRole("link", { name: "My Second List" }),
      ).not.toBeInTheDocument();
    });
    it("should show error message when query fails", async () => {
      render(
        <TestWrapper mocks={[GET_LISTS_ERROR_MOCK]}>
          <NavLists title="My Lists" userId="user1" />
        </TestWrapper>,
      );

      const dropdown = screen.getByRole("listitem");
      fireEvent.mouseEnter(dropdown);

      // Should show error state
      expect(
        await screen.findByText("Error loading lists"),
      ).toBeInTheDocument();
    });

    it("should only trigger query once on multiple mouse enters", async () => {
      render(
        <TestWrapper>
          <NavLists title="My Lists" userId="user1" />
        </TestWrapper>,
      );

      const dropdown = screen.getByRole("listitem");

      // Trigger multiple mouse enters
      fireEvent.mouseEnter(dropdown);
      fireEvent.mouseEnter(dropdown);
      fireEvent.mouseEnter(dropdown);

      // Should still load data normally (query should only be called once)
      await waitFor(() => {
        expect(
          screen.getByRole("link", { name: "My First List" }),
        ).toBeInTheDocument();
      });
    });
  });

  describe("Link Navigation", () => {
    it("should render correct link URLs for list navigation", async () => {
      render(
        <TestWrapper>
          <NavLists title="My Lists" userId="user1" />
        </TestWrapper>,
      );

      const dropdown = screen.getByRole("listitem");
      fireEvent.mouseEnter(dropdown);

      // Wait for data to load
      await waitFor(() => {
        const firstListLink = screen.getByRole("link", {
          name: "My First List",
        });
        expect(firstListLink).toHaveAttribute("href", "/lists/1");
      });
    });

    it("should render correct URLs for all filtered list items", async () => {
      render(
        <TestWrapper>
          <NavLists title="My Lists" userId="user1" />
        </TestWrapper>,
      );

      const dropdown = screen.getByRole("listitem");
      fireEvent.mouseEnter(dropdown);

      // Wait for data to load and check all user's lists
      await waitFor(() => {
        const firstListLink = screen.getByRole("link", {
          name: "My First List",
        });
        expect(firstListLink).toHaveAttribute("href", "/lists/1");

        const secondListLink = screen.getByRole("link", {
          name: "My Second List",
        });
        expect(secondListLink).toHaveAttribute("href", "/lists/2");
      });
    });

    it("should render links with correct CSS classes", async () => {
      render(
        <TestWrapper>
          <NavLists title="My Lists" userId="user1" />
        </TestWrapper>,
      );

      const dropdown = screen.getByRole("listitem");
      fireEvent.mouseEnter(dropdown);

      await waitFor(() => {
        const listLink = screen.getByRole("link", { name: "My First List" });
        expect(listLink).toHaveClass("btn-nav");
      });
    });

    it("should not have navigation properties on title button", () => {
      render(
        <TestWrapper>
          <NavLists title="My Lists" userId="user1" />
        </TestWrapper>,
      );

      const titleButton = screen.getByRole("button", { name: "My Lists" });

      // Title button should be a button, not a link
      expect(titleButton.tagName).toBe("BUTTON");
      expect(titleButton).not.toHaveAttribute("href");
      expect(titleButton).toHaveClass("btn-nav");
    });
  });

  describe("Filtering Behavior", () => {
    it("should show only user's lists when excludeUser is false", async () => {
      render(
        <TestWrapper>
          <NavLists title="My Lists" userId="user1" excludeUser={false} />
        </TestWrapper>,
      );

      const dropdown = screen.getByRole("listitem");
      fireEvent.mouseEnter(dropdown);

      await waitFor(() => {
        expect(
          screen.getByRole("link", { name: "My First List" }),
        ).toBeInTheDocument();
        expect(
          screen.getByRole("link", { name: "My Second List" }),
        ).toBeInTheDocument();
        expect(
          screen.queryByRole("link", { name: "Public List" }),
        ).not.toBeInTheDocument();
      });
    });

    it("should show only other users' lists when excludeUser is true", async () => {
      render(
        <TestWrapper>
          <NavLists title="Public Lists" userId="user1" excludeUser={true} />
        </TestWrapper>,
      );

      const dropdown = screen.getByRole("listitem");
      fireEvent.mouseEnter(dropdown);

      await waitFor(() => {
        expect(
          screen.getByRole("link", { name: "Public List" }),
        ).toBeInTheDocument();
        expect(
          screen.queryByRole("link", { name: "My First List" }),
        ).not.toBeInTheDocument();
        expect(
          screen.queryByRole("link", { name: "My Second List" }),
        ).not.toBeInTheDocument();
      });
    });

    it("should show no lists when userId is not provided and excludeUser is false", async () => {
      render(
        <TestWrapper>
          <NavLists title="All Lists" />
        </TestWrapper>,
      );

      const dropdown = screen.getByRole("listitem");
      fireEvent.mouseEnter(dropdown);

      // Wait a bit to ensure no lists appear (since userId is undefined, no lists match)
      await waitFor(() => {
        expect(screen.queryByRole("link")).not.toBeInTheDocument();
      });
    });
  });

  describe("Component Integration", () => {
    it("should render without Router context error", () => {
      expect(() => {
        render(
          <TestWrapper>
            <NavLists title="Test" />
          </TestWrapper>,
        );
      }).not.toThrow();
    });

    it("should be exported as default", () => {
      expect(NavLists).toBeDefined();
      expect(typeof NavLists).toBe("function");
    });

    it("should handle Apollo Provider correctly", () => {
      expect(() => {
        render(
          <TestWrapper>
            <NavLists title="Test" />
          </TestWrapper>,
        );
      }).not.toThrow();
    });
  });
});
