import { MockedProvider } from "@apollo/client/testing";
import { render, screen } from "@testing-library/react";
import React from "react";

import ToggleChildren from "../../src/components/ToggleChildren";

// Mock the child components
jest.mock("../../src/components/ToggleSeasons", () => {
  return function MockedToggleSeasons(props) {
    return (
      <div data-testid="toggle-seasons">
        ToggleSeasons - mediaType: {props.mediaType}, listId: {props.listId},
        id: {props.id}, mediaId: {props.mediaId}, showChildren:{" "}
        {props.showChildren ? "true" : "false"}
      </div>
    );
  };
});

jest.mock("../../src/components/ToggleEpisodes", () => {
  return function MockedToggleEpisodes(props) {
    return (
      <div data-testid="toggle-episodes">
        ToggleEpisodes - mediaType: {props.mediaType}, listId: {props.listId},
        id: {props.id}, showChildren: {props.showChildren ? "true" : "false"},
        number: {props.number}, parentShow: {props.parentShow}
      </div>
    );
  };
});

const renderWithProviders = (component, mocks = []) => {
  return render(<MockedProvider mocks={mocks}>{component}</MockedProvider>);
};

describe("ToggleChildren Component", () => {
  beforeEach(() => {});

  describe("Rendering", () => {
    it("should render ToggleSeasons when mediaType is 'tv'", () => {
      renderWithProviders(
        <ToggleChildren
          listId="list-123"
          id="media-123"
          mediaType="tv"
          mediaId="media-456"
          showChildren={false}
          number={1}
          parentShow="show-789"
        />,
      );

      const toggleSeasons = screen.getByTestId("toggle-seasons");
      expect(toggleSeasons).toBeInTheDocument();
      expect(toggleSeasons).toHaveTextContent(
        "ToggleSeasons - mediaType: tv, listId: list-123, id: media-123, mediaId: media-456, showChildren: false",
      );

      const toggleEpisodes = screen.queryByTestId("toggle-episodes");
      expect(toggleEpisodes).not.toBeInTheDocument();
    });

    it("should render ToggleEpisodes when mediaType is 'season'", () => {
      renderWithProviders(
        <ToggleChildren
          listId="list-123"
          id="media-123"
          mediaType="season"
          mediaId="media-456"
          showChildren={true}
          number={2}
          parentShow="show-789"
        />,
      );

      const toggleEpisodes = screen.getByTestId("toggle-episodes");
      expect(toggleEpisodes).toBeInTheDocument();
      expect(toggleEpisodes).toHaveTextContent(
        "ToggleEpisodes - mediaType: season, listId: list-123, id: media-123, showChildren: true, number: 2, parentShow: show-789",
      );

      const toggleSeasons = screen.queryByTestId("toggle-seasons");
      expect(toggleSeasons).not.toBeInTheDocument();
    });

    it("should render nothing when mediaType is neither 'tv' nor 'season'", () => {
      const { container } = renderWithProviders(
        <ToggleChildren
          listId="list-123"
          id="media-123"
          mediaType="movie"
          mediaId="media-456"
          showChildren={false}
          number={1}
          parentShow="show-789"
        />,
      );

      const toggleSeasons = screen.queryByTestId("toggle-seasons");
      expect(toggleSeasons).not.toBeInTheDocument();

      const toggleEpisodes = screen.queryByTestId("toggle-episodes");
      expect(toggleEpisodes).not.toBeInTheDocument();

      // The container should be empty
      expect(container.firstChild).toBeNull();
    });

    it("should pass correct props to ToggleSeasons", () => {
      renderWithProviders(
        <ToggleChildren
          listId="test-list"
          id="test-id"
          mediaType="tv"
          mediaId="test-media-id"
          showChildren={true}
          number={5}
          parentShow="test-show"
        />,
      );

      const toggleSeasons = screen.getByTestId("toggle-seasons");
      expect(toggleSeasons).toHaveTextContent("mediaType: tv");
      expect(toggleSeasons).toHaveTextContent("listId: test-list");
      expect(toggleSeasons).toHaveTextContent("id: test-id");
      expect(toggleSeasons).toHaveTextContent("mediaId: test-media-id");
      expect(toggleSeasons).toHaveTextContent("showChildren: true");
    });

    it("should pass correct props to ToggleEpisodes", () => {
      renderWithProviders(
        <ToggleChildren
          listId="test-list"
          id="test-id"
          mediaType="season"
          mediaId="test-media-id"
          showChildren={false}
          number={3}
          parentShow="test-parent-show"
        />,
      );

      const toggleEpisodes = screen.getByTestId("toggle-episodes");
      expect(toggleEpisodes).toHaveTextContent("mediaType: season");
      expect(toggleEpisodes).toHaveTextContent("listId: test-list");
      expect(toggleEpisodes).toHaveTextContent("id: test-id");
      expect(toggleEpisodes).toHaveTextContent("showChildren: false");
      expect(toggleEpisodes).toHaveTextContent("number: 3");
      expect(toggleEpisodes).toHaveTextContent("parentShow: test-parent-show");
    });
  });
});
