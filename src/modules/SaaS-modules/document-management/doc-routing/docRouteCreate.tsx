import React, {useState} from 'react';
import {useForm} from 'react-hook-form';
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Platform} from 'react-native';
import {Edge} from 'react-native-safe-area-context';
import EIcon from 'react-native-vector-icons/Entypo';
import {
  default as Icon,
  default as MIcon} from 'react-native-vector-icons/MaterialIcons';
import CustomInputNew from '../../../../common/components/CustomInput';
import CustomDropDownNew from '../../../../common/components/CustomDropDown';
import CustomButtonNew from '../../../../common/components/CustomButton';
import ContainerNew from '../../../../common/components/Container';
import CustomHeader from '../../../../common/components/CustomHeader';
import {COLORS, SIZES} from '../../../../common/constant/Themes';
import {EmployeeContactType} from '../../../../interfaces/contact/contact';
import {DocCategoryDDLType} from '../../../../interfaces/document/document';
import {getContactLanding} from '../../../../services/SaaS-modules/contact/contact';
import {createDoucumentRouting} from '../../../../services/SaaS-modules/document/docRoutingAPI';
import {getDocCategoryDDL} from '../../../../services/SaaS-modules/document/documentsAPI';
import {useRootStore} from '../../../../stores/rootStore';
import {useToast} from '../../../../common/components/CustomToast';
import useAsyncEffect from '../../../../common/packages/useAsyncEffect/useAsyncEffect';

const edges: Edge[] = ['right', 'bottom', 'left'];

export const initValues = {
  category: '',
  inputCategory: '',
  approverList: '',
  approver: '',
};

const DocRouteCreate = ({navigation, route}: any) => {
  const {title, item, popFrom} = route?.params;

  const {userInfo} = useRootStore();

  const toaster = useToast();

  const [_isLoading, setIsLoading] = useState(false);

  const [employeeName, setEmployeeName] = useState('');
  const [contactData, setContactData] = useState<EmployeeContactType[]>();
  const [contactData2, setContactData2] = useState<EmployeeContactType[]>([]);
  const [categoryVal, setCategoryVal] = useState(0);
  // DDL
  const [categoryDDL, setCategoryDDL] = useState<DocCategoryDDLType[]>();
  // approverList setup
  const [users, setUsers] = useState<EmployeeContactType[]>([]);
  const [approvalDDL, setApprovalDDL] = useState<any[]>([]);

  useAsyncEffect(
    async isMounted => {
      if (!isMounted()) {
        return null;
      }
      const res = await getDocCategoryDDL(userInfo?.intAccountId);
      setCategoryDDL(res);
      if (item?.docRoutingList) {
        const mod = item?.docRoutingList?.map((item, index: any) => {
          return {
            value: index + 1,
            label: index + 1,
          };
        });
        setApprovalDDL(mod);
      }
    },
    [categoryVal === -1],
  );

  //for creating everyone value in categoryDDL
  // const modifyDDL = () => {
  //   let m;
  //   if (approvalDDL.length === 1) {
  //     const mod = approvalDDL?.map((item) => {
  //       return {
  //         value: item?.value,
  //         label: 'Everyone',
  //       };
  //     });
  //     m = mod;
  //   } else {
  //     const temp = [...approvalDDL];
  //     if (temp.length) {
  //       temp[temp.length - 1].label = 'Everyone';
  //     }
  //     m = temp;
  //   }
  //   return m;
  // };

  const createItem = (i: any) => {
    let arr: any = [];
    if (users) {
      arr = [...users];
      arr.push(i);
      setUsers(arr);
      setApprovalDDL([
        ...approvalDDL,
        {
          value: users?.length + 1,
          label: `${users?.length + 1}`,
        },
      ]);
    } else {
      arr = [];
      arr.push(i);
      setUsers(arr);
      setApprovalDDL([
        ...approvalDDL,
        {
          value: 1,
          label: `${1}`,
        },
      ]);
    }
  };
  const removeItem = (index: number) => {
    let newArr = users?.filter((item, ind) => index !== ind);
    setUsers(newArr);
    approvalDDL.pop();
    setValue('approver', '');
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
      //@ts-ignore
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

  useAsyncEffect(
    async isMounted => {
      if (!isMounted()) {
        return;
      }
      const modifyData = item?.docRoutingList?.map((itm: any) => {
        return {
          intRoutingId: itm?.intRoutingId,
          EmployeeId: itm?.intApproverId,
          EmployeeName: itm?.strApproverName,
        };
      });
      setUsers(modifyData);
      const modifyApproverDDL = [];
      for (let i = 0; i < users?.length; i++) {
        modifyApproverDDL.push({
          value: i + 1,
          label: `${i + 1}`,
        });
      }
      setApprovalDDL(modifyApproverDDL);
    },
    [item],
  );

  const {control, handleSubmit, setValue, reset} = useForm({
    defaultValues: {
      approver: {
        value: 0,
        label: '',
      },
    },
  });

  const updateValues = {
    category: {
      value: item?.intDocCategoryId,
      label: item?.strDocCategoryName,
    },
    inputCategory: '',
    approverList: '',
    approver: {
      value: item ? item?.intMinApproverCount : 0,
      label: item ? `${item?.intMinApproverCount} ` : '',
    },
  };

  useAsyncEffect(
    async isMounted => {
      if (!isMounted()) {
        return;
      }
      reset(updateValues);
    },
    [item],
  );

  const onSubmit = async (data: any) => {
    let modifyRowDto = [];
    if (item) {
      modifyRowDto = users?.map((itm: any) => {
        return {
          intRoutingId: itm?.intRoutingId || 0,
          intApproverId: itm?.EmployeeId,
          strApproverName: itm?.EmployeeName,
        };
      });
    } else {
      modifyRowDto = users?.map((itm: any) => {
        return {
          intRoutingId: 0,
          intApproverId: itm?.EmployeeId,
          strApproverName: itm?.EmployeeName,
        };
      });
    }
    const payload = {
      intAccountId: userInfo?.intAccountId,
      intDocCategoryId: data?.inputCategory
        ? 0
        : //@ts-ignore
          data?.category?.value,
      strDocCategoryName:
        data?.inputCategory ||
        //@ts-ignore
        data?.category?.label,
      //@ts-ignore
      intMinApproverCount: data?.approver?.value,
      strInsertBy: userInfo?.intEmployeeId?.toString(),
      docRoutingList: modifyRowDto,
    };

    const res = await createDoucumentRouting(payload);

    if (res?.statusCode === 200) {
      toaster.show({message: res?.message, type: 'success'});
      navigation.pop(popFrom);
    }
    if (res?.statusCode === 500) {
      toaster.show({message: res?.message, type: 'error'});
    }
  };

  return (
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
      {
        //@ts-ignore
        categoryVal === -1 ? (
          <View style={styles.pTop20}>
            <CustomInputNew
              setValue={setValue}
              control={control}
              label="Category"
              name="inputCategory"
              rules={{required: true}}
            />
            <TouchableOpacity
              onPress={() => {
                setValue('category', '');
                setValue('inputCategory', '');
                setCategoryVal(0);
              }}
              style={styles.undo}>
              <Icon name="undo" size={25} color={COLORS.transparentText} />
            </TouchableOpacity>
          </View>
        ) : (
          <View
            style={{
              width: SIZES.width / 1.09,
              height: 56,
            }}>
            <CustomDropDownNew
              control={control}
              data={categoryDDL}
              label="Category"
              name="category"
              placholder="Choose"
              onChange={(options: any) => {
                setValue('category', options);
                setCategoryVal(options?.value);
              }}
              rules={{required: true}}
            />
          </View>
        )
      }

      <Text style={styles.shareText}>Select Approver</Text>
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
                      size={18}
                      color={COLORS.transparentDark2}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
        </View>

        <TextInput
          style={styles.hight40}
          value={employeeName}
          onChangeText={e => setEmployeeName(e)}
        />
      </View>
      <View style={{height: employeeName ? 350 : 0}}>
        <ScrollView>
          {contactData2?.map((item, index) => (
            <View key={index} style={styles.flexWrape}>
              <TouchableOpacity
                onPress={() => {
                  createItem({
                    ...item,
                    intRoutingId: 0,
                  });
                  setEmployeeName('');
                }}>
                <Text style={styles.empText}>{item?.EmployeeName?.trim()}</Text>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      </View>

      {!employeeName && (
        <View
          style={{
            width: SIZES.width / 1.09,
            height: 56,
          }}>
          <CustomDropDownNew
            control={control}
            data={approvalDDL}
            label="Number of approver"
            name="approver"
            placholder="Choose"
            onChange={(options: any) => {
              setValue('approver', options);
            }}
            rules={{required: true}}
          />
        </View>
      )}

      {!employeeName && (
        <CustomButtonNew
          btnText={title === 'Document Route Edit' ? 'UPDATE' : 'SAVE'}
          onBtnPress={handleSubmit(onSubmit)}
          btnstyle={styles.btn}
          btnTextStyle={styles.btnTxt}
        />
      )}
    </ContainerNew>
  );
};

export default DocRouteCreate;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 15,
    flex: 1,
    backgroundColor: COLORS.white,
  },
  shareText: {
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: 0.25,
    color: COLORS.primary,
    paddingTop: Platform.OS === 'ios' ? 22 : 16,
  },
  userBox: {
    borderWidth: 1,
    borderColor: COLORS.borderBottom,
    padding: 6,
    borderRadius: 4,
    marginTop: 8,
    marginBottom: 20,
  },
  users: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.lightGray3,
    borderRadius: 8,
    paddingHorizontal: 8,
    marginRight: 6,
    alignSelf: 'center',
    height: 30,
    marginVertical: 2,
  },
  userName: {
    paddingHorizontal: 6,
    fontSize: 16,
    lineHeight: 20,
    letterSpacing: 0.25,
  },
  btn: {
    alignSelf: Platform.OS === 'ios' ? 'auto' : 'center',
    borderRadius: Platform.OS === 'ios' ? 10 : 100,
    paddingHorizontal: 24,
    paddingVertical: 10,
    marginTop: 35,
  },
  btnTxt: {
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 20,
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
  undo: {
    position: 'absolute',
    right: 8,
  },
  pTop20: {
    paddingTop: 20,
  },
  hight40: {
    height: 40,
  },
  flexWrape: {
    flexWrap: 'wrap',
    paddingVertical: 2,
  },
});
