import React from 'react';
import {
  StyleSheet,
  View,
  Modal,
  TouchableWithoutFeedback} from 'react-native';
import FastImage from 'react-native-fast-image';
import {getEprocurementImageURL, getImageURL} from '../services/getImage';
import {COLORS} from '../constant/Themes';

type CustomImageViewerProps = {
  isModalShow: boolean;
  setIsModalShow: React.Dispatch<React.SetStateAction<boolean>>;
  attachmentId: string | number;
  isProcurement?: boolean;
};

const CustomImageViewer: React.FC<CustomImageViewerProps> = ({
  isModalShow,
  setIsModalShow,
  attachmentId,
  isProcurement = true,
}) => {
  // Defensive check for attachmentId and imageUrl
  const imageUrl = attachmentId
    ? isProcurement
      ? getEprocurementImageURL(attachmentId)
      : getImageURL(attachmentId)
    : null;

  const handleClose = () => {
    setIsModalShow(false);
  };

  if (!imageUrl) return null; // Don't render if no valid URL

  return (
    <Modal
      animationType="fade"
      transparent
      visible={isModalShow}
      onRequestClose={handleClose}>
      <TouchableWithoutFeedback onPress={handleClose}>
        <View style={styles.overlay}>
          {/* 
            Use FastImage if you are confident it's properly linked.
            Otherwise, fallback to React Native's Image component (comment out accordingly).
          */}
          <FastImage
            style={styles.image}
            resizeMode={FastImage.resizeMode.contain}
            source={{uri: imageUrl}}
          />
          {/*
          <Image
            style={styles.image}
            resizeMode="contain"
            source={{ uri: imageUrl }}
          /> 
          */}
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default CustomImageViewer;

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
