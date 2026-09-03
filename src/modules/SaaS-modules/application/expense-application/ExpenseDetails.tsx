import {useIsFocused, useNavigation, useRoute} from '@react-navigation/native';
import React, {useState} from 'react';
import {
  Modal,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import {Edge} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {erpPeopleDeskURL} from '../../../../../App';
import {GetExpenseById} from '../../../../common/api/api';
import Column from '../../../../common/components/Column';
import ContainerNew from '../../../../common/components/Container';
import CustomHeader from '../../../../common/components/CustomHeader';
import CustomTextNew from '../../../../common/components/CustomText';
import Row from '../../../../common/components/Row';
import {IMAGES} from '../../../../common/constant/Index';
import {COLORS} from '../../../../common/constant/Themes';
import {httpRequest} from '../../../../common/constant/httpRequest';
import useAsyncEffect from '../../../../common/packages/useAsyncEffect/useAsyncEffect';
import {date_formater} from '../../../../common/services/dateFormater';
import {
  getEprocurementImageURL,
  getImageURL,
} from '../../../../common/services/getImage';
import {ExpenseDetailsType} from '../../../../interfaces/expense/expense';
import {useRootStore} from '../../../../stores/rootStore';
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons';

const edges: Edge[] = ['right', 'bottom', 'left'];

const ExpenseDetails = () => {
  const params = useRoute();
  //@ts-ignore
  const expenseId = params?.params?.expenseId;
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const [expenseDetails, setExpenseDetails] = useState<ExpenseDetailsType>();
  const {userInfo} = useRootStore();
  const [modalShow, setModalShow] = useState(false);
  const [downloadAttachment, setDownloadAttachment] = useState('');

  useAsyncEffect(
    async isMounted => {
      if (!isMounted()) {
        return null;
      }
      const api_params = {
        url: GetExpenseById,
        data: {ExpenseId: expenseId},
        baseURL: erpPeopleDeskURL,
      };
      const res = await httpRequest(api_params, () => {});

      setExpenseDetails(res?.[0]);
    },
    [isFocused],
  );

  const totalAmountMod = expenseDetails?.objRow?.map(item => item?.amount);
  const totalAmount =
    totalAmountMod && totalAmountMod?.reduce((acc, cur) => acc + cur);
  const isPdf = (link: string) => {
    return link?.toLowerCase()?.endsWith('.pdf') || false;
  };
  return (
    <ContainerNew
      edges={edges}
      header={<CustomHeader title="Details" onBackPress={navigation.goBack} />}
      style={styles.container}>
      <Column colWidth="100%">
        <Column
          colWidth={'100%'}
          colStyle={[styles.appContainer, {marginTop: 10}]}>
          <Row align="center" rowStyle={styles.rowStyle}>
            <Column colWidth="10%" align="center">
              <Icon name="date-range" size={25} color={COLORS.graySubText} />
            </Column>
            <Column colWidth="90%" align="center">
              <Column colWidth="100%">
                <CustomTextNew
                  text="Expense Type"
                  txtColor={COLORS.textNewColor}
                  txtSize={12}
                />
                <CustomTextNew
                  text={
                    userInfo?.intEmployeeId ===
                    expenseDetails?.objHeader?.expenseForEmployeeId
                      ? 'My Expense'
                      : 'In Employee'
                  }
                />
              </Column>
            </Column>
          </Row>
          {/* */}
          {userInfo?.intEmployeeId ===
          expenseDetails?.objHeader?.expenseForEmployeeId ? null : (
            <Row align="center" rowStyle={styles.rowStyle}>
              <Column colWidth="10%" align="center">
                <Icon name="person" size={25} color={COLORS.graySubText} />
              </Column>
              <Column colWidth="90%" align="center">
                <Column colWidth="100%">
                  <CustomTextNew
                    text="Employee"
                    txtColor={COLORS.textNewColor}
                    txtSize={12}
                  />

                  <View
                    style={[
                      styles.listContainer,
                      {
                        backgroundColor: COLORS.lightGray3,
                        padding: 3,
                        borderRadius: 10,
                      },
                    ]}>
                    <View style={styles.subContainer}>
                      <View
                        style={[
                          styles.imgContainer,
                          {height: 40, width: 40, borderRadius: 100},
                        ]}>
                        <FastImage
                          source={IMAGES.NoImage}
                          resizeMode="contain"
                          style={{
                            height: 40,
                            width: 40,
                            borderRadius: 100,
                          }}
                        />
                      </View>
                    </View>
                    <View style={{flex: 1}}>
                      <View style={{paddingLeft: 15}}>
                        <View style={{flexDirection: 'row'}}>
                          <CustomTextNew
                            text={
                              expenseDetails?.objHeader?.expenseForName || 'N/A'
                            }
                            txtColor={COLORS.black}
                            txtSize={14}
                            txtWeight={'600'}
                            lineHight={20}
                          />
                        </View>
                        <CustomTextNew
                          text={
                            expenseDetails?.objHeader?.expenseForDesignation ||
                            'N/A'
                          }
                          txtColor={COLORS.graySubText}
                          txtSize={13}
                          lineHight={20}
                        />
                      </View>
                    </View>
                  </View>
                </Column>
              </Column>
            </Row>
          )}

          <Row align="center" rowStyle={styles.rowStyle}>
            <Column colWidth="10%" align="center">
              <Icon name="short-text" size={25} color={COLORS.graySubText} />
            </Column>
            <Column colWidth="90%" align="center">
              <Column colWidth="100%">
                <CustomTextNew
                  text="Start Date"
                  txtColor={COLORS.textNewColor}
                  txtSize={12}
                />

                <CustomTextNew
                  text={date_formater(expenseDetails?.objHeader?.fromDate)}
                />
              </Column>
            </Column>
          </Row>
          <Row align="center" rowStyle={styles.rowStyle}>
            <Column colWidth="10%" align="center">
              <Icon name="terrain" color={COLORS.graySubText} size={25} />
            </Column>
            <Column colWidth="90%" align="center">
              <Column colWidth="100%">
                <CustomTextNew
                  text="To Date"
                  txtColor={COLORS.textNewColor}
                  txtSize={12}
                />

                <CustomTextNew
                  text={date_formater(expenseDetails?.objHeader?.toDate)}
                />
              </Column>
            </Column>
          </Row>
          <Row align="center" rowStyle={styles.rowStyle}>
            <Column colWidth="10%" align="center">
              <Icon
                name="lightbulb-outline"
                size={25}
                color={COLORS.graySubText}
              />
            </Column>
            <Column colWidth="90%" align="center">
              <Column colWidth="100%">
                <CustomTextNew
                  text="Total Amount"
                  txtColor={COLORS.textNewColor}
                  txtSize={12}
                />

                <CustomTextNew
                  text={expenseDetails?.objHeader?.totalAmount || 'N/A'}
                />
              </Column>
            </Column>
          </Row>
          <Row align="center" rowStyle={styles.rowStyle}>
            <Column colWidth="10%" align="center">
              <Icon name="wysiwyg" color={COLORS.graySubText} size={25} />
            </Column>
            <Column colWidth="90%" align="center">
              <Column colWidth="100%">
                <CustomTextNew
                  text="Comments"
                  txtColor={COLORS.textNewColor}
                  txtSize={12}
                />

                <CustomTextNew
                  text={expenseDetails?.objHeader?.comments || 'N/A'}
                />
              </Column>
            </Column>
          </Row>
        </Column>
        <Column style={styles.divider} />
        <Column colWidth={'100%'} colStyle={styles.appContainer}>
          <Column colWidth={'100%'}>
            <CustomTextNew text={'Approver'} txtSize={16} txtWeight={'500'} />

            {/* for supervisor  */}
            <Column style={styles.listContainer}>
              <Column style={styles.subContainer}>
                {expenseDetails?.objHeader?.supervisorImageId ? (
                  <Column style={styles.imgContainer}>
                    <FastImage
                      source={{
                        uri: getImageURL(
                          expenseDetails?.objHeader?.supervisorImageId,
                        ),
                      }}
                      resizeMode="cover"
                      style={{height: 50, width: 50, borderRadius: 100}}
                    />
                  </Column>
                ) : (
                  <Column style={styles.imgContainer}>
                    <FastImage
                      source={IMAGES.NoImage}
                      resizeMode="cover"
                      style={{height: 50, width: 50, borderRadius: 100}}
                    />
                  </Column>
                )}
              </Column>
              <Column style={{flex: 1}}>
                <View style={{paddingLeft: 15}}>
                  <CustomTextNew
                    text={expenseDetails?.objHeader?.supervisorName || 'N/A'}
                    txtColor={COLORS.black}
                    txtSize={14}
                    txtWeight={'600'}
                    lineHight={20}
                  />
                  <CustomTextNew
                    text={'Supervisor'}
                    txtColor={COLORS.graySubText}
                    txtSize={13}
                    lineHight={20}
                  />
                  <CustomTextNew
                    text={
                      expenseDetails?.objHeader?.supervisorDesignation || 'N/A'
                    }
                    txtColor={COLORS.graySubText}
                    txtSize={13}
                    lineHight={20}
                  />
                  <Column style={{flexDirection: 'row'}}>
                    <Column>
                      <CustomTextNew
                        text={'Status'}
                        txtColor={COLORS.graySubText}
                        txtSize={13}
                        lineHight={20}
                      />
                    </Column>
                    <Column style={{marginLeft: 5}}>
                      <CustomTextNew
                        text={
                          expenseDetails?.objHeader?.isSupervisorApproved
                            ? 'Approved'
                            : 'Pending'
                        }
                        txtColor={
                          expenseDetails?.objHeader?.isSupervisorApproved
                            ? COLORS.primary
                            : COLORS.warning
                        }
                        txtSize={13}
                        lineHight={20}
                      />
                    </Column>
                  </Column>
                </View>
              </Column>
            </Column>

            {/* for line manager  */}
            <Column style={styles.listContainer}>
              <Column style={styles.subContainer}>
                {expenseDetails?.objHeader?.lineManagerImageId ? (
                  <Column style={styles.imgContainer}>
                    <FastImage
                      source={{
                        uri: getImageURL(
                          expenseDetails?.objHeader?.lineManagerImageId,
                        ),
                      }}
                      resizeMode="cover"
                      style={{height: 50, width: 50, borderRadius: 100}}
                    />
                  </Column>
                ) : (
                  <Column style={styles.imgContainer}>
                    <FastImage
                      source={IMAGES.NoImage}
                      resizeMode="cover"
                      style={{height: 50, width: 50, borderRadius: 100}}
                    />
                  </Column>
                )}
              </Column>
              <Column style={{flex: 1}}>
                <Column style={{paddingLeft: 15}}>
                  <CustomTextNew
                    text={expenseDetails?.objHeader?.lineManagerName || 'N/A'}
                    txtColor={COLORS.black}
                    txtSize={14}
                    txtWeight={'600'}
                    lineHight={20}
                  />
                  <CustomTextNew
                    text={'Line Manager'}
                    txtColor={COLORS.graySubText}
                    txtSize={13}
                    lineHight={20}
                  />
                  <CustomTextNew
                    text={
                      expenseDetails?.objHeader?.lineManagerDesignation || 'N/A'
                    }
                    txtColor={COLORS.graySubText}
                    txtSize={13}
                    lineHight={20}
                  />

                  <Column style={{flexDirection: 'row'}}>
                    <Column>
                      <CustomTextNew
                        text={'Status'}
                        txtColor={COLORS.graySubText}
                        txtSize={13}
                        lineHight={20}
                      />
                    </Column>
                    <Column style={{marginLeft: 5}}>
                      <CustomTextNew
                        text={
                          expenseDetails?.objHeader?.isLineManagerApproved
                            ? 'Approved'
                            : 'Pending'
                        }
                        txtColor={
                          expenseDetails?.objHeader?.isLineManagerApproved
                            ? COLORS.primary
                            : COLORS.warning
                        }
                        txtSize={13}
                        lineHight={20}
                      />
                    </Column>
                  </Column>
                </Column>
              </Column>
            </Column>
          </Column>
        </Column>
        <Column style={styles.divider} />

        <Column colWidth={'100%'} colStyle={styles.col}>
          <CustomTextNew
            text={`Total Amount BDT: ${totalAmount?.toFixed(2) || 0}`}
          />
        </Column>

        {expenseDetails?.objRow && expenseDetails?.objRow?.length > 0 && (
          <Column colWidth={'100%'} colStyle={styles.appContainer}>
            {expenseDetails?.objRow?.map((item: any, index: number) => (
              <Column
                isPressOn={false}
                onCardPress={() =>
                  //@ts-ignore
                  navigation.navigate('ExpenseBillDetails', {
                    item,
                  })
                }
                colWidth="100%"
                key={index}>
                <Row rowStyle={styles.addedItem}>
                  <Column colWidth="5.5%">
                    <MCIcon
                      name="checkbox-blank-circle-outline"
                      style={styles.itemCancelIcon}
                    />
                  </Column>
                  <Column
                    colWidth="90%"
                    colStyle={styles.addedItemTextContainer}>
                    <View>
                      <Text style={{color: COLORS.graySubText}}>
                        {date_formater(item?.expenseDate)}— Amount{' '}
                        <Text style={styles.amountTxt}>
                          BDT {item?.numAmount || item?.amount}
                        </Text>
                      </Text>
                    </View>
                    <CustomTextNew
                      subTxt
                      text={`Cost Element: ${item?.costElementName}`}
                      lineHight={20}
                    />
                    <CustomTextNew
                      subTxt
                      numberOfLines={1}
                      text={`Description: ${item?.comments}`}
                      lineHight={20}
                    />
                    {item?.attachmentLink && (
                      <Row align="center">
                        <Column
                          colWidth="100%"
                          colStyle={{
                            paddingVertical: 8,
                          }}>
                          <Column
                            isPressOn={false}
                            onCardPress={() => {
                              if (isPdf(item?.attachmentLink)) {
                                navigation.navigate('PDFViewer', {
                                  fileId: item?.attachmentLink,
                                  fileName: item?.attachmentLink,
                                  isExpenseApproval: true,
                                });
                              } else {
                                //@ts-ignore
                                setModalShow(true);
                                setDownloadAttachment(item?.attachmentLink);
                              }
                              // setModalShow(true);
                              // setDownloadAttachment(item?.attachmentLink);
                            }}
                            colWidth="100%">
                            <CustomTextNew
                              text={'Attachement'}
                              txtColor={COLORS.blue}
                            />
                          </Column>
                        </Column>
                      </Row>
                    )}
                  </Column>
                </Row>
              </Column>
            ))}
          </Column>
        )}
      </Column>

      <Modal
        animationType="fade"
        transparent
        visible={modalShow}
        onRequestClose={() => {
          setModalShow(!modalShow);
        }}>
        <TouchableWithoutFeedback
          onPress={() => {
            setModalShow(!modalShow);
          }}>
          <View style={styles.imgCon}>
            <FastImage
              style={styles.modalImg}
              source={{
                uri: getEprocurementImageURL(downloadAttachment),
              }}
              resizeMode={FastImage.resizeMode.contain}
            />
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </ContainerNew>
  );
};

export default ExpenseDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 0,
    backgroundColor: COLORS.white,
  },
  col: {
    backgroundColor: COLORS.lightPrimary2,
    padding: 10,
    marginVertical: 10,
  },
  listContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  subContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  imgContainer: {
    height: 50,
    width: 50,
    // backgroundColor: COLORS.primary,
    borderRadius: 50 / 2,
  },
  addedItemTextContainer: {
    marginLeft: 8,
  },
  addedItem: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.iconGrayBackground,
  },
  itemCancelIcon: {
    fontSize: 18,
    color: COLORS.graySubText,
    marginTop: 4,
  },
  amountTxt: {
    fontWeight: '500',
    color: COLORS.black,
    lineHeight: 20,
  },
  imgCon: {
    paddingHorizontal: 30,
    paddingVertical: 120,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalImg: {
    borderRadius: 8,
    width: '100%',
    height: '100%',
    backgroundColor: COLORS.white,
  },
  appContainer: {
    paddingHorizontal: 16,
  },
  rowStyle: {
    marginBottom: 10,
  },
  divider: {
    borderBottomWidth: 5,
    borderBottomColor: COLORS.lightGray3,
    marginVertical: 8,
  },
});
