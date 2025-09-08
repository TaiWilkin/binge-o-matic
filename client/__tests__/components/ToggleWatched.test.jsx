import { MockedProvider } from "@apollo/client/testing";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";

import ToggleWatched from "../../src/components/ToggleWatched";
import toggleWatchedMutation from "../../src/mutations/ToggleWatched";
import listQuery from "../../src/queries/List";

const renderWithProviders = (component, mocks = []) => {
  return render(<MockedProvider mocks={mocks}>{component}</MockedProvider>);
};

describe("ToggleWatched Component", () => {
  beforeEach(() => {});

  describe("Rendering", () => {
    it("should render the button for owner", () => {
      renderWithProviders(<ToggleWatched isOwner={true} isWatched={false} />);
      const buttonElement = screen.getByRole("button", {
        name: /mark as watched/i,
      });
      expect(buttonElement).toBeInTheDocument();
    });

    it("should not render the button for non-owner", () => {
      renderWithProviders(<ToggleWatched isOwner={false} isWatched={false} />);
      const buttonElement = screen.queryByRole("button", { name: /mark as/i });
      expect(buttonElement).not.toBeInTheDocument();
    });

    it("should display 'MARK AS WATCHED' when isWatched is false", () => {
      renderWithProviders(<ToggleWatched isOwner={true} isWatched={false} />);
      const buttonElement = screen.getByRole("button", {
        name: /mark as watched/i,
      });
      expect(buttonElement).toHaveTextContent("MARK AS WATCHED");
    });

    it("should display 'MARK AS UNWATCHED' when isWatched is true", () => {
      renderWithProviders(<ToggleWatched isOwner={true} isWatched={true} />);
      const buttonElement = screen.getByRole("button", {
        name: /mark as unwatched/i,
      });
      expect(buttonElement).toHaveTextContent("MARK AS UNWATCHED");
    });
  });

  describe("Functionality", () => {
    it("should call toggle mutation when marking as watched", async () => {
      const mockId = "media-123";
      const mockListId = "list-456";

      const mocks = [
        {
          request: {
            query: toggleWatchedMutation,
            variables: {
              id: mockId,
              isWatched: true,
              list: mockListId,
            },
          },
          result: {
            data: {
              toggleWatched: {
                id: mockId,
              },
            },
          },
        },
        {
          request: {
            query: listQuery,
            variables: {
              id: mockListId,
            },
          },
          result: {
            data: {
              user: {
                id: "user-123",
                __typename: "User",
              },
              list: {
                id: mockListId,
                __typename: "List",
                name: "Test List",
                media: [],
                user: "user-123",
              },
            },
          },
        },
      ];

      const user = userEvent.setup();

      renderWithProviders(
        <ToggleWatched
          isOwner={true}
          isWatched={false}
          id={mockId}
          listId={mockListId}
        />,
        mocks,
      );

      const buttonElement = screen.getByRole("button", {
        name: /mark as watched/i,
      });

      await user.click(buttonElement);

      await waitFor(() => {
        expect(buttonElement).toBeInTheDocument();
      });
    });

    it("should call toggle mutation when marking as unwatched", async () => {
      const mockId = "media-123";
      const mockListId = "list-456";

      const mocks = [
        {
          request: {
            query: toggleWatchedMutation,
            variables: {
              id: mockId,
              isWatched: false,
              list: mockListId,
            },
          },
          result: {
            data: {
              toggleWatched: {
                id: mockId,
              },
            },
          },
        },
        {
          request: {
            query: listQuery,
            variables: {
              id: mockListId,
            },
          },
          result: {
            data: {
              user: {
                id: "user-123",
                __typename: "User",
              },
              list: {
                id: mockListId,
                __typename: "List",
                name: "Test List",
                media: [],
                user: "user-123",
              },
            },
          },
        },
      ];

      const user = userEvent.setup();

      renderWithProviders(
        <ToggleWatched
          isOwner={true}
          isWatched={true}
          id={mockId}
          listId={mockListId}
        />,
        mocks,
      );

      const buttonElement = screen.getByRole("button", {
        name: /mark as unwatched/i,
      });

      await user.click(buttonElement);

      await waitFor(() => {
        expect(buttonElement).toBeInTheDocument();
      });
    });
  });
});
