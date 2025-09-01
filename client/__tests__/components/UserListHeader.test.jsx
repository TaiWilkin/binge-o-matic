import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import { MemoryRouter } from "react-router-dom";

import UserListHeader from "../../src/components/UserListHeader.jsx";

describe("UserListHeader Component", () => {
  const defaultProps = {
    push: jest.fn(),
    onToggleWatched: jest.fn(),
    hideWatched: false,
    id: "123",
    name: "Test List",
  };

  // Helper function to render component with Router context
  const renderWithRouter = (component) => {
    return render(<MemoryRouter>{component}</MemoryRouter>);
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should be exported as a function", () => {
    expect(typeof UserListHeader).toBe("function");
  });

  describe("Component Rendering", () => {
    it("should render without errors", () => {
      expect(() => {
        renderWithRouter(<UserListHeader {...defaultProps} />);
      }).not.toThrow();
    });

    it("should display the list name", () => {
      renderWithRouter(<UserListHeader {...defaultProps} />);
      expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent(
        "Test List",
      );
    });

    it("should render all required buttons", () => {
      renderWithRouter(<UserListHeader {...defaultProps} />);

      expect(
        screen.getByRole("button", { name: /hide watched/i }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("link", { name: /edit list/i }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("link", { name: /add items/i }),
      ).toBeInTheDocument();
    });

    it("should have correct CSS classes", () => {
      const { container } = renderWithRouter(
        <UserListHeader {...defaultProps} />,
      );

      expect(container.querySelector(".header")).toBeInTheDocument();
      expect(container.querySelectorAll(".list-header-link")).toHaveLength(2); // EDIT LIST and ADD ITEMS links
    });
  });

  describe("Toggle Watched Button", () => {
    it("should show 'HIDE WATCHED' when hideWatched is false", () => {
      renderWithRouter(
        <UserListHeader {...defaultProps} hideWatched={false} />,
      );
      expect(
        screen.getByRole("button", { name: "HIDE WATCHED" }),
      ).toBeInTheDocument();
    });

    it("should show 'SHOW WATCHED' when hideWatched is true", () => {
      renderWithRouter(<UserListHeader {...defaultProps} hideWatched={true} />);
      expect(
        screen.getByRole("button", { name: "SHOW WATCHED" }),
      ).toBeInTheDocument();
    });

    it("should call onToggleWatched when clicked", async () => {
      const user = userEvent.setup();
      const mockToggle = jest.fn();

      renderWithRouter(
        <UserListHeader {...defaultProps} onToggleWatched={mockToggle} />,
      );

      const toggleButton = screen.getByRole("button", {
        name: /hide watched/i,
      });
      await user.click(toggleButton);

      expect(mockToggle).toHaveBeenCalledTimes(1);
    });

    it("should call onToggleWatched when clicked with fireEvent", () => {
      const mockToggle = jest.fn();

      renderWithRouter(
        <UserListHeader {...defaultProps} onToggleWatched={mockToggle} />,
      );

      const toggleButton = screen.getByRole("button", {
        name: /hide watched/i,
      });
      fireEvent.click(toggleButton);

      expect(mockToggle).toHaveBeenCalledTimes(1);
    });
  });

  describe("Edit List Link", () => {
    it("should render EDIT LIST link with correct href", () => {
      renderWithRouter(<UserListHeader {...defaultProps} id="456" />);

      const editLink = screen.getByRole("link", { name: "EDIT LIST" });
      expect(editLink).toBeInTheDocument();
      expect(editLink).toHaveAttribute("href", "/lists/456/edit");
    });

    it("should have correct link text", () => {
      renderWithRouter(<UserListHeader {...defaultProps} />);
      expect(
        screen.getByRole("link", { name: "EDIT LIST" }),
      ).toBeInTheDocument();
    });
  });

  describe("Add Items Link", () => {
    it("should render ADD ITEMS link with correct href", () => {
      renderWithRouter(<UserListHeader {...defaultProps} id="789" />);

      const addLink = screen.getByRole("link", { name: "ADD ITEMS" });
      expect(addLink).toBeInTheDocument();
      expect(addLink).toHaveAttribute("href", "/lists/789/search");
    });

    it("should have correct link text", () => {
      renderWithRouter(<UserListHeader {...defaultProps} />);
      expect(
        screen.getByRole("link", { name: "ADD ITEMS" }),
      ).toBeInTheDocument();
    });
  });

  describe("Component Integration", () => {
    it("should handle different list names", () => {
      renderWithRouter(
        <UserListHeader {...defaultProps} name="My Favorite Movies" />,
      );
      expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent(
        "My Favorite Movies",
      );
    });

    it("should handle empty list name", () => {
      renderWithRouter(<UserListHeader {...defaultProps} name="" />);
      expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent("");
    });

    it("should handle different list IDs in navigation", () => {
      renderWithRouter(<UserListHeader {...defaultProps} id="custom-123" />);

      const editLink = screen.getByRole("link", { name: "EDIT LIST" });
      expect(editLink).toHaveAttribute("href", "/lists/custom-123/edit");

      const addLink = screen.getByRole("link", { name: "ADD ITEMS" });
      expect(addLink).toHaveAttribute("href", "/lists/custom-123/search");
    });

    it("should toggle watched state correctly", async () => {
      const user = userEvent.setup();
      const mockToggle = jest.fn();

      const { rerender } = renderWithRouter(
        <UserListHeader
          {...defaultProps}
          onToggleWatched={mockToggle}
          hideWatched={false}
        />,
      );

      // Initial state
      expect(
        screen.getByRole("button", { name: "HIDE WATCHED" }),
      ).toBeInTheDocument();

      // Click toggle
      await user.click(screen.getByRole("button", { name: "HIDE WATCHED" }));
      expect(mockToggle).toHaveBeenCalledTimes(1);

      // Simulate state change
      rerender(
        <MemoryRouter>
          <UserListHeader
            {...defaultProps}
            onToggleWatched={mockToggle}
            hideWatched={true}
          />
        </MemoryRouter>,
      );

      expect(
        screen.getByRole("button", { name: "SHOW WATCHED" }),
      ).toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("should have proper semantic elements", () => {
      renderWithRouter(<UserListHeader {...defaultProps} />);

      expect(screen.getByRole("heading", { level: 2 })).toBeInTheDocument();
      expect(screen.getAllByRole("button")).toHaveLength(1); // Only HIDE/SHOW WATCHED button
      expect(screen.getAllByRole("link")).toHaveLength(2); // EDIT LIST and ADD ITEMS links
    });

    it("should have accessible button labels", () => {
      renderWithRouter(<UserListHeader {...defaultProps} />);

      const buttons = screen.getAllByRole("button");
      buttons.forEach((button) => {
        expect(button).toHaveAttribute("type", "button");
        expect(button.textContent).toBeTruthy();
      });
    });

    it("should maintain focus order", () => {
      renderWithRouter(<UserListHeader {...defaultProps} />);

      const buttons = screen.getAllByRole("button");
      const links = screen.getAllByRole("link");

      expect(buttons[0]).toHaveTextContent("HIDE WATCHED");
      expect(links[0]).toHaveTextContent("EDIT LIST");
      expect(links[1]).toHaveTextContent("ADD ITEMS");
    });
  });

  describe("Edge Cases", () => {
    it("should handle missing props gracefully", () => {
      expect(() => {
        renderWithRouter(<UserListHeader />);
      }).not.toThrow();
    });

    it("should handle null/undefined values", () => {
      const propsWithNulls = {
        push: jest.fn(),
        onToggleWatched: jest.fn(),
        hideWatched: null,
        id: null,
        name: null,
      };

      expect(() => {
        renderWithRouter(<UserListHeader {...propsWithNulls} />);
      }).not.toThrow();
    });

    it("should handle special characters in list name", () => {
      renderWithRouter(
        <UserListHeader
          {...defaultProps}
          name="List with & special <> characters"
        />,
      );
      expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent(
        "List with & special <> characters",
      );
    });

    it("should handle very long list names", () => {
      const longName = "A".repeat(100);
      renderWithRouter(<UserListHeader {...defaultProps} name={longName} />);
      expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent(
        longName,
      );
    });
  });
});
