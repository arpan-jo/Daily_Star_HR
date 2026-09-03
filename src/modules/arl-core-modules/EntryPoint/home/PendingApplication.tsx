import {useIsFocused} from '@react-navigation/native';
import {observer} from 'mobx-react-lite';
import React, {useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import FastImage from 'react-native-fast-image';
import MIcon from 'react-native-vector-icons/MaterialIcons';
import {IMAGES} from '../../../../common/constant/Index';
import {COLORS} from '../../../../common/constant/Themes';
import useAsyncEffect from '../../../../common/packages/useAsyncEffect/useAsyncEffect';
import {date_formater} from '../../../../common/services/dateFormater';
import {
  getStatusBgColor,
  getStatusColor} from '../../../../common/services/getColor';
import {useRootStore} from '../../../../stores/rootStore';
import {GetPendingApplications} from '../../../../common/api/api';
import {httpRequest} from '../../../../common/constant/httpRequest';

const PendingApplication = ({empDashboardData: _empDashboardData}: any) => {
  const isFocused = useIsFocused();
  const {userInfo} = useRootStore();
  const [allPendingApplicationData, setAllPendingApplicationData] =
    useState<any>();
  useAsyncEffect(
    async isMounted => {
      if (!isMounted()) {
        return null;
      }
      //api call here
      const api_params2 = {
        url: GetPendingApplications,
        data: {employeeId: userInfo?.intEmployeeId},
      };
      const pendingRes = await httpRequest(api_params2, () => {});
      setAllPendingApplicationData(pendingRes);
    },
    [isFocused],
  );
  return (
    <View style={styles.containerMargin}>
      <Text style={styles.myLeaveTitle}> Pending Application </Text>
      {allPendingApplicationData?.length > 0 ? (
        <>
          {allPendingApplicationData?.map((item: any, index: any) => (
            <View key={index} style={styles.pendingApplicationContainer}>
              <View style={styles.pendingApplicationSubContainer}>
                <View style={styles.applicationCon}>
                  <View style={styles.width45}>
                    <MIcon
                      name="pending-actions"
                      size={30}
                      color={COLORS.primary}
                    />
                  </View>

                  <View style={styles.width82}>
                    <Text style={styles.applicationTitle}>
                      {item?.applicationType}
                    </Text>
                    <Text style={styles.applicationDate}>
                      {date_formater(item?.applicationDate)}
                    </Text>
                  </View>
                </View>

                <View>
                  <Text
                    style={[
                      styles.status,
                      {
                        color: getStatusColor(item?.approvalStatus),
                        backgroundColor: getStatusBgColor(item?.approvalStatus),
                      },
                    ]}>
                    {item?.approvalStatus}
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </>
      ) : (
        <View style={styles.alignSelfCenter}>
          <FastImage
            source={IMAGES.NoDataImage}
            style={styles.fastImageStyle}
          />
          <Text style={styles.noDataText}> No data found </Text>
        </View>
      )}
    </View>
  );
};

export default observer(PendingApplication);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 0,
  },
  containerMargin: {
    marginHorizontal: 16,
    marginBottom: 8,
  },
  myLeaveTitle: {
    fontSize: 18,
    lineHeight: 28,
    fontWeight: '600',
    color: COLORS.textNewColor,
    paddingBottom: 16,
  },
  alignSelfCenter: {
    alignSelf: 'center',
  },
  fastImageStyle: {
    width: 130,
    height: 90,
  },
  noDataText: {
    textAlign: 'center',
    color: COLORS.textNewColor,
    paddingTop: 10,
    fontSize: 14,
  },
  status: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    overflow: 'hidden',
    textAlign: 'center',
    borderRadius: 100,
  },
  pendingApplicationContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderColor: COLORS.lightGray7,
    elevation: 3,
    borderWidth: 1,
    backgroundColor: COLORS.white,
    marginVertical: 8,
  },
  pendingApplicationSubContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  applicationCon: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '75%',
  },
  applicationTitle: {
    fontSize: 16,
    lineHeight: 20,
    color: COLORS.textNewColor,
  },
  applicationDate: {
    fontSize: 14,
    lineHeight: 18,
    fontWeight: '600',
    color: COLORS.graySubText,
    maxWidth: '88%',
  },
  width45: {
    width: 45,
  },
  width82: {
    width: '82%',
  },
});
