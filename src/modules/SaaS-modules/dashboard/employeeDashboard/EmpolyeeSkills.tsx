import {useIsFocused, useNavigation} from '@react-navigation/native';
import React, {useState} from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import {Edge} from 'react-native-safe-area-context';
import MCYI from 'react-native-vector-icons/MaterialCommunityIcons';
import ContainerNew from '../../../../common/components/Container';
import CustomHeader from '../../../../common/components/CustomHeader';
import CustomTextNew from '../../../../common/components/CustomText';
import Row from '../../../../common/components/Row';
import {COLORS} from '../../../../common/constant/Themes';
import {
  getEmployeeSkillLandingData,
  createEmployeeSkill,
} from '../../../../services/SaaS-modules/dashboard/employeeDashboard';
import {useRootStore} from '../../../../stores/rootStore';
import {useToast} from '../../../../common/components/CustomToast';
import useAsyncEffect from '../../../../common/packages/useAsyncEffect/useAsyncEffect';
const edges: Edge[] = ['right', 'bottom', 'left'];

const getStatusColor = (status?: string) => {
  switch (status) {
    case 'Beginner':
      return '#FEF7C3';
    case 'Intermediate':
      return '#E0F2FE';
    case 'Expert':
      return '#D1FADF';
    default:
      return '#FFFFFF';
  }
};

const EmpolyeeSkills = () => {
  const isFocused = useIsFocused();
  const navigation = useNavigation();
  const {userInfo} = useRootStore();
  const [skillsData, setSkillsData] = useState<any>([]);
  const toaster = useToast();
  const [isReload, setIsReload] = useState<boolean>(false);
  useAsyncEffect(
    async isMounted => {
      if (!isMounted()) {
        return null;
      }
      setIsReload(false);
      const skillData = await getEmployeeSkillLandingData(
        userInfo?.intEmployeeId,
      );
      if (skillData?.length) {
        setSkillsData(skillData);
      }
    },
    [isFocused, isReload],
  );

  const handleDelete = async (item: any) => {
    const payload = {
      skillid: item?.skillid,
      strSkillName: '',
      skillCategoryID: 0,
      description: '',
      employeeID: userInfo?.intEmployeeId,
      proficiencyLevel: '',
      isActive: false,
    };
    const res = await createEmployeeSkill(payload);
    setIsReload(true);

    if (res.statusCode === 200) {
      toaster.show({
        message: 'Deleted successfully!',
        type: 'success',
      });
    }
  };
  return (
    <ContainerNew
      edges={edges}
      isFloatBottomButton
      singleFloatBtmBtnPress={() => console.log('Hello')}
      header={<CustomHeader title="Skills" onBackPress={navigation.goBack} />}
      style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {skillsData?.length > 0 ? (
          <>
            {skillsData?.map((item: any) => (
              <Row key={item}>
                <Row style={styles.rowContainer}>
                  <Row style={styles.flexContainer}>
                    <Row rowWidth="80%">
                      <CustomTextNew
                        txtStyle={styles.txtStyle}
                        text={item?.strSkillName || 'N/A'}
                      />
                    </Row>
                    <Row rowWidth="16%" justify="space-between">
                      <MCYI
                        onPress={() => handleDelete(item)}
                        name="delete-outline"
                        style={styles.iconStyle}
                        size={20}
                        color={'#667085'}
                      />
                    </Row>
                  </Row>
                  <Row style={styles.iconStyle}>
                    <Row>
                      <CustomTextNew
                        txtStyle={styles.titleTxt}
                        text={item?.skillCategoryName}
                      />
                      <View
                        style={{
                          backgroundColor: getStatusColor(
                            item?.proficiencyLevel,
                          ),
                          width: 80,
                          //   alignSelf: 'flex-end',
                        }}>
                        <CustomTextNew
                          txtStyle={styles.statusTxt}
                          text={item?.proficiencyLevel}
                        />
                      </View>
                    </Row>
                    <Row>
                      <CustomTextNew
                        text={item?.description}
                        txtStyle={styles.descriptionTxt}
                      />
                    </Row>
                  </Row>
                </Row>
                <View style={styles.underLineStyle} />
              </Row>
            ))}
          </>
        ) : null}
      </ScrollView>
    </ContainerNew>
  );
};

export default EmpolyeeSkills;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 0,
  },
  rowContainer: {marginLeft: 10, padding: 10},
  flexContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  txtStyle: {
    fontSize: 16,
    fontWeight: '400',
    color: '#101828',
    lineHeight: 24,
  },
  titleTxt: {
    fontSize: 12,
    color: '#667085',
    backgroundColor: '#EAECF0',
    border: 1,
    borderRadius: 4,
    padding: 2,
  },
  statusTxt: {
    fontSize: 12,
    color: COLORS.black,
    border: 1,
    borderRadius: 4,
    padding: 2,
    textAlign: 'center',
  },
  descriptionTxt: {
    color: '#667085',
    marginTop: 4,
    overFlow: 'hidden',
    textOverflow: 'ellipsis',
    whaiteSpace: 'nowrap',
  },
  underLineStyle: {
    width: 4500,
    height: 1,
    backgroundColor: '#EAECF0',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,
  },
  iconStyle: {marginRight: 10},
});
