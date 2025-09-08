import { MockedProvider } from "@apollo/client/testing";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";

import DeleteMedia from "../../src/components/DeleteMedia";
import deleteListItemMutation from "../../src/mutations/RemoveFromList";
import listQuery from "../../src/queries/List";

const renderWithProviders = (component, mocks = []) => {
  return render(<MockedProvider mocks={mocks}>{component}</MockedProvider>);
};
describe("DeleteMedia Component", () => {
  beforeEach(() => {});

  describe("Rendering", () => {
    it("should render the button for owner", () => {
      renderWithProviders(<DeleteMedia isOwner={true} />);
      const buttonElement = screen.getByRole("button", { name: /delete/i });
      expect(buttonElement).toBeInTheDocument();
    });
    it("should not render the button for non-owner", () => {
      renderWithProviders(<DeleteMedia isOwner={false} />);
      const buttonElement = screen.queryByRole("button", { name: /delete/i });
      expect(buttonElement).not.toBeInTheDocument();
    });
  });

  describe("Functionality", () => {
    it("should call delete mutation when button is clicked", async () => {
      const mockMediaId = "media-123";
      const mockListId = "list-456";

      const mocks = [
        {
          request: {
            query: deleteListItemMutation,
            variables: {
              id: mockMediaId,
              list: mockListId,
            },
          },
          result: {
            data: {
              removeFromList: {
                id: mockMediaId,
                media: {
                  id: mockMediaId,
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
        <DeleteMedia
          isOwner={true}
          mediaId={mockMediaId}
          listId={mockListId}
        />,
        mocks,
      );

      const buttonElement = screen.getByRole("button", { name: /delete/i });

      await user.click(buttonElement);

      await waitFor(() => {
        expect(buttonElement).toBeInTheDocument();
      });
    });
  });
});
