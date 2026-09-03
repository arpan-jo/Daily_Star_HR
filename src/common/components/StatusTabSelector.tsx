// components/StatusTabSelector.tsx
import React from 'react';
import { ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import useThemeId from '../../hooks/useThemeId';
import CustomTextNew from './CustomText';
import { COLORS } from '../constant/Themes';

export interface TabOption {
  label: string;
  value: any;
}

interface Props {
  data: TabOption[];
  selected: string;
  onChange: (item: TabOption) => void;
}

const StatusTabSelector: React.FC<Props> = ({ data, selected, onChange }) => {
  useThemeId(); // repaint on theme change
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {data.map(item => {
        const isActive = selected === item.value;
        return (
          <TouchableOpacity
            key={item.value}
            onPress={() => onChange(item)}
            style={[
              styles.tab,
              isActive && {
                backgroundColor: COLORS.lightPrimary,
                borderColor: COLORS.primary,
              },
            ]}
          >
            <CustomTextNew
              style={[styles.text, isActive && styles.activeText]}
              text={item.label}
            />
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {},
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    marginRight: 12,
    backgroundColor: '#fff',
  },
  activeTab: {
    backgroundColor: COLORS.lightPrimary,
    borderColor: COLORS.primary,
  },
  text: {
    fontSize: 14,
    color: '#333',
  },
  activeText: {
    color: '#0f5132',
    fontWeight: 'bold',
  },
});

export default StatusTabSelector;
