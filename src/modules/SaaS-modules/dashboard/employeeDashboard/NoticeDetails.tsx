// import {useNavigation} from '@react-navigation/native';
// import React from 'react';
// import {
//   StyleSheet,
//   TouchableOpacity,
//   View,
//   Text,
//   ScrollView,
//   Platform,
// } from 'react-native';
// import RenderHtml from 'react-native-render-html';
// import {Edge, SafeAreaView} from 'react-native-safe-area-context';
// import Icon from 'react-native-vector-icons/Entypo';
// import {COLORS, SIZES} from '../../../../common/constant/Themes';
// const edges: Edge[] = ['top', 'right', 'bottom', 'left'];

// const NoticeDetails = ({route}: any) => {
//   const {item} = route.params;
//   const navigation = useNavigation();
//   const source = {
//     html: item?.strDetails,
//   };

//   return (
//     <SafeAreaView edges={edges} style={styles.mainContainer}>
//       <View style={styles.headPart}>
//         <Text style={styles.title}>Notice Details</Text>
//         <TouchableOpacity onPress={() => navigation.goBack()}>
//           <Icon name="cross" size={30} color={COLORS.transparentBlack} />
//         </TouchableOpacity>
//       </View>

//       {item?.strTitle ? (
//         <View
//           style={{
//             height:
//               Platform.OS === 'ios' ? SIZES.height / 1.2 : SIZES.height / 1.1,
//           }}>
//           <Text style={styles.dtlTitle}>{item?.strTitle}</Text>

//           <ScrollView showsVerticalScrollIndicator={false}>
//             <RenderHtml contentWidth={SIZES.width} source={source} />
//           </ScrollView>
//         </View>
//       ) : null}
//     </SafeAreaView>
//   );
// };

// export default NoticeDetails;

// const styles = StyleSheet.create({
//   mainContainer: {
//     marginTop: 20,
//     backgroundColor: COLORS.white,
//     flex: 1,
//     paddingHorizontal: 20,
//   },
//   headPart: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//   },
//   title: {
//     fontSize: 18,
//     fontWeight: '500',
//     lineHeight: 24,
//     letterSpacing: 0.5,
//     color: COLORS.blackish,
//   },
//   dtlTitle: {
//     fontSize: 18,
//     paddingTop: 50,
//     paddingBottom: 10,
//     fontWeight: '700',
//     color: COLORS.transparentText,
//   },
// });
import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  ScrollView,
  Platform} from 'react-native';
import RenderHtml from 'react-native-render-html';
import { Edge, SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Entypo';
import { COLORS, SIZES } from '../../../../common/constant/Themes';
import { Modal } from 'react-native';
import { TouchableWithoutFeedback } from 'react-native';
import FastImage from 'react-native-fast-image';
import { getImageURL } from '../../../../common/services/getImage';


const edges: Edge[] = ['top', 'right', 'bottom', 'left'];

const NoticeDetails = ({ route }: any) => {
  const { item } = route.params;
  const navigation = useNavigation();
  const [modalShow, setModalShow] = useState(false);
  const [downloadAttachment, setDownloadAttachment] = useState('');
  console.log('item is ', JSON.stringify(item, null, 2));

  const source = {
    html: item?.strDetails,
  };
  const isPdf = (link: string) => {
    return link?.toLowerCase()?.endsWith('.pdf') || false;
  };
  const openAttachment = () => {
    if (isPdf(item?.documentName)) {
      navigation.navigate('PDFViewer', {
        fileId: item?.intAttachmentId,
        fileName: item?.documentName,
      });
    } else {
      setDownloadAttachment(item?.intAttachmentId || '');
      setModalShow(true);
    }
  };

  return (
    <SafeAreaView edges={edges} style={styles.mainContainer}>
      {/* Header */}
      <View style={styles.headPart}>
        <Text style={styles.title}>Notice Details</Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="cross" size={30} color={COLORS.transparentBlack} />
        </TouchableOpacity>
      </View>

      {item?.strTitle ? (
        <View
          style={{
            height:
              Platform.OS === 'ios' ? SIZES.height / 1.2 : SIZES.height / 1.1,
          }}
        >
          <Text style={styles.dtlTitle}>{item?.strTitle}</Text>

          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Notice HTML */}
            <RenderHtml contentWidth={SIZES.width} source={source} />

            {/* Attachment Section */}
            {item?.intAttachmentId ? (
              <View style={styles.attachmentContainer}>
                <Text style={styles.attachmentTitle}>Attachment</Text>

                <TouchableOpacity
                  style={styles.attachmentBtn}
                  onPress={openAttachment}
                >
                  <Icon name="attachment" size={22} color={COLORS.white} />

                  <Text style={styles.attachmentText}>
                    {item?.strAttachmentName || 'View Attachment'}
                  </Text>
                </TouchableOpacity>
              </View>
            ) : null}
          </ScrollView>
        </View>
      ) : null}

      <Modal
        animationType="fade"
        transparent
        visible={modalShow}
        onRequestClose={() => {
          setModalShow(!modalShow);
        }}
      >
        <TouchableWithoutFeedback
          onPress={() => {
            setModalShow(!modalShow);
          }}
        >
          <View style={styles.imgCon}>
            <FastImage
              style={styles.modalImg}
              source={{
                uri: getImageURL(downloadAttachment),
              }}
              resizeMode={FastImage.resizeMode.contain}
            />
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </SafeAreaView>
  );
};

export default NoticeDetails;

const styles = StyleSheet.create({
  mainContainer: {
    marginTop: 20,
    backgroundColor: COLORS.white,
    flex: 1,
    paddingHorizontal: 20,
  },
  headPart: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '500',
    lineHeight: 24,
    letterSpacing: 0.5,
    color: COLORS.blackish,
  },
  dtlTitle: {
    fontSize: 18,
    paddingTop: 50,
    paddingBottom: 10,
    fontWeight: '700',
    color: COLORS.transparentText,
  },

  // 📎 Attachment styles
  attachmentContainer: {
    marginTop: 30,
    marginBottom: 40,
  },
  attachmentTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
    color: COLORS.blackish,
  },
  attachmentBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 8,
  },
  attachmentText: {
    color: COLORS.white,
    fontSize: 15,
    marginLeft: 10,
    flexShrink: 1,
  },
  imgCon: {
    paddingHorizontal: 30,
    paddingVertical: 120,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalImg: {
    borderRadius: 8,
    width: '100%',
    height: '100%',
    backgroundColor: COLORS.white,
  },
});
