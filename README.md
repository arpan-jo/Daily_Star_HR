# PeopleDesk - React Native Application

PeopleDesk is an enterprise-grade mobile application bootstrapped using the React Native CLI with TypeScript, MobX-State-Tree (MST), and React Native Paper.

---

## 1. Project Directory Structure

All application source code lives inside the `src/` folder, organized by architectural layers:

*   **`src/assets/`**: Static media assets, images, and custom fonts.
*   **`src/auth/`**: Authentication workflows (Login, Loader, Registration, Pin Verification, Password Recovery).
*   **`src/common/`**:
    *   `components/`: Reusable, core UI components (Input, Dropdowns, DatePickers, Buttons, Layout Wrappers).
    *   `api/`: API-related configurations (e.g. bypass encryption rules).
    *   `constant/`: Styling tokens (`Themes.ts`), images mapping, and constants.
*   **`src/hooks/`**: Custom React hooks (e.g. `useIsDarkTheme.ts`, `useSBUSetup.ts`).
*   **`src/interfaces/` & `src/types/`**: Strict TypeScript declarations grouped by feature domain.
*   **`src/modules/`**: Feature-specific sub-folders containing views and screens:
    *   `arl-core-modules/`: Core enterprise/ERP features.
    *   `SaaS-modules/`: SaaS/subscription-related features.
    *   `customer-registraion/` & `emp-register/`: Setup and onboarding modules.
    *   `supplier-core-modules/`: Supplier interaction portal.
*   **`src/navigations/`**: Navigation configuration:
    *   `RootStack.tsx`: Core navigator.
    *   `RootStackScreensParams.ts`: Type declarations for routes and parameters.
    *   `*Collections.tsx`: Lists of screen configurations split by module.
*   **`src/services/`**: Network service layer executing Axios endpoints.
*   **`src/stores/`**: MobX-State-Tree models (userInfo, permissionInfo, rootStore, etc.).
*   **`src/themes/`**: Visual themes (DefaultTheme / DarkTheme) wrapping React Navigation and Paper schemas.

---

## 2. Coding Guidelines & Usage

### Reusable UI Components
Always reuse the custom components defined in `src/common/components/` to maintain design consistency and avoid code bloat:
*   **Layout Wrapper**: Use `ContainerNew` from [Container.tsx](file:///home/arpan/Desktop/people-desk-app/src/common/components/Container.tsx) for scrollable/non-scrollable screens. It handles SafeArea, pull-to-refresh, keyboard offsets, and bottom button bars.
*   **Inputs**: Use `CustomInput` for standard inputs, and `CustomDropDown` for select fields.
*   **Pickers**: Use `CustomDatePicker` and `CustomTimePicker`.
*   **Grid layout**: Combine `Row` and `Column` wrappers.

### State Management (MobX-State-Tree)
*   **Location**: All stores must go under `src/stores/`.
*   **Registration**: Register any new store under `RootStore` in [rootStore.ts](file:///home/arpan/Desktop/people-desk-app/src/stores/rootStore.ts).
*   **State mutations**: Never mutate the store state directly from components. All state modifications must happen inside `.actions(self => ({ ... }))` blocks within the store model.
*   **Storage**: MMKV is integrated for fast, persistent state storage.

### Navigation & Routing
*   Define parameters and route names inside [RootStackScreensParams.ts](file:///home/arpan/Desktop/people-desk-app/src/navigations/RootStackScreensParams.ts) for strict type safety.
*   Group screens inside the corresponding stack array in navigation collection files (e.g. `ArlScreenCollections.tsx`) and link them through `RootStack.tsx`.

---

## 3. Network & API Calling

The project uses `axios` for network calls with built-in global interceptors configured in `App.tsx`.

### Interceptor Encryption Flow
*   **Requests**: Data payloads and query parameters are encrypted dynamically on request interceptors using AES encryption.
*   **Responses**: Payload responses are decrypted automatically before passing them back to calling methods.

### Bypassing Encryption
If an endpoint requires uploading files, downloading files, or communicating with third-party endpoints where encryption should not occur:
*   Add the endpoint path pattern string or reference variable to the `withoutEncryptionApi` array in [withoutEncrytApi.ts](file:///home/arpan/Desktop/people-desk-app/src/common/api/withoutEncrytApi.ts).

Example service implementation:
```typescript
import axios from 'axios';

export const fetchPendingTasksApi = async (employeeId: number) => {
  try {
    const res = await axios.get(`/Task/GetPendingTasks?employeeId=${employeeId}`);
    if (res?.status === 200) {
      return res?.data;
    }
  } catch (error) {
    return error?.response?.data;
  }
};
```

---

## 4. Commands Reference

*   **Start Metro Bundler**: `yarn start` or `npm start`
*   **Run Android**: `yarn android`
*   **Run iOS**: `yarn ios`
*   **Install iOS Pods**: `yarn pod`
*   **Run Linter**: `yarn lint`
*   **Run Tests**: `yarn test`
*   **Clean Build Cache**:
    *   Android: `yarn android:clean`
    *   iOS: `yarn ios:clean`

---

## 5. AI-Assisted Development

This workspace is customized for AI coding agents (such as Antigravity, Claude Code, Cursor, Aider, and Windsurf) to ensure high speed, lower token utilization, strict type/null-safety, and minimal code duplication.

### Workspace Customization Files

The configuration files located in the `.agents/` directory automatically direct agent behaviors:

1.  **Project Rules ([AGENTS.md](file:///home/arpan/Desktop/people-desk-app/.agents/AGENTS.md))**:
    *   **Auto-Loaded:** Automatically loaded by agents when they launch a workspace session.
    *   **Component Constraint:** Restricts the agent to importing and reusing components from `src/common/components/` (like `ContainerNew`, `CustomInput`, `CustomDropDown`, `CustomButton`, etc.) rather than writing duplicate layouts or using generic libraries.
    *   **Architecture Enforcement:** Requires state changes to be inside MST `.actions()` blocks (registered in `rootStore.ts`) and route names registered in `RootStackScreensParams.ts`.

2.  **Modular Development Skill ([efficient-dev/SKILL.md](file:///home/arpan/Desktop/people-desk-app/.agents/skills/efficient-dev/SKILL.md))**:
    *   **Triggers:** Automatically active when developer prompts ask to write, refactor, edit, or test code.
    *   **Token Optimization:** Directs agents to use specific line ranges (e.g. `view_file` StartLine/EndLine) and `grep_search` to gather context rather than reading whole files.
    *   **Accuracy:** Forces strict TypeScript types (no implicit `any`) and rigorous null safety (e.g. system-wide usage of optional chaining `?.` and fallback operators `??`).

3.  **Lazy Mode Skill ([ponytail/SKILL.md](file:///home/arpan/Desktop/people-desk-app/.agents/skills/ponytail/SKILL.md))**:
    *   **Triggers:** Active on developer requests using keywords like `ponytail`, `lazy`, `minimal`, `yagni`, or `do less`.
    *   **The Ladder of Laziness:** Instructs the agent to find the simplest possible path:
        1.  *Does this need to exist at all?* (YAGNI/Skip).
        2.  *Can we reuse code already in the codebase?*
        3.  *Can standard JavaScript/TypeScript libraries do it?*
        4.  *Can native platform features cover it?*
        5.  *Can an already-installed package handle it?*
        6.  *Can it be written in one line?*
        7.  *Only then write minimum code.*
    *   **Root Cause Fixing:** Instructs the agent to grep all callers of a function before fixing a bug, applying one fix in a shared parent method instead of duplicate guards across separate files.

### Effective Prompting Examples

To get the most accurate, token-efficient, and bug-free code from AI agents, use specific prompts:

*   **For Feature Development:**
    > *"Create a visiting card viewer screen under `src/modules/arl-core-modules/shared/` reusing `CustomVisitingCard` and wrapping it inside `ContainerNew`. Make sure route parameters are added to `RootStackScreensParams` and the screen is declared in `arlCoreStack`."*
*   **For Store Modifications:**
    > *"Add a boolean field `isLocationTrackingActive` to `trackOnOrOff.ts` store. Create an action to toggle its state, registered inside rootStore. Verify it hydates correctly."*
*   **For APIs:**
    > *"Create an API function in `src/services/arl-core-modules/crm.ts` that gets leads list by date. Since it connects to a external endpoint, make sure to add it to the bypass list in `withoutEncrytApi.ts`."*
*   **For Lazy Mode:**
    > *"Refactor the search header layout in `SearchHeader.tsx`. Be lazy, use ponytail mode to write minimal changes."*

# Daily_Star_HR
