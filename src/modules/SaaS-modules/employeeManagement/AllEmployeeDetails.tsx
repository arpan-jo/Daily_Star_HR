import {useIsFocused, useNavigation} from '@react-navigation/native';
import React, {useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import FastImage from 'react-native-fast-image';
import {Edge} from 'react-native-safe-area-context';
import MIcon from 'react-native-vector-icons/MaterialIcons';
import {arlURL, commonURL} from '../../../../App';
import {
  EmployeeDashboard,
  EmployeeDashboardApps,
} from '../../../common/api/api';
import ContainerNew from '../../../common/components/Container';
import CustomHeader from '../../../common/components/CustomHeader';
import LoadingContainer from '../../../common/components/Loading';
import {IMAGES} from '../../../common/constant/Index';
import {COLORS} from '../../../common/constant/Themes';
import {httpRequest} from '../../../common/constant/httpRequest';
import useAsyncEffect from '../../../common/packages/useAsyncEffect/useAsyncEffect';
import {time_count_down} from '../../../common/services/countDownTime';
import {
  date_formater,
  date_formaterWithoutYear,
} from '../../../common/services/dateFormater';
import {getImageURL} from '../../../common/services/getImage';
import {timeFormaterToPmAm} from '../../../common/services/timeFormater';
import {LeaveMenuType} from '../../../interfaces/application/application';
import {
  EmpDashboardDataType,
  ProfileDataType,
} from '../../../interfaces/dashboard/employeeDashboard';
import {getEmployeeSelfDetails} from '../../../services/SaaS-modules/dashboard/employeeDashboard';
import {clearProfileCache} from '../../../common/services/profileCache';
import {getMenuPermissionAPI} from '../../../services/SaaS-modules/drawer/drawer';
import {useRootStore} from '../../../stores/rootStore';
import {
  getBgColorByLabel,
  getIconByLabel,
} from '../application/ApplicationCommonFunction';
import {empMngStyleCommon} from '../../arl-core-modules/hr-core/application/employee-management/EmpMngAllEmp';

const edges: Edge[] = ['right', 'bottom', 'left'];

interface props {
  route?: any;
}

const AllEmployeeDetails = ({route}: props) => {
  const leaveDetails = route?.params?.leaveDetails;
  const isFromApproval = route?.params?.isFromApproval;
  const {userInfo} = useRootStore();
  const navigation = useNavigation();
  const [profileData, setProfileData] = useState<ProfileDataType>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [empDashboardData, setEmpDashboardData] =
    useState<EmpDashboardDataType>();
  const [leaveMenu, setLeaveMenu] = useState<LeaveMenuType[]>();
  const isFocused = useIsFocused();

  const [refreshing, setRefreshing] = useState(false);
  const [reload, setReload] = useState(0);
  // Pull-to-refresh drops the cached profile, then re-runs the effect below —
  // which now finds nothing stored and refetches.
  const onPullRefresh = () => {
    clearProfileCache(empId);
    setReload(n => n + 1);
  };


  const empId =
    leaveDetails?.notificationMaster?.intEmployeeId ||
    leaveDetails?.leaveApplication?.intEmployeeId ||
    leaveDetails?.movementApplication?.intEmployeeId ||
    leaveDetails?.EmployeeId;

  const buId =
    leaveDetails?.businessUnitId ||
    leaveDetails?.leaveApplication?.intBusinessUnitId ||
    leaveDetails?.movementApplication?.intBusinessUnitId ||
    leaveDetails?.intBusinessUnitId;

  useAsyncEffect(
    async isMounted => {
      if (!isMounted()) {
        return null;
      }

      const api_params = {
        url:
          commonURL === userInfo?.strUrl
            ? EmployeeDashboardApps
            : EmployeeDashboard,
        data: {
          EmployeeId: empId,
          BusinessUnitId: buId,
          accountId: userInfo?.intAccountId,
        },
      };
      const res = await httpRequest(api_params, setIsLoading);
      setEmpDashboardData(res);

      const menuRes = await getMenuPermissionAPI(empId);

      const modifiedRes = menuRes?.filter(
        (item: any) => item?.label === 'Application',
      );
      const filteredMenu = modifiedRes?.[0]?.childList?.filter(
        (item: any) => item?.label !== 'IOU Adjustment',
      );
      setLeaveMenu(filteredMenu);

      const profileRes = await getEmployeeSelfDetails(empId, setIsLoading);
      setProfileData(profileRes);
    },

    [isFocused, reload],
  );

  return (
    <ContainerNew
      edges={edges}
      refreshing={refreshing}
      setRefresh={setRefreshing}
      apiCall={onPullRefresh}
      header={<CustomHeader onBackPress={navigation.goBack} title="Profile" />}
      style={styles.main}>
      <LoadingContainer isLoading={isLoading} />
      <View style={styles.paddingHorizontal16}>
        <View style={styles.flexRow}>
          <View style={styles.width25}>
            {profileData?.employeeProfileLandingView?.intEmployeeImageUrlId ? (
              <FastImage
                source={{
                  uri: getImageURL(
                    profileData?.employeeProfileLandingView
                      ?.intEmployeeImageUrlId,
                  ),
                }}
                style={styles.profileImage}
              />
            ) : (
              <FastImage source={IMAGES.NoImage} style={styles.profileImage} />
            )}
          </View>
          <View style={styles.width75}>
            <Text style={styles.employeeName}>
              {profileData?.employeeProfileLandingView?.strEmployeeName}
            </Text>
            <Text style={styles.empSubData}>
              {profileData?.employeeProfileLandingView?.strDesignation}
            </Text>
            <Text style={styles.empSubData}>
              {profileData?.employeeProfileLandingView?.strHrpostionName}
            </Text>
            <Text style={styles.empSubData}>
              {profileData?.employeeProfileLandingView?.strEmployeeCode}
            </Text>
          </View>
        </View>
        <View style={[styles.borderBottomWidth, styles.marginTopBottom]} />

        <View>
          <View style={styles.flexRow}>
            <View style={styles.width10}>
              <MIcon
                name="business-center"
                size={25}
                color={COLORS.iconColor}
              />
            </View>
            <View>
              <Text style={styles.commonTextData}>
                {profileData?.employeeProfileLandingView?.strDepartment}
              </Text>
              <Text style={styles.commonTextTitle}>Department</Text>
            </View>
          </View>
          <View style={[styles.borderBottomWidth, styles.marginTopBottom]} />

          <View style={styles.flexRow}>
            <View style={styles.width10}>
              <MIcon name="cake" size={25} color={COLORS.iconColor} />
            </View>
            <View>
              <Text style={styles.commonTextData}>
                {date_formaterWithoutYear(
                  profileData?.employeeProfileLandingView?.dteDateOfBirth,
                )}
              </Text>
              <Text style={styles.commonTextTitle}>Date of Birth</Text>
            </View>
          </View>

          <View style={[styles.borderBottomWidth, styles.marginTopBottom]} />
          <View style={styles.flexRow}>
            <View style={styles.width10}>
              <MIcon name="person" size={25} color={COLORS.iconColor} />
            </View>
            <View>
              <Text style={styles.commonTextData}>
                {profileData?.employeeProfileLandingView?.strGender}
              </Text>
              <Text style={styles.commonTextTitle}>Gender</Text>
            </View>

            <View style={styles.marginHorizontal} />
            <View>
              <Text style={styles.commonTextData}>
                {profileData?.employeeProfileLandingView?.strReligion}
              </Text>
              <Text style={styles.commonTextTitle}>Religion</Text>
            </View>
          </View>
        </View>
      </View>
      <View style={styles.bar} />

      {/* application section */}
      <Text style={[styles.myLeaveTitle, styles.paddingLeft]}>
        Employee Application
      </Text>
      <View style={styles.applicationContainer}>
        {leaveMenu?.map((item, index) => (
          <View key={index} style={styles.appCard}>
            <TouchableOpacity
              disabled={isFromApproval}
              style={styles.appTouchBox}
              onPress={() => {
                if (item?.label === 'Leave') {
                  navigation.navigate('LeaveApplicationMainIndex', {
                    empLeaveData: {...leaveDetails, profileData},
                  });
                }
                if (item?.label === 'Movement') {
                  navigation.navigate('MovementApplicationMainIndex', {
                    empLeaveData: {...leaveDetails, profileData},
                  });
                }
                if (item?.label === 'Location & Device') {
                  navigation.navigate('LocationAndDeviceMainIndex', {
                    employeeData: {...leaveDetails, profileData},
                  });
                }
                if (item?.label === 'e-Presence') {
                  navigation.navigate('LocationAndDeviceMainIndex', {
                    employeeData: {...leaveDetails, profileData},
                  });
                }
                if (item?.label === 'IOU') {
                  navigation.navigate('IOUApplicationMainIndex', {
                    employeeData: {...leaveDetails, profileData},
                  });
                }
                if (item?.label === 'Loan') {
                  navigation.navigate('LoanApplicationMainIndex', {
                    employeeData: {...leaveDetails, profileData},
                  });
                }
                if (item?.label === 'Remote Attendance') {
                  navigation.navigate('RemoteAttendanceMainIndex', {
                    employeeData: {...leaveDetails, profileData},
                  });
                }
                if (item?.label === 'Attendance Adjustment') {
                  navigation.navigate('AttendanceAdjustmentMainIndex', {
                    employeeData: {...leaveDetails, profileData},
                  });
                }
                if (item?.label === 'Overtime') {
                  navigation.navigate('OvertimeApplicationMainIndex', {
                    employeeData: {...leaveDetails, profileData},
                  });
                }
                if (item?.label?.trim() === 'Market Visit') {
                  navigation.navigate('MarketVisitMainIndex', {
                    employeeData: {...leaveDetails, profileData},
                  });
                }
                if (item?.label?.trim() === 'Location Assign') {
                  navigation.navigate('LocationAssignMainIndex', {
                    employeeData: {...leaveDetails, profileData},
                  });
                }
              }}>
              <View
                style={[
                  styles.applicationIconBox,
                  {
                    backgroundColor: getBgColorByLabel(item?.label),
                  },
                ]}>
                <MIcon
                  //@ts-ignore
                  name={getIconByLabel(item?.label)}
                  size={30}
                  color={COLORS.white}
                />
              </View>
              <View>
                <Text style={styles.applicationTitle}>{item?.label}</Text>
              </View>
            </TouchableOpacity>
          </View>
        ))}
      </View>
      <View style={[styles.bar, styles.applicationBottom]} />

      {/* contact info section */}
      <View style={styles.paddingHorizontal16}>
        <Text style={styles.myLeaveTitle}>Contact Info</Text>
        <View style={styles.flexRow}>
          <View style={styles.width10}>
            <MIcon name="email" size={25} color={COLORS.iconColor} />
          </View>
          <View>
            <Text style={styles.commonTextData}>
              {profileData?.employeeProfileLandingView?.strPersonalEmail ||
                profileData?.employeeProfileLandingView?.strOfficeMail ||
                '---'}
            </Text>
            <Text style={styles.commonTextTitle}>Email</Text>
          </View>
        </View>
        <View style={[styles.borderBottomWidth, styles.marginTopBottom]} />
        <View style={styles.flexRow}>
          <View style={styles.width10}>
            <MIcon name="phone" size={25} color={COLORS.iconColor} />
          </View>
          <View>
            <Text style={styles.commonTextData}>
              {profileData?.employeeProfileLandingView?.strPersonalMobile ||
                profileData?.employeeProfileLandingView?.strOfficeMobile ||
                '---'}
            </Text>
            <Text style={styles.commonTextTitle}>Phone</Text>
          </View>
        </View>
      </View>
      <View style={[styles.bar]} />

      {/* bank section */}
      <View style={styles.paddingHorizontal16}>
        <Text style={styles.myLeaveTitle}>Bank Information</Text>
        <View style={styles.bankSection}>
          <Text style={[styles.myLeaveTitle, styles.empBankDetails]}>
            {profileData?.empEmployeeBankDetail?.strBankWalletName || 'N/A'}
          </Text>
          <Text style={styles.commonTextTitle}>
            {profileData?.empEmployeeBankDetail?.strBranchName || 'N/A'}
          </Text>
          <View style={[styles.borderBottomWidth, styles.marginTopBottom]} />
          <View style={styles.flexRow}>
            <View style={styles.width10}>
              <MIcon name="tour" size={25} color={COLORS.iconColor} />
            </View>
            <View>
              <Text style={styles.commonTextData}>
                {profileData?.empEmployeeBankDetail?.strRoutingNo || 'N/A'}
              </Text>
              <Text style={styles.commonTextTitle}>Routing Number</Text>
            </View>
            <View style={styles.marginHorizontal} />
            <View>
              <Text style={styles.commonTextData}>
                {profileData?.empEmployeeBankDetail?.strSwiftCode || 'N/A'}
              </Text>
              <Text style={styles.commonTextTitle}>SWFIT Code</Text>
            </View>
          </View>
          <View style={[styles.borderBottomWidth, styles.marginTopBottom]} />
          <View style={styles.flexRow}>
            <View style={styles.width10}>
              <MIcon name="account-circle" size={25} color={COLORS.iconColor} />
            </View>
            <View>
              <Text style={styles.commonTextData}>
                {profileData?.empEmployeeBankDetail?.strAccountName || 'N/A'}
              </Text>
              <Text style={styles.commonTextTitle}>Account Name</Text>
            </View>
          </View>
          <View style={[styles.borderBottomWidth, styles.marginTopBottom]} />
          <View style={styles.flexRow}>
            <View style={styles.width10}>
              <MIcon name="account-circle" size={25} color={COLORS.iconColor} />
            </View>
            <View>
              <Text style={styles.commonTextData}>
                {profileData?.empEmployeeBankDetail?.strAccountNo || 'N/A'}
              </Text>
              <Text style={styles.commonTextTitle}>Account Number</Text>
            </View>
          </View>
        </View>
      </View>

      <View style={[styles.bar]} />

      {/* time calendar section */}
      <View style={styles.paddingHorizontal16}>
        <Text style={styles.myLeaveTitle}>Time Calendar</Text>
        <View style={styles.flexRow}>
          <View style={styles.width10}>
            <MIcon name="watch-later" size={25} color={COLORS.iconColor} />
          </View>
          <View>
            <Text style={styles.commonTextData}>
              {time_count_down(
                empDashboardData?.employeeDashboardViewModel?.checkIn,
                empDashboardData?.employeeDashboardViewModel?.checkOut,
              )}
            </Text>
            <Text style={styles.commonTextTitle}>Today Working Period</Text>
          </View>
        </View>
        <View style={[styles.borderBottomWidth, styles.marginTopBottom]} />
        <View style={styles.flexRow}>
          <View style={styles.width10}>
            <MIcon name="hourglass-bottom" size={25} color={COLORS.iconColor} />
          </View>
          <View>
            <Text style={styles.commonTextData}>
              {empDashboardData?.employeeDashboardViewModel
                ?.calendarStartTime ||
              empDashboardData?.employeeDashboardViewModel?.calendarEndTime
                ? `${timeFormaterToPmAm(
                    empDashboardData?.employeeDashboardViewModel
                      ?.calendarStartTime,
                  )} - ${timeFormaterToPmAm(
                    empDashboardData?.employeeDashboardViewModel
                      ?.calendarEndTime,
                  )}`
                : 'N/A'}
            </Text>
            <Text style={styles.commonTextTitle}>General Calendar</Text>
          </View>
        </View>
      </View>
      <View style={[styles.bar]} />

      {/* activity history section */}
      <View style={styles.paddingHorizontal16}>
        <Text style={styles.myLeaveTitle}>Activity History</Text>
        <View style={styles.flexRow}>
          <View style={styles.width10}>
            <MIcon name="lightbulb" size={25} color={COLORS.iconColor} />
          </View>
          <View>
            <Text style={styles.commonTextData}>
              {empDashboardData?.employeeDashboardViewModel?.serviceLength ||
                'N/A'}
            </Text>
            <Text style={styles.commonTextTitle}>Length of Service</Text>
          </View>
        </View>
        <View style={[styles.borderBottomWidth, styles.marginTopBottom]} />
        <View style={styles.flexRow}>
          <View style={styles.width10}>
            <MIcon name="today" size={25} color={COLORS.iconColor} />
          </View>
          <View style={styles.flexRow}>
            <View>
              <Text style={styles.commonTextData}>
                {empDashboardData?.employeeDashboardViewModel?.joiningDate
                  ? date_formater(
                      empDashboardData?.employeeDashboardViewModel?.joiningDate,
                    )
                  : 'N/A'}
              </Text>
              <Text style={styles.commonTextTitle}>Joining Date</Text>
            </View>
            <View style={styles.joinDateBottom} />
            <View>
              <Text style={styles.commonTextData}>
                {empDashboardData?.employeeDashboardViewModel?.confirmationDate
                  ? date_formater(
                      empDashboardData?.employeeDashboardViewModel
                        ?.confirmationDate,
                    )
                  : 'N/A'}
              </Text>
              <Text style={styles.commonTextTitle}>Confirmation Date</Text>
            </View>
          </View>
        </View>
      </View>
      <View style={[styles.bar]} />

      {/* Remote Attendance */}
      {/* <View style={styles.remortAttContainer}>
        <View style={styles.headerTxtContainer}>
          <View>
            <Text style={styles.attendance}>Remote Attendance</Text>
            <Text style={styles.noticeSubText}>
              You have access to the attendance remote locations.
            </Text>
          </View>
        </View>
        <View style={styles.locationContainer}>
          <View style={styles.locationTxtPart}>
            <View style={styles.marginRight}>
              <MIcon name="location-on" size={25} />
            </View>
            <View>
              <Text style={styles.branchTxt}>iBOS Limited Dhanmondi Branch</Text>
              <Text style={styles.addressTxt}>6/2 Kazi Nazrul Islam Road, Block 9A</Text>
            </View>
          </View>
        </View>
        <View style={[styles.borderBottomWidth, styles.marginTop]} />
        <View style={styles.locationContainer}>
          <View style={styles.locationTxtPart}>
            <View style={styles.marginRight}>
              <MIcon name="location-on" size={25} />
            </View>
            <View>
              <Text style={styles.branchTxt}>iBOS Limited Uttara Branch</Text>
              <Text style={styles.addressTxt}>6/2 Kazi Nazrul Islam Road, Block 9A</Text>
            </View>
          </View>
        </View>
        <View style={[styles.borderBottomWidth, styles.marginTop]} />
        <View style={styles.locationContainer}>
          <View style={styles.locationTxtPart}>
            <View style={styles.marginRight}>
              <MIcon name="location-on" size={25} />
            </View>
            <View>
              <Text style={styles.branchTxt}>iBOS Limited Mirpur Branch</Text>
              <Text style={styles.addressTxt}>6/2 Kazi Nazrul Islam Road, Block 9A</Text>
            </View>
          </View>
        </View>
      </View>

      <View style={[styles.bar]} /> */}

      {/* manager list section */}
      <View style={styles.paddingHorizontal16}>
        <Text style={styles.myLeaveTitle}>My Manager</Text>
        <View style={styles.flexRow}>
          <View style={styles.width15}>
            {empDashboardData?.employeeDashboardViewModel
              ?.intLineManagerImageUrlId ? (
              <FastImage
                source={{
                  uri: getImageURL(
                    empDashboardData?.employeeDashboardViewModel
                      ?.intLineManagerImageUrlId,
                  ),
                }}
                style={styles.managerImage}
              />
            ) : (
              <FastImage source={IMAGES.NoImage} style={styles.managerImage} />
            )}
          </View>
          <View style={styles.lineManager}>
            <Text style={styles.managerTitle}>
              {empDashboardData?.employeeDashboardViewModel?.lineManager ||
                'N/A'}
            </Text>
            <Text style={styles.managerText}>Manager</Text>
            <View style={[styles.borderBottomWidth, styles.marginTopBottom]} />
          </View>
        </View>
        {userInfo?.strUrl === arlURL ? (
          <View />
        ) : (
          <View style={styles.flexRow}>
            <View style={styles.width15}>
              {empDashboardData?.employeeDashboardViewModel
                ?.intDottedSupervisorImageUrlId ? (
                <FastImage
                  source={{
                    uri: getImageURL(
                      empDashboardData?.employeeDashboardViewModel
                        ?.intDottedSupervisorImageUrlId,
                    ),
                  }}
                  style={styles.managerImage}
                />
              ) : (
                <FastImage
                  source={IMAGES.NoImage}
                  style={styles.managerImage}
                />
              )}
            </View>
            <View style={styles.lineManager}>
              <Text style={styles.managerTitle}>
                {empDashboardData?.employeeDashboardViewModel
                  ?.dottedSupervisor || 'N/A'}
              </Text>
              <Text style={styles.managerText}>Dotted Supervisor</Text>
              <View
                style={[styles.borderBottomWidth, styles.marginTopBottom]}
              />
            </View>
          </View>
        )}
        <View style={styles.flexRow}>
          <View style={styles.width15}>
            {empDashboardData?.employeeDashboardViewModel
              ?.intSupervisorImageUrlId ? (
              <FastImage
                source={{
                  uri: getImageURL(
                    empDashboardData?.employeeDashboardViewModel
                      ?.intSupervisorImageUrlId,
                  ),
                }}
                style={styles.managerImage}
              />
            ) : (
              <FastImage source={IMAGES.NoImage} style={styles.managerImage} />
            )}
          </View>
          <View style={styles.lineManager}>
            <Text style={styles.managerTitle}>
              {empDashboardData?.employeeDashboardViewModel?.supervisor ||
                'N/A'}
            </Text>
            <Text style={styles.managerText}>Supervisor</Text>
          </View>
        </View>
      </View>
      <View style={[styles.bar]} />

      {/* administration information */}
      <View style={styles.paddingHorizontal16}>
        <Text style={styles.myLeaveTitle}>Administration Information</Text>
        <View>
          <Text style={[styles.commonTextTitle, styles.fontSize14]}>
            Business Unit {'   '}
            <Text style={[styles.commonTextData]}>
              {profileData?.employeeProfileLandingView?.strBusinessUnitName ||
                'N/A'}
            </Text>
          </Text>
        </View>
        <View style={[styles.borderBottomWidth, styles.marginTopBottom]} />

        <View>
          <Text style={[styles.commonTextTitle, styles.fontSize14]}>
            Workplace Group {'   '}
            <Text style={[styles.commonTextData]}>
              {profileData?.employeeProfileLandingView?.strWorkplaceGroupName ||
                'N/A'}
            </Text>
          </Text>
        </View>
        <View style={[styles.borderBottomWidth, styles.marginTopBottom]} />

        <View>
          <Text style={[styles.commonTextTitle, styles.fontSize14]}>
            Workplace {'   '}
            <Text style={[styles.commonTextData]}>
              {profileData?.employeeProfileLandingView?.strWorkplaceName ||
                'N/A'}
            </Text>
          </Text>
        </View>
        <View style={[styles.borderBottomWidth, styles.marginTopBottom]} />

        <View>
          <Text style={[styles.commonTextTitle, styles.fontSize14]}>
            Payroll Group {'   '}
            <Text style={[styles.commonTextData]}>
              {profileData?.employeeProfileLandingView?.strPayrollGroupName ||
                'N/A'}
            </Text>
          </Text>
        </View>
        <View style={[styles.borderBottomWidth, styles.marginTopBottom]} />

        <View>
          <Text style={[styles.commonTextTitle, styles.fontSize14]}>
            Payscale Grade {'   '}
            <Text style={[styles.commonTextData]}>
              {profileData?.employeeProfileLandingView?.strPayscaleGradeName ||
                'N/A'}
            </Text>
          </Text>
        </View>
        <View style={[styles.borderBottomWidth, styles.marginTopBottom]} />

        <View>
          <Text style={[styles.commonTextTitle, styles.fontSize14]}>
            Calendar Type {'   '}
            <Text style={[styles.commonTextData]}>
              {profileData?.employeeProfileLandingView?.strCalenderType ||
                'N/A'}
            </Text>
          </Text>
        </View>
        <View style={[styles.borderBottomWidth, styles.marginTopBottom]} />

        <View>
          <Text style={[styles.commonTextTitle, styles.fontSize14]}>
            Calendar Name {'   '}
            <Text style={[styles.commonTextData]}>
              {profileData?.employeeProfileLandingView?.strCalenderName ||
                'N/A'}
            </Text>
          </Text>
        </View>
        <View style={[styles.borderBottomWidth, styles.marginTopBottom]} />

        <View>
          <Text style={[styles.commonTextTitle, styles.fontSize14]}>
            Joining Date {'   '}
            <Text style={[styles.commonTextData]}>
              {date_formater(
                profileData?.employeeProfileLandingView?.dteJoiningDate ||
                  'N/A',
              )}
            </Text>
          </Text>
        </View>
        <View style={[styles.borderBottomWidth, styles.marginTopBottom]} />

        <View>
          <Text style={[styles.commonTextTitle, styles.fontSize14]}>
            Employee Type {'   '}
            <Text style={[styles.commonTextData]}>
              {profileData?.employeeProfileLandingView?.strEmploymentType ||
                'N/A'}
            </Text>
          </Text>
        </View>
      </View>

      <View style={[styles.bar]} />

      {/* payslip section */}
      <View style={{flexDirection: 'row', paddingHorizontal: 16}}>
        <View style={styles.locationTime}>
          <FastImage
            source={IMAGES.PayslipImage}
            style={{width: 40, height: 40, alignSelf: 'center'}}
          />
        </View>
        <View>
          <Text style={styles.attendance}>My Payslip</Text>
          <View style={styles.viewPayslip}>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('PayslipDetails', {empId});
              }}
              style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text style={styles.remotePunch}>View Payslip</Text>
              <MIcon name="arrow-forward" size={25} color={COLORS.primary} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ContainerNew>
  );
};

export default AllEmployeeDetails;

const styles = StyleSheet.create({
  addressTxt: {
    fontSize: 12,
    lineHeight: 18,
    fontWeight: '400',
    color: COLORS.graySubText,
  },
  noticeSubText: {
    fontSize: 12,
    lineHeight: 18,
    fontWeight: '600',
    color: COLORS.graySubText,
    maxWidth: '88%',
  },
  attendance: {
    fontSize: 18,
    lineHeight: 28,
    fontWeight: '600',
    color: COLORS.textNewColor,
  },
  // locationTime: {
  //   backgroundColor: COLORS.iconGrayBackground,
  //   width: 60,
  //   height: 60,
  //   justifyContent: 'center',
  //   borderRadius: 99,
  //   marginRight: 16,
  // },
  branchTxt: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '500',
    color: COLORS.textNewColor,
  },
  marginTop: {
    marginTop: 10,
  },
  remortAttContainer: {
    flexDirection: 'column',
    paddingHorizontal: 16,
  },
  headerTxtContainer: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  marginRight: {marginRight: 10},
  locationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 6,
    alignItems: 'center',
  },
  locationTxtPart: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },

  locationTime: {
    backgroundColor: COLORS.iconGrayBackground,
    width: 60,
    height: 60,
    justifyContent: 'center',
    borderRadius: 99,
    marginRight: 16,
  },

  remotePunch: {
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 20,
    color: COLORS.primary,
    textAlign: 'center',
    paddingRight: 8,
  },
  viewPayslip: {
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.primary,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 100,
    marginTop: 10,
  },
  ...empMngStyleCommon,
});
