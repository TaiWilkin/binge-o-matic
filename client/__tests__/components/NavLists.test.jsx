import { render, screen } from "@testing-library/react";
import React from "react";
import { BrowserRouter } from "react-router-dom";

import NavLists from "../../src/components/NavLists.jsx";

// Wrapper component to provide Router context
const RouterWrapper = ({ children }) => (
  <BrowserRouter>{children}</BrowserRouter>
);

describe("NavLists Component", () => {
  const mockLists = [
    { id: "1", name: "My First List" },
    { id: "2", name: "My Second List" },
    { id: "3", name: "My Third List" },
  ];

  describe("Rendering", () => {
    it("should render null if no lists are provided", () => {
      render(
        <RouterWrapper>
          <NavLists />
        </RouterWrapper>,
      );

      const listElement = screen.queryByRole("listitem");
      expect(listElement).not.toBeInTheDocument();
    });

    it("should render null if empty lists array is provided", () => {
      render(
        <RouterWrapper>
          <NavLists lists={[]} title="Empty Lists" />
        </RouterWrapper>,
      );

      const listElement = screen.queryByRole("listitem");
      expect(listElement).not.toBeInTheDocument();
    });

    it("should render a navigation button for each list item", () => {
      render(
        <RouterWrapper>
          <NavLists lists={mockLists} title="My Lists" />
        </RouterWrapper>,
      );

      // Check that the dropdown is rendered
      const dropdown = screen.getByRole("listitem");
      expect(dropdown).toBeInTheDocument();
      expect(dropdown).toHaveClass("dropdown");

      // Check that the title button is rendered
      const titleButton = screen.getByRole("button", { name: "My Lists" });
      expect(titleButton).toBeInTheDocument();
      expect(titleButton).toHaveClass("dropbtn");

      // Check that a link is rendered for each list item
      const listLinks = screen.getAllByRole("link");
      // Should have one link per list item
      expect(listLinks).toHaveLength(mockLists.length);

      // Check that each list has its own link with correct text and href
      mockLists.forEach((list) => {
        const listLink = screen.getByRole("link", { name: list.name });
        expect(listLink).toBeInTheDocument();
        expect(listLink).toHaveClass("dropdown-btn");
        expect(listLink).toHaveAttribute("href", `/lists/${list.id}`);
      });
    });

    it("should render correct number of elements for different list sizes", () => {
      const singleList = [{ id: "1", name: "Single List" }];

      const { rerender } = render(
        <RouterWrapper>
          <NavLists lists={singleList} title="Single List" />
        </RouterWrapper>,
      );

      // Should have 1 title button + 1 list link
      expect(screen.getAllByRole("button")).toHaveLength(1); // Only the title button
      expect(screen.getAllByRole("link")).toHaveLength(1); // Only one list link

      // Rerender with more lists
      rerender(
        <RouterWrapper>
          <NavLists lists={mockLists} title="Multiple Lists" />
        </RouterWrapper>,
      );

      // Should have 1 title button + 3 list links
      expect(screen.getAllByRole("button")).toHaveLength(1); // Only the title button
      expect(screen.getAllByRole("link")).toHaveLength(3); // Three list links
    });
  });

  describe("Link Navigation", () => {
    it("should render correct link URLs for list navigation", () => {
      render(
        <RouterWrapper>
          <NavLists lists={mockLists} title="My Lists" />
        </RouterWrapper>,
      );

      // Check that the first list link has the correct href
      const firstListLink = screen.getByRole("link", {
        name: "My First List",
      });
      expect(firstListLink).toHaveAttribute("href", "/lists/1");
    });

    it("should render correct URL for different list items", () => {
      render(
        <RouterWrapper>
          <NavLists lists={mockLists} title="My Lists" />
        </RouterWrapper>,
      );

      // Test each list link has correct href
      mockLists.forEach((list) => {
        const listLink = screen.getByRole("link", { name: list.name });
        expect(listLink).toHaveAttribute("href", `/lists/${list.id}`);
      });
    });

    it("should not have navigation properties on title button", () => {
      render(
        <RouterWrapper>
          <NavLists lists={mockLists} title="My Lists" />
        </RouterWrapper>,
      );

      const titleButton = screen.getByRole("button", { name: "My Lists" });

      // Title button should be a button, not a link
      expect(titleButton.tagName).toBe("BUTTON");
      expect(titleButton).not.toHaveAttribute("href");
    });
  });

  describe("Component Integration", () => {
    it("should render without Router context error", () => {
      expect(() => {
        render(
          <RouterWrapper>
            <NavLists />
          </RouterWrapper>,
        );
      }).not.toThrow();
    });

    it("should be exported as default", () => {
      expect(NavLists).toBeDefined();
      expect(typeof NavLists).toBe("function");
    });
  });
});
