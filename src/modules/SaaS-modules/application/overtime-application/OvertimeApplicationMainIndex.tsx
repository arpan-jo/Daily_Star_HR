import {useIsFocused, useNavigation} from '@react-navigation/native';
import React, {useState} from 'react';
import {
  ActivityIndicator,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import {Edge} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import MIcon from 'react-native-vector-icons/MaterialIcons';
import {OverTimeFilter} from '../../../../common/api/api';
import ContainerNew from '../../../../common/components/Container';
import CustomHeader from '../../../../common/components/CustomHeader';
import {IMAGES} from '../../../../common/constant/Index';
import {COLORS, SIZES} from '../../../../common/constant/Themes';
import {httpRequest} from '../../../../common/constant/httpRequest';
import useAsyncEffect from '../../../../common/packages/useAsyncEffect/useAsyncEffect';
import {
  getStatusBgColor,
  getStatusColor,
} from '../../../../common/services/getColor';
import {timeFormaterToPmAm} from '../../../../common/services/timeFormater';
import {OvertimeApplicationLandingType} from '../../../../interfaces/overtime/overtime';
import {useRootStore} from '../../../../stores/rootStore';

const edges: Edge[] = ['right', 'bottom', 'left'];
interface props {
  route?: any;
}

const OvertimeApplicationMainIndex = ({route}: props) => {
  const employeeData = route?.params?.employeeData;
  const navigation = useNavigation();
  const {userInfo} = useRootStore();
  const isFocused = useIsFocused();
  const [overtimeLanding, setOvertimeLanding] =
    useState<OvertimeApplicationLandingType[]>();
  const [isLoading, setIsLoading] = useState(false);

  const bussinessUnitId =
    employeeData?.intBusinessUnitId || userInfo?.intBusinessUnitId;
  //   const employeeId = employeeData?.EmployeeId || userInfo?.intEmployeeId;

  const payload = {
    strPartName: 'Overtime',
    status: 'All',
    departmentId: 0,
    designationId: 0,
    supervisorId: 0,
    employeeId: employeeData?.EmployeeId,
    workplaceGroupId: 0,
    businessUnitId: bussinessUnitId,
    loggedEmployeeId: userInfo?.intEmployeeId,
  };
  useAsyncEffect(
    async isMounted => {
      if (!isMounted()) {
        return null;
      }

      const api_params = {
        url: OverTimeFilter,
        data: payload,
        method: 'post',
      };
      const res = await httpRequest(api_params, setIsLoading);
      setOvertimeLanding(res);
    },
    [isFocused],
  );

  return (
    <ContainerNew
      edges={edges}
      scrollEnabled={false}
      header={
        <CustomHeader onBackPress={navigation.goBack} title="Overtime Entry" />
      }
      style={styles.container}>
      <View
        style={{
          height: SIZES.height,
        }}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}>
          {overtimeLanding && overtimeLanding?.length > 0 ? (
            <View>
              {overtimeLanding?.map((item, index) => (
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate('OvertimeApplicationLandingDetails', {
                      overtimeDetails: item,
                    })
                  }
                  key={index}
                  style={styles.leaveCard}>
                  <View style={styles.leaveTextPart}>
                    <MIcon
                      name="schedule-send"
                      size={30}
                      color={COLORS.primary}
                    />
                    <View style={styles.middleTxt}>
                      <Text style={styles.titleTxt}>
                        {item?.EmployeeName || '---'}
                      </Text>
                      <Text style={styles.textBottom}>
                        {item?.DesignationName}
                      </Text>
                      <View style={styles.bottomTxt}>
                        <Text style={styles.textBottom}>
                          Start:{' '}
                          {item?.StartTime
                            ? timeFormaterToPmAm(item?.StartTime)
                            : '---'}
                        </Text>
                        <View style={styles.divider} />
                        <Text style={styles.textBottom}>
                          End:{' '}
                          {item?.EndTime
                            ? timeFormaterToPmAm(item?.EndTime)
                            : '---'}
                        </Text>
                      </View>
                      <Text style={styles.textBottom}>
                        Overtime Hour: {item?.OvertimeHour} Hour
                      </Text>
                    </View>
                  </View>

                  <View>
                    <Text
                      style={[
                        styles.status,
                        {
                          color: getStatusColor(item?.ApprovalStatus),
                          backgroundColor: getStatusBgColor(
                            item?.ApprovalStatus,
                          ),
                        },
                      ]}>
                      {item?.ApprovalStatus}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          ) : (
            <View style={styles.noData}>
              <FastImage source={IMAGES.NoDataImage} style={styles.fastImage} />
              <Text style={styles.noDataText}>No data found</Text>
            </View>
          )}

          {isLoading ? (
            <ActivityIndicator
              size={'large'}
              color={COLORS.primary}
              style={styles.paddingTop}
            />
          ) : null}

          <View style={{paddingBottom: SIZES.height / 3.5}} />
        </ScrollView>
      </View>

      <TouchableOpacity
        onPress={() =>
          navigation.navigate('CreateEditOvertimeApplication', {
            overtimeDetails: {
              intEmployeeId: employeeData?.EmployeeId,
              employeeName: employeeData?.EmployeeName,
            },
          })
        }
        style={[
          styles.appBtn,
          {
            marginTop:
              Platform.OS === 'ios' ? SIZES.height / 1.33 : SIZES.height / 1.28,
          },
        ]}
        activeOpacity={0.6}>
        <Icon name="plus" size={25} color={COLORS.white} />
      </TouchableOpacity>
    </ContainerNew>
  );
};

export default OvertimeApplicationMainIndex;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    backgroundColor: COLORS.white,
  },

  leaveCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 0.5,
    marginTop: 8,
    borderColor: COLORS.borderBottom,
    elevation: 3,
    backgroundColor: COLORS.white,
    shadowColor: COLORS.black,
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.08,
    shadowRadius: 5,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 3,
  },
  leaveTextPart: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  titleTxt: {
    fontSize: 16,
    fontWeight: '500',
    lineHeight: 24,
    color: COLORS.textNewColor,
    paddingBottom: 2,
  },
  bottomTxt: {
    display: 'flex',
    flexDirection: 'row',
  },
  status: {
    fontSize: 12,
    lineHeight: 18,
    fontWeight: '600',
    paddingHorizontal: 8,
    paddingVertical: 1,
    borderRadius: 12,
    overflow: 'hidden',
    textAlign: 'center',
    position: 'absolute',
    bottom: 0,
    right: 0,
  },
  middleTxt: {
    marginLeft: 20,
  },
  textBottom: {
    fontSize: 14,
    lineHeight: 20,
    color: COLORS.graySubText,
  },
  divider: {
    borderLeftWidth: 1,
    marginHorizontal: 5,
    borderLeftColor: COLORS.graySubText,
  },
  appBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 15,
    borderRadius: 50,
    backgroundColor: COLORS.primary,
    position: 'absolute',
    marginLeft: SIZES.width / 1.3,
    overflow: 'hidden',
  },
  noData: {
    alignSelf: 'center',
    paddingTop: 50,
  },
  fastImage: {width: 130, height: 90},
  noDataText: {
    textAlign: 'center',
    color: COLORS.textNewColor,
    paddingTop: 10,
    fontSize: 14,
  },
  paddingTop: {paddingTop: 30},
});
