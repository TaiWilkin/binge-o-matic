import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";

import UserListHeader from "../../src/components/UserListHeader.jsx";

describe("UserListHeader Component", () => {
  const defaultProps = {
    push: jest.fn(),
    onToggleWatched: jest.fn(),
    hideWatched: false,
    id: "123",
    name: "Test List",
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
        render(<UserListHeader {...defaultProps} />);
      }).not.toThrow();
    });

    it("should display the list name", () => {
      render(<UserListHeader {...defaultProps} />);
      expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent(
        "Test List",
      );
    });

    it("should render all required buttons", () => {
      render(<UserListHeader {...defaultProps} />);

      expect(
        screen.getByRole("button", { name: /hide watched/i }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /edit list/i }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /add items/i }),
      ).toBeInTheDocument();
    });

    it("should have correct CSS classes", () => {
      const { container } = render(<UserListHeader {...defaultProps} />);

      expect(container.querySelector(".header")).toBeInTheDocument();
      expect(container.querySelectorAll(".edit-btn")).toHaveLength(3);
    });
  });

  describe("Toggle Watched Button", () => {
    it("should show 'HIDE WATCHED' when hideWatched is false", () => {
      render(<UserListHeader {...defaultProps} hideWatched={false} />);
      expect(
        screen.getByRole("button", { name: "HIDE WATCHED" }),
      ).toBeInTheDocument();
    });

    it("should show 'SHOW WATCHED' when hideWatched is true", () => {
      render(<UserListHeader {...defaultProps} hideWatched={true} />);
      expect(
        screen.getByRole("button", { name: "SHOW WATCHED" }),
      ).toBeInTheDocument();
    });

    it("should call onToggleWatched when clicked", async () => {
      const user = userEvent.setup();
      const mockToggle = jest.fn();

      render(<UserListHeader {...defaultProps} onToggleWatched={mockToggle} />);

      const toggleButton = screen.getByRole("button", {
        name: /hide watched/i,
      });
      await user.click(toggleButton);

      expect(mockToggle).toHaveBeenCalledTimes(1);
    });

    it("should call onToggleWatched when clicked with fireEvent", () => {
      const mockToggle = jest.fn();

      render(<UserListHeader {...defaultProps} onToggleWatched={mockToggle} />);

      const toggleButton = screen.getByRole("button", {
        name: /hide watched/i,
      });
      fireEvent.click(toggleButton);

      expect(mockToggle).toHaveBeenCalledTimes(1);
    });
  });

  describe("Edit List Button", () => {
    it("should call push with correct edit route when clicked", async () => {
      const user = userEvent.setup();
      const mockPush = jest.fn();

      render(<UserListHeader {...defaultProps} push={mockPush} id="456" />);

      const editButton = screen.getByRole("button", { name: "EDIT LIST" });
      await user.click(editButton);

      expect(mockPush).toHaveBeenCalledWith("/lists/456/edit");
    });

    it("should have correct button text", () => {
      render(<UserListHeader {...defaultProps} />);
      expect(
        screen.getByRole("button", { name: "EDIT LIST" }),
      ).toBeInTheDocument();
    });
  });

  describe("Add Items Button", () => {
    it("should call push with correct search route when clicked", async () => {
      const user = userEvent.setup();
      const mockPush = jest.fn();

      render(<UserListHeader {...defaultProps} push={mockPush} id="789" />);

      const addButton = screen.getByRole("button", { name: "ADD ITEMS" });
      await user.click(addButton);

      expect(mockPush).toHaveBeenCalledWith("/lists/789/search");
    });

    it("should have correct button text", () => {
      render(<UserListHeader {...defaultProps} />);
      expect(
        screen.getByRole("button", { name: "ADD ITEMS" }),
      ).toBeInTheDocument();
    });
  });

  describe("Component Integration", () => {
    it("should handle different list names", () => {
      render(<UserListHeader {...defaultProps} name="My Favorite Movies" />);
      expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent(
        "My Favorite Movies",
      );
    });

    it("should handle empty list name", () => {
      render(<UserListHeader {...defaultProps} name="" />);
      expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent("");
    });

    it("should handle different list IDs in navigation", async () => {
      const user = userEvent.setup();
      const mockPush = jest.fn();

      render(
        <UserListHeader {...defaultProps} push={mockPush} id="custom-123" />,
      );

      await user.click(screen.getByRole("button", { name: "EDIT LIST" }));
      expect(mockPush).toHaveBeenCalledWith("/lists/custom-123/edit");

      await user.click(screen.getByRole("button", { name: "ADD ITEMS" }));
      expect(mockPush).toHaveBeenCalledWith("/lists/custom-123/search");
    });

    it("should toggle watched state correctly", async () => {
      const user = userEvent.setup();
      const mockToggle = jest.fn();

      const { rerender } = render(
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
        <UserListHeader
          {...defaultProps}
          onToggleWatched={mockToggle}
          hideWatched={true}
        />,
      );

      expect(
        screen.getByRole("button", { name: "SHOW WATCHED" }),
      ).toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("should have proper semantic elements", () => {
      render(<UserListHeader {...defaultProps} />);

      expect(screen.getByRole("heading", { level: 2 })).toBeInTheDocument();
      expect(screen.getAllByRole("button")).toHaveLength(3);
    });

    it("should have accessible button labels", () => {
      render(<UserListHeader {...defaultProps} />);

      const buttons = screen.getAllByRole("button");
      buttons.forEach((button) => {
        expect(button).toHaveAttribute("type", "button");
        expect(button.textContent).toBeTruthy();
      });
    });

    it("should maintain focus order", () => {
      render(<UserListHeader {...defaultProps} />);

      const buttons = screen.getAllByRole("button");
      expect(buttons[0]).toHaveTextContent("HIDE WATCHED");
      expect(buttons[1]).toHaveTextContent("EDIT LIST");
      expect(buttons[2]).toHaveTextContent("ADD ITEMS");
    });
  });

  describe("Edge Cases", () => {
    it("should handle missing props gracefully", () => {
      expect(() => {
        render(<UserListHeader />);
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
        render(<UserListHeader {...propsWithNulls} />);
      }).not.toThrow();
    });

    it("should handle special characters in list name", () => {
      render(
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
      render(<UserListHeader {...defaultProps} name={longName} />);
      expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent(
        longName,
      );
    });
  });
});
