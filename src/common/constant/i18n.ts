import {createMMKV} from 'react-native-mmkv';
import {LANGUAGES, translate, type LangId, type StringKey} from './locales';

/**
 * Its own store, not the app's encrypted one: this runs at module load, before
 * rootStore exists, and importing rootStore here would be a cycle. Same reason
 * as the theme store in Themes.ts.
 */
const langStore = createMMKV({id: 'mmkv.lang'});
const LANG_KEY = 'app.lang';

const isSupported = (id?: string): id is LangId =>
  LANGUAGES.some(l => l.id === id);

/** Saved choice, else the device language if we ship it, else English. */
const initial = (): LangId => {
  const saved = langStore.getString(LANG_KEY);
  if (isSupported(saved)) {
    return saved;
  }
  try {
    const device = Intl.DateTimeFormat().resolvedOptions().locale.slice(0, 2);
    return isSupported(device) ? device : 'en';
  } catch {
    // Hermes without Intl — English is a fine default.
    return 'en';
  }
};

let current: LangId = initial();

export const currentLanguage = (): LangId => current;

/**
 * Look up a string in the active language.
 *
 * Must be called at render time, not module scope: a `const TITLE = t(...)` at
 * the top of a file captures whatever language was active at import and never
 * updates. Changing language remounts the navigation tree (see App.tsx), which
 * is what makes every render-time call pick the new strings up.
 */
export const t = (key: StringKey, vars?: Record<string, string | number>) =>
  translate(current, key, vars);

type LanguageListener = (id: LangId) => void;
const listeners = new Set<LanguageListener>();

/** Subscribe to language changes. Returns the unsubscribe. */
export const onLanguageChange = (fn: LanguageListener) => {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
};

export const setLanguage = (id: LangId) => {
  if (id === current) {
    return;
  }
  current = id;
  langStore.set(LANG_KEY, id);
  listeners.forEach(fn => fn(id));
};
