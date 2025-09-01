import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import { MemoryRouter } from "react-router-dom";

import ListHeader from "../../src/components/ListHeader.jsx";

describe("ListHeader Component", () => {
  const mockPush = jest.fn();

  // Helper function to render component with Router context
  const renderWithRouter = (component) => {
    return render(<MemoryRouter>{component}</MemoryRouter>);
  };

  beforeEach(() => {
    mockPush.mockClear();
  });

  describe("Rendering", () => {
    it("should render with name prop", () => {
      renderWithRouter(<ListHeader name="Test List" push={mockPush} />);

      const heading = screen.getByRole("heading", { level: 2 });
      expect(heading).toBeInTheDocument();
      expect(heading).toHaveTextContent("Test List");
    });

    it("should render the disclaimer text", () => {
      renderWithRouter(<ListHeader name="Test List" push={mockPush} />);

      const disclaimer = screen.getByText(
        "This is a user-managed list and may not be complete.",
      );
      expect(disclaimer).toBeInTheDocument();
      expect(disclaimer.tagName).toBe("P");
    });

    it("should render CREATE LIST link", () => {
      renderWithRouter(<ListHeader name="Test List" push={mockPush} />);

      const link = screen.getByRole("link", { name: "CREATE LIST" });
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute("href", "/newlist");
    });

    it("should render with correct HTML structure", () => {
      const { container } = renderWithRouter(
        <ListHeader name="Test List" push={mockPush} />,
      );

      const header = container.querySelector(".header");
      const headerInfo = container.querySelector(".header-info");
      const heading = container.querySelector("h2");
      const paragraph = container.querySelector("p");
      const link = container.querySelector(".edit-link");

      expect(header).toBeInTheDocument();
      expect(headerInfo).toBeInTheDocument();
      expect(heading).toBeInTheDocument();
      expect(paragraph).toBeInTheDocument();
      expect(link).toBeInTheDocument();

      // Check hierarchy
      expect(header).toContainElement(headerInfo);
      expect(header).toContainElement(link);
      expect(headerInfo).toContainElement(heading);
      expect(headerInfo).toContainElement(paragraph);
    });

    it("should apply inline styles to header-info", () => {
      const { container } = renderWithRouter(
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
      renderWithRouter(<ListHeader name="" push={mockPush} />);

      const heading = screen.getByRole("heading", { level: 2 });
      expect(heading).toBeInTheDocument();
      expect(heading).toHaveTextContent("");
    });

    it("should render null name", () => {
      renderWithRouter(<ListHeader name={null} push={mockPush} />);

      const heading = screen.getByRole("heading", { level: 2 });
      expect(heading).toBeInTheDocument();
      expect(heading.textContent).toBe("");
    });

    it("should render undefined name", () => {
      renderWithRouter(<ListHeader name={undefined} push={mockPush} />);

      const heading = screen.getByRole("heading", { level: 2 });
      expect(heading).toBeInTheDocument();
      expect(heading.textContent).toBe("");
    });

    it("should render numeric name", () => {
      renderWithRouter(<ListHeader name={123} push={mockPush} />);

      const heading = screen.getByRole("heading", { level: 2 });
      expect(heading).toBeInTheDocument();
      expect(heading).toHaveTextContent("123");
    });

    it("should render long name", () => {
      const longName = "A".repeat(100);
      renderWithRouter(<ListHeader name={longName} push={mockPush} />);

      const heading = screen.getByRole("heading", { level: 2 });
      expect(heading).toBeInTheDocument();
      expect(heading).toHaveTextContent(longName);
    });

    it("should render name with special characters", () => {
      const specialName = "List with special chars: !@#$%^&*() 中文 🚀";
      renderWithRouter(<ListHeader name={specialName} push={mockPush} />);

      const heading = screen.getByRole("heading", { level: 2 });
      expect(heading).toBeInTheDocument();
      expect(heading).toHaveTextContent(specialName);
    });

    it("should handle HTML-like content in name", () => {
      const htmlName = "<script>alert('xss')</script>";
      renderWithRouter(<ListHeader name={htmlName} push={mockPush} />);

      const heading = screen.getByRole("heading", { level: 2 });
      expect(heading).toBeInTheDocument();
      expect(heading.textContent).toBe(htmlName);
    });
  });

  describe("Link functionality", () => {
    it("should render CREATE LIST link with correct href", () => {
      renderWithRouter(<ListHeader name="Test List" push={mockPush} />);

      const link = screen.getByRole("link", { name: "CREATE LIST" });
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute("href", "/newlist");
    });

    it("should not depend on push prop for navigation", () => {
      // Since we're using Link, navigation is handled by React Router, not the push prop
      renderWithRouter(<ListHeader name="Test List" />);

      const link = screen.getByRole("link", { name: "CREATE LIST" });
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute("href", "/newlist");
    });

    it("should handle missing push prop gracefully", () => {
      expect(() =>
        renderWithRouter(<ListHeader name="Test List" />),
      ).not.toThrow();
    });

    it("should not crash when push is null", () => {
      expect(() =>
        renderWithRouter(<ListHeader name="Test List" push={null} />),
      ).not.toThrow();
    });

    it("should handle push being undefined", () => {
      // Component should render without crashing even with undefined push
      expect(() =>
        renderWithRouter(<ListHeader name="Test List" push={undefined} />),
      ).not.toThrow();

      const link = screen.getByRole("link", { name: "CREATE LIST" });
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute("href", "/newlist");

      // Note: Navigation is handled by React Router, not the push prop
    });
  });

  describe("Component behavior", () => {
    it("should render without crashing", () => {
      expect(() =>
        renderWithRouter(<ListHeader name="Test" push={mockPush} />),
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
      const { rerender } = renderWithRouter(
        <ListHeader name="Original Name" push={mockPush} />,
      );

      let heading = screen.getByRole("heading", { level: 2 });
      expect(heading).toHaveTextContent("Original Name");

      rerender(
        <MemoryRouter>
          <ListHeader name="Updated Name" push={mockPush} />
        </MemoryRouter>,
      );

      heading = screen.getByRole("heading", { level: 2 });
      expect(heading).toHaveTextContent("Updated Name");
    });

    it("should handle push function changes", () => {
      // Since we're using Link now, the push prop is not used for navigation
      // This test verifies that the component renders correctly regardless of push prop changes
      const newPush = jest.fn();

      const { rerender } = renderWithRouter(
        <ListHeader name="Test" push={mockPush} />,
      );

      const link = screen.getByRole("link", { name: "CREATE LIST" });
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute("href", "/newlist");

      // Rerender with different push function
      rerender(
        <MemoryRouter>
          <ListHeader name="Test" push={newPush} />
        </MemoryRouter>,
      );

      // Link should still work the same way
      const linkAfterRerender = screen.getByRole("link", {
        name: "CREATE LIST",
      });
      expect(linkAfterRerender).toBeInTheDocument();
      expect(linkAfterRerender).toHaveAttribute("href", "/newlist");
    });

    it("should not have side effects during render", () => {
      const consoleSpy = jest.spyOn(console, "log").mockImplementation();

      renderWithRouter(<ListHeader name="Test" push={mockPush} />);

      expect(consoleSpy).not.toHaveBeenCalled();

      consoleSpy.mockRestore();
    });
  });

  describe("Accessibility", () => {
    it("should have proper heading hierarchy", () => {
      renderWithRouter(<ListHeader name="Test List" push={mockPush} />);

      const heading = screen.getByRole("heading", { level: 2 });
      expect(heading).toBeInTheDocument();
    });

    it("should have accessible link", () => {
      renderWithRouter(<ListHeader name="Test List" push={mockPush} />);

      const link = screen.getByRole("link", { name: "CREATE LIST" });
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute("href", "/newlist");
    });

    it("should have readable text content", () => {
      renderWithRouter(<ListHeader name="My List" push={mockPush} />);

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
      renderWithRouter(<ListHeader name="Test" push={mockPush} />);

      const link = screen.getByRole("link", { name: "CREATE LIST" });

      await user.tab();
      expect(link).toHaveFocus();
    });
  });

  describe("CSS and styling", () => {
    it("should have correct CSS classes", () => {
      const { container } = renderWithRouter(
        <ListHeader name="Test" push={mockPush} />,
      );

      expect(container.querySelector(".header")).toBeInTheDocument();
      expect(container.querySelector(".header-info")).toBeInTheDocument();
      expect(container.querySelector(".edit-link")).toBeInTheDocument();
    });

    it("should apply flex styling correctly", () => {
      const { container } = renderWithRouter(
        <ListHeader name="Test" push={mockPush} />,
      );

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

      render(
        <MemoryRouter>
          <TestWrapper />
        </MemoryRouter>,
      );

      expect(screen.getByText("Integration Test")).toBeInTheDocument();
      expect(screen.getByText("Additional content")).toBeInTheDocument();
      expect(
        screen.getByRole("link", { name: "CREATE LIST" }),
      ).toBeInTheDocument();
    });

    it("should handle rapid state changes", () => {
      const { rerender } = renderWithRouter(
        <ListHeader name="List 1" push={mockPush} />,
      );

      for (let i = 2; i <= 10; i++) {
        rerender(
          <MemoryRouter>
            <ListHeader name={`List ${i}`} push={mockPush} />
          </MemoryRouter>,
        );
      }

      const heading = screen.getByRole("heading", { level: 2 });
      expect(heading).toHaveTextContent("List 10");
    });
  });
});
