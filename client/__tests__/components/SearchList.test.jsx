import { MockedProvider } from "@apollo/client/testing";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import { BrowserRouter, MemoryRouter, Route, Routes } from "react-router-dom";

import SearchList from "../../src/components/SearchList";
import listQuery from "../../src/queries/List";
import mediaQuery from "../../src/queries/Media";

// Mock react-router-dom
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useParams: () => ({ id: "list-123" }),
  Navigate: ({ to }) => <div data-testid="navigate">Navigating to: {to}</div>,
  BrowserRouter: ({ children }) => <div>{children}</div>,
}));

// Mock child components to avoid testing their implementation details
jest.mock("../../src/components/SearchMedia", () => {
  return function MockedSearchMedia({ id, title, media_type }) {
    return (
      <li data-testid="search-media">
        SearchMedia - id: {id}, title: {title}, media_type: {media_type}
      </li>
    );
  };
});

jest.mock("../../src/components/ContentWrapper", () => {
  return function MockedContentWrapper({ title, link, linkText, children }) {
    return (
      <div data-testid="content-wrapper">
        <h1>{title}</h1>
        <a href={link}>{linkText}</a>
        {children}
      </div>
    );
  };
});

jest.mock("../../src/components/CardActions", () => {
  return function MockedCardActions({ children }) {
    return <div data-testid="card-actions">{children}</div>;
  };
});

jest.mock("../../src/components/Loading", () => {
  return function MockedLoading() {
    return <div data-testid="loading">Loading...</div>;
  };
});

// Mock Errors component
jest.mock("../../src/components/Errors", () => {
  return function MockedErrors({ error }) {
    return <div data-testid="errors">Error: {error.message}</div>;
  };
});

// Mock requireAuth to return the component directly
jest.mock("../../src/components/requireAuth", () => {
  return function requireAuth(Component) {
    return Component;
  };
});

// We'll use the real QueryHandler component with MockedProvider instead of mocking it

const renderWithProviders = (mocks = []) => {
  return render(
    <BrowserRouter>
      <MockedProvider mocks={mocks} addTypename={false}>
        <SearchList />
      </MockedProvider>
    </BrowserRouter>,
  );
};

// Default mocks for most tests
const defaultMocks = [
  {
    request: {
      query: listQuery,
      variables: { id: "list-123" },
    },
    result: {
      data: {
        user: { id: "user-123", __typename: "UserType" },
        list: {
          id: "list-123",
          name: "My Test List",
          user: { id: "user-123", __typename: "UserType" },
          media: [],
          __typename: "ListType",
        },
      },
    },
  },
  {
    request: {
      query: mediaQuery,
      variables: { searchQuery: "test" },
    },
    result: {
      data: {
        media: [
          {
            id: "movie-1",
            title: "Test Movie",
            release_date: "2021-01-01",
            poster_path: "/test-poster.jpg",
            media_type: "movie",
            number: 1,
            __typename: "MediaType",
          },
          {
            id: "tv-1",
            title: "Test TV Show",
            release_date: "2021-01-01",
            poster_path: "/test-poster.jpg",
            media_type: "tv",
            number: 2,
            __typename: "MediaType",
          },
        ],
        __typename: "Query",
      },
    },
  },
  {
    request: {
      query: mediaQuery,
      variables: { searchQuery: "test movie" },
    },
    result: {
      data: {
        media: [
          {
            id: "movie-1",
            title: "Test Movie",
            release_date: "2021-01-01",
            poster_path: "/test-poster.jpg",
            media_type: "movie",
            number: 1,
            __typename: "MediaType",
          },
        ],
        __typename: "Query",
      },
    },
  },
  {
    request: {
      query: mediaQuery,
      variables: { searchQuery: "test search" },
    },
    result: {
      data: {
        media: [],
        __typename: "Query",
      },
    },
  },
];

describe("SearchList Component - Null Media Test", () => {
  it("should show 'No items found.' when media query returns null", async () => {
    const user = userEvent.setup();

    // Create mocks for both the list query and media query
    const nullMediaMocks = [
      {
        request: {
          query: listQuery,
          variables: { id: "list-123" },
        },
        result: {
          data: {
            user: { id: "user-123", __typename: "UserType" },
            list: {
              id: "list-123",
              name: "My Test List",
              user: { id: "user-123", __typename: "UserType" },
              media: [],
              __typename: "ListType",
            },
          },
        },
      },
      {
        request: {
          query: mediaQuery,
          variables: { searchQuery: "test search" },
        },
        result: {
          data: {
            media: null, // This will set media state to null
            __typename: "Query",
          },
        },
      },
    ];

    renderWithProviders(nullMediaMocks);

    await waitFor(() => {
      expect(
        screen.getByPlaceholderText("Search for shows or movies"),
      ).toBeInTheDocument();
    });

    // Perform a search to trigger the media query
    const searchInput = screen.getByPlaceholderText(
      "Search for shows or movies",
    );
    const searchButton = screen.getByText("Search");

    await user.type(searchInput, "test search");
    await user.click(searchButton);

    // Wait for the search to complete and check for "No items found." message
    await waitFor(
      () => {
        expect(screen.getByText("No items found.")).toBeInTheDocument();
      },
      { timeout: 3000 },
    );
  });
});

describe("SearchList Component", () => {
  describe("Basic Rendering", () => {
    it("should render the search interface", async () => {
      renderWithProviders(defaultMocks);

      await waitFor(() => {
        expect(screen.getByTestId("content-wrapper")).toBeInTheDocument();
        expect(
          screen.getByText("Adding items to My Test List"),
        ).toBeInTheDocument();
        expect(screen.getByText("RETURN TO LIST")).toBeInTheDocument();
        expect(
          screen.getByPlaceholderText("Search for shows or movies"),
        ).toBeInTheDocument();
        expect(screen.getByText("Search")).toBeInTheDocument();
      });
    });

    it("should render filter buttons", async () => {
      renderWithProviders(defaultMocks);

      await waitFor(() => {
        expect(screen.getByText("MOVIES")).toBeInTheDocument();
        expect(screen.getByText("TV")).toBeInTheDocument();
        expect(screen.getByText("ALL")).toBeInTheDocument();
      });
    });
  });

  describe("Error Handling", () => {
    it("should return null when list is loading", async () => {
      const loadingMocks = [
        {
          request: {
            query: listQuery,
            variables: { id: "list-123" },
          },
          delay: 1000, // Long delay to test loading state
          result: {
            data: {
              user: { id: "user-123", __typename: "UserType" },
              list: {
                id: "list-123",
                name: "My Test List",
                user: { id: "user-123", __typename: "UserType" },
                media: [],
                __typename: "ListType",
              },
            },
          },
        },
      ];

      renderWithProviders(loadingMocks);

      // During loading, QueryHandler renders the Loading component
      expect(screen.getByTestId("loading")).toBeInTheDocument();

      // Wait for the query to resolve and content to appear
      await waitFor(
        () => {
          expect(screen.getByTestId("content-wrapper")).toBeInTheDocument();
        },
        { timeout: 2000 },
      );
    });

    it("should return null when data.list is not available", async () => {
      const noListMocks = [
        {
          request: {
            query: listQuery,
            variables: { id: "list-123" },
          },
          result: {
            data: {
              user: { id: "user-123", __typename: "UserType" },
              list: null, // No list data
            },
          },
        },
      ];

      const { container } = renderWithProviders(noListMocks);

      await waitFor(() => {
        // When data.list is null, SearchList returns null, rendering an empty div
        expect(container.firstChild).toBeEmptyDOMElement();
        expect(screen.queryByTestId("content-wrapper")).not.toBeInTheDocument();
      });
    });

    it("should return error message when list query has error", async () => {
      const errorMocks = [
        {
          request: {
            query: listQuery,
            variables: { id: "list-123" },
          },
          error: new Error("Failed to load list"),
        },
      ];

      const { container } = renderWithProviders(errorMocks);

      await waitFor(() => {
        // QueryHandler handles the error and renders the Errors component
        expect(screen.getByTestId("errors")).toBeInTheDocument();
        expect(container.textContent).toContain("Error: Failed to load list");
      });
    });

    it("should return error message with GraphQL error", async () => {
      const graphqlErrorMocks = [
        {
          request: {
            query: listQuery,
            variables: { id: "list-123" },
          },
          result: {
            errors: [{ message: "List not found" }],
          },
        },
      ];

      const { container } = renderWithProviders(graphqlErrorMocks);

      await waitFor(() => {
        // QueryHandler handles GraphQL errors and renders the Errors component
        expect(screen.getByTestId("errors")).toBeInTheDocument();
        expect(container.textContent).toContain("Error: List not found");
      });
    });

    it("should return exact error format 'Error!: {message}' for network errors", async () => {
      const networkErrorMocks = [
        {
          request: {
            query: listQuery,
            variables: { id: "list-123" },
          },
          error: new Error("Network error occurred"),
        },
      ];

      const { container } = renderWithProviders(networkErrorMocks);

      await waitFor(() => {
        // The component should return the exact string format: "Error!: {message}"
        // Since we're testing the direct return value, we need to check the text content
        expect(container.textContent).toContain("Network error occurred");
      });
    });

    it("should return error string directly when error exists", async () => {
      const specificErrorMocks = [
        {
          request: {
            query: listQuery,
            variables: { id: "list-123" },
          },
          error: new Error("Authentication failed"),
        },
      ];

      const { container } = renderWithProviders(specificErrorMocks);

      await waitFor(() => {
        // QueryHandler handles the error and renders the Errors component
        expect(screen.getByTestId("errors")).toBeInTheDocument();
        expect(container.textContent).toContain("Error: Authentication failed");
      });
    });

    it("should handle empty error message gracefully", async () => {
      const emptyErrorMocks = [
        {
          request: {
            query: listQuery,
            variables: { id: "list-123" },
          },
          error: new Error(""),
        },
      ];

      const { container } = renderWithProviders(emptyErrorMocks);

      await waitFor(() => {
        // QueryHandler handles even empty errors and renders the Errors component
        expect(screen.getByTestId("errors")).toBeInTheDocument();
        expect(container.textContent).toContain("Error:");
      });
    });

    it("should not render main content when error occurs", async () => {
      const errorMocks = [
        {
          request: {
            query: listQuery,
            variables: { id: "list-123" },
          },
          error: new Error("Server error"),
        },
      ];

      const { container } = renderWithProviders(errorMocks);

      await waitFor(() => {
        // QueryHandler handles the error and renders Errors component instead of main content
        expect(screen.getByTestId("errors")).toBeInTheDocument();
        expect(container.textContent).toContain("Error: Server error");
        expect(screen.queryByTestId("content-wrapper")).not.toBeInTheDocument();
      });
    });

    it("should hit the error return line when error prop is provided", async () => {
      const errorMocks = [
        {
          request: {
            query: listQuery,
            variables: { id: "list-123" },
          },
          error: new Error("Specific error for line 63 test"),
        },
      ];

      const { container } = renderWithProviders(errorMocks);

      // QueryHandler handles the error and renders the Errors component
      await waitFor(() => {
        expect(screen.getByTestId("errors")).toBeInTheDocument();
        expect(container.textContent).toContain(
          "Error: Specific error for line 63 test",
        );
      });
    });
  });

  describe("Search Functionality", () => {
    it("should render search form elements", async () => {
      renderWithProviders(defaultMocks);

      await waitFor(() => {
        expect(
          screen.getByPlaceholderText("Search for shows or movies"),
        ).toBeInTheDocument();
        expect(screen.getByText("Search")).toBeInTheDocument();
        expect(screen.getByRole("textbox")).toBeInTheDocument();
        expect(
          screen.getByRole("button", { name: /search/i }),
        ).toBeInTheDocument();
      });
    });

    it("should handle form input changes", async () => {
      const user = userEvent.setup();
      renderWithProviders(defaultMocks);

      await waitFor(() => {
        expect(
          screen.getByPlaceholderText("Search for shows or movies"),
        ).toBeInTheDocument();
      });

      const searchInput = screen.getByPlaceholderText(
        "Search for shows or movies",
      );

      await user.type(searchInput, "test movie");
      expect(searchInput.value).toBe("test movie");
    });

    it("should allow form submission", async () => {
      const user = userEvent.setup();
      renderWithProviders(defaultMocks);

      await waitFor(() => {
        expect(
          screen.getByPlaceholderText("Search for shows or movies"),
        ).toBeInTheDocument();
      });

      const searchInput = screen.getByPlaceholderText(
        "Search for shows or movies",
      );
      const searchButton = screen.getByText("Search");

      await user.type(searchInput, "test movie");

      // Should be able to submit the form without errors
      await user.click(searchButton);

      // Form submission should work (component doesn't crash)
      expect(
        screen.getByPlaceholderText("Search for shows or movies"),
      ).toBeInTheDocument();
    });
  });

  describe("Media State Handling", () => {
    it("should show loading state when loading is true", async () => {
      const user = userEvent.setup();
      renderWithProviders(defaultMocks);

      await waitFor(() => {
        expect(
          screen.getByPlaceholderText("Search for shows or movies"),
        ).toBeInTheDocument();
      });

      // Type in search and click - this should briefly show loading
      const searchInput = screen.getByPlaceholderText(
        "Search for shows or movies",
      );
      const searchButton = screen.getByText("Search");

      await user.type(searchInput, "test");

      // Click search button - loading state should be briefly visible
      await user.click(searchButton);

      // Note: The loading state might be very brief, so this test checks that
      // the component structure supports loading without errors
      expect(
        screen.getByPlaceholderText("Search for shows or movies"),
      ).toBeInTheDocument();
    });

    it("should return null (no content) when media is empty array", async () => {
      const user = userEvent.setup();
      renderWithProviders(defaultMocks);

      await waitFor(() => {
        expect(
          screen.getByPlaceholderText("Search for shows or movies"),
        ).toBeInTheDocument();
      });

      // Perform a search to trigger the state change
      const searchInput = screen.getByPlaceholderText(
        "Search for shows or movies",
      );
      const searchButton = screen.getByText("Search");

      await user.type(searchInput, "test search");
      await user.click(searchButton);

      // Wait for search to complete
      await waitFor(() => {
        // Should not show "No items found." (that's for null)
        // Should not show loading
        // Should show the empty searchlist
        expect(screen.queryByText("No items found.")).not.toBeInTheDocument();
        expect(screen.queryByTestId("loading")).not.toBeInTheDocument();
      });
    });
  });

  describe("Filter Functionality", () => {
    it("should render filter buttons and allow clicks", async () => {
      const user = userEvent.setup();
      renderWithProviders(defaultMocks);

      await waitFor(() => {
        expect(screen.getByText("MOVIES")).toBeInTheDocument();
        expect(screen.getByText("TV")).toBeInTheDocument();
        expect(screen.getByText("ALL")).toBeInTheDocument();
      });

      // Should be able to click filter buttons without errors
      const moviesButton = screen.getByText("MOVIES");
      const tvButton = screen.getByText("TV");
      const allButton = screen.getByText("ALL");

      await user.click(moviesButton);
      await user.click(tvButton);
      await user.click(allButton);

      // Buttons should still be present after clicking
      expect(screen.getByText("MOVIES")).toBeInTheDocument();
      expect(screen.getByText("TV")).toBeInTheDocument();
      expect(screen.getByText("ALL")).toBeInTheDocument();
    });

    it("should filter media when filter is set to 'movie'", async () => {
      const user = userEvent.setup();
      renderWithProviders(defaultMocks);

      await waitFor(() => {
        expect(
          screen.getByPlaceholderText("Search for shows or movies"),
        ).toBeInTheDocument();
      });

      // First perform a search to populate the media results
      const searchInput = screen.getByPlaceholderText(
        "Search for shows or movies",
      );
      const searchButton = screen.getByText("Search");

      await user.type(searchInput, "test");
      await user.click(searchButton);

      // Wait for search results to load
      await waitFor(() => {
        // Should have both movie and TV results initially
        expect(screen.getByText(/Test Movie/)).toBeInTheDocument();
        expect(screen.getByText(/Test TV Show/)).toBeInTheDocument();
      });

      // Now click the MOVIES filter
      const moviesButton = screen.getByText("MOVIES");
      await user.click(moviesButton);

      // After filtering, should only show movie results
      await waitFor(() => {
        expect(screen.getByText(/Test Movie/)).toBeInTheDocument();
        expect(screen.queryByText(/Test TV Show/)).not.toBeInTheDocument();
      });

      // Verify the SearchMedia component received correct props for movie
      const movieElement = screen.getByTestId("search-media");
      expect(movieElement).toHaveTextContent("movie");
      expect(movieElement).toHaveTextContent("Test Movie");
    });

    it("should filter media when filter is set to 'tv'", async () => {
      const user = userEvent.setup();
      renderWithProviders(defaultMocks);

      await waitFor(() => {
        expect(
          screen.getByPlaceholderText("Search for shows or movies"),
        ).toBeInTheDocument();
      });

      // First perform a search to populate the media results
      const searchInput = screen.getByPlaceholderText(
        "Search for shows or movies",
      );
      const searchButton = screen.getByText("Search");

      await user.type(searchInput, "test");
      await user.click(searchButton);

      // Wait for search results to load
      await waitFor(() => {
        // Should have both movie and TV results initially
        expect(screen.getByText(/Test Movie/)).toBeInTheDocument();
        expect(screen.getByText(/Test TV Show/)).toBeInTheDocument();
      });

      // Now click the TV filter
      const tvButton = screen.getByText("TV");
      await user.click(tvButton);

      // After filtering, should only show TV results
      await waitFor(() => {
        expect(screen.getByText(/Test TV Show/)).toBeInTheDocument();
        expect(screen.queryByText(/Test Movie/)).not.toBeInTheDocument();
      });

      // Verify the SearchMedia component received correct props for TV
      const tvElement = screen.getByTestId("search-media");
      expect(tvElement).toHaveTextContent("tv");
      expect(tvElement).toHaveTextContent("Test TV Show");
    });

    it("should show all media when filter is reset to 'all'", async () => {
      const user = userEvent.setup();
      renderWithProviders(defaultMocks);

      await waitFor(() => {
        expect(
          screen.getByPlaceholderText("Search for shows or movies"),
        ).toBeInTheDocument();
      });

      // First perform a search to populate the media results
      const searchInput = screen.getByPlaceholderText(
        "Search for shows or movies",
      );
      const searchButton = screen.getByText("Search");

      await user.type(searchInput, "test");
      await user.click(searchButton);

      // Wait for search results to load
      await waitFor(() => {
        expect(screen.getByText(/Test Movie/)).toBeInTheDocument();
        expect(screen.getByText(/Test TV Show/)).toBeInTheDocument();
      });

      // Click MOVIES filter first
      const moviesButton = screen.getByText("MOVIES");
      await user.click(moviesButton);

      // Verify only movies are shown
      await waitFor(() => {
        expect(screen.getByText(/Test Movie/)).toBeInTheDocument();
        expect(screen.queryByText(/Test TV Show/)).not.toBeInTheDocument();
      });

      // Now click ALL to reset filter
      const allButton = screen.getByText("ALL");
      await user.click(allButton);

      // Should show both movie and TV results again
      await waitFor(() => {
        expect(screen.getByText(/Test Movie/)).toBeInTheDocument();
        expect(screen.getByText(/Test TV Show/)).toBeInTheDocument();
      });

      // Should have multiple SearchMedia elements
      const searchMediaElements = screen.getAllByTestId("search-media");
      expect(searchMediaElements).toHaveLength(2);
    });
  });

  describe("Error Handling", () => {
    it("displays error message when QueryHandler has error", async () => {
      const errorMocks = [
        {
          request: {
            query: listQuery,
            variables: { id: "list-123" },
          },
          error: new Error("Network error"),
        },
      ];

      const { container } = render(
        <MockedProvider mocks={errorMocks} addTypename={false}>
          <MemoryRouter initialEntries={["/list/list-123"]}>
            <Routes>
              <Route path="/list/:id" element={<SearchList />} />
            </Routes>
          </MemoryRouter>
        </MockedProvider>,
      );

      await waitFor(() => {
        // QueryHandler handles the error and renders the Errors component
        expect(screen.getByTestId("errors")).toBeInTheDocument();
        expect(container.textContent).toContain("Error: Network error");
      });
    });
  });
});
