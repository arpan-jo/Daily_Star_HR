# Workspace Rules: PeopleDesk (with Ponytail Lazy senior dev mode)

These rules guide coding agents to work accurately, quickly, with minimal token usage, and using the laziest senior developer style. All modifications must align with the existing project structure and design patterns.

## 1. Directory Structure Reference
When adding or modifying code, always place files under the correct directory:
- **Assets:** `src/assets/` (images, fonts, static resources).
- **Authentication:** `src/auth/` (Login, Loader, Pin verification, password recovery views).
- **Shared Helpers & Constants:** `src/common/` (custom components like Toast, encryption helpers, and general constants).
- **Custom React Hooks:** `src/hooks/` (e.g. `useIsDarkTheme`).
- **Interfaces & TypeScript Types:** `src/interfaces/` and `src/types/`.
- **Feature Modules:** `src/modules/` (contains sub-folders for SaaS-modules, arl-core-modules, customer-registraion, emp-register, supplier-core-modules).
- **Navigation:** `src/navigations/` (RootStack, drawers, custom tab bars, and screen collection definitions).
- **Services (APIs):** `src/services/` (all API functions using Axios).
- **State Stores:** `src/stores/` (MobX-State-Tree stores).
- **Themes:** `src/themes/` (DefaultTheme and DarkTheme wrapping React Native Paper and React Navigation themes).

---

## 2. Technical Stack Constraints & Architecture

### Reusing Existing UI Components (Mandatory)
Before writing any UI layout, inputs, or controls, you must reuse the components defined in `src/common/components/`:
- **Layouts:** Use `ContainerNew` from [Container.tsx](file:///home/arpan/Desktop/people-desk-app/src/common/components/Container.tsx) (for standard scrollable/non-scrollable screens, keyboard awareness, loading states, float/footer buttons). Use `Row` from [Row.tsx](file:///home/arpan/Desktop/people-desk-app/src/common/components/Row.tsx) and `Column` from [Column.tsx](file:///home/arpan/Desktop/people-desk-app/src/common/components/Column.tsx) for layout organization.
- **Inputs:** Use `CustomInput` from [CustomInput.tsx](file:///home/arpan/Desktop/people-desk-app/src/common/components/CustomInput.tsx).
- **Dropdowns:** Use `CustomDropDown` from [CustomDropDown.tsx](file:///home/arpan/Desktop/people-desk-app/src/common/components/CustomDropDown.tsx).
- **Buttons:** Use `CustomButton` from [CustomButton.tsx](file:///home/arpan/Desktop/people-desk-app/src/common/components/CustomButton.tsx).
- **Text:** Use `CustomText` from [CustomText.tsx](file:///home/arpan/Desktop/people-desk-app/src/common/components/CustomText.tsx) to align with default fonts/sizes.
- **Pickers:** Use `CustomDatePicker` from [CustomDatePicker.tsx](file:///home/arpan/Desktop/people-desk-app/src/common/components/CustomDatePicker.tsx) and `CustomTimePicker` from [CustomTimePicker.tsx](file:///home/arpan/Desktop/people-desk-app/src/common/components/CustomTimePicker.tsx).
- **Modals & Toast:** Use `CustomModal` from [CustomModal.tsx](file:///home/arpan/Desktop/people-desk-app/src/common/components/CustomModal.tsx) and `CustomToast` from [CustomToast.tsx](file:///home/arpan/Desktop/people-desk-app/src/common/components/CustomToast.tsx).
- **Indicators:** Use `Loading` from [Loading.tsx](file:///home/arpan/Desktop/people-desk-app/src/common/components/Loading.tsx) and `NoData` from [NoData.tsx](file:///home/arpan/Desktop/people-desk-app/src/common/components/NoData.tsx).

### Strict Type Safety & Null Safety
- **No Implicit `any`:** Every function signature, component prop, and state value must be strongly typed.
- **Strict Null Safety:** Use optional parameter flags (`?:`) and explicit null/undefined types (e.g. `string | null | undefined`) for all nullable schemas. Use optional chaining (`?.`) and nullish coalescing (`??`) systematically rather than assuming object properties are present.
- **Interfaces Location:** Place new feature schemas under the corresponding sub-folder inside `src/interfaces/` (e.g., `src/interfaces/common/` or `src/interfaces/all-employee/`).

### State Management (MobX-State-Tree)
- **Store Location:** Always define state stores under `src/stores/`.
- **Root Store Registration:** Any new store domain must be imported and defined under `RootStore` in [rootStore.ts](file:///home/arpan/Desktop/people-desk-app/src/stores/rootStore.ts).
- **Actions Restriction:** Never mutate store state directly outside actions. Always modify state within models' `.actions()` block.
- **Persistence:** MMKV is used for persistent stores (`createMMKV` backing).

### Navigation & Routing
- **Screen Definitions:** Add new screens to the corresponding stack collections (e.g. `arlCoreStack` in [ArlScreenCollections.tsx](file:///home/arpan/Desktop/people-desk-app/src/navigations/ArlScreenCollections.tsx) or `saasModuleStack` in [SaasScreenCollections.tsx](file:///home/arpan/Desktop/people-desk-app/src/navigations/SaasScreenCollections.tsx)).
- **Params Type Safety:** Ensure any new route and its parameters are declared in [RootStackScreensParams.ts](file:///home/arpan/Desktop/people-desk-app/src/navigations/RootStackScreensParams.ts).
- **Stack Integration:** The main navigator is defined in [RootStack.tsx](file:///home/arpan/Desktop/people-desk-app/src/navigations/RootStack.tsx).

### API & Network Configuration
- **API Definition:** Keep API fetchers/endpoints under `src/services/` (e.g., `src/services/auth/login.ts`).
- **Axios Middleware:** Requests and responses are encrypted/decrypted globally via Axios interceptors defined in [App.tsx](file:///home/arpan/Desktop/people-desk-app/App.tsx).
- **Encryption Bypass:** If an API endpoint should bypass encryption, append its endpoint path pattern to the `withoutEncryptionApi` array in [withoutEncrytApi.ts](file:///home/arpan/Desktop/people-desk-app/src/common/api/withoutEncrytApi.ts).

### Styling & Theme Management
- **Styling Method:** Use standard React Native `StyleSheet` or themes from React Native Paper.
- **Theme Injection:** The app theme is observer-bound to `userColorScheme` (light/dark) in `App.tsx` utilizing [defaultTheme.ts](file:///home/arpan/Desktop/people-desk-app/src/themes/defaultTheme.ts) and [darkTheme.ts](file:///home/arpan/Desktop/people-desk-app/src/themes/darkTheme.ts).
- **Responsive Layout:** Leverage `react-native-size-matters` scaling options where appropriate.

---

## 3. Ponytail (Lazy Senior Dev Mode) Rules
Before writing any code, stop at the first rung that holds:
1. **Does this need to exist at all?** Speculative need = skip it, say so in one line. (YAGNI)
2. **Already in this codebase?** A helper, util, type, or pattern that already lives here → reuse it. Look before you write.
3. **Stdlib does it?** Use it.
4. **Native platform feature covers it?** Use native picker/input elements over complex libraries, CSS/StyleSheet over custom components.
5. **Already-installed dependency solves it?** Use it. Never add a new dependency if it can be avoided.
6. **Can it be one line?** Make it one line.
7. **Only then:** write the minimum code that works.

### Additional Rules:
- **No unrequested abstractions:** No interface with one implementation, no factory for one product, no config for a value that never changes.
- **No boilerplate:** No scaffolding "for later", later can scaffold for itself.
- **Deletion over addition:** Boring over clever, clever is what someone decodes at 3am.
- **Fewest files possible:** Shortest working diff wins.
- **Bug fix = root cause, not symptom:** Grep every caller of the function you're about to touch. Fix it in the shared/parent function rather than applying multiple symptom guards.
- **Token Efficiency:** Use line limits when reading files, and surgical content replacements rather than overwriting whole files.
