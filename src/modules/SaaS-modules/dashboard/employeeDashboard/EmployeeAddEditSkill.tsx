import {useIsFocused, useNavigation} from '@react-navigation/native';
import React, {useState} from 'react';
import {useForm} from 'react-hook-form';
import {ScrollView, StyleSheet, TouchableOpacity, View} from 'react-native';
import {Text} from 'react-native-paper';
import {Edge} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Column from '../../../../common/components/Column';
import ContainerNew from '../../../../common/components/Container';
import CustomDropDownNew from '../../../../common/components/CustomDropDown';
import CustomHeader from '../../../../common/components/CustomHeader';
import CustomInputNew from '../../../../common/components/CustomInput';
import Row from '../../../../common/components/Row';
import {COLORS} from '../../../../common/constant/Themes';
import {
  getEmployeeSkillCategoryDDL,
  createEmployeeSkill,
} from '../../../../services/SaaS-modules/dashboard/employeeDashboard';
import {useRootStore} from '../../../../stores/rootStore';
import {useToast} from '../../../../common/components/CustomToast';
import useAsyncEffect from '../../../../common/packages/useAsyncEffect/useAsyncEffect';

const edges: Edge[] = ['right', 'bottom', 'left'];

const EmployeeAddEditSkill = () => {
  const isFocused = useIsFocused();
  const navigation = useNavigation();
  const {userInfo} = useRootStore();
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);
  const [skillDDL, setSkillDDL] = useState<any>([]);
  const toaster = useToast();
  const {control, handleSubmit, setValue, reset} = useForm();
  const [isLoad, setIsLoad] = useState(false);
  useAsyncEffect(
    async isMounted => {
      if (!isMounted()) {
        return null;
      }
      setIsLoad(false);
      const skillData = await getEmployeeSkillCategoryDDL(
        userInfo?.intAccountId,
      );
      if (skillData?.length) {
        setSkillDDL(skillData);
      }
    },
    [isFocused, isLoad],
  );

  const handleCheckboxToggle = (level: string) => {
    if (selectedLevel === level) {
      setSelectedLevel(null);
    } else {
      setSelectedLevel(level);
    }
  };
  const submitSkills = async (data: any) => {
    createFunc(data, '');
  };
  const addSkillNew = async (data: any) => {
    createFunc(data, 'new');
  };

  const createFunc = async (data: any, status: string) => {
    if (selectedLevel === null) {
      toaster.show({
        message: 'Please Select Proficiency Levels',
        type: 'warning',
      });
      return;
    }
    const payload = {
      skillid: 0,
      strSkillName: data?.skillName,
      skillCategoryID: data?.skillCategory?.value,
      description: data?.description,
      employeeID: userInfo?.intEmployeeId,
      proficiencyLevel: selectedLevel,
      isActive: true,
    };

    const res = await createEmployeeSkill(payload);
    setIsLoad(true);
    if (res?.statusCode === 200) {
      toaster.show({
        message: 'Successfully Added',
        type: 'success',
      });
      reset();
      if (!status) {
        navigation.goBack();
      }
    } else {
      toaster.show({
        message: 'Something went wrong!',
        type: 'error',
      });
    }
  };
  return (
    <ContainerNew
      edges={edges}
      isKeyboardAware
      firstBtnTxt="Add & New"
      secondBtnTxt="Add"
      firstBtnStyle={styles.firstBtnStyle}
      firstBtnTxtStyle={styles.firstBtnTxtStyle}
      isBottomDoubleButton
      firstBtmBtnPress={handleSubmit(addSkillNew)}
      secondBtmBtnPress={handleSubmit(submitSkills)}
      header={
        <CustomHeader title="Add/Edit Skills" onBackPress={navigation.goBack} />
      }
      style={styles.container}>
      <ScrollView
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}>
        <Row direction="column" rowStyle={[styles.row, {marginBottom: 50}]}>
          <Column colWidth="100%" style={{padding: 10}}>
            <Row justify="flex-start">
              <Column colWidth="100%" colStyle={styles.colMargin}>
                <CustomInputNew
                  setValue={setValue}
                  control={control}
                  name="skillName"
                  label="Name"
                  rules={{required: true}}
                />
              </Column>
            </Row>
            <Row justify="flex-start">
              <Column colWidth="100%" colStyle={styles.colMargin}>
                <CustomDropDownNew
                  control={control}
                  data={skillDDL}
                  name="skillCategory"
                  label="Skill Category"
                  placholder="Choose"
                  onChange={(options: any) => {
                    setValue('skillCategory', options);
                  }}
                  rules={{required: true}}
                />
              </Column>
            </Row>

            <Row justify="flex-start">
              <Column colWidth="100%" colStyle={styles.colMargin}>
                <CustomInputNew
                  multiline
                  setValue={setValue}
                  control={control}
                  name="description"
                  label="Description"
                  rules={{required: true}}
                  onChange={(value: string) => {
                    setValue('description', value);
                  }}
                />
              </Column>
            </Row>

            <View>
              <Text
                style={{
                  fontSize: 14,
                  lineHeight: 20,
                  color: COLORS.primary,
                  marginVertical: 10,
                }}>
                Skill Proficiency Levels
              </Text>
              <TouchableOpacity
                onPress={() => handleCheckboxToggle('Beginner')}
                style={{flexDirection: 'row', marginVertical: 5}}>
                <Icon
                  name={
                    selectedLevel === 'Beginner'
                      ? 'checkbox-marked-circle'
                      : 'checkbox-blank-circle-outline'
                  }
                  size={20}
                  color={
                    selectedLevel === 'Beginner' ? 'green' : COLORS.darkGray
                  }
                />
                <Text style={styles.labelTitle}>Beginner</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => handleCheckboxToggle('Intermediate')}
                style={{flexDirection: 'row', marginVertical: 5}}>
                <Icon
                  name={
                    selectedLevel === 'Intermediate'
                      ? 'checkbox-marked-circle'
                      : 'checkbox-blank-circle-outline'
                  }
                  size={20}
                  color={
                    selectedLevel === 'Intermediate' ? 'green' : COLORS.darkGray
                  }
                />
                <Text style={styles.labelTitle}>Intermediate</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => handleCheckboxToggle('Expert')}
                style={{flexDirection: 'row', marginVertical: 5}}>
                <Icon
                  name={
                    selectedLevel === 'Expert'
                      ? 'checkbox-marked-circle'
                      : 'checkbox-blank-circle-outline'
                  }
                  size={20}
                  color={selectedLevel === 'Expert' ? 'green' : COLORS.darkGray}
                />
                <Text style={styles.labelTitle}>Expert</Text>
              </TouchableOpacity>
            </View>
          </Column>
        </Row>
      </ScrollView>
    </ContainerNew>
  );
};

export default EmployeeAddEditSkill;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 0,
  },
  row: {
    paddingHorizontal: 16,
  },
  colMargin: {
    marginRight: 16,
    marginBottom: 10,
  },
  labelTitle: {marginLeft: 5, color: COLORS.black},
  // button style
  firstBtnStyle: {
    backgroundColor: COLORS.white,
    borderColor: COLORS.primary,
    borderWidth: 1,
  },
  firstBtnTxtStyle: {
    color: COLORS.primary,
  },
});
