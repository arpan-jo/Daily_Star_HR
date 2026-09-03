import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import MIcon from 'react-native-vector-icons/MaterialIcons';
import {t, setLanguage} from '../constant/i18n';
import {LANGUAGES, type LangId} from '../constant/locales';
import {COLORS} from '../constant/Themes';
import useLanguage from '../../hooks/useLanguage';
import useThemeId from '../../hooks/useThemeId';

/**
 * Language chips. Picking one remounts the navigation tree (App.tsx keys it on
 * the language), so every screen redraws in the new language immediately.
 */
const LanguagePicker = () => {
  const selected = useLanguage();
  // The active chip is tinted with COLORS.primary, which a theme moves. Read at
  // render time and subscribe, or the chip keeps the old theme's colour — a
  // module-scope StyleSheet.create would have captured it at import.
  useThemeId();

  const pick = (id: LangId) => {
    if (id !== selected) {
      setLanguage(id);
    }
  };

  return (
    <View style={styles.wrap}>
      <Text style={styles.label}>{t('more.language')}</Text>
      <View style={styles.row}>
        {LANGUAGES.map(lang => (
          <TouchableOpacity
            key={lang.id}
            style={[
              styles.chip,
              selected === lang.id && {
                borderColor: COLORS.primary,
                backgroundColor: COLORS.newGray,
              },
            ]}
            onPress={() => pick(lang.id)}>
            {selected === lang.id ? (
              <MIcon name="check" size={16} color={COLORS.primary} />
            ) : null}
            <Text
              style={[
                styles.name,
                selected === lang.id && {
                  color: COLORS.primary,
                  fontWeight: '600',
                },
              ]}
              numberOfLines={1}>
              {lang.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

export default LanguagePicker;

const styles = StyleSheet.create({
  wrap: {paddingHorizontal: 16, paddingVertical: 12, gap: 10},
  label: {fontSize: 12.5, fontWeight: '600', color: COLORS.graySubText},
  row: {flexDirection: 'row', gap: 10, flexWrap: 'wrap'},
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  name: {fontSize: 12.5, color: COLORS.textNewColor},
});
