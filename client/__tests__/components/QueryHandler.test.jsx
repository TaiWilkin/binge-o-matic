import { MockedProvider } from "@apollo/client/testing";
import QueryHandler from "../../src/components/QueryHandler.jsx";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import USER_QUERY from "../../src/queries/CurrentUser";

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
  let component;

  it("should render its children", async () => {
    component = render(
      <MockedProvider mocks={[currentUserMock]} addTypename={false}>
        <QueryHandler query={USER_QUERY}>
          {({ loading, error, data }) => {
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
    component = render(
      <MockedProvider mocks={[currentUserMock]} addTypename={false}>
        <QueryHandler query={USER_QUERY}>
          {({ loading, error, data }) => {
            if (loading) return <p>Loading...</p>;
            if (error) return <p>Error!</p>;
            return <p>Loaded</p>;
          }}
        </QueryHandler>
      </MockedProvider>,
    );

    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("should pass query data to children function", async () => {
    component = render(
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
    component = render(
      <MockedProvider mocks={[currentUserMock]} addTypename={false}>
        <QueryHandler query={USER_QUERY} useCustomLoader={true}>
          {({ loading, error, data }) => {
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

    component = render(
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
});
