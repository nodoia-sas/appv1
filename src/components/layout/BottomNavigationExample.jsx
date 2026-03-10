// Example usage of BottomNavigation component for testing integration
import React, { useState } from "react";
import BottomNavigation from "./BottomNavigation";

const BottomNavigationExample = () => {
  const [activeScreen, setActiveScreen] = useState("home");
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleNavigate = (screen, options = {}) => {
    if (options.requiresAuth) {
      console.log(`Authentication required for ${screen}`);
      alert(`Please login to access ${screen}`);
      return;
    }

    console.log("Navigating to:", screen);
    setActiveScreen(screen);
  };

  return (
    <div style={{ paddingBottom: "100px" }}>
      <h2>BottomNavigation Component Examples</h2>

      <div style={{ marginBottom: "20px" }}>
        <label>
          <input
            type="checkbox"
            checked={isAuthenticated}
            onChange={(e) => setIsAuthenticated(e.target.checked)}
          />
          Authenticated User
        </label>
      </div>

      <p>
        Current Screen: <strong>{activeScreen}</strong>
      </p>
      <p>
        Authentication Status:{" "}
        <strong>{isAuthenticated ? "Logged In" : "Not Logged In"}</strong>
      </p>

      <h3>Navigation Component</h3>
      <BottomNavigation
        activeScreen={activeScreen}
        onNavigate={handleNavigate}
        isAuthenticated={isAuthenticated}
      />
    </div>
  );
};

export default BottomNavigationExample;
