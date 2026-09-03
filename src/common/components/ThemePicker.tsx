import React, {useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import MIcon from 'react-native-vector-icons/MaterialIcons';
import {THEMES, type ThemeId} from '../constant/palettes';
import {COLORS, currentThemeId, setTheme} from '../constant/Themes';

/**
 * Theme swatches. Picking one swaps the palette in place — chrome that reads
 * colours at render time repaints straight away, while screens whose
 * module-scope StyleSheet.create already ran keep their colours until relaunch.
 * See palettes.ts.
 */
const ThemePicker = () => {
  const [selected, setSelected] = useState<ThemeId>(currentThemeId);

  const pick = (id: ThemeId) => {
    if (id === selected) {
      return;
    }
    setSelected(id);
    // Swaps the palette and notifies every useThemeId subscriber, so the shared
    // chrome repaints now; screen-local styles follow on the next launch.
    setTheme(id);
  };

  return (
    <View style={styles.wrap}>
      <Text style={styles.label}>Theme</Text>
      <View style={styles.row}>
        {THEMES.map(theme => (
          <TouchableOpacity
            key={theme.id}
            style={styles.item}
            onPress={() => pick(theme.id)}>
            <View style={[styles.swatch, {backgroundColor: theme.swatch}]}>
              {selected === theme.id ? (
                <MIcon name="check" size={18} color="#FFFFFF" />
              ) : null}
            </View>
            <Text style={styles.name} numberOfLines={1}>
              {theme.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

export default ThemePicker;

const styles = StyleSheet.create({
  wrap: {paddingHorizontal: 16, paddingVertical: 12, gap: 10},
  label: {fontSize: 12.5, fontWeight: '600', color: COLORS.graySubText},
  row: {flexDirection: 'row', gap: 14},
  item: {alignItems: 'center', gap: 4, width: 56},
  swatch: {
    height: 34,
    width: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
  name: {fontSize: 11, color: COLORS.textNewColor},
});
