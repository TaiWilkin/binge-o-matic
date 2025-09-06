import { render } from "@testing-library/react";
import React from "react";

import Loading from "../../src/components/Loading.jsx";

describe("Loading Component", () => {
  describe("Rendering", () => {
    it("should render the loading spinner", () => {
      const { container } = render(<Loading />);

      const spinner = container.querySelector(".spinner");
      expect(spinner).toBeInTheDocument();
    });

    it("should render as a div element", () => {
      const { container } = render(<Loading />);

      const spinner = container.querySelector(".spinner");
      expect(spinner.tagName).toBe("DIV");
    });

    it("should have the spinner class", () => {
      const { container } = render(<Loading />);

      const spinner = container.querySelector(".spinner");
      expect(spinner).toHaveClass("spinner");
    });
  });

  describe("Component Structure", () => {
    it("should render without crashing", () => {
      expect(() => render(<Loading />)).not.toThrow();
    });

    it("should render only a single div element", () => {
      const { container } = render(<Loading />);

      const divs = container.querySelectorAll("div");
      expect(divs).toHaveLength(1);
    });

    it("should render a spinner div with no child elements", () => {
      const { container } = render(<Loading />);

      // Should only contain one child element (the spinner div)
      expect(container.firstChild.children).toHaveLength(0);
      expect(container.firstChild.tagName).toBe("DIV");
      expect(container.firstChild).toHaveClass("spinner");
    });
  });

  describe("Accessibility", () => {
    it("should render a visible spinner", () => {
      const { container } = render(<Loading />);

      const spinner = container.querySelector(".spinner");
      expect(spinner).toBeVisible();
    });

    it("should be a visual loading indicator", () => {
      const { container } = render(<Loading />);

      const spinner = container.querySelector(".spinner");
      expect(spinner).toBeInTheDocument();
      expect(spinner).toHaveClass("spinner");
    });
  });

  describe("Component Integration", () => {
    it("should be exported as default", () => {
      expect(Loading).toBeDefined();
      expect(typeof Loading).toBe("function");
    });

    it("should render consistently on multiple renders", () => {
      const { container, rerender } = render(<Loading />);

      let spinner = container.querySelector(".spinner");
      expect(spinner).toBeInTheDocument();

      rerender(<Loading />);

      spinner = container.querySelector(".spinner");
      expect(spinner).toBeInTheDocument();
    });

    it("should not accept or use any props", () => {
      // Loading component doesn't use props, so passing them should not affect rendering
      const { container } = render(
        <Loading someProp="test" anotherProp={123} />,
      );

      const spinner = container.querySelector(".spinner");
      expect(spinner).toBeInTheDocument();
      expect(spinner.tagName).toBe("DIV");
    });
  });

  describe("Content Validation", () => {
    it("should render a spinner element", () => {
      const { container } = render(<Loading />);

      expect(container.firstChild).toBeInTheDocument();
      expect(container.firstChild).toHaveClass("spinner");
    });

    it("should have the correct structure", () => {
      const { container } = render(<Loading />);

      const spinner = container.querySelector(".spinner");
      expect(spinner).toBeInTheDocument();
      expect(spinner.tagName).toBe("DIV");
    });

    it("should have the spinner class attribute", () => {
      const { container } = render(<Loading />);

      const spinner = container.firstChild;
      expect(spinner.attributes).toHaveLength(1);
      expect(spinner).toHaveClass("spinner");
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
      expect(result.type).toBe("div");
      expect(result.props.className).toBe("spinner");
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
