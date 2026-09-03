import {useEffect, useState} from 'react';
import {currentThemeId, onThemeChange} from '../common/constant/Themes';

/**
 * The active theme id, re-rendering the caller when it changes.
 *
 * Used as a `key` on the navigation tree: remounting is what makes render-time
 * colour props (tab bar tints, header backgrounds) pick up the new palette
 * without waiting for a relaunch.
 */
const useThemeId = () => {
  const [id, setId] = useState(currentThemeId);
  useEffect(() => onThemeChange(setId), []);
  return id;
};

export default useThemeId;
