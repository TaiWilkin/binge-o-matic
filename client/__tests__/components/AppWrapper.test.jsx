import { render, screen } from "@testing-library/react";
import React from "react";

import AppWrapper from "../../src/components/AppWrapper.jsx";

// Mock the Nav component since it has complex dependencies
jest.mock("../../src/components/Nav.jsx", () => {
  return function MockNav() {
    return <nav data-testid="mock-nav">Mock Navigation</nav>;
  };
});

// Mock asset imports
jest.mock("../../src/assets/bright-eye.png", () => "mock-bright-eye.png");
jest.mock("../../src/assets/tmdb.svg", () => "mock-tmdb.svg");

describe("AppWrapper Component", () => {
  describe("Rendering", () => {
    it("should render the main wrapper structure", () => {
      render(
        <AppWrapper>
          <div>Test Content</div>
        </AppWrapper>,
      );

      const testContent = screen.getByText("Test Content");
      const wrapper = testContent.closest(".wrapper");
      expect(wrapper).toBeInTheDocument();
    });

    it("should render the header with title", () => {
      render(
        <AppWrapper>
          <div>Test Content</div>
        </AppWrapper>,
      );

      const header = screen.getByRole("banner");
      expect(header).toBeInTheDocument();

      const heading = screen.getByRole("heading", { level: 1 });
      expect(heading).toBeInTheDocument();
    });

    it("should render the bright eye logo in the title", () => {
      render(
        <AppWrapper>
          <div>Test Content</div>
        </AppWrapper>,
      );

      const eyeImage = screen.getByAltText("o");
      expect(eyeImage).toBeInTheDocument();
      expect(eyeImage).toHaveClass("eye");
    });

    it("should render the Nav component", () => {
      render(
        <AppWrapper>
          <div>Test Content</div>
        </AppWrapper>,
      );

      const nav = screen.getByTestId("mock-nav");
      expect(nav).toBeInTheDocument();
    });

    it("should render children content", () => {
      const testContent = <div data-testid="test-child">Child Content</div>;

      render(<AppWrapper>{testContent}</AppWrapper>);

      const childContent = screen.getByTestId("test-child");
      expect(childContent).toBeInTheDocument();
      expect(childContent).toHaveTextContent("Child Content");
    });

    it("should render the footer", () => {
      render(
        <AppWrapper>
          <div>Test Content</div>
        </AppWrapper>,
      );

      const footer = screen.getByRole("contentinfo");
      expect(footer).toBeInTheDocument();
      expect(footer).toHaveClass("footer");
    });

    it("should render the TMDB image in footer", () => {
      render(
        <AppWrapper>
          <div>Test Content</div>
        </AppWrapper>,
      );

      const tmdbImage = screen.getByAltText("tmdb");
      expect(tmdbImage).toBeInTheDocument();
      expect(tmdbImage.src).toContain("mock-tmdb.svg");
    });
  });

  describe("Content Structure", () => {
    it("should have correct title text", () => {
      render(
        <AppWrapper>
          <div>Test Content</div>
        </AppWrapper>,
      );

      const heading = screen.getByRole("heading", { level: 1 });
      expect(heading.textContent).toContain("Binge-");
      expect(heading.textContent).toContain("-matic");
    });

    it("should have the push div for footer positioning", () => {
      const { container } = render(
        <AppWrapper>
          <div>Test Content</div>
        </AppWrapper>,
      );

      const pushDiv = container.querySelector(".push");
      expect(pushDiv).toBeInTheDocument();
    });

    it("should contain TMDB attribution text", () => {
      render(
        <AppWrapper>
          <div>Test Content</div>
        </AppWrapper>,
      );

      const tmdbText = screen.getByText(/This product uses the TMDB API/);
      expect(tmdbText).toBeInTheDocument();
    });

    it("should contain icon attribution links", () => {
      render(
        <AppWrapper>
          <div>Test Content</div>
        </AppWrapper>,
      );

      const freepikLink = screen.getByRole("link", { name: "Freepik" });
      expect(freepikLink).toBeInTheDocument();
      expect(freepikLink.href).toBe("http://www.freepik.com/");

      const flaticonLink = screen.getByRole("link", {
        name: "www.flaticon.com",
      });
      expect(flaticonLink).toBeInTheDocument();
      expect(flaticonLink.href).toBe("http://www.flaticon.com/");

      const ccLink = screen.getByRole("link", { name: "CC 3.0 BY" });
      expect(ccLink).toBeInTheDocument();
      expect(ccLink.href).toBe("http://creativecommons.org/licenses/by/3.0/");
    });
  });

  describe("Component Structure", () => {
    it("should render without crashing", () => {
      expect(() =>
        render(
          <AppWrapper>
            <div>Test</div>
          </AppWrapper>,
        ),
      ).not.toThrow();
    });

    it("should have the correct CSS class structure", () => {
      const { container } = render(
        <AppWrapper>
          <div>Test Content</div>
        </AppWrapper>,
      );

      const wrapper = container.querySelector(".wrapper");
      expect(wrapper).toBeInTheDocument();

      const footer = container.querySelector(".footer");
      expect(footer).toBeInTheDocument();

      const push = container.querySelector(".push");
      expect(push).toBeInTheDocument();
    });

    it("should render all main sections", () => {
      render(
        <AppWrapper>
          <div>Test Content</div>
        </AppWrapper>,
      );

      // Header
      const header = screen.getByRole("banner");
      expect(header).toBeInTheDocument();

      // Navigation
      const nav = screen.getByTestId("mock-nav");
      expect(nav).toBeInTheDocument();

      // Footer
      const footer = screen.getByRole("contentinfo");
      expect(footer).toBeInTheDocument();
    });
  });

  describe("Children Prop Handling", () => {
    it("should render multiple children", () => {
      render(
        <AppWrapper>
          <div data-testid="child1">First Child</div>
          <div data-testid="child2">Second Child</div>
        </AppWrapper>,
      );

      expect(screen.getByTestId("child1")).toBeInTheDocument();
      expect(screen.getByTestId("child2")).toBeInTheDocument();
    });

    it("should render complex children", () => {
      const complexChild = (
        <div>
          <h2>Complex Child</h2>
          <p>With nested content</p>
          <button>And interactive elements</button>
        </div>
      );

      render(<AppWrapper>{complexChild}</AppWrapper>);

      expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent(
        "Complex Child",
      );
      expect(screen.getByText("With nested content")).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: "And interactive elements" }),
      ).toBeInTheDocument();
    });

    it("should render when children is null", () => {
      expect(() => render(<AppWrapper>{null}</AppWrapper>)).not.toThrow();
    });

    it("should render when children is undefined", () => {
      expect(() => render(<AppWrapper>{undefined}</AppWrapper>)).not.toThrow();
    });

    it("should render when no children prop is passed", () => {
      expect(() => render(<AppWrapper />)).not.toThrow();
    });
  });

  describe("Accessibility", () => {
    it("should have proper semantic HTML structure", () => {
      render(
        <AppWrapper>
          <main>Main Content</main>
        </AppWrapper>,
      );

      // Should have header, nav, main, footer landmarks
      expect(screen.getByRole("banner")).toBeInTheDocument(); // header
      expect(screen.getByTestId("mock-nav")).toBeInTheDocument(); // nav (mocked)
      expect(screen.getByRole("main")).toBeInTheDocument(); // main (from children)
      expect(screen.getByRole("contentinfo")).toBeInTheDocument(); // footer
    });

    it("should have accessible heading hierarchy", () => {
      render(
        <AppWrapper>
          <div>Test Content</div>
        </AppWrapper>,
      );

      const heading = screen.getByRole("heading", { level: 1 });
      expect(heading).toBeInTheDocument();
    });

    it("should have proper alt text for images", () => {
      render(
        <AppWrapper>
          <div>Test Content</div>
        </AppWrapper>,
      );

      const eyeImage = screen.getByAltText("o");
      expect(eyeImage).toBeInTheDocument();

      const tmdbImage = screen.getByAltText("tmdb");
      expect(tmdbImage).toBeInTheDocument();
    });

    it("should have accessible links in footer", () => {
      render(
        <AppWrapper>
          <div>Test Content</div>
        </AppWrapper>,
      );

      const links = screen.getAllByRole("link");
      expect(links.length).toBeGreaterThan(0);

      links.forEach((link) => {
        expect(link).toHaveAttribute("href");
        expect(link.textContent.trim()).not.toBe("");
      });
    });
  });

  describe("Component Integration", () => {
    it("should be exported as default", () => {
      expect(AppWrapper).toBeDefined();
      expect(typeof AppWrapper).toBe("function");
    });

    it("should integrate properly with Nav component", () => {
      render(
        <AppWrapper>
          <div>Test Content</div>
        </AppWrapper>,
      );

      // Nav should be rendered within the wrapper
      const nav = screen.getByTestId("mock-nav");
      const wrapper = nav.closest(".wrapper");
      expect(wrapper).toBeInTheDocument();
    });

    it("should render consistently on multiple renders", () => {
      const { rerender } = render(
        <AppWrapper>
          <div>Initial Content</div>
        </AppWrapper>,
      );

      let content = screen.getByText("Initial Content");
      expect(content).toBeInTheDocument();

      rerender(
        <AppWrapper>
          <div>Updated Content</div>
        </AppWrapper>,
      );

      content = screen.getByText("Updated Content");
      expect(content).toBeInTheDocument();

      // Structure should remain the same
      expect(screen.getByRole("banner")).toBeInTheDocument();
      expect(screen.getByRole("contentinfo")).toBeInTheDocument();
    });
  });

  describe("React Component Behavior", () => {
    it("should be a functional component", () => {
      // Functional components don't have React lifecycle methods
      expect(AppWrapper.prototype.render).toBeUndefined();
      expect(AppWrapper.prototype.componentDidMount).toBeUndefined();
    });

    it("should accept children prop", () => {
      const testContent = "Test Children Content";
      const result = AppWrapper({ children: testContent });

      expect(result).toBeDefined();
      expect(result.type).toBe("div");
      expect(result.props.children).toBeDefined();
    });

    it("should not have any side effects during render", () => {
      const consoleSpy = jest.spyOn(console, "log").mockImplementation();
      const errorSpy = jest.spyOn(console, "error").mockImplementation();

      render(
        <AppWrapper>
          <div>Test Content</div>
        </AppWrapper>,
      );

      expect(consoleSpy).not.toHaveBeenCalled();
      expect(errorSpy).not.toHaveBeenCalled();

      consoleSpy.mockRestore();
      errorSpy.mockRestore();
    });
  });
});
