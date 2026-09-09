/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
import {useIsFocused, useNavigation, useRoute} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Edge} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import {commonURL, erpPeopleDeskURL} from '../../../../../App';
import {
  EditExpenseRegisterForApps,
  ExpenseApprovalEngine,
  GetExpenseById} from '../../../../common/api/api';
import Column from '../../../../common/components/Column';
import ContainerNew from '../../../../common/components/Container';
import CustomHeader from '../../../../common/components/CustomHeader';
import CustomTextNew from '../../../../common/components/CustomText';
import Row from '../../../../common/components/Row';
import {COLORS} from '../../../../common/constant/Themes';
import {httpRequest} from '../../../../common/constant/httpRequest';
import useAsyncEffect from '../../../../common/packages/useAsyncEffect/useAsyncEffect';
import {date_formater} from '../../../../common/services/dateFormater';
import {ExpenseDetailsType} from '../../../../interfaces/expense/expense';
import FastImage from 'react-native-fast-image';
import {IMAGES} from '../../../../common/constant/Index';
import {getImageURL} from '../../../../common/services/getImage';
import {useRootStore} from '../../../../stores/rootStore';
import {useToast} from '../../../../common/components/CustomToast';
import LoadingContainer from '../../../../common/components/Loading';
import CustomModalNew from '../../../../common/components/CustomModal';
import CustomInputNew from '../../../../common/components/CustomInput';
import {useForm} from 'react-hook-form';
import {rqDetailsStyle} from '../../../arl-core-modules/shared/rqDetailsStyle';

const edges: Edge[] = ['right', 'bottom', 'left'];

const ExpenseApprovalDetails = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [approveLoading, setApproveLoading] = useState(false);
  const [isModalShow, setIsModalShow] = useState(false);
  const params = useRoute();
  //@ts-ignore
  const expenseId = params?.params?.expenseId;
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const [expenseDetails, setExpenseDetails] = useState<ExpenseDetailsType>();
  const {userInfo} = useRootStore();
  const toaster = useToast();
  // const [reload, setReload] = useState(false);

  const {control, setValue, reset: _reset} = useForm();

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
      const res = await httpRequest(api_params, setIsLoading);

      if (res?.[0]) {
        setExpenseDetails(res[0]); // Ensure this state update completes first
      }
    },
    [isFocused],
  );

  useEffect(() => {
    if (expenseDetails?.objRow) {
      expenseDetails.objRow.forEach((itm: any, ind: any) => {
        setValue(
          `expenseAmount${ind}${itm?.expenseRowId}`,
          itm?.amount?.toString(),
        );
      });
    }
  }, [expenseDetails, setValue]); // Dependency ensures this runs when expenseDetails updates
  const totalAmount = expenseDetails?.objRow?.reduce((acc: any, curr: any) => {
    return acc + +curr?.amount;
  }, 0);
  const handleApprove = async () => {
    const expenseApprovalRow = expenseDetails?.objRow?.map(item => ({
      rowId: item?.expenseRowId,
      costCenterId: item?.costCenterId,
      costCenterName: item?.costCenterName,
      profitCenterId: item?.profitCenterId,
      profitCenterName: item?.profitCenterName,
      costElementId: item?.costElementId,
      costElementName: item?.costElementName,
      dteExpenseDate: item?.expenseDate,
      businessTransactionId: item?.businessTransactionId,
      businessTransactionName: item?.businessTransactionName,
      numQuantity: item?.quantity,
      numRate: item?.rate,
      numAmount: item?.amount,
      expenseLocation: item?.expenseLocation,
      comments: item?.comments,
      attachmentLink: item?.attachmentLink,
      driverName: item?.driverName || '',
      driverId: item?.driverId,
    }));

    const payload = {
      objHeader: {
        expenseId: expenseDetails?.objHeader?.expenseId,
        expenseCode: expenseDetails?.objHeader?.expenseCode,
        accountId: expenseDetails?.objHeader?.accountId,
        businessUnitId: expenseDetails?.objHeader?.businessUnitId,
        businessUnitName: expenseDetails?.objHeader?.businessUnitName,
        sbuid: expenseDetails?.objHeader?.sbuid,
        sbuname: expenseDetails?.objHeader?.sbuname,
        countryId: expenseDetails?.objHeader?.countryId,
        countryName: expenseDetails?.objHeader?.countryName,
        currencyId: expenseDetails?.objHeader?.currencyId,
        currencyName: expenseDetails?.objHeader?.currencyName,
        dteFromDate: expenseDetails?.objHeader?.fromDate,
        dteToDate: expenseDetails?.objHeader?.toDate,
        projectId: expenseDetails?.objHeader?.projectId,
        projectName: expenseDetails?.objHeader?.projectName,
        costCenterId: expenseDetails?.objHeader?.costCenterId,
        costCenterName: expenseDetails?.objHeader?.costCenterName,
        instrumentId: expenseDetails?.objHeader?.instrumentId,
        instrumentName: expenseDetails?.objHeader?.instrumentName,
        disbursementCenterId: expenseDetails?.objHeader?.disbursementCenterId,
        disbursementCenterName:
          expenseDetails?.objHeader?.disbursementCenterName,
        vehicleId: expenseDetails?.objHeader?.vehicleId,
        numTotalAmount: totalAmount, // expenseDetails?.objHeader?.totalAmount
        comments: expenseDetails?.objHeader?.comments,
        numTotalApprovedAmount: totalAmount, // expenseDetails?.objHeader?.totalApprovedAmount
        actionBy: userInfo?.intErpUserId,
        willApproved: true,
        plantId: expenseDetails?.objHeader?.plantId,
        expenseGroup: expenseDetails?.objHeader?.expenseGroup,
        expenseForId: expenseDetails?.objHeader?.expenseForId,
        internalAccountId: expenseDetails?.objHeader?.internalAccountId,
      },
      objRow: expenseApprovalRow,
    };

    const api_params = {
      url: EditExpenseRegisterForApps,
      data: payload,
      method: 'put',
      baseURL: erpPeopleDeskURL,
    };
    const commonPayload = [
      {
        applicationId: expenseId?.expenseId,
        approverEmployeeId: userInfo?.intEmployeeId,
        isReject: false,
        accountId: 1,
        isAdmin: userInfo?.isOfficeAdmin,
      },
    ];
    const commonParams = {
      url: ExpenseApprovalEngine,
      data: commonPayload,
      method: 'post',
    };
    // console.log('api===========>', JSON.stringify(api_params, null, 2));
    const res = await httpRequest(
      userInfo?.strUrl === commonURL ? commonParams : api_params,
      setApproveLoading,
    );
    if (
      res?.statusCode === 200 ||
      res?.StatusCode === 200 ||
      res?.statuscode === 200 ||
      res.includes('Approved Successfully')
    ) {
      toaster.show({
        message: 'Successfully Approved',
        type: 'success',
      });
      navigation.goBack();
    } else {
      toaster.show({
        message: 'Something Went Wrong!',
        type: 'warning',
      });
    }
  };

  const totalAmountBDT = expenseDetails?.objRow?.reduce(
    (acc, cur) => acc + cur?.amount,
    0,
  );

  const rowAmountHandler = (rowId: any, index: any, amount: any) => {
    setExpenseDetails(prevDetails => {
      if (!prevDetails || !prevDetails.objRow) return prevDetails; // Prevent errors if data is missing

      // Deep copy objRow to avoid mutating state directly
      const updatedRows = prevDetails.objRow.map((row, idx) =>
        idx === index && row.expenseRowId === rowId
          ? {...row, amount: +amount, rate: +amount}
          : row,
      );

      // Return the updated state
      return {
        ...prevDetails,
        objRow: updatedRows,
      };
    });
  };
  return (
    <ContainerNew
      edges={edges}
      isFloatBottomButton={approveLoading ? false : true}
      btnText="Approve"
      singleFloatBtmBtnStyle={styles.btmBtnStyle}
      singleFloatBtmBtnPress={() => setIsModalShow(true)}
      header={
        <CustomHeader
          title="Approval Details"
          onBackPress={navigation.goBack}
        />
      }
      style={[
        styles.container,
        userInfo?.strUrl === commonURL
          ? {
              backgroundColor: COLORS.white,
            }
          : null,
      ]}>
      <LoadingContainer isLoading={isLoading} />
      <Row direction="column">
        <Column colWidth="100%" colStyle={styles.mainDetails}>
          <Row direction="column" rowStyle={styles.rowWrapper}>
            <Row align="center" rowStyle={styles.rowElement}>
              <Column colWidth="10%">
                <Icon name="date-range" style={styles.icon} />
              </Column>
              <Column colWidth="90%" colStyle={styles.topBottomTextContainer}>
                <Column colWidth="100%" colStyle={styles.topBoxItemText}>
                  <Row direction="row" justify="space-between" align="center">
                    <CustomTextNew
                      text="Expense Group"
                      txtColor={COLORS.textNewColor}
                      txtSize={12}
                    />
                  </Row>
                  <CustomTextNew
                    text={
                      expenseDetails?.objHeader?.expenseGroup ||
                      expenseId?.expenseGroup ||
                      'N/A'
                    }
                  />
                </Column>
              </Column>
            </Row>

            {userInfo?.intEmployeeId ===
            expenseDetails?.objHeader?.expenseForEmployeeId ? null : (
              <Row align="center" rowStyle={styles.rowElement}>
                <Column colWidth="10%">
                  <Icon name="person" style={styles.icon} />
                </Column>
                <Column colWidth="90%" colStyle={styles.topBottomTextContainer}>
                  <Column colWidth="100%" colStyle={styles.topBoxItemText}>
                    <Row direction="row" justify="space-between" align="center">
                      <CustomTextNew
                        text="Employee"
                        txtColor={COLORS.textNewColor}
                        txtSize={12}
                      />
                    </Row>

                    <View
                      style={[
                        styles.listContainer,
                        {
                          backgroundColor: COLORS.lightGray3,
                          padding: 3,
                          borderRadius: 20,
                        },
                      ]}>
                      <View style={styles.subContainer}>
                        <View
                          style={[
                            styles.imgContainer,
                            {height: 40, width: 40, borderRadius: 100},
                          ]}>
                          {/* <FastImage
                            source={IMAGES.NoImage}
                            resizeMode="contain"
                            style={{
                              height: 40,
                              width: 40,
                              borderRadius: 100,
                            }}
                          /> */}
                          {expenseDetails?.objHeader?.expenseForImageId ||
                          expenseId?.expenseForImageId ? (
                            <FastImage
                              source={{
                                uri: expenseDetails?.objHeader
                                  ?.expenseForImageId
                                  ? getImageURL(
                                      expenseDetails?.objHeader
                                        ?.expenseForImageId,
                                    )
                                  : getImageURL(expenseId?.expenseForImageId),
                              }}
                              style={styles.profileImage}
                            />
                          ) : (
                            <FastImage
                              source={IMAGES.NoImage}
                              style={styles.profileImage}
                            />
                          )}
                        </View>
                      </View>
                      <View style={{flex: 1}}>
                        <View style={{paddingLeft: 15}}>
                          <View style={{flexDirection: 'row'}}>
                            <CustomTextNew
                              text={
                                //@ts-ignore
                                expenseDetails?.objHeader?.expenseForName ||
                                expenseId?.expenseBy ||
                                'N/A'
                              }
                              txtColor={COLORS.black}
                              txtSize={14}
                              txtWeight={'600'}
                              lineHight={20}
                            />
                          </View>
                          <CustomTextNew
                            text={
                              expenseDetails?.objHeader
                                ?.expenseForDesignation ||
                              expenseId?.employeeDesignation ||
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

            <Row align="center" rowStyle={styles.rowElement}>
              <Column colWidth="10%">
                <Icon name="short-text" style={styles.icon} />
              </Column>
              <Column colWidth="90%" colStyle={styles.topBottomTextContainer}>
                <Column colWidth="100%" colStyle={styles.topBoxItemText}>
                  <Row direction="row" justify="space-between" align="center">
                    <CustomTextNew
                      text="Start Date"
                      txtColor={COLORS.textNewColor}
                      txtSize={12}
                    />
                  </Row>
                  <CustomTextNew
                    text={date_formater(expenseDetails?.objHeader?.fromDate)}
                  />
                </Column>
              </Column>
            </Row>
            <Row align="center" rowStyle={styles.rowElement}>
              <Column colWidth="10%">
                <Icon name="terrain" style={styles.icon} />
              </Column>
              <Column colWidth="90%" colStyle={styles.topBottomTextContainer}>
                <Column colWidth="100%" colStyle={styles.topBoxItemText}>
                  <Row direction="row" justify="space-between" align="center">
                    <CustomTextNew
                      text="To Date"
                      txtColor={COLORS.textNewColor}
                      txtSize={12}
                    />
                  </Row>
                  <CustomTextNew
                    text={date_formater(expenseDetails?.objHeader?.toDate)}
                  />
                </Column>
              </Column>
            </Row>
            <Row align="center" rowStyle={styles.rowElement}>
              <Column colWidth="10%">
                <Icon name="lightbulb-outline" style={styles.icon} />
              </Column>
              <Column colWidth="90%" colStyle={styles.topBottomTextContainer}>
                <Column colWidth="100%" colStyle={styles.topBoxItemText}>
                  <Row direction="row" justify="space-between" align="center">
                    <CustomTextNew
                      text="Total Amount"
                      txtColor={COLORS.textNewColor}
                      txtSize={12}
                    />
                  </Row>
                  <CustomTextNew
                    text={
                      totalAmount ||
                      expenseDetails?.objHeader?.totalAmount ||
                      expenseId?.totalAmount ||
                      'N/A'
                    }
                  />
                </Column>
              </Column>
            </Row>
            <Row align="center" rowStyle={styles.rowElement}>
              <Column colWidth="10%">
                <Icon name="wysiwyg" style={styles.icon} />
              </Column>
              <Column colWidth="90%" colStyle={styles.topBottomTextContainer}>
                <Column colWidth="100%" colStyle={styles.topBoxItemText}>
                  <Row direction="row" justify="space-between" align="center">
                    <CustomTextNew
                      text="Comments"
                      txtColor={COLORS.textNewColor}
                      txtSize={12}
                    />
                  </Row>
                  <CustomTextNew
                    text={
                      expenseDetails?.objHeader?.comments ||
                      expenseId?.comments ||
                      'N/A'
                    }
                  />
                </Column>
              </Column>
            </Row>

            {/* approvar  */}

            {userInfo?.strUrl !== commonURL ? (
              <>
                <View
                  style={{
                    borderBottomWidth: 5,
                    borderBottomColor: COLORS.lightGray3,
                    marginVertical: 8,
                  }}
                />
                <View style={{paddingHorizontal: 16}}>
                  <CustomTextNew
                    text={'Approver'}
                    txtSize={16}
                    txtWeight={'500'}
                  />

                  {/* for supervisor  */}
                  <View style={styles.listContainer}>
                    <View style={styles.subContainer}>
                      {expenseDetails?.objHeader?.supervisorImageId ? (
                        <View style={styles.imgContainer}>
                          <FastImage
                            source={{
                              uri: getImageURL(
                                expenseDetails?.objHeader?.supervisorImageId,
                              ),
                            }}
                            resizeMode="cover"
                            style={{height: 50, width: 50, borderRadius: 100}}
                          />
                        </View>
                      ) : (
                        <View style={styles.imgContainer}>
                          <FastImage
                            source={IMAGES.NoImage}
                            resizeMode="cover"
                            style={{height: 50, width: 50, borderRadius: 100}}
                          />
                        </View>
                      )}
                    </View>
                    <View style={{flex: 1}}>
                      <View style={{paddingLeft: 15}}>
                        <View style={{flexDirection: 'row'}}>
                          <CustomTextNew
                            text={
                              //@ts-ignore
                              expenseDetails?.objHeader?.supervisorName || 'N/A'
                            }
                            txtColor={COLORS.black}
                            txtSize={14}
                            txtWeight={'600'}
                            lineHight={20}
                          />
                        </View>
                        <CustomTextNew
                          text={
                            //@ts-ignore
                            expenseDetails?.objHeader?.supervisorDesignation ||
                            'N/A'
                          }
                          txtColor={COLORS.graySubText}
                          txtSize={13}
                          lineHight={20}
                        />

                        <View style={{flexDirection: 'row'}}>
                          <View>
                            <CustomTextNew
                              text={'Status'}
                              txtColor={COLORS.graySubText}
                              txtSize={13}
                              lineHight={20}
                            />
                          </View>
                          <View style={{marginLeft: 5}}>
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
                          </View>
                        </View>
                      </View>
                    </View>
                  </View>

                  {/* for line manager  */}
                  <View style={styles.listContainer}>
                    <View style={styles.subContainer}>
                      {expenseDetails?.objHeader?.lineManagerImageId ? (
                        <View style={styles.imgContainer}>
                          <FastImage
                            source={{
                              uri: getImageURL(
                                expenseDetails?.objHeader?.lineManagerImageId,
                              ),
                            }}
                            resizeMode="cover"
                            style={{height: 50, width: 50, borderRadius: 100}}
                          />
                        </View>
                      ) : (
                        <View style={styles.imgContainer}>
                          <FastImage
                            source={IMAGES.NoImage}
                            resizeMode="cover"
                            style={{height: 50, width: 50, borderRadius: 100}}
                          />
                        </View>
                      )}
                    </View>
                    <View style={{flex: 1}}>
                      <View style={{paddingLeft: 15}}>
                        <View style={{flexDirection: 'row'}}>
                          <CustomTextNew
                            text={
                              //@ts-ignore
                              expenseDetails?.objHeader?.lineManagerName ||
                              'N/A'
                            }
                            txtColor={COLORS.black}
                            txtSize={14}
                            txtWeight={'600'}
                            lineHight={20}
                          />
                        </View>
                        <CustomTextNew
                          text={
                            //@ts-ignore
                            expenseDetails?.objHeader?.lineManagerDesignation ||
                            'N/A'
                          }
                          txtColor={COLORS.graySubText}
                          txtSize={13}
                          lineHight={20}
                        />

                        <View style={{flexDirection: 'row'}}>
                          <View>
                            <CustomTextNew
                              text={'Status'}
                              txtColor={COLORS.graySubText}
                              txtSize={13}
                              lineHight={20}
                            />
                          </View>
                          <View style={{marginLeft: 5}}>
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
                          </View>
                        </View>
                      </View>
                    </View>
                  </View>
                </View>
                <View
                  style={{
                    borderBottomWidth: 5,
                    borderBottomColor: COLORS.lightGray3,
                    marginVertical: 8,
                  }}
                />
              </>
            ) : null}
            {userInfo?.strUrl !== commonURL ? (
              <Row direction="column" rowStyle={styles.p16} isCard>
                <Row justify="space-between" rowStyle={styles.mv10}>
                  <Column>
                    <CustomTextNew
                      txtSize={16}
                      txtWeight={500}
                      lineHight={24}
                      text="Expense List"
                    />
                  </Column>
                </Row>

                {
                  //@ts-ignore
                  expenseDetails && expenseDetails?.objRow?.length > 0 ? (
                    <Row justify="center" rowStyle={styles.amountRow}>
                      <CustomTextNew
                        text={`Total expense ${
                          expenseDetails?.objRow?.length || 0
                        }`}
                        lineHight={20}
                        txtWeight={'500'}
                        txtColor={COLORS.primary}
                      />

                      <Column colStyle={styles.borderLeft}>
                        <CustomTextNew
                          text={`Amount BDT ${totalAmountBDT || 0} `}
                          lineHight={20}
                          txtWeight={'500'}
                          txtColor={COLORS.primary}
                        />
                      </Column>
                    </Row>
                  ) : null
                }

                <Row direction="column" rowStyle={styles.addedItemContainer2}>
                  {
                    //@ts-ignore
                    expenseDetails?.objRow?.length > 0 && (
                      <>
                        {expenseDetails?.objRow?.map(
                          (item: any, index: number) => (
                            <Column colWidth="100%" key={index}>
                              <Row rowStyle={styles.addedItem}>
                                <Column colWidth="5.5%" isPressOn={false}>
                                  <MCIcon
                                    name="circle-outline"
                                    style={styles.itemCircleIcon}
                                  />
                                </Column>
                                <Column
                                  colWidth="90%"
                                  colStyle={styles.addedItemTextContainer}
                                  isPressOn={false}
                                  onCardPress={() => {
                                    //@ts-ignore
                                    navigation.navigate('ExpenseBillDetails', {
                                      item,
                                    });
                                  }}>
                                  <View>
                                    <Text style={{color: COLORS.graySubText}}>
                                      {date_formater(item?.expenseDate)}
                                      {userInfo?.strUrl !==
                                      'https://arl.peopledesk.io' ? (
                                        <Text style={styles.amountTxt}>
                                          {' '}
                                          — Amount BDT{' '}
                                          {item?.numAmount || item?.amount}
                                        </Text>
                                      ) : null}
                                    </Text>
                                  </View>
                                  {userInfo?.strUrl ===
                                  'https://arl.peopledesk.io' ? (
                                    <CustomInputNew
                                      control={control}
                                      name={`expenseAmount${index}${item?.expenseRowId}`}
                                      keyboardType="numeric"
                                      label="Expense Amount"
                                      onChange={(e: any) => {
                                        rowAmountHandler(
                                          item?.expenseRowId,
                                          index,
                                          e,
                                        );
                                        setValue(
                                          `expenseAmount${index}${item?.expenseRowId}`,
                                          e,
                                        );
                                      }}
                                    />
                                  ) : null}

                                  <CustomTextNew
                                    subTxt
                                    text={`Cost Element: ${item?.costElementName || ''}`}
                                    lineHight={20}
                                  />
                                  <CustomTextNew
                                    subTxt
                                    text={`Cost Center: ${item?.costCenterName || ''}`}
                                    lineHight={20}
                                  />
                                  <CustomTextNew
                                    subTxt
                                    text={`Profit Center: ${item?.profitCenterName || ''}`}
                                    lineHight={20}
                                  />
                                  <CustomTextNew
                                    subTxt
                                    numberOfLines={1}
                                    text={`Description: ${item?.comments || ''}`}
                                    lineHight={20}
                                  />
                                </Column>
                              </Row>
                            </Column>
                          ),
                        )}
                      </>
                    )
                  }
                </Row>
              </Row>
            ) : null}
          </Row>
        </Column>
      </Row>
      <CustomModalNew
        setIsModalShow={setIsModalShow}
        isModalShow={isModalShow}
        onPressCallApi={handleApprove}
        modalText={'Are you sure, you want to Approve this?'}
        deleteText={'Confirm'}
      />
    </ContainerNew>
  );
};

export default ExpenseApprovalDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 0,
    backgroundColor: COLORS.newGray,
  },
  ...rqDetailsStyle,
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
  noDataText: {
    textAlign: 'center',
    color: COLORS.textNewColor,
    paddingTop: 10,
    fontSize: 14,
  },
  noDataContainer: {
    alignSelf: 'center',
    paddingTop: 200,
  },
  fastImg: {
    width: 130,
    height: 90,
  },
  horizontalLine: {
    borderBottomWidth: 5,
    borderBottomColor: COLORS.lightGray3,
    marginVertical: 8,
  },
  p16: {
    padding: 16,
  },
  mv10: {
    marginVertical: 10,
  },
  amountRow: {
    backgroundColor: '#DAFCDE',
    paddingVertical: 4,
    paddingHorizontal: 8,
    color: COLORS.statusBar,
    marginTop: 8,
  },
  borderLeft: {
    borderLeftWidth: 1,
    borderLeftColor: COLORS.offDay,
    paddingLeft: 8,
    marginLeft: 8,
  },
  addedItemContainer2: {
    paddingBottom: 2,
  },
  addedItem: {
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: COLORS.iconGrayBackground,
  },
  addedItemTextContainer: {
    marginLeft: 8,
  },
  amountTxt: {
    fontWeight: '500',
    color: COLORS.black,
    lineHeight: 20,
  },
  itemCircleIcon: {
    fontSize: 18,
    color: '#000',
    marginTop: 4,
  },
  profileImage: {
    width: 24,
    height: 24,
    borderRadius: 100,
    backgroundColor: COLORS.iconGrayBackground,
  },
});
