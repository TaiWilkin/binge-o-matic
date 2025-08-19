import { render, screen } from "@testing-library/react";
import React from "react";

import Loading from "../../src/components/Loading.jsx";

describe("Loading Component", () => {
  describe("Rendering", () => {
    it("should render the loading message", () => {
      render(<Loading />);

      const loadingText = screen.getByText("Loading...");
      expect(loadingText).toBeInTheDocument();
    });

    it("should render as a paragraph element", () => {
      render(<Loading />);

      const loadingElement = screen.getByText("Loading...");
      expect(loadingElement.tagName).toBe("P");
    });

    it("should contain the exact text 'Loading...'", () => {
      render(<Loading />);

      const loadingText = screen.getByText(/^Loading\.\.\.$/);
      expect(loadingText).toBeInTheDocument();
    });
  });

  describe("Component Structure", () => {
    it("should render without crashing", () => {
      expect(() => render(<Loading />)).not.toThrow();
    });

    it("should render only a single paragraph element", () => {
      const { container } = render(<Loading />);

      const paragraphs = container.querySelectorAll("p");
      expect(paragraphs).toHaveLength(1);
    });

    it("should not render any other HTML elements", () => {
      const { container } = render(<Loading />);

      // Should only contain one child element (the paragraph)
      expect(container.firstChild.children).toHaveLength(0);
      expect(container.firstChild.tagName).toBe("P");
    });
  });

  describe("Accessibility", () => {
    it("should be accessible to screen readers", () => {
      render(<Loading />);

      const loadingText = screen.getByText("Loading...");
      expect(loadingText).toBeVisible();
    });

    it("should have text content that is screen reader friendly", () => {
      render(<Loading />);

      const loadingText = screen.getByText("Loading...");
      expect(loadingText).toHaveTextContent("Loading...");
      expect(loadingText).toBeVisible();
    });
  });

  describe("Component Integration", () => {
    it("should be exported as default", () => {
      expect(Loading).toBeDefined();
      expect(typeof Loading).toBe("function");
    });

    it("should render consistently on multiple renders", () => {
      const { rerender } = render(<Loading />);

      let loadingText = screen.getByText("Loading...");
      expect(loadingText).toBeInTheDocument();

      rerender(<Loading />);

      loadingText = screen.getByText("Loading...");
      expect(loadingText).toBeInTheDocument();
    });

    it("should not accept or use any props", () => {
      // Loading component doesn't use props, so passing them should not affect rendering
      render(<Loading someProp="test" anotherProp={123} />);

      const loadingText = screen.getByText("Loading...");
      expect(loadingText).toBeInTheDocument();
      expect(loadingText.tagName).toBe("P");
    });
  });

  describe("Content Validation", () => {
    it("should not be empty", () => {
      const { container } = render(<Loading />);

      expect(container.firstChild).not.toBeEmptyDOMElement();
    });

    it("should have the correct text content", () => {
      render(<Loading />);

      const loadingText = screen.getByText("Loading...");
      expect(loadingText.textContent).toBe("Loading...");
    });

    it("should not contain any additional attributes", () => {
      const { container } = render(<Loading />);

      const paragraph = container.firstChild;
      expect(paragraph.attributes).toHaveLength(0);
    });
  });

  describe("React Component Behavior", () => {
    it("should be a functional component", () => {
      // Functional components don't have React lifecycle methods
      expect(Loading.prototype.render).toBeUndefined();
      expect(Loading.prototype.componentDidMount).toBeUndefined();
    });

    it("should return JSX", () => {
      const result = Loading();
      expect(result).toBeDefined();
      expect(result.type).toBe("p");
      expect(result.props.children).toBe("Loading...");
    });

    it("should not have any side effects", () => {
      const consoleSpy = jest.spyOn(console, "log").mockImplementation();
      const errorSpy = jest.spyOn(console, "error").mockImplementation();

      render(<Loading />);

      expect(consoleSpy).not.toHaveBeenCalled();
      expect(errorSpy).not.toHaveBeenCalled();

      consoleSpy.mockRestore();
      errorSpy.mockRestore();
    });
  });
});
