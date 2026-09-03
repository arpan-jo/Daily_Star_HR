import {useEffect, useState} from 'react';
import {currentLanguage, onLanguageChange} from '../common/constant/i18n';

/**
 * The active language id, re-rendering the caller when it changes.
 *
 * Used as a `key` on the navigation tree: remounting is what makes every
 * render-time `t()` call return the new language's strings without waiting for
 * a relaunch.
 */
const useLanguage = () => {
  const [id, setId] = useState(currentLanguage);
  useEffect(() => onLanguageChange(setId), []);
  return id;
};

export default useLanguage;
