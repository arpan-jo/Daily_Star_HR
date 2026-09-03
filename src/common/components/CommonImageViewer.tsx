import React from 'react';
import {StyleSheet, View, Modal, TouchableWithoutFeedback} from 'react-native';
import FastImage from 'react-native-fast-image';
import {COLORS} from '../constant/Themes';

type CommonImageViewerProps = {
  isVisible: boolean;
  onClose: () => void;
  imageUrl: string;
};

const CommonImageViewer: React.FC<CommonImageViewerProps> = ({
  isVisible,
  onClose,
  imageUrl,
}) => {
  if (!imageUrl) return null;

  return (
    <Modal
      animationType="fade"
      transparent
      visible={isVisible}
      onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <FastImage
            style={styles.image}
            resizeMode={FastImage.resizeMode.contain}
            source={{uri: imageUrl}}
          />
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default CommonImageViewer;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  image: {
    width: '100%',
    height: '80%',
    borderRadius: 8,
    backgroundColor: COLORS.white,
  },
});
