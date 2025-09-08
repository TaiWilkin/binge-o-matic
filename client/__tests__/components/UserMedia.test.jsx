import { render, screen } from "@testing-library/react";
import React from "react";

import UserMedia from "../../src/components/UserMedia";

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

// Mock DeleteMedia component
jest.mock("../../src/components/DeleteMedia", () => {
  return function MockedDeleteMedia(props) {
    return (
      <div data-testid="delete-media">
        DeleteMedia - isOwner: {props.isOwner ? "true" : "false"}, mediaId:{" "}
        {props.mediaId}, listId: {props.listId}
      </div>
    );
  };
});

// Mock ToggleChildren component
jest.mock("../../src/components/ToggleChildren", () => {
  return function MockedToggleChildren(props) {
    return (
      <div data-testid="toggle-children">
        ToggleChildren - mediaType: {props.mediaType}, showChildren:{" "}
        {props.showChildren ? "true" : "false"}, listId: {props.listId}, id:{" "}
        {props.id}, mediaId: {props.mediaId}, number: {props.number},
        parentShow: {props.parentShow}
      </div>
    );
  };
});

// Mock ToggleWatched component
jest.mock("../../src/components/ToggleWatched", () => {
  return function MockedToggleWatched(props) {
    return (
      <div data-testid="toggle-watched">
        ToggleWatched - isOwner: {props.isOwner ? "true" : "false"}, isWatched:{" "}
        {props.isWatched ? "true" : "false"}, id: {props.id}, listId:{" "}
        {props.listId}
      </div>
    );
  };
});

describe("UserMedia Component", () => {
  const baseProps = {
    isOwner: true,
    isWatched: false,
    id: "media-456",
    media_type: "movie",
    media_id: "tmdb-123",
    show_children: false,
    number: null,
    parent_show: null,
    parent_season: null,
    title: "Test Movie",
    poster_path: "/test-poster.jpg",
    episode: null,
    release_date: "2023-01-15",
    hideChildrenOf: [],
  };

  beforeEach(() => {});

  describe("Conditional Rendering", () => {
    it("should render nothing when parent_show is in hideChildrenOf", () => {
      const { container } = render(
        <UserMedia
          {...baseProps}
          parent_show="show-123"
          hideChildrenOf={["show-123"]}
        />,
      );

      expect(container.firstChild).toBeNull();
    });

    it("should render nothing when parent_season is in hideChildrenOf", () => {
      const { container } = render(
        <UserMedia
          {...baseProps}
          parent_season="season-456"
          hideChildrenOf={["season-456"]}
        />,
      );

      expect(container.firstChild).toBeNull();
    });

    it("should render nothing when season has null number", () => {
      const { container } = render(
        <UserMedia {...baseProps} media_type="season" number={null} />,
      );

      expect(container.firstChild).toBeNull();
    });

    it("should render nothing when season has zero number", () => {
      const { container } = render(
        <UserMedia {...baseProps} media_type="season" number={0} />,
      );

      expect(container.firstChild).toBeNull();
    });

    it("should render when hideChildrenOf does not include parent", () => {
      render(
        <UserMedia
          {...baseProps}
          parent_show="show-123"
          hideChildrenOf={["other-show"]}
        />,
      );

      expect(screen.getByText("Test Movie")).toBeInTheDocument();
    });
  });

  describe("Rendering", () => {
    it("should render basic movie information", () => {
      render(<UserMedia {...baseProps} />);

      expect(screen.getByText("Test Movie")).toBeInTheDocument();
      expect(screen.getByText("2023-01-15")).toBeInTheDocument();
      expect(screen.getByTestId("media-image")).toHaveTextContent(
        "MediaImage - mediaType: movie, posterPath: /test-poster.jpg",
      );
    });

    it("should render season details correctly", () => {
      render(
        <UserMedia
          {...baseProps}
          media_type="season"
          number={2}
          title="My Favorite Season"
        />,
      );

      expect(screen.getByText("My Favorite Season")).toBeInTheDocument();
      expect(screen.getByText("Season 2")).toBeInTheDocument();
    });

    it("should render episode details correctly", () => {
      render(
        <UserMedia
          {...baseProps}
          media_type="episode"
          number={5}
          episode="The Big Episode"
          title="Episode Title"
        />,
      );

      expect(screen.getByText("Episode Title")).toBeInTheDocument();
      expect(
        screen.getByText("Episode 5: The Big Episode"),
      ).toBeInTheDocument();
    });

    it("should not render details for movies", () => {
      render(<UserMedia {...baseProps} media_type="movie" />);

      expect(screen.queryByText(/Season/)).not.toBeInTheDocument();
      expect(screen.queryByText(/Episode/)).not.toBeInTheDocument();
    });
  });

  describe("CSS Classes", () => {
    it("should have correct CSS classes when not watched", () => {
      const { container } = render(
        <UserMedia {...baseProps} isWatched={false} media_type="movie" />,
      );

      const listItem = container.querySelector("li");
      expect(listItem).toHaveClass("media", "movie");
      expect(listItem).not.toHaveClass("watched");
      expect(listItem).toHaveAttribute("id", "media-456");
    });

    it("should have correct CSS classes when watched", () => {
      const { container } = render(
        <UserMedia {...baseProps} isWatched={true} media_type="tv" />,
      );

      const listItem = container.querySelector("li");
      expect(listItem).toHaveClass("media", "tv", "watched");
    });

    it("should include media type in CSS class", () => {
      const { container } = render(
        <UserMedia {...baseProps} media_type="episode" />,
      );

      const listItem = container.querySelector("li");
      expect(listItem).toHaveClass("media", "episode");
    });

    it("should have circle element", () => {
      const { container } = render(<UserMedia {...baseProps} />);

      const circle = container.querySelector(".circle");
      expect(circle).toBeInTheDocument();
    });
  });

  describe("Child Components", () => {
    it("should render DeleteMedia with correct props", () => {
      render(<UserMedia {...baseProps} />);

      const deleteMedia = screen.getByTestId("delete-media");
      expect(deleteMedia).toHaveTextContent(
        "DeleteMedia - isOwner: true, mediaId: tmdb-123, listId: list-123",
      );
    });

    it("should render ToggleChildren with correct props", () => {
      render(
        <UserMedia
          {...baseProps}
          media_type="tv"
          show_children={true}
          number={1}
          parent_show="parent-show-123"
        />,
      );

      const toggleChildren = screen.getByTestId("toggle-children");
      expect(toggleChildren).toHaveTextContent(
        "ToggleChildren - mediaType: tv, showChildren: true, listId: list-123, id: media-456, mediaId: tmdb-123, number: 1, parentShow: parent-show-123",
      );
    });

    it("should render ToggleWatched with correct props", () => {
      render(<UserMedia {...baseProps} isOwner={false} isWatched={true} />);

      const toggleWatched = screen.getByTestId("toggle-watched");
      expect(toggleWatched).toHaveTextContent(
        "ToggleWatched - isOwner: false, isWatched: true, id: media-456, listId: list-123",
      );
    });

    it("should render all child components within CardActions", () => {
      render(<UserMedia {...baseProps} />);

      expect(screen.getByTestId("card-actions")).toBeInTheDocument();
      expect(screen.getByTestId("delete-media")).toBeInTheDocument();
      expect(screen.getByTestId("toggle-children")).toBeInTheDocument();
      expect(screen.getByTestId("toggle-watched")).toBeInTheDocument();
    });
  });

  describe("Edge Cases", () => {
    it("should handle empty episode name", () => {
      render(
        <UserMedia
          {...baseProps}
          media_type="episode"
          number={3}
          episode=""
          title="Episode Title"
        />,
      );

      expect(screen.getByText(/Episode 3:/)).toBeInTheDocument();
    });

    it("should handle season with valid number", () => {
      render(<UserMedia {...baseProps} media_type="season" number={1} />);

      expect(screen.getByText("Season 1")).toBeInTheDocument();
    });

    it("should handle multiple items in hideChildrenOf", () => {
      render(
        <UserMedia
          {...baseProps}
          parent_show="show-123"
          hideChildrenOf={["other-show", "another-show"]}
        />,
      );

      expect(screen.getByText("Test Movie")).toBeInTheDocument();
    });
  });
});
