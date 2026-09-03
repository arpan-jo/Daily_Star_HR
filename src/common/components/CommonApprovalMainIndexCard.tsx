import React from 'react';
import {StyleSheet} from 'react-native';
import FastImage from 'react-native-fast-image';
import MIcon from 'react-native-vector-icons/MaterialIcons';
import {IMAGES} from '../constant/Index';
import {COLORS} from '../constant/Themes';
import {getStatusBgColor, getStatusColor} from '../services/getColor';
import {getImageURL} from '../services/getImage';
import Column from './Column';
import CustomTextNew from './CustomText';
import Row from './Row';

const CommonApprovalMainIndexCard = ({
  item,
  employeeName,
  amount,
  applicationDate,
  effectiveDate,
}: any) => {
  return (
    <Row>
      <Column colWidth={'15%'}>
        {item?.profileUrlId ? (
          <Column
            colStyle={[styles?.noImageBox, {backgroundColor: COLORS.white}]}>
            <FastImage
              source={{uri: getImageURL(item?.profileUrlId)}}
              style={[styles?.noImage, styles?.marginTop]}
            />
          </Column>
        ) : (
          <Column colStyle={styles?.noImageBox}>
            <FastImage source={IMAGES.NoImage} style={styles?.noImage} />
          </Column>
        )}
      </Column>

      <Column colWidth={'85%'} colStyle={styles?.flexPadding}>
        <Row justify="space-between">
          <CustomTextNew text={employeeName} txtStyle={styles?.empName} />
        </Row>

        {amount ? (
          <Row>
            <CustomTextNew text={amount} txtStyle={styles?.smallTxt} />
          </Row>
        ) : null}
        {effectiveDate ? (
          <Row>
            <CustomTextNew text={effectiveDate} txtStyle={styles?.smallTxt} />
          </Row>
        ) : null}

        <Row justify="space-between">
          <CustomTextNew text={applicationDate} txtStyle={styles?.smallTxt} />
          <Column colStyle={styles?.status}>
            <CustomTextNew
              text={item?.status ?? item?.applicationInformation?.status}
              txtStyle={[
                {
                  color: getStatusColor('pending'),
                  backgroundColor: getStatusBgColor('pending'),
                },
                styles?.statusTxt,
              ]}
            />
          </Column>
        </Row>
      </Column>

      {item?.isActive && (
        <MIcon name="check-circle" size={23} color={COLORS.primary} />
      )}
    </Row>
  );
};

export default CommonApprovalMainIndexCard;
const styles = StyleSheet.create({
  noImageBox: {
    height: 45,
    width: 45,
    borderRadius: 100,
    overflow: 'hidden',
    backgroundColor: '#DCDCDC',
  },
  noImage: {
    marginTop: 6,
    height: 45,
    width: 45,
    alignSelf: 'center',
  },
  status: {
    borderRadius: 100,
    paddingVertical: 1,
    alignSelf: 'flex-end',
    overflow: 'hidden',
  },
  empName: {
    fontSize: 16,
    fontWeight: '500',
    width: '85%',
    color: COLORS.textNewColor,
    lineHeight: 24,
  },
  marginTop: {
    marginTop: 0,
  },
  flexPadding: {
    flex: 1,
    paddingLeft: 8,
  },
  smallTxt: {
    fontSize: 14,
    color: COLORS.textNewColor,
  },
  statusTxt: {
    borderRadius: 100,
    paddingHorizontal: 8,
  },
});
