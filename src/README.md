# Transitia App - New Modular Architecture

This directory contains the new modular architecture for the Transitia application, implementing the Phase 1 refactoring plan to separate the monolithic `transit-app.jsx` component.

## Directory Structure

```
src/
├── components/
│   ├── layout/          # Layout components (Header, BottomNavigation, Layout)
│   ├── screens/         # Screen components (ProfileScreen, DocumentsScreen, etc.)
│   └── MainApp.jsx      # Main application orchestrator
├── hooks/               # Custom React hooks
│   ├── useAuth.js       # Authentication hook
│   ├── useNotifications.js  # Notifications hook
│   ├── useNavigation.js # Navigation hook
│   └── useProfile.js    # Profile management hook
├── services/            # Business logic services
│   ├── AuthService.js   # Authentication service
│   ├── NotificationService.js  # Notification service
│   └── ProfileService.js # Profile service
├── store/               # Zustand state management
│   └── appStore.js      # Global application store
└── utils/               # Utility functions and constants
    └── constants.js     # Application constants
```

## Key Features

### State Management (Zustand)

- Centralized state management with Zustand
- Persistent storage for critical state (user, navigation)
- Graceful handling of localStorage unavailability
- Optimized selectors for better performance

### Custom Hooks

- `useAuth`: Handles authentication logic with Auth0
- `useNotifications`: Manages toast notifications with auto-hide
- `useNavigation`: Manages screen navigation and history
- `useProfile`: Handles user profile data and API interactions

### Services Layer

- `AuthService`: Encapsulates authentication business logic
- `NotificationService`: Handles notification formatting and display
- `ProfileService`: Manages profile data and API synchronization

### Component Architecture

- **Layout Components**: Reusable UI structure components
- **Screen Components**: Independent screen implementations
- **MainApp**: Lightweight orchestrator (< 150 lines)

## Testing Strategy

The architecture includes comprehensive testing with:

- **Unit Tests**: Specific examples and edge cases
- **Property-Based Tests**: Universal properties with @fast-check/jest
- **Integration Tests**: End-to-end functionality validation

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run tests for CI
npm run test:ci
```

## Migration Strategy

This new architecture is designed to:

1. **Maintain Compatibility**: All existing functionality preserved
2. **Incremental Migration**: Components can be migrated one at a time
3. **Performance Optimization**: Better code splitting and bundle optimization
4. **Enhanced Maintainability**: Clear separation of concerns

## Usage Examples

### Using the Store

```javascript
import { useAppStore } from "./store/appStore";

function MyComponent() {
  const { user, navigate, showNotification } = useAppStore();

  const handleAction = () => {
    showNotification("Action completed!", "success");
    navigate("documents");
  };

  return (
    <div>
      {user ? `Welcome ${user.name}` : "Please login"}
      <button onClick={handleAction}>Go to Documents</button>
    </div>
  );
}
```

### Using Custom Hooks

```javascript
import { useAuth } from "./hooks/useAuth";
import { useNotifications } from "./hooks/useNotifications";

function AuthComponent() {
  const { user, login, logout, isLoading } = useAuth();
  const { showNotification } = useNotifications();

  const handleLogin = async () => {
    try {
      await login();
      showNotification("Login successful!", "success");
    } catch (error) {
      showNotification("Login failed", "error");
    }
  };

  return (
    <div>
      {isLoading ? (
        "Loading..."
      ) : user ? (
        <button onClick={logout}>Logout</button>
      ) : (
        <button onClick={handleLogin}>Login</button>
      )}
    </div>
  );
}
```

## Next Steps

After completing this setup:

1. Implement the services layer (Task 2)
2. Create custom hooks (Task 3)
3. Build layout components (Task 5)
4. Create screen components (Task 6)
5. Implement MainApp orchestrator (Task 7)
6. Migrate from old transit-app.jsx (Task 10)

## Performance Considerations

- **Code Splitting**: Screen components can be lazy-loaded
- **Bundle Optimization**: Tree shaking and dead code elimination
- **Memory Management**: Proper cleanup of subscriptions
- **Render Optimization**: React.memo and useMemo where appropriate

## Backward Compatibility

- API contracts maintained during transition
- URL structure preserved
- Local storage data migration handled
- Identical UI/UX maintained during refactoring
