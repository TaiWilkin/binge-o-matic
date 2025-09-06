import { render, screen } from "@testing-library/react";
import React from "react";

import Errors from "../../src/components/Errors.jsx";

describe("Errors Component", () => {
  describe("Rendering with errors", () => {
    it("should render GraphQL errors", () => {
      const mockError = {
        graphQLErrors: [
          { message: "First error message" },
          { message: "Second error message" },
        ],
      };

      render(<Errors error={mockError} />);

      const firstError = screen.getByText("First error message");
      const secondError = screen.getByText("Second error message");

      expect(firstError).toBeInTheDocument();
      expect(secondError).toBeInTheDocument();
    });

    it("should render single GraphQL error", () => {
      const mockError = {
        graphQLErrors: [{ message: "Single error message" }],
      };

      render(<Errors error={mockError} />);

      const errorMessage = screen.getByText("Single error message");
      expect(errorMessage).toBeInTheDocument();
    });

    it("should render errors with correct CSS classes", () => {
      const mockError = {
        graphQLErrors: [{ message: "Test error" }],
      };

      const { container } = render(<Errors error={mockError} />);

      const errorsContainer = container.querySelector(".error");
      const errorParagraph = container.querySelector("p.error");

      expect(errorsContainer).toBeInTheDocument();
      expect(errorParagraph).toBeInTheDocument();
      expect(errorParagraph).toHaveTextContent("Test error");
    });

    it("should render multiple errors with unique keys", () => {
      const mockError = {
        graphQLErrors: [
          { message: "First error" },
          { message: "Second error" },
          { message: "Third error" },
        ],
      };

      const { container } = render(<Errors error={mockError} />);

      const errorParagraphs = container.querySelectorAll("p.error");
      expect(errorParagraphs).toHaveLength(3);

      expect(errorParagraphs[0]).toHaveTextContent("First error");
      expect(errorParagraphs[1]).toHaveTextContent("Second error");
      expect(errorParagraphs[2]).toHaveTextContent("Third error");
    });

    it("should handle empty error messages", () => {
      const mockError = {
        graphQLErrors: [{ message: "" }, { message: "Valid error" }],
      };

      render(<Errors error={mockError} />);

      const validError = screen.getByText("Valid error");
      expect(validError).toBeInTheDocument();

      // Empty message should still render as a paragraph element
      const { container } = render(<Errors error={mockError} />);
      const errorParagraphs = container.querySelectorAll("p.error");
      expect(errorParagraphs).toHaveLength(2);
    });

    it("should handle duplicate error messages", () => {
      const mockError = {
        graphQLErrors: [
          { message: "Duplicate error" },
          { message: "Duplicate error" },
          { message: "Different error" },
        ],
      };

      render(<Errors error={mockError} />);

      const duplicateErrors = screen.getAllByText("Duplicate error");
      const differentError = screen.getByText("Different error");

      expect(duplicateErrors).toHaveLength(2);
      expect(differentError).toBeInTheDocument();
    });
  });

  describe("Rendering without errors", () => {
    it("should return null when error is null", () => {
      const { container } = render(<Errors error={null} />);
      expect(container.firstChild).toBeNull();
    });

    it("should return null when error is undefined", () => {
      const { container } = render(<Errors error={undefined} />);
      expect(container.firstChild).toBeNull();
    });

    it("should return null when error object exists but graphQLErrors is missing", () => {
      const mockError = {
        networkError: "Some network error",
      };

      const { container } = render(<Errors error={mockError} />);
      expect(container.firstChild).toBeNull();
    });

    it("should return null when graphQLErrors is null", () => {
      const mockError = {
        graphQLErrors: null,
      };

      const { container } = render(<Errors error={mockError} />);
      expect(container.firstChild).toBeNull();
    });

    it("should return null when graphQLErrors is empty array", () => {
      const mockError = {
        graphQLErrors: [],
      };

      const { container } = render(<Errors error={mockError} />);
      expect(container.firstChild).toBeNull();
    });

    it("should return null when no error prop is passed", () => {
      const { container } = render(<Errors />);
      expect(container.firstChild).toBeNull();
    });
  });

  describe("Error structure validation", () => {
    it("should handle complex error objects", () => {
      const mockError = {
        graphQLErrors: [
          {
            message: "Complex error",
            extensions: { code: "VALIDATION_ERROR" },
            locations: [{ line: 1, column: 1 }],
          },
        ],
      };

      render(<Errors error={mockError} />);

      const errorMessage = screen.getByText("Complex error");
      expect(errorMessage).toBeInTheDocument();
    });

    it("should handle errors with additional properties", () => {
      const mockError = {
        graphQLErrors: [
          {
            message: "Error with extra props",
            path: ["field"],
            source: "query",
          },
        ],
        networkError: null,
        extraField: "should be ignored",
      };

      render(<Errors error={mockError} />);

      const errorMessage = screen.getByText("Error with extra props");
      expect(errorMessage).toBeInTheDocument();
    });

    it("should handle errors without message property", () => {
      const mockError = {
        graphQLErrors: [{ code: "ERROR_CODE" }, { message: "Valid error" }],
      };

      render(<Errors error={mockError} />);

      // Should only render the error with a valid message
      const validError = screen.getByText("Valid error");
      expect(validError).toBeInTheDocument();

      const { container } = render(<Errors error={mockError} />);
      const errorParagraphs = container.querySelectorAll("p.error");
      expect(errorParagraphs).toHaveLength(2);
    });
  });

  describe("Component structure", () => {
    it("should render with correct HTML structure", () => {
      const mockError = {
        graphQLErrors: [{ message: "Test error" }],
      };

      const { container } = render(<Errors error={mockError} />);

      const errorsDiv = container.querySelector("div.error");
      const errorParagraph = errorsDiv.querySelector("p.error");

      expect(errorsDiv).toBeInTheDocument();
      expect(errorParagraph).toBeInTheDocument();
      expect(errorParagraph.parentElement).toBe(errorsDiv);
    });

    it("should maintain proper element hierarchy", () => {
      const mockError = {
        graphQLErrors: [
          { message: "First error" },
          { message: "Second error" },
        ],
      };

      const { container } = render(<Errors error={mockError} />);

      const errorsDiv = container.querySelector("div.error");
      const errorParagraphs = errorsDiv.querySelectorAll("p.error");

      expect(errorParagraphs).toHaveLength(2);
      errorParagraphs.forEach((p) => {
        expect(p.parentElement).toBe(errorsDiv);
      });
    });
  });

  describe("Component exports and behavior", () => {
    it("should be exported as default", () => {
      expect(Errors).toBeDefined();
      expect(typeof Errors).toBe("function");
    });

    it("should be a functional component", () => {
      expect(Errors.prototype.render).toBeUndefined();
      expect(Errors.prototype.componentDidMount).toBeUndefined();
    });

    it("should render without crashing", () => {
      expect(() => render(<Errors />)).not.toThrow();
    });

    it("should handle prop changes correctly", () => {
      const mockError1 = {
        graphQLErrors: [{ message: "First error" }],
      };

      const mockError2 = {
        graphQLErrors: [{ message: "Second error" }],
      };

      const { rerender } = render(<Errors error={mockError1} />);
      expect(screen.getByText("First error")).toBeInTheDocument();

      rerender(<Errors error={mockError2} />);
      expect(screen.getByText("Second error")).toBeInTheDocument();
      expect(screen.queryByText("First error")).not.toBeInTheDocument();
    });

    it("should not have side effects during render", () => {
      const consoleSpy = jest.spyOn(console, "log").mockImplementation();
      const errorSpy = jest.spyOn(console, "error").mockImplementation();

      const mockError = {
        graphQLErrors: [{ message: "Test error" }],
      };

      render(<Errors error={mockError} />);

      expect(consoleSpy).not.toHaveBeenCalled();
      expect(errorSpy).not.toHaveBeenCalled();

      consoleSpy.mockRestore();
      errorSpy.mockRestore();
    });
  });

  describe("Edge cases", () => {
    it("should handle very long error messages", () => {
      const longMessage = "A".repeat(1000);
      const mockError = {
        graphQLErrors: [{ message: longMessage }],
      };

      render(<Errors error={mockError} />);

      const errorMessage = screen.getByText(longMessage);
      expect(errorMessage).toBeInTheDocument();
    });

    it("should handle special characters in error messages", () => {
      const specialMessage = "Error with special chars: !@#$%^&*()_+ 中文 🚀";
      const mockError = {
        graphQLErrors: [{ message: specialMessage }],
      };

      render(<Errors error={mockError} />);

      const errorMessage = screen.getByText(specialMessage);
      expect(errorMessage).toBeInTheDocument();
    });

    it("should handle HTML-like content in error messages", () => {
      const htmlMessage = "<script>alert('xss')</script> Normal error";
      const mockError = {
        graphQLErrors: [{ message: htmlMessage }],
      };

      render(<Errors error={mockError} />);

      // Should render as text, not as HTML (React escapes HTML)
      const errorMessage = screen.getByText(htmlMessage);
      expect(errorMessage).toBeInTheDocument();
      expect(errorMessage.textContent).toBe(htmlMessage);
    });

    it("should handle numeric error messages", () => {
      const mockError = {
        graphQLErrors: [{ message: 404 }, { message: "String error" }],
      };

      render(<Errors error={mockError} />);

      const numericError = screen.getByText("404");
      const stringError = screen.getByText("String error");

      expect(numericError).toBeInTheDocument();
      expect(stringError).toBeInTheDocument();
    });
  });
});
