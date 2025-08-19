import { render, screen } from "@testing-library/react";
import React from "react";
import { BrowserRouter } from "react-router-dom";

import About from "../../src/components/About.jsx";

// Mock useNavigate
const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

// Wrapper component to provide Router context
const RouterWrapper = ({ children }) => (
  <BrowserRouter>{children}</BrowserRouter>
);

describe("About Component", () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  describe("Rendering", () => {
    it("should render the main element", () => {
      render(
        <RouterWrapper>
          <About />
        </RouterWrapper>,
      );

      const mainElement = screen.getByRole("main");
      expect(mainElement).toBeInTheDocument();
    });

    it("should render the About heading", () => {
      render(
        <RouterWrapper>
          <About />
        </RouterWrapper>,
      );

      const heading = screen.getByRole("heading", { name: /about/i });
      expect(heading).toBeInTheDocument();
      expect(heading.tagName).toBe("H2");
    });

    it("should render all paragraphs with correct content", () => {
      render(
        <RouterWrapper>
          <About />
        </RouterWrapper>,
      );

      // Check for key phrases in the paragraphs
      expect(screen.getByText(/Captain America movie/i)).toBeInTheDocument();
      expect(screen.getByText(/Agents of SHIELD/i)).toBeInTheDocument();
      expect(
        screen.getByText(/incredible extra layer of context/i),
      ).toBeInTheDocument();
      expect(screen.getByText(/perfect watching order/i)).toBeInTheDocument();
      expect(
        screen.getByText(/Binge-o-Matic will produce/i),
      ).toBeInTheDocument();
      expect(screen.getByText(/Stargate/i)).toBeInTheDocument();
      expect(screen.getByText(/Buffy and Angel/i)).toBeInTheDocument();
      expect(screen.getByText(/Dance Moms/i)).toBeInTheDocument();
      expect(screen.getByText(/JoJo shows up/i)).toBeInTheDocument();
    });

    it("should have correct structure and classes", () => {
      render(
        <RouterWrapper>
          <About />
        </RouterWrapper>,
      );

      const aboutDiv = screen.getByRole("main").firstChild;
      expect(aboutDiv).toHaveClass("about");

      const supportingText = aboutDiv.querySelector(".supporting-text");
      expect(supportingText).toBeInTheDocument();

      const cardActions = aboutDiv.querySelector(".card-actions");
      expect(cardActions).toBeInTheDocument();
    });
  });

  describe("Content Structure", () => {
    it("should have highlighted spans in the text", () => {
      render(
        <RouterWrapper>
          <About />
        </RouterWrapper>,
      );

      const highlightedText1 = screen.getByText(
        "an incredible extra layer of context.",
      );
      const highlightedText2 = screen.getByText(
        "The Binge-o-Matic will produce that perfect watching order for you in minutes.",
      );

      expect(highlightedText1.tagName).toBe("SPAN");
      expect(highlightedText2.tagName).toBe("SPAN");
    });

    it("should contain all expected text content", () => {
      render(
        <RouterWrapper>
          <About />
        </RouterWrapper>,
      );

      // Test specific sentences and phrases
      expect(
        screen.getByText(/One of the most amazing things/i),
      ).toBeInTheDocument();
      expect(
        screen.getByText(/TV shows and movies that are interconnected/i),
      ).toBeInTheDocument();
      expect(
        screen.getByText(/Need all the spinoffs of Stargate/i),
      ).toBeInTheDocument();
      expect(screen.getByText(/Go now!/i)).toBeInTheDocument();
      expect(
        screen.getByText(/The future of television beckons you/i),
      ).toBeInTheDocument();
    });
  });

  describe("Component Integration", () => {
    it("should render without Router context error", () => {
      // This test ensures the component properly uses useNavigate hook
      expect(() => {
        render(
          <RouterWrapper>
            <About />
          </RouterWrapper>,
        );
      }).not.toThrow();
    });

    it("should be exported as default", () => {
      expect(About).toBeDefined();
      expect(typeof About).toBe("function");
    });
  });

  describe("Accessibility", () => {
    it("should have proper heading hierarchy", () => {
      render(
        <RouterWrapper>
          <About />
        </RouterWrapper>,
      );

      const heading = screen.getByRole("heading", { level: 2 });
      expect(heading).toHaveTextContent("About");
    });

    it("should have main landmark", () => {
      render(
        <RouterWrapper>
          <About />
        </RouterWrapper>,
      );

      const main = screen.getByRole("main");
      expect(main).toBeInTheDocument();
    });
  });
});
