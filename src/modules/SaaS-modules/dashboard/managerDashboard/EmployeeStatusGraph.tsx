import {useIsFocused} from '@react-navigation/native';
import dayjs from 'dayjs';
import React, {useRef, useState} from 'react';
import {Platform, StyleSheet, Text, View} from 'react-native';
import WebView from 'react-native-webview';
import {COLORS} from '../../../../common/constant/Themes';
import pieHtml from '../../../../common/webView/PieChart';
import {EmployeeStatusGraphDataType} from '../../../../interfaces/dashboard/managementDashboard';
import {getEmployeeStatusData} from '../../../../services/SaaS-modules/dashboard/managementDashboard';
import {useRootStore} from '../../../../stores/rootStore';
import useAsyncEffect from '../../../../common/packages/useAsyncEffect/useAsyncEffect';

const EmployeeStatusGraph = () => {
  const mapRef = useRef();
  const {userInfo} = useRootStore();
  const currentYear = dayjs().year();
  const isFocused = useIsFocused();
  const [employeValue, setEmployeValue] = useState([]);
  const [employeDepartText, setEmployeDepartText] = useState([]);
  const [employeStatusData, setEmployeStatusData] =
    useState<EmployeeStatusGraphDataType>();

  useAsyncEffect(
    async isMounted => {
      if (!isMounted()) {
        return null;
      }
      const empStatusRes = await getEmployeeStatusData(
        userInfo?.intAccountId,
        currentYear,
      );
      setEmployeStatusData(empStatusRes);
      const value = empStatusRes?.employeeStatusGraphs?.map((item: any) => {
        return item?.graphValue;
      });
      const name = empStatusRes?.employeeStatusGraphs?.map((item: any) => {
        return item?.graphText;
      });
      setEmployeValue(value);
      setEmployeDepartText(name);

      if (value?.length > 0 && name?.length > 0) {
        //@ts-ignore
        mapRef?.current?.postMessage(
          JSON.stringify({
            graphValue: value,
            graphText: name,
          }),
        );
      }
    },
    [isFocused],
  );

  return (
    <View>
      <View style={styles.header}>
        <View>
          <Text style={styles.num}>{employeStatusData?.totalMale}</Text>
          <Text style={styles.maleOrFemale}>
            Male ({employeStatusData?.malePercentage}%)
          </Text>
        </View>
        <View style={styles.bar} />
        <View>
          <Text style={styles.num}>{employeStatusData?.totalFemale}</Text>
          <Text style={styles.maleOrFemale}>
            Female ({employeStatusData?.femalePercentage}%)
          </Text>
        </View>
      </View>
      <WebView
        //@ts-ignore
        ref={mapRef}
        source={{
          html: pieHtml || '<h1></h1>',
        }}
        onLoad={() => {
          if (employeValue?.length > 0 && employeDepartText?.length > 0) {
            //@ts-ignore
            mapRef?.current?.postMessage(
              JSON.stringify({
                graphValue: employeValue,
                graphText: employeDepartText,
              }),
            );
          }
        }}
        style={styles.web}
        scalesPageToFit={true}
        scrollEnabled={false}
        bounces={false}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        androidLayerType={'hardware'}
      />

      <View style={styles.totalSection}>
        <Text style={styles.total}>{employeStatusData?.totalEmployee}</Text>
        <Text style={styles.totalText}>Total Employee</Text>
      </View>

      <View style={styles.footerSection}>
        <Text style={styles.status}>Status</Text>
        <Text style={styles.status}>Employees</Text>
      </View>

      <View style={styles.bar2} />

      {employeStatusData?.employeeStatusGraphs?.map((item: any, index: any) => (
        <View key={index}>
          <View style={styles.footerSection}>
            <View style={styles.footerSection}>
              <Text style={styles.name}>{item?.graphText}</Text>
            </View>
            <View style={styles.footerSection}>
              <Text style={styles.number}>{item?.graphValue}</Text>
              <Text style={styles.percentage}>
                (
                {(
                  (item?.graphValue * 100) /
                  employeStatusData?.totalEmployee
                ).toFixed(0)}{' '}
                %)
              </Text>
            </View>
          </View>
          {index === 2 ? null : <View style={styles.bar} />}
        </View>
      ))}
    </View>
  );
};

export default EmployeeStatusGraph;

const styles = StyleSheet.create({
  header: {flexDirection: 'row'},
  web: {height: 270, width: '100%'},
  bar: {width: 1, backgroundColor: COLORS.bar, marginHorizontal: 20},
  num: {
    fontWeight: '600',
    fontSize: 16,
    lineHeight: 24,
    color: COLORS.textNewColor,
  },
  maleOrFemale: {
    fontSize: 14,
    lineHeight: 20,
    color: COLORS.textNewColor,
  },

  footerSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  status: {
    fontSize: 12,
    lineHeight: 18,
    color: COLORS.textNewColor,
  },
  name: {
    fontSize: 14,
    lineHeight: 20,
    color: COLORS.textNewColor,
  },
  number: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.textNewColor,
    paddingRight: 5,
  },
  percentage: {
    fontSize: 12,
    lineHeight: 18,
    color: COLORS.textNewColor,
  },
  bar2: {height: 1, backgroundColor: COLORS.bar, marginVertical: 8},
  total: {
    fontSize: 18,
    fontWeight: '700',
    lineHeight: 28,
    color: COLORS.textNewColor,
    textAlign: 'center',
  },
  totalText: {
    fontSize: 12,
    lineHeight: 18,
    color: COLORS.graySubText,
    textAlign: 'center',
  },
  totalSection: {
    position: 'absolute',
    top: Platform?.OS === 'ios' ? 115 : 140,
    alignSelf: 'center',
  },
});
