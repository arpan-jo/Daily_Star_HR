import {useIsFocused, useNavigation, useRoute} from '@react-navigation/native';
import {observer} from 'mobx-react-lite';
import React, {useState} from 'react';
import {StyleSheet} from 'react-native';
import {Edge} from 'react-native-safe-area-context';
import ContainerNew from '../../../../common/components/Container';
import CustomHeader from '../../../../common/components/CustomHeader';
import CustomTextNew from '../../../../common/components/CustomText';
import useAsyncEffect from '../../../../common/packages/useAsyncEffect/useAsyncEffect';
import {useRootStore} from '../../../../stores/rootStore';
import {
  GetMillRuleWithHeaderAsync,
  MillRulesApproval,
} from '../../../../common/api/api';
import {useToast} from '../../../../common/components/CustomToast';
import {httpRequest} from '../../../../common/constant/httpRequest';
import Row from '../../../../common/components/Row';
import Column from '../../../../common/components/Column';
import CustomButtonNew from '../../../../common/components/CustomButton';
import CustomModalNew from '../../../../common/components/CustomModal';
import NoDataComponent from '../../../SaaS-modules/dashboard/supervisorDashboard/common/components/NoDataComponent';
const edges: Edge[] = ['right', 'bottom', 'left'];

const MillRuleApproval = () => {
  const isFocused = useIsFocused();
  const navigation = useNavigation();
  const {userInfo} = useRootStore();
  const route = useRoute();
  const milRuleItem: any = route?.params;
  const toaster = useToast();
  const [isModalShow, setIsModalShow] = useState(false);
  const [isModalShowForApprove, setIsModalShowForApprove] = useState(false);
  const [singleItem, setSingleItem] = useState<any>('');
  const [allItem, setAllItem] = useState<any>([]);
  const [inputText, setInputText] = useState('');
  const [inputText2, setInputText2] = useState('');
  // console.log(JSON.stringify(singleItem, null, 2));

  useAsyncEffect(
    async isMounted => {
      if (!isMounted()) {
        return null;
      }
      allDataGet();
    },
    [isFocused],
  );

  const milRule = async (status: string, id: number) => {
    if (id === 2 && (inputText?.length == 0 || inputText2?.length === 0)) {
      toaster.show({
        message: 'Reason and Value are required',
        type: 'warning',
      });
      return;
    }
    const payload = {
      ruleId: singleItem?.ruleId,
      approvalStatus: id,
      approvalStatusName: status,
      approvedBy: userInfo?.intEmployeeId,
      narration: inputText || '',
      changedValue: +inputText2 || singleItem?.targetValue,
    };

    // console.log(JSON.stringify(payload, null, 2));
    const api_params = {
      url: MillRulesApproval,
      data: payload,
      method: 'post',
      //   isConsole: true,
      //   isConsoleParams: true,
      //   isEncrypted: true,
    };
    const res = await httpRequest(api_params, () => {});
    if (
      res?.statusCode === 200 ||
      res?.StatusCode === 200 ||
      res?.statuscode === 200
    ) {
      setIsModalShowForApprove(false);
      setIsModalShow(false);
      toaster.show({
        message:
          res?.message || `${id === 1 ? 'Approve' : 'Reject'} Successfully`,
        type: 'success',
      });
      setInputText('');
      setInputText2('');
      allDataGet();
    } else {
      setIsModalShowForApprove(false);
      setIsModalShow(false);
      toaster.show({
        message: res?.message || 'Something Went Wrong!',
        type: 'warning',
      });
    }
  };

  const allDataGet = async () => {
    const api_params = {
      url: GetMillRuleWithHeaderAsync,
      data: {
        headerId: milRuleItem?.notificationMaster?.intFeatureTableAutoId,
      },
      // isConsole: true,
      // isConsoleParams: true,
    };
    const res = await httpRequest(api_params, () => {});
    setAllItem(res);
  };

  return (
    <ContainerNew
      edges={edges}
      header={
        <CustomHeader title="Mill Rule" onBackPress={navigation.goBack} />
      }
      style={styles.container}>
      {allItem?.row?.map((item: any, index: any) => (
        <Column
          key={index}
          colWidth={'100%'}
          colStyle={{
            marginBottom: 10,
          }}>
          <Row rowWidth="100%">
            <Column
              colWidth={
                item?.approvalStatus
                  ? item?.approvalStatus === 2
                    ? '80%'
                    : '77%'
                  : '58%'
              }>
              <CustomTextNew text={`Problem: ${item?.problemName}`} />
              <CustomTextNew text={`Description: ${item?.actionDescription}`} />
              <CustomTextNew text={`Target: ${item?.targetValue}`} />
              <CustomTextNew text={`Direction: ${item?.direction}`} />
            </Column>

            <Column>
              <Row>
                {!item?.approvalStatus ? (
                  <CustomButtonNew
                    btnstyle={{
                      marginRight: 5,
                    }}
                    disabled={item?.approvalStatus ? true : false}
                    btnText={
                      item?.approvalStatusName
                        ? item?.approvalStatusName
                        : 'Reject'
                    }
                    onBtnPress={() => {
                      setIsModalShow(true);
                      setSingleItem(item);
                    }}
                  />
                ) : null}

                <CustomButtonNew
                  disabled={item?.approvalStatus ? true : false}
                  btnText={
                    item?.approvalStatusName
                      ? item?.approvalStatusName
                      : 'Approve'
                  }
                  onBtnPress={() => {
                    setIsModalShowForApprove(true);
                    setSingleItem(item);
                  }}
                />
              </Row>
            </Column>
          </Row>
        </Column>
      ))}

      {allItem?.row?.length ? null : <NoDataComponent />}

      <CustomModalNew
        setIsModalShow={setIsModalShowForApprove}
        isModalShow={isModalShowForApprove}
        onPressCallApi={() => milRule('Approve', 1)}
        modalText={'Are you want to approve?'}
        deleteText={'Yes'}
        cancelText="No"
      />

      <CustomModalNew
        setModalInputText={setInputText}
        modalInputText={inputText}
        modalInputLabel="Reason"
        setModalInputText2={setInputText2}
        modalInputText2={inputText2}
        modalInputLabel2="Value"
        setIsModalShow={setIsModalShow}
        isModalShow={isModalShow}
        isColor2={inputText2?.length === 0 ? true : false}
        isColor={inputText?.length === 0 ? true : false}
        onPressCallApi={() => milRule('Reject', 2)}
        cancelText="No"
        modalText={`Do you want to change this target value ${singleItem?.targetValue}?`}
        deleteText={'Yes'}
      />
    </ContainerNew>
  );
};

export default observer(MillRuleApproval);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
});
