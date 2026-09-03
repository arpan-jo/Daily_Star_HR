/**
 * Single entry point for Firebase Analytics + Crashlytics.
 *
 * Nothing outside this folder should import `@react-native-firebase/analytics`
 * or `@react-native-firebase/crashlytics` directly. Keeping the surface here
 * means collection can be turned off, renamed or swapped in one place.
 *
 * PII rule for anything added later: PeopleDesk holds employee records, so no
 * name, email, phone, address, salary or free-text a user typed may be sent to
 * Firebase. Opaque numeric identifiers only.
 */
import {
  getAnalytics,
  logEvent,
  setAnalyticsCollectionEnabled,
} from '@react-native-firebase/analytics';
import {
  getCrashlytics,
  log as crashlyticsLog,
  setCrashlyticsCollectionEnabled,
} from '@react-native-firebase/crashlytics';

/**
 * Debug builds are excluded by default: every redbox and hot-reload error would
 * otherwise land in Crashlytics as a fatal and skew the crash-free-users rate.
 *
 * Flip this to `true` to verify Analytics on a debug build — a JS reload is
 * enough, and `adb shell setprop debug.firebase.analytics.app <applicationId>`
 * makes events show up in the console's DebugView.
 *
 * Crashlytics needs a second switch. Native code gates it independently:
 *
 *   if (BuildConfig.DEBUG && !firebase.json.crashlytics_debug_enabled) -> off
 *
 * That check re-runs on every read, so a debug build ignores whatever this file
 * asks for. Testing Crashlytics locally therefore means setting
 * `crashlytics_debug_enabled: true` in firebase.json *and* rebuilding, since
 * firebase.json is baked into Android resources at build time. Release builds
 * need neither flag.
 */
const ENABLE_IN_DEV = false;

const collectionEnabled = !__DEV__ || ENABLE_IN_DEV;

/** Firebase silently drops events whose name breaks its naming rules. */
const MAX_NAME_LENGTH = 40;

/**
 * Firebase requires names to start with a letter and contain only letters,
 * digits and underscores. Route names like `Leave/NewApproval` or
 * `leave-details` would be rejected, so normalise instead of losing the event.
 */
function toValidName(raw: string): string {
  const cleaned = raw
    .trim()
    .replace(/[^a-zA-Z0-9_]/g, '_')
    .replace(/_{2,}/g, '_')
    .replace(/^_+/, '');
  const safe = /^[a-zA-Z]/.test(cleaned) ? cleaned : `screen_${cleaned}`;
  return safe.slice(0, MAX_NAME_LENGTH);
}

/**
 * Telemetry must never be the reason a screen fails to render, so every call
 * goes through here: a missing native module, a Firebase init failure or a
 * rejected promise is swallowed and only surfaced while developing.
 */
function safely(operation: string, run: () => Promise<unknown> | void): void {
  if (!collectionEnabled) {
    return;
  }
  const warn = (error: unknown) => {
    if (__DEV__) {
      console.warn(`[telemetry] ${operation} failed`, error);
    }
  };

  try {
    const result = run();
    // Duck-typed rather than `instanceof Promise`: a thenable from another
    // realm or a polyfill would fail the instanceof check and its rejection
    // would escape as an unhandled promise rejection.
    if (typeof (result as PromiseLike<unknown> | undefined)?.then === 'function') {
      Promise.resolve(result).catch(warn);
    }
  } catch (error) {
    warn(error);
  }
}

/**
 * Must run once at startup, before the app can throw.
 *
 * Touching `getCrashlytics()` is what installs Crashlytics' global JS error and
 * unhandled-promise-rejection handlers — they are registered lazily on first
 * use of the module, not on import. Until this runs, JS crashes are not
 * reported at all.
 *
 * Crashlytics chains to whichever global handler was already installed, so the
 * existing `ErrorUtils` handler in App.tsx keeps working and errors are not
 * reported twice.
 */
export function initTelemetry(): void {
  if (!collectionEnabled) {
    // Returning before `getCrashlytics()` is the point, not an optimisation:
    // never touching the module is what keeps its global handler uninstalled,
    // so debug redboxes stay out of the crash-free-users rate.
    return;
  }

  safely('initTelemetry:crashlytics', () =>
    setCrashlyticsCollectionEnabled(getCrashlytics(), true),
  );
  safely('initTelemetry:analytics', () =>
    setAnalyticsCollectionEnabled(getAnalytics(), true),
  );
}

/**
 * Wired to React Navigation, so `screenName` is a route name. Also written to
 * the Crashlytics log, which becomes the breadcrumb trail shown above a stack
 * trace — usually the fastest way to see what the user was doing.
 *
 * Logged as a raw `screen_view` event rather than through `logScreenView()`:
 * the latter is a deprecated helper that prints a warning on every navigation.
 */
export function logScreen(screenName?: string | null): void {
  if (!screenName) {
    return;
  }
  const name = toValidName(screenName);
  if (!name) {
    return;
  }

  safely('logScreen', () =>
    logEvent(getAnalytics(), 'screen_view', {
      screen_name: name,
      screen_class: name,
    }),
  );

  safely('logScreen:breadcrumb', () =>
    crashlyticsLog(getCrashlytics(), `screen: ${screenName}`),
  );
}
