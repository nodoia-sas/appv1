/**
 * MainApp Component Tests
 *
 * Tests for the main application orchestrator component
 * Requirements: 4.1, 4.2, 4.3, 4.4, 4.6
 */

import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import MainApp from "../../src/components/MainApp";

// Mock the hooks to avoid complex dependencies in basic tests
jest.mock("../../src/hooks/useAuth", () => ({
  useAuth: () => ({
    user: null,
    isAuthenticated: false,
    isLoading: false,
    initializeAuth: jest.fn(),
  }),
}));

jest.mock("../../src/hooks/useNavigation", () => ({
  useNavigation: () => ({
    activeScreen: "home",
    navigate: jest.fn(),
    handleNavClick: jest.fn(),
  }),
}));

jest.mock("../../src/hooks/useNotifications", () => ({
  useNotifications: () => ({
    showNotification: jest.fn(),
    notification: { visible: false },
  }),
}));

// Mock the screen components to avoid complex rendering
jest.mock("../../src/components/screens/ProfileScreen", () => {
  return function MockProfileScreen() {
    return <div data-testid="screen-profile">Profile Screen</div>;
  };
});

jest.mock("../../components/under-construction", () => {
  return function MockUnderConstruction() {
    return <div data-testid="screen-home">Under Construction</div>;
  };
});

describe("MainApp Component", () => {
  test("renders without crashing", () => {
    render(<MainApp />);
    expect(screen.getByTestId("screen-home")).toBeInTheDocument();
  });

  test("acts as layout orchestrator", () => {
    render(<MainApp />);

    // Should render the layout structure
    const homeScreen = screen.getByTestId("screen-home");
    expect(homeScreen).toBeInTheDocument();
  });

  test("component is under 150 lines", () => {
    // This is a meta-test to ensure the component stays within size constraints
    const fs = require("fs");
    const path = require("path");

    const filePath = path.join(__dirname, "../../src/components/MainApp.jsx");
    const fileContent = fs.readFileSync(filePath, "utf8");
    const lineCount = fileContent.split("\n").length;

    expect(lineCount).toBeLessThan(150);
  });
});
