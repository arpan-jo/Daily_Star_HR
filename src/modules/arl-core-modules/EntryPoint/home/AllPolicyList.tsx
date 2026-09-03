import { useIsFocused, useNavigation } from '@react-navigation/native';
import { observer } from 'mobx-react-lite';
import React, { useState } from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import MIcon from 'react-native-vector-icons/MaterialIcons';
import { IMAGES } from '../../../../common/constant/Index';
import { COLORS } from '../../../../common/constant/Themes';
import useAsyncEffect from '../../../../common/packages/useAsyncEffect/useAsyncEffect';
import { AllPolicyType } from '../../../../interfaces/dashboard/employeeDashboard';
import { getAllPolicyList } from '../../../../services/SaaS-modules/dashboard/employeeDashboard';
import { useRootStore } from '../../../../stores/rootStore';

const AllPolicyList = () => {
  const isFocused = useIsFocused();
  const navigation = useNavigation();
  const { userInfo } = useRootStore();
  const [allPolicyList, setAllPolicyList] = useState<AllPolicyType[]>();
  const [showAll, setShowAll] = useState(false);
  const { width: screenWidth } = useWindowDimensions();
  const displayedList = Array.isArray(allPolicyList)
    ? (showAll
      ? allPolicyList
      : allPolicyList.slice(0, 6))
    : [];

  useAsyncEffect(
    async isMounted => {
      if (!isMounted()) {
        return null;
      }
      const allPolicy = await getAllPolicyList(userInfo?.intEmployeeId);
      if (allPolicy && Array.isArray(allPolicy)) {
        setAllPolicyList(allPolicy);
      }
    },
    [isFocused],
  );
  return (
    <View style={styles.containerMargin}>
      <Text style={styles.myLeaveTitle}> Enterprise Library</Text>
      {/* {allPolicyList && allPolicyList?.length > 0 ? (
        allPolicyList?.map((item, index) => (
          <View key={index}>
            <View style={styles.rowSpaceBetween}>
              <TouchableOpacity
                onPress={() => {
                  const fileName = item?.policyFileName?.toLowerCase() || '';
                  const isPdf = fileName.endsWith('.pdf') || false;
                  if (isPdf) {
                    navigation.navigate('PDFViewer', {
                      fileId: item?.policyFileUrlId,
                      fileName: item?.policyFileName,
                    });
                  } else {
                    navigation.navigate('IMGViewer', {
                      fileId: item?.policyFileUrlId,
                      fileName: item?.policyFileName,
                    });
                  }
                }}
                style={styles.policyView}
              >
                <View style={styles.w15}>
                  <MIcon
                    name="assignment"
                    size={35}
                    color={COLORS.graySubText}
                  />
                </View>

                <View style={styles.width100p}>
                  <Text style={styles.policyTitle} numberOfLines={1}>
                    {item?.policyTitle}
                  </Text>

                  <Text style={styles.policyFileTxt} numberOfLines={1}>
                    {item?.policyFileName}
                  </Text>

                  <View
                    style={[styles.borderBottomWidth, styles.mVertical10]}
                  />
                </View>
              </TouchableOpacity>

              <View>
                <MIcon
                  name="chevron-right"
                  size={30}
                  color={COLORS.graySubText}
                />
              </View>
            </View>
          </View>
        ))
      ) : (
        <View style={styles.alignSelfCenter}>
          <FastImage
            source={IMAGES.NoDataImage}
            style={styles.fastImageStyle}
          />
          <Text style={styles.noDataText}> No data found </Text>
        </View>
      )} */}

      {/* <View style={styles.alignSelfCenter}>
        <FastImage source={IMAGES.NoDataImage} style={styles.fastImageStyle} />
        <Text style={styles.noDataText}> No data found </Text>
      </View> */}

      {allPolicyList && allPolicyList?.length > 0 ? (
        <>
          <View style={styles.policyContainer}>
            {displayedList?.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.card,
                  {
                    height: screenWidth >= 600 ? 220 : 160,
                  },
                ]}
                onPress={() => {
                  const fileName = item?.policyFileName?.toLowerCase() || '';
                  const isPdf = fileName.endsWith('.pdf') || false;
                  if (isPdf) {
                    navigation.navigate('PDFViewer', {
                      fileId: item?.policyFileUrlId,
                      fileName: item?.policyFileName,
                    });
                  } else {
                    navigation.navigate('IMGViewer', {
                      fileId: item?.policyFileUrlId,
                      fileName: item?.policyFileName,
                    });
                  }
                }}
              >
                <View
                  style={[
                    styles.imageContainer,
                    { height: screenWidth >= 600 ? 180 : 115 },
                  ]}
                >
                  {item?.policyImage ? (
                    <Image
                      resizeMode="contain"
                      source={{
                        uri: `https://arl.peopledesk.io/api/Document/DownloadFile?id=${item?.policyImage}`,
                      }}
                      style={{ width: '100%', height: '100%' }}
                    />
                  ) : (
                    <Image
                      resizeMode="contain"
                      source={IMAGES.noimgGrid}
                      style={{ height: '100%', width: '100%' }}
                    />
                  )}
                </View>

                <Text style={styles.title} numberOfLines={2}>
                  {item?.policyTitle}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {allPolicyList.length > 6 && (
            <TouchableOpacity
              style={styles.seeMoreBtn}
              onPress={() => setShowAll(!showAll)}
              activeOpacity={0.7}
            >
              <Text style={styles.seeMoreText}>
                {showAll ? 'See Less' : 'See More'}
              </Text>

              <MIcon
                name={showAll ? 'keyboard-arrow-up' : 'keyboard-arrow-right'}
                size={20}
                color={COLORS.primary}
                style={{ marginLeft: 4 }}
              />
            </TouchableOpacity>
          )}
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

export default observer(AllPolicyList);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 0,
  },
  containerMargin: {
    marginHorizontal: 16,
    marginBottom: 8,
  },
  leaveType: {
    width: '40%',
    paddingLeft: 16,
  },
  noDataText: {
    textAlign: 'center',
    color: COLORS.textNewColor,
    paddingTop: 10,
    fontSize: 14,
  },
  myLeaveTitle: {
    fontSize: 18,
    lineHeight: 28,
    fontWeight: '600',
    color: COLORS.textNewColor,
    paddingBottom: 16,
  },
  rowSpaceBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  policyView: {
    flexDirection: 'row',
    width: '82%',
  },
  width100p: {
    width: '100%',
  },
  w15: {
    width: '15%',
  },
  policyTitle: {
    fontSize: 14,
    lineHeight: 20,
    color: COLORS.textNewColor,
  },
  policyFileTxt: {
    fontSize: 14,
    lineHeight: 20,
    color: '#468EF2',
    textDecorationLine: 'underline',
  },
  borderBottomWidth: {
    borderWidth: 0.8,
    borderColor: COLORS.borderBottom,
    marginTop: 24,
  },
  mVertical10: {
    marginVertical: 10,
  },
  alignSelfCenter: {
    alignSelf: 'center',
  },
  fastImageStyle: {
    width: 130,
    height: 90,
  },
  policyContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    // backgroundColor: COLORS.lightGray7,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  card: {
    width: '31.5%',
    // height: 165,
    // backgroundColor: COLORS.red,
    borderRadius: 4,
    borderColor: COLORS.black,
    marginBottom: 10,
    alignItems: 'center',
    paddingVertical: 5,
    // elevation: 1,
    // justifyContent: 'space-between',
  },
  imageContainer: {
    width: '90%',
    // height: 110,
    // aspectRatio: 1.6,
    // borderRadius: 30,
    // backgroundColor: '#f0f0f0',
    borderWidth: 2,
    elevation: 2,
    borderColor: COLORS.lightGray7,
  },
  title: {
    textAlign: 'center',
    fontSize: 13,
    color: COLORS.textNewBold,
    marginTop: 5,
    // backgroundColor: 'coral',
  },

  seeMoreBtn: {
    marginTop: 10,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
  },

  seeMoreText: {
    color: COLORS.primary,
    fontWeight: '600',
    fontSize: 14,
  },
});
