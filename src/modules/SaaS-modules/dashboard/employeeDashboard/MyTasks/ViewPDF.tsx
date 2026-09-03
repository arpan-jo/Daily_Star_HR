import {useNavigation} from '@react-navigation/native';
import React, {useState} from 'react';
import {
  ActivityIndicator,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {Edge} from 'react-native-safe-area-context';

import ContainerNew from '../../../../../common/components/Container';
import CustomHeader from '../../../../../common/components/CustomHeader';
import CustomTextNew from '../../../../../common/components/CustomText';

import Pdf from 'react-native-pdf';
import {COLORS} from '../../../../../common/constant/Themes';
const edges: Edge[] = ['right', 'bottom', 'left'];

const ViewPDF = () => {
  const [totalpage, setTotalPage] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [scale, setScale] = useState(1.0);
  const navigation = useNavigation();
  const source = {
    uri: 'http://samples.leanpub.com/thereactnativebook-sample.pdf',
    cache: true,
  };
  const handleIncreaseZoom = () => {
    const newZoomlevel = scale + 0.1;
    if (newZoomlevel <= 3.0) {
      setScale(newZoomlevel);
    }
  };
  const handleDecreaseZoom = () => {
    const newZoomlevel = scale - 0.1;
    if (newZoomlevel >= 1.0) {
      setScale(newZoomlevel);
    }
  };

  return (
    <ContainerNew
      edges={edges}
      isScrollView={false}
      header={<CustomHeader title="PDF View" onBackPress={navigation.goBack} />}
      style={styles.container}>
      <View style={styles.subContainer}>
        <Pdf
          scale={scale}
          minScale={1.0}
          maxScale={3.0}
          trustAllCerts={false}
          renderActivityIndicator={() => (
            <ActivityIndicator color={COLORS.primary} size={'large'} />
          )}
          source={source}
          onLoadComplete={numberOfPages => {
            setTotalPage(numberOfPages);
          }}
          onPageChanged={page => {
            setCurrentPage(page);
          }}
          onError={error => {
            console.log(error);
          }}
          onPressLink={uri => {
            console.log(`Link pressed: ${uri}`);
          }}
          style={styles.pdf}
        />
      </View>
      <View style={styles.footer}>
        <View style={styles.bottomContainer}>
          <CustomTextNew
            text={`Page ${currentPage}/${totalpage}`}
            txtColor={COLORS.white}
            txtSize={15}
          />
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.circleBtn}
              onPress={() => handleIncreaseZoom()}>
              <CustomTextNew
                text={'+'}
                txtSize={18}
                lineHight={20}
                txtColor={COLORS.white}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.circleBtn}
              onPress={() => handleDecreaseZoom()}>
              <CustomTextNew
                text={'-'}
                txtSize={18}
                lineHight={20}
                txtColor={COLORS.white}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ContainerNew>
  );
};

export default ViewPDF;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 0,
  },
  subContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  pdf: {
    flex: 1,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  circleBtn: {
    marginRight: 10,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: 35,
    width: 35,
    borderRadius: 100,
    borderColor: COLORS.white,
  },
  bottomContainer: {
    paddingHorizontal: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  footer: {backgroundColor: 'rgba(0, 0, 0, 0.6)', paddingVertical: 15},
  buttonContainer: {flexDirection: 'row', paddingHorizontal: 10},
});
