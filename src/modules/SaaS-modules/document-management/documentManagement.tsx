import {observer} from 'mobx-react-lite';
import React, {useState} from 'react';
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {Edge} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import ContainerNew from '../../../common/components/Container';
import {DrawerScreenProps} from '@react-navigation/drawer';
import CustomHeader from '../../../common/components/CustomHeader';
import {COLORS} from '../../../common/constant/Themes';
import {getMenuPermissionAPI} from '../../../services/SaaS-modules/drawer/drawer';
import {useRootStore} from '../../../stores/rootStore';
import DocRoutingIndex from './doc-routing/docRoutingIndex';
import DocApplicationIndex from './docApplication/docApplicationIndex';
import DocInboxIndex from './docInbox/docInboxIndex';
import useAsyncEffect from '../../../common/packages/useAsyncEffect/useAsyncEffect';

const edges: Edge[] = ['right', 'bottom', 'left'];

const DocumentManagementIndex = observer<
  DrawerScreenProps<'Document Management'>
>(({navigation}) => {
  const {userInfo} = useRootStore();

  const [tabName, setTabName] = useState(0);

  const [isActive, setIsActive] = useState(true);
  const [leaveTopTab, setLeaveTopTab] = useState([]);
  useAsyncEffect(async isMounted => {
    if (!isMounted()) {
      return null;
    }
    setIsActive(true);
    const menuRes = await getMenuPermissionAPI(userInfo?.intEmployeeId);
    const modLeave = menuRes?.filter(
      (item: any) => item?.label === 'Document Management',
    );
    const leaveMenu = modLeave[0].childList?.map((item: any, index: any) => {
      return {
        ...item,
        isShow: index === 0 ? true : false,
      };
    });
    setLeaveTopTab(leaveMenu);
  }, []);

  const topTabPress = async (index: any) => {
    setIsActive(!isActive);
    const modLeave = [...leaveTopTab];
    const leaveMenu = modLeave?.map((item: any, ind: any) => {
      return {
        ...item,
        isShow: ind === index ? true : false,
      };
    });
    //@ts-ignore
    setLeaveTopTab(leaveMenu);
    setTabName(index);
  };

  const iconName = (name: string) => {
    let icon;
    if (name === 'My Documents') {
      icon = 'text-snippet';
    }
    if (name === 'Inbox') {
      icon = 'mail';
    }
    if (name === 'Doc Routing') {
      icon = 'chrome-reader-mode';
    }
    return icon;
  };

  return (
    <ContainerNew
      isScrollView={false}
      edges={edges}
      header={
        <CustomHeader
          onLeftMenuPress={navigation.toggleDrawer}
          title="Document Mangement"
        />
      }
      style={{
        backgroundColor: COLORS.white,
        marginTop: Platform?.OS === 'ios' ? 5 : 0,
      }}>
      <View style={styles.container}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}>
          <View style={styles.headContainer}>
            {leaveTopTab?.map((item: any, index) => (
              <View key={index} style={styles.head}>
                <TouchableOpacity
                  disabled={item?.isShow && item?.isShow}
                  style={[
                    styles.headTab,
                    {
                      backgroundColor: item?.isShow
                        ? COLORS.activeBackground
                        : COLORS.lightGray7,
                    },
                  ]}
                  onPress={() => topTabPress(index)}>
                  <View style={styles.btnPart}>
                    <Icon
                      //@ts-ignore
                      name={iconName(item?.label)}
                      size={20}
                      color={
                        item?.isShow
                          ? COLORS.activeText
                          : COLORS.transparentText
                      }
                    />
                    <Text
                      style={[
                        styles.cmnText,
                        {
                          color: item?.isShow
                            ? COLORS.activeText
                            : COLORS.transparentText,
                          fontWeight: item?.isShow ? 'bold' : 'normal',
                        },
                      ]}>
                      {item?.label}
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </ScrollView>
      </View>

      <View style={styles.bar} />

      {tabName === 0 && <DocApplicationIndex />}
      {tabName === 1 && <DocInboxIndex />}
      {tabName === 2 && <DocRoutingIndex />}
    </ContainerNew>
  );
});

export default DocumentManagementIndex;

const styles = StyleSheet.create({
  container: {marginLeft: 10},
  head: {
    // marginLeft: 10,
    paddingTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  headContainer: {flexDirection: 'row'},
  btnPart: {flexDirection: 'row', alignItems: 'center'},

  headTab: {
    marginRight: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    overflow: 'hidden',
    borderRadius: 20,
  },
  cmnText: {
    textAlign: 'center',
    fontSize: 14,
    fontWeight: 'bold',
    lineHeight: 20,
    letterSpacing: 0.25,
    paddingLeft: 5,
  },
  bar: {height: 6, backgroundColor: COLORS.lightGray7, marginVertical: 10},
});
