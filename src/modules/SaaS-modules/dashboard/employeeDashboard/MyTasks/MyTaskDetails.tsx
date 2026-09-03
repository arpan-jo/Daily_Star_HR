/* eslint-disable react-native/no-inline-styles */
import {useNavigation, useRoute} from '@react-navigation/native';
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


const edges: Edge[] = ['right', 'bottom', 'left'];

const MyTaskDetails = () => {
  const navigation = useNavigation();
  const route: any = useRoute();
  const {details} = route.params || {};
  const getStatus = (str: string | null | undefined) => {
    let color;
    if (str === 'Schedule') {
      color = '#05A5CE';
    } else if (str === 'Delegate') {
      color = '#EAAA08';
    } else if (str === 'Do First') {
      color = COLORS.primary;
    } else {
      color = COLORS.lightGray2;
    }
    return color;
  };

  return (
    <ContainerNew
      edges={edges}
      header={
        <CustomHeader title="Task Details" onBackPress={navigation.goBack} />
      }
      style={styles.container}>
      <Row direction="column" rowStyle={[styles.row]}>
        <Column colWidth="100%">
          <Row>
            <Column colWidth="100%">
              <Row>
                <CustomTextNew
                  txtStyle={styles.titleText}
                  text={details?.strTaskName || ''}
                />
              </Row>
              <Row>
                <Column colWidth="90%">
                  <Row align="center" rowStyle={{marginTop: 5}}>
                    <MIcon
                      name="sticky-note-2"
                      color={COLORS.primary}
                      size={16}
                      style={styles.stickyNoteStyle}
                    />
                    <CustomTextNew
                      text={details?.strDifficulty || ''}
                      txtStyle={styles.textSub}
                    />
                    <View style={styles.verticalBar} />
                    <MCIcon
                      name="clock-fast"
                      size={16}
                      color={'#667085'}
                      style={styles.stickyNoteStyle}
                    />
                    <CustomTextNew
                      text={details?.strFrequency}
                      subTxt
                      txtSize={12}
                    />
                  </Row>
                  <Row
                    align="center"
                    rowStyle={{marginTop: 5, marginBottom: 8}}>
                    <CustomTextNew
                      txtStyle={styles.staticChip}
                      text={details?.roleName}
                    />
                    <Column
                      colStyle={[
                        {
                          backgroundColor: getStatus(details?.priority),
                        },
                        styles.status,
                      ]}>
                      <CustomTextNew
                        txtStyle={styles.stsTxt}
                        text={details?.priority || 'N/A'}
                      />
                    </Column>
                  </Row>
                </Column>
                <Column colWidth="10%" colStyle={styles.iconRight}>
                  <MIcon name="more-vert" size={24} color={'#667085'} />
                </Column>
              </Row>
              {/* new design  */}
              {/* <Row style={styles.mainRow}>
                <TouchableOpacity
                  style={styles.subContent}
                  onPress={() => navigation.navigate('SopBusinessTaskIndex')}>
                  <View style={{marginRight: 5}}>
                    <MCIcon
                      name="file-document-outline"
                      size={15}
                      color={COLORS.deepGray}
                    />
                  </View>
                  <View>
                    <CustomTextNew
                      txtColor={COLORS.black}
                      text={'SOP'}
                      txtSize={12}
                      txtWeight={'400'}
                    />
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.subContent}
                  onPress={() =>
                    navigation.navigate('PolicyBusinessTaskIndex')
                  }>
                  <View style={{marginRight: 5}}>
                    <MIcon
                      name="receipt-long"
                      size={15}
                      color={COLORS.deepGray}
                    />
                  </View>
                  <View>
                    <CustomTextNew
                      text={'Policy'}
                      txtColor={COLORS.black}
                      txtSize={12}
                      txtWeight={'400'}
                    />
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.subContent}
                  onPress={() =>
                    navigation.navigate('WorkflowBusinessTaskIndex')
                  }>
                  <View style={{marginRight: 5}}>
                    <MCIcon
                      name="family-tree"
                      size={15}
                      color={COLORS.deepGray}
                    />
                  </View>
                  <View>
                    <CustomTextNew
                      txtColor={COLORS.black}
                      text={'Workflow'}
                      txtSize={12}
                      txtWeight={'400'}
                    />
                  </View>
                </TouchableOpacity>
              </Row> */}
            </Column>
          </Row>
        </Column>
        <View style={styles.horizontalBar} />
        <Column colWidth="100%">
          <CustomTextNew text="System" subTxt txtSize={12} />
          <CustomTextNew
            text={details?.strTaskName}
            txtStyle={styles.rowTextTitle}
          />
        </Column>
        <View style={styles.horizontalBar} />
        <Column colWidth="100%">
          <CustomTextNew text="Process" subTxt txtSize={12} />
          <CustomTextNew
            text={details?.strVca || ''}
            txtStyle={styles.rowTextTitle}
          />
        </Column>
        <View style={styles.horizontalBar} />
        <Column colWidth="100%">
          <CustomTextNew text="Activity" subTxt txtSize={12} />
          <CustomTextNew
            text={details?.emproleWiseActivity || 'N/A'}
            txtStyle={styles.rowTextTitle}
          />
        </Column>
        <View style={styles.horizontalBar} />
        <Column colWidth="100%">
          <CustomTextNew text="Business Rules" subTxt txtSize={12} />
          <CustomTextNew
            text={details?.empRoleWiseBusinessRules || 'N/A'}
            txtStyle={styles.rowTextTitle}
          />
        </Column>
        <View style={styles.horizontalBar} />

        <Column colWidth="100%">
          <CustomTextNew text="Frequency" subTxt txtSize={12} />
          <CustomTextNew
            text={details?.strFrequency || 'N/A'}
            txtStyle={styles.rowTextTitle}
          />
        </Column>
        <View style={styles.horizontalBar} />
        <Column colWidth="100%">
          <CustomTextNew text="Importance" subTxt txtSize={12} />
          <CustomTextNew
            text={details?.strImportance || 'N/A'}
            txtStyle={styles.rowTextTitle}
          />
        </Column>
        <View style={styles.horizontalBar} />
        <Column colWidth="100%">
          <CustomTextNew text="Difficulity" subTxt txtSize={12} />
          <CustomTextNew
            text={details?.strDifficulty || 'N/A'}
            txtStyle={styles.rowTextTitle}
          />
        </Column>
        <View style={styles.horizontalBar} />
        {/* <Column colWidth="100%">
          <CustomTextNew text="Assign to" subTxt txtSize={12} />
          <Row rowStyle={styles.imageCard}>
            <Column colWidth="20%">
              <FastImage source={IMAGES.NoImage} style={styles.leftSideImage} />
            </Column>
            <Column colWidth="80%">
              <CustomTextNew
                text="Wahed Khan Niloy"
                txtSize={14}
                txtColor="#101828"
              />
              <CustomTextNew
                text="297581, Head of Production"
                subTxt
                txtSize={12}
              />
              <CustomTextNew text="PRDLead005" subTxt txtSize={12} />
            </Column>
          </Row>
          <Row rowStyle={styles.imageCard}>
            <Column colWidth="20%">
              <FastImage source={IMAGES.NoImage} style={styles.leftSideImage} />
            </Column>
            <Column colWidth="80%">
              <CustomTextNew
                text="Imran Uddin"
                txtSize={14}
                txtColor="#101828"
              />
              <CustomTextNew
                text="297581, Head of Production"
                subTxt
                txtSize={12}
              />
              <CustomTextNew text="PRDLead005" subTxt txtSize={12} />
            </Column>
          </Row>
        </Column> */}
      </Row>
    </ContainerNew>
  );
};

export default MyTaskDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 0,
  },
  row: {
    paddingHorizontal: 16,
    paddingVertical: 16,
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
    marginLeft: 8,
  },
  stickyNoteStyle: {
    marginHorizontal: 4,
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
    color: COLORS.black,
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
});
