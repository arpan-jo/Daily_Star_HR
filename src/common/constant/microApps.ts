import {BRIDGE_ACTIONS, type BridgeAction} from '../webView/microAppBridge';
import {isDarkColor} from '../services/getColor';
import {mmkv} from '../../stores/rootStore';
import {COLORS} from './Themes';

export interface MicroApp {
  id: string;
  title: string;
  /**
   * 'web' (default) loads `url` in the WebView. 'native' mounts a JS module
   * instead — today a lazy local import, and the seam a federated remote
   * (Federation.loadRemote) drops into once the host moves to Re.Pack.
   */
  kind?: 'web' | 'native';
  /**
   * Required for kind 'web'. Must be https. Its host is the security origin —
   * the bridge only answers this host.
   */
  url?: string;
  /**
   * A whole HTML document, rendered instead of `url`. Used by generated apps,
   * which have nowhere to be hosted. A page loaded this way has no origin, so
   * the bridge can never authorize it — see isMessageAuthorized.
   */
  html?: string;
  /**
   * The source the page was assembled from, keyed by path — several files and
   * folders are normal. Kept so an edit patches the source the model wrote
   * rather than the inlined result.
   */
  files?: Record<string, string>;
  /** Which model produced this app. */
  provider?: string;
  /**
   * What has been asked of this app so far, oldest first — the original prompt
   * then each edit. Sent back on the next edit so a follow-up reads against
   * what was last requested rather than the original app.
   */
  prompts?: string[];
  /**
   * Extra hosts of the same product (subdomains, auth) that stay inside the
   * WebView instead of opening in the system browser. Navigation only — the
   * bridge still answers `url`'s host and nothing else.
   */
  allowedHosts?: string[];
  /**
   * Optional override for the header/status-bar color. Normally left unset —
   * the color is read from the page itself. Set it only when a site's own
   * chrome cannot be detected or detects wrongly.
   */
  themeColor?: string;
  /** Least privilege: only these bridge actions are answered for this app. */
  allowedActions: BridgeAction[];
  /** Native routes this app may navigate() to. Required if 'navigate' is allowed. */
  allowedRoutes?: string[];
}

/** Set to your machine's LAN IP to use the harness in scratch/microapp-test/. */
const DEV_HOST = 'http://172.17.7.54:8000';

export const MICRO_APPS: MicroApp[] = [
  {
    id: 'todo',
    title: 'Todo',
    kind: 'native',
    // Runs in-process, so the bridge is irrelevant: a native micro-app imports
    // what it needs directly and the allow-list cannot constrain it.
    allowedActions: [],
  },
  {
    id: 'nextjobz',
    title: 'NextJobz',
    url: 'https://nextjobz.com.bd/',
    allowedHosts: ['employers.nextjobz.com.bd', 'blog.nextjobz.com.bd'],
    // Google refuses OAuth in an embedded WebView, so the site's own button
    // cannot work here — it calls PeopleDesk.googleSignIn() instead.
    allowedActions: ['googleSignIn'],
  },
  {
    id: 'managerium',
    title: 'Managerium',
    url: 'https://mgm.ibos.io/',
    // Plain hosted site — it does not call the bridge, so it gets nothing.
    allowedActions: [],
  },
  // Dev-only bridge harness, stripped from release builds.
  ...(__DEV__
    ? [
        {
          id: 'bridgetest',
          title: 'Bridge Test',
          url: DEV_HOST,
          allowedActions: [...BRIDGE_ACTIONS],
          allowedRoutes: ['AllApplicationFromDash'],
        } as MicroApp,
      ]
    : []),
];

/**
 * Apps generated from a prompt. They live server-side; the device only
 * remembers which ones it has added, so the list survives a restart.
 * ponytail: per-device list in MMKV. Move to the catalog endpoint once
 * generated apps need to follow the user across devices.
 */
const GENERATED_KEY = 'microapp.generated.v1';

export const loadGeneratedApps = (): MicroApp[] => {
  try {
    const parsed = JSON.parse(mmkv.getString(GENERATED_KEY) || '[]');
    return Array.isArray(parsed)
      ? parsed.filter(a => a?.id && (a?.html || a?.url))
      : [];
  } catch {
    return [];
  }
};

export const saveGeneratedApp = (app: MicroApp) => {
  const next = [app, ...loadGeneratedApps().filter(a => a.id !== app.id)];
  mmkv.set(GENERATED_KEY, JSON.stringify(next));
  return next;
};

export const removeGeneratedApp = (id: string) => {
  const next = loadGeneratedApps().filter(a => a.id !== id);
  mmkv.set(GENERATED_KEY, JSON.stringify(next));
  // Take the app's own data with it — see storageKey() in the SDK. Leaving it
  // behind means a deleted app's entries sit in storage forever.
  const prefix = `microapp.${id}.`;
  mmkv.getAllKeys().forEach(key => {
    if (key.startsWith(prefix)) {
      mmkv.remove(key);
    }
  });
  return next;
};

/**
 * Generated apps live only on this device, so they are the ones the user may
 * delete. Registry apps would come back on the next launch.
 */
export const isGenerated = (app?: MicroApp | null) => !!app?.html;

export const allMicroApps = (): MicroApp[] => [
  ...MICRO_APPS,
  ...loadGeneratedApps(),
];

export const getMicroApp = (id: string) =>
  allMicroApps().find(a => a.id === id);

/**
 * Colors detected from each app's own chrome, keyed by app id. Populated by the
 * readiness probe so a second visit is themed from the first frame.
 * ponytail: in-memory only, so it resets on app restart. Persist to MMKV if the
 * first-launch color pop becomes annoying.
 */
export const themeCache = new Map<string, string>();

/**
 * Header/status-bar color for an app: explicit override first, then whatever
 * was detected from the page. Falls back to the app primary when neither is
 * set or the color would leave the header's white text unreadable.
 */
export const headerColorOf = (
  app?: MicroApp | null,
  detected?: string,
): string =>
  [app?.themeColor, detected, app ? themeCache.get(app.id) : undefined].find(
    isDarkColor,
  ) || COLORS.primary;
