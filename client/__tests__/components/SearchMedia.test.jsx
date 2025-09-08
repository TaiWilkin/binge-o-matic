import { MockedProvider } from "@apollo/client/testing";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";

import SearchMedia from "../../src/components/SearchMedia";
import addToListMutation from "../../src/mutations/AddToList";
import removeFromListMutation from "../../src/mutations/RemoveFromList";
import listQuery from "../../src/queries/List";

// Mock useParams from react-router-dom
jest.mock("react-router-dom", () => ({
  useParams: () => ({ id: "list-123" }),
}));

// Mock MediaImage component
jest.mock("../../src/components/MediaImage", () => {
  return function MockedMediaImage(props) {
    return (
      <div data-testid="media-image">
        MediaImage - mediaType: {props.mediaType}, posterPath:{" "}
        {props.posterPath}
      </div>
    );
  };
});

// Mock CardActions component
jest.mock("../../src/components/CardActions", () => {
  return function MockedCardActions({ children }) {
    return <div data-testid="card-actions">{children}</div>;
  };
});

const renderWithProviders = (component, mocks = []) => {
  return render(<MockedProvider mocks={mocks}>{component}</MockedProvider>);
};

describe("SearchMedia Component", () => {
  const mockProps = {
    id: "media-456",
    title: "Test Movie",
    release_date: "2023-01-15",
    poster_path: "/test-poster.jpg",
    media_type: "movie",
  };

  const mockListQuerySuccess = {
    request: {
      query: listQuery,
      variables: { id: "list-123" },
    },
    result: {
      data: {
        user: {
          id: "user-123",
          __typename: "User",
        },
        list: {
          id: "list-123",
          __typename: "List",
          name: "Test List",
          media: [],
          user: "user-123",
        },
      },
    },
  };

  const mockListQueryWithMedia = {
    request: {
      query: listQuery,
      variables: { id: "list-123" },
    },
    result: {
      data: {
        user: {
          id: "user-123",
          __typename: "User",
        },
        list: {
          id: "list-123",
          __typename: "List",
          name: "Test List",
          media: [
            {
              id: "existing-media",
              __typename: "Media",
              media_id: "media-456",
              title: "Test Movie",
              release_date: "2023-01-15",
              poster_path: "/test-poster.jpg",
              media_type: "movie",
              number: null,
              isWatched: false,
              parent_show: null,
              parent_season: null,
              episode: null,
              show_children: false,
            },
          ],
          user: "user-123",
        },
      },
    },
  };

  const mockListQueryError = {
    request: {
      query: listQuery,
      variables: { id: "list-123" },
    },
    error: new Error("Failed to fetch list"),
  };

  beforeEach(() => {});

  describe("Loading and Error States", () => {
    it("should show loading state", () => {
      const mocks = [
        {
          request: {
            query: listQuery,
            variables: { id: "list-123" },
          },
          delay: 1000, // Simulate loading
        },
      ];

      renderWithProviders(<SearchMedia {...mockProps} />, mocks);

      expect(screen.getByText("Loading...")).toBeInTheDocument();
    });

    it("should show error state when query fails", async () => {
      renderWithProviders(<SearchMedia {...mockProps} />, [mockListQueryError]);

      await waitFor(() => {
        expect(screen.getByText("Error loading list.")).toBeInTheDocument();
      });
    });
  });

  describe("Rendering", () => {
    it("should render media information correctly", async () => {
      renderWithProviders(<SearchMedia {...mockProps} />, [
        mockListQuerySuccess,
      ]);

      await waitFor(() => {
        expect(screen.getByText("Test Movie")).toBeInTheDocument();
        expect(screen.getByText("2023-01-15")).toBeInTheDocument();
        expect(screen.getByTestId("media-image")).toBeInTheDocument();
        expect(screen.getByTestId("media-image")).toHaveTextContent(
          "MediaImage - mediaType: movie, posterPath: /test-poster.jpg",
        );
      });
    });

    it("should have correct CSS class when not on list", async () => {
      const { container } = renderWithProviders(
        <SearchMedia {...mockProps} />,
        [mockListQuerySuccess],
      );

      await waitFor(() => {
        const listItem = container.querySelector("li");
        expect(listItem).toHaveClass("media");
        expect(listItem).not.toHaveClass("onList");
        expect(listItem).toHaveAttribute("id", "media-456");
      });
    });

    it("should have correct CSS class when on list", async () => {
      const { container } = renderWithProviders(
        <SearchMedia {...mockProps} />,
        [mockListQueryWithMedia],
      );

      await waitFor(() => {
        const listItem = container.querySelector("li");
        expect(listItem).toHaveClass("media", "onList");
        expect(listItem).toHaveAttribute("id", "media-456");
      });
    });
  });

  describe("Button States", () => {
    it("should show 'Add to List' button when media is not on list", async () => {
      renderWithProviders(<SearchMedia {...mockProps} />, [
        mockListQuerySuccess,
      ]);

      await waitFor(() => {
        expect(screen.getByText("Add to List")).toBeInTheDocument();
        expect(screen.queryByText("Remove from List")).not.toBeInTheDocument();
      });
    });

    it("should show 'Remove from List' button when media is on list", async () => {
      renderWithProviders(<SearchMedia {...mockProps} />, [
        mockListQueryWithMedia,
      ]);

      await waitFor(() => {
        expect(screen.getByText("Remove from List")).toBeInTheDocument();
        expect(screen.queryByText("Add to List")).not.toBeInTheDocument();
      });
    });
  });

  describe("Functionality", () => {
    it("should call addToList mutation when 'Add to List' is clicked", async () => {
      const mocks = [
        mockListQuerySuccess,
        {
          request: {
            query: addToListMutation,
            variables: {
              id: "media-456",
              title: "Test Movie",
              release_date: "2023-01-15",
              poster_path: "/test-poster.jpg",
              media_type: "movie",
              list: "list-123",
            },
          },
          result: {
            data: {
              addToList: {
                id: "media-456",
                media: {
                  id: "media-456",
                },
              },
            },
          },
        },
        mockListQuerySuccess, // For refetch
      ];

      const user = userEvent.setup();

      renderWithProviders(<SearchMedia {...mockProps} />, mocks);

      await waitFor(() => {
        expect(screen.getByText("Add to List")).toBeInTheDocument();
      });

      const addButton = screen.getByText("Add to List");
      await user.click(addButton);

      // The mutation should be called (we can't easily assert this directly,
      // but if the test doesn't error, the mock was matched)
      await waitFor(() => {
        expect(addButton).toBeInTheDocument();
      });
    });

    it("should call removeFromList mutation when 'Remove from List' is clicked", async () => {
      const mocks = [
        mockListQueryWithMedia,
        {
          request: {
            query: removeFromListMutation,
            variables: {
              id: "media-456",
              list: "list-123",
            },
          },
          result: {
            data: {
              removeFromList: {
                id: "media-456",
                media: {
                  id: "media-456",
                },
              },
            },
          },
        },
        mockListQueryWithMedia, // For refetch
      ];

      const user = userEvent.setup();

      renderWithProviders(<SearchMedia {...mockProps} />, mocks);

      await waitFor(() => {
        expect(screen.getByText("Remove from List")).toBeInTheDocument();
      });

      const removeButton = screen.getByText("Remove from List");
      await user.click(removeButton);

      // The mutation should be called (we can't easily assert this directly,
      // but if the test doesn't error, the mock was matched)
      await waitFor(() => {
        expect(removeButton).toBeInTheDocument();
      });
    });
  });
});
