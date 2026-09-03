import React from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import MIcon from 'react-native-vector-icons/MaterialIcons';
import {IMAGES} from '../../../../common/constant/Index';
import {COLORS} from '../../../../common/constant/Themes';

const DocRouteDetails = ({navigation, route}: any) => {
  const title = route?.params?.title;
  const item = route?.params?.title?.item;
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <MIcon name="arrow-back" size={28} color={COLORS.blackish} />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>
            {title || 'Medical Certificate'}
          </Text>
        </View>
        <View>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('DocRouteCreate', {
                title: 'Document Route Edit',
                item: item,
                popFrom: 2,
              })
            }>
            <MIcon
              name="edit"
              size={20}
              color={COLORS.transparentBlack}
              style={styles.iconStyle}
            />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.docDetailsBody}>
        {/* details type */}
        <View>
          <Text style={[styles.docDetailsSubTitle]}>CATEGORY</Text>
          <Text style={styles.docDetailsTitle}>{item?.strDocCategoryName}</Text>
        </View>

        {/* details approveInfo */}
        <View style={styles.docDetailsType}>
          <Text style={[styles.docDetailsSubTitle]}>NUMBER OF APPROVER</Text>
          <Text style={styles.docDetailsTitle}>
            {item?.intMinApproverCount}
          </Text>
        </View>

        <View style={styles.docDetailsType}>
          <View>
            <Text style={[styles.docDetailsSubTitle]}>APPROVER</Text>
          </View>

          {item?.docRoutingList?.length > 0 &&
            item?.docRoutingList?.map((singleUser: any, index: number) => (
              <View key={index}>
                <View style={[styles.card, styles.mBottom16]}>
                  <View style={[styles.noImageBox, styles.mRight16]}>
                    <Image source={IMAGES.NoImage} style={styles.noImage} />
                  </View>
                  <View style={styles.textPart}>
                    <Text style={styles.titleTxt}>
                      {singleUser?.strApproverName}
                    </Text>
                  </View>
                </View>
                <View style={styles.circleChat} />
                <View style={styles.bar2} />
              </View>
            ))}
        </View>
      </View>
    </View>
  );
};

export default DocRouteDetails;

const styles = StyleSheet.create({
  container: {backgroundColor: COLORS.white, flex: 1},
  header: {
    paddingTop: 50,
    paddingBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    elevation: 10,
    borderBottomColor: COLORS.borderBottom,
  },
  headerLeft: {flexDirection: 'row', alignItems: 'center'},
  headerTitle: {
    fontSize: 20,
    color: COLORS.blackish,
    fontWeight: '600',
    paddingLeft: 20,
  },
  docDetailsBody: {
    paddingTop: 30,
    paddingHorizontal: 16,
  },
  docDetailsTitle: {
    fontSize: 18,
    color: COLORS.blackish,
    fontWeight: '500',
    letterSpacing: 0.2,
  },

  docDetailsSubTitle: {
    fontSize: 12,
    color: COLORS.black40,
    fontWeight: '400',
    letterSpacing: 0.2,
  },
  docDetailsType: {
    paddingTop: 30,
  },

  card: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  noImageBox: {
    marginTop: 15,
    height: 50,
    width: 50,
    borderRadius: 100,
    overflow: 'hidden',
    backgroundColor: '#DCDCDC',
  },
  noImage: {
    marginTop: 6,
    height: 51,
    width: 51,
    alignSelf: 'center',
  },
  circleChat: {
    borderWidth: 3,
    borderColor: COLORS.white,
    height: 18,
    width: 18,
    borderRadius: 10,
    backgroundColor: '#51CA31',
    zIndex: 999,
    // position: 'absolute',
    marginTop: -30,
    // marginTop: Platform.OS === 'ios' ? SIZES.height / 13 : SIZES.height / 11,
    marginLeft: 34,
    overflow: 'hidden',
  },
  textPart: {marginTop: 10},
  titleTxt: {
    fontSize: 16,
    fontWeight: '500',
    lineHeight: 24,
    letterSpacing: 0.15,
    color: COLORS.black,
    paddingBottom: 2,
  },
  bar2: {
    height: 2,
    backgroundColor: COLORS.lightGray7,
    marginLeft: 70,
  },
  mBottom16: {
    marginBottom: 16,
  },
  mRight16: {
    marginRight: 16,
  },
  iconStyle: {
    paddingHorizontal: 8,
    paddingVertical: 5,
  },
});
