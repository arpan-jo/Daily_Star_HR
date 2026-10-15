import React from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import CustomTextNew from '../../../common/components/CustomText';
import {COLORS} from '../../../common/constant/Themes';
import {getStatusBgColor, getStatusColor} from '../../../common/services/getColor';

interface ProcurementCardProps {
  title?: string;
  subtitle?: string;
  status?: string;
  additionalInfo?: React.ReactNode;
  createdDate?: string;
  code?: string;
  onPress?: () => void;
  onLongPress?: () => void;
  style?: any;
}

const ProcurementLandingCard: React.FC<ProcurementCardProps> = ({
  title,
  subtitle,
  status,
  additionalInfo,
  createdDate,
  code,
  onPress,
  onLongPress,
  style,
}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      onLongPress={onLongPress}
      style={[styles.card, style]}>
      {code ? (
        <CustomTextNew text={code} txtSize={12} txtColor={COLORS.graySubText} />
      ) : null}
      {title ? (
        <CustomTextNew
          text={title}
          txtSize={15}
          txtWeight={'500'}
          txtColor={COLORS.textNewColor}
        />
      ) : null}
      {subtitle ? (
        <CustomTextNew
          text={subtitle}
          txtSize={13}
          txtColor={COLORS.graySubText}
        />
      ) : null}
      {additionalInfo}
      <View style={styles.footerRow}>
        {createdDate ? (
          <CustomTextNew
            text={createdDate}
            txtSize={12}
            txtColor={COLORS.graySubText}
          />
        ) : <View />}
        {status ? (
          <View
            style={[
              styles.statusBadge,
              {backgroundColor: getStatusBgColor(status)},
            ]}>
            <CustomTextNew
              text={status}
              txtSize={12}
              txtColor={getStatusColor(status)}
            />
          </View>
        ) : null}
      </View>
    </TouchableOpacity>
  );
};

export default ProcurementLandingCard;

const styles = StyleSheet.create({
  card: {
    borderWidth: 0.8,
    marginTop: 8,
    borderColor: COLORS.offDay,
    elevation: 3,
    backgroundColor: COLORS.white,
    shadowColor: COLORS.black,
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.08,
    shadowRadius: 5,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 6,
    marginHorizontal: 16,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 6,
  },
  statusBadge: {
    borderRadius: 100,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
});

