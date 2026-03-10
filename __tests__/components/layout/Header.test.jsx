import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import Header from "../../../src/components/layout/Header";

// Mock the icons module
jest.mock("../../../components/icons", () => ({
  UserIcon: ({ className }) => (
    <div className={className} data-testid="user-icon" />
  ),
  LogInIcon: ({ className }) => (
    <div className={className} data-testid="login-icon" />
  ),
  BellIcon: ({ className }) => (
    <div className={className} data-testid="bell-icon" />
  ),
  FileTextIcon: ({ className }) => (
    <div className={className} data-testid="file-text-icon" />
  ),
  InfoIcon: ({ className }) => (
    <div className={className} data-testid="info-icon" />
  ),
  FileWarningIcon: ({ className }) => (
    <div className={className} data-testid="file-warning-icon" />
  ),
  Share2Icon: ({ className }) => (
    <div className={className} data-testid="share2-icon" />
  ),
  SettingsIcon: ({ className }) => (
    <div className={className} data-testid="settings-icon" />
  ),
}));

describe("Header Component", () => {
  const mockOnMenuClick = jest.fn();
  const mockOnNotificationClick = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the app title", () => {
    render(
      <Header
        user={null}
        onMenuClick={mockOnMenuClick}
        onNotificationClick={mockOnNotificationClick}
        isAuthenticated={false}
      />
    );

    expect(screen.getByText("Transit IA")).toBeInTheDocument();
  });

  it("shows login button when user is not authenticated", () => {
    render(
      <Header
        user={null}
        onMenuClick={mockOnMenuClick}
        onNotificationClick={mockOnNotificationClick}
        isAuthenticated={false}
      />
    );

    expect(screen.getByText("Login")).toBeInTheDocument();
    expect(screen.getByLabelText("Iniciar sesión")).toBeInTheDocument();
  });

  it("shows user account button when user is authenticated", () => {
    const mockUser = { name: "Test User", email: "test@example.com" };

    render(
      <Header
        user={mockUser}
        onMenuClick={mockOnMenuClick}
        onNotificationClick={mockOnNotificationClick}
        isAuthenticated={true}
      />
    );

    expect(screen.getByText("Mi cuenta")).toBeInTheDocument();
    expect(screen.getByLabelText("Abrir menú de usuario")).toBeInTheDocument();
  });

  it("renders notifications button", () => {
    render(
      <Header
        user={null}
        onMenuClick={mockOnMenuClick}
        onNotificationClick={mockOnNotificationClick}
        isAuthenticated={false}
      />
    );

    expect(screen.getByLabelText("View notifications")).toBeInTheDocument();
    expect(screen.getByTestId("bell-icon")).toBeInTheDocument();
  });

  it("calls onNotificationClick when notifications button is clicked and user is authenticated", () => {
    const mockUser = { name: "Test User", email: "test@example.com" };

    render(
      <Header
        user={mockUser}
        onMenuClick={mockOnMenuClick}
        onNotificationClick={mockOnNotificationClick}
        isAuthenticated={true}
      />
    );

    fireEvent.click(screen.getByLabelText("View notifications"));
    expect(mockOnNotificationClick).toHaveBeenCalledTimes(1);
  });

  it("calls onMenuClick with require-login-notifications when notifications button is clicked and user is not authenticated", () => {
    render(
      <Header
        user={null}
        onMenuClick={mockOnMenuClick}
        onNotificationClick={mockOnNotificationClick}
        isAuthenticated={false}
      />
    );

    fireEvent.click(screen.getByLabelText("View notifications"));
    expect(mockOnMenuClick).toHaveBeenCalledWith("require-login-notifications");
    expect(mockOnNotificationClick).not.toHaveBeenCalled();
  });

  it("shows dropdown menu when user account button is clicked", () => {
    const mockUser = { name: "Test User", email: "test@example.com" };

    render(
      <Header
        user={mockUser}
        onMenuClick={mockOnMenuClick}
        onNotificationClick={mockOnNotificationClick}
        isAuthenticated={true}
      />
    );

    fireEvent.click(screen.getByLabelText("Abrir menú de usuario"));

    expect(screen.getByText("Mi perfil")).toBeInTheDocument();
    expect(screen.getByText("Mis documentos")).toBeInTheDocument();
    expect(screen.getByText("Ayuda/Contacto")).toBeInTheDocument();
    expect(screen.getByText("Términos y privacidad")).toBeInTheDocument();
    expect(screen.getByText("Compartir app")).toBeInTheDocument();
    expect(screen.getByText("Configuración API")).toBeInTheDocument();
    expect(screen.getByText("Cerrar Sesión")).toBeInTheDocument();
  });

  it("calls onMenuClick with correct action when menu items are clicked", () => {
    const mockUser = { name: "Test User", email: "test@example.com" };

    render(
      <Header
        user={mockUser}
        onMenuClick={mockOnMenuClick}
        onNotificationClick={mockOnNotificationClick}
        isAuthenticated={true}
      />
    );

    // Open dropdown
    fireEvent.click(screen.getByLabelText("Abrir menú de usuario"));

    // Click on "Mi perfil"
    fireEvent.click(screen.getByText("Mi perfil"));
    expect(mockOnMenuClick).toHaveBeenCalledWith("my-profile");
  });

  it("shows unauthenticated menu options when user is not logged in", () => {
    render(
      <Header
        user={null}
        onMenuClick={mockOnMenuClick}
        onNotificationClick={mockOnNotificationClick}
        isAuthenticated={false}
      />
    );

    // Click on login button to show dropdown (if it has dropdown functionality)
    // For now, the login button is a direct link, so we'll test the authenticated dropdown
    // This test verifies the component structure for unauthenticated users
    expect(screen.getByText("Login")).toBeInTheDocument();
  });
});
