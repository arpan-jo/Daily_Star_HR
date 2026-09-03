import {useNavigation} from '@react-navigation/native';
import React, {useState} from 'react';
import {useForm} from 'react-hook-form';
import {ScrollView, StyleSheet} from 'react-native';
import {Edge} from 'react-native-safe-area-context';
import Column from '../../../../../common/components/Column';
import ContainerNew from '../../../../../common/components/Container';
import CustomDropDownNew from '../../../../../common/components/CustomDropDown';
import CustomHeader from '../../../../../common/components/CustomHeader';
import CustomInputNew from '../../../../../common/components/CustomInput';
import CustomTextNew from '../../../../../common/components/CustomText';
import Row from '../../../../../common/components/Row';
import {COLORS} from '../../../../../common/constant/Themes';
import {_todayDate} from '../../../../../common/services/todayDate';
import {cRMLeadAccountSaveForPeopledesk} from '../../../../../services/SaaS-modules/dashboard/internalReferance';
import {useRootStore} from '../../../../../stores/rootStore';
import {useToast} from '../../../../../common/components/CustomToast';

const edges: Edge[] = ['right', 'bottom', 'left'];

const industryData = [
  {
    label: 'Agro based Industry',
    value: 0,
  },
  {
    label: 'Archi./Engg./Construction',
    value: 1,
  },
  {
    label: 'Automobile/Industrial Machine',
    value: 2,
  },
  {
    label: 'Bank/Non-Bank Fin. Institution',
    value: 3,
  },
  {
    label: 'Education',
    value: 4,
  },
  {
    label: 'Electronics/Consumer Durables',
    value: 5,
  },
  {
    label: 'Energy/Power/Fuel',
    value: 6,
  },
  {
    label: 'Garments/Textile',
    value: 7,
  },
  {
    label: 'Govt./Semi-Govt./Autonomous',
    value: 8,
  },
  {
    label: 'Pharmaceuticals',
    value: 9,
  },
  {
    label: 'Hospital/ Diagnostic Center',
    value: 10,
  },
  {
    label: 'Airline/Travel/Tourism',
    value: 11,
  },
  {
    label: 'Manufacturing (Light Industry)',
    value: 12,
  },
  {
    label: 'Manufacturing (Heavy Industry)',
    value: 13,
  },
  {
    label: 'Hotel/Restaurant',
    value: 14,
  },
  {
    label: 'Information Technology (IT)',
    value: 15,
  },
  {
    label: 'Logistics/Transportation',
    value: 16,
  },
  {
    label: 'Entertainment/Recreation',
    value: 17,
  },
  {
    label: 'Media/Advertising/Event Mgt.',
    value: 18,
  },
  {
    label: 'NGO/Development',
    value: 19,
  },
  {
    label: 'Real Estate/Development',
    value: 20,
  },
  {
    label: 'Wholesale/Retail/Export-Import',
    value: 21,
  },
  {
    label: 'Telecommunication',
    value: 22,
  },
  {
    label: 'Food & Beverage Industry',
    value: 23,
  },
  {
    label: 'Security Service',
    value: 24,
  },
  {
    label: 'Fire, Safety & Protection',
    value: 25,
  },
  {
    label: 'E-Commerce/F-Commerce',
    value: 26,
  },
  {
    label: 'Others',
    value: 27,
  },
];

const budgetData = [
  {
    label: 'Below 50,000',
    value: 0,
  },
  {
    label: '50,000 - 2,00,000',
    value: 1,
  },
  {
    label: '2,00,000 - 5,00,000',
    value: 2,
  },
  {
    label: '5,00,000 - 10,00,000',
    value: 3,
  },
  {
    label: '10,00,000 - 20,00,000',
    value: 4,
  },
  {
    label: 'Above 20,00,000+',
    value: 5,
  },
];

type CompanyData = {
  companyName: string;
  noBranch: string;
  address: string;
  describeFunctionalities: string;
  mobileNo: string;
  email: string;
  softwareUsing: string;
  challenges: string;
  contactPersonName: string;
  industry: {
    label: string;
    value: number;
  };
  noOFemployee: String;
  tentiativeBudget: {
    label: string;
    value: number;
  };
};

const MakeCustomerIR = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation();
  const {userInfo} = useRootStore();
  const toster = useToast();
  const {control, handleSubmit, setValue, reset} = useForm();
  // const [postRes, setPostRes] = useState();

  const handleMakeCustomer = async (data: CompanyData) => {
    const payload = {
      sl: 0,
      leadId: 0,
      peopledeskEmpId: userInfo?.intEmployeeId,
      accountId: userInfo?.intAccountId,
      businessUnitId: userInfo?.intBusinessUnitId,
      leadName: data?.companyName || '',
      designation: '',
      phone: data?.mobileNo || '',
      email: data?.email || '',
      crmaccountId: 0,
      crmaccountName: data?.companyName,
      accountOwnerId: 0,
      accountOwnerName: '',
      productId: 0,
      productName: '',
      address: data?.address || '',
      city: '',
      stateOrProvince: '',
      zipOrPostalCode: '',
      countryId: 0,
      countryName: '',
      sourceId: 0,
      sourceName: '',
      remarks: data?.describeFunctionalities,
      leadStageId: 0,
      leadStageName: '',
      isRejected: true,
      rejectedType: '',
      rejectedBy: '',
      rejectedRemarks: '',
      rejectedDateTime: _todayDate(),
      isActive: true,
      isNewLead: true,
      serverDateTime: _todayDate(),
      createdAt: _todayDate(),
      updatedAt: _todayDate(),
      createdBy: 0,
      updatedBy: 0,
      createdByName: '',
      updatedByName: '',
      lastAction: '',
      leadReferenceId: 0,
      leadReferenceName: '',
      isCreateAccount: true,
      industryId: 0,
      industryName: data?.industry?.label,
      qualityId: 0,
      qualityName: '',
      attachment: '',
      intAdvertiseId: 0,
      strAdvertiseNumber: '',
      noOfBranch: +data?.noBranch,
      noOfEmp: +data?.noOFemployee,
      tentativeBudget: data?.tentiativeBudget?.label,
      contactPerson: data?.contactPersonName,
      currentSoftware: data?.softwareUsing || '',
      currentIssues: data?.challenges || '',
      peopledeskEmpName: userInfo?.strDisplayName || '',
    };

    const postRes = await cRMLeadAccountSaveForPeopledesk(
      setIsLoading,
      payload,
    );
    if (
      postRes?.statusCode === 200 ||
      postRes?.statuscode === 200 ||
      postRes?.StatusCode === 200
    ) {
      toster.show({
        message: postRes?.message,
        type: 'success',
      });
      reset();
      navigation.goBack();
    } else {
      toster.show({
        message: postRes?.message,
        type: 'error',
      });
    }
  };
  return (
    <ContainerNew
      edges={edges}
      isKeyboardAware
      firstBtnTxt="Cancel"
      secondBtnTxt="Save"
      firstBtnStyle={styles.firstBtnStyle}
      firstBtnTxtStyle={styles.firstBtnTxtStyle}
      isBottomDoubleButton={isLoading ? false : true}
      firstBtmBtnPress={() => navigation.goBack()}
      secondBtmBtnPress={handleSubmit(handleMakeCustomer)}
      header={
        <CustomHeader
          title="Make a Customer (IR)"
          onBackPress={navigation.goBack}
        />
      }
      style={styles.container}>
      <ScrollView
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}>
        <Row direction="column" rowStyle={[styles.row, {marginBottom: 50}]}>
          <Column isCard colWidth="100%">
            <Row style={{marginBottom: 10}}>
              <CustomTextNew
                text="Company Info:"
                txtSize={18}
                txtWeight={'500'}
                lineHight={25}
                txtColor={COLORS.black}
              />
            </Row>
            <Row justify="flex-start">
              <Column colWidth="100%" colStyle={styles.colMargin}>
                <CustomInputNew
                  setValue={setValue}
                  control={control}
                  name="companyName"
                  label="Company Name"
                  rules={{required: true}}
                />
              </Column>
            </Row>
            <Row justify="flex-start">
              <Column colWidth="100%" colStyle={styles.colMargin}>
                <CustomDropDownNew
                  control={control}
                  data={industryData}
                  name="industry"
                  label="Industry"
                  placholder="Choose"
                  onChange={(options: any) => {
                    setValue('industry', options);
                  }}
                  rules={{required: true}}
                />
              </Column>
            </Row>

            <Row justify="flex-start">
              <Column colWidth="48%" colStyle={styles.colMargin}>
                <CustomInputNew
                  control={control}
                  name="noOFemployee"
                  keyboardType="numeric"
                  label="No. Of Employee"
                  rules={{required: true}}
                  onChange={(e: any) => {
                    //@ts-ignore
                    if (+e < 0) {
                      setValue('noOFemployee', '');
                      return;
                    } else {
                      setValue('noOFemployee', e);
                    }
                  }}
                />
              </Column>
              <Column colWidth="48%" colStyle={styles.colMargin}>
                <CustomInputNew
                  control={control}
                  name="noBranch"
                  keyboardType="numeric"
                  label="No. Branch"
                  onChange={(e: any) => {
                    //@ts-ignore
                    if (+e < 0) {
                      setValue('noBranch', '');
                      return;
                    } else {
                      setValue('noBranch', e);
                    }
                  }}
                  rules={{required: true}}
                />
              </Column>
            </Row>

            <Row justify="flex-start">
              <Column colWidth="100%" colStyle={styles.colMargin}>
                <CustomInputNew
                  setValue={setValue}
                  control={control}
                  name="address"
                  label="Address"
                  rules={{required: true}}
                />
              </Column>
            </Row>
          </Column>

          {/* section 2  */}
          <Column isCard colWidth="100%">
            <Row style={{marginBottom: 10}}>
              <CustomTextNew
                text="Features Needs & Budget:"
                txtSize={18}
                txtWeight={'500'}
                lineHight={25}
                txtColor={COLORS.black}
              />
            </Row>

            <Row justify="flex-start">
              <Column colWidth="100%" colStyle={styles.colMargin}>
                <CustomDropDownNew
                  control={control}
                  data={budgetData}
                  name="tentiativeBudget"
                  label="Tentative Budget"
                  placholder="Choose"
                  onChange={(options: any) => {
                    setValue('tentiativeBudget', options);
                  }}
                  rules={{required: true}}
                />
              </Column>
            </Row>
            <Row justify="flex-start">
              <Column colWidth="100%" colStyle={styles.colMargin}>
                <CustomInputNew
                  setValue={setValue}
                  control={control}
                  name="describeFunctionalities"
                  label="Describe the functionalities & feature needs"
                  rules={{required: true}}
                />
              </Column>
            </Row>
          </Column>

          {/* section 3 */}

          <Column isCard colWidth="100%">
            <Row style={{marginBottom: 10}}>
              <CustomTextNew
                text="Contact Person:"
                txtSize={18}
                txtWeight={'500'}
                lineHight={25}
                txtColor={COLORS.black}
              />
            </Row>

            <Row justify="flex-start">
              <Column colWidth="100%" colStyle={styles.colMargin}>
                <CustomInputNew
                  setValue={setValue}
                  control={control}
                  name="contactPersonName"
                  label="Name"
                  rules={{required: true}}
                />
              </Column>
            </Row>

            <Row justify="flex-start">
              <Column colWidth="100%" colStyle={styles.colMargin}>
                <CustomInputNew
                  setValue={setValue}
                  control={control}
                  name="mobileNo"
                  keyboardType="phone-pad"
                  label="Mobile No."
                  rules={{required: true}}
                />
              </Column>
            </Row>

            <Row justify="flex-start">
              <Column colWidth="100%" colStyle={styles.colMargin}>
                <CustomInputNew
                  keyboardType="email-address"
                  setValue={setValue}
                  control={control}
                  name="email"
                  label="Email"
                />
              </Column>
            </Row>
          </Column>

          {/* section 4  */}
          <Column isCard colWidth="100%">
            <Row style={{marginBottom: 10}}>
              <CustomTextNew
                text="Current Practice:"
                txtSize={18}
                txtWeight={'500'}
                lineHight={25}
                txtColor={COLORS.black}
              />
            </Row>

            <Row justify="flex-start">
              <Column colWidth="100%" colStyle={styles.colMargin}>
                <CustomInputNew
                  setValue={setValue}
                  control={control}
                  name="softwareUsing"
                  label="Which software are you currently using?"
                  rules={{required: true}}
                />
              </Column>
            </Row>

            <Row justify="flex-start">
              <Column colWidth="100%" colStyle={styles.colMargin}>
                <CustomInputNew
                  setValue={setValue}
                  control={control}
                  name="challenges"
                  label="What is the current challenges you are facing?"
                />
              </Column>
            </Row>
          </Column>
        </Row>
      </ScrollView>
    </ContainerNew>
  );
};

export default MakeCustomerIR;

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
