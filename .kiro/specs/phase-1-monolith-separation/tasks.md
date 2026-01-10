# Implementation Plan: Fase 1 - Separación del Monolito

## Overview

Este plan implementa la separación del componente monolítico `transit-app.jsx` en una arquitectura modular basada en React, Zustand, hooks personalizados y servicios de negocio. La implementación se realiza de forma incremental para minimizar riesgos y mantener la funcionalidad existente.

## Tasks

- [x] 1. Setup project structure and state management

  - Create directory structure for new architecture
  - Install and configure Zustand for state management
  - Set up testing framework with Jest and @fast-check/jest
  - _Requirements: 2.1_

- [x] 1.1 Write property test for Zustand store configuration

  - **Property 2: State Management Reactivity**
  - **Validates: Requirements 2.2, 2.3, 2.4**

- [ ] 2. Implement core services layer

  - [x] 2.1 Create AuthService for authentication logic

    - Extract Auth0 integration logic from transit-app.jsx
    - Implement token validation and user management
    - _Requirements: 6.1, 6.2_

  - [ ]\* 2.2 Write property test for AuthService

    - **Property 4: Authentication Hook Integration**
    - **Validates: Requirements 3.1, 3.2**

  - [x] 2.3 Create NotificationService for toast management

    - Extract notification logic from transit-app.jsx
    - Implement message formatting and display logic
    - _Requirements: 6.3, 6.4_

  - [ ]\* 2.4 Write property test for NotificationService

    - **Property 13: Notification Formatting**
    - **Validates: Requirements 6.4**

  - [x] 2.5 Create ProfileService for user profile management

    - Extract profile loading and updating logic
    - Implement API synchronization for profile data
    - _Requirements: 6.5, 6.6_

  - [ ]\* 2.6 Write property test for ProfileService
    - **Property 12: API Synchronization**
    - **Validates: Requirements 6.2, 6.6**

- [ ] 3. Implement custom hooks

  - [x] 3.1 Create useAuth hook

    - Integrate with AuthService and Zustand store
    - Handle authentication state and actions
    - _Requirements: 3.1, 3.2_

  - [ ]\* 3.2 Write unit tests for useAuth hook

    - Test authentication flows and error handling
    - _Requirements: 3.1, 3.2_

  - [x] 3.3 Create useNotifications hook

    - Integrate with NotificationService and Zustand store
    - Implement auto-hide functionality (3 seconds)
    - _Requirements: 3.3, 3.4_

  - [ ]\* 3.4 Write property test for useNotifications

    - **Property 5: Notification Auto-Hide Behavior**
    - **Validates: Requirements 3.4**

  - [x] 3.5 Create useNavigation hook

    - Manage navigation state and screen transitions
    - Handle authentication requirements for protected routes
    - _Requirements: 3.5, 3.6_

  - [ ]\* 3.6 Write property test for useNavigation

    - **Property 6: Navigation State Synchronization**
    - **Validates: Requirements 3.6**

  - [x] 3.7 Create useProfile hook

    - Integrate with ProfileService for data management
    - Handle profile loading and API interactions
    - _Requirements: 3.7, 3.8_

  - [ ]\* 3.8 Write property test for useProfile
    - **Property 7: Profile API Integration**
    - **Validates: Requirements 3.8**

- [x] 4. Checkpoint - Ensure core infrastructure tests pass

  - Ensure all tests pass, ask the user if questions arise.

- [ ] 5. Implement layout components

  - [x] 5.1 Create Header component

    - Extract header logic from transit-app.jsx
    - Implement user menu and notifications button
    - _Requirements: 5.1, 5.2_

  - [ ]\* 5.2 Write unit tests for Header component

    - Test user menu interactions and authentication states
    - _Requirements: 5.1, 5.2_

  - [x] 5.3 Create BottomNavigation component

    - Extract bottom navigation from transit-app.jsx
    - Implement navigation items and authentication checks
    - _Requirements: 5.3, 5.4_

  - [ ]\* 5.4 Write property test for BottomNavigation

    - **Property 10: Navigation Item Interaction**
    - **Validates: Requirements 5.4**

  - [x] 5.5 Create Layout component

    - Compose Header, content area, and BottomNavigation
    - Handle responsive design and safe areas
    - MVP Mode Enforcer
    - not unit test
    - _Requirements: 5.5, //5.6_

  - [ ]\* 5.6 Write property test for Layout composition
    - **Property 9: Layout Composition**
    - **Validates: Requirements 5.5**

- [ ] 6. Implement screen components

  - [x] 6.1 Create ProfileScreen component

    - Extract profile screen logic from transit-app.jsx
    - Integrate with useProfile hook
    - MVP Mode Enforcer
    - not unit test
    - _Requirements: 1.1_

  - [x] 6.2 Create DocumentsScreen component

    - Extract documents screen logic from transit-app.jsx
    - Maintain existing Documents component integration
    - MVP Mode Enforcer
    - not unit test
    - _Requirements: 1.2_

  - [x] 6.3 Create NewsScreen component

    - Extract news screen logic from transit-app.jsx
    - Maintain existing News component integration
    - MVP Mode Enforcer
    - not unit test
    - _Requirements: 1.3_

  - [x] 6.4 Create RegulationsScreen component

    - Extract regulations screen logic from transit-app.jsx
    - Maintain existing RegulationsMain component integration
    - MVP Mode Enforcer
    - not unit test
    - _Requirements: 1.4_

  - [ ] 6.5 Create GlossaryScreen component

    - Extract glossary screen logic from transit-app.jsx
    - Maintain existing GlossaryMain component integration
    - MVP Mode Enforcer
    - not unit test
    - _Requirements: 1.5_

  - [ ] 6.6 Create QuizScreen component

    - Extract quiz screen logic from transit-app.jsx
    - Maintain existing Quiz component integration
    - MVP Mode Enforcer
    - not unit test
    - _Requirements: 1.6_

  - [ ] 6.7 Create PQRScreen component

    - Extract PQR screen logic from transit-app.jsx
    - Maintain existing PqrMain component integration
    - MVP Mode Enforcer
    - not unit test
    - _Requirements: 1.7_

  - [ ] 6.8 Create AIAssistScreen component

    - Extract AI assist screen logic from transit-app.jsx
    - Maintain existing AiAssist component integration
    - MVP Mode Enforcer
    - not unit test
    - _Requirements: 1.8_

  - [ ]\* 6.9 Write property test for screen navigation
    - **Property 1: Screen Navigation Consistency**
    - **Validates: Requirements 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 1.8**

- [ ] 7. Implement MainApp component

  - [ ] 7.1 Create new MainApp component

    - Implement as layout orchestrator (under 150 lines)
    - Integrate all hooks and delegate screen rendering
    - MVP Mode Enforcer
    - not unit test
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.6_

  - [ ]\* 7.2 Write property test for component delegation

    - **Property 8: Component Delegation**
    - **Validates: Requirements 4.3, 4.6**

  - [ ]\* 7.3 Write unit test for MainApp structure
    - Test that MainApp acts only as layout container
    - Verify line count constraint (under 150 lines)
    - _Requirements: 4.1, 4.4_

- [ ] 8. Checkpoint - Ensure component integration tests pass

  - Ensure all tests pass, ask the user if questions arise.

- [ ] 9. Implement state persistence

  - [ ] 9.1 Add localStorage persistence to Zustand store

    - Implement persistence for critical state (user, navigation)
    - Handle localStorage unavailability gracefully
    - MVP Mode Enforcer
    - not unit test
    - _Requirements: 2.5, 2.6_

  - [ ]\* 9.2 Write property test for state persistence
    - **Property 3: State Persistence Round Trip**
    - **Validates: Requirements 2.5, 2.6**

- [ ] 10. Migration and integration

  - [ ] 10.1 Update main app entry point

    - Replace old transit-app.jsx with new MainApp
    - Ensure all imports and exports are correct
    - MVP Mode Enforcer
    - not unit test
    - _Requirements: 7.1, 7.2, 7.3, 7.4_

  - [ ] 10.2 Handle URL parameters and deep linking

    - Migrate existing URL parameter handling
    - Ensure screen query parameters work correctly
    - MVP Mode Enforcer
    - not unit test
    - _Requirements: 7.2_

  - [ ]\* 10.3 Write integration tests for functionality preservation
    - **Property 14: Functionality Preservation**
    - **Validates: Requirements 7.1, 7.2, 7.3, 7.4**

- [ ] 11. Service encapsulation validation

  - [ ]\* 11.1 Write property test for service encapsulation
    - **Property 11: Service Encapsulation**
    - **Validates: Requirements 6.1, 6.3, 6.5**

- [ ] 12. Final checkpoint - Ensure all tests pass and functionality is preserved
  - Run complete test suite including property-based tests
  - Verify all existing functionality works identically
  - Check bundle size and performance metrics
  - Ensure all tests pass, ask the user if questions arise.
  - MVP Mode Enforcer
    - not unit test

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Property tests validate universal correctness properties with minimum 100 iterations
- Unit tests validate specific examples and edge cases
- Integration tests ensure end-to-end functionality preservation
- Checkpoints ensure incremental validation throughout the process
