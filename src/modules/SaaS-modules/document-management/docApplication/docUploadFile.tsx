import React, {useState} from 'react';
import {useForm} from 'react-hook-form';
import {
  ActivityIndicator,
  Image,
  Keyboard,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import {Edge} from 'react-native-safe-area-context';
import {default as MIcon} from 'react-native-vector-icons/MaterialIcons';
import CustomInputNew from '../../../../common/components/CustomInput';
import CustomDropDownNew from '../../../../common/components/CustomDropDown';
import CustomButtonNew from '../../../../common/components/CustomButton';
import ContainerNew from '../../../../common/components/Container';
import CustomHeader from '../../../../common/components/CustomHeader';
import {COLORS, SIZES} from '../../../../common/constant/Themes';
import {getImageURL} from '../../../../common/services/getImage';
import {uploadFileMultipart} from '../../../../common/services/uploadDocument';
import {DocCategoryDDLType} from '../../../../interfaces/document/document';
import {
  getDocCategoryDDL,
  createDoucument,
} from '../../../../services/SaaS-modules/document/documentsAPI';
import {useRootStore} from '../../../../stores/rootStore';
import {useToast} from '../../../../common/components/CustomToast';
import useAsyncEffect from '../../../../common/packages/useAsyncEffect/useAsyncEffect';

const edges: Edge[] = ['right', 'bottom', 'left'];

const DocUploadFile = ({navigation, route}: any) => {
  const {popFrom, title, item} = route?.params;
  const toaster = useToast();
  const {userInfo} = useRootStore();

  const [categroyDDL, setCategoryDDL] = useState<DocCategoryDDLType[]>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isEdit, setIsEDit] = useState<boolean>(false);

  useAsyncEffect(async isMounted => {
    if (!isMounted()) {
      return null;
    }
    const res = await getDocCategoryDDL(userInfo?.intAccountId);
    setCategoryDDL(res);
  }, []);

  const [categoryVal, setCategoryVal] = useState(0);
  const [imageFile, setImageFile] = useState({});
  const {control, handleSubmit, setValue, reset} = useForm();

  const defaultValuesForUpdate = {
    category: {
      value: item?.intDocCategoryId,
      label: item?.strDocCategoryName,
    },
    filename: item?.strFileName,
    inputCategory: item?.strDocumentTitle,
  };
  useAsyncEffect(
    async isMounted => {
      if (!isMounted()) {
        return;
      }
      if (item?.intDocCategoryId) {
        reset(defaultValuesForUpdate);
      }
    },
    [item?.intDocCategoryId, categoryVal === -1],
  );

  const openImage = () => {
    const options = {
      cropping: true,
      // cropperCircleOverlay: true,
      useFrontCamera: true,
      compressImageQuality: 0.6,
      showCropGuidelines: false,
      showCropFrame: false,
    };
    ImagePicker.openPicker({
      ...options,
    })
      .then(async image => {
        const res = {
          assets: [
            {
              // @ts-ignore
              fileName: 'document' + '.jpg',
              fileSize: 1000,
              height: 300,
              type: image?.mime,
              uri: image?.path,
              width: 300,
            },
          ],
        };
        const data = await uploadFileMultipart(
          userInfo?.intAccountId,
          userInfo?.intEmployeeId,
          userInfo?.intBusinessUnitId,
          res?.assets?.[0],
          setIsLoading,
        );

        if (data) {
          setImageFile(data);
        } else {
          setIsLoading(false);
          toaster.show({message: 'Something went wrong.', type: 'error'});
        }
      })
      .catch(() => {
        setIsEDit(false);
        setIsLoading(false);
      });
  };

  const onSubmit = async (data: any) => {
    let payload = {
      intDocumentId: item?.intDocumentId || 0,
      strDocumentTitle: data?.filename,
      intDocCategoryId:
        // data?.inputCategory
        //   ? 0
        //   : //@ts-ignore
        data?.category?.value,
      strDocCategoryName:
        // data?.inputCategory ||
        //@ts-ignore
        data?.category?.label,
      intOwnerId: item?.intOwnerId || userInfo?.intEmployeeId,
      strOwnerName: item?.strOwnerName?.toString() || userInfo?.strDisplayName,
      strFileUrl: isEdit
        ? imageFile?.globalFileUrlId?.toString()
        : item?.strFileUrl || imageFile?.globalFileUrlId?.toString(),
      strFileName: isEdit
        ? imageFile && imageFile?.fileName
        : item?.strFileName || (imageFile && imageFile?.fileName),
      strInsertBy: item?.strInsertBy || userInfo?.intEmployeeId?.toString(),
      strApprovalStatus: item?.strApprovalStatus || '',
      isActive: true,
      IntAccountId: item?.intAccountId || userInfo?.intAccountId,
    };
    const res = await createDoucument(payload);

    if (res?.statusCode === 200) {
      toaster.show({message: res?.message, type: 'success'});
      if (title) {
        navigation.pop(popFrom);
      } else {
        navigation.goBack();
      }
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
            title={title ? title : 'Upload File'}
          />
        }
        style={styles.container}>
        <ScrollView>
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

          {imageFile?.globalFileUrlId || item?.strFileUrl ? (
            <View style={styles.imagePart}>
              <TouchableOpacity
                onPress={() => {
                  setIsEDit(!isEdit);
                  openImage();
                }}
                activeOpacity={0.7}
                style={{paddingHorizontal: 5}}>
                <MIcon
                  name="attachment"
                  size={30}
                  color={COLORS.activeText}
                  style={{
                    alignSelf: 'center',
                    paddingTop: Platform.OS === 'ios' ? 10 : 5,
                  }}
                />
              </TouchableOpacity>

              {isEdit ? (
                <>
                  {imageFile?.globalFileUrlId ? (
                    <Image
                      source={{
                        uri: getImageURL(
                          //@ts-ignore
                          imageFile?.globalFileUrlId,
                        ),
                      }}
                      style={styles.image}
                    />
                  ) : (
                    <ActivityIndicator size={'large'} color={COLORS.primary} />
                  )}
                </>
              ) : (
                <Image
                  source={{
                    uri: getImageURL(
                      item?.strFileUrl ||
                        //@ts-ignore
                        imageFile?.globalFileUrlId,
                    ),
                  }}
                  style={styles.image}
                />
              )}
            </View>
          ) : isLoading ? (
            <ActivityIndicator size={'large'} color={COLORS.primary} />
          ) : (
            <TouchableOpacity
              onPress={() => openImage()}
              style={styles.iconPart}>
              <MIcon name="attachment" size={25} color={COLORS.activeText} />
              <Text style={styles.iconText}>ATTACHED</Text>
            </TouchableOpacity>
          )}

          <CustomButtonNew
            btnText={'SAVE'}
            onBtnPress={handleSubmit(onSubmit)}
            btnstyle={styles.btn}
            btnTextStyle={styles.btnTxt}
          />
        </ScrollView>
      </ContainerNew>
    </TouchableWithoutFeedback>
  );
};

export default DocUploadFile;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 20,
    backgroundColor: COLORS.white,
    flex: 1,
  },
  iconPart: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: 20,
  },
  iconText: {
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 16,
    letterSpacing: 1.25,
    color: COLORS.activeText,
    paddingLeft: 5,
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
  imagePart: {
    alignSelf: 'center',
    paddingTop: 5,
  },
  image: {
    height: 400,
    width: 350,
  },
  undo: {
    position: 'absolute',
    right: 8,
  },
});
