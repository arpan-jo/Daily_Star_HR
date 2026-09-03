import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import ViewShot from 'react-native-view-shot';
import FastImage from 'react-native-fast-image';
import QRCode from 'react-native-qrcode-svg';
import Foundation from 'react-native-vector-icons/Foundation';
import {IMAGES} from '../constant/Index';
import {SIZES, COLORS} from '../constant/Themes';
import Row from './Row';

interface Props {
  phoneNumber: string;
  emailAddress: string;
  strDesignation?: string | null;
  userInfo: {
    strDisplayName?: string | null;
    intBusinessUnitId?: number | null;
  };
  resURL: {
    sharingLink: string;
  };
  viewShotRef?: React.Ref<ViewShot>;
}

const CustomVisitingCard: React.FC<Props> = ({
  phoneNumber,
  emailAddress,
  strDesignation,
  userInfo,
  resURL,
  viewShotRef,
}) => {
  if (!phoneNumber || !emailAddress) return null;

  const renderCard = () => {
    const qrCode = (
      <QRCode value={resURL?.sharingLink} size={SIZES.width / 6.3} />
    );

    const commonContent = (
      <View style={styles.dynamicContent}>
        <Text style={styles.titleTxt}>{userInfo?.strDisplayName || ''}</Text>
        <Text style={styles.designationTxt}>{strDesignation || ''}</Text>
        <View style={{marginTop: 5}}>
          <Row align="center">
            <Foundation name="telephone" color={COLORS.black} size={15} />
            <View style={{marginLeft: 5}}>
              <Text style={styles.numTxt}>{phoneNumber}</Text>
            </View>
          </Row>
          <Row align="center">
            <Foundation name="mail" color={COLORS.black} size={15} />
            <View style={{marginLeft: 5}}>
              <Text
                style={[
                  styles.numTxt,
                  {fontFamily: 'HelveticaNeue_Medium', fontSize: 11},
                ]}>
                {emailAddress}
              </Text>
            </View>
          </Row>
        </View>
      </View>
    );

    if (userInfo?.intBusinessUnitId === 232) {
      return (
        <View style={styles.cardContainer}>
          <FastImage
            source={IMAGES.feedVisitingCard2}
            style={styles.fullSizeImage}
            resizeMode="contain"
          />
          <View style={{position: 'absolute', right: 50, bottom: 40}}>
            {qrCode}
          </View>
          {commonContent}
          <View style={styles.feedWebInfo}>
            <Row align="center">
              <Foundation name="web" color={COLORS.black} size={15} />
              <View style={{marginLeft: 5}}>
                <Text style={styles.numTxt}>www.akijresource.com</Text>
              </View>
            </Row>
            <Row align="center">
              <Foundation name="mail" color={COLORS.black} size={15} />
              <View style={{marginLeft: 5}}>
                <Text
                  style={[
                    styles.numTxt,
                    {fontFamily: 'HelveticaNeue_Medium', fontSize: 11},
                  ]}>
                  info@akijresource.com
                </Text>
              </View>
            </Row>
          </View>
        </View>
      );
    }

    if (userInfo?.intBusinessUnitId === 225) {
      return (
        <View style={styles.cardContainer}>
          <FastImage
            source={IMAGES.akijAirVisitingCard}
            style={styles.fullSizeImage}
            resizeMode="contain"
          />
          <View style={styles.qrAir}>{qrCode}</View>
          {commonContent}
        </View>
      );
    }

    return (
      <View style={styles.cardContainer}>
        <FastImage
          source={IMAGES.visitingCardFront}
          style={styles.fullSizeImage}
          resizeMode="contain"
        />
        <View style={styles.qr}>{qrCode}</View>
        {commonContent}
      </View>
    );
  };

  return (
    <View style={{alignSelf: 'center', backgroundColor: COLORS.white}}>
      <ViewShot
        style={{
          backgroundColor: COLORS.white,
          width: SIZES.width,
          alignItems: 'center',
        }}
        //@ts-ignore
        ref={viewShotRef}
        options={{
          fileName: 'VCARD',
          format: 'jpg',
          quality: 0.9,
        }}>
        {renderCard()}
        {/* Card Back Side */}
        <View style={styles.cardContainer}>
          <FastImage
            source={IMAGES.visitingCardBack}
            style={styles.fullSizeImage}
            resizeMode="contain"
          />
        </View>
      </ViewShot>
    </View>
  );
};

export default CustomVisitingCard;

const styles = StyleSheet.create({
  cardContainer: {
    marginVertical: 10,
    backgroundColor: COLORS.white,
    height: 207,
    width: 332,
  },
  fullSizeImage: {
    height: '100%',
    width: '100%',
  },
  dynamicContent: {
    position: 'absolute',
    left: 40,
    bottom: 20,
  },
  titleTxt: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.black,
    lineHeight: 20,
    fontFamily: 'DIN_Bold',
  },
  designationTxt: {
    fontSize: 11.3,
    fontWeight: '500',
    color: COLORS.graySubText,
    lineHeight: 20,
    fontFamily: 'DIN_Medium',
  },
  numTxt: {
    fontSize: 11.3,
    fontWeight: '500',
    color: COLORS.black,
    fontFamily: 'DIN_Medium',
    lineHeight: 20,
  },
  qr: {
    position: 'absolute',
    right: 40,
    top: 30,
  },
  qrAir: {
    position: 'absolute',
    right: 12,
    bottom: 40,
  },
  feedWebInfo: {
    backgroundColor: 'white',
    position: 'absolute',
    top: 40,
    left: 30,
    paddingLeft: 10,
  },
});
