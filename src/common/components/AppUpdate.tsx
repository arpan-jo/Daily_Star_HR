import LottieView from 'lottie-react-native';
import React, { useEffect, useState } from 'react';
import {
  Linking,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import VersionCheck from 'react-native-version-check';
import { COLORS } from '../constant/Themes';
import useThemeId from '../../hooks/useThemeId';

const AppUpdate = () => {
  const [url, setUrl] = useState('');
  const [isUpdate, setIsUpdate] = useState(false);
  useThemeId(); // repaint on theme change

  useEffect(() => {
    VersionCheck.needUpdate().then(async res => {
      if (res?.isNeeded) {
        setUrl(res.storeUrl);
        setIsUpdate(true);
      } else {
        setUrl('');
        setIsUpdate(false);
      }
    });
  }, []);

  return (
    <Modal animationType="fade" transparent visible={isUpdate}>
      <View style={stylesForModal.centeredView}>
        <View style={stylesForModal.modalStyle}>
          <Text style={stylesForModal.updateAvailable}>
            A new version is available
          </Text>
          <LottieView
            style={stylesForModal.lottieAnim}
            source={require('../../assets/Lottie/update.json')}
            autoPlay
            loop
          />
          <View style={stylesForModal.updateButtons}>
            <TouchableOpacity
              style={[
                stylesForModal.updateButtonStyle,
                { backgroundColor: COLORS.primary },
              ]}
              onPress={() => {
                if (url) {
                  Linking.openURL(url);
                }
              }}
            >
              <Text style={stylesForModal.updateBtn}>UPDATE</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default AppUpdate;

export const stylesForModal = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#121E4499',
  },
  lottieAnim: {
    width: 150,
    height: 200,
    alignSelf: 'center',
  },
  modalStyle: {
    width: 320,
    height: 350,
    backgroundColor: '#fff',
    borderRadius: 15,
  },
  updateAvailable: {
    alignSelf: 'center',
    marginTop: 20,
    fontSize: 20,
    color: COLORS.textNewColor,
    fontWeight: 'bold',
  },
  updateButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 0,
  },
  updateButtonStyle: {
    padding: 10,
    borderRadius: 100,
    marginHorizontal: 15,
    backgroundColor: COLORS.primary,
    marginTop: 30,
    width: '80%',
  },
  updateBtn: { color: 'white', textAlign: 'center' },
});
