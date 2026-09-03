jest.mock('@env', () => ({secureStorageKeyy: 'test-key'}), {virtual: true});

jest.mock('react-native-mmkv', () => {
  const map = new Map<string, string>();
  return {
    createMMKV: () => ({
      getString: (k: string) => map.get(k),
      set: (k: string, v: string) => map.set(k, v),
      remove: (k: string) => map.delete(k),
      clearAll: () => map.clear(),
    }),
  };
});

import {
  clearProfileCache,
  readProfileCache,
  writeProfileCache,
} from '../src/common/services/profileCache';

describe('profileCache', () => {
  afterEach(() => clearProfileCache());

  it('round-trips a profile', () => {
    writeProfileCache(11, {name: 'A'});
    expect(readProfileCache(11)).toEqual({name: 'A'});
  });

  it('keeps employees separate', () => {
    writeProfileCache(11, {name: 'A'});
    writeProfileCache(22, {name: 'B'});
    expect(readProfileCache(22)).toEqual({name: 'B'});
    clearProfileCache(22);
    expect(readProfileCache(22)).toBeNull();
    expect(readProfileCache(11)).toEqual({name: 'A'}); // untouched
  });

  it('misses on an unknown or absent id', () => {
    expect(readProfileCache(99)).toBeNull();
    expect(readProfileCache(undefined)).toBeNull();
    expect(readProfileCache(0)).toBeNull();
  });

  it('never stores an empty response', () => {
    writeProfileCache(11, null);
    writeProfileCache(11, undefined);
    expect(readProfileCache(11)).toBeNull();
  });

  it('recovers from a corrupt entry instead of throwing', () => {
    writeProfileCache(11, {name: 'A'});
    // Simulate a truncated write; the reader must fall through to the API.
    const {createMMKV} = require('react-native-mmkv');
    createMMKV().set('profile.11', '{"name":');
    expect(readProfileCache(11)).toBeNull();
  });

  it('clearProfileCache() with no id drops everyone — the logout case', () => {
    writeProfileCache(11, {name: 'A'});
    writeProfileCache(22, {name: 'B'});
    clearProfileCache();
    expect(readProfileCache(11)).toBeNull();
    expect(readProfileCache(22)).toBeNull();
  });
});
