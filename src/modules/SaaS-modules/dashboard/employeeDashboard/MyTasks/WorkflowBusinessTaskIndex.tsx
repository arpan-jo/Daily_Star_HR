import {useIsFocused, useNavigation} from '@react-navigation/native';
import React from 'react';
import {StyleSheet, View} from 'react-native';
import {Edge} from 'react-native-safe-area-context';
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import MIcon from 'react-native-vector-icons/MaterialIcons';
import Column from '../../../../../common/components/Column';
import ContainerNew from '../../../../../common/components/Container';
import CustomHeader from '../../../../../common/components/CustomHeader';
import CustomTextNew from '../../../../../common/components/CustomText';
import Row from '../../../../../common/components/Row';
import {COLORS} from '../../../../../common/constant/Themes';
import {useRootStore} from '../../../../../stores/rootStore';
import useAsyncEffect from '../../../../../common/packages/useAsyncEffect/useAsyncEffect';
const edges: Edge[] = ['right', 'bottom', 'left'];

const WorkflowBusinessTaskIndex = () => {
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
      header={<CustomHeader title="Workflow" onBackPress={navigation.goBack} />}
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
      </Row>
      <View style={styles.underLine} />
      <Row style={styles.row1}>
        <View style={{marginBottom: 20}}>
          <CustomTextNew
            text={'Workflow'}
            lineHight={24}
            txtSize={18}
            txtColor={COLORS.black}
            txtWeight={500}
          />
        </View>
        <View style={styles.workfolwTitle}>
          <CustomTextNew
            text={'Start'}
            lineHight={24}
            txtSize={13}
            txtColor={COLORS.black}
            // txtWeight={500}
          />
        </View>
        <View style={styles.verticalLine}>
          <View style={styles.mainWorkflowContainer}>
            <View style={styles.textContainer}>
              <CustomTextNew
                text={'Receives Request by Google Form'}
                lineHight={24}
                txtSize={14}
                txtColor={COLORS.black}
                // txtWeight={500}
              />
            </View>
            <View style={styles.bullentPoint} />
          </View>
          <View style={styles.mainWorkflowContainer}>
            <View style={styles.textContainer}>
              <CustomTextNew
                text={'Verify employee information'}
                lineHight={24}
                txtSize={14}
                txtColor={COLORS.black}
                // txtWeight={500}
              />
            </View>
            <View style={styles.bullentPoint} />
          </View>
          <View style={styles.mainWorkflowContainer}>
            <View style={styles.textContainer}>
              <CustomTextNew
                text={
                  'Generate salary certificate in PeopleDesk or Google Docs'
                }
                lineHight={24}
                txtSize={14}
                txtColor={COLORS.black}
                // txtWeight={500}
              />
            </View>
            <View style={styles.bullentPoint} />
          </View>
          <View style={styles.mainWorkflowContainer}>
            <View style={styles.textContainer}>
              <CustomTextNew
                text={'Forward to the employee'}
                lineHight={24}
                txtSize={14}
                txtColor={COLORS.black}
                // txtWeight={500}
              />
            </View>
            <View style={styles.bullentPoint} />
          </View>
        </View>

        <View style={styles.workfolwTitle}>
          <CustomTextNew
            text={'End'}
            lineHight={24}
            txtSize={13}
            txtColor={COLORS.black}
            // txtWeight={500}
          />
        </View>
      </Row>
    </ContainerNew>
  );
};

export default WorkflowBusinessTaskIndex;

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
  workfolwTitle: {
    borderWidth: 1,
    borderRadius: 20,
    borderColor: COLORS.black,
    width: 60,
    paddingVertical: 5,
    justifyContent: 'center',
    alignItems: 'center',
    // marginTop: 20,
  },
  verticalLine: {
    marginLeft: '5%',
    borderLeftWidth: 1,
    borderColor: COLORS.lightGray,
    borderStyle: 'dashed',
    paddingVertical: 10,
  },
  mainWorkflowContainer: {
    borderTopWidth: 1,
    paddingBottom: 10,
    marginVertical: 10,
    position: 'relative',
    width: '95%',
    borderTopRightRadius: 70,
    borderBottomRightRadius: 100,
    borderColor: COLORS.lightGray,
    // overflow: 'hidden',
  },
  textContainer: {
    borderWidth: 1,
    marginLeft: 20,
    padding: 10,
    borderTopRightRadius: 100,
    borderBottomRightRadius: 100,
    borderBottomLeftRadius: 100,
    borderTopWidth: 0,
    borderColor: COLORS.lightGray,
    backgroundColor: COLORS.lightGray3,
    // overflow: 'hidden',
  },
  bullentPoint: {
    height: 15,
    width: 15,
    backgroundColor: COLORS.primary,
    position: 'absolute',
    borderRadius: 100,
    left: -8,
    top: -8,
  },
});
