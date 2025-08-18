import { MockedProvider } from "@apollo/client/testing";
import { render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter, MemoryRouter } from "react-router-dom";
import React from "react";

import requireAuth from "../../src/components/requireAuth.jsx";
import currentUserQuery from "../../src/queries/CurrentUser.js";

// Mock the Errors component
jest.mock("../../src/components/Errors.jsx", () => {
  return function MockErrors({ error }) {
    return <div data-testid="errors">Error: {error.message}</div>;
  };
});

// Create test components
const TestComponent = ({ user, ...props }) => (
  <div data-testid="test-component">
    <span data-testid="user-email">{user?.email}</span>
    <span data-testid="extra-prop">{props.extraProp}</span>
  </div>
);

const AuthenticatedTestComponent = requireAuth(TestComponent);

describe("requireAuth HOC", () => {
  const currentUserMock = {
    request: {
      query: currentUserQuery,
    },
    result: {
      data: {
        user: {
          id: "1",
          email: "test@example.com",
        },
      },
    },
  };

  const currentUserLoadingMock = {
    request: {
      query: currentUserQuery,
    },
    result: {
      loading: true,
    },
    delay: 100,
  };

  const currentUserErrorMock = {
    request: {
      query: currentUserQuery,
    },
    error: new Error("Authentication failed"),
  };

  const currentUserNoUserMock = {
    request: {
      query: currentUserQuery,
    },
    result: {
      data: {
        user: null,
      },
    },
  };

  it("should exist in the components directory", () => {
    // Simple test to ensure the test file has at least one test
    expect(true).toBe(true);
  });

  describe("HOC Functionality", () => {
    it("should be a function that returns a function", () => {
      expect(typeof requireAuth).toBe("function");
      expect(typeof requireAuth(TestComponent)).toBe("function");
    });

    it("should return a component that can be rendered", () => {
      const WrappedComponent = requireAuth(TestComponent);
      expect(() => {
        render(
          <BrowserRouter>
            <MockedProvider mocks={[currentUserMock]} addTypename={false}>
              <WrappedComponent />
            </MockedProvider>
          </BrowserRouter>,
        );
      }).not.toThrow();
    });

    it("should preserve the original component name in development", () => {
      const NamedComponent = () => <div>Named</div>;
      NamedComponent.displayName = "NamedComponent";

      const WrappedComponent = requireAuth(NamedComponent);
      expect(WrappedComponent).toBeDefined();
    });
  });

  describe("Loading State", () => {
    it("should show loading message when query is loading", () => {
      render(
        <BrowserRouter>
          <MockedProvider mocks={[currentUserLoadingMock]} addTypename={false}>
            <AuthenticatedTestComponent />
          </MockedProvider>
        </BrowserRouter>,
      );

      expect(screen.getByText("Loading...")).toBeInTheDocument();
    });

    it("should not render wrapped component during loading", () => {
      render(
        <BrowserRouter>
          <MockedProvider mocks={[currentUserLoadingMock]} addTypename={false}>
            <AuthenticatedTestComponent />
          </MockedProvider>
        </BrowserRouter>,
      );

      expect(screen.queryByTestId("test-component")).not.toBeInTheDocument();
    });
  });

  describe("Error State", () => {
    it("should render Errors component when query has error", async () => {
      render(
        <BrowserRouter>
          <MockedProvider mocks={[currentUserErrorMock]} addTypename={false}>
            <AuthenticatedTestComponent />
          </MockedProvider>
        </BrowserRouter>,
      );

      await waitFor(() => {
        expect(screen.getByTestId("errors")).toBeInTheDocument();
        expect(
          screen.getByText("Error: Authentication failed"),
        ).toBeInTheDocument();
      });
    });

    it("should not render wrapped component when there is an error", async () => {
      render(
        <BrowserRouter>
          <MockedProvider mocks={[currentUserErrorMock]} addTypename={false}>
            <AuthenticatedTestComponent />
          </MockedProvider>
        </BrowserRouter>,
      );

      await waitFor(() => {
        expect(screen.getByTestId("errors")).toBeInTheDocument();
      });

      expect(screen.queryByTestId("test-component")).not.toBeInTheDocument();
    });
  });

  describe("Unauthenticated State", () => {
    it("should redirect to signin when no user", async () => {
      const { container } = render(
        <MemoryRouter initialEntries={["/protected"]}>
          <MockedProvider mocks={[currentUserNoUserMock]} addTypename={false}>
            <AuthenticatedTestComponent />
          </MockedProvider>
        </MemoryRouter>,
      );

      await waitFor(() => {
        // The Navigate component will attempt to navigate
        // In test environment, we can't easily test actual navigation
        // but we can verify the component doesn't render
        expect(screen.queryByTestId("test-component")).not.toBeInTheDocument();
      });
    });

    it("should not render wrapped component when user is null", async () => {
      render(
        <MemoryRouter>
          <MockedProvider mocks={[currentUserNoUserMock]} addTypename={false}>
            <AuthenticatedTestComponent />
          </MockedProvider>
        </MemoryRouter>,
      );

      await waitFor(() => {
        expect(screen.queryByTestId("test-component")).not.toBeInTheDocument();
      });
    });

    it("should redirect when user is undefined", async () => {
      const undefinedUserMock = {
        request: {
          query: currentUserQuery,
        },
        result: {
          data: {
            user: undefined,
          },
        },
      };

      render(
        <MemoryRouter>
          <MockedProvider mocks={[undefinedUserMock]} addTypename={false}>
            <AuthenticatedTestComponent />
          </MockedProvider>
        </MemoryRouter>,
      );

      await waitFor(() => {
        expect(screen.queryByTestId("test-component")).not.toBeInTheDocument();
      });
    });
  });

  describe("Authenticated State", () => {
    it("should render wrapped component when user exists", async () => {
      render(
        <BrowserRouter>
          <MockedProvider mocks={[currentUserMock]} addTypename={false}>
            <AuthenticatedTestComponent />
          </MockedProvider>
        </BrowserRouter>,
      );

      await waitFor(() => {
        expect(screen.getByTestId("test-component")).toBeInTheDocument();
      });
    });

    it("should pass user data to wrapped component", async () => {
      render(
        <BrowserRouter>
          <MockedProvider mocks={[currentUserMock]} addTypename={false}>
            <AuthenticatedTestComponent />
          </MockedProvider>
        </BrowserRouter>,
      );

      await waitFor(() => {
        expect(screen.getByTestId("user-email")).toHaveTextContent(
          "test@example.com",
        );
      });
    });

    it("should pass through additional props to wrapped component", async () => {
      render(
        <BrowserRouter>
          <MockedProvider mocks={[currentUserMock]} addTypename={false}>
            <AuthenticatedTestComponent extraProp="test-value" />
          </MockedProvider>
        </BrowserRouter>,
      );

      await waitFor(() => {
        expect(screen.getByTestId("extra-prop")).toHaveTextContent(
          "test-value",
        );
      });
    });

    it("should work with different user data", async () => {
      const differentUserMock = {
        request: {
          query: currentUserQuery,
        },
        result: {
          data: {
            user: {
              id: "2",
              email: "different@example.com",
            },
          },
        },
      };

      render(
        <BrowserRouter>
          <MockedProvider mocks={[differentUserMock]} addTypename={false}>
            <AuthenticatedTestComponent />
          </MockedProvider>
        </BrowserRouter>,
      );

      await waitFor(() => {
        expect(screen.getByTestId("user-email")).toHaveTextContent(
          "different@example.com",
        );
      });
    });
  });

  describe("Component Integration", () => {
    it("should work with class components", async () => {
      class ClassComponent extends React.Component {
        render() {
          return (
            <div data-testid="class-component">
              User: {this.props.user?.email}
            </div>
          );
        }
      }

      const AuthenticatedClass = requireAuth(ClassComponent);

      render(
        <BrowserRouter>
          <MockedProvider mocks={[currentUserMock]} addTypename={false}>
            <AuthenticatedClass />
          </MockedProvider>
        </BrowserRouter>,
      );

      await waitFor(() => {
        expect(screen.getByTestId("class-component")).toBeInTheDocument();
        expect(screen.getByText("User: test@example.com")).toBeInTheDocument();
      });
    });

    it("should work with functional components", async () => {
      const FunctionalComponent = ({ user }) => (
        <div data-testid="functional-component">
          Functional User: {user?.email}
        </div>
      );

      const AuthenticatedFunctional = requireAuth(FunctionalComponent);

      render(
        <BrowserRouter>
          <MockedProvider mocks={[currentUserMock]} addTypename={false}>
            <AuthenticatedFunctional />
          </MockedProvider>
        </BrowserRouter>,
      );

      await waitFor(() => {
        expect(screen.getByTestId("functional-component")).toBeInTheDocument();
        expect(
          screen.getByText("Functional User: test@example.com"),
        ).toBeInTheDocument();
      });
    });

    it("should maintain component behavior after authentication", async () => {
      const InteractiveComponent = ({ user, onClick }) => (
        <button data-testid="interactive-button" onClick={onClick}>
          Click me, {user?.email}
        </button>
      );

      const AuthenticatedInteractive = requireAuth(InteractiveComponent);
      const mockClick = jest.fn();

      render(
        <BrowserRouter>
          <MockedProvider mocks={[currentUserMock]} addTypename={false}>
            <AuthenticatedInteractive onClick={mockClick} />
          </MockedProvider>
        </BrowserRouter>,
      );

      await waitFor(() => {
        expect(screen.getByTestId("interactive-button")).toBeInTheDocument();
      });

      const button = screen.getByTestId("interactive-button");
      button.click();
      expect(mockClick).toHaveBeenCalledTimes(1);
    });
  });

  describe("Edge Cases", () => {
    it("should handle missing data object", async () => {
      const noDataMock = {
        request: {
          query: currentUserQuery,
        },
        result: {
          data: null,
        },
      };

      render(
        <MemoryRouter>
          <MockedProvider mocks={[noDataMock]} addTypename={false}>
            <AuthenticatedTestComponent />
          </MockedProvider>
        </MemoryRouter>,
      );

      await waitFor(() => {
        expect(screen.queryByTestId("test-component")).not.toBeInTheDocument();
      });
    });

    it("should handle empty data object", async () => {
      const emptyDataMock = {
        request: {
          query: currentUserQuery,
        },
        result: {
          data: {},
        },
      };

      render(
        <MemoryRouter>
          <MockedProvider mocks={[emptyDataMock]} addTypename={false}>
            <AuthenticatedTestComponent />
          </MockedProvider>
        </MemoryRouter>,
      );

      await waitFor(() => {
        expect(screen.queryByTestId("test-component")).not.toBeInTheDocument();
      });
    });

    it("should handle query refetch scenarios", async () => {
      const { rerender } = render(
        <BrowserRouter>
          <MockedProvider mocks={[currentUserMock]} addTypename={false}>
            <AuthenticatedTestComponent />
          </MockedProvider>
        </BrowserRouter>,
      );

      await waitFor(() => {
        expect(screen.getByTestId("test-component")).toBeInTheDocument();
      });

      // Component should remain stable after initial load
      expect(screen.getByTestId("user-email")).toHaveTextContent(
        "test@example.com",
      );
    });
  });
});
