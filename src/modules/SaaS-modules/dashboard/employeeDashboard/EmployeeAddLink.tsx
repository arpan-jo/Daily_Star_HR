import {useIsFocused, useNavigation} from '@react-navigation/native';
import React, {useState} from 'react';
import {StyleSheet, ActivityIndicator} from 'react-native';
import {Edge} from 'react-native-safe-area-context';
import {useForm} from 'react-hook-form';
import Column from '../../../../common/components/Column';
import ContainerNew from '../../../../common/components/Container';
import CustomDropDownNew from '../../../../common/components/CustomDropDown';
import CustomHeader from '../../../../common/components/CustomHeader';
import CustomInputNew from '../../../../common/components/CustomInput';
import Row from '../../../../common/components/Row';
import {COLORS} from '../../../../common/constant/Themes';
import {
  getSocialMediaDDL,
  createSwitchLink,
} from '../../../../services/SaaS-modules/employee-management/employee-managemnet';
import {useRootStore} from '../../../../stores/rootStore';
import {useToast} from '../../../../common/components/CustomToast';
import useAsyncEffect from '../../../../common/packages/useAsyncEffect/useAsyncEffect';

const edges: Edge[] = ['right', 'bottom', 'left'];

export interface ModifyTitleDDLType {
  intId?: number;
  strSocialMediaName?: string;
  value?: number;
  label?: string;
}

const EmployeeAddLink = () => {
  const isFocused = useIsFocused();
  const navigation = useNavigation();
  const {userInfo} = useRootStore();
  const toaster = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isDisable, setIsDisable] = useState(false);
  const [titleDDL, setTitleDDL] = useState<ModifyTitleDDLType[]>();

  useAsyncEffect(
    async isMounted => {
      if (!isMounted()) {
        return null;
      }
      //api call here
      const res = await getSocialMediaDDL();
      setTitleDDL(res);
    },
    [isFocused],
  );

  const switchLinkHandler = async (data: any) => {
    const payload = {
      partType: 'SwitchBoardCreateAndUpdate',
      employeeId: userInfo?.intEmployeeId,
      insertByEmpId: userInfo?.intEmployeeId,
      name: data?.switchName?.label || '',
      description: data?.switchLInk,
      remarks:
        data?.switchName?.label !== 'SwitchBoard'
          ? 'SocialMedia'
          : 'SwitchBoard',
    };

    const res = await createSwitchLink(payload, setIsLoading);
    if (res?.statusCode === 200) {
      setIsDisable(false);
      reset();
      toaster.show({message: res?.message, type: 'success'});
      navigation.goBack();
    }
    if (res?.statusCode === 500) {
      setIsDisable(false);
      toaster.show({message: res?.message, type: 'error'});
    }
    if (res?.StatusCode === 500) {
      setIsDisable(false);
      toaster.show({message: res?.Message, type: 'error'});
    }
  };

  const {control, handleSubmit, setValue, reset} = useForm();

  return (
    <ContainerNew
      edges={edges}
      isKeyboardAware
      btnText="Save"
      isFloatBottomButton={isDisable ? false : true}
      singleFloatBtmBtnPress={handleSubmit(switchLinkHandler)}
      header={<CustomHeader title="Add Link" onBackPress={navigation.goBack} />}
      style={styles.container}>
      {isLoading ? (
        <ActivityIndicator
          color={COLORS.primary}
          size={'large'}
          style={styles.activityIndi}
        />
      ) : null}

      {/* form */}
      <Row direction="column" rowStyle={styles.row}>
        <Column isCard colWidth="100%">
          <Row justify="flex-start">
            <Column colWidth="100%" colStyle={styles.colMargin}>
              <CustomDropDownNew
                control={control}
                data={titleDDL}
                name="switchName"
                label="Title"
                placholder="Choose"
                onChange={(options: any) => {
                  setValue('switchName', options);
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
                name="switchLInk"
                multiline
                label="Link"
                rules={{required: true}}
              />
            </Column>
          </Row>
        </Column>
      </Row>
    </ContainerNew>
  );
};

export default EmployeeAddLink;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 0,
  },
  row: {
    paddingHorizontal: 16,
  },

  activityIndi: {
    position: 'absolute',
    zIndex: 999999,
    alignContent: 'center',
    alignSelf: 'center',
    backgroundColor: COLORS.white,
    borderWidth: 1.5,
    borderColor: COLORS.white,
    borderRadius: 100,
    padding: 10,
    justifyContent: 'center',
    elevation: 10,
    flex: 1,
  },

  // form
  colMargin: {
    marginRight: 16,
    marginBottom: 10,
  },
});
