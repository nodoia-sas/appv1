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

### Migration Status

The following features have been successfully migrated:

- ✅ **Documents** - Document management and personal documents
- ✅ **Vehicles** - Vehicle registration and management
- ✅ **Regulations** - Traffic regulations and legal information
- ✅ **News** - News articles and updates
- ✅ **Quiz** - Educational quiz functionality
- ✅ **PQR** - Petitions, complaints, and claims

### Legacy Components

Some components remain in the legacy `/components` directory and will be migrated in future phases:

- AI Assistant (`ai-assist.jsx`)
- Glossary (`glossary-main.jsx`, `glossary.jsx`)
- Profile Management (`my-profile.jsx`)
- Notifications (`notifications.jsx`)
- Pico y Placa (`pico-y-placa.jsx`)
- Theme and UI utilities

## Adding a New Feature

### Step-by-Step Guide

1. **Create Directory Structure**

   ```bash
   mkdir -p features/my-feature/{components,hooks,services,types}
   touch features/my-feature/index.ts
   ```

2. **Implement Components**

   ```typescript
   // features/my-feature/components/MyComponent.tsx
   import { useMyFeature } from "../hooks/useMyFeature";
   import { MyFeatureData } from "../types";

   export function MyComponent() {
     const { data, loading, error } = useMyFeature();

     if (loading) return <div>Loading...</div>;
     if (error) return <div>Error: {error}</div>;

     return <div>{/* Component implementation */}</div>;
   }
   ```

3. **Create Service Layer**

   ```typescript
   // features/my-feature/services/myFeatureService.ts
   import { apiClient } from "@/shared/utils/apiClient";
   import { MyFeatureData, CreateMyFeatureRequest } from "../types";

   export const myFeatureService = {
     async getAll(): Promise<MyFeatureData[]> {
       return apiClient.get("/my-feature");
     },

     async create(data: CreateMyFeatureRequest): Promise<MyFeatureData> {
       return apiClient.post("/my-feature", data);
     },
   };
   ```

4. **Implement Custom Hooks**

   ```typescript
   // features/my-feature/hooks/useMyFeature.ts
   import { useState, useEffect } from "react";
   import { myFeatureService } from "../services/myFeatureService";
   import { MyFeatureData } from "../types";

   export function useMyFeature() {
     const [data, setData] = useState<MyFeatureData[]>([]);
     const [loading, setLoading] = useState(false);
     const [error, setError] = useState<string | null>(null);

     useEffect(() => {
       loadData();
     }, []);

     const loadData = async () => {
       setLoading(true);
       try {
         const result = await myFeatureService.getAll();
         setData(result);
       } catch (err) {
         setError(err.message);
       } finally {
         setLoading(false);
       }
     };

     return { data, loading, error, reload: loadData };
   }
   ```

5. **Define TypeScript Types**

   ```typescript
   // features/my-feature/types/index.ts
   export interface MyFeatureData {
     id: string;
     name: string;
     createdAt: Date;
   }

   export interface CreateMyFeatureRequest {
     name: string;
   }
   ```

6. **Create Barrel Export**

   ```typescript
   // features/my-feature/index.ts
   // Components
   export { MyComponent } from "./components/MyComponent";

   // Hooks
   export { useMyFeature } from "./hooks/useMyFeature";

   // Types (only public types)
   export type { MyFeatureData, CreateMyFeatureRequest } from "./types";

   // Note: Services are NOT exported - they're internal implementation details
   ```

7. **Use the Feature**

   ```typescript
   // app/my-page/page.tsx
   import { MyComponent, useMyFeature } from "@/features/my-feature";

   export default function MyPage() {
     return <MyComponent />;
   }
   ```

### Best Practices

1. **Encapsulation**

   - Only export what's necessary through `index.ts`
   - Keep services and internal utilities private
   - Use TypeScript to enforce API boundaries

2. **Shared Code**

   - Move reusable components to `/shared/components`
   - Extract common utilities to `/shared/utils`
   - Define shared types in `/shared/types`

3. **Feature Independence**

   - Features should not import from other features directly
   - Use shared code for cross-feature functionality
   - Communicate through props and callbacks

4. **Consistent Structure**

   - Follow the standard directory layout
   - Use similar naming conventions
   - Maintain consistent error handling patterns

5. **Type Safety**

   - Define comprehensive TypeScript types
   - Use strict type checking
   - Export only necessary types

6. **Testing**
   - Write unit tests for services
   - Test hooks with React Testing Library
   - Test components in isolation

## Common Patterns

### Error Handling

```typescript
export function useMyFeature() {
  const [error, setError] = useState<string | null>(null);

  const handleError = (err: unknown) => {
    const message = err instanceof Error ? err.message : "Unknown error";
    setError(message);
    console.error("MyFeature error:", err);
  };

  return { error, clearError: () => setError(null) };
}
```

### Loading States

```typescript
export function useMyFeature() {
  const [loading, setLoading] = useState(false);

  const performAction = async () => {
    setLoading(true);
    try {
      // Perform action
    } finally {
      setLoading(false);
    }
  };

  return { loading };
}
```

### API Integration

```typescript
// Use the shared API client
import { apiClient } from "@/shared/utils/apiClient";

export const myFeatureService = {
  async getData() {
    return apiClient.get("/endpoint");
  },
};
```

## Benefits

- **Colocation**: Related code is grouped together
- **Encapsulation**: Features expose only necessary public APIs
- **Maintainability**: Easier to find and modify feature-specific code
- **Scalability**: New features follow consistent patterns
- **Independence**: Features have minimal cross-dependencies
