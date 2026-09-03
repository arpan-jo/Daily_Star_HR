/**
 * App themes.
 *
 * A theme is a set of overrides applied on top of the base palette in
 * Themes.ts — not a separate colour object. That matters: ~7,500 `COLORS.x`
 * references across the app read their values inside module-scope
 * `StyleSheet.create`, which captures them once at import. Overriding the same
 * object at startup themes every one of those without touching a single file;
 * a per-render theme object would mean rewriting all of them.
 *
 * The consequence: chrome that reads colours at render time (tab bars, headers)
 * repaints as soon as the theme changes, while anything already captured by a
 * StyleSheet.create only changes on the next launch. See setTheme() in
 * Themes.ts.
 */
export type ThemeId = 'default' | 'ocean' | 'plum' | 'graphite';

export type Theme = {
  id: ThemeId;
  label: string;
  /** Shown in the picker so a theme is recognisable before it is applied. */
  swatch: string;
  /** Keys of COLORS to override. Anything omitted keeps the base value. */
  colors: Record<string, string>;
};

/**
 * Every theme moves the brand colours and the surfaces tinted from them, and
 * deliberately leaves neutrals alone: white, black and the greys are used both
 * as text-on-brand and as page backgrounds, so recolouring them in
 * isolation breaks contrast somewhere nothing here can see.
 */
export const THEMES: Theme[] = [
  {
    id: 'default',
    label: 'PeopleDesk',
    swatch: '#299647',
    colors: {}, // the base palette as shipped
  },
  {
    id: 'ocean',
    label: 'Ocean',
    swatch: '#1F6FEB',
    colors: {
      primary: '#1F6FEB',
      appBar: '#1F6FEB',
      statusBar: '#0B4FB0',
      lightPrimary: '#D7E6FF',
      lightPrimary2: '#EAF1FF',
      transparentPrimary: 'rgba(31, 111, 235, 0.5)',
      activeText: '#1F6FEB',
      activeBackground: 'rgba(31, 111, 235, 0.10)',
      present: '#8BAFE9',
      messageColor: '#5B7CFF',
    },
  },
  {
    id: 'plum',
    label: 'Plum',
    swatch: '#7A3E9D',
    colors: {
      primary: '#7A3E9D',
      appBar: '#7A3E9D',
      statusBar: '#5A2B76',
      lightPrimary: '#EADCF3',
      lightPrimary2: '#F4EAF9',
      transparentPrimary: 'rgba(122, 62, 157, 0.5)',
      activeText: '#7A3E9D',
      activeBackground: 'rgba(122, 62, 157, 0.10)',
      present: '#CB8BE9',
      messageColor: '#9B6BBF',
    },
  },
  {
    id: 'graphite',
    label: 'Graphite',
    swatch: '#37474F',
    colors: {
      primary: '#37474F',
      appBar: '#37474F',
      statusBar: '#22303A',
      lightPrimary: '#DDE3E7',
      lightPrimary2: '#EEF1F3',
      transparentPrimary: 'rgba(55, 71, 79, 0.5)',
      activeText: '#37474F',
      activeBackground: 'rgba(55, 71, 79, 0.10)',
      present: '#ACBFC8',
      messageColor: '#607D8B',
    },
  },
];

export const themeById = (id?: string | null): Theme =>
  THEMES.find(t => t.id === id) ?? THEMES[0];
