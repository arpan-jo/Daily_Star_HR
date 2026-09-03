import {Dimensions} from 'react-native';
import {createMMKV} from 'react-native-mmkv';
import {themeById, type ThemeId} from './palettes';
const {width, height} = Dimensions.get('window');
export const SIZES = {
  width,
  height,
};
export const COLORS = {
  // base colors
  primary: '#299647', // Color change to default react-native-paper color  // Old Color > blue '#4D5AFF'
  /**
   * App bar surface and what sits on it. Separate from primary/white so a theme
   * can move the bar without touching page surfaces, and so the bar's contents
   * stay readable whatever the bar colour is.
   */
  appBar: '#299647',
  onAppBar: '#FFFFFF',
  /**
   * Text and icons drawn on a saturated colour — status chips, badges. Stays
   * light in every theme, because the colour underneath does not change.
   */
  onColor: '#FFFFFF',
  secondary: '#5C5C5C', // gray
  border: '#9C9C9E', // border
  lightGray: '#B6C1CF', //lightgray
  darkGray: '#6C6C6E',

  //newDesign
  textNewColor: '#344054',
  iconColor: '#323232',
  statusBar: '#096529',
  bar: '#F2F2F7',
  textNewBold: '#1D2939',
  newGray: '#F2F4F7',
  graySubText: '#667085',
  iconGrayBackground: '#EAECF0',

  // colors
  black: '#000000',
  white: '#FFFFFF',
  red: '#E61C53',
  redish: '#FF5C58',
  sayn: '#40BDFF',
  blue: '#4D5AFF',
  messageColor: '#707BFF',
  yellow: '#FFC014',
  orange: '#FF7821',
  green: '#7DD63C',
  lightYellow: '#FFCC00',
  lightBlue: '#EAEDFF',
  lightBlack: '#7A7A7A',
  lightRed: '#EE5C51',
  blackish: '#111111DE',
  sunColor: '#F2C800',
  maroon: '#B54896',
  whitesmoke: 'whitesmoke',
  // cancel: '#FF4842',
  darkBlue: '#1084F1',
  warning: '#F78C12',

  //other colors
  deepWhite: '#E5F0FC',
  lightGray2: '#F6F6F7',
  lightGray3: '#EFEFF1',
  lightGray4: '#F8F8F9',
  lightGray5: '#cccccc',
  lightGray6: '#BCC1CD',
  lightGray7: '#F2F2F7',
  transparent: 'transparent',
  transparentGray: '#00000066',
  darkgray: '#898C95',
  deepGray: '#637381',
  textGray: '#6F7D8A',
  textColor: '#7F7F7F',
  softGray: '#dcdcf2',
  lightPrimary: '#CCF0CC',
  lightPrimary2: '#E4F8DD',
  mixBlack: '#3B4964',
  modalUnderBgColor: '#121E4499',
  disabled: '#63636333',
  //transparent colors
  black40: 'rgba(0, 0, 0, 0.4)',
  transparentBlack: 'rgba(0, 0, 0, 0.6)',
  transparentText: 'rgba(0, 0, 0, 0.75)',
  transparentDark: 'rgba(0, 0, 0, 0.5)',
  transparentWhite: 'rgba(255, 255, 255, 0.750)',
  borderBottom: '#E1E1E1',
  transparentImgTxt: 'rgba(0, 0, 0, 0.3)',
  transparentDark2: 'rgba(0, 0, 0, 0.4)',

  //bottmtab icon colors
  transparentPrimary: 'rgb(0, 178, 0, 0.5)',

  //active color
  activeBackground: 'rgba(0, 156, 222, 0.1)',
  activeText: '#009CDE',
  cancel: '#FF696C',

  //calendar
  late: '#EAAA08',
  absent: '#D92D20',
  offDay: '#D0D5DD',
  movement: '#2E90FA',
  holiday: '#717BBC',
  leave: '#D444F1',
  present: '#86efac',
};

/**
 * Its own store, not the app's encrypted one: this runs at module load, before
 * rootStore exists, and importing rootStore here would be a cycle.
 */
const themeStore = createMMKV({id: 'mmkv.theme'});
const THEME_KEY = 'app.theme';

/** The shipped values, kept so switching back to a theme restores them. */
const BASE_COLORS = {...COLORS};

export const currentThemeId = (): ThemeId =>
  themeById(themeStore.getString(THEME_KEY)).id;

/**
 * Applied here, at import time, so every module-scope StyleSheet.create that
 * runs afterwards picks the themed values up. Nothing re-reads COLORS after its
 * own module has loaded — which is why setTheme cannot reach them.
 */
Object.assign(COLORS, themeById(themeStore.getString(THEME_KEY)).colors);

type ThemeListener = (id: ThemeId) => void;
const listeners = new Set<ThemeListener>();

/** Subscribe to theme changes. Returns the unsubscribe. */
export const onThemeChange = (fn: ThemeListener) => {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
};

/**
 * Persists the choice and swaps the palette in place.
 *
 * Components that read colours at render time and subscribe with `useThemeId`
 * repaint straight away — the shared chrome does this, so the app follows a
 * theme change without relaunching. Styles built by a module-scope
 * StyleSheet.create captured their values at import; those screens pick the new
 * palette up the next time the app starts.
 */
export const setTheme = (id: ThemeId) => {
  themeStore.set(THEME_KEY, id);
  Object.assign(COLORS, BASE_COLORS, themeById(id).colors);
  listeners.forEach(fn => fn(id));
};

const appTheme = {COLORS, SIZES};

export default appTheme;
