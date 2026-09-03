import {isDarkColor} from '../src/common/services/getColor';

// Gates whether a micro-app's brand color may be used as a header background.
// Headers draw their text and icons in white, so a false positive here ships an
// unreadable header rather than a merely ugly one.
describe('isDarkColor', () => {
  it('accepts colors that carry white text', () => {
    expect(isDarkColor('#6633FF')).toBe(true); // NextJobz brand
    // The app's own primary is 3.79:1 against white — the threshold must not
    // reject the brand it exists to match.
    expect(isDarkColor('#299647')).toBe(true);
    expect(isDarkColor('#000000')).toBe(true);
    expect(isDarkColor('6633FF')).toBe(true); // no leading hash
    expect(isDarkColor('  #6633ff  ')).toBe(true); // padded / lowercase
    // Shorthand: meta theme-color commonly uses it, so it must resolve.
    expect(isDarkColor('#63f')).toBe(true); // == #6633ff
    expect(isDarkColor('#000')).toBe(true);
  });

  it('rejects colors too light for white text', () => {
    expect(isDarkColor('#FFFFFF')).toBe(false);
    expect(isDarkColor('#FFFF00')).toBe(false); // yellow: bright despite saturation
    expect(isDarkColor('#00FF00')).toBe(false); // green channel dominates luminance
    expect(isDarkColor('#B6C1CF')).toBe(false); // theme lightGray
    expect(isDarkColor('#FFF')).toBe(false); // shorthand white
  });

  it('rejects anything it cannot parse, so callers fall back', () => {
    expect(isDarkColor(undefined)).toBe(false);
    expect(isDarkColor(null)).toBe(false);
    expect(isDarkColor('')).toBe(false);
    expect(isDarkColor('#FFFF')).toBe(false); // 4 digits is not a hex color
    expect(isDarkColor('rebeccapurple')).toBe(false);
    expect(isDarkColor('rgb(0,0,0)')).toBe(false);
    expect(isDarkColor('#12345G')).toBe(false);
  });
});
