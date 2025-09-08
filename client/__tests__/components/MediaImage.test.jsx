import { render, screen } from "@testing-library/react";
import React from "react";

import MediaImage from "../../src/components/MediaImage";

describe("MediaImage Component", () => {
  beforeEach(() => {});

  describe("Rendering with poster path", () => {
    it("should render an image for non-episode media types", () => {
      render(<MediaImage mediaType="movie" posterPath="/example-poster.jpg" />);

      const image = screen.getByRole("img");
      expect(image).toBeInTheDocument();
      expect(image).toHaveAttribute(
        "src",
        "https://image.tmdb.org/t/p/w92/example-poster.jpg",
      );
      expect(image).toHaveAttribute("alt", "poster");
      expect(image).toHaveClass("media-img");
      expect(image).not.toHaveClass("episode-img");
    });

    it("should render an image for episode media type with different width", () => {
      render(
        <MediaImage mediaType="episode" posterPath="/episode-poster.jpg" />,
      );

      const image = screen.getByRole("img");
      expect(image).toBeInTheDocument();
      expect(image).toHaveAttribute(
        "src",
        "https://image.tmdb.org/t/p/w185/episode-poster.jpg",
      );
      expect(image).toHaveAttribute("alt", "poster");
      expect(image).toHaveClass("media-img", "episode-img");
    });

    it("should render an image for tv show media type", () => {
      render(<MediaImage mediaType="tv" posterPath="/tv-show-poster.jpg" />);

      const image = screen.getByRole("img");
      expect(image).toBeInTheDocument();
      expect(image).toHaveAttribute(
        "src",
        "https://image.tmdb.org/t/p/w92/tv-show-poster.jpg",
      );
      expect(image).toHaveAttribute("alt", "poster");
      expect(image).toHaveClass("media-img");
      expect(image).not.toHaveClass("episode-img");
    });

    it("should render an image for season media type", () => {
      render(<MediaImage mediaType="season" posterPath="/season-poster.jpg" />);

      const image = screen.getByRole("img");
      expect(image).toBeInTheDocument();
      expect(image).toHaveAttribute(
        "src",
        "https://image.tmdb.org/t/p/w92/season-poster.jpg",
      );
      expect(image).toHaveAttribute("alt", "poster");
      expect(image).toHaveClass("media-img");
      expect(image).not.toHaveClass("episode-img");
    });
  });

  describe("Rendering without poster path", () => {
    it("should render placeholder div for non-episode media types when no poster path", () => {
      render(<MediaImage mediaType="movie" posterPath={null} />);

      const image = screen.queryByRole("img");
      expect(image).not.toBeInTheDocument();

      // Check for the placeholder div by class
      const placeholder = document.querySelector(".no-image.media-img");
      expect(placeholder).toBeInTheDocument();
      expect(placeholder).not.toHaveClass("episode-img");
    });

    it("should render placeholder div for episode media type when no poster path", () => {
      render(<MediaImage mediaType="episode" posterPath={null} />);

      const image = screen.queryByRole("img");
      expect(image).not.toBeInTheDocument();

      // Check for the placeholder div by class
      const placeholder = document.querySelector(
        ".no-image.media-img.episode-img",
      );
      expect(placeholder).toBeInTheDocument();
    });

    it("should render placeholder div when posterPath is undefined", () => {
      render(<MediaImage mediaType="tv" posterPath={undefined} />);

      const image = screen.queryByRole("img");
      expect(image).not.toBeInTheDocument();

      const placeholder = document.querySelector(".no-image.media-img");
      expect(placeholder).toBeInTheDocument();
    });

    it("should render placeholder div when posterPath is empty string", () => {
      render(<MediaImage mediaType="movie" posterPath="" />);

      const image = screen.queryByRole("img");
      expect(image).not.toBeInTheDocument();

      const placeholder = document.querySelector(".no-image.media-img");
      expect(placeholder).toBeInTheDocument();
    });
  });

  describe("CSS classes", () => {
    it("should apply correct classes for episode images", () => {
      render(<MediaImage mediaType="episode" posterPath="/test.jpg" />);

      const image = screen.getByRole("img");
      expect(image).toHaveClass("media-img");
      expect(image).toHaveClass("episode-img");
    });

    it("should apply correct classes for non-episode images", () => {
      render(<MediaImage mediaType="movie" posterPath="/test.jpg" />);

      const image = screen.getByRole("img");
      expect(image).toHaveClass("media-img");
      expect(image).not.toHaveClass("episode-img");
    });

    it("should apply correct classes for episode placeholders", () => {
      render(<MediaImage mediaType="episode" posterPath={null} />);

      const placeholder = document.querySelector(".no-image");
      expect(placeholder).toHaveClass("no-image");
      expect(placeholder).toHaveClass("media-img");
      expect(placeholder).toHaveClass("episode-img");
    });

    it("should apply correct classes for non-episode placeholders", () => {
      render(<MediaImage mediaType="tv" posterPath={null} />);

      const placeholder = document.querySelector(".no-image");
      expect(placeholder).toHaveClass("no-image");
      expect(placeholder).toHaveClass("media-img");
      expect(placeholder).not.toHaveClass("episode-img");
    });
  });
});
