import {useNetInfo} from '@react-native-community/netinfo';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import React, {useState} from 'react';
import {StyleSheet, View} from 'react-native';
import FastImage from 'react-native-fast-image';
import {Edge} from 'react-native-safe-area-context';
import MIcon from 'react-native-vector-icons/MaterialIcons';
import {useRootStore} from '../../../../stores/rootStore';
import {getMenuData} from '../../../../services/arl-core-modules/services';
import {getContactLanding} from '../../../../services/SaaS-modules/contact/contact';
import ContainerNew from '../../../../common/components/Container';
import CustomHeader from '../../../../common/components/CustomHeader';
import Row from '../../../../common/components/Row';
import CustomTextNew from '../../../../common/components/CustomText';
import Column from '../../../../common/components/Column';
import {
  getBgColorByLabelOnHrCore,
  getIconByLabelOnHrCore,
} from '../../../SaaS-modules/application/ApplicationCommonFunction';
import {COLORS, SIZES} from '../../../../common/constant/Themes';
import {getImageURL} from '../../../../common/services/getImage';
import {IMAGES} from '../../../../common/constant/Index';
import CustomButtonNew from '../../../../common/components/CustomButton';
import {useToast} from '../../../../common/components/CustomToast';
import useAsyncEffect from '../../../../common/packages/useAsyncEffect/useAsyncEffect';

const edges: Edge[] = ['right', 'left'];

const HrCoreApplicationMainIndex = () => {
  const {userInfo} = useRootStore();

  const isFocused = useIsFocused();
  const navigation = useNavigation();
  const toaster = useToast();
  const netInfo = useNetInfo();
  const [, setIsLoading] = useState(false);
  const [leaveMenu, setLeaveMenu] = useState([]);
  const [allEmpList, setAllEmpList] = useState<any>([]);

  useAsyncEffect(
    async isMounted => {
      if (!isMounted()) {
        return null;
      }

      const menuData = await getMenuData(userInfo?.intUserId, setIsLoading);
      const applicationData =
        menuData &&
        menuData?.filter((item: any) => item?.label?.trim() === 'HR Core');
      if (applicationData?.length > 0) {
        setLeaveMenu(applicationData[0]?.childList);
      }
      getAllEmpData(userInfo?.intBusinessUnitId);
    },
    [isFocused, netInfo?.isConnected],
  );

  const getAllEmpData = async (buInt: any) => {
    const res = await getContactLanding(
      userInfo?.intAccountId,
      buInt,
      setIsLoading,
      '',
      userInfo?.intEmployeeId,
    );
    setAllEmpList(res);
  };

  return (
    <ContainerNew
      edges={edges}
      scrollEnabled={true}
      header={
        <CustomHeader
          title="HR Core"
          alterIcon={'widgets'}
          alterIconPress={() => navigation.goBack()}
        />
      }
      style={styles.container}>
      <Row direction="row" rowStyle={styles.mainRow}>
        <Row>
          {leaveMenu?.length > 0 && (
            <CustomTextNew text={'Applications'} txtStyle={styles.mainTxt} />
          )}
        </Row>
        {leaveMenu?.map((item: any, index) => (
          <Column
            isPressOn={false}
            onCardPress={() => {
              if (item?.label?.trim() === 'Leave') {
                navigation.navigate('LeaveApplicationMainIndex', {
                  empLeaveData: {isLeaveCreate: true},
                });
              } else if (item?.label?.trim() === 'Movement') {
                navigation.navigate('MovementApplicationMainIndex', {
                  empLeaveData: {isMovementCreate: true},
                });
              } else if (item?.label?.trim() === 'Attendance') {
                navigation.navigate('RemoteAttendanceMainIndex');
              } else if (item?.label?.trim() === 'Market Visit') {
                navigation.navigate('MarketVisitMainIndex');
              } else if (item?.label?.trim() === 'Att. Adjust') {
                navigation.navigate('AttendanceAdjustmentMainIndex');
              } else if (item?.label === 'Location & Device') {
                navigation.navigate('LocationAndDeviceMainIndex');
              } else if (item?.label === 'e-Presence') {
                navigation.navigate('LocationAndDeviceMainIndex');
              } else if (item?.label?.trim() === 'IOU') {
                navigation.navigate('IOUApplicationMainIndex');
              } else if (item?.label?.trim() === 'Loan') {
                navigation.navigate('LoanApplicationMainIndex');
              } else if (item?.label?.trim() === 'Directory') {
                navigation.navigate('EmployeeDirectory');
              } else if (item?.label?.trim() === 'Meeting') {
                navigation.navigate('MettingAgendaMainIndex');
              } else if (item?.label?.trim() === 'Task') {
                navigation.navigate('TodoMasterMainIndex');
              } else if (item?.label?.trim() === 'Expense') {
                navigation.navigate('ExpenseApplicationMainIndex');
              } else if (item?.label?.trim() === 'Adv. Expense') {
                navigation.navigate('AdvanceExpenseMainIndex');
              } else {
                toaster.show({message: 'Coming soon...', type: 'success'});
              }
            }}
            colWidth="25%"
            key={index}
            colStyle={styles.pad}>
            <Row direction="row" justify="center" align="center">
              <Column
                colStyle={[
                  {
                    backgroundColor:
                      getBgColorByLabelOnHrCore(item?.label) || '',
                  },
                  styles.iconDesign,
                ]}>
                <MIcon
                  name={`${getIconByLabelOnHrCore(item?.label)}`}
                  color={COLORS.white}
                  size={24}
                />
              </Column>
            </Row>
            <CustomTextNew text={item.label} txtAlign={'center'} txtSize={12} />
          </Column>
        ))}
      </Row>
      {userInfo?.isSupNLMORManagement ? (
        <>
          <Column style={styles.bottomBorder} />
          <Column colWidth="100%" colStyle={styles.cardStyle}>
            <CustomTextNew
              text="Employee Management"
              txtStyle={styles.titleTxt}
            />
            <CustomTextNew
              subTxt
              text="Happy employees, thriving company: Mastering employee management."
            />
            <Row rowStyle={styles.marginTop10}>
              <Column colWidth="65%" colStyle={styles.directionStyle}>
                {allEmpList?.slice(0, 5).map((item: any, index: number) => (
                  <View
                    key={index}
                    // eslint-disable-next-line react-native/no-inline-styles
                    style={{
                      marginLeft: index === 0 ? 0 : -16,
                    }}>
                    <FastImage
                      source={
                        item?.intProfilePicFileUrlId
                          ? {
                              uri: getImageURL(item?.intProfilePicFileUrlId),
                            }
                          : IMAGES.NoImage
                      }
                      style={styles.profileImage}
                    />
                  </View>
                ))}
              </Column>
              <Column colWidth="35%">
                <CustomButtonNew
                  onBtnPress={() => navigation.navigate('EmpManagement')}
                  btnText="Explore More"
                  btnstyle={styles.exploreBtnStyle}
                  btnTextStyle={styles.exploreBtnTextStyle}
                />
              </Column>
            </Row>
          </Column>
        </>
      ) : null}
    </ContainerNew>
  );
};

export default HrCoreApplicationMainIndex;

export const hrCoreApplicationStyle = StyleSheet.create({
  mainTxt: {
    color: COLORS.textNewColor,
    fontWeight: '500',
    fontSize: 16,
    lineHeight: 24,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  iconDesign: {
    marginVertical: 4,
    padding: 8,
    borderRadius: 50,
  },
  pad: {
    padding: 8,
  },
  mainRow: {
    flexWrap: 'wrap',
    paddingTop: 5,
    backgroundColor: COLORS.white,
    paddingBottom: 16,
  },

  titleTxt: {
    color: '#101828',
    fontWeight: '500',
    fontSize: 16,
    lineHeight: 24,
    paddingVertical: 8,
  },
  cardStyle: {
    padding: 16,
    backgroundColor: COLORS.white,
  },

  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 50,
    backgroundColor: COLORS.iconGrayBackground,
    borderWidth: 1,
    borderColor: COLORS.white,
  },
});

const styles = StyleSheet.create({
  ...hrCoreApplicationStyle,
  container: {
    flex: 1,
    height: SIZES.height,
    paddingHorizontal: 0,
    backgroundColor: COLORS.white,
  },

  marginTop10: {
    marginTop: 10,
  },
  exploreBtnStyle: {
    backgroundColor: COLORS.white,
    borderColor: COLORS.primary,
    borderWidth: 1,
  },
  exploreBtnTextStyle: {
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 20,
    color: COLORS.primary,
  },
  directionStyle: {
    flexDirection: 'row',
  },
  bottomBorder: {
    height: 8,
    backgroundColor: COLORS.iconGrayBackground,
  },
});
