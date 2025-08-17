import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import React from "react";

import Root from "../../src/components/Root.jsx";

// Mock all component dependencies since they have their own complex dependencies
jest.mock("../../src/components/About.jsx", () => {
  return function MockAbout() {
    return <div data-testid="mock-about">About Component</div>;
  };
});

jest.mock("../../src/components/AppWrapper.jsx", () => {
  return function MockAppWrapper({ children }) {
    return <div data-testid="mock-app-wrapper">{children}</div>;
  };
});

jest.mock("../../src/components/Edit.jsx", () => {
  return function MockEdit() {
    return <div data-testid="mock-edit">Edit Component</div>;
  };
});

jest.mock("../../src/components/NewList.jsx", () => {
  return function MockNewList() {
    return <div data-testid="mock-new-list">NewList Component</div>;
  };
});

jest.mock("../../src/components/SearchMovies.jsx", () => {
  return function MockSearchMovies() {
    return <div data-testid="mock-search-movies">SearchMovies Component</div>;
  };
});

jest.mock("../../src/components/SigninForm.jsx", () => {
  return function MockSigninForm() {
    return <div data-testid="mock-signin-form">SigninForm Component</div>;
  };
});

jest.mock("../../src/components/SignupForm.jsx", () => {
  return function MockSignupForm() {
    return <div data-testid="mock-signup-form">SignupForm Component</div>;
  };
});

jest.mock("../../src/components/UserList.jsx", () => {
  return function MockUserList() {
    return <div data-testid="mock-user-list">UserList Component</div>;
  };
});

// Helper function to render Root with MemoryRouter
const renderWithRouter = (initialEntries = ["/"], initialIndex = 0) => {
  return render(
    <MemoryRouter initialEntries={initialEntries} initialIndex={initialIndex}>
      <Root />
    </MemoryRouter>,
  );
};

describe("Root Component", () => {
  describe("Rendering", () => {
    it("should render without crashing", () => {
      expect(() => renderWithRouter()).not.toThrow();
    });

    it("should render AppWrapper as the main container", () => {
      renderWithRouter();

      const appWrapper = screen.getByTestId("mock-app-wrapper");
      expect(appWrapper).toBeInTheDocument();
    });

    it("should render Routes component", () => {
      const { container } = renderWithRouter();

      // Routes should be present and contain route components
      expect(
        container.querySelector("[data-testid*='mock-']"),
      ).toBeInTheDocument();
    });
  });

  describe("Route Navigation", () => {
    describe("/ (root path)", () => {
      it("should render About component on root path", () => {
        renderWithRouter(["/"]);

        const aboutComponent = screen.getByTestId("mock-about");
        expect(aboutComponent).toBeInTheDocument();
        expect(aboutComponent).toHaveTextContent("About Component");
      });
    });

    describe("/about path", () => {
      it("should render About component on /about path", () => {
        renderWithRouter(["/about"]);

        const aboutComponent = screen.getByTestId("mock-about");
        expect(aboutComponent).toBeInTheDocument();
        expect(aboutComponent).toHaveTextContent("About Component");
      });
    });

    describe("/signin path", () => {
      it("should render SigninForm component on /signin path", () => {
        renderWithRouter(["/signin"]);

        const signinComponent = screen.getByTestId("mock-signin-form");
        expect(signinComponent).toBeInTheDocument();
        expect(signinComponent).toHaveTextContent("SigninForm Component");
      });
    });

    describe("/signup path", () => {
      it("should render SignupForm component on /signup path", () => {
        renderWithRouter(["/signup"]);

        const signupComponent = screen.getByTestId("mock-signup-form");
        expect(signupComponent).toBeInTheDocument();
        expect(signupComponent).toHaveTextContent("SignupForm Component");
      });
    });

    describe("/newlist path", () => {
      it("should render NewList component on /newlist path", () => {
        renderWithRouter(["/newlist"]);

        const newListComponent = screen.getByTestId("mock-new-list");
        expect(newListComponent).toBeInTheDocument();
        expect(newListComponent).toHaveTextContent("NewList Component");
      });
    });

    describe("/lists/:id/edit path", () => {
      it("should render Edit component on /lists/:id/edit path", () => {
        renderWithRouter(["/lists/123/edit"]);

        const editComponent = screen.getByTestId("mock-edit");
        expect(editComponent).toBeInTheDocument();
        expect(editComponent).toHaveTextContent("Edit Component");
      });

      it("should handle different list IDs for edit route", () => {
        renderWithRouter(["/lists/abc456/edit"]);

        const editComponent = screen.getByTestId("mock-edit");
        expect(editComponent).toBeInTheDocument();
      });
    });

    describe("/lists/:id/search path", () => {
      it("should render SearchMovies component on /lists/:id/search path", () => {
        renderWithRouter(["/lists/123/search"]);

        const searchComponent = screen.getByTestId("mock-search-movies");
        expect(searchComponent).toBeInTheDocument();
        expect(searchComponent).toHaveTextContent("SearchMovies Component");
      });

      it("should handle different list IDs for search route", () => {
        renderWithRouter(["/lists/xyz789/search"]);

        const searchComponent = screen.getByTestId("mock-search-movies");
        expect(searchComponent).toBeInTheDocument();
      });
    });

    describe("/lists/:id path", () => {
      it("should render UserList component on /lists/:id path", () => {
        renderWithRouter(["/lists/123"]);

        const userListComponent = screen.getByTestId("mock-user-list");
        expect(userListComponent).toBeInTheDocument();
        expect(userListComponent).toHaveTextContent("UserList Component");
      });

      it("should handle different list IDs for list route", () => {
        renderWithRouter(["/lists/test-list-id"]);

        const userListComponent = screen.getByTestId("mock-user-list");
        expect(userListComponent).toBeInTheDocument();
      });
    });

    describe("404 - Page not found", () => {
      it("should render 404 message for unknown routes", () => {
        renderWithRouter(["/unknown-route"]);

        const notFoundMessage = screen.getByText("Page not found");
        expect(notFoundMessage).toBeInTheDocument();
        expect(notFoundMessage.tagName).toBe("P");
      });

      it("should render 404 message for deeply nested unknown routes", () => {
        renderWithRouter(["/very/deep/unknown/route"]);

        const notFoundMessage = screen.getByText("Page not found");
        expect(notFoundMessage).toBeInTheDocument();
      });

      it("should render 404 message for routes with query parameters", () => {
        renderWithRouter(["/unknown?param=value"]);

        const notFoundMessage = screen.getByText("Page not found");
        expect(notFoundMessage).toBeInTheDocument();
      });
    });
  });

  describe("Route Structure", () => {
    it("should have exact path matching for specific routes", () => {
      // Test that /about doesn't match /about/something
      renderWithRouter(["/about/extra"]);

      const notFoundMessage = screen.getByText("Page not found");
      expect(notFoundMessage).toBeInTheDocument();
    });

    it("should prioritize specific routes over catch-all", () => {
      renderWithRouter(["/signin"]);

      // Should render SigninForm, not 404
      const signinComponent = screen.getByTestId("mock-signin-form");
      expect(signinComponent).toBeInTheDocument();

      // Should not render 404
      expect(screen.queryByText("Page not found")).not.toBeInTheDocument();
    });

    it("should handle parameterized routes correctly", () => {
      renderWithRouter(["/lists/my-list-123"]);

      const userListComponent = screen.getByTestId("mock-user-list");
      expect(userListComponent).toBeInTheDocument();

      // Should not render 404
      expect(screen.queryByText("Page not found")).not.toBeInTheDocument();
    });
  });

  describe("AppWrapper Integration", () => {
    it("should wrap all routes with AppWrapper", () => {
      renderWithRouter(["/signin"]);

      const appWrapper = screen.getByTestId("mock-app-wrapper");
      const signinForm = screen.getByTestId("mock-signin-form");

      expect(appWrapper).toBeInTheDocument();
      expect(appWrapper).toContainElement(signinForm);
    });

    it("should wrap 404 route with AppWrapper", () => {
      renderWithRouter(["/unknown"]);

      const appWrapper = screen.getByTestId("mock-app-wrapper");
      const notFoundMessage = screen.getByText("Page not found");

      expect(appWrapper).toBeInTheDocument();
      expect(appWrapper).toContainElement(notFoundMessage);
    });

    it("should pass Routes as children to AppWrapper", () => {
      renderWithRouter(["/about"]);

      const appWrapper = screen.getByTestId("mock-app-wrapper");
      const aboutComponent = screen.getByTestId("mock-about");

      // Routes content should be inside AppWrapper
      expect(appWrapper).toContainElement(aboutComponent);
    });
  });

  describe("Component Exports", () => {
    it("should be exported as default", () => {
      expect(Root).toBeDefined();
      expect(typeof Root).toBe("function");
    });

    it("should be a functional component", () => {
      // Functional components don't have React lifecycle methods
      expect(Root.prototype.render).toBeUndefined();
      expect(Root.prototype.componentDidMount).toBeUndefined();
    });
  });

  describe("Router Dependencies", () => {
    it("should require router context to function", () => {
      // Test that Root requires router context
      const consoleSpy = jest.spyOn(console, "error").mockImplementation();

      expect(() => render(<Root />)).toThrow();

      consoleSpy.mockRestore();
    });

    it("should work with MemoryRouter", () => {
      expect(() => renderWithRouter()).not.toThrow();
    });

    it("should work with different router types", () => {
      // Test with different initial entries
      expect(() => renderWithRouter(["/", "/about", "/signin"])).not.toThrow();
    });
  });

  describe("Route Priority and Matching", () => {
    it("should match root route exactly", () => {
      renderWithRouter(["/"]);

      const aboutComponent = screen.getByTestId("mock-about");
      expect(aboutComponent).toBeInTheDocument();
    });

    it("should match nested routes with parameters", () => {
      renderWithRouter(["/lists/123/edit"]);

      const editComponent = screen.getByTestId("mock-edit");
      expect(editComponent).toBeInTheDocument();

      // Shouldn't match just /lists/123
      expect(screen.queryByTestId("mock-user-list")).not.toBeInTheDocument();
    });

    it("should differentiate between similar routes", () => {
      // Test /lists/:id vs /lists/:id/edit
      renderWithRouter(["/lists/123"]);

      const userListComponent = screen.getByTestId("mock-user-list");
      expect(userListComponent).toBeInTheDocument();
      expect(screen.queryByTestId("mock-edit")).not.toBeInTheDocument();
    });
  });

  describe("Error Handling", () => {
    it("should not crash with invalid routes", () => {
      expect(() => renderWithRouter(["//double-slash"])).not.toThrow();
    });

    it("should handle special characters in routes", () => {
      expect(() => renderWithRouter(["/lists/test@123/edit"])).not.toThrow();
    });

    it("should handle empty route parameters", () => {
      expect(() => renderWithRouter(["/lists//edit"])).not.toThrow();
    });
  });

  describe("Multiple Route Navigation", () => {
    it("should handle route changes correctly", () => {
      // Test initial route
      const { unmount } = renderWithRouter(["/signin"]);

      let signinComponent = screen.getByTestId("mock-signin-form");
      expect(signinComponent).toBeInTheDocument();

      unmount();

      // Test different route
      renderWithRouter(["/signup"]);

      const signupComponent = screen.getByTestId("mock-signup-form");
      expect(signupComponent).toBeInTheDocument();
      expect(screen.queryByTestId("mock-signin-form")).not.toBeInTheDocument();
    });
  });

  describe("React Component Behavior", () => {
    it("should render consistently", () => {
      const { rerender } = renderWithRouter(["/about"]);

      let aboutComponent = screen.getByTestId("mock-about");
      expect(aboutComponent).toBeInTheDocument();

      rerender(
        <MemoryRouter initialEntries={["/about"]}>
          <Root />
        </MemoryRouter>,
      );

      aboutComponent = screen.getByTestId("mock-about");
      expect(aboutComponent).toBeInTheDocument();
    });

    it("should not have side effects during render", () => {
      const consoleSpy = jest.spyOn(console, "log").mockImplementation();
      const errorSpy = jest.spyOn(console, "error").mockImplementation();

      renderWithRouter(["/about"]);

      expect(consoleSpy).not.toHaveBeenCalled();
      expect(errorSpy).not.toHaveBeenCalled();

      consoleSpy.mockRestore();
      errorSpy.mockRestore();
    });
  });
});
