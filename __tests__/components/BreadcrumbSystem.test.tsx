import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { BreadcrumbSystem } from "@/shared/components";
import { useNavigation } from "@/lib/navigation";

// Mock the navigation hook
jest.mock("@/lib/navigation", () => ({
  useNavigation: jest.fn(),
}));

const mockUseNavigation = useNavigation as jest.MockedFunction<
  typeof useNavigation
>;

describe("BreadcrumbSystem", () => {
  const mockNavigate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should not render when there are no breadcrumbs or only home", () => {
    mockUseNavigation.mockReturnValue({
      breadcrumbs: [{ label: "Inicio", path: "/", icon: "home" }],
      navigate: mockNavigate,
      currentPath: "/",
      isNavigating: false,
      activeScreen: "home",
      canGoBack: false,
      history: ["/"],
      goBack: jest.fn(),
    });

    const { container } = render(<BreadcrumbSystem />);
    expect(container.firstChild).toBeNull();
  });

  it("should render breadcrumbs when there are multiple items", () => {
    const breadcrumbs = [
      { label: "Inicio", path: "/", icon: "home" },
      { label: "Mis Documentos", path: "/documents", icon: "file-text" },
      { label: "Detalle del Documento", path: "/documents/123", icon: "file" },
    ];

    mockUseNavigation.mockReturnValue({
      breadcrumbs,
      navigate: mockNavigate,
      currentPath: "/documents/123",
      isNavigating: false,
      activeScreen: "documents",
      canGoBack: true,
      history: ["/", "/documents", "/documents/123"],
      goBack: jest.fn(),
    });

    render(<BreadcrumbSystem />);

    expect(screen.getByText("Inicio")).toBeInTheDocument();
    expect(screen.getByText("Mis Documentos")).toBeInTheDocument();
    expect(screen.getByText("Detalle del Documento")).toBeInTheDocument();
  });

  it("should navigate when clicking on a breadcrumb item (not the last one)", () => {
    const breadcrumbs = [
      { label: "Inicio", path: "/", icon: "home" },
      { label: "Mis Documentos", path: "/documents", icon: "file-text" },
      { label: "Detalle del Documento", path: "/documents/123", icon: "file" },
    ];

    mockUseNavigation.mockReturnValue({
      breadcrumbs,
      navigate: mockNavigate,
      currentPath: "/documents/123",
      isNavigating: false,
      activeScreen: "documents",
      canGoBack: true,
      history: ["/", "/documents", "/documents/123"],
      goBack: jest.fn(),
    });

    render(<BreadcrumbSystem />);

    const homeButton = screen.getByText("Inicio");
    fireEvent.click(homeButton);

    expect(mockNavigate).toHaveBeenCalledWith("/");
  });

  it("should not navigate when clicking on the last breadcrumb item", () => {
    const breadcrumbs = [
      { label: "Inicio", path: "/", icon: "home" },
      { label: "Mis Documentos", path: "/documents", icon: "file-text" },
    ];

    mockUseNavigation.mockReturnValue({
      breadcrumbs,
      navigate: mockNavigate,
      currentPath: "/documents",
      isNavigating: false,
      activeScreen: "documents",
      canGoBack: true,
      history: ["/", "/documents"],
      goBack: jest.fn(),
    });

    render(<BreadcrumbSystem />);

    const documentsButton = screen.getByText("Mis Documentos");
    fireEvent.click(documentsButton);

    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it("should truncate breadcrumbs when exceeding maxItems", () => {
    const breadcrumbs = [
      { label: "Inicio", path: "/", icon: "home" },
      { label: "Nivel 1", path: "/level1", icon: "folder" },
      { label: "Nivel 2", path: "/level1/level2", icon: "folder" },
      { label: "Nivel 3", path: "/level1/level2/level3", icon: "folder" },
      {
        label: "Nivel 4",
        path: "/level1/level2/level3/level4",
        icon: "folder",
      },
      {
        label: "Nivel 5",
        path: "/level1/level2/level3/level4/level5",
        icon: "file",
      },
    ];

    mockUseNavigation.mockReturnValue({
      breadcrumbs,
      navigate: mockNavigate,
      currentPath: "/level1/level2/level3/level4/level5",
      isNavigating: false,
      activeScreen: "level5",
      canGoBack: true,
      history: ["/"],
      goBack: jest.fn(),
    });

    render(<BreadcrumbSystem maxItems={4} />);

    expect(screen.getByText("Inicio")).toBeInTheDocument();
    expect(screen.getByText("...")).toBeInTheDocument();
    expect(screen.getByText("Nivel 4")).toBeInTheDocument();
    expect(screen.getByText("Nivel 5")).toBeInTheDocument();

    // Should not show intermediate levels
    expect(screen.queryByText("Nivel 1")).not.toBeInTheDocument();
    expect(screen.queryByText("Nivel 2")).not.toBeInTheDocument();
    expect(screen.queryByText("Nivel 3")).not.toBeInTheDocument();
  });
});
