/**
 * Bridge protocol between a micro-app WebView and native.
 *
 * Web -> native:  window.ReactNativeWebView.postMessage(JSON.stringify({id, action, payload}))
 * Native -> web:  window.__pdResolve(id, result)
 *
 * The two exported functions below are pure so the trust boundary is testable
 * without a device — see __tests__/microAppBridge.test.ts.
 */
import type {MicroApp} from '../constant/microApps';

export const BRIDGE_ACTIONS = [
  'close',
  'toast',
  'getUser',
  'pickImage',
  'pickFile',
  'navigate',
  'download',
  'share',
  'haptic',
  'googleSignIn',
] as const;

export type BridgeAction = (typeof BRIDGE_ACTIONS)[number];

export interface BridgeMessage {
  id: string;
  action: BridgeAction;
  payload?: Record<string, any>;
}

/** Every bridge call settles with this — never a rejected promise. */
export type BridgeResult = {ok: true; data?: any} | {ok: false; error: string};

const isAction = (value: unknown): value is BridgeAction =>
  BRIDGE_ACTIONS.includes(value as BridgeAction);

/** Host of a URL, or null if it is not a parseable absolute http(s) URL. */
export const hostOf = (url: string | undefined | null): string | null => {
  if (!url || typeof url !== 'string') {
    return null;
  }
  // URL is available in Hermes and in jest's node env; RN polyfills it too.
  try {
    const {protocol, host} = new URL(url);
    if (protocol !== 'http:' && protocol !== 'https:') {
      return null;
    }
    return host.toLowerCase() || null;
  } catch {
    return null;
  }
};

/** Origin (scheme + host) of a URL, or null if it is not http(s). */
export const originOf = (url: string | undefined | null): string | null => {
  if (!hostOf(url)) {
    return null;
  }
  const {protocol, host} = new URL(url as string);
  return `${protocol}//${host.toLowerCase()}`;
};

/**
 * Parse a raw postMessage string. Returns null for anything that is not a
 * well-formed bridge message — the caller drops those without dispatching.
 */
export const parseBridgeMessage = (raw: unknown): BridgeMessage | null => {
  if (typeof raw !== 'string') {
    return null;
  }
  let parsed: any;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return null;
  }
  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
    return null;
  }
  if (typeof parsed.id !== 'string' || !parsed.id) {
    return null;
  }
  if (!isAction(parsed.action)) {
    return null;
  }
  const payload =
    parsed.payload && typeof parsed.payload === 'object' && !Array.isArray(parsed.payload)
      ? parsed.payload
      : undefined;
  return {id: parsed.id, action: parsed.action, payload};
};

/**
 * Authorize a message before dispatching it to native.
 *
 * `currentUrl` is the WebView's live URL (from onNavigationStateChange), NOT the
 * registered url — a redirect or an injected iframe must not inherit the app's
 * native privileges.
 */
export const isMessageAuthorized = (
  msg: BridgeMessage,
  app: MicroApp,
  currentUrl: string | undefined | null,
): boolean => {
  const registeredHost = hostOf(app?.url);
  if (!registeredHost || hostOf(currentUrl) !== registeredHost) {
    return false;
  }
  if (!app.allowedActions?.includes(msg.action)) {
    return false;
  }
  if (msg.action === 'navigate') {
    const screen = msg.payload?.screen;
    if (typeof screen !== 'string' || !app.allowedRoutes?.includes(screen)) {
      return false;
    }
  }
  return true;
};

/** Injected before page load. Defines the promise API the web app calls. */
export const BRIDGE_SDK = `
(function () {
  if (window.PeopleDesk) { return; }
  var pending = {};
  var seq = 0;

  window.__pdResolve = function (id, result) {
    var resolve = pending[id];
    if (!resolve) { return; }
    delete pending[id];
    resolve(result);
  };

  function call(action, payload) {
    return new Promise(function (resolve) {
      var id = 'pd_' + (++seq);
      pending[id] = resolve;
      window.ReactNativeWebView.postMessage(
        JSON.stringify({ id: id, action: action, payload: payload || {} })
      );
    });
  }

  window.PeopleDesk = {
    close: function () { return call('close'); },
    toast: function (message, type) { return call('toast', { message: message, type: type }); },
    getUser: function () { return call('getUser'); },
    pickImage: function (source) { return call('pickImage', { source: source }); },
    pickFile: function (type) { return call('pickFile', { type: type }); },
    navigate: function (screen, params) { return call('navigate', { screen: screen, params: params }); },
    download: function (url, filename) { return call('download', { url: url, filename: filename }); },
    share: function (options) { return call('share', options); },
    haptic: function () { return call('haptic'); },
    // Google blocks OAuth inside embedded WebViews, so the page cannot run the
    // web flow here. This runs Google's native sheet and hands back an
    // idToken for the site's server to verify and exchange for its session.
    googleSignIn: function () { return call('googleSignIn'); },
  };

  window.dispatchEvent(new Event('peopledeskready'));
})();
true;
`;

/**
 * Prefix the readiness probe posts, followed by the detected theme color (or
 * nothing). Deliberately not a BridgeAction — it carries no privilege, it only
 * reports that the page painted and what color its chrome is.
 */
export const READY_PREFIX = '__pd_ready:';

/** Parses a readiness ping. Returns null if `raw` is not one. */
export const parseReadyMessage = (
  raw: unknown,
): {color?: string} | null => {
  if (typeof raw !== 'string' || !raw.startsWith(READY_PREFIX)) {
    return null;
  }
  const color = raw.slice(READY_PREFIX.length).trim();
  return {color: color || undefined};
};

/**
 * Injected after document load. WebView loading state clears when the document
 * finishes, but an SPA has not painted yet at that point — so we watch for the
 * app root to actually render and report that instead.
 */
export const READY_PROBE = `
(function () {
  var root = document.getElementById('root')
    || document.getElementById('__next')
    || document.body;
  var done = false;
  var observer;

  // rgb()/rgba() -> #rrggbb. Anything see-through is not a chrome color.
  function toHex(value) {
    if (!value) { return ''; }
    if (value.charAt(0) === '#') {
      // Normalise #abc so the saturation check always sees 6 digits.
      return value.length === 4
        ? '#' + value.slice(1).replace(/./g, function (d) { return d + d; })
        : value;
    }
    var m = /^rgba?\\((\\d+),\\s*(\\d+),\\s*(\\d+)(?:,\\s*([\\d.]+))?\\)/.exec(value);
    if (!m) { return ''; }
    if (m[4] !== undefined && parseFloat(m[4]) < 0.9) { return ''; }
    return '#' + [m[1], m[2], m[3]].map(function (n) {
      return ('0' + parseInt(n, 10).toString(16)).slice(-2);
    }).join('');
  }

  // A brand color is saturated AND mid-toned. Both halves matter: channel
  // spread alone accepts pale tints like #d1eaff (a sidebar wash, not a
  // brand), and lightness alone accepts grey. Rejects black/white/grey text
  // and the near-white chrome most sites actually use.
  function isVivid(hex) {
    var m = /^#([0-9a-f]{6})$/i.exec(hex || '');
    if (!m) { return false; }
    var n = parseInt(m[1], 16);
    var max = Math.max((n >> 16) & 255, (n >> 8) & 255, n & 255) / 255;
    var min = Math.min((n >> 16) & 255, (n >> 8) & 255, n & 255) / 255;
    var lightness = (max + min) / 2;
    if (lightness > 0.7 || lightness < 0.12) { return false; }
    var denom = 1 - Math.abs(2 * lightness - 1);
    var saturation = denom === 0 ? 0 : (max - min) / denom;
    return saturation > 0.25;
  }

  function fromVar(name) {
    var raw = window.getComputedStyle(document.documentElement)
      .getPropertyValue(name);
    return toHex((raw || '').replace('!important', '').trim());
  }

  function detectThemeColor() {
    var i, hex;

    // 1. Declared brand tokens. Most reliable when present: a site that names
    //    a primary color means it.
    var vars = [
      '--primary-color', '--color-primary', '--primary', '--brand-color',
      '--brand', '--theme-color', '--accent-color',
      '--mui-palette-primary-main', '--ion-color-primary', '--bs-primary',
    ];
    for (i = 0; i < vars.length; i++) {
      hex = fromVar(vars[i]);
      if (isVivid(hex)) { return hex; }
    }

    // 2. The web standard, when it is not framework boilerplate. CRA ships
    //    #000000 and many templates ship #ffffff — neither is a brand color.
    var meta = document.querySelector('meta[name="theme-color"]');
    hex = toHex(((meta && meta.getAttribute('content')) || '').trim());
    if (isVivid(hex)) { return hex; }

    // 3. What the page paints on its own primary controls. Checked as both
    //    background and foreground: filled buttons carry the brand as a
    //    background, outlined ones and links carry it as text.
    var probes = [
      ['.btn-primary', 'backgroundColor'],
      ['.MuiButton-containedPrimary', 'backgroundColor'],
      ['.ant-btn-primary', 'backgroundColor'],
      ['button[type="submit"]', 'backgroundColor'],
      ['header', 'backgroundColor'],
      ['.navbar', 'backgroundColor'],
      ['.MuiAppBar-root', 'backgroundColor'],
      ['.MuiButton-outlinedPrimary', 'color'],
      ['.nav-link.active', 'color'],
      ['a.active', 'color'],
      ['.MuiButton-root', 'color'],
      ['a', 'color'],
    ];
    for (i = 0; i < probes.length; i++) {
      var el = document.querySelector(probes[i][0]);
      if (!el) { continue; }
      hex = toHex(window.getComputedStyle(el)[probes[i][1]]);
      if (isVivid(hex)) { return hex; }
    }
    return '';
  }

  function finish() {
    if (done) { return; }
    done = true;
    if (observer) { observer.disconnect(); }
    var color = '';
    try { color = detectThemeColor(); } catch (e) {}
    window.ReactNativeWebView.postMessage(${JSON.stringify(READY_PREFIX)} + color);
  }

  function check() {
    if (done || !root) { return; }
    if (root.children.length > 0 && root.getBoundingClientRect().height > 0) {
      // One more frame so the paint lands before the overlay lifts.
      requestAnimationFrame(function () { requestAnimationFrame(finish); });
    }
  }

  observer = new MutationObserver(check);
  observer.observe(document.documentElement, { childList: true, subtree: true });
  check();
  // Never strand the overlay on a page that renders in a way we cannot see.
  setTimeout(finish, 10000);
})();
true;
`;

/** JS to inject back into the page to settle one call. */
export const resolveScript = (id: string, result: BridgeResult): string =>
  `window.__pdResolve(${JSON.stringify(id)}, ${JSON.stringify(result)}); true;`;
