import {useNavigation} from '@react-navigation/native';
import React, {useState} from 'react';
import {useForm} from 'react-hook-form';
import {
  Keyboard,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View} from 'react-native';
import {Edge} from 'react-native-safe-area-context';
import EIcon from 'react-native-vector-icons/Entypo';
import MIcon from 'react-native-vector-icons/MaterialIcons';
import ContainerNew from '../../../../common/components/Container';
import CustomInputNew from '../../../../common/components/CustomInput';
import CustomHeader from '../../../../common/components/CustomHeader';
import {COLORS} from '../../../../common/constant/Themes';
import {date_formater} from '../../../../common/services/dateFormater';
import {EmployeeContactType} from '../../../../interfaces/contact/contact';
import {getContactLanding} from '../../../../services/SaaS-modules/contact/contact';
import {sendOrApproveDoucument} from '../../../../services/SaaS-modules/document/documentsAPI';
import {useRootStore} from '../../../../stores/rootStore';
import {useToast} from '../../../../common/components/CustomToast';
import useAsyncEffect from '../../../../common/packages/useAsyncEffect/useAsyncEffect';

const edges: Edge[] = ['right', 'bottom', 'left'];

export const initValues = {
  senderNote: '',
};

const SendOrApproval = ({route: {params}}: any) => {
  const navigation = useNavigation();
  const {userInfo} = useRootStore();
  const toaster = useToast();
  const {item, title, popFrom} = params;

  const [noteActive, setNoteActive] = useState(false);

  const [_isLoading, setIsLoading] = useState(false);

  const [employeeName, setEmployeeName] = useState();
  const [contactData, setContactData] = useState<EmployeeContactType[]>();
  const [contactData2, setContactData2] = useState<EmployeeContactType[]>([]);

  const [users, setUsers] = useState<EmployeeContactType[]>([]);

  const createItem = (i: any) => {
    let arr = [...users];
    arr.push(i);
    setUsers(arr);
  };

  const removeItem = (index: number) => {
    let newArr = users?.filter((item, ind) => index !== ind);
    setUsers(newArr);
  };

  useAsyncEffect(
    async isMounted => {
      if (!isMounted()) {
        return;
      }
      const res = await getContactLanding(
        userInfo?.intAccountId,
        userInfo?.intBusinessUnitId,
        setIsLoading,
        '',
        userInfo?.intEmployeeId,
      );

      setContactData(res);
    },
    [userInfo],
  );

  useAsyncEffect(
    async isMounted => {
      if (!isMounted()) {
        return;
      }

      let regex = new RegExp(
        //@ts-ignore
        employeeName?.toLowerCase(),
      );
      if (contactData) {
        let copyEmployeeData = [...contactData];
        let newData = copyEmployeeData?.filter(i =>
          regex?.test(i?.EmployeeName?.toLowerCase()),
        );

        if (employeeName) {
          setContactData2(newData);
        } else {
          setContactData2([]);
        }
      }
    },
    [employeeName],
  );

  const {control, handleSubmit, setValue} = useForm();

  const onSubmit = async (data: any) => {
    let payload = {
      strNote: data?.senderNote || '',
      isForApproval: title === 'Approve Request' ? true : false,
      intDocumentId: item?.intDocumentId,
      intOwnerId: item?.intOwnerId,
      strOwnerName: item?.strOwnerName,
      sendWithList:
        users &&
        users?.map(ite => {
          return {
            intAutoId: 0,
            intSenderId: userInfo?.intEmployeeId,
            strSenderName: userInfo?.strDisplayName,
            intReceiverId: ite?.EmployeeId,
            strReceiverName: ite?.EmployeeName,
          };
        }),
    };

    const res = await sendOrApproveDoucument(payload);
    if (res?.statusCode === 200) {
      toaster.show({message: res?.message, type: 'success'});
      navigation.pop(popFrom);
    }
    if (res?.statusCode === 500) {
      toaster.show({message: res?.message, type: 'error'});
    }
  };

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <ContainerNew
        edges={edges}
        isScrollView={false}
        header={
          <CustomHeader
            onLeftCrossPress={() => navigation.goBack()}
            title={title}
          />
        }
        style={styles.container}>
        <Text style={styles.title}>{item?.strDocumentTitle}</Text>
        <Text style={styles.subTitle}>{item?.strDocCategoryName}</Text>
        <Text style={styles.createDate}>
          Create Date: {date_formater(item?.insertDate || item?.dteSharedDate)}
        </Text>
        <View style={styles.bar} />
        <Text style={styles.shareText}>Send to (select users)</Text>

        <View style={styles.userBox}>
          {/* <ScrollView> */}
          <View style={styles.inputBox}>
            {users &&
              users?.map((singleUser, index) => (
                <View key={index}>
                  <View style={styles.users}>
                    <MIcon
                      name="person"
                      size={18}
                      color={COLORS.transparentDark2}
                    />
                    <Text style={styles.userName}>
                      {
                        //@ts-ignore
                        singleUser?.EmployeeName
                      }
                    </Text>
                    <TouchableOpacity onPress={() => removeItem(index)}>
                      <EIcon
                        name="circle-with-cross"
                        size={16}
                        color={COLORS.transparentDark2}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
          </View>

          <TextInput
            style={{height: 40}}
            value={employeeName}
            onChangeText={e => setEmployeeName(e)}
          />
        </View>
        <View style={{height: employeeName ? 300 : 0, paddingVertical: 10}}>
          <ScrollView>
            {contactData2?.map((item, index) => (
              <View key={index} style={{flexWrap: 'wrap', paddingVertical: 2}}>
                <TouchableOpacity
                  onPress={() => {
                    createItem(item);
                    setEmployeeName('');
                  }}>
                  <Text style={styles.empText}>
                    {item?.EmployeeName?.trim()}
                  </Text>
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
        </View>

        {!employeeName && (
          <>
            {noteActive ? (
              <TouchableOpacity
                onPress={() => setNoteActive(!noteActive)}
                style={{width: 40}}>
                <Text style={[styles.note2]}>Note</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={styles.notePart}
                onPress={() => setNoteActive(!noteActive)}>
                <MIcon name="add-circle" size={22} color={COLORS.primary} />
                <Text style={styles.note}>Add Note</Text>
              </TouchableOpacity>
            )}
          </>
        )}

        {noteActive && (
          <CustomInputNew
            setValue={setValue}
            control={control}
            name="senderNote"
            label="Write Here"
          />
        )}
        {/*
        {noteActive && (
          <FormInput
            multiline
            inputStyle={{ height: 100, borderColor: COLORS.primary }}
            placeholder="Write here"
            name="senderNote"
            formikProps={formikprops}
          />
        )} */}

        <TouchableOpacity
          disabled={users.length > 0 ? false : true}
          onPress={handleSubmit(onSubmit)}
          style={[
            styles.btn,
            {
              backgroundColor:
                users.length > 0 ? COLORS.primary : COLORS.secondary,
            },
          ]}>
          <Text style={styles.btnTxt}>SEND</Text>
        </TouchableOpacity>
      </ContainerNew>
    </TouchableWithoutFeedback>
  );
};

export default SendOrApproval;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    flex: 1,
    backgroundColor: COLORS.white,
    paddingTop: 15,
  },
  title: {
    fontSize: 18,
    fontWeight: '500',
    lineHeight: 16,
    letterSpacing: 0.2,
    color: COLORS.transparentText,
    paddingTop: 10,
  },
  subTitle: {
    fontWeight: '500',
    fontSize: 14,
    lineHeight: 16,
    letterSpacing: 0.2,
    color: COLORS.transparentDark,
    paddingVertical: 5,
  },
  createDate: {
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: 0.25,
    color: COLORS.transparentText,
    paddingBottom: 10,
  },
  bar: {
    borderBottomColor: COLORS.borderBottom,
    borderBottomWidth: 0.7,
  },
  shareText: {
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: 0.25,
    color: COLORS.transparentText,
    paddingTop: 20,
  },
  userBox: {
    borderWidth: 1,
    borderColor: COLORS.borderBottom,
    padding: 6,
    borderRadius: 4,
    marginTop: 8,
  },
  users: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.lightGray3,
    borderRadius: 8,
    paddingHorizontal: 8,
    marginRight: 6,
    height: 30,
    marginVertical: 2,
  },
  userName: {
    paddingHorizontal: 6,
    fontSize: 16,
    lineHeight: 20,
    letterSpacing: 0.25,
  },
  notePart: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    width: 100,
  },
  note: {
    color: COLORS.primary,
    paddingLeft: 6,
  },
  note2: {
    color: COLORS.transparentText,
    marginTop: 15,
    marginBottom: 5,
  },

  btn: {
    alignSelf: Platform.OS === 'ios' ? 'auto' : 'center',
    borderRadius: Platform.OS === 'ios' ? 10 : 100,
    paddingVertical: 10,
    paddingHorizontal: 18,
    marginTop: 24,
  },
  btnTxt: {
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 20,
    color: COLORS.white,
    textAlign: 'center',
  },
  inputBox: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  empText: {
    fontSize: 16,
    color: COLORS.transparentText,
    paddingVertical: 1,
  },
});
