import {useIsFocused, useNavigation} from '@react-navigation/native';
import React, {useState} from 'react';
import {useForm} from 'react-hook-form';
import {ScrollView, StyleSheet} from 'react-native';
import {Edge} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import MIcon from 'react-native-vector-icons/MaterialIcons';
import Column from '../../../../../common/components/Column';
import ContainerNew from '../../../../../common/components/Container';
import CustomDropDownNew from '../../../../../common/components/CustomDropDown';
import CustomHeader from '../../../../../common/components/CustomHeader';
import CustomInputNew from '../../../../../common/components/CustomInput';
import CustomTextNew from '../../../../../common/components/CustomText';
import {useToast} from '../../../../../common/components/CustomToast';
import Row from '../../../../../common/components/Row';
import {COLORS} from '../../../../../common/constant/Themes';

const edges: Edge[] = ['right', 'bottom', 'left'];

const CompetencyCreate = () => {
  const _isFocused = useIsFocused();
  const navigation = useNavigation();
  const [behaviourList, setBehaviourList] = useState<any>([]);
  const toaster = useToast();
  const {control, setValue, getValues} = useForm({
    defaultValues: {
      competencyType: {value: 1, label: 'Funcational'},
      competencyTitle: '',
      addBehavior: '',
    },
  });

  const addBehaviour = () => {
    if (!getValues('addBehavior')) {
      return toaster.show({
        message: 'Please Provide Behaviour',
        type: 'warning',
      });
    }
    const data = [];
    data.push({
      behaviour: getValues('addBehavior'),
    });
    setBehaviourList([...behaviourList, ...data]);
    setValue('addBehavior', '');
  };

  return (
    <ContainerNew
      edges={edges}
      header={
        <CustomHeader title="New Competency" onBackPress={navigation.goBack} />
      }
      style={styles.container}>
      <ScrollView
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}>
        <Row direction="column" rowStyle={[styles.row]}>
          <Column colWidth="100%" isCard>
            <Row justify="flex-start">
              <CustomDropDownNew
                control={control}
                data={[
                  {value: 1, label: 'Funcational'},
                  {value: 2, label: 'Managerial'},
                ]}
                name="competencyType"
                label="Competency Type"
                placholder="Choose"
                onChange={(options: any) => {
                  //@ts-ignore
                  setValue('competencyType', options);
                }}
                rules={{required: true}}
              />
            </Row>
            <Row rowStyle={styles.marTop}>
              <CustomInputNew
                setValue={setValue}
                control={control}
                name="competencyTitle"
                label="Competency Title"
                rules={{required: true}}
                onChange={(value: string) => {
                  //@ts-ignore
                  setValue('competencyTitle', value);
                }}
                multiline
              />
            </Row>
          </Column>
        </Row>

        <Row direction="column" rowStyle={[styles.row]}>
          <Column colWidth="100%" isCard>
            <CustomTextNew
              txtColor="#101828"
              txtSize={16}
              txtWeight={'400'}
              text="Add Behaviors"
            />

            {behaviourList?.length > 0
              ? behaviourList.map((item: any, index: number) => (
                  <Row key={index} rowStyle={styles.listRow}>
                    <Column colWidth="10%" colStyle={styles.iconLeftText}>
                      <MIcon
                        name="drag-indicator"
                        size={20}
                        color={'#667085'}
                      />
                    </Column>
                    <Column colWidth="90%">
                      <Row isPressOn={false}>
                        <CustomTextNew
                          text={item.behaviour || ''}
                          txtColor="#344054"
                          txtSize={14}
                          txtWeight={'400'}
                          lineHight={20}
                        />
                      </Row>
                    </Column>
                  </Row>
                ))
              : null}

            <Row>
              <Column colWidth="10%" colStyle={styles.iconLeft}>
                <MIcon name="drag-indicator" size={20} color={'#667085'} />
              </Column>
              <Column colWidth="90%">
                <Row>
                  <CustomInputNew
                    setValue={setValue}
                    control={control}
                    name="addBehavior"
                    rules={{required: true}}
                    onChange={(value: string) => {
                      //@ts-ignore
                      setValue('addBehavior', value);
                    }}
                    multiline
                  />
                </Row>
                <Column
                  isPressOn={false}
                  onCardPress={() => {
                    addBehaviour();
                  }}
                  style={styles.addBtnStyle}>
                  <Icon name="plus" size={20} color={COLORS.primary} />
                  <CustomTextNew
                    txtStyle={styles.addBtnTxt}
                    text={'Add More'}
                  />
                </Column>
              </Column>
            </Row>
          </Column>
        </Row>
      </ScrollView>
    </ContainerNew>
  );
};

export default CompetencyCreate;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 0,
  },
  row: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  marTop: {
    marginTop: 8,
  },
  addBtnStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.white,
    alignSelf: 'flex-start',
    paddingVertical: 4,
    marginTop: 8,
    // paddingHorizontal: 16,
  },
  addBtnTxt: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '500',
    color: COLORS.primary,
    marginLeft: 8,
  },
  iconLeftText: {
    marginTop: 2,
  },
  listRow: {
    marginTop: 8,
  },
  iconLeft: {
    marginTop: 24,
  },
});
