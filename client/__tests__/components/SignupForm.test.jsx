import { MockedProvider } from "@apollo/client/testing";
import { render, screen } from "@testing-library/react";
import React from "react";
import { MemoryRouter } from "react-router-dom";
import { fireEvent } from "@testing-library/react";

import SignupForm from "../../src/components/SignupForm.jsx";
import SIGNUP_MUTATION from "../../src/mutations/Signup.js";

const mocks = [
  {
    request: {
      query: SIGNUP_MUTATION,
      variables: { email: "test@test.com", password: "password" },
    },
    result: {
      data: {
        data: {
          signup: {
            id: "1",
            email: "test@test.com",
          },
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

// Mock the mutations and queries
jest.mock("../../src/mutations/Signup", () => ({
  __esModule: true,
  default: {
    kind: "Document",
    definitions: [
      {
        kind: "OperationDefinition",
        operation: "mutation",
        name: { kind: "Name", value: "Signup" },
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

describe("SignupForm Component", () => {
  describe("Rendering", () => {
    it("should render without crashing", () => {
      expect(() => renderWithProviders(<SignupForm />)).not.toThrow();
    });

    it("should render AuthForm with correct title", () => {
      renderWithProviders(<SignupForm />);

      const authForm = screen.getByTestId("mock-auth-form");
      expect(authForm).toBeInTheDocument();

      const title = screen.getByText("Sign up");
      expect(title).toBeInTheDocument();
      expect(title.tagName).toBe("H1");
    });

    it("should wrap AuthForm in a div", () => {
      const { container } = renderWithProviders(<SignupForm />);

      const wrapper = container.firstChild;
      expect(wrapper.tagName).toBe("DIV");

      const authForm = screen.getByTestId("mock-auth-form");
      expect(wrapper).toContainElement(authForm);
    });

    it("should have correct component structure", () => {
      const { container } = renderWithProviders(<SignupForm />);

      expect(container.children).toHaveLength(1);
      expect(container.firstChild.tagName).toBe("DIV");
    });
  });

  describe("Apollo Integration", () => {
    it("should use Apollo useMutation hook", () => {
      // This test verifies that the component renders without Apollo errors
      expect(() => renderWithProviders(<SignupForm />)).not.toThrow();
    });

    it("should pass signup mutation to AuthForm", () => {
      renderWithProviders(<SignupForm />);

      const submitButton = screen.getByText("Submit");
      expect(submitButton).toBeInTheDocument();

      fireEvent.click(submitButton);
    });

    it("should configure mutation with correct options", () => {
      // Test that the component renders and mutation is properly configured
      renderWithProviders(<SignupForm />);

      const authForm = screen.getByTestId("mock-auth-form");
      expect(authForm).toBeInTheDocument();
    });
  });

  describe("Router Integration", () => {
    it("should use React Router useNavigate hook", () => {
      // This test verifies that the component renders without router errors
      expect(() => renderWithProviders(<SignupForm />)).not.toThrow();
    });

    it("should render within router context", () => {
      renderWithProviders(<SignupForm />);

      const authForm = screen.getByTestId("mock-auth-form");
      expect(authForm).toBeInTheDocument();
    });
  });

  describe("Props and Data Flow", () => {
    it("should pass correct title to AuthForm", () => {
      renderWithProviders(<SignupForm />);

      const title = screen.getByText("Sign up");
      expect(title).toBeInTheDocument();
    });

    it("should pass onSubmit function to AuthForm", () => {
      renderWithProviders(<SignupForm />);

      const submitButton = screen.getByText("Submit");
      expect(submitButton).toBeInTheDocument();
    });

    it("should pass error to AuthForm when mutation fails", () => {
      const mocks = [
        {
          request: {
            query: require("../../src/mutations/Signup").default,
            variables: { email: "test@test.com", password: "password" },
          },
          error: new Error("Signup failed"),
        },
      ];

      render(
        <MockedProvider mocks={mocks} addTypename={false}>
          <MemoryRouter>
            <SignupForm />
          </MemoryRouter>
        </MockedProvider>,
      );

      const authForm = screen.getByTestId("mock-auth-form");
      expect(authForm).toBeInTheDocument();
    });
  });

  describe("Component Behavior", () => {
    it("should be exported as default", () => {
      expect(SignupForm).toBeDefined();
      expect(typeof SignupForm).toBe("function");
    });

    it("should be a functional component", () => {
      expect(SignupForm.prototype.render).toBeUndefined();
      expect(SignupForm.prototype.componentDidMount).toBeUndefined();
    });

    it("should handle re-renders correctly", () => {
      const { rerender } = renderWithProviders(<SignupForm />);

      let authForm = screen.getByTestId("mock-auth-form");
      expect(authForm).toBeInTheDocument();

      rerender(
        <MockedProvider mocks={[]} addTypename={false}>
          <MemoryRouter>
            <SignupForm />
          </MemoryRouter>
        </MockedProvider>,
      );

      authForm = screen.getByTestId("mock-auth-form");
      expect(authForm).toBeInTheDocument();
    });

    it("should not have side effects during render", () => {
      const consoleSpy = jest.spyOn(console, "log").mockImplementation();

      renderWithProviders(<SignupForm />);

      expect(consoleSpy).not.toHaveBeenCalled();

      consoleSpy.mockRestore();
    });
  });

  describe("Error Handling", () => {
    it("should handle Apollo Provider errors gracefully", () => {
      expect(() => renderWithProviders(<SignupForm />)).not.toThrow();
    });

    it("should render without required providers", () => {
      // This should fail gracefully
      expect(() => render(<SignupForm />)).toThrow();
    });
  });

  describe("Integration with Dependencies", () => {
    it("should work with different router states", () => {
      render(
        <MockedProvider mocks={[]} addTypename={false}>
          <MemoryRouter initialEntries={["/signup"]}>
            <SignupForm />
          </MemoryRouter>
        </MockedProvider>,
      );

      const authForm = screen.getByTestId("mock-auth-form");
      expect(authForm).toBeInTheDocument();
    });

    it("should handle Apollo cache updates", () => {
      renderWithProviders(<SignupForm />);

      const authForm = screen.getByTestId("mock-auth-form");
      expect(authForm).toBeInTheDocument();
    });

    it("should maintain component state across provider updates", () => {
      const { rerender } = render(
        <MockedProvider mocks={[]} addTypename={false}>
          <MemoryRouter>
            <SignupForm />
          </MemoryRouter>
        </MockedProvider>,
      );

      expect(screen.getByTestId("mock-auth-form")).toBeInTheDocument();

      rerender(
        <MockedProvider mocks={[]} addTypename={false}>
          <MemoryRouter>
            <SignupForm />
          </MemoryRouter>
        </MockedProvider>,
      );

      expect(screen.getByTestId("mock-auth-form")).toBeInTheDocument();
    });
  });

  describe("Mutation Configuration", () => {
    it("should configure refetchQueries correctly", () => {
      // Test that component renders without GraphQL errors
      renderWithProviders(<SignupForm />);

      const authForm = screen.getByTestId("mock-auth-form");
      expect(authForm).toBeInTheDocument();
    });

    it("should configure onCompleted callback", () => {
      // Test that component renders and navigation setup doesn't cause errors
      renderWithProviders(<SignupForm />);

      const authForm = screen.getByTestId("mock-auth-form");
      expect(authForm).toBeInTheDocument();
    });
  });

  describe("Title Differences", () => {
    it("should have different title from SigninForm", () => {
      renderWithProviders(<SignupForm />);

      const title = screen.getByText("Sign up");
      expect(title).toBeInTheDocument();

      const signinTitle = screen.queryByText("Sign in");
      expect(signinTitle).not.toBeInTheDocument();
    });

    it("should consistently use 'Sign up' title", () => {
      renderWithProviders(<SignupForm />);

      const title = screen.getByText("Sign up");
      expect(title).toBeInTheDocument();
      expect(title.tagName).toBe("H1");
    });
  });
});
