/* eslint-disable react-native/no-inline-styles */
import {useIsFocused, useNavigation} from '@react-navigation/native';
import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {Edge} from 'react-native-safe-area-context';
import {useRootStore} from '../../../../../stores/rootStore';
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import MIcon from 'react-native-vector-icons/MaterialIcons';
import ContainerNew from '../../../../../common/components/Container';
import CustomHeader from '../../../../../common/components/CustomHeader';
import CustomTextNew from '../../../../../common/components/CustomText';
import {COLORS} from '../../../../../common/constant/Themes';
import Row from '../../../../../common/components/Row';
import Column from '../../../../../common/components/Column';
import useAsyncEffect from '../../../../../common/packages/useAsyncEffect/useAsyncEffect';

const edges: Edge[] = ['right', 'bottom', 'left'];
const dummyInfo = [
  {
    title: 'Title',
    subTitle: 'SOP for Housekeeping',
    id: 1,
  },
  {
    title: 'Doc No.',
    subTitle: 'SOP/FAC/HR/02',
    id: 2,
  },
  {
    title: 'Version No',
    subTitle: '01',
    id: 3,
  },
  {
    title: 'Superseds',
    subTitle: 'None',
    id: 4,
  },
  {
    title: 'Issue Date',
    subTitle: '23 Sepetember,2023',
    id: 5,
  },
  {
    title: 'Effective Date',
    subTitle: '24 September,2023',
    id: 6,
  },
  {
    title: 'Review Date',
    subTitle: '11 October,2023',
    id: 7,
  },
];

const PolicyBusinessTaskIndex = () => {
  const isFocused = useIsFocused();
  const navigation = useNavigation();
  const {userInfo: _userInfo} = useRootStore();
  useAsyncEffect(
    async isMounted => {
      if (!isMounted()) {
        return null;
      }
      //api call here
      // console.log(userInfo);
    },
    [isFocused],
  );
  return (
    <ContainerNew
      edges={edges}
      header={<CustomHeader title="Policy" onBackPress={navigation.goBack} />}
      style={{flex: 1}}>
      {/* section 1  */}
      <Row style={styles.row1}>
        <CustomTextNew
          text={'Monthly sales forecast receive from sales'}
          lineHight={24}
          txtSize={18}
          txtColor={COLORS.black}
          txtWeight={500}
        />

        <Row>
          <Column style={{flex: 1}}>
            <Row align="center" rowStyle={{marginTop: 5}}>
              <MIcon
                name="sticky-note-2"
                color={COLORS.primary}
                size={16}
                style={styles.stickyNoteStyle}
              />
              <CustomTextNew
                text={'High Importance'}
                txtStyle={styles.textSub}
              />
              <View style={styles.verticalBar} />
              <MCIcon
                name="clock-fast"
                size={16}
                color={'#667085'}
                style={styles.stickyNoteStyle}
              />
              <CustomTextNew text={'Monthly Frequency'} subTxt txtSize={12} />
            </Row>
            <Row align="center" rowStyle={{marginTop: 5, marginBottom: 8}}>
              <View style={styles.staticChip}>
                <CustomTextNew
                  text={'SALESXEC002'}
                  txtSize={13}
                  txtWeight={'500'}
                  lineHight={20}
                />
              </View>
              <Column
                colStyle={[
                  {
                    backgroundColor: COLORS.primary,
                  },
                  styles.status,
                ]}>
                <CustomTextNew
                  txtStyle={styles.stsTxt}
                  txtColor={COLORS.white}
                  text={'Do First'}
                />
              </Column>
            </Row>
          </Column>
          <Column colWidth="10%" colStyle={styles.iconRight}>
            <MIcon name="more-vert" size={24} color={'#667085'} />
          </Column>
        </Row>

        <TouchableOpacity style={styles.pdfButton}>
          <View>
            <MIcon name="picture-as-pdf" size={16} color={COLORS.darkGray} />
          </View>
          <View style={{marginHorizontal: 4}}>
            <CustomTextNew
              text={'Policy Pdf View'}
              txtSize={13}
              txtColor={COLORS.black}
            />
          </View>
          <View>
            <MIcon name="arrow-forward" size={15} color={COLORS.darkGray} />
          </View>
        </TouchableOpacity>
      </Row>
      <View style={styles.underLine} />

      {/* section 2  */}
      <Row style={styles.row1}>
        <CustomTextNew
          text={'AKIJ ESSENTIAL LIMITED'}
          lineHight={24}
          txtSize={18}
          txtColor={COLORS.black}
          txtWeight={500}
        />
        {dummyInfo.map((item, index) => (
          <Row
            style={[
              styles.infoContainer,
              {borderBottomWidth: dummyInfo?.length - 1 === index ? 0 : 1},
            ]}
            key={index}>
            <Column style={{flex: 0.5}}>
              <CustomTextNew
                text={item?.title}
                lineHight={20}
                txtColor={COLORS.graySubText}
                txtSize={14}
              />
            </Column>
            <Column style={{flex: 1}}>
              <CustomTextNew
                text={item?.subTitle}
                lineHight={20}
                txtColor={COLORS.black}
                txtSize={14}
              />
            </Column>
          </Row>
        ))}
      </Row>
      <View style={styles.underLine} />

      {/* section 3  */}
      <Row style={styles.row1}>
        <CustomTextNew
          text={'1. Objective'}
          lineHight={24}
          txtSize={18}
          txtColor={COLORS.black}
          txtWeight={500}
        />
        <CustomTextNew
          text={
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip'
          }
          lineHight={20}
          txtSize={13}
          txtColor={COLORS.black}
        />
      </Row>
      <View style={styles.underLine} />

      {/* section 4  */}
      <View style={styles.row1}>
        <CustomTextNew
          text={'2. Scope'}
          lineHight={24}
          txtSize={18}
          txtColor={COLORS.black}
          txtWeight={500}
        />
        <View style={{marginBottom: 10}}>
          <CustomTextNew
            text={
              'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat'
            }
            lineHight={20}
            txtSize={13}
            txtColor={COLORS.black}
          />
        </View>
        {/* {[1, 2, 3, 4].map(item => (
          <Row
            key={item}
            align="center"
            style={{marginTop: 5, flexDirection: 'row', alignItems: 'center'}}>
            <Entypo name="dot-single" size={20} color={COLORS.black} />
            <CustomTextNew
              text={'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'}
              lineHight={18}
              txtSize={13}
              txtColor={COLORS.black}
            />
          </Row>
        ))} */}
      </View>
      <View style={styles.underLine} />

      {/* section 5  */}
      <Row style={styles.row1}>
        <CustomTextNew
          text={'3. Responsibility/Accountabilities'}
          lineHight={24}
          txtSize={18}
          txtColor={COLORS.black}
          txtWeight={500}
        />

        {[1, 2, 3, 4].map(item => (
          <Row
            key={item}
            align="center"
            style={{marginTop: 5, flexDirection: 'row', alignItems: 'center'}}>
            <CustomTextNew
              text={`3.${item}.`}
              lineHight={18}
              txtSize={13}
              txtWeight={'500'}
              txtColor={COLORS.black}
            />

            <CustomTextNew
              text={' Lorem ipsum dolor sit amet, consectetur adipiscing elit.'}
              lineHight={18}
              txtSize={13}
              txtColor={COLORS.black}
            />
          </Row>
        ))}
      </Row>
      <View style={styles.underLine} />

      {/* section 6  */}

      <View style={styles.row1}>
        <CustomTextNew
          text={'4. Abbreviation and Definition'}
          lineHight={24}
          txtSize={18}
          txtColor={COLORS.black}
          txtWeight={500}
        />

        <Text style={{marginVertical: 8}}>
          <Text style={[styles.normalFont, {fontWeight: '500'}]}>
            Business Formal:{' '}
          </Text>
          <Text style={[styles.italicFont, {fontStyle: 'normal'}]}>
            Business suits if possible, however, blazers can be worn with dress
            slacks or nice khaki/formal pants, formal shoes, formal , collared
            shirt (solid colour white). Wearing a tie is requirement for men in
            a business professional dress code
          </Text>
        </Text>
        <Text style={{marginVertical: 8}}>
          <Text style={[styles.normalFont, {fontWeight: '500'}]}>
            Business Formal:{' '}
          </Text>
          <Text style={[styles.italicFont, {fontStyle: 'normal'}]}>
            Business suits if possible, however, blazers can be worn with dress
            slacks or nice khaki/formal pants, formal shoes, formal , collared
            shirt (solid colour white). Wearing a tie is requirement for men in
            a business professional dress code
          </Text>
        </Text>
      </View>
      <View style={styles.underLine} />

      {/* section 7  */}
      <Row style={styles.row1}>
        <CustomTextNew
          text={'5. Policy Based on Position & Job'}
          lineHight={24}
          txtSize={18}
          txtColor={COLORS.black}
          txtWeight={500}
        />

        <View style={{marginVertical: 5}}>
          <CustomTextNew
            text={'5.1 Management Emploee Dress Code'}
            lineHight={20}
            txtSize={15}
            txtWeight={'500'}
            txtColor={COLORS.black}
          />
        </View>
      </Row>
      <View style={styles.underLine} />

      {/* section 8  */}
      <Row style={styles.row1}>
        <CustomTextNew
          text={'6. Instructions Need to Be followed'}
          lineHight={24}
          txtSize={18}
          txtColor={COLORS.black}
          txtWeight={500}
        />
        <View style={{marginVertical: 5}}>
          {['a', 'b', 'c', 'd'].map(item => (
            <Row
              key={item}
              align="center"
              style={{
                marginTop: 5,
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <CustomTextNew
                text={`(${item}). `}
                lineHight={18}
                txtSize={13}
                txtWeight={'500'}
                txtColor={COLORS.black}
              />

              <CustomTextNew
                text={
                  ' Lorem ipsum dolor sit amet, consectetur adipiscing elit.'
                }
                lineHight={18}
                txtSize={13}
                txtColor={COLORS.black}
              />
            </Row>
          ))}
        </View>
      </Row>
      <View style={styles.underLine} />
    </ContainerNew>
  );
};

export default PolicyBusinessTaskIndex;

const styles = StyleSheet.create({
  row1: {
    paddingHorizontal: 16,
    paddingVertical: 10,
  },

  titleText: {
    fontSize: 24,
    color: '#101828',
    fontWeight: '500',
    lineHeight: 28,
  },
  staticChip: {
    backgroundColor: '#EAECF0',
    borderRadius: 99,
    fontSize: 12,
    color: '#000',
    fontWeight: '400',
    lineHeight: 16,
    paddingHorizontal: 8,
    paddingVertical: 4,
    // marginLeft: 8,
  },
  stickyNoteStyle: {
    marginRight: 4,
  },

  textSub: {
    fontSize: 12,
    color: COLORS.primary,
    fontWeight: '400',
    lineHeight: 16,
  },
  verticalBar: {
    width: 1,
    height: 12,
    backgroundColor: '#667085',
    marginHorizontal: 4,
  },
  status: {
    borderRadius: 50,
    paddingHorizontal: 4,
    alignItems: 'center',
    marginLeft: 12,
    paddingVertical: 1,
  },
  stsTxt: {
    fontSize: 12,
    fontWeight: '400',
    lineHeight: 16,
    color: COLORS.white,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  iconRight: {
    marginLeft: 12,
    marginTop: 24,
  },
  horizontalBar: {
    width: '100%',
    height: 2,
    backgroundColor: '#EAECF0',
    marginVertical: 8,
  },
  rowTextTitle: {
    fontSize: 16,
    color: '#101828',
    fontWeight: '400',
    lineHeight: 20,
    marginTop: 4,
  },
  leftSideImage: {
    width: 45,
    height: 45,
    borderRadius: 100,
  },
  imageCard: {
    backgroundColor: '#F2F4F7',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginTop: 8,
  },
  mainRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
    flexWrap: 'wrap',
  },
  subContainer: {
    backgroundColor: COLORS.lightGray3,
    paddingHorizontal: 5,
    paddingVertical: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginRight: 5,
  },
  iconContainer: {flexDirection: 'row', alignItems: 'center', marginRight: 5},
  subContent: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    backgroundColor: COLORS.white,
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    alignItems: 'center',
    marginRight: 5,
  },
  pdfButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 30,
    borderWidth: 1,
    width: 140,
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderColor: COLORS.lightGray,
    marginVertical: 8,
    backgroundColor: '#f2f4f7',
  },
  underLine: {borderBottomWidth: 5, borderBottomColor: COLORS.lightGray3},
  infoContainer: {
    flexDirection: 'row',
    marginVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray3,
    paddingVertical: 2,
  },
  imgRow: {flexDirection: 'row', alignItems: 'center', marginTop: 5},
  profileImg: {height: 30, width: 30, borderRadius: 100},
  normalFont: {
    fontSize: 15,
    color: COLORS.black,
    lineHeight: 20,
    marginBottom: 5,
  },
  italicFont: {
    fontSize: 15,
    color: COLORS.graySubText,
    lineHeight: 20,
    fontStyle: 'italic',
    marginBottom: 5,
  },
});
