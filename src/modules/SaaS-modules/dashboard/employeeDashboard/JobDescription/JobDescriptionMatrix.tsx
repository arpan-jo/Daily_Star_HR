/* eslint-disable react-native/no-inline-styles */
import {useIsFocused, useNavigation, useRoute} from '@react-navigation/native';
import React, {useState} from 'react';
import {FlatList, StyleSheet, TouchableOpacity, View} from 'react-native';
import {Edge} from 'react-native-safe-area-context';
import MIcon from 'react-native-vector-icons/MaterialIcons';
import ContainerNew from '../../../../../common/components/Container';
import CustomHeader from '../../../../../common/components/CustomHeader';
import CustomTextNew from '../../../../../common/components/CustomText';
import {COLORS} from '../../../../../common/constant/Themes';
import {
  createJobDescReaction,
  employeeJobDescriptionDetails} from '../../../../../services/SaaS-modules/dashboard/employeeDashboard';
import {useRootStore} from '../../../../../stores/rootStore';
import {useToast} from '../../../../../common/components/CustomToast';
import useAsyncEffect from '../../../../../common/packages/useAsyncEffect/useAsyncEffect';

const edges: Edge[] = ['right', 'bottom', 'left'];

const taskPriority = [
  {
    title: 'Do First',
    subtitle: 'First focus on important tasks to be done the same day',
    color: '#ECFDF3',
    id: 1,
  },
  {
    title: 'Schedule',
    subtitle: 'Important but not so urgent staff should be scheduled',
    color: '#F0F9FF',
    id: 2,
  },
  {
    title: 'Delegate',
    subtitle: "What's urgent but less important delegate to others",
    color: '#FEFBE8',
    id: 3,
  },
  {
    title: 'Don’t Do',
    subtitle: "What's neither urgent know important don't do at all",
    color: '#FEF3F2',
    id: 4,
  },
];
const responsibility = [
  {
    title: 'Accountable',
    subtitle:
      'See the task, process step or decision is accomplished, not necessarily do the work or make decision.',
    color: '#F2F4F7',
    id: 1,
  },
  {
    title: 'Responsible',
    subtitle: "Role's required to do work or make the decision.",
    color: '#F2F4F7',
    id: 2,
  },
  {
    title: 'Consult Before',
    subtitle: 'Consulted prior to accomplishing the work or making decision.',
    color: '#F2F4F7',
    id: 3,
  },
  {
    title: 'Inform After',
    subtitle: 'Keep undated after the work is completed or the decision made.',
    color: '#F2F4F7',
    id: 4,
  },
];
const JobDescriptitonMatrix = () => {
  const [selectedTask, setSelectedTask] = useState<any>();
  const [selectedResponsibility, setSelectedResponsibility] = useState<any>();
  const [jobDescription, setJobDesciption] = useState<any>({});
  const [_isLoading, setIsLoading] = useState(false);
  const isFocused = useIsFocused();
  const navigation = useNavigation();
  const {userInfo} = useRootStore();
  const toaster = useToast();
  const route: any = useRoute();
  const {roleID, jd} = route?.params?.jdData || {};

  useAsyncEffect(
    async isMounted => {
      if (!isMounted()) {
        return null;
      }
      const response = await employeeJobDescriptionDetails(
        userInfo?.intEmployeeId,
        roleID,
        jd?.jdId,
      );
      setJobDesciption(response?.jobDescription);
    },
    [isFocused, jd?.jdId],
  );
  const handleSaveData = async () => {
    if (selectedTask || selectedResponsibility) {
      const payload = {
        jid: jobDescription?.jdId,
        reaction: jobDescription?.reaction,
        employeeID: userInfo?.intEmployeeId,
        isBookmark: jobDescription?.isBookmark,
        eisenhowerMatrix:
          selectedTask?.title || jobDescription?.eisenhowerMatrix,
        responsibilityMatrix:
          selectedResponsibility?.title || jobDescription?.responsibilityMatrix,
      };

      const res = await createJobDescReaction(payload, setIsLoading);
      if (res?.statusCode === 200) {
        toaster.show({message: res?.message, type: 'success'});
        navigation.goBack();
      } else {
        toaster.show({message: 'Try again', type: 'error'});
      }
    } else {
      toaster.show({
        message: 'Please Select Eisenhower or Responsibility matrix',
        type: 'warning',
      });
    }
  };
  const handleTask = ({item}: any) => {
    return (
      <View style={styles.cardContainer}>
        <TouchableOpacity
          onPress={() => {
            if (selectedTask && selectedTask.id === item.id) {
              setSelectedTask(null);
            } else {
              setSelectedTask(item);
            }
          }}
          key={item.id}
          style={[
            styles.card,
            {
              backgroundColor: item?.color,
              borderWidth: selectedTask && selectedTask.id === item.id ? 1 : 0,
              borderColor:
                selectedTask && selectedTask.id === item.id
                  ? COLORS.primary
                  : COLORS.white,
            },
          ]}>
          <View style={{}}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <CustomTextNew
                text={item.title}
                txtSize={15}
                lineHight={20}
                txtWeight={'600'}
                txtColor={COLORS.black}
              />

              <MIcon
                name={
                  item?.id === selectedTask?.id
                    ? 'radio-button-on'
                    : 'radio-button-off'
                }
                size={25}
                color={
                  item.id === selectedTask?.id
                    ? COLORS.primary
                    : COLORS.transparentDark
                }
              />
            </View>
            <CustomTextNew
              text={item.subtitle}
              txtSize={13}
              lineHight={20}
              // txtWeight={'600'}
              txtColor={COLORS.darkGray}
            />
          </View>
        </TouchableOpacity>
      </View>
    );
  };
  return (
    <ContainerNew
      edges={edges}
      isScrollView={false}
      isFloatBottomButton={true}
      singleFloatBtmBtnStyle={styles.btmBtnStyle}
      btnText="Save"
      singleFloatBtmBtnPress={() => handleSaveData()}
      header={
        <CustomHeader
          title="Job Description Matrix"
          onBackPress={navigation.goBack}
        />
      }
      style={styles.container}>
      <View style={{paddingHorizontal: 16, marginVertical: 10}}>
        <View style={{marginVertical: 5}}>
          <CustomTextNew
            text={'Priority'}
            txtSize={18}
            lineHight={25}
            txtWeight={'600'}
            txtColor={COLORS.black}
          />
          <CustomTextNew
            text={'You can prioritize with Eisenhower matrix'}
            txtSize={13}
            lineHight={20}
            txtColor={COLORS.graySubText}
          />
        </View>

        <FlatList
          numColumns={2}
          data={taskPriority}
          keyExtractor={(item: any) => item.id}
          renderItem={handleTask}
        />
        <View
          style={{borderBottomWidth: 1, borderBottomColor: COLORS.lightGray3}}
        />
        {/* 
        {taskPriority?.map((item: any, index: number) => (
          <TouchableOpacity
            key={index}
            style={[styles.checkBoxContainer, {backgroundColor: item?.color}]}
            onPress={() => {
              if (selectedTask && selectedTask.id === item.id) {
                setSelectedTask(null);
              } else {
                setSelectedTask(item);
              }
            }}>
            <View
              style={{
                width: '90%',
              }}>
              <CustomTextNew
                text={item.title}
                txtSize={15}
                lineHight={20}
                txtWeight={'600'}
                txtColor={COLORS.black}
              />
              <CustomTextNew
                text={item.subtitle}
                txtSize={13}
                lineHight={20}
                // txtWeight={'600'}
                txtColor={COLORS.darkGray}
              />
            </View>
            <MIcon
              name={
                item?.id === selectedTask?.id
                  ? 'radio-button-on'
                  : 'radio-button-off'
              }
              size={25}
              color={
                item.id === selectedTask?.id
                  ? COLORS.primary
                  : COLORS.transparentDark
              }
            />
          </TouchableOpacity>
        ))} */}
      </View>

      <View style={{paddingHorizontal: 16, marginVertical: 10}}>
        <View style={{marginVertical: 5}}>
          <CustomTextNew
            text={'Responsibility Matrix'}
            txtSize={18}
            lineHight={25}
            txtColor={COLORS.black}
          />
          <CustomTextNew
            text={'Select your responsiblility roles for this job description.'}
            txtSize={13}
            lineHight={20}
            txtColor={COLORS.graySubText}
          />
        </View>
        {responsibility?.map((item: any, index: number) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.checkBoxContainer,
              {
                backgroundColor: item?.color,
                borderWidth:
                  selectedResponsibility &&
                  selectedResponsibility.id === item.id
                    ? 1
                    : 0,
                borderColor:
                  selectedResponsibility &&
                  selectedResponsibility.id === item.id
                    ? COLORS.primary
                    : COLORS.white,
              },
            ]}
            onPress={() => {
              if (
                selectedResponsibility &&
                selectedResponsibility.id === item.id
              ) {
                setSelectedResponsibility(null);
              } else {
                setSelectedResponsibility(item);
              }
            }}>
            <View
              style={{
                width: '90%',
              }}>
              <CustomTextNew
                text={item.title}
                txtSize={15}
                lineHight={20}
                txtWeight={'600'}
                txtColor={COLORS.black}
              />
              <CustomTextNew
                text={item.subtitle}
                txtSize={13}
                lineHight={20}
                txtColor={COLORS.darkGray}
              />
            </View>
            <MIcon
              name={
                item?.id === selectedResponsibility?.id
                  ? 'radio-button-on'
                  : 'radio-button-off'
              }
              size={25}
              color={
                item.id === selectedResponsibility?.id
                  ? COLORS.primary
                  : COLORS.transparentDark
              }
            />
          </TouchableOpacity>
        ))}
      </View>
    </ContainerNew>
  );
};

export default JobDescriptitonMatrix;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // paddingHorizontal: 16,
  },
  btmBtnStyle: {
    width: '92%',
    elevation: 0,
  },
  checkBoxContainer: {
    paddingHorizontal: 16,
    marginVertical: 5,
    paddingVertical: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    // borderRadius: 10,
  },
  cardContainer: {
    flex: 1,
    paddingRight: 10,
    paddingVertical: 10,
  },
  card: {
    backgroundColor: 'lightblue',
    // height: 100,
    justifyContent: 'center',
    padding: 10,
  },
  cardText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
  },
});
