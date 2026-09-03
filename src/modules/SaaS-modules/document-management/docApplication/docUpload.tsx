import React, {useState} from 'react';
import {useForm} from 'react-hook-form';
import {
  Image,
  Keyboard,
  Platform,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {Edge} from 'react-native-safe-area-context';
import MIcon from 'react-native-vector-icons/MaterialIcons';
import CustomInputNew from '../../../../common/components/CustomInput';
import CustomDropDownNew from '../../../../common/components/CustomDropDown';
import CustomButtonNew from '../../../../common/components/CustomButton';
import ContainerNew from '../../../../common/components/Container';
import CustomHeader from '../../../../common/components/CustomHeader';
import {COLORS, SIZES} from '../../../../common/constant/Themes';
import {getImageURL} from '../../../../common/services/getImage';
import {DocCategoryDDLType} from '../../../../interfaces/document/document';
import {
  getDocCategoryDDL,
  createDoucument,
} from '../../../../services/SaaS-modules/document/documentsAPI';
import {useRootStore} from '../../../../stores/rootStore';
import {useToast} from '../../../../common/components/CustomToast';
import useAsyncEffect from '../../../../common/packages/useAsyncEffect/useAsyncEffect';
const edges: Edge[] = ['right', 'bottom', 'left'];

export const initValues = {
  filename: '',
  category: '',
  inputCategory: '',
};

const DocUpload = ({navigation, route}: any) => {
  const image = route?.params?.image;

  const {userInfo} = useRootStore();
  const toaster = useToast();

  const [categroyDDL, setCategoryDDL] = useState<DocCategoryDDLType[]>([]);
  const [categoryVal, setCategoryVal] = useState(0);

  useAsyncEffect(
    async isMounted => {
      if (!isMounted()) {
        return null;
      }
      const res = await getDocCategoryDDL(userInfo?.intAccountId);
      setCategoryDDL(res);
    },
    [userInfo, categoryVal === -1],
  );

  const {control, handleSubmit, setValue} = useForm();

  const onSubmit = async (data: any) => {
    let payload = {
      intDocumentId: 0,
      strDocumentTitle: data?.filename,
      intDocCategoryId: data?.inputCategory
        ? 0
        : //@ts-ignore
          data?.category?.value,
      strDocCategoryName:
        data?.inputCategory ||
        //@ts-ignore
        data?.category?.label,
      intOwnerId: userInfo?.intEmployeeId,
      strOwnerName: userInfo?.strDisplayName,
      strFileUrl: image?.globalFileUrlId?.toString(),
      strFileName: image?.fileName,
      strApprovalStatus: '',
      isActive: true,
      IntAccountId: userInfo?.intAccountId,
      strInsertBy: userInfo?.intEmployeeId?.toString(),
    };
    const res = await createDoucument(payload);
    if (res?.statusCode === 200) {
      toaster.show({message: res?.message, type: 'success'});
      navigation.goBack();
    }
    if (res?.StatusCode === 500) {
      toaster.show({message: res?.Message, type: 'error'});
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
            title="Upload File"
          />
        }
        style={styles.container}>
        <CustomInputNew
          setValue={setValue}
          control={control}
          label="File Name"
          name="filename"
          rules={{required: true}}
        />

        {
          //@ts-ignore
          categoryVal === -1 ? (
            <View style={{paddingTop: 20}}>
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
                <MIcon name="undo" size={25} color={COLORS.transparentText} />
              </TouchableOpacity>
            </View>
          ) : (
            <View
              style={{
                width: SIZES.width / 1.09,
                height: 56,
                marginTop: 10,
              }}>
              <CustomDropDownNew
                control={control}
                data={categroyDDL}
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
        <View style={styles.imagePart}>
          <Image
            source={{
              uri: getImageURL(image && image?.globalFileUrlId),
            }}
            style={styles.image}
          />
        </View>

        <CustomButtonNew
          btnText={'SAVE'}
          onBtnPress={handleSubmit(onSubmit)}
          btnstyle={styles.btn}
          btnTextStyle={styles.btnTxt}
        />
      </ContainerNew>
    </TouchableWithoutFeedback>
  );
};

export default DocUpload;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 20,
    backgroundColor: COLORS.white,
    flex: 1,
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
  },
  imagePart: {alignSelf: 'center', paddingTop: 20},
  image: {height: 400, width: 350},
  undo: {
    position: 'absolute',
    right: 8,
  },
});
