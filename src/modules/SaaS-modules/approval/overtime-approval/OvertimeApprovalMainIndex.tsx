import {useIsFocused, useNavigation} from '@react-navigation/native';
import React, {useState} from 'react';
import {
  ActivityIndicator,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  UIManager,
  View} from 'react-native';
import FastImage from 'react-native-fast-image';
import {Edge} from 'react-native-safe-area-context';
import {OverTimeLanding} from '../../../../common/api/api';
import ContainerNew from '../../../../common/components/Container';
import CustomHeader from '../../../../common/components/CustomHeader';
import {IMAGES} from '../../../../common/constant/Index';
import {COLORS} from '../../../../common/constant/Themes';
import {httpRequest} from '../../../../common/constant/httpRequest';
import useAsyncEffect from '../../../../common/packages/useAsyncEffect/useAsyncEffect';
import {date_formater} from '../../../../common/services/dateFormater';
import {
  getStatusBgColor,
  getStatusColor} from '../../../../common/services/getColor';
import {OvertimeApprovalLandingType} from '../../../../interfaces/overtime/overtime';
import {useRootStore} from '../../../../stores/rootStore';

const edges1: Edge[] = ['right', 'bottom', 'left', 'top'];
const edges2: Edge[] = ['right', 'bottom', 'left'];

if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const OvertimeApprovalMainIndex = () => {
  const navigation = useNavigation();
  const {userInfo} = useRootStore();
  const [isLoading, setIsLoading] = useState(false);
  const isFocused = useIsFocused();
  const [isSearch, _setIsSearch] = useState(true);
  const [isShowHeader, _setIsShowHeader] = useState(true);

  const [overtimeApprovalLandingData, setOvertimeApprovalLandingData] =
    useState<OvertimeApprovalLandingType>();

  const payload = {
    approverId: userInfo?.intEmployeeId,
    intId: 0,
    workplaceGroupId: 0,
    departmentId: 0,
    designationId: 0,
    applicantId: 0,
    fromDate: '',
    toDate: '',
    applicationStatus: 'Pending',
    isAdmin: userInfo?.isOfficeAdmin,
    isSupOrLineManager: userInfo?.isSupNLMORManagement,
    accountId: userInfo?.intAccountId,
  };

  useAsyncEffect(
    async isMounted => {
      if (!isMounted()) {
        return;
      }

      const api_params = {
        url: OverTimeLanding,
        data: payload,
        method: 'post',
      };
      const res = await httpRequest(api_params, setIsLoading);
      setOvertimeApprovalLandingData(res);
    },
    [isFocused],
  );

  return (
    <ContainerNew
      isScrollView={false}
      edges={isShowHeader ? edges2 : Platform.OS === 'ios' ? edges2 : edges1}
      header={
        <>
          {isShowHeader && (
            <>
              {isSearch && (
                <CustomHeader
                  onBackPress={navigation.goBack}
                  title="Overtime Approval"
                />
              )}
            </>
          )}
        </>
      }
      style={styles.container}>
      <View>
        {overtimeApprovalLandingData?.listData?.map((item, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => {
              navigation.navigate('OvertimeApprovalDetails', {
                overtimeDetails: item,
              });
            }}
            style={styles.card}>
            <View>
              <View style={styles.noImageBox}>
                <FastImage source={IMAGES.NoImage} style={styles.noImage} />
              </View>
            </View>
            <View style={styles.txtPart}>
              <View style={styles.rowSpaceBetween}>
                <Text style={styles.empName}>{item?.strEmployeeName}</Text>
              </View>

              <Text style={styles.normalTxt}>
                {item?.application?.strStatus} Request
              </Text>

              <View style={styles.rowSpaceBetween}>
                <View>
                  <Text style={styles.smallTxt}>
                    Application Date:{' '}
                    {date_formater(item?.application?.dteApplicationDate)}
                  </Text>
                </View>

                <View style={styles.status}>
                  <Text
                    style={[
                      styles.statusTxt,
                      {
                        color: getStatusColor(item?.application?.strStatus),
                        backgroundColor: getStatusBgColor(
                          item?.application?.strStatus,
                        ),
                      },
                    ]}>
                    {item?.application?.strStatus}
                  </Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        ))}

        {isLoading ? (
          <ActivityIndicator size={'large'} color={COLORS.primary} />
        ) : null}

        <View style={styles.padBottom} />

        {overtimeApprovalLandingData?.listData?.length === 0 ? (
          <View style={styles.noDataBox}>
            <FastImage source={IMAGES.NoDataImage} style={styles.image} />
            <Text style={styles.noDataText}>No data found</Text>
          </View>
        ) : null}

        <View style={styles.padBottom} />
      </View>
    </ContainerNew>
  );
};

export default OvertimeApprovalMainIndex;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    backgroundColor: COLORS.white,
    paddingVertical: 8,
  },
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderWidth: 0.8,
    marginTop: 8,
    borderColor: COLORS.offDay,
    elevation: 3,
    backgroundColor: COLORS.white,
    shadowColor: COLORS.black,
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.1,
    shadowRadius: 5,
    paddingVertical: 16,
    paddingHorizontal: 10,
    borderRadius: 3,
  },
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
  normalTxt: {
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 20,
    color: COLORS.textNewColor,
  },
  smallTxt: {
    fontSize: 12,
    fontWeight: '400',
    lineHeight: 18,
    color: COLORS.textNewColor,
  },
  rowSpaceBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  empName: {
    fontSize: 16,
    fontWeight: '500',
    width: '85%',
    color: COLORS.textNewColor,
    lineHeight: 24,
  },
  txtPart: {
    flex: 1,
    paddingLeft: 16,
  },
  statusTxt: {
    borderRadius: 100,
    paddingHorizontal: 8,
  },
  padBottom: {
    paddingBottom: 200,
  },
  image: {width: 130, height: 90},
  noDataText: {
    textAlign: 'center',
    color: COLORS.textNewColor,
    paddingTop: 10,
    fontSize: 14,
  },
  noDataBox: {
    alignSelf: 'center',
    paddingTop: 20,
  },
});
