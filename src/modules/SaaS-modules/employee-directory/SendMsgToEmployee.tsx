import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {
  Image,
  Linking,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  View} from 'react-native';
import {Edge} from 'react-native-safe-area-context';
import ContainerNew from '../../../common/components/Container';
import CustomHeader from '../../../common/components/CustomHeader';
import {IMAGES} from '../../../common/constant/Index';
import {COLORS} from '../../../common/constant/Themes';
import MIcon from 'react-native-vector-icons/MaterialIcons';
import {useRootStore} from '../../../stores/rootStore';

const edges: Edge[] = ['right', 'bottom', 'left'];

interface props {
  route?: any;
}

const SendMsgToEmployee = ({route}: props) => {
  const {userInfo: _userInfo} = useRootStore();

  const _employeeDetails = route?.params?.employeeDetails;

  const navigation = useNavigation();

  const _dialCall = (phone?: String, email?: String) => {
    let phoneNumber = '';

    if (Platform.OS === 'android') {
      phoneNumber = `tel:${phone}`;
    } else {
      phoneNumber = `telprompt:${phone}`;
    }

    if (phone) {
      Linking.openURL(phoneNumber);
    }
    if (email) {
      Linking.openURL(`mailto:${email}`);
    }
  };

  return (
    <ContainerNew
      isScrollView={false}
      edges={edges}
      header={
        <>
          <CustomHeader onBackPress={navigation.goBack} title="Live Chat" />
        </>
      }
      style={styles.container}
      // contentContainerStyle={styles.contentContainer}
    >
      <View style={styles.columnSpace}>
        <View>
          <View>
            {/* left message */}
            <View style={[styles.cardHead]}>
              <View style={styles.rowWidth}>
                <View style={styles.noImageBox}>
                  <Image source={IMAGES.NoImage} style={styles.noImage} />
                </View>
                <View style={styles.messageBoxLeft}>
                  <Text style={styles.messageTxtLeft}>
                    Questions are an important part of conversational English.
                    It’s polite to ask about another person, to find out more
                    about them, and to get to know them.
                  </Text>
                  <View style={styles.rowFlexEnd}>
                    <Text style={styles.timeTxt}>10:35 PM</Text>
                  </View>
                </View>
              </View>
            </View>

            {/* right message */}
            <View style={[styles.cardHead]}>
              <View style={styles.rowWidth}>
                <View style={styles.messageBoxRight}>
                  <Text style={styles.messageTxtRight}>
                    Questions are an important part of conversational English.
                    It’s polite to ask about another person, to find out more
                    about them, and to get to know them.
                  </Text>
                  <View style={styles.rowFlexEnd}>
                    <Text style={[styles.timeTxt, styles.timeTxtColor]}>
                      10:35 PM
                    </Text>
                  </View>
                </View>
                <View style={styles.noImageBox}>
                  <Image source={IMAGES.NoImage} style={styles.noImage} />
                </View>
              </View>
            </View>

            <View style={styles.daySection}>
              <View style={styles.dividerVartical} />
              <Text style={styles.dayTxt}>Today</Text>
              <View style={styles.dividerVartical} />
            </View>
          </View>

          {/* left message */}
          <View style={[styles.cardHead]}>
            <View style={styles.rowWidth}>
              <View style={styles.noImageBox}>
                <Image source={IMAGES.NoImage} style={styles.noImage} />
              </View>
              <View style={styles.messageBoxLeft}>
                <Text style={styles.messageTxtLeft}>
                  Questions are an important part of conversational English.
                </Text>
                <View style={styles.rowFlexEnd}>
                  <Text style={styles.timeTxt}>10:35 PM</Text>
                </View>
              </View>
            </View>
          </View>

          {/* right message */}
          <View style={[styles.cardHead]}>
            <View style={styles.rowWidth}>
              <View style={styles.messageBoxRight}>
                <Text style={styles.messageTxtRight}>
                  Questions are an important part of conversational English.
                  It’s polite to ask about.
                </Text>
                <View style={styles.rowFlexEnd}>
                  <Text style={[styles.timeTxt, styles.timeTxtColor]}>
                    10:35 PM
                  </Text>
                </View>
              </View>
              <View style={styles.noImageBox}>
                <Image source={IMAGES.NoImage} style={styles.noImage} />
              </View>
            </View>
          </View>
        </View>

        <View>
          <View style={styles.rowBetween}>
            <TextInput style={styles.input} placeholder="Message" />
            <View style={styles.sendBtn}>
              <MIcon name="send" size={20} color={COLORS.white} />
            </View>
          </View>
        </View>
      </View>
    </ContainerNew>
  );
};

export default SendMsgToEmployee;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 16,
    marginBottom: -300,
    paddingHorizontal: 16,
    backgroundColor: COLORS.white,
    // backgroundColor: 'red',
  },
  cardHead: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },

  messageBoxLeft: {
    backgroundColor: '#EAECF0',
    marginRight: 68,
    padding: 10,
    borderRadius: 8,
    borderTopLeftRadius: 0,
    marginBottom: 16,
    marginHorizontal: 8,
  },
  messageBoxRight: {
    backgroundColor: '#34A853',
    marginLeft: 68,
    padding: 10,
    borderRadius: 8,
    borderTopRightRadius: 0,
    marginBottom: 16,
    marginHorizontal: 8,
  },
  messageTxtLeft: {
    fontSize: 14,
    lineHeight: 17,
    fontWeight: '400',
    letterSpacing: 0.2,
    color: '#000000',
  },
  messageTxtRight: {
    fontSize: 14,
    lineHeight: 17,
    fontWeight: '400',
    letterSpacing: 0.2,
    color: '#FFFFFF',
  },
  timeTxt: {
    fontSize: 10,
    lineHeight: 12,
    fontWeight: '400',
    letterSpacing: 0.2,
    color: '#101828',
  },
  noImageBox: {
    height: 32,
    width: 32,
    borderRadius: 100,
    overflow: 'hidden',
    backgroundColor: '#DCDCDC',
  },
  noImage: {
    height: 32,
    width: 32,
    alignSelf: 'center',
  },
  timeTxtColor: {
    color: '#FFFFFF',
  },
  rowFlexEnd: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  rowWidth: {
    flexDirection: 'row',
    width: '90%',
  },
  dayTxt: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '500',
    alignSelf: 'center',
    color: '#1C1B1F',
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 99,
    marginHorizontal: 16,
    shadowRadius: 2,
    elevation: 3,
  },
  dividerVartical: {
    height: 1,
    flex: 1,
    alignSelf: 'center',
    // backgroundColor: 'black',
    borderColor: '#EAECF0',
  },
  input: {
    width: '84%',
    height: 40,
    marginRight: 16,
    borderRadius: 100,
    padding: 8,
    backgroundColor: '#EAECF0',
  },
  sendBtn: {
    height: 40,
    width: 40,
    backgroundColor: COLORS.primary,
    paddingLeft: 10,
    borderRadius: 100,
    justifyContent: 'center',
  },
  daySection: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  columnSpace: {
    flexDirection: 'column',
    justifyContent: 'space-around',
  },
});
