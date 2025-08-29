import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";

import ListHeader from "../../src/components/ListHeader.jsx";

describe("ListHeader Component", () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    mockPush.mockClear();
  });

  describe("Rendering", () => {
    it("should render with name prop", () => {
      render(<ListHeader name="Test List" push={mockPush} />);

      const heading = screen.getByRole("heading", { level: 2 });
      expect(heading).toBeInTheDocument();
      expect(heading).toHaveTextContent("Test List");
    });

    it("should render the disclaimer text", () => {
      render(<ListHeader name="Test List" push={mockPush} />);

      const disclaimer = screen.getByText(
        "This is a user-managed list and may not be complete.",
      );
      expect(disclaimer).toBeInTheDocument();
      expect(disclaimer.tagName).toBe("P");
    });

    it("should render CREATE LIST button", () => {
      render(<ListHeader name="Test List" push={mockPush} />);

      const button = screen.getByRole("button", { name: "CREATE LIST" });
      expect(button).toBeInTheDocument();
      expect(button).toHaveAttribute("type", "button");
      expect(button).toHaveClass("edit-btn");
    });

    it("should render with correct HTML structure", () => {
      const { container } = render(
        <ListHeader name="Test List" push={mockPush} />,
      );

      const header = container.querySelector(".header");
      const headerInfo = container.querySelector(".header-info");
      const heading = container.querySelector("h2");
      const paragraph = container.querySelector("p");
      const button = container.querySelector(".edit-btn");

      expect(header).toBeInTheDocument();
      expect(headerInfo).toBeInTheDocument();
      expect(heading).toBeInTheDocument();
      expect(paragraph).toBeInTheDocument();
      expect(button).toBeInTheDocument();

      // Check hierarchy
      expect(header).toContainElement(headerInfo);
      expect(header).toContainElement(button);
      expect(headerInfo).toContainElement(heading);
      expect(headerInfo).toContainElement(paragraph);
    });

    it("should apply inline styles to header-info", () => {
      const { container } = render(
        <ListHeader name="Test List" push={mockPush} />,
      );

      const headerInfo = container.querySelector(".header-info");
      expect(headerInfo).toHaveStyle({
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      });
    });
  });

  describe("Name prop handling", () => {
    it("should render empty string name", () => {
      render(<ListHeader name="" push={mockPush} />);

      const heading = screen.getByRole("heading", { level: 2 });
      expect(heading).toBeInTheDocument();
      expect(heading).toHaveTextContent("");
    });

    it("should render null name", () => {
      render(<ListHeader name={null} push={mockPush} />);

      const heading = screen.getByRole("heading", { level: 2 });
      expect(heading).toBeInTheDocument();
      expect(heading.textContent).toBe("");
    });

    it("should render undefined name", () => {
      render(<ListHeader name={undefined} push={mockPush} />);

      const heading = screen.getByRole("heading", { level: 2 });
      expect(heading).toBeInTheDocument();
      expect(heading.textContent).toBe("");
    });

    it("should render numeric name", () => {
      render(<ListHeader name={123} push={mockPush} />);

      const heading = screen.getByRole("heading", { level: 2 });
      expect(heading).toBeInTheDocument();
      expect(heading).toHaveTextContent("123");
    });

    it("should render long name", () => {
      const longName = "A".repeat(100);
      render(<ListHeader name={longName} push={mockPush} />);

      const heading = screen.getByRole("heading", { level: 2 });
      expect(heading).toBeInTheDocument();
      expect(heading).toHaveTextContent(longName);
    });

    it("should render name with special characters", () => {
      const specialName = "List with special chars: !@#$%^&*() 中文 🚀";
      render(<ListHeader name={specialName} push={mockPush} />);

      const heading = screen.getByRole("heading", { level: 2 });
      expect(heading).toBeInTheDocument();
      expect(heading).toHaveTextContent(specialName);
    });

    it("should handle HTML-like content in name", () => {
      const htmlName = "<script>alert('xss')</script>";
      render(<ListHeader name={htmlName} push={mockPush} />);

      const heading = screen.getByRole("heading", { level: 2 });
      expect(heading).toBeInTheDocument();
      expect(heading.textContent).toBe(htmlName);
    });
  });

  describe("Button functionality", () => {
    it("should call push with /newlist when button is clicked", async () => {
      const user = userEvent.setup();
      render(<ListHeader name="Test List" push={mockPush} />);

      const button = screen.getByRole("button", { name: "CREATE LIST" });
      await user.click(button);

      expect(mockPush).toHaveBeenCalledTimes(1);
      expect(mockPush).toHaveBeenCalledWith("/newlist");
    });

    it("should call push multiple times on multiple clicks", async () => {
      const user = userEvent.setup();
      render(<ListHeader name="Test List" push={mockPush} />);

      const button = screen.getByRole("button", { name: "CREATE LIST" });

      await user.click(button);
      await user.click(button);
      await user.click(button);

      expect(mockPush).toHaveBeenCalledTimes(3);
      expect(mockPush).toHaveBeenNthCalledWith(1, "/newlist");
      expect(mockPush).toHaveBeenNthCalledWith(2, "/newlist");
      expect(mockPush).toHaveBeenNthCalledWith(3, "/newlist");
    });

    it("should handle missing push prop gracefully", () => {
      expect(() => render(<ListHeader name="Test List" />)).not.toThrow();
    });

    it("should not crash when push is null", () => {
      expect(() =>
        render(<ListHeader name="Test List" push={null} />),
      ).not.toThrow();
    });

    it("should handle push being undefined", () => {
      // Component should render without crashing even with undefined push
      expect(() =>
        render(<ListHeader name="Test List" push={undefined} />),
      ).not.toThrow();

      const button = screen.getByRole("button", { name: "CREATE LIST" });
      expect(button).toBeInTheDocument();

      // Note: Clicking the button would throw, but this tests that rendering works
    });
  });

  describe("Component behavior", () => {
    it("should render without crashing", () => {
      expect(() =>
        render(<ListHeader name="Test" push={mockPush} />),
      ).not.toThrow();
    });

    it("should be exported as default", () => {
      expect(ListHeader).toBeDefined();
      expect(typeof ListHeader).toBe("function");
    });

    it("should be a functional component", () => {
      expect(ListHeader.prototype.render).toBeUndefined();
      expect(ListHeader.prototype.componentDidMount).toBeUndefined();
    });

    it("should handle prop changes correctly", () => {
      const { rerender } = render(
        <ListHeader name="Original Name" push={mockPush} />,
      );

      let heading = screen.getByRole("heading", { level: 2 });
      expect(heading).toHaveTextContent("Original Name");

      rerender(<ListHeader name="Updated Name" push={mockPush} />);

      heading = screen.getByRole("heading", { level: 2 });
      expect(heading).toHaveTextContent("Updated Name");
    });

    it("should handle push function changes", async () => {
      const user = userEvent.setup();
      const newPush = jest.fn();

      const { rerender } = render(<ListHeader name="Test" push={mockPush} />);

      const button = screen.getByRole("button", { name: "CREATE LIST" });
      await user.click(button);

      expect(mockPush).toHaveBeenCalledTimes(1);
      expect(newPush).not.toHaveBeenCalled();

      rerender(<ListHeader name="Test" push={newPush} />);

      await user.click(button);

      expect(mockPush).toHaveBeenCalledTimes(1); // Still 1
      expect(newPush).toHaveBeenCalledTimes(1);
    });

    it("should not have side effects during render", () => {
      const consoleSpy = jest.spyOn(console, "log").mockImplementation();

      render(<ListHeader name="Test" push={mockPush} />);

      expect(consoleSpy).not.toHaveBeenCalled();

      consoleSpy.mockRestore();
    });
  });

  describe("Accessibility", () => {
    it("should have proper heading hierarchy", () => {
      render(<ListHeader name="Test List" push={mockPush} />);

      const heading = screen.getByRole("heading", { level: 2 });
      expect(heading).toBeInTheDocument();
    });

    it("should have accessible button", () => {
      render(<ListHeader name="Test List" push={mockPush} />);

      const button = screen.getByRole("button", { name: "CREATE LIST" });
      expect(button).toBeInTheDocument();
      expect(button).toHaveAttribute("type", "button");
    });

    it("should have readable text content", () => {
      render(<ListHeader name="My List" push={mockPush} />);

      // Check that all text is accessible
      expect(screen.getByText("My List")).toBeInTheDocument();
      expect(
        screen.getByText(
          "This is a user-managed list and may not be complete.",
        ),
      ).toBeInTheDocument();
      expect(screen.getByText("CREATE LIST")).toBeInTheDocument();
    });

    it("should maintain focus management", async () => {
      const user = userEvent.setup();
      render(<ListHeader name="Test" push={mockPush} />);

      const button = screen.getByRole("button", { name: "CREATE LIST" });

      await user.tab();
      expect(button).toHaveFocus();
    });
  });

  describe("CSS and styling", () => {
    it("should have correct CSS classes", () => {
      const { container } = render(<ListHeader name="Test" push={mockPush} />);

      expect(container.querySelector(".header")).toBeInTheDocument();
      expect(container.querySelector(".header-info")).toBeInTheDocument();
      expect(container.querySelector(".edit-btn")).toBeInTheDocument();
    });

    it("should apply flex styling correctly", () => {
      const { container } = render(<ListHeader name="Test" push={mockPush} />);

      const headerInfo = container.querySelector(".header-info");
      const computedStyle = window.getComputedStyle(headerInfo);

      expect(computedStyle.display).toBe("flex");
      expect(computedStyle.justifyContent).toBe("space-between");
      expect(computedStyle.alignItems).toBe("center");
    });
  });

  describe("Integration scenarios", () => {
    it("should work in a larger component context", () => {
      const TestWrapper = () => (
        <div>
          <ListHeader name="Integration Test" push={mockPush} />
          <p>Additional content</p>
        </div>
      );

      render(<TestWrapper />);

      expect(screen.getByText("Integration Test")).toBeInTheDocument();
      expect(screen.getByText("Additional content")).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: "CREATE LIST" }),
      ).toBeInTheDocument();
    });

    it("should handle rapid state changes", () => {
      const { rerender } = render(<ListHeader name="List 1" push={mockPush} />);

      for (let i = 2; i <= 10; i++) {
        rerender(<ListHeader name={`List ${i}`} push={mockPush} />);
      }

      const heading = screen.getByRole("heading", { level: 2 });
      expect(heading).toHaveTextContent("List 10");
    });
  });
});
