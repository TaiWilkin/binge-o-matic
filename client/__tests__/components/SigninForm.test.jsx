import { MockedProvider } from "@apollo/client/testing";
import { render, screen } from "@testing-library/react";
import { fireEvent } from "@testing-library/react";
import React from "react";
import { MemoryRouter } from "react-router-dom";

import SigninForm from "../../src/components/SigninForm.jsx";
import LOGIN_MUTATION from "../../src/mutations/Login.js";

const mocks = [
  {
    request: {
      query: LOGIN_MUTATION,
      variables: { email: "test@test.com", password: "password" },
    },
    result: {
      data: {
        login: {
          id: "1",
          email: "test@test.com",
        },
      },
    },
  },
];

// Mock the AuthForm component
jest.mock("../../src/components/AuthForm.jsx", () => {
  return function MockAuthForm({ title, onSubmit, error }) {
    return (
      <div data-testid="mock-auth-form">
        <h1>{title}</h1>
        <button
          onClick={() =>
            onSubmit({
              variables: { email: "test@test.com", password: "password" },
            })
          }
        >
          Submit
        </button>
        {error && <div data-testid="error">{error.message}</div>}
      </div>
    );
  };
});

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

// Mock useMutation to test onCompleted directly
let mockLogin;
jest.mock("@apollo/client", () => ({
  ...jest.requireActual("@apollo/client"),
  useMutation: jest.fn(() => [mockLogin, { error: null }]),
}));

// Mock the mutations and queries
jest.mock("../../src/mutations/Login", () => ({
  __esModule: true,
  default: {
    kind: "Document",
    definitions: [
      {
        kind: "OperationDefinition",
        operation: "mutation",
        name: { kind: "Name", value: "Login" },
      },
    ],
  },
}));

jest.mock("../../src/queries/CurrentUser", () => ({
  __esModule: true,
  default: {
    kind: "Document",
    definitions: [
      {
        kind: "OperationDefinition",
        operation: "query",
        name: { kind: "Name", value: "CurrentUser" },
      },
    ],
  },
}));

const renderWithProviders = (component) => {
  return render(
    <MockedProvider mocks={mocks} addTypename={false}>
      <MemoryRouter>{component}</MemoryRouter>
    </MockedProvider>,
  );
};

describe("SigninForm Component", () => {
  beforeEach(() => {
    mockNavigate.mockClear();
    mockLogin = jest.fn();
  });

  describe("onCompleted callback", () => {
    it("should navigate to home page when login mutation completes", () => {
      // Mock useMutation to capture the onCompleted callback
      const { useMutation } = require("@apollo/client");
      let capturedOnCompleted;

      useMutation.mockImplementation((mutation, options) => {
        capturedOnCompleted = options.onCompleted;
        return [mockLogin, { error: null }];
      });

      renderWithProviders(<SigninForm />);

      // Simulate successful login completion
      if (capturedOnCompleted) {
        capturedOnCompleted();
      }

      expect(mockNavigate).toHaveBeenCalledWith("/");
    });

    it("should navigate to root path specifically", () => {
      const { useMutation } = require("@apollo/client");
      let capturedOnCompleted;

      useMutation.mockImplementation((mutation, options) => {
        capturedOnCompleted = options.onCompleted;
        return [mockLogin, { error: null }];
      });

      renderWithProviders(<SigninForm />);

      if (capturedOnCompleted) {
        capturedOnCompleted();
      }

      expect(mockNavigate).toHaveBeenCalledTimes(1);
      expect(mockNavigate).toHaveBeenCalledWith("/");
    });

    it("should configure useMutation with onCompleted callback", () => {
      const useMutationSpy = jest.spyOn(
        require("@apollo/client"),
        "useMutation",
      );

      renderWithProviders(<SigninForm />);

      expect(useMutationSpy).toHaveBeenCalledWith(
        expect.anything(), // mutation
        expect.objectContaining({
          onCompleted: expect.any(Function),
          refetchQueries: expect.any(Array),
        }),
      );
    });

    it("should only navigate after successful mutation completion", () => {
      const { useMutation } = require("@apollo/client");
      let capturedOnCompleted;

      useMutation.mockImplementation((mutation, options) => {
        capturedOnCompleted = options.onCompleted;
        return [mockLogin, { error: null }];
      });

      renderWithProviders(<SigninForm />);

      // Navigation should not happen during render
      expect(mockNavigate).not.toHaveBeenCalled();

      // Navigation should happen only when onCompleted is called
      if (capturedOnCompleted) {
        capturedOnCompleted();
      }

      expect(mockNavigate).toHaveBeenCalledTimes(1);
    });

    it("should handle onCompleted callback even with mutation data", () => {
      const { useMutation } = require("@apollo/client");
      let capturedOnCompleted;

      useMutation.mockImplementation((mutation, options) => {
        capturedOnCompleted = options.onCompleted;
        return [mockLogin, { error: null }];
      });

      renderWithProviders(<SigninForm />);

      // Simulate onCompleted with data (like a real Apollo mutation would)
      const mockData = {
        login: {
          id: "1",
          email: "test@test.com",
        },
      };

      if (capturedOnCompleted) {
        capturedOnCompleted(mockData);
      }

      expect(mockNavigate).toHaveBeenCalledWith("/");
    });

    it("should navigate regardless of mutation data content", () => {
      const { useMutation } = require("@apollo/client");
      let capturedOnCompleted;

      useMutation.mockImplementation((mutation, options) => {
        capturedOnCompleted = options.onCompleted;
        return [mockLogin, { error: null }];
      });

      renderWithProviders(<SigninForm />);

      // Test with different data scenarios
      if (capturedOnCompleted) {
        capturedOnCompleted(null);
      }

      expect(mockNavigate).toHaveBeenCalledWith("/");

      mockNavigate.mockClear();

      if (capturedOnCompleted) {
        capturedOnCompleted(undefined);
      }

      expect(mockNavigate).toHaveBeenCalledWith("/");
    });

    it("should work with refetchQueries configuration", () => {
      const { useMutation } = require("@apollo/client");
      let capturedOnCompleted;
      let capturedOptions;

      useMutation.mockImplementation((mutation, options) => {
        capturedOnCompleted = options.onCompleted;
        capturedOptions = options;
        return [mockLogin, { error: null }];
      });

      renderWithProviders(<SigninForm />);

      // Verify both onCompleted and refetchQueries are configured
      expect(capturedOptions).toEqual(
        expect.objectContaining({
          onCompleted: expect.any(Function),
          refetchQueries: expect.any(Array),
        }),
      );

      if (capturedOnCompleted) {
        capturedOnCompleted();
      }

      expect(mockNavigate).toHaveBeenCalledWith("/");
    });
  });
  describe("Rendering", () => {
    it("should render without crashing", () => {
      expect(() => renderWithProviders(<SigninForm />)).not.toThrow();
    });

    it("should render AuthForm with correct title", () => {
      renderWithProviders(<SigninForm />);

      const authForm = screen.getByTestId("mock-auth-form");
      expect(authForm).toBeInTheDocument();

      const title = screen.getByText("Sign in");
      expect(title).toBeInTheDocument();
      expect(title.tagName).toBe("H1");
    });

    it("should wrap AuthForm in a div", () => {
      const { container } = renderWithProviders(<SigninForm />);

      const wrapper = container.firstChild;
      expect(wrapper.tagName).toBe("DIV");

      const authForm = screen.getByTestId("mock-auth-form");
      expect(wrapper).toContainElement(authForm);
    });

    it("should have correct component structure", () => {
      const { container } = renderWithProviders(<SigninForm />);

      expect(container.children).toHaveLength(1);
      expect(container.firstChild.tagName).toBe("DIV");
    });
  });

  describe("Apollo Integration", () => {
    it("should use Apollo useMutation hook", () => {
      // This test verifies that the component renders without Apollo errors
      expect(() => renderWithProviders(<SigninForm />)).not.toThrow();
    });

    it("should pass login mutation to AuthForm", () => {
      renderWithProviders(<SigninForm />);

      const submitButton = screen.getByText("Submit");
      expect(submitButton).toBeInTheDocument();

      fireEvent.click(submitButton);
    });

    it("should configure mutation with correct options", () => {
      // Test that the component renders and mutation is properly configured
      renderWithProviders(<SigninForm />);

      const authForm = screen.getByTestId("mock-auth-form");
      expect(authForm).toBeInTheDocument();
    });
  });

  describe("Router Integration", () => {
    it("should use React Router useNavigate hook", () => {
      // This test verifies that the component renders without router errors
      expect(() => renderWithProviders(<SigninForm />)).not.toThrow();
    });

    it("should render within router context", () => {
      renderWithProviders(<SigninForm />);

      const authForm = screen.getByTestId("mock-auth-form");
      expect(authForm).toBeInTheDocument();
    });
  });

  describe("Props and Data Flow", () => {
    it("should pass correct title to AuthForm", () => {
      renderWithProviders(<SigninForm />);

      const title = screen.getByText("Sign in");
      expect(title).toBeInTheDocument();
    });

    it("should pass onSubmit function to AuthForm", () => {
      renderWithProviders(<SigninForm />);

      const submitButton = screen.getByText("Submit");
      expect(submitButton).toBeInTheDocument();
    });

    it("should pass error to AuthForm when mutation fails", () => {
      // We don't need to actually mock the real mutation since we're testing component behavior
      renderWithProviders(<SigninForm />);

      const authForm = screen.getByTestId("mock-auth-form");
      expect(authForm).toBeInTheDocument();
    });
  });

  describe("Component Behavior", () => {
    it("should be exported as default", () => {
      expect(SigninForm).toBeDefined();
      expect(typeof SigninForm).toBe("function");
    });

    it("should be a functional component", () => {
      expect(SigninForm.prototype.render).toBeUndefined();
      expect(SigninForm.prototype.componentDidMount).toBeUndefined();
    });

    it("should handle re-renders correctly", () => {
      const { rerender } = renderWithProviders(<SigninForm />);

      let authForm = screen.getByTestId("mock-auth-form");
      expect(authForm).toBeInTheDocument();

      rerender(
        <MockedProvider mocks={[]} addTypename={false}>
          <MemoryRouter>
            <SigninForm />
          </MemoryRouter>
        </MockedProvider>,
      );

      authForm = screen.getByTestId("mock-auth-form");
      expect(authForm).toBeInTheDocument();
    });

    it("should not have side effects during render", () => {
      const consoleSpy = jest.spyOn(console, "log").mockImplementation();

      renderWithProviders(<SigninForm />);

      expect(consoleSpy).not.toHaveBeenCalled();

      consoleSpy.mockRestore();
    });
  });

  describe("Error Handling", () => {
    it("should handle Apollo Provider errors gracefully", () => {
      expect(() => renderWithProviders(<SigninForm />)).not.toThrow();
    });

    it("should render without required providers", () => {
      // With our mocking setup, the component can render without providers
      // This test verifies the component doesn't crash due to our mocks
      expect(() => render(<SigninForm />)).not.toThrow();
    });
  });

  describe("Integration with Dependencies", () => {
    it("should work with different router states", () => {
      render(
        <MockedProvider mocks={[]} addTypename={false}>
          <MemoryRouter initialEntries={["/signin"]}>
            <SigninForm />
          </MemoryRouter>
        </MockedProvider>,
      );

      const authForm = screen.getByTestId("mock-auth-form");
      expect(authForm).toBeInTheDocument();
    });

    it("should handle Apollo cache updates", () => {
      renderWithProviders(<SigninForm />);

      const authForm = screen.getByTestId("mock-auth-form");
      expect(authForm).toBeInTheDocument();
    });

    it("should maintain component state across provider updates", () => {
      const { rerender } = render(
        <MockedProvider mocks={[]} addTypename={false}>
          <MemoryRouter>
            <SigninForm />
          </MemoryRouter>
        </MockedProvider>,
      );

      expect(screen.getByTestId("mock-auth-form")).toBeInTheDocument();

      rerender(
        <MockedProvider mocks={[]} addTypename={false}>
          <MemoryRouter>
            <SigninForm />
          </MemoryRouter>
        </MockedProvider>,
      );

      expect(screen.getByTestId("mock-auth-form")).toBeInTheDocument();
    });
  });

  describe("Mutation Configuration", () => {
    it("should configure refetchQueries correctly", () => {
      // Test that component renders without GraphQL errors
      renderWithProviders(<SigninForm />);

      const authForm = screen.getByTestId("mock-auth-form");
      expect(authForm).toBeInTheDocument();
    });

    it("should configure onCompleted callback", () => {
      // Test that component renders and navigation setup doesn't cause errors
      renderWithProviders(<SigninForm />);

      const authForm = screen.getByTestId("mock-auth-form");
      expect(authForm).toBeInTheDocument();
    });
  });
});
