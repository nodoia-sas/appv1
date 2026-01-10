// Example usage of Header component for testing integration
import React from "react";
import Header from "./Header";

const HeaderExample = () => {
  const handleMenuClick = (action) => {
    console.log("Menu action:", action);
  };

  const handleNotificationClick = () => {
    console.log("Notification clicked");
  };

  const mockUser = {
    name: "Test User",
    email: "test@example.com",
  };

  return (
    <div>
      <h2>Header Component Examples</h2>

      <h3>Authenticated User</h3>
      <Header
        user={mockUser}
        onMenuClick={handleMenuClick}
        onNotificationClick={handleNotificationClick}
        isAuthenticated={true}
      />

      <div style={{ marginTop: "100px" }}>
        <h3>Unauthenticated User</h3>
        <Header
          user={null}
          onMenuClick={handleMenuClick}
          onNotificationClick={handleNotificationClick}
          isAuthenticated={false}
        />
      </div>
    </div>
  );
};

export default HeaderExample;
