import {useIsFocused, useNavigation} from '@react-navigation/native';
import React, {useState} from 'react';
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View} from 'react-native';
import MIcon from 'react-native-vector-icons/MaterialIcons';
import {SIZES, COLORS} from '../../../../common/constant/Themes';
import {DocRoutingListType} from '../../../../interfaces/document/docRouting';
import {getAllDocumentRoutingList} from '../../../../services/SaaS-modules/document/docRoutingAPI';
import {useRootStore} from '../../../../stores/rootStore';
import useAsyncEffect from '../../../../common/packages/useAsyncEffect/useAsyncEffect';

const DocRoutingIndex = () => {
  const {userInfo} = useRootStore();
  const navigation = useNavigation();
  const isFocused = useIsFocused();

  const [_isLoading, setIsLoading] = useState(false);
  const [docRoutingList, setDocRoutingList] = useState<DocRoutingListType[]>(
    [],
  );

  useAsyncEffect(
    async isMounted => {
      if (!isMounted()) {
        return;
      }
      const res = await getAllDocumentRoutingList(
        userInfo?.intAccountId,
        setIsLoading,
      );
      setDocRoutingList(res);
    },
    [userInfo, isFocused],
  );

  return (
    <View>
      <View
        style={{
          height: SIZES.height,
          backgroundColor: COLORS.white,
          paddingBottom: docRoutingList?.length
            ? Platform.OS === 'ios'
              ? SIZES.height / 5.6
              : '25%'
            : SIZES.height,
        }}>
        <ScrollView>
          {docRoutingList &&
            docRoutingList?.map((item, index) => (
              <View key={index}>
                <View style={styles.card}>
                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate('DocRouteDetails', {
                        item: item,
                        title: 'Document Routing',
                      })
                    }>
                    <View style={[styles.textPart]}>
                      <View style={styles.daysPart}>
                        <View
                          style={[
                            styles.days,
                            {backgroundColor: COLORS.lightPrimary},
                          ]}>
                          <MIcon
                            name="sticky-note-2"
                            size={20}
                            style={styles.alignSelfCenter}
                            color={COLORS.primary}
                          />
                        </View>
                      </View>
                      <View style={styles.mLeft5}>
                        <Text style={styles.titleTxt}>
                          {item?.strDocCategoryName}
                        </Text>
                        <Text style={styles.date}>
                          Approver {item?.intMinApproverCount}
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>

                  <View>
                    <TouchableOpacity
                      onPress={() => {
                        navigation.navigate('DocRouteCreate', {
                          item: item,
                          title: 'Document Route Edit',
                          popFrom: 1,
                        });
                      }}
                      style={{
                        padding: 12.5,
                        borderRadius: 50,
                        backgroundColor: COLORS.iconGrayBackground,
                      }}>
                      <MIcon
                        name="edit"
                        size={18}
                        color={COLORS.transparentBlack}
                      />
                    </TouchableOpacity>
                  </View>
                </View>

                <View style={styles.bar2} />
              </View>
            ))}
        </ScrollView>
      </View>

      <TouchableOpacity
        onPress={() =>
          navigation.navigate('DocRouteCreate', {
            title: 'Create Document Routing',
          })
        }
        style={[
          styles.appBtn,
          {
            marginTop:
              Platform.OS === 'ios' ? SIZES.height / 1.45 : SIZES.height / 1.4,
          },
        ]}
        activeOpacity={0.6}>
        <MIcon name="add" size={20} color={COLORS.white} />
        <Text style={styles.btnText}>Create</Text>
      </TouchableOpacity>
    </View>
  );
};

export default DocRoutingIndex;

const styles = StyleSheet.create({
  titleTxt: {
    fontSize: 16,
    fontWeight: '500',
    lineHeight: 24,
    letterSpacing: 0.15,
    color: COLORS.black,
    paddingBottom: 2,
  },
  bar2: {height: 2, backgroundColor: COLORS.lightGray7, marginVertical: 10},
  textPart: {flexDirection: 'row'},
  daysPart: {width: 50},
  days: {
    marginTop: 2,
    width: 45,
    height: 45,
    paddingVertical: 6,
    borderRadius: 30,
    paddingHorizontal: 4,
    justifyContent: 'center',
  },

  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginVertical: 5,
    zIndex: 0,
    // zIndex: 9,
  },

  date: {
    fontSize: 14,
    lineHeight: 16,
    letterSpacing: 0.15,
    color: COLORS.transparentBlack,
  },
  appBtn: {
    // zIndex: 999,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    // overflow: 'hidden',
    borderRadius: 50,
    backgroundColor: COLORS.primary,
    position: 'absolute',
    marginLeft: SIZES.width / 1.6,
  },

  btnText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '500',
    paddingLeft: 5,
    lineHeight: 16,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  alignSelfCenter: {
    alignSelf: 'center',
  },
  mLeft5: {
    marginLeft: 5,
  },
});
