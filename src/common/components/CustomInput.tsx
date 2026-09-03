/* eslint-disable react-native/no-inline-styles */
import React, {Fragment} from 'react';
import {Controller} from 'react-hook-form';
import {Platform, StyleSheet, Text, TextInput, View} from 'react-native';
import {COLORS, SIZES} from '../constant/Themes';
import MIcon from 'react-native-vector-icons/MaterialIcons';
import useThemeId from '../../hooks/useThemeId';

interface Props {
  control: any;
  name: any;
  rules?: {};
  placeholder?: string;
  secureTextEntry?: boolean;
  label?: string;
  disabled?: boolean;
  multiline?: boolean;
  rightIcon?: () => void;
  leftIcon?: () => void;
  keyboardType?: string;
  inputMainStyle?: {};
  labelStyle?: {};
  textInputStyle?: {};
  setValue?: any;
  isAuth?: boolean;
  onChange?: any;
  selectionColor?: string;
  isImportant?: boolean;
}

const CustomInputNew = ({
  control,
  name,
  rules = {},
  placeholder,
  secureTextEntry = false,
  label,
  disabled = false,
  multiline,
  rightIcon,
  leftIcon,
  keyboardType = 'default',
  inputMainStyle,
  labelStyle,
  textInputStyle,
  setValue,
  isAuth = false,
  onChange,
  selectionColor,
  isImportant,
}: Props) => {
  useThemeId(); // repaint on theme change
  const handleChange = (e: string) => {
    if (onChange) {
      onChange(e);
    } else {
      setValue(name, e);
    }
  };
  return (
    <Fragment>
      <Controller
        name={name}
        control={control}
        rules={rules}
        render={({field: {value, onBlur}, fieldState: {error}}) => (
          <>
            <View>
              {Platform.OS === 'ios' && !isAuth ? (
                <View>
                  <Text style={[styles.newLabelIOS, labelStyle]}>
                    {label}

                    {isImportant ? (
                      <MIcon
                        name={'stars'}
                        color={COLORS.warning}
                        size={12}
                        style={{
                          fontWeight: '500',
                        }}
                      />
                    ) : null}
                  </Text>
                </View>
              ) : null}
              <View style={[inputMainStyle]}>
                {Platform.OS === 'android' || isAuth ? (
                  <View
                    style={
                      {
                        // marginBottom: -5,
                      }
                    }>
                    <Text
                      style={[
                        styles.newLabel,
                        {color: COLORS.primary},
                        {
                          paddingLeft: leftIcon && 60,
                        },
                        labelStyle,
                      ]}>
                      {label}
                      {isImportant ? (
                        <MIcon
                          name={'stars'}
                          color={COLORS.warning}
                          size={12}
                          style={{
                            fontWeight: '500',
                          }}
                        />
                      ) : null}
                    </Text>
                  </View>
                ) : null}
                <View style={styles.box}>
                  <View style={[styles.leftIcon]}>
                    <>{leftIcon ? leftIcon() : null}</>
                  </View>

                  <TextInput
                    style={[
                      Platform.OS === 'ios' && !isAuth
                        ? styles.newInputIOS
                        : styles.newInput,
                      textInputStyle,
                      {
                        borderBottomColor: value
                          ? COLORS.offDay
                          : error
                            ? 'red'
                            : COLORS.offDay,
                        width: leftIcon ? SIZES.width / 1.25 : '100%',
                        marginLeft: rightIcon || leftIcon ? 50 : 0,
                        paddingHorizontal:
                          Platform.OS === 'ios' ? (!leftIcon ? 16 : 5) : 5,
                      },
                      disabled ? styles.disabled : {},
                    ]}
                    selectionColor={selectionColor || 'black'}
                    // placeholder={Platform.OS === 'ios' || isAuth ? placeholder : ''}
                    placeholder={placeholder}
                    onBlur={onBlur}
                    onChangeText={e => handleChange(e)}
                    editable={!disabled}
                    value={value}
                    secureTextEntry={secureTextEntry}
                    multiline={multiline}
                    //@ts-ignore
                    keyboardType={keyboardType}
                    placeholderTextColor={COLORS.graySubText}
                  />

                  <View style={[styles.rightIcon]}>
                    <>{rightIcon ? rightIcon() : null}</>
                  </View>
                </View>
              </View>
            </View>

            {error && <Text style={styles.error}>{error.message}</Text>}
          </>
        )}
      />
    </Fragment>
  );
};

export default CustomInputNew;

const styles = StyleSheet.create({
  newLabel: {
    fontSize: 14,
    lineHeight: 20,
    color: COLORS.primary,
  },
  newLabelIOS: {
    fontSize: 17,
    lineHeight: 22,
    fontWeight: '600',
    paddingBottom: 2,
    color: COLORS.textNewBold,
  },
  error: {
    color: 'red',
    fontSize: 10,
    marginTop: -18,
    marginBottom: 10,
  },

  newInput: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.offDay,
    fontSize: 16,
    lineHeight: 24,
    color: COLORS.textNewColor,
    paddingVertical: 0,
    paddingHorizontal: 0,
    paddingTop: 4,
    paddingBottom: 4,
    minHeight: Platform?.OS === 'ios' ? 48 : 40,
    maxHeight: 100,
  },
  newInputIOS: {
    borderWidth: 1,
    borderColor: COLORS.offDay,
    fontSize: 16,
    lineHeight: 24,
    color: COLORS.textNewColor,
    paddingTop: 9,
    paddingBottom: 14.5,
    paddingHorizontal: 16,
    borderRadius: 10,
    backgroundColor: '#f9f9f9',
  },
  disabled: {
    backgroundColor: 'rgba(99, 99, 99,0.1)',
    marginTop: 1.2,
    borderRadius: 1,
  },
  rightIcon: {
    paddingBottom: 8,
    alignSelf: 'flex-end',
    position: 'absolute',
    zIndex: 999999,
    marginLeft: SIZES.width / 1.15,
  },
  leftIcon: {
    paddingBottom: 8,
    alignSelf: 'flex-end',
    position: 'absolute',
    zIndex: 999999,
    marginLeft: 20,
  },
  box: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
