import {
  useIsFocused,
  useNavigation,
  useTheme} from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import {
  FlatList,
  LayoutAnimation,
  Linking,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View} from 'react-native';
// import RNCallKeep from 'react-native-callkeep';
import { Edge } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Column from '../../../../common/components/Column';
import ContainerNew from '../../../../common/components/Container';
import CustomHeader from '../../../../common/components/CustomHeader';
import LoadingContainer from '../../../../common/components/Loading';
import Row from '../../../../common/components/Row';
import SearchHeader from '../../../../common/components/SearchHeader';
import TopBarItem from '../../../../common/components/TabBaritem';

import { COLORS } from '../../../../common/constant/Themes';
import { getPartnerList } from '../../../../services/arl-core-modules/procurement/purchaseRequest/purchaseRequestAPI';
import { getContactBook } from '../../../../services/SaaS-modules/contact/contact';
import { useRootStore } from '../../../../stores/rootStore';
// import {makeCall, sessionCancel} from '../../sip_service/SipService';
import CustomFlatList from '../../../../common/components/CustomFlatList';
import { useToast } from '../../../../common/components/CustomToast';

const edges: Edge[] = ['right', 'left'];

const topBarItem = [
  {
    title: 'Contacts',
    isActive: true,
    nameForApi: 'contacts',
  },
  {
    title: 'Suppliers',
    isActive: false,
    nameForApi: 'suppliers',
  },
  {
    title: 'Customers',
    isActive: false,
    nameForApi: 'customers',
  },
];

const ContactsIndex = () => {
  // useEffect(() => {
  //   const setupCallKeepAndSIP = async () => {
  //     try {
  //       await setupCallKeepAndSIPFunc();

  //       RNCallKeep.addEventListener('didDisplayIncomingCall', data => {
  //         console.log('Incoming call displayed', data);
  //       });
  //       RNCallKeep.addEventListener('endCall', data => {
  //         sessionCancel();
  //         RNCallKeep.endAllCalls();
  //         // RNCallKeep.clearInitialEvents();
  //       });
  //       RNCallKeep.addEventListener('answerCall', data => {
  //         RNCallKeep.setCurrentCallActive(data?.callUUID);
  //       });
  //       RNCallKeep.addEventListener('didReceiveStartCallAction', data => {
  //         console.log('Start call action ', data);
  //       });
  //     } catch (error) {
  //       // sessionCancel();
  //     }
  //   };
  //   setupCallKeepAndSIP();
  //   return () => {
  //     RNCallKeep.removeEventListener('didDisplayIncomingCall');
  //     RNCallKeep.removeEventListener('didReceiveStartCallAction');
  //     RNCallKeep.removeEventListener('endCall');
  //     RNCallKeep.removeEventListener('answerCall');
  //   };
  // }, []);
  const toast = useToast();
  const [isSearch, setIsSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigation = useNavigation();
  const { colors } = useTheme();
  const isFocused = useIsFocused();
  const { userInfo, sbu: _sbu } = useRootStore();
  const [contacts, setContacts] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [topBar, setTopBar] = useState(topBarItem);
  const [partnerList, setPartnerList] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  useEffect(() => {
    getContact('');

    const activeTopBar = topBar?.find(it => it.isActive === true);
    if (activeTopBar?.nameForApi === 'customers') {
      getAllPartnerFromAPI(2, currentPage, 30, '');
    } else if (activeTopBar?.nameForApi === 'suppliers') {
      getAllPartnerFromAPI(1, currentPage, 30, '');
    }
  }, [isFocused, topBar, currentPage]);

  const getContact = async (srch?: string) => {
    const data = await getContactBook(
      userInfo?.intEmployeeId,
      0,
      userInfo?.intBusinessUnitId,
      0,
      0,
      '',
      '',
      '',
      srch,
      setIsLoading,
    );
    setContacts(data);
  };

  const getAllPartnerFromAPI = async (
    partnerTypeId: any,
    pageNo: any,
    pageSize: any,
    searchTxt: any,
    setIsLoading: any = () => {},
  ) => {
    const res = await getPartnerList(
      1,
      0,
      partnerTypeId,
      pageNo,
      pageSize,
      searchTxt,
      setIsLoading,
    );
    setPartnerList((prev: any) =>
      currentPage === 1 ? res : [...prev, ...res],
    );
  };

  useEffect(() => {
    if (searchQuery.length > 2) {
      setCurrentPage(1);
      getContact(searchQuery);
      getAllPartnerFromAPI(
        topBar.find(it => it.isActive === true)?.nameForApi === 'customers'
          ? 2
          : 1,
        currentPage,
        30,
        searchQuery,
      );
    } else {
      setCurrentPage(1);
      getContact('');
      getAllPartnerFromAPI(
        topBar.find(it => it.isActive === true)?.nameForApi === 'customers'
          ? 2
          : 1,
        currentPage,
        30,
        '',
      );
    }
  }, [searchQuery]);
  const handleTopBar = (ind: any) => {
    const mod = [...topBar];
    const temp = mod?.map((item: any, index: any) => {
      return {
        ...item,
        isActive: ind === index ? true : false,
      };
    });
    setTopBar(temp);
    setCurrentPage(1);
  };
  const dialCall = (phone?: String, email?: String) => {
    let phoneNumber = '';

    if (Platform.OS === 'android') {
      phoneNumber = `tel:${phone}`;
    } else {
      phoneNumber = `telprompt:${phone}`;
    }

    if (phone) {
      Linking.openURL(phoneNumber);
    } else if (email) {
      Linking.openURL(`mailto:${email}`);
    } else {
      toast.show({ message: 'Phone no is empty.', type: 'error' });
    }
  };
  const renderContactItem = ({ item }: any) => {
    return (
      <Column colWidth={'100%'} style={{ paddingHorizontal: 16 }}>
        <Column
          colWidth={'100%'}
          isCard
          isPressOn={false}
          onCardPress={() => {
            dialCall(item?.contactNumber, undefined);
            // makeCall(item?.contactNumber, item?.businessPartnerName, '')
          }}
        >
          <View style={styles.contactRow}>
            <View>
              <Text style={[styles.contactName, { color: colors.text }]}>
                {item?.businessPartnerName}
              </Text>
              <Text style={{ color: colors.text }}>{item?.contactNumber}</Text>
            </View>

            {/* Call Icon */}
            <TouchableOpacity
              onPress={() => {
                // makeCall(item.contactNumber, item.businessPartnerName, '')
              }}
              style={styles.iconBtn}
            >
              <Icon name="call" size={24} color={COLORS.primary} />
            </TouchableOpacity>
          </View>
        </Column>
      </Column>
    );
  };
  // console.log('partnerList', JSON.stringify(partnerList?.[0], null, 2));
  return (
    <ContainerNew
      edges={edges}
      isScrollView={false}
      isRefresh={false}
      header={
        !isSearch && (
          <CustomHeader
            alterIcon={'search'}
            alterIconPress={() => {
              setIsSearch(!isSearch);
              LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
            }}
            coreModulesIcon={true}
            coreModulesIconPress={() => navigation.goBack()}
            title="Contacts"
          />
        )
      }
    >
      <Column
        style={{
          marginTop: isSearch ? 110 : 0,
        }}
      >
        <LoadingContainer isLoading={isLoading} />
        <Column colWidth={'100%'}>
          <Row style={styles.head}>
            {topBar?.map((item, index) => (
              <TopBarItem
                item={item}
                index={index}
                onPress={handleTopBar}
                key={index?.toString()}
              />
            ))}
          </Row>

          {topBar[1].isActive || topBar[2].isActive ? (
            <CustomFlatList
              contentContainerStyle={styles.flatlistCont}
              data={partnerList}
              RenderItems={renderContactItem}
              setCurrentPage={setCurrentPage}
              currentPage={currentPage}
              isLoading={isLoading}
            />
          ) : (
            <FlatList
              ListFooterComponent={<View style={{ height: 150 }} />}
              data={contacts}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) =>
                item.Phone && (
                  <Column colWidth={'100%'} style={{ paddingHorizontal: 16 }}>
                    <Column
                      colWidth={'100%'}
                      isCard
                      isPressOn={false}
                      onCardPress={() => {
                        // makeCall(item.Phone, item.EmployeeName, '');
                      }}
                    >
                      <View style={styles.contactRow}>
                        <View>
                          <Text
                            style={[styles.contactName, { color: colors.text }]}
                          >
                            {item.EmployeeName}
                          </Text>
                          <Text style={{ color: colors.text }}>
                            {item.Phone}
                          </Text>
                        </View>

                        {/* Call Icon */}
                        <TouchableOpacity
                          onPress={() => {
                            // makeCall(item.Phone, item.EmployeeName, '')
                          }}
                          style={styles.iconBtn}
                        >
                          <Icon name="call" size={24} color={COLORS.primary} />
                        </TouchableOpacity>
                      </View>
                    </Column>
                  </Column>
                )
              }
            />
          )}
        </Column>
      </Column>
      {isSearch && (
        <SearchHeader
          setIsSearch={setIsSearch}
          isSearch={isSearch}
          inputText={searchQuery}
          setInputText={setSearchQuery}
        />
      )}
    </ContainerNew>
  );
};

export default ContactsIndex;

const styles = StyleSheet.create({
  appContainer: {
    paddingVertical: 10,
  },
  contactItem: {
    padding: 12,
    marginBottom: 8,
    borderRadius: 8,
  },
  contactName: {
    fontSize: 14,
    fontWeight: '500',
  },
  iconBtn: {
    padding: 8,
    borderRadius: 50,
  },
  contactRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  head: {
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 35,
    alignContent: 'center',
    paddingHorizontal: 14,
  },
  flatlistCont: {
    paddingBottom: 150,
  },
});
