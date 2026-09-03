import {secureStorageKeyy} from '@env';
import {createMMKV} from 'react-native-mmkv';

/**
 * Employee profile responses, kept across launches so revisiting a profile
 * does not re-hit the API. Cleared by pull-to-refresh, by a profile edit, and
 * on logout — never expires on its own, because the screens that read it are
 * navigated back to constantly and a timer would just reintroduce the
 * repeated calls this exists to stop.
 *
 * Its own store rather than the app's: this is imported by an API service, and
 * reaching for rootStore from there closes an import cycle (rootStore -> App ->
 * screens -> service). Same encryption key, so a cached profile is protected
 * exactly like the rest of the app's storage.
 */
const store = createMMKV({
  id: 'mmkv.profile',
  encryptionKey: secureStorageKeyy,
});

const key = (empId: number | string) => `profile.${empId}`;

export const readProfileCache = (empId?: number | string | null) => {
  if (!empId) {
    return null;
  }
  const raw = store.getString(key(empId));
  if (!raw) {
    return null;
  }
  try {
    return JSON.parse(raw);
  } catch {
    // Corrupt entry — drop it and let the caller hit the API.
    store.remove(key(empId));
    return null;
  }
};

export const writeProfileCache = (
  empId: number | string | null | undefined,
  data: unknown,
) => {
  if (!empId || !data) {
    return;
  }
  store.set(key(empId), JSON.stringify(data));
};

/** Without an id, clears every employee — that is the logout case. */
export const clearProfileCache = (empId?: number | string | null) => {
  if (empId) {
    store.remove(key(empId));
  } else {
    store.clearAll();
  }
};
