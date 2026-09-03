import {DefaultTheme as DTheme, Theme} from '@react-navigation/native';
import {MD3LightTheme as PaperLightTheme} from 'react-native-paper';

const DefaultTheme: Theme & ReactNativePaper.Theme = {
  ...DTheme,
  ...PaperLightTheme,
  colors: {
    ...DTheme.colors,
    ...PaperLightTheme,
    primary: 'red',
    text: 'black',
  },
};

export default DefaultTheme;
