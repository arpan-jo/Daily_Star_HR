---
name: efficient-dev
description: Triggered when the user asks to develop, create, modify, refactor, debug, or test any code in this codebase.
---

# Efficient Development Skill for PeopleDesk

This skill provides step-by-step developer guidelines for context gathering, surgical edits, and rapid code validation tailored directly to the PeopleDesk codebase structure.

## Step-by-Step Development Flow

### 1. Target Identification & Minimal Context Gathering (Token Saving)
- **Do not read entire files.**
- When viewing files, always use `view_file` with specific `StartLine` and `EndLine` lines (e.g., maximum 50-100 lines at a time).
- If looking for a specific screen, query [RootStackScreensParams.ts](file:///home/arpan/Desktop/people-desk-app/src/navigations/RootStackScreensParams.ts) or search the stack arrays in `src/navigations/` using `grep_search`.
- If modifying state, use `grep_search` to find the target store model in `src/stores/` (e.g. `userInfo.ts`), and read only the definition of that model/actions via `view_file` line ranges.
- If investigating network services, check the functions defined under `src/services/`.

### 2. Surgical Modifications

#### UI Reuse Requirement
- **Do not create custom text/input/button elements.** You must import and reuse existing components from [src/common/components/](file:///home/arpan/Desktop/people-desk-app/src/common/components/):
  - `ContainerNew` from [Container.tsx](file:///home/arpan/Desktop/people-desk-app/src/common/components/Container.tsx)
  - `CustomInput` from [CustomInput.tsx](file:///home/arpan/Desktop/people-desk-app/src/common/components/CustomInput.tsx)
  - `CustomDropDown` from [CustomDropDown.tsx](file:///home/arpan/Desktop/people-desk-app/src/common/components/CustomDropDown.tsx)
  - `CustomButton` from [CustomButton.tsx](file:///home/arpan/Desktop/people-desk-app/src/common/components/CustomButton.tsx)
  - `CustomText` from [CustomText.tsx](file:///home/arpan/Desktop/people-desk-app/src/common/components/CustomText.tsx)
  - `CustomDatePicker` from [CustomDatePicker.tsx](file:///home/arpan/Desktop/people-desk-app/src/common/components/CustomDatePicker.tsx)
  - `CustomTimePicker` from [CustomTimePicker.tsx](file:///home/arpan/Desktop/people-desk-app/src/common/components/CustomTimePicker.tsx)
  - `CustomModal` from [CustomModal.tsx](file:///home/arpan/Desktop/people-desk-app/src/common/components/CustomModal.tsx)
  - `Loading` from [Loading.tsx](file:///home/arpan/Desktop/people-desk-app/src/common/components/Loading.tsx)
  - `NoData` from [NoData.tsx](file:///home/arpan/Desktop/people-desk-app/src/common/components/NoData.tsx)
  - `Row` from [Row.tsx](file:///home/arpan/Desktop/people-desk-app/src/common/components/Row.tsx) and `Column` from [Column.tsx](file:///home/arpan/Desktop/people-desk-app/src/common/components/Column.tsx)

#### Type Safety & Null Safety
- **Strong Typing:** Never use `any` for arguments or returns. Ensure every custom prop interface is declared.
- **Strict Null safety:**
  - Mark optional properties with `?:` and include `| null | undefined` explicitly where relevant.
  - Use optional chaining `?.` and fallback operators `??` or logical defaults (e.g. `const name = userInfo?.name ?? ''`).
- **Interfaces Location:** Place new feature schemas under `src/interfaces/` subdirectories.

#### MobX State Tree (MST) Rules
- Create/edit store actions strictly in the `.actions()` block of the model.
- Do not mutate properties directly from components; always invoke store actions.

#### Navigation Routing
- When adding a route, update [RootStackScreensParams.ts](file:///home/arpan/Desktop/people-desk-app/src/navigations/RootStackScreensParams.ts).
- Add screens to the appropriate collection: `ArlScreenCollections.tsx`, `SaasScreenCollections.tsx`, `SupplierScreenCollections.tsx`, or `RootStack.tsx`.

#### API & Network Interceptors
- New service integrations belong in `src/services/` subfolders.
- By default, requests are encrypted. If the API should bypass encryption, declare it in `src/common/api/withoutEncrytApi.ts`.

#### Surgical edits
- Apply updates using `replace_file_content` or `multi_replace_file_content`. Do not overwrite files.

### 3. Rapid Checks & Verification
- Verify the changes compile by running:
  ```bash
  yarn lint
  ```
- Run targeted tests using Jest to avoid executing the entire test suite if only a specific component/function changed:
  ```bash
  yarn test <filename_or_path>
  ```
