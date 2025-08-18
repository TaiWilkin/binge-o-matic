import { render, screen } from "@testing-library/react";
import React from "react";
import { BrowserRouter } from "react-router-dom";

import NavLists from "../../src/components/NavLists.jsx";

// Wrapper component to provide Router context
const RouterWrapper = ({ children }) => (
  <BrowserRouter>{children}</BrowserRouter>
);

describe("NavLists Component", () => {
  describe("Rendering", () => {
    it("should render null if no lists are available", () => {
      render(
        <RouterWrapper>
          <NavLists />
        </RouterWrapper>,
      );

      const mainElement = screen.queryByRole("li");
      expect(mainElement).not.toBeInTheDocument();
    });
  });

  describe("Component Integration", () => {
    it("should render without Router context error", () => {
      expect(() => {
        render(
          <RouterWrapper>
            <NavLists />
          </RouterWrapper>,
        );
      }).not.toThrow();
    });

    it("should be exported as default", () => {
      expect(NavLists).toBeDefined();
      expect(typeof NavLists).toBe("function");
    });
  });
});
