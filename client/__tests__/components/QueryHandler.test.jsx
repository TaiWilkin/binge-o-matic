import { MockedProvider } from "@apollo/client/testing";
import { render, screen, waitFor } from "@testing-library/react";
import { GraphQLError } from "graphql";
import React from "react";

import QueryHandler from "../../src/components/QueryHandler.jsx";
import USER_QUERY from "../../src/queries/CurrentUser";

// Mock the Errors component
jest.mock("../../src/components/Errors.jsx", () => {
  return function MockErrors({ error }) {
    return (
      <div data-testid="errors-component">
        Error: {error?.message || "Unknown error"}
      </div>
    );
  };
});

// Mock the Loading component
jest.mock("../../src/components/Loading.jsx", () => {
  return function MockLoading() {
    return <div data-testid="loading-component">Loading...</div>;
  };
});

const currentUserMock = {
  request: {
    query: USER_QUERY,
  },
  result: {
    data: {
      user: {
        id: "1",
        email: "test@test.com",
      },
    },
  },
};

describe("QueryHandler Component", () => {
  it("should render its children", async () => {
    render(
      <MockedProvider mocks={[currentUserMock]} addTypename={false}>
        <QueryHandler query={USER_QUERY}>
          {({ loading, error }) => {
            if (loading) return <p>Loading...</p>;
            if (error) return <p>Error!</p>;
            return <p>hi</p>;
          }}
        </QueryHandler>
      </MockedProvider>,
    );

    // Wait for the query to load
    await waitFor(() => {
      expect(screen.getByText("hi")).toBeInTheDocument();
    });
  });

  it("should show loading state", () => {
    render(
      <MockedProvider mocks={[currentUserMock]} addTypename={false}>
        <QueryHandler query={USER_QUERY}>
          {({ loading, error }) => {
            if (loading) return <p>Loading...</p>;
            if (error) return <p>Error!</p>;
            return <p>Loaded</p>;
          }}
        </QueryHandler>
      </MockedProvider>,
    );

    // Should show the default Loading component, not the children's loading
    expect(screen.getByTestId("loading-component")).toBeInTheDocument();
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("should pass query data to children function", async () => {
    render(
      <MockedProvider mocks={[currentUserMock]} addTypename={false}>
        <QueryHandler query={USER_QUERY}>
          {({ loading, error, data }) => {
            if (loading) return <p>Loading...</p>;
            if (error) return <p>Error!</p>;
            return <p>User: {data?.user?.email}</p>;
          }}
        </QueryHandler>
      </MockedProvider>,
    );

    await waitFor(() => {
      expect(screen.getByText("User: test@test.com")).toBeInTheDocument();
    });
  });

  it("should use custom loader when useCustomLoader is true", () => {
    render(
      <MockedProvider mocks={[currentUserMock]} addTypename={false}>
        <QueryHandler query={USER_QUERY} useCustomLoader={true}>
          {({ loading, error }) => {
            if (loading) return <p>Custom Loading...</p>;
            if (error) return <p>Error!</p>;
            return <p>Loaded</p>;
          }}
        </QueryHandler>
      </MockedProvider>,
    );

    expect(screen.getByText("Custom Loading...")).toBeInTheDocument();
  });

  it("should handle query variables", async () => {
    const queryWithVariables = {
      request: {
        query: USER_QUERY,
        variables: { id: "123" },
      },
      result: {
        data: {
          user: {
            id: "123",
            email: "variable@test.com",
          },
        },
      },
    };

    render(
      <MockedProvider mocks={[queryWithVariables]} addTypename={false}>
        <QueryHandler query={USER_QUERY} variables={{ id: "123" }}>
          {({ loading, error, data }) => {
            if (loading) return <p>Loading...</p>;
            if (error) return <p>Error!</p>;
            return <p>Variable User: {data?.user?.email}</p>;
          }}
        </QueryHandler>
      </MockedProvider>,
    );

    await waitFor(() => {
      expect(
        screen.getByText("Variable User: variable@test.com"),
      ).toBeInTheDocument();
    });
  });

  describe("Error handling", () => {
    it("should render Errors component when query returns a GraphQL error", async () => {
      const errorMock = {
        request: {
          query: USER_QUERY,
        },
        error: new GraphQLError("User not found"),
      };

      render(
        <MockedProvider mocks={[errorMock]} addTypename={false}>
          <QueryHandler query={USER_QUERY}>
            {({ loading, error }) => {
              if (loading) return <p>Loading...</p>;
              if (error) return <p>Error from children!</p>;
              return <p>Success</p>;
            }}
          </QueryHandler>
        </MockedProvider>,
      );

      // Should show the Errors component, not the children's error handling
      await waitFor(() => {
        expect(screen.getByTestId("errors-component")).toBeInTheDocument();
        expect(screen.getByText("Error: User not found")).toBeInTheDocument();
      });

      // Should NOT render the children's error handling
      expect(
        screen.queryByText("Error from children!"),
      ).not.toBeInTheDocument();
      expect(screen.queryByText("Success")).not.toBeInTheDocument();
    });

    it("should render Errors component when query returns a network error", async () => {
      const networkErrorMock = {
        request: {
          query: USER_QUERY,
        },
        error: new Error("Network error: Failed to fetch"),
      };

      render(
        <MockedProvider mocks={[networkErrorMock]} addTypename={false}>
          <QueryHandler query={USER_QUERY}>
            {({ loading, error }) => {
              if (loading) return <p>Loading...</p>;
              if (error) return <p>Children error handler</p>;
              return <p>Success</p>;
            }}
          </QueryHandler>
        </MockedProvider>,
      );

      await waitFor(() => {
        expect(screen.getByTestId("errors-component")).toBeInTheDocument();
        expect(
          screen.getByText("Error: Network error: Failed to fetch"),
        ).toBeInTheDocument();
      });

      expect(
        screen.queryByText("Children error handler"),
      ).not.toBeInTheDocument();
    });

    it("should pass the exact error object to Errors component", async () => {
      const specificError = new GraphQLError("Authentication failed", {
        extensions: { code: "UNAUTHENTICATED" },
      });

      const errorMock = {
        request: {
          query: USER_QUERY,
        },
        error: specificError,
      };

      render(
        <MockedProvider mocks={[errorMock]} addTypename={false}>
          <QueryHandler query={USER_QUERY}>
            {() => <p>Should not render</p>}
          </QueryHandler>
        </MockedProvider>,
      );

      await waitFor(() => {
        expect(screen.getByTestId("errors-component")).toBeInTheDocument();
        expect(
          screen.getByText("Error: Authentication failed"),
        ).toBeInTheDocument();
      });
    });

    it("should handle multiple GraphQL errors", async () => {
      const multipleErrorsMock = {
        request: {
          query: USER_QUERY,
        },
        result: {
          errors: [
            new GraphQLError("First error"),
            new GraphQLError("Second error"),
          ],
        },
      };

      render(
        <MockedProvider mocks={[multipleErrorsMock]} addTypename={false}>
          <QueryHandler query={USER_QUERY}>
            {() => <p>Should not render</p>}
          </QueryHandler>
        </MockedProvider>,
      );

      await waitFor(() => {
        expect(screen.getByTestId("errors-component")).toBeInTheDocument();
        // The error message will depend on how Apollo Client handles multiple errors
        expect(screen.getByTestId("errors-component")).toBeInTheDocument();
      });
    });

    it("should render Errors component even when useCustomLoader is true", async () => {
      const errorMock = {
        request: {
          query: USER_QUERY,
        },
        error: new GraphQLError("Custom loader error"),
      };

      render(
        <MockedProvider mocks={[errorMock]} addTypename={false}>
          <QueryHandler query={USER_QUERY} useCustomLoader={true}>
            {({ loading, error }) => {
              if (loading) return <p>Custom loading...</p>;
              if (error) return <p>Custom error handler</p>;
              return <p>Success</p>;
            }}
          </QueryHandler>
        </MockedProvider>,
      );

      await waitFor(() => {
        expect(screen.getByTestId("errors-component")).toBeInTheDocument();
        expect(
          screen.getByText("Error: Custom loader error"),
        ).toBeInTheDocument();
      });

      expect(
        screen.queryByText("Custom error handler"),
      ).not.toBeInTheDocument();
    });

    it("should render Errors component with variables when query with variables fails", async () => {
      const errorWithVariablesMock = {
        request: {
          query: USER_QUERY,
          variables: { id: "invalid-id" },
        },
        error: new GraphQLError("Invalid user ID"),
      };

      render(
        <MockedProvider mocks={[errorWithVariablesMock]} addTypename={false}>
          <QueryHandler query={USER_QUERY} variables={{ id: "invalid-id" }}>
            {() => <p>Should not render</p>}
          </QueryHandler>
        </MockedProvider>,
      );

      await waitFor(() => {
        expect(screen.getByTestId("errors-component")).toBeInTheDocument();
        expect(screen.getByText("Error: Invalid user ID")).toBeInTheDocument();
      });
    });

    it("should not render Loading component when there's an error", async () => {
      const errorMock = {
        request: {
          query: USER_QUERY,
        },
        error: new GraphQLError("Query failed"),
      };

      render(
        <MockedProvider mocks={[errorMock]} addTypename={false}>
          <QueryHandler query={USER_QUERY}>
            {() => <p>Should not render</p>}
          </QueryHandler>
        </MockedProvider>,
      );

      await waitFor(() => {
        expect(screen.getByTestId("errors-component")).toBeInTheDocument();
      });

      expect(screen.queryByTestId("loading-component")).not.toBeInTheDocument();
    });

    it("should handle error with fetchPolicy", async () => {
      const errorMock = {
        request: {
          query: USER_QUERY,
        },
        error: new GraphQLError("Cache-first error"),
      };

      render(
        <MockedProvider mocks={[errorMock]} addTypename={false}>
          <QueryHandler query={USER_QUERY} fetchPolicy="cache-first">
            {() => <p>Should not render</p>}
          </QueryHandler>
        </MockedProvider>,
      );

      await waitFor(() => {
        expect(screen.getByTestId("errors-component")).toBeInTheDocument();
        expect(
          screen.getByText("Error: Cache-first error"),
        ).toBeInTheDocument();
      });
    });

    it("should not call children function when error occurs", async () => {
      const childrenSpy = jest.fn(() => <p>Children called</p>);

      const errorMock = {
        request: {
          query: USER_QUERY,
        },
        error: new GraphQLError("Test error"),
      };

      render(
        <MockedProvider mocks={[errorMock]} addTypename={false}>
          <QueryHandler query={USER_QUERY}>{childrenSpy}</QueryHandler>
        </MockedProvider>,
      );

      await waitFor(() => {
        expect(screen.getByTestId("errors-component")).toBeInTheDocument();
      });

      // Children function should not be called when there's an error
      expect(childrenSpy).not.toHaveBeenCalled();
      expect(screen.queryByText("Children called")).not.toBeInTheDocument();
    });
  });
});
