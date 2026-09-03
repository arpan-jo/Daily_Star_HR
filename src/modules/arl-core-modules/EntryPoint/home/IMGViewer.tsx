import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { Edge } from 'react-native-safe-area-context';
import { arlURL } from '../../../../../App';
import Column from '../../../../common/components/Column';
import ContainerNew from '../../../../common/components/Container';
import CustomHeader from '../../../../common/components/CustomHeader';
import { COLORS } from '../../../../common/constant/Themes';
import { useRootStore } from '../../../../stores/rootStore';
import NoData from '../../../../common/components/NoData';

const edges: Edge[] = ['right', 'bottom', 'left'];

const IMGViewer = () => {
  const [url, setUrl] = useState('');

  const { userInfo } = useRootStore();
  const navigation = useNavigation();
  const route = useRoute();
  const fileId = route?.params?.fileId || '';
  const fileName = route?.params?.fileName || '';

  useEffect(() => {
    if (userInfo?.strUrl === arlURL) {
      setUrl(
        `https://arl.peopledesk.io/api/Document/DownloadFile?id=${fileId}`,
      );
    } else {
      setUrl(
        `https://app.peopledesk.io/api/Document/DownloadFile?id=${fileId}`,
      );
    }
  }, [fileId, userInfo?.strUrl]);

  return (
    <ContainerNew
      isRefresh={false}
      edges={edges}
      scrollEnabled={false}
      isScrollView={false}
      header={
        <CustomHeader title={`${fileName}`} onBackPress={navigation.goBack} />
      }
      style={styles.container}
    >
      <View style={styles.imageContainer}>
        {url ? (
          <Image
            style={styles.image}
            source={{ uri: url }}
            resizeMode="contain"
          />
        ) : (
          <NoData />
        )}
      </View>

      <Column isEmpty />
    </ContainerNew>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    backgroundColor: COLORS.white,
    paddingVertical: 10,
  },
  imageContainer: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  image: {
    width: '100%',
    height: '100%',
  },
});

export default IMGViewer;
