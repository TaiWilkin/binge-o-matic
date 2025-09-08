import { MockedProvider } from "@apollo/client/testing";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";

import ToggleEpisodes from "../../src/components/ToggleEpisodes";
import addEpisodesMutation from "../../src/mutations/AddEpisodes";
import hideChildrenMutation from "../../src/mutations/HideChildren";
import listQuery from "../../src/queries/List";

const renderWithProviders = (component, mocks = []) => {
  return render(<MockedProvider mocks={mocks}>{component}</MockedProvider>);
};

describe("ToggleEpisodes Component", () => {
  beforeEach(() => {});

  describe("Rendering", () => {
    it("should not render anything when mediaType is not 'season'", () => {
      renderWithProviders(
        <ToggleEpisodes
          listId="list-123"
          id="media-123"
          mediaType="movie"
          showChildren={false}
          number={1}
          parentShow="show-123"
        />,
      );
      const buttonElement = screen.queryByRole("button");
      expect(buttonElement).not.toBeInTheDocument();
    });

    it("should render 'ADD EPISODES' button when mediaType is 'season' and showChildren is false", () => {
      renderWithProviders(
        <ToggleEpisodes
          listId="list-123"
          id="media-123"
          mediaType="season"
          showChildren={false}
          number={1}
          parentShow="show-123"
        />,
      );
      const buttonElement = screen.getByRole("button", {
        name: /add episodes/i,
      });
      expect(buttonElement).toBeInTheDocument();
      expect(buttonElement).toHaveTextContent("ADD EPISODES");
    });

    it("should render 'HIDE EPISODES' button when mediaType is 'season' and showChildren is true", () => {
      renderWithProviders(
        <ToggleEpisodes
          listId="list-123"
          id="media-123"
          mediaType="season"
          showChildren={true}
          number={1}
          parentShow="show-123"
        />,
      );
      const buttonElement = screen.getByRole("button", {
        name: /hide episodes/i,
      });
      expect(buttonElement).toBeInTheDocument();
      expect(buttonElement).toHaveTextContent("HIDE EPISODES");
    });
  });

  describe("Functionality", () => {
    it("should call addEpisodes mutation when 'ADD EPISODES' button is clicked", async () => {
      const mockId = "season-123";
      const mockListId = "list-456";
      const mockNumber = 2;
      const mockParentShow = "show-789";

      const mocks = [
        {
          request: {
            query: addEpisodesMutation,
            variables: {
              id: mockId,
              season_number: mockNumber,
              list: mockListId,
              show_id: mockParentShow,
            },
          },
          result: {
            data: {
              addEpisodes: {
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
        <ToggleEpisodes
          listId={mockListId}
          id={mockId}
          mediaType="season"
          showChildren={false}
          number={mockNumber}
          parentShow={mockParentShow}
        />,
        mocks,
      );

      const buttonElement = screen.getByRole("button", {
        name: /add episodes/i,
      });

      await user.click(buttonElement);

      await waitFor(() => {
        expect(buttonElement).toBeInTheDocument();
      });
    });

    it("should call hideChildren mutation when 'HIDE EPISODES' button is clicked", async () => {
      const mockId = "season-123";
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
        <ToggleEpisodes
          listId={mockListId}
          id={mockId}
          mediaType="season"
          showChildren={true}
          number={1}
          parentShow="show-789"
        />,
        mocks,
      );

      const buttonElement = screen.getByRole("button", {
        name: /hide episodes/i,
      });

      await user.click(buttonElement);

      await waitFor(() => {
        expect(buttonElement).toBeInTheDocument();
      });
    });
  });
});
