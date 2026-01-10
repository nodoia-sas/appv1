"use client";

import * as Icons from "../../../components/icons";

const BottomNavigation = ({ activeScreen, onNavigate, isAuthenticated }) => {
  const navItems = [
    { name: "Perfil", icon: Icons.UserIcon, screen: "my-profile" },
    { name: "Docs", icon: Icons.FileTextIcon, screen: "documents" },
    { name: "Inicio", icon: Icons.HomeIcon, screen: "home" },
    { name: "Favs", icon: Icons.StarIcon, screen: "favorites" },
    { name: "Asesoría", icon: Icons.LightbulbIcon, screen: "ai-assist" },
  ];

  // Navigation handler that requires authentication for routes different than 'home'
  const handleNavClick = (screen) => {
    if (screen !== "home" && !isAuthenticated) {
      // Notify parent component about authentication requirement
      onNavigate(screen, { requiresAuth: true });
      return;
    }

    onNavigate(screen);
  };

  return (
    <nav
      className="fixed left-1/2 transform -translate-x-1/2 bottom-0 bg-white border-t border-gray-200 rounded-t-xl shadow-inner z-50 h-20 flex items-center justify-around px-2 w-full max-w-md md:max-w-2xl lg:max-w-3xl"
      style={{
        paddingBottom: "env(safe-area-inset-bottom)",
        WebkitTapHighlightColor: "transparent",
      }}
    >
      {navItems.map((item) => (
        <button
          key={item.name}
          className={`relative flex flex-col items-center justify-center flex-1 h-full py-2
                      rounded-xl transition-all duration-300 ease-in-out
                      ${
                        activeScreen === item.screen
                          ? "bg-blue-500 text-white transform -translate-y-2 shadow-lg"
                          : "bg-white text-gray-600 hover:bg-gray-100"
                      }
                      focus:outline-none focus:ring-2 focus:ring-blue-300`}
          onClick={() => handleNavClick(item.screen)}
          aria-label={`Go to ${item.name}`}
          data-testid={`nav-${item.screen}`}
        >
          <item.icon className="w-6 h-6" />
          <span className="text-xs mt-1">{item.name}</span>
        </button>
      ))}
    </nav>
  );
};

export default BottomNavigation;
