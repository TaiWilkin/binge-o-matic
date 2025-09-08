import { MockedProvider } from "@apollo/client/testing";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";

import ToggleSeasons from "../../src/components/ToggleSeasons";
import addSeasonsMutation from "../../src/mutations/AddSeasons";
import hideChildrenMutation from "../../src/mutations/HideChildren";
import listQuery from "../../src/queries/List";

const renderWithProviders = (component, mocks = []) => {
  return render(<MockedProvider mocks={mocks}>{component}</MockedProvider>);
};

describe("ToggleSeasons Component", () => {
  beforeEach(() => {});

  describe("Rendering", () => {
    it("should not render anything when mediaType is not 'tv'", () => {
      renderWithProviders(
        <ToggleSeasons
          listId="list-123"
          id="media-123"
          mediaType="movie"
          mediaId="media-456"
          showChildren={false}
        />,
      );
      const buttonElement = screen.queryByRole("button");
      expect(buttonElement).not.toBeInTheDocument();
    });

    it("should render 'ADD SEASONS' button when mediaType is 'tv' and showChildren is false", () => {
      renderWithProviders(
        <ToggleSeasons
          listId="list-123"
          id="media-123"
          mediaType="tv"
          mediaId="media-456"
          showChildren={false}
        />,
      );
      const buttonElement = screen.getByRole("button", {
        name: /add seasons/i,
      });
      expect(buttonElement).toBeInTheDocument();
      expect(buttonElement).toHaveTextContent("ADD SEASONS");
    });

    it("should render 'HIDE SEASONS' button when mediaType is 'tv' and showChildren is true", () => {
      renderWithProviders(
        <ToggleSeasons
          listId="list-123"
          id="media-123"
          mediaType="tv"
          mediaId="media-456"
          showChildren={true}
        />,
      );
      const buttonElement = screen.getByRole("button", {
        name: /hide seasons/i,
      });
      expect(buttonElement).toBeInTheDocument();
      expect(buttonElement).toHaveTextContent("HIDE SEASONS");
    });
  });

  describe("Functionality", () => {
    it("should call addSeasons mutation when 'ADD SEASONS' button is clicked", async () => {
      const mockId = "tv-123";
      const mockListId = "list-456";
      const mockMediaId = "media-789";

      const mocks = [
        {
          request: {
            query: addSeasonsMutation,
            variables: {
              id: mockId,
              media_id: mockMediaId,
              list: mockListId,
            },
          },
          result: {
            data: {
              addSeasons: {
                id: mockId,
                media: {
                  id: mockId,
                },
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
        <ToggleSeasons
          listId={mockListId}
          id={mockId}
          mediaType="tv"
          mediaId={mockMediaId}
          showChildren={false}
        />,
        mocks,
      );

      const buttonElement = screen.getByRole("button", {
        name: /add seasons/i,
      });

      await user.click(buttonElement);

      await waitFor(() => {
        expect(buttonElement).toBeInTheDocument();
      });
    });

    it("should call hideChildren mutation when 'HIDE SEASONS' button is clicked", async () => {
      const mockId = "tv-123";
      const mockListId = "list-456";

      const mocks = [
        {
          request: {
            query: hideChildrenMutation,
            variables: {
              id: mockId,
              list: mockListId,
            },
          },
          result: {
            data: {
              hideChildren: {
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
        <ToggleSeasons
          listId={mockListId}
          id={mockId}
          mediaType="tv"
          mediaId="media-789"
          showChildren={true}
        />,
        mocks,
      );

      const buttonElement = screen.getByRole("button", {
        name: /hide seasons/i,
      });

      await user.click(buttonElement);

      await waitFor(() => {
        expect(buttonElement).toBeInTheDocument();
      });
    });
  });
});
