import React from 'react';
import {
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {COLORS, SIZES} from '../constant/Themes';
import MIcon from 'react-native-vector-icons/MaterialIcons';
import {Switch, TextInput} from 'react-native-paper';
import Row from './Row';
import useThemeId from '../../hooks/useThemeId';

interface Props {
  setIsModalShow: any;
  isModalShow: boolean;
  onPressCallApi?: any;
  onCancelPressCallApi?: any;
  modalText?: string;
  deleteText?: string;
  cancelText?: string;
  isDisabled?: boolean;
  modalInputLabel?: string;
  modalInputText?: string;
  isColor?: boolean;
  isColor2?: boolean;
  setModalInputText?: any;
  isSwitchOn?: boolean;
  setIsSwitchOn?: any;
  switchTextLeft?: any;
  switchTextRight?: any;
  modalInputLabel2?: string;
  modalInputText2?: string;
  setModalInputText2?: any;
  keyboardType?: string;
}
const CustomModalNew = ({
  setIsModalShow,
  isModalShow,
  onPressCallApi,
  onCancelPressCallApi,
  modalText,
  deleteText = 'Confirm',
  cancelText = 'Cancel',
  isDisabled = false,
  modalInputLabel,
  modalInputText,
  setModalInputText,
  modalInputLabel2,
  modalInputText2,
  setModalInputText2,
  isColor,
  isColor2,
  isSwitchOn,
  setIsSwitchOn,
  switchTextLeft,
  switchTextRight,
  keyboardType = 'decimal-pad',
}: Props) => {
  useThemeId(); // repaint on theme change
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isModalShow}
      onRequestClose={() => {
        setIsModalShow(!isModalShow);
      }}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          {onCancelPressCallApi && (
            <TouchableOpacity
              onPress={() => setIsModalShow(!isModalShow)}
              style={styles.closeBtn}>
              <MIcon name="close" size={25} color={COLORS.red} />
            </TouchableOpacity>
          )}
          <View
            style={
              Platform.OS === 'ios'
                ? styles.paddingHorizontal30
                : styles.paddingHorizontal0
            }>
            {Platform.OS === 'ios' ? (
              <Text style={styles.confermationText}>Confirmation</Text>
            ) : (
              <Text style={styles.title}>Confirmation</Text>
            )}
            <Text style={styles.modalText}>{modalText}</Text>
            {setIsSwitchOn ? (
              <Row>
                <Text style={styles.switchText}>{switchTextLeft}</Text>
                <Switch
                  value={isSwitchOn}
                  onValueChange={setIsSwitchOn}
                  color={COLORS.primary}
                />
                <Text style={styles.switchText}>{switchTextRight}</Text>
              </Row>
            ) : null}

            {setModalInputText2 ? (
              <TextInput
                label={modalInputLabel2}
                value={modalInputText2}
                onChangeText={text => setModalInputText2(text)}
                mode="outlined"
                //@ts-ignore
                keyboardType={keyboardType}
                outlineColor={COLORS.textColor}
                style={{
                  marginTop: 10,
                  width: 300,
                }}
                activeOutlineColor={isColor2 ? COLORS.red : COLORS.textColor}
              />
            ) : null}

            {setModalInputText ? (
              <TextInput
                label={modalInputLabel}
                value={modalInputText}
                onChangeText={text => setModalInputText(text)}
                mode="outlined"
                multiline
                outlineColor={COLORS.textColor}
                style={{
                  marginTop: 10,
                  width: 300,
                }}
                activeOutlineColor={isColor ? COLORS.red : COLORS.textColor}
              />
            ) : null}
          </View>

          {Platform.OS === 'android' ? (
            <View style={styles.textBottom}>
              <Pressable
                onPress={() => {
                  if (onCancelPressCallApi) {
                    onCancelPressCallApi();
                    setIsModalShow(!isModalShow);
                  } else {
                    setIsModalShow(!isModalShow);
                  }
                }}>
                <Text
                  style={[
                    styles.textStyle,
                    styles.paddingRight,
                    {color: COLORS.primary},
                  ]}>
                  {cancelText?.toLocaleUpperCase()}
                </Text>
              </Pressable>
              <Pressable
                disabled={isDisabled}
                onPress={() => {
                  onPressCallApi();
                  // setIsModalShow(!isModalShow);
                }}>
                <Text style={[styles.textStyle, {color: COLORS.primary}]}>
                  {deleteText?.toLocaleUpperCase()}
                </Text>
              </Pressable>
            </View>
          ) : (
            <View style={styles.cancelTxt}>
              <Pressable
                onPress={() => {
                  if (onCancelPressCallApi) {
                    onCancelPressCallApi();
                    setIsModalShow(!isModalShow);
                  } else {
                    setIsModalShow(!isModalShow);
                  }
                }}>
                <Text style={[styles.cancelDelTxt, {color: COLORS.primary}]}>
                  {cancelText?.toLocaleUpperCase()}
                </Text>
              </Pressable>
              <View style={styles.horizontalDevider} />
              <Pressable
                disabled={isDisabled}
                onPress={() => {
                  onPressCallApi();
                  // setIsModalShow(!isModalShow);
                }}>
                <Text style={[styles.cancelDelTxt, {color: COLORS.primary}]}>
                  {deleteText}
                </Text>
              </Pressable>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
};

export default CustomModalNew;

export const customModalStyle = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#121E4499',
  },

  modalView: {
    margin: 20,
    backgroundColor: COLORS.white,
    borderRadius: 10,
    paddingHorizontal: Platform.OS === 'android' ? 35 : 0,
    paddingTop: Platform.OS === 'ios' ? 20 : 35,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    overflow: 'hidden',
  },
  modalText: {
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: 0.25,
    color: COLORS.transparentBlack,
    textAlign: Platform.OS === 'ios' ? 'center' : 'auto',
    paddingBottom: Platform.OS === 'ios' ? 24 : 0,
  },
  textStyle: {
    color: COLORS.primary,
    padding: 7,
  },
  textBottom: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 30,
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 16,
    letterSpacing: 1.25,
    paddingBottom: 20,
  },
  paddingRight: {
    marginRight: 20,
  },
  confermationText: {
    fontSize: 17,
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 22,
    paddingBottom: 6,
  },
  cancelTxt: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    paddingHorizontal: SIZES.width / 10,
    borderTopColor: COLORS.offDay,
  },
  cancelDelTxt: {
    fontSize: 17,
    lineHeight: 22,
    color: COLORS.primary,
    padding: 12,
    fontWeight: '600',
  },
  horizontalDevider: {
    width: 1,
    backgroundColor: COLORS.offDay,
  },
  paddingHorizontal0: {
    paddingHorizontal: 0,
  },
  paddingHorizontal30: {
    paddingHorizontal: 30,
  },
  title: {
    fontSize: 18,
    lineHeight: 28,
    fontWeight: '500',
    color: '#1C1B1F',
    paddingBottom: 6,
  },
  closeBtn: {
    position: 'absolute',
    right: 0,
    backgroundColor: COLORS.lightGray3,
    padding: 4,
    borderRadius: 100,
  },
  switchText: {
    color: COLORS.textColor,
    fontSize: 16,
    paddingTop: 2,
  },
});

const styles = StyleSheet.create({
  ...customModalStyle,
});
