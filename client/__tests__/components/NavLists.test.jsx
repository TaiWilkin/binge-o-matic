import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import { BrowserRouter } from "react-router-dom";

import NavLists from "../../src/components/NavLists.jsx";

// Mock react-router-dom hooks
const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

// Wrapper component to provide Router context
const RouterWrapper = ({ children }) => (
  <BrowserRouter>{children}</BrowserRouter>
);

describe("NavLists Component", () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

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

      // Check that a button is rendered for each list item
      const listButtons = screen.getAllByRole("button");
      // Should have title button + one button per list item
      expect(listButtons).toHaveLength(mockLists.length + 1);

      // Check that each list has its own button with correct text
      mockLists.forEach((list) => {
        const listButton = screen.getByRole("button", { name: list.name });
        expect(listButton).toBeInTheDocument();
        expect(listButton).toHaveClass("dropdown-btn");
      });
    });

    it("should render correct number of buttons for different list sizes", () => {
      const singleList = [{ id: "1", name: "Single List" }];

      const { rerender } = render(
        <RouterWrapper>
          <NavLists lists={singleList} title="Single List" />
        </RouterWrapper>,
      );

      // Should have title button + 1 list button
      expect(screen.getAllByRole("button")).toHaveLength(2);

      // Rerender with more lists
      rerender(
        <RouterWrapper>
          <NavLists lists={mockLists} title="Multiple Lists" />
        </RouterWrapper>,
      );

      // Should have title button + 3 list buttons
      expect(screen.getAllByRole("button")).toHaveLength(4);
    });
  });

  describe("Button Interactions", () => {
    it("should navigate to correct list URL when list button is clicked", () => {
      render(
        <RouterWrapper>
          <NavLists lists={mockLists} title="My Lists" />
        </RouterWrapper>,
      );

      // Click on the first list button
      const firstListButton = screen.getByRole("button", {
        name: "My First List",
      });
      fireEvent.click(firstListButton);

      expect(mockNavigate).toHaveBeenCalledWith("/lists/1");
      expect(mockNavigate).toHaveBeenCalledTimes(1);
    });

    it("should navigate to correct URL for different list items", () => {
      render(
        <RouterWrapper>
          <NavLists lists={mockLists} title="My Lists" />
        </RouterWrapper>,
      );

      // Test each list button
      mockLists.forEach((list, index) => {
        const listButton = screen.getByRole("button", { name: list.name });
        fireEvent.click(listButton);

        expect(mockNavigate).toHaveBeenCalledWith(`/lists/${list.id}`);
        expect(mockNavigate).toHaveBeenCalledTimes(index + 1);
      });
    });

    it("should not navigate when title button is clicked", () => {
      render(
        <RouterWrapper>
          <NavLists lists={mockLists} title="My Lists" />
        </RouterWrapper>,
      );

      const titleButton = screen.getByRole("button", { name: "My Lists" });
      fireEvent.click(titleButton);

      // Title button should not trigger navigation
      expect(mockNavigate).not.toHaveBeenCalled();
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
