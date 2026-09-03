import type React from 'react';
import {StyleSheet} from 'react-native';
import FastImage from 'react-native-fast-image';
import MIcon from 'react-native-vector-icons/MaterialIcons';
import Column from '../../../common/components/Column';
import CustomTextNew from '../../../common/components/CustomText';
import Row from '../../../common/components/Row';
import {IMAGES} from '../../../common/constant/Index';
import {COLORS} from '../../../common/constant/Themes';
import {getImageURL} from '../../../common/services/getImage';
import {EmpDashboardDataType} from '../../../interfaces/dashboard/employeeDashboard';

interface ProfileHeaderProps {
  empDashboardData?: EmpDashboardDataType;
  userInfo: any;
  showDetails?: boolean;
  onDetailsPress?: () => void;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  empDashboardData,
  userInfo,
  showDetails = false,
  onDetailsPress,
}) => {
  return (
    <Row direction="row" rowStyle={styles.mainRow}>
      <Row
        align="center"
        rowStyle={styles.paddingHorizontalAndVerticalHeader}
        isPressOn={false}>
        <Column colWidth="15%">
          <FastImage
            source={
              empDashboardData?.employeeDashboardViewModel?.employeeProfileUrlId
                ? {
                    uri: getImageURL(
                      empDashboardData?.employeeDashboardViewModel
                        ?.employeeProfileUrlId,
                    ),
                  }
                : IMAGES.NoImage
            }
            style={styles.profileImage}
          />
        </Column>
        <Column colWidth="85%" colStyle={styles.topBottomTextContainer}>
          <Column colWidth="95%">
            <CustomTextNew
              text={
                empDashboardData?.employeeDashboardViewModel?.employeeName ||
                userInfo?.strDisplayName ||
                ''
              }
              txtStyle={styles.mainTxt}
            />
            <Row justify="space-between" align="center">
              <Row rowWidth="75%">
                <CustomTextNew
                  text={
                    showDetails
                      ? empDashboardData?.employeeDashboardViewModel
                          ?.designationName || ''
                      : userInfo?.strLoginId || ''
                  }
                  subTxt
                />
              </Row>
              {showDetails && (
                <Column
                  isPressOn={false}
                  onCardPress={onDetailsPress}
                  colStyle={styles.columnFlex}>
                  <CustomTextNew text="Details" txtColor={COLORS.primary} />
                  <MIcon
                    name="arrow-forward-ios"
                    color={COLORS.primary}
                    style={{marginLeft: 8}}
                  />
                </Column>
              )}
            </Row>
            <Row>
              <CustomTextNew
                text={
                  empDashboardData?.employeeDashboardViewModel?.employmentType
                    ? empDashboardData?.employeeDashboardViewModel
                        ?.employmentType + ','
                    : ''
                }
                subTxt
              />
              <CustomTextNew
                text={
                  empDashboardData?.employeeDashboardViewModel?.employeeId?.toString() ||
                  ''
                }
                subTxt
                padLeft={6}
              />
            </Row>
          </Column>
        </Column>
      </Row>
    </Row>
  );
};

const styles = StyleSheet.create({
  mainRow: {
    flexWrap: 'wrap',
    paddingTop: 5,
    backgroundColor: COLORS.white,
    paddingBottom: 16,
    borderBottomColor: COLORS.bar,
    borderBottomWidth: 8,
  },
  profileImage: {
    width: 56,
    height: 56,
    borderRadius: 50,
    backgroundColor: COLORS.iconGrayBackground,
    borderWidth: 1,
    borderColor: COLORS.white,
  },
  topBottomTextContainer: {
    paddingLeft: 16,
  },
  paddingHorizontalAndVerticalHeader: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  columnFlex: {
    flexDirection: 'row',
    paddingLeft: 16,
    paddingVertical: 4,
    alignItems: 'center',
  },
  mainTxt: {
    color: COLORS.textNewColor,
    fontWeight: '500',
    fontSize: 16,
    lineHeight: 24,
  },
});

export default ProfileHeader;
