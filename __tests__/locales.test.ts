import {LANGUAGES, STRINGS, translate} from '../src/common/constant/locales';

describe('translate', () => {
  it('returns the string for the active language', () => {
    expect(translate('bn', 'common.logout')).toBe('লগআউট');
  });

  it('falls back to English when a language is missing the key', () => {
    // @ts-expect-error simulating a partial translation shipped without a key
    delete STRINGS.bn['more.faq'];
    expect(translate('bn', 'more.faq')).toBe("FAQ's");
  });

  it('returns the key itself when nothing has it', () => {
    // @ts-expect-error unknown keys are a runtime possibility, not a type one
    expect(translate('en', 'nope.missing')).toBe('nope.missing');
  });

  it('fills {placeholders} and leaves unknown ones alone', () => {
    STRINGS.en['test.greet' as never] = 'Hi {name}, {n} left — {bogus}' as never;
    expect(translate('en', 'test.greet' as never, {name: 'Arpan', n: 3})).toBe(
      'Hi Arpan, 3 left — {bogus}',
    );
  });

  it('every language in the picker has a dictionary', () => {
    LANGUAGES.forEach(lang => expect(STRINGS[lang.id]).toBeDefined());
  });
});
