import {
  useFocusEffect,
  useNavigation,
  useRoute} from '@react-navigation/native';
import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  useWindowDimensions,
  View} from 'react-native';
import { Edge } from 'react-native-safe-area-context';
import WebView from 'react-native-webview';
import { commonURL } from '../../../../../App';
import ContainerNew from '../../../../common/components/Container';
import CustomHeader from '../../../../common/components/CustomHeader';
import { COLORS } from '../../../../common/constant/Themes';
import { useRootStore } from '../../../../stores/rootStore';

const edges: Edge[] = ['right', 'bottom', 'left'];

const PDFViewer = () => {
  const [url, setUrl] = useState('');
  const [_loading, setLoading] = useState(true);
  const { userInfo } = useRootStore();
  const navigation = useNavigation();
  const route = useRoute();
  const fileId = route?.params?.fileId || '';
  const fileName = route?.params?.fileName || '';
  const isExpenseApproval = route?.params?.isExpenseApproval || false;
  const { width, height } = useWindowDimensions();

  const computePDFUrl = useCallback(() => {
    if (!fileId) return '';

    const baseURLs = {
      default: `https://arl.peopledesk.io/api/Document/DownloadFile?id=${fileId}`,
      expense: `https://erp.ibos.io/domain/Document/DownlloadFile?id=${fileId}`,
      common: `https://app.peopledesk.io/api/Document/DownloadFile?id=${fileId}`,
    };

    if (commonURL === userInfo?.strUrl) {
      return `https://drive.google.com/viewerng/viewer?embedded=true&url=${baseURLs.common}`;
    }

    return isExpenseApproval
      ? `https://drive.google.com/viewerng/viewer?embedded=true&url=${baseURLs.expense}`
      : `https://drive.google.com/viewerng/viewer?embedded=true&url=${baseURLs.default}`;
  }, [fileId, userInfo?.strUrl, isExpenseApproval]);

  useFocusEffect(
    useCallback(() => {
      const newUrl = computePDFUrl();
      setUrl(newUrl);
      setLoading(!newUrl);

      return () => {
        setUrl('');
        setLoading(true);
      };
    }, [computePDFUrl]),
  );
  const webViewKey = `${url}-${width > height ? 'landscape' : 'portrait'}`;
  return (
    <ContainerNew
      isRefresh={false}
      scrollEnabled={false}
      isScrollView={false}
      edges={edges}
      header={
        <CustomHeader title={`${fileName}`} onBackPress={navigation.goBack} />
      }
      style={styles.container}
    >
      <WebView
        key={webViewKey}
        startInLoadingState={true}
        allowFileAccess
        allowUniversalAccessFromFileURLs
        style={styles.webview}
        nestedScrollEnabled
        source={{ uri: url }}
        onLoadEnd={() => setLoading(false)}
        onError={() => setLoading(false)}
        renderLoading={() => (
          <View style={styles.loader}>
            <ActivityIndicator size="large" color={COLORS.primary} />
          </View>
        )}
      />
    </ContainerNew>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 0,
  },
  webview: {
    // height: SIZES.height / 1.2,
    // width: SIZES.width,
    backgroundColor: COLORS.white,
    width: '100%',
  },
  loader: {
    // flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
    // position: 'absolute',
    // paddingLeft: SIZES.width / 2,
    // marginTop: 50,
    flex: 1,
    position: 'absolute', // 🔥 important
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.white,
  },
});

export default PDFViewer;
