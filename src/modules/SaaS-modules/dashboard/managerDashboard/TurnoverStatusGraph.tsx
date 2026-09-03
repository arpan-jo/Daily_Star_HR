import {useIsFocused} from '@react-navigation/native';
import React, {useRef, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import WebView from 'react-native-webview';
import lineHtml from '../../../../common/webView/LineChart';
import {getTurnoverRatioGrapData} from '../../../../services/SaaS-modules/dashboard/managementDashboard';
import {useRootStore} from '../../../../stores/rootStore';
import useAsyncEffect from '../../../../common/packages/useAsyncEffect/useAsyncEffect';

const TurnoverStatusGraph = () => {
  const mapRef = useRef();
  const {userInfo} = useRootStore();
  const isFocused = useIsFocused();
  const [turnoverRate, setTurnoverRate] = useState([]);
  const [turnoverYear, setTurnoverYear] = useState([]);

  useAsyncEffect(
    async isMounted => {
      if (!isMounted()) {
        return null;
      }
      const empStatusRes = await getTurnoverRatioGrapData(
        userInfo?.intAccountId,
      );
      const year = empStatusRes?.map((item: any) => {
        return item?.years?.toString();
      });
      const value = empStatusRes?.map((item: any) => {
        return item?.yearlyTurnover;
      });
      setTurnoverRate(value);
      setTurnoverYear(year);

      if (value?.length > 0 && year?.length > 0) {
        //@ts-ignore
        mapRef?.current?.postMessage(
          JSON.stringify({
            graphValue: value,
            graphText: year,
          }),
        );
      }
    },
    [isFocused],
  );

  return (
    <View>
      <WebView
        //@ts-ignore
        ref={mapRef}
        source={{
          html: lineHtml || '<h1></h1>',
        }}
        onLoad={() => {
          if (turnoverRate?.length > 0 && turnoverYear?.length > 0) {
            //@ts-ignore
            mapRef?.current?.postMessage(
              JSON.stringify({
                graphValue: turnoverRate,
                graphText: turnoverYear,
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
    </View>
  );
};

export default TurnoverStatusGraph;

const styles = StyleSheet.create({
  web: {height: 250, width: '100%'},
});
