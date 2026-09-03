# PeopleDesk Project Guidelines

## Command Reference

### Build and Run
- **Start Metro Bundler:** `yarn start` or `npm start`
- **Run Android:** `yarn android` or `npm run android`
- **Run iOS:** `yarn ios` or `npm run ios`
- **Install iOS Pods:** `yarn pod` or `cd ios && pod install && cd ..`

### Verification & Testing
- **Run Tests:** `yarn test` or `npm test`
- **Run Linter:** `yarn lint` or `npm run lint`

### Clean & Rebuild
- **Clean Android:** `yarn android:clean` or `cd android && ./gradlew clean && cd ..`
- **Clean iOS:** `yarn ios:clean` or `cd ios && rm -rf Pods Podfile.lock build ~/Library/Developer/Xcode/DerivedData && cd ..`
- **Build Release APK:** `yarn build:apk`

---

## Coding Guidelines

### Technology Stack & Architecture
- **Framework:** React Native (v0.84.0) with TypeScript.
- **State Management:** MobX, MobX-State-Tree, mobx-react-lite, mst-persistent-store.
- **Styling:** React Native standard StyleSheet or styled-components (avoid tailwind unless requested). Use responsive design via `react-native-size-matters` or similar if appropriate.
- **Routing:** React Navigation (drawer, native-stack, material-bottom-tabs).

### Code Style & Formatting
- **TypeScript:** Use strong typing. Avoid using `any` whenever possible.
- **Formatting:** Prettier (rules configured in `.prettierrc.js`) and ESLint (`.eslintrc.js`).
- **Components:** Functional components with React hooks.
- **Files & Naming:** Use clear, descriptive names. TypeScript files should end in `.ts` or `.tsx`.
- **Imports:** Group absolute imports or packages first, followed by relative local imports.
