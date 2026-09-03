/* eslint-disable react-native/no-inline-styles */
import {useIsFocused, useNavigation, useRoute} from '@react-navigation/native';
import React, {useState} from 'react';
import {
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  View,
  Text,
} from 'react-native';
import {Edge} from 'react-native-safe-area-context';
import {useForm} from 'react-hook-form';
import Column from '../../../../../common/components/Column';
import ContainerNew from '../../../../../common/components/Container';
import CustomHeader from '../../../../../common/components/CustomHeader';
import CustomInputNew from '../../../../../common/components/CustomInput';
import CustomTextNew from '../../../../../common/components/CustomText';
import Row from '../../../../../common/components/Row';
import {COLORS} from '../../../../../common/constant/Themes';
import MIcon from 'react-native-vector-icons/MaterialIcons';
import {
  getReportListAgainstJD,
  saveEmployeeReportAgainstJD,
} from '../../../../../services/SaaS-modules/dashboard/employeeDashboard';
import {useRootStore} from '../../../../../stores/rootStore';
import {useToast} from '../../../../../common/components/CustomToast';
import useAsyncEffect from '../../../../../common/packages/useAsyncEffect/useAsyncEffect';

const edges: Edge[] = ['right', 'bottom', 'left'];

const ReportJobDescription = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [reportCheckbox, setReportCheckbox] = useState<any>([]);
  const [commentData, setCommentData] = useState<any>([]);
  const toaster = useToast();
  const route: any = useRoute();
  const isFocused = useIsFocused();
  const navigation = useNavigation();
  const {userInfo} = useRootStore();
  const {roleID, jd} = route?.params?.jdData || {};
  const {control, handleSubmit, setValue, reset} = useForm();

  useAsyncEffect(
    async isMounted => {
      if (!isMounted()) {
        return null;
      }
      // getting checkbox data
      const reportData = await getReportListAgainstJD(
        userInfo?.intEmployeeId,
        roleID,
        jd?.jdId,
      );

      // checking report has comment or not
      const hasReportId0 = reportData.some((item: any) => item?.reportId === 0);

      if (hasReportId0) {
        setReportCheckbox(
          reportData.filter((item: any) => item.reportId !== 0),
        );
        const commentItem = reportData.find(
          (item: any) => item?.reportId === 0,
        );
        const defaultValues = {
          comment: commentItem?.report,
        };
        reset(defaultValues);
        setCommentData(commentItem);
      } else {
        setReportCheckbox(reportData);
        setCommentData({});
      }
      // console.log('report details', JSON.stringify(reportData, null, 2));
    },
    [isFocused, jd?.jdId],
  );

  const updateCheckbox = (reportId: any) => {
    const updatedReports = [...reportCheckbox];
    const report = updatedReports.find(item => item?.reportId === reportId);
    report.isCheck = !report.isCheck;
    setReportCheckbox(updatedReports);
  };

  const SubmitReport = async (comment: any) => {
    // taking only checked items
    const checkedItems = reportCheckbox.filter((item: any) => item?.isCheck);
    if (checkedItems?.length === 0) {
      toaster.show({
        message: 'Please Select at least one report',
        type: 'warning',
      });
      return;
    }
    const reportData = checkedItems.map((data: any) => ({
      autoId: data?.autoId,
      employeeId: userInfo?.intEmployeeId,
      empRoleId: roleID,
      jdId: jd?.jdId,
      reportId: data?.reportId,
      report: data?.report,
    }));
    const userComment = {
      autoId: commentData?.autoId || 0,
      employeeId: userInfo?.intEmployeeId,
      empRoleId: roleID,
      jdId: jd?.jdId,
      reportId: commentData?.reportId || 0,
      report: comment?.comment,
    };

    const payload = comment?.comment
      ? [...reportData, userComment]
      : [...reportData];
    // console.log(JSON.stringify(payload, null, 2));
    const res = await saveEmployeeReportAgainstJD(payload, setIsLoading);
    if (res?.statusCode === 200) {
      reset();
      navigation.goBack();
      toaster.show({message: res?.message, type: 'success'});
    } else {
      toaster.show({message: 'Try again', type: 'error'});
    }
  };
  return (
    <ContainerNew
      edges={edges}
      isKeyboardAware
      firstBtnTxt="Go Back"
      secondBtnTxt="Submit"
      firstBtnStyle={styles.firstBtnStyle}
      firstBtnTxtStyle={styles.firstBtnTxtStyle}
      isBottomDoubleButton={isLoading ? false : true}
      firstBtmBtnPress={() => navigation.goBack()}
      secondBtmBtnPress={handleSubmit(SubmitReport)}
      header={<CustomHeader title="Report" onBackPress={navigation.goBack} />}
      style={styles.container}>
      <ScrollView
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}>
        <Row direction="column" rowStyle={[styles.row, {marginBottom: 50}]}>
          <Column isCard colWidth="100%" style={{paddingVertical: 10}}>
            <CustomTextNew
              txtSize={20}
              lineHight={24}
              txtWeight={'700'}
              txtColor={COLORS.black}
              text={'Report this job Description'}
            />
            <CustomTextNew
              txtSize={15}
              lineHight={24}
              txtWeight={'400'}
              txtColor={COLORS.graySubText}
              text={
                'Implement continuous integration and continuous delivery (CI/CD) pipelines.'
              }
            />
            {/*==== old code === */}
            {/* <View style={{ marginTop: 15 }}>
              {checkBoxData.length > 0 &&
                checkBoxData.map((item: any) => (
                  <View
                    key={item?.reportId}
                    style={{
                      // backgroundColor: selectedItems.includes(item.id) ? 'lightblue' : 'coral',
                      flexDirection: 'row',
                      marginVertical: 10,
                    }}
                  >
                    <TouchableOpacity onPress={() => toggleItemSelection(item)}>
                      <MIcon
                        //   name={
                        //     !selectedItems.includes(item.id) ? 'check-box-outline-blank' : 'check-box'
                        //   }
                        name={
                          !selectedItems.some(
                            (selectedItem) => selectedItem?.reportId === item?.reportId
                          )
                            ? 'check-box-outline-blank'
                            : 'check-box'
                        }
                        size={20}
                        color={COLORS.darkGray}
                      />
                    </TouchableOpacity>
                    <View style={{ flex: 1, marginLeft: 10 }}>
                      <CustomTextNew
                        txtSize={15}
                        lineHight={22}
                        txtWeight={'400'}
                        txtColor={COLORS.black}
                        text={item?.report}
                      />
                    </View>
                  </View>
                ))}
            </View> */}
            {/*===== old code ======= */}

            <View style={{marginTop: 15}}>
              {reportCheckbox.length > 0 &&
                reportCheckbox.map((item: any) => (
                  <View
                    key={item?.reportId}
                    style={{
                      flexDirection: 'row',
                      marginVertical: 10,
                    }}>
                    <TouchableOpacity
                      onPress={() => updateCheckbox(item?.reportId)}>
                      <MIcon
                        name={
                          item.isCheck ? 'check-box' : 'check-box-outline-blank'
                        }
                        size={20}
                        color={item.isCheck ? COLORS.primary : COLORS.darkGray}
                      />
                    </TouchableOpacity>
                    <View style={{flex: 1, marginLeft: 10}}>
                      <Text>{item?.report}</Text>
                    </View>
                  </View>
                ))}
            </View>

            <Row justify="flex-start" style={{marginVertical: 15}}>
              <Column colWidth="100%" colStyle={styles.colMargin}>
                <CustomInputNew
                  setValue={setValue}
                  control={control}
                  name="comment"
                  label="Add Any Comments"
                  rules={{required: false}}
                />
              </Column>
            </Row>
          </Column>
        </Row>
      </ScrollView>
    </ContainerNew>
  );
};

export default ReportJobDescription;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 0,
  },
  // button style
  firstBtnStyle: {
    backgroundColor: COLORS.white,
    borderColor: COLORS.primary,
    borderWidth: 1,
  },
  firstBtnTxtStyle: {
    color: COLORS.primary,
  },
  row: {
    paddingHorizontal: 16,
  },

  colMargin: {
    marginRight: 16,
    marginBottom: 10,
  },
});
