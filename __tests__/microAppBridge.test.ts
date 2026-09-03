/* eslint-disable no-script-url -- javascript: URLs here are the attack fixtures */
/* eslint-disable no-new-func -- the injected scripts are strings; running them is the test */
import type {MicroApp} from '../src/common/constant/microApps';
import {
  BRIDGE_SDK,
  READY_PROBE,
  hostOf,
  isMessageAuthorized,
  parseBridgeMessage,
  parseReadyMessage,
  READY_PREFIX,
} from '../src/common/webView/microAppBridge';

// This is the whole trust boundary for micro-apps: anything that gets past these
// two functions runs native code (camera, file picker, downloads, navigation).

describe('parseBridgeMessage', () => {
  it('accepts a well-formed message', () => {
    expect(
      parseBridgeMessage('{"id":"pd_1","action":"toast","payload":{"message":"hi"}}'),
    ).toEqual({id: 'pd_1', action: 'toast', payload: {message: 'hi'}});
  });

  it('accepts a message with no payload', () => {
    expect(parseBridgeMessage('{"id":"pd_1","action":"close"}')).toEqual({
      id: 'pd_1',
      action: 'close',
      payload: undefined,
    });
  });

  it('drops a non-object payload instead of passing it through', () => {
    expect(
      parseBridgeMessage('{"id":"pd_1","action":"close","payload":"evil"}')?.payload,
    ).toBeUndefined();
  });

  it('rejects the readiness sentinel as a bridge message', () => {
    // Ready pings skip authorization, so they must never parse into an action.
    expect(parseBridgeMessage(READY_PREFIX)).toBeNull();
    expect(parseBridgeMessage(`${READY_PREFIX}#6633FF`)).toBeNull();
    expect(
      parseBridgeMessage(JSON.stringify({id: 'x', action: READY_PREFIX})),
    ).toBeNull();
  });

  it('returns null for anything malformed', () => {
    expect(parseBridgeMessage('not json')).toBeNull();
    expect(parseBridgeMessage('[]')).toBeNull();
    expect(parseBridgeMessage('null')).toBeNull();
    expect(parseBridgeMessage('"a string"')).toBeNull();
    expect(parseBridgeMessage(undefined)).toBeNull();
    expect(parseBridgeMessage({id: 'pd_1', action: 'close'})).toBeNull();
    expect(parseBridgeMessage('{"action":"close"}')).toBeNull(); // no id
    expect(parseBridgeMessage('{"id":"","action":"close"}')).toBeNull(); // empty id
    expect(parseBridgeMessage('{"id":"pd_1"}')).toBeNull(); // no action
    expect(parseBridgeMessage('{"id":"pd_1","action":"eval"}')).toBeNull(); // unknown action
  });
});

describe('injected scripts', () => {
  // These are strings built in a template literal, so a bad escape produces
  // syntactically invalid JS that fails silently inside the WebView.
  it('are syntactically valid JavaScript', () => {
    expect(() => new Function(BRIDGE_SDK)).not.toThrow();
    expect(() => new Function(READY_PROBE)).not.toThrow();
  });

  it('keeps the probe regexes intact through escaping', () => {
    // A double-escaped \\d would match a literal backslash, not a digit.
    expect(READY_PROBE).toContain('rgba?\\((\\d+)');
    expect(READY_PROBE).toContain(`postMessage(${JSON.stringify(READY_PREFIX)}`);
  });
});

/**
 * Runs the real READY_PROBE string against a stubbed DOM and returns what it
 * posted. The values below are taken from the live sites, so these cases pin
 * the detector against pages it actually has to handle.
 */
const runProbe = (opts: {
  vars?: Record<string, string>;
  meta?: string | null;
  els?: Record<string, Record<string, string>>;
}) => {
  const {vars = {}, meta = null, els = {}} = opts;
  let posted: string | null = null;

  const docElement = {isRoot: true};
  const root = {children: {length: 1}, getBoundingClientRect: () => ({height: 800})};
  const metaNode = meta === null ? null : {getAttribute: () => meta};

  const doc = {
    documentElement: docElement,
    body: root,
    getElementById: (id: string) => (id === 'root' ? root : null),
    querySelector: (sel: string) =>
      sel === 'meta[name="theme-color"]'
        ? metaNode
        : els[sel]
        ? {styles: els[sel]}
        : null,
  };
  const win = {
    getComputedStyle: (node: any) =>
      node === docElement
        ? {getPropertyValue: (n: string) => vars[n] || ''}
        : node.styles,
    ReactNativeWebView: {
      postMessage: (m: string) => {
        posted = m;
      },
    },
  };
  class FakeObserver {
    observe() {}
    disconnect() {}
  }

  // eslint-disable-next-line no-new-func
  new Function(
    'window',
    'document',
    'MutationObserver',
    'requestAnimationFrame',
    'setTimeout',
    READY_PROBE,
  )(win, doc, FakeObserver, (fn: any) => fn(), () => 0);

  return posted;
};

describe('READY_PROBE theme detection', () => {
  const color = (posted: string | null) =>
    posted?.slice(READY_PREFIX.length).toLowerCase();

  it('finds the brand accent on a MUI page with no CSS variables', () => {
    // NextJobz: brand #6633FF appears only as text/border/gradient, never as an
    // opaque background, and the chrome itself is white.
    expect(
      color(
        runProbe({
          els: {
            header: {backgroundColor: 'rgb(255, 255, 255)'},
            '.MuiButton-outlinedPrimary': {color: 'rgb(102, 51, 255)'},
          },
        }),
      ),
    ).toBe('#6633ff');
  });

  it('prefers a declared brand token over framework defaults', () => {
    // Managerium: CRA ships meta #000000 and Bootstrap ships --bs-primary,
    // but the site declares its own --primary-color.
    expect(
      color(
        runProbe({
          vars: {
            '--primary-color': 'rgba(66, 133, 244, 1) !important',
            '--bs-primary': '#0d6efd',
          },
          meta: '#000000',
          els: {'.navbar': {backgroundColor: 'rgb(209, 234, 255)'}},
        }),
      ),
    ).toBe('#4285f4');
  });

  it('ignores light chrome, black text and boilerplate meta', () => {
    // The failure that made detection look broken: pale chrome is not a brand.
    expect(
      color(
        runProbe({
          meta: '#ffffff',
          els: {
            header: {backgroundColor: 'rgb(209, 234, 255)'}, // #d1eaff sidebar
            a: {color: 'rgb(17, 17, 17)'}, // near-black link text
          },
        }),
      ),
    ).toBe('');
  });

  it('reads shorthand hex and rejects translucent backgrounds', () => {
    expect(color(runProbe({vars: {'--primary': '#63f'}}))).toBe('#6633ff');
    expect(
      color(
        runProbe({
          els: {'.btn-primary': {backgroundColor: 'rgba(102, 51, 255, 0.5)'}},
        }),
      ),
    ).toBe('');
  });
});

describe('parseReadyMessage', () => {
  it('reads a ping with and without a detected color', () => {
    expect(parseReadyMessage(`${READY_PREFIX}#6633FF`)).toEqual({color: '#6633FF'});
    expect(parseReadyMessage(READY_PREFIX)).toEqual({color: undefined});
    expect(parseReadyMessage(`${READY_PREFIX}   `)).toEqual({color: undefined});
  });

  it('returns null for anything that is not a ping', () => {
    expect(parseReadyMessage('__pd_read')).toBeNull();
    expect(parseReadyMessage('{"id":"pd_1","action":"close"}')).toBeNull();
    expect(parseReadyMessage(undefined)).toBeNull();
    // Must not match mid-string — only a genuine prefix counts.
    expect(parseReadyMessage(`x${READY_PREFIX}#fff`)).toBeNull();
  });
});

describe('hostOf', () => {
  it('extracts the host and rejects non-http schemes', () => {
    expect(hostOf('https://apps.peopledesk.io/x?y=1')).toBe('apps.peopledesk.io');
    expect(hostOf('https://APPS.PeopleDesk.io')).toBe('apps.peopledesk.io');
    expect(hostOf('javascript:alert(1)')).toBeNull();
    expect(hostOf('file:///etc/passwd')).toBeNull();
    expect(hostOf('not a url')).toBeNull();
    expect(hostOf(undefined)).toBeNull();
  });
});

describe('isMessageAuthorized', () => {
  const app: MicroApp = {
    id: 'demo',
    title: 'Demo',
    url: 'https://apps.peopledesk.io/demo',
    allowedActions: ['close', 'toast', 'navigate'],
    allowedRoutes: ['AllApplicationFromDash'],
  };
  const msg = (action: any, payload?: any) => ({id: 'pd_1', action, payload});

  it('allows an allowed action from the registered host', () => {
    expect(
      isMessageAuthorized(msg('toast'), app, 'https://apps.peopledesk.io/demo/step2'),
    ).toBe(true);
  });

  it('blocks a message once the page has navigated off the registered host', () => {
    expect(isMessageAuthorized(msg('toast'), app, 'https://evil.example.com')).toBe(false);
    // Suffix trick: evil host merely ending in the registered host must not pass.
    expect(
      isMessageAuthorized(msg('toast'), app, 'https://notapps.peopledesk.io'),
    ).toBe(false);
    expect(isMessageAuthorized(msg('toast'), app, undefined)).toBe(false);
  });

  it('does NOT extend bridge access to allowedHosts', () => {
    // allowedHosts only keeps a subdomain inside the WebView; it must not let
    // that subdomain call native.
    const multi = {...app, allowedHosts: ['blog.peopledesk.io']};
    expect(isMessageAuthorized(msg('toast'), multi, 'https://blog.peopledesk.io/p/1')).toBe(
      false,
    );
  });

  it('blocks an action the app was not granted', () => {
    expect(
      isMessageAuthorized(msg('pickImage'), app, 'https://apps.peopledesk.io/demo'),
    ).toBe(false);
  });

  it('blocks navigate to a route outside allowedRoutes', () => {
    const url = 'https://apps.peopledesk.io/demo';
    expect(
      isMessageAuthorized(msg('navigate', {screen: 'AllApplicationFromDash'}), app, url),
    ).toBe(true);
    expect(isMessageAuthorized(msg('navigate', {screen: 'Login'}), app, url)).toBe(false);
    expect(isMessageAuthorized(msg('navigate'), app, url)).toBe(false);
    expect(
      isMessageAuthorized(msg('navigate', {screen: 'X'}), {...app, allowedRoutes: undefined}, url),
    ).toBe(false);
  });

  it('blocks everything for a misconfigured app', () => {
    const broken = {...app, url: 'javascript:alert(1)'};
    expect(isMessageAuthorized(msg('toast'), broken, 'javascript:alert(1)')).toBe(false);
  });
});
