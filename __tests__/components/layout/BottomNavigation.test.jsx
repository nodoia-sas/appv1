import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import BottomNavigation from "../../../src/components/layout/BottomNavigation";

// Mock the icons module
jest.mock("../../../components/icons", () => ({
  UserIcon: ({ className }) => (
    <div className={className} data-testid="user-icon" />
  ),
  FileTextIcon: ({ className }) => (
    <div className={className} data-testid="file-text-icon" />
  ),
  HomeIcon: ({ className }) => (
    <div className={className} data-testid="home-icon" />
  ),
  StarIcon: ({ className }) => (
    <div className={className} data-testid="star-icon" />
  ),
  LightbulbIcon: ({ className }) => (
    <div className={className} data-testid="lightbulb-icon" />
  ),
}));

describe("BottomNavigation Component", () => {
  const mockOnNavigate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders all navigation items", () => {
    render(
      <BottomNavigation
        activeScreen="home"
        onNavigate={mockOnNavigate}
        isAuthenticated={true}
      />
    );

    expect(screen.getByText("Perfil")).toBeInTheDocument();
    expect(screen.getByText("Docs")).toBeInTheDocument();
    expect(screen.getByText("Inicio")).toBeInTheDocument();
    expect(screen.getByText("Favs")).toBeInTheDocument();
    expect(screen.getByText("Asesoría")).toBeInTheDocument();
  });

  it("highlights the active screen", () => {
    render(
      <BottomNavigation
        activeScreen="home"
        onNavigate={mockOnNavigate}
        isAuthenticated={true}
      />
    );

    const homeButton = screen.getByLabelText("Go to Inicio");
    expect(homeButton).toHaveClass("bg-blue-500", "text-white");
  });

  it("calls onNavigate when authenticated user clicks navigation item", () => {
    render(
      <BottomNavigation
        activeScreen="home"
        onNavigate={mockOnNavigate}
        isAuthenticated={true}
      />
    );

    fireEvent.click(screen.getByLabelText("Go to Perfil"));
    expect(mockOnNavigate).toHaveBeenCalledWith("my-profile");
  });

  it("calls onNavigate with requiresAuth flag when unauthenticated user clicks protected route", () => {
    render(
      <BottomNavigation
        activeScreen="home"
        onNavigate={mockOnNavigate}
        isAuthenticated={false}
      />
    );

    fireEvent.click(screen.getByLabelText("Go to Perfil"));
    expect(mockOnNavigate).toHaveBeenCalledWith("my-profile", {
      requiresAuth: true,
    });
  });

  it("allows unauthenticated users to navigate to home", () => {
    render(
      <BottomNavigation
        activeScreen="documents"
        onNavigate={mockOnNavigate}
        isAuthenticated={false}
      />
    );

    fireEvent.click(screen.getByLabelText("Go to Inicio"));
    expect(mockOnNavigate).toHaveBeenCalledWith("home");
  });

  it("renders correct test ids for navigation items", () => {
    render(
      <BottomNavigation
        activeScreen="home"
        onNavigate={mockOnNavigate}
        isAuthenticated={true}
      />
    );

    expect(screen.getByTestId("nav-my-profile")).toBeInTheDocument();
    expect(screen.getByTestId("nav-documents")).toBeInTheDocument();
    expect(screen.getByTestId("nav-home")).toBeInTheDocument();
    expect(screen.getByTestId("nav-favorites")).toBeInTheDocument();
    expect(screen.getByTestId("nav-ai-assist")).toBeInTheDocument();
  });
});
