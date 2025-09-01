import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import { MemoryRouter } from "react-router-dom";

import AuthForm from "../../src/components/AuthForm.jsx";

// Mock the Errors component
jest.mock("../../src/components/Errors.jsx", () => {
  return function MockErrors({ error }) {
    if (!error) return null;
    return <div data-testid="errors-component">{error.message}</div>;
  };
});

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

const renderWithRouter = (component) => {
  return render(<MemoryRouter>{component}</MemoryRouter>);
};

describe("AuthForm Component", () => {
  const mockOnSubmit = jest.fn();

  beforeEach(() => {
    mockNavigate.mockClear();
    mockOnSubmit.mockClear();
  });

  describe("Rendering", () => {
    it("should render without crashing", () => {
      expect(() =>
        renderWithRouter(
          <AuthForm title="Sign in" onSubmit={mockOnSubmit} error={null} />,
        ),
      ).not.toThrow();
    });

    it("should render the main element", () => {
      renderWithRouter(
        <AuthForm title="Sign in" onSubmit={mockOnSubmit} error={null} />,
      );

      const mainElement = screen.getByRole("main");
      expect(mainElement).toBeInTheDocument();
    });

    it("should render the title as heading", () => {
      renderWithRouter(
        <AuthForm title="Sign in" onSubmit={mockOnSubmit} error={null} />,
      );

      const heading = screen.getByRole("heading", { name: "Sign in" });
      expect(heading).toBeInTheDocument();
      expect(heading.tagName).toBe("H2");
    });

    it("should render email and password inputs", () => {
      renderWithRouter(
        <AuthForm title="Sign in" onSubmit={mockOnSubmit} error={null} />,
      );

      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/password/i);

      expect(emailInput).toBeInTheDocument();
      expect(passwordInput).toBeInTheDocument();
      expect(emailInput).toHaveAttribute("type", "text");
      expect(passwordInput).toHaveAttribute("type", "password");
    });

    it("should render submit button with title text", () => {
      renderWithRouter(
        <AuthForm title="Sign in" onSubmit={mockOnSubmit} error={null} />,
      );

      const submitButton = screen.getByRole("button", { name: "Sign in" });
      expect(submitButton).toBeInTheDocument();
      expect(submitButton).toHaveAttribute("type", "submit");
    });

    it("should render cancel link", () => {
      renderWithRouter(
        <AuthForm title="Sign in" onSubmit={mockOnSubmit} error={null} />,
      );

      const cancelLink = screen.getByRole("link", { name: /cancel/i });
      expect(cancelLink).toBeInTheDocument();
      expect(cancelLink).toHaveAttribute("href", "/");
    });
  });

  describe("Sign in form", () => {
    it("should show Sign up link when title is Sign in", () => {
      renderWithRouter(
        <AuthForm title="Sign in" onSubmit={mockOnSubmit} error={null} />,
      );

      const signupLink = screen.getByRole("link", { name: /sign up/i });
      expect(signupLink).toBeInTheDocument();
      expect(signupLink).toHaveAttribute("href", "/signup");
    });
  });

  describe("Sign up form", () => {
    it("should show Sign in link when title is Sign up", () => {
      renderWithRouter(
        <AuthForm title="Sign up" onSubmit={mockOnSubmit} error={null} />,
      );

      const signinLink = screen.getByRole("link", { name: /sign in/i });
      expect(signinLink).toBeInTheDocument();
      expect(signinLink).toHaveAttribute("href", "/signin");
    });
  });

  describe("Form interaction", () => {
    it("should update email input value", async () => {
      const user = userEvent.setup();
      renderWithRouter(
        <AuthForm title="Sign in" onSubmit={mockOnSubmit} error={null} />,
      );

      const emailInput = screen.getByLabelText(/email/i);
      await user.type(emailInput, "test@example.com");

      expect(emailInput).toHaveValue("test@example.com");
    });

    it("should update password input value", async () => {
      const user = userEvent.setup();
      renderWithRouter(
        <AuthForm title="Sign in" onSubmit={mockOnSubmit} error={null} />,
      );

      const passwordInput = screen.getByLabelText(/password/i);
      await user.type(passwordInput, "password123");

      expect(passwordInput).toHaveValue("password123");
    });

    it("should call onSubmit with form data when submitted", async () => {
      const user = userEvent.setup();
      mockOnSubmit.mockResolvedValue({});

      renderWithRouter(
        <AuthForm title="Sign in" onSubmit={mockOnSubmit} error={null} />,
      );

      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/password/i);
      const submitButton = screen.getByRole("button", { name: "Sign in" });

      await user.type(emailInput, "test@example.com");
      await user.type(passwordInput, "password123");
      await user.click(submitButton);

      expect(mockOnSubmit).toHaveBeenCalledWith({
        variables: {
          email: "test@example.com",
          password: "password123",
        },
      });
    });

    it("should handle form submission with keyboard", async () => {
      const user = userEvent.setup();
      mockOnSubmit.mockResolvedValue({});

      renderWithRouter(
        <AuthForm title="Sign in" onSubmit={mockOnSubmit} error={null} />,
      );

      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/password/i);

      await user.type(emailInput, "test@example.com");
      await user.type(passwordInput, "password123");
      await user.keyboard("{Enter}");

      expect(mockOnSubmit).toHaveBeenCalledWith({
        variables: {
          email: "test@example.com",
          password: "password123",
        },
      });
    });
  });

  describe("Loading state", () => {
    it("should show spinner when loading", async () => {
      const user = userEvent.setup();
      mockOnSubmit.mockImplementation(
        () => new Promise((resolve) => global.setTimeout(resolve, 100)),
      );

      renderWithRouter(
        <AuthForm title="Sign in" onSubmit={mockOnSubmit} error={null} />,
      );

      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/password/i);
      const submitButton = screen.getByRole("button", { name: "Sign in" });

      await user.type(emailInput, "test@example.com");
      await user.type(passwordInput, "password123");
      await user.click(submitButton);

      const spinner = screen
        .getByRole("button", { name: "" })
        .querySelector(".spinner");
      expect(spinner).toBeInTheDocument();
    });

    it("should disable submit button when loading", async () => {
      const user = userEvent.setup();
      mockOnSubmit.mockImplementation(
        () => new Promise((resolve) => global.setTimeout(resolve, 100)),
      );

      renderWithRouter(
        <AuthForm title="Sign in" onSubmit={mockOnSubmit} error={null} />,
      );

      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/password/i);
      const submitButton = screen.getByRole("button", { name: "Sign in" });

      await user.type(emailInput, "test@example.com");
      await user.type(passwordInput, "password123");
      await user.click(submitButton);

      expect(submitButton).toBeDisabled();
    });
  });

  describe("Error handling", () => {
    it("should display GraphQL error through Errors component", () => {
      const mockError = { message: "Invalid credentials" };
      renderWithRouter(
        <AuthForm title="Sign in" onSubmit={mockOnSubmit} error={mockError} />,
      );

      const errorsComponent = screen.getByTestId("errors-component");
      expect(errorsComponent).toBeInTheDocument();
      expect(errorsComponent).toHaveTextContent("Invalid credentials");
    });

    it("should display submission error", async () => {
      const user = userEvent.setup();
      mockOnSubmit.mockRejectedValue(new Error("Network error"));

      renderWithRouter(
        <AuthForm title="Sign in" onSubmit={mockOnSubmit} error={null} />,
      );

      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/password/i);
      const submitButton = screen.getByRole("button", { name: "Sign in" });

      await user.type(emailInput, "test@example.com");
      await user.type(passwordInput, "password123");
      await user.click(submitButton);

      await waitFor(() => {
        const errorHeading = screen.getByRole("heading", {
          name: /network error/i,
        });
        expect(errorHeading).toBeInTheDocument();
        expect(errorHeading).toHaveClass("error");
      });
    });

    it("should clear state error on new submission", async () => {
      const user = userEvent.setup();
      mockOnSubmit
        .mockRejectedValueOnce(new Error("First error"))
        .mockResolvedValueOnce({});

      renderWithRouter(
        <AuthForm title="Sign in" onSubmit={mockOnSubmit} error={null} />,
      );

      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/password/i);
      const submitButton = screen.getByRole("button", { name: "Sign in" });

      // First submission with error
      await user.type(emailInput, "test@example.com");
      await user.type(passwordInput, "password123");
      await user.click(submitButton);

      await waitFor(() => {
        expect(
          screen.getByRole("heading", { name: /first error/i }),
        ).toBeInTheDocument();
      });

      // Second submission should clear error
      await user.click(submitButton);

      await waitFor(() => {
        expect(
          screen.queryByRole("heading", { name: /first error/i }),
        ).not.toBeInTheDocument();
      });
    });

    describe("onSubmit catch block", () => {
      it("should handle error with message property", async () => {
        const user = userEvent.setup();
        const errorMessage = "Authentication failed";
        mockOnSubmit.mockRejectedValue(new Error(errorMessage));

        renderWithRouter(
          <AuthForm title="Sign in" onSubmit={mockOnSubmit} error={null} />,
        );

        const emailInput = screen.getByLabelText(/email/i);
        const passwordInput = screen.getByLabelText(/password/i);
        const submitButton = screen.getByRole("button", { name: "Sign in" });

        await user.type(emailInput, "test@example.com");
        await user.type(passwordInput, "password123");
        await user.click(submitButton);

        await waitFor(() => {
          const errorHeading = screen.getByRole("heading", {
            name: errorMessage,
          });
          expect(errorHeading).toBeInTheDocument();
          expect(errorHeading).toHaveClass("error");
        });
      });

      it("should handle error without message property", async () => {
        const user = userEvent.setup();
        // Create an error-like object without a message property
        const errorWithoutMessage = {
          code: 500,
          status: "Internal Server Error",
        };
        mockOnSubmit.mockRejectedValue(errorWithoutMessage);

        renderWithRouter(
          <AuthForm title="Sign in" onSubmit={mockOnSubmit} error={null} />,
        );

        const emailInput = screen.getByLabelText(/email/i);
        const passwordInput = screen.getByLabelText(/password/i);
        const submitButton = screen.getByRole("button", { name: "Sign in" });

        await user.type(emailInput, "test@example.com");
        await user.type(passwordInput, "password123");
        await user.click(submitButton);

        await waitFor(() => {
          const errorHeading = screen.getByRole("heading", {
            name: "Submission failed",
          });
          expect(errorHeading).toBeInTheDocument();
          expect(errorHeading).toHaveClass("error");
        });
      });

      it("should handle error with empty message", async () => {
        const user = userEvent.setup();
        const errorWithEmptyMessage = new Error("");
        mockOnSubmit.mockRejectedValue(errorWithEmptyMessage);

        renderWithRouter(
          <AuthForm title="Sign in" onSubmit={mockOnSubmit} error={null} />,
        );

        const emailInput = screen.getByLabelText(/email/i);
        const passwordInput = screen.getByLabelText(/password/i);
        const submitButton = screen.getByRole("button", { name: "Sign in" });

        await user.type(emailInput, "test@example.com");
        await user.type(passwordInput, "password123");
        await user.click(submitButton);

        await waitFor(() => {
          const errorHeading = screen.getByRole("heading", {
            name: "Submission failed",
          });
          expect(errorHeading).toBeInTheDocument();
          expect(errorHeading).toHaveClass("error");
        });
      });

      it("should handle GraphQL error format", async () => {
        const user = userEvent.setup();
        const graphQLError = {
          message: "User not found",
          extensions: { code: "USER_NOT_FOUND" },
          locations: [{ line: 1, column: 1 }],
        };
        mockOnSubmit.mockRejectedValue(graphQLError);

        renderWithRouter(
          <AuthForm title="Sign in" onSubmit={mockOnSubmit} error={null} />,
        );

        const emailInput = screen.getByLabelText(/email/i);
        const passwordInput = screen.getByLabelText(/password/i);
        const submitButton = screen.getByRole("button", { name: "Sign in" });

        await user.type(emailInput, "test@example.com");
        await user.type(passwordInput, "password123");
        await user.click(submitButton);

        await waitFor(() => {
          const errorHeading = screen.getByRole("heading", {
            name: "User not found",
          });
          expect(errorHeading).toBeInTheDocument();
          expect(errorHeading).toHaveClass("error");
        });
      });

      it("should handle null error", async () => {
        const user = userEvent.setup();
        mockOnSubmit.mockRejectedValue(null);

        renderWithRouter(
          <AuthForm title="Sign in" onSubmit={mockOnSubmit} error={null} />,
        );

        const emailInput = screen.getByLabelText(/email/i);
        const passwordInput = screen.getByLabelText(/password/i);
        const submitButton = screen.getByRole("button", { name: "Sign in" });

        await user.type(emailInput, "test@example.com");
        await user.type(passwordInput, "password123");
        await user.click(submitButton);

        await waitFor(() => {
          const errorHeading = screen.getByRole("heading", {
            name: "Submission failed",
          });
          expect(errorHeading).toBeInTheDocument();
          expect(errorHeading).toHaveClass("error");
        });
      });

      it("should handle undefined error", async () => {
        const user = userEvent.setup();
        mockOnSubmit.mockRejectedValue(undefined);

        renderWithRouter(
          <AuthForm title="Sign in" onSubmit={mockOnSubmit} error={null} />,
        );

        const emailInput = screen.getByLabelText(/email/i);
        const passwordInput = screen.getByLabelText(/password/i);
        const submitButton = screen.getByRole("button", { name: "Sign in" });

        await user.type(emailInput, "test@example.com");
        await user.type(passwordInput, "password123");
        await user.click(submitButton);

        await waitFor(() => {
          const errorHeading = screen.getByRole("heading", {
            name: "Submission failed",
          });
          expect(errorHeading).toBeInTheDocument();
          expect(errorHeading).toHaveClass("error");
        });
      });

      it("should handle string error", async () => {
        const user = userEvent.setup();
        mockOnSubmit.mockRejectedValue("Something went wrong");

        renderWithRouter(
          <AuthForm title="Sign in" onSubmit={mockOnSubmit} error={null} />,
        );

        const emailInput = screen.getByLabelText(/email/i);
        const passwordInput = screen.getByLabelText(/password/i);
        const submitButton = screen.getByRole("button", { name: "Sign in" });

        await user.type(emailInput, "test@example.com");
        await user.type(passwordInput, "password123");
        await user.click(submitButton);

        await waitFor(() => {
          const errorHeading = screen.getByRole("heading", {
            name: "Submission failed",
          });
          expect(errorHeading).toBeInTheDocument();
          expect(errorHeading).toHaveClass("error");
        });
      });

      it("should reset loading state after error", async () => {
        const user = userEvent.setup();
        mockOnSubmit.mockRejectedValue(new Error("Test error"));

        renderWithRouter(
          <AuthForm title="Sign in" onSubmit={mockOnSubmit} error={null} />,
        );

        const emailInput = screen.getByLabelText(/email/i);
        const passwordInput = screen.getByLabelText(/password/i);
        const submitButton = screen.getByRole("button", { name: "Sign in" });

        await user.type(emailInput, "test@example.com");
        await user.type(passwordInput, "password123");

        // Click submit and verify loading state appears briefly
        await user.click(submitButton);

        // Should reset loading state after error
        await waitFor(() => {
          expect(submitButton).not.toBeDisabled();
          expect(submitButton).toHaveTextContent("Sign in");
        });

        // Should also show the error message
        await waitFor(() => {
          const errorHeading = screen.getByRole("heading", {
            name: "Test error",
          });
          expect(errorHeading).toBeInTheDocument();
        });
      });

      it("should clear previous errors before showing new error", async () => {
        const user = userEvent.setup();
        mockOnSubmit
          .mockRejectedValueOnce(new Error("First error"))
          .mockRejectedValueOnce(new Error("Second error"));

        renderWithRouter(
          <AuthForm title="Sign in" onSubmit={mockOnSubmit} error={null} />,
        );

        const emailInput = screen.getByLabelText(/email/i);
        const passwordInput = screen.getByLabelText(/password/i);
        const submitButton = screen.getByRole("button", { name: "Sign in" });

        await user.type(emailInput, "test@example.com");
        await user.type(passwordInput, "password123");

        // First submission
        await user.click(submitButton);
        await waitFor(() => {
          expect(
            screen.getByRole("heading", { name: "First error" }),
          ).toBeInTheDocument();
        });

        // Second submission should replace the first error
        await user.click(submitButton);
        await waitFor(() => {
          expect(
            screen.getByRole("heading", { name: "Second error" }),
          ).toBeInTheDocument();
          expect(
            screen.queryByRole("heading", { name: "First error" }),
          ).not.toBeInTheDocument();
        });
      });
    });
  });

  describe("Navigation", () => {
    it("should have cancel link pointing to home", () => {
      renderWithRouter(
        <AuthForm title="Sign in" onSubmit={mockOnSubmit} error={null} />,
      );

      const cancelLink = screen.getByRole("link", { name: /cancel/i });
      expect(cancelLink).toHaveAttribute("href", "/");
    });
  });

  describe("Form validation", () => {
    it("should have required attributes on inputs", () => {
      renderWithRouter(
        <AuthForm title="Sign in" onSubmit={mockOnSubmit} error={null} />,
      );

      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/password/i);

      expect(emailInput).toBeRequired();
      expect(passwordInput).toBeRequired();
    });

    it("should have proper input types", () => {
      renderWithRouter(
        <AuthForm title="Sign in" onSubmit={mockOnSubmit} error={null} />,
      );

      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/password/i);

      expect(emailInput).toHaveAttribute("type", "text");
      expect(passwordInput).toHaveAttribute("type", "password");
    });

    it("should have placeholders", () => {
      renderWithRouter(
        <AuthForm title="Sign in" onSubmit={mockOnSubmit} error={null} />,
      );

      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/password/i);

      expect(emailInput).toHaveAttribute("placeholder", "John_Doe@example.com");
      expect(passwordInput).toHaveAttribute("placeholder", "password123");
    });
  });

  describe("Component behavior", () => {
    it("should be exported as default", () => {
      expect(AuthForm).toBeDefined();
      expect(typeof AuthForm).toBe("function");
    });

    it("should be a functional component", () => {
      expect(AuthForm.prototype.render).toBeUndefined();
      expect(AuthForm.prototype.componentDidMount).toBeUndefined();
    });

    it("should handle re-renders correctly", () => {
      const { rerender } = renderWithRouter(
        <AuthForm title="Sign in" onSubmit={mockOnSubmit} error={null} />,
      );

      expect(
        screen.getByRole("heading", { name: "Sign in" }),
      ).toBeInTheDocument();

      rerender(
        <MemoryRouter>
          <AuthForm title="Sign up" onSubmit={mockOnSubmit} error={null} />
        </MemoryRouter>,
      );

      expect(
        screen.getByRole("heading", { name: "Sign up" }),
      ).toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("should have proper form labels", () => {
      renderWithRouter(
        <AuthForm title="Sign in" onSubmit={mockOnSubmit} error={null} />,
      );

      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/password/i);

      expect(emailInput).toBeInTheDocument();
      expect(passwordInput).toBeInTheDocument();
    });

    it("should have proper heading hierarchy", () => {
      renderWithRouter(
        <AuthForm title="Sign in" onSubmit={mockOnSubmit} error={null} />,
      );

      const heading = screen.getByRole("heading", { level: 2 });
      expect(heading).toHaveTextContent("Sign in");
    });

    it("should be keyboard navigable", async () => {
      const user = userEvent.setup();
      renderWithRouter(
        <AuthForm title="Sign in" onSubmit={mockOnSubmit} error={null} />,
      );

      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/password/i);
      const submitButton = screen.getByRole("button", { name: "Sign in" });
      const cancelLink = screen.getByRole("link", { name: /cancel/i });
      const signupLink = screen.getByRole("link", { name: /sign up/i });

      await user.tab();
      expect(cancelLink).toHaveFocus();

      await user.tab();
      expect(signupLink).toHaveFocus();

      await user.tab();
      expect(emailInput).toHaveFocus();

      await user.tab();
      expect(passwordInput).toHaveFocus();

      await user.tab();
      expect(submitButton).toHaveFocus();
    });
  });
});
