# Feature-Based Architecture

This project uses a feature-based architecture to organize code by business domains rather than technical layers.

## Directory Structure

```
/features/                 # Feature-based modules
  /{feature-name}/
    /components/          # Feature-specific UI components
    /hooks/              # Custom hooks for the feature
    /services/           # Business logic and API interactions
    /types/              # TypeScript type definitions
    index.ts             # Barrel export for public API

/shared/                  # Shared code across features
  /components/           # Reusable UI components
  /hooks/               # Common custom hooks
  /utils/               # Utility functions and helpers
  /types/               # Shared TypeScript type definitions
  index.ts              # Main shared barrel export
```

## TypeScript Path Mappings

The following path mappings are configured in `tsconfig.json`:

- `@/*` - Root directory access
- `@/features/*` - Direct access to feature modules
- `@/shared/*` - Direct access to shared modules

## Usage Examples

### Importing from Features

```typescript
import { DocumentCard, useDocuments } from "@/features/documents";
```

### Importing from Shared

```typescript
import { apiClient, ApiResponse } from "@/shared";
// or more specific imports
import { useLocalStorage } from "@/shared/hooks";
import { API_ENDPOINTS } from "@/shared/utils";
```

## Feature Structure Guidelines

Each feature should follow this standard structure:

1. **Components** - UI components specific to the feature
2. **Hooks** - Custom hooks that encapsulate feature state and logic
3. **Services** - Business logic and API communication
4. **Types** - TypeScript definitions for the feature
5. **Index.ts** - Barrel export exposing only the public API

## Migration Strategy

Features are migrated progressively from the existing flat structure:

1. Create feature directory with standard structure
2. Move related components, hooks, and utilities
3. Update imports to use barrel exports
4. Maintain backward compatibility during transition

## Benefits

- **Colocation**: Related code is grouped together
- **Encapsulation**: Features expose only necessary public APIs
- **Maintainability**: Easier to find and modify feature-specific code
- **Scalability**: New features follow consistent patterns
- **Independence**: Features have minimal cross-dependencies
