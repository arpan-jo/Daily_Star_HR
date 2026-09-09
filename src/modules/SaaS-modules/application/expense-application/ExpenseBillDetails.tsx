import {useNavigation, useRoute} from '@react-navigation/native';
import React from 'react';
import {Modal, StyleSheet, TouchableWithoutFeedback, View} from 'react-native';
import FastImage from 'react-native-fast-image';
import {Edge} from 'react-native-safe-area-context';
import Column from '../../../../common/components/Column';
import ContainerNew from '../../../../common/components/Container';
import CustomHeader from '../../../../common/components/CustomHeader';
import CustomTextNew from '../../../../common/components/CustomText';
import Row from '../../../../common/components/Row';
import {COLORS} from '../../../../common/constant/Themes';
import {date_formater} from '../../../../common/services/dateFormater';
import {getEprocurementImageURL} from '../../../../common/services/getImage';
import {rqDetailsStyle} from '../../../arl-core-modules/shared/rqDetailsStyle';

const edges: Edge[] = ['right', 'bottom', 'left'];

const ExpenseBillDetails = () => {
  const params = useRoute();
  //@ts-ignore
  const item = params?.params?.item;
  const navigation = useNavigation();
  const [modalShow, setModalShow] = React.useState(false);
  const [downloadAttachment, setDownloadAttachment] = React.useState('');

  const isPdf = (link: string) => {
    return link?.toLowerCase()?.endsWith('.pdf') || false;
  };

  return (
    <ContainerNew
      edges={edges}
      header={<CustomHeader title="Details" onBackPress={navigation.goBack} />}
      style={styles.container}>
      <Column>
        <Row align="center">
          <Column colWidth="100%" colStyle={styles.topBottomTextContainer}>
            <Column colWidth="100%" colStyle={styles.topBoxItemText}>
              <CustomTextNew text={`${date_formater(item?.expenseDate)}`} />
            </Column>
          </Column>
        </Row>
        <Row align="center">
          <Column colWidth="100%" colStyle={styles.topBottomTextContainer}>
            <Column colWidth="100%" colStyle={styles.topBoxItemText}>
              <CustomTextNew text={`Amount BDT ${item?.amount || 0}`} />
            </Column>
          </Column>
        </Row>
        <Row align="center">
          <Column colWidth="100%" colStyle={styles.topBottomTextContainer}>
            <Column colWidth="100%" colStyle={styles.topBoxItemText}>
              <CustomTextNew
                text={`Cost Center - ${item?.costCenterName || ''}`}
              />
            </Column>
          </Column>
        </Row>
        <Row align="center">
          <Column colWidth="100%" colStyle={styles.topBottomTextContainer}>
            <Column colWidth="100%" colStyle={styles.topBoxItemText}>
              <CustomTextNew
                text={`Cost Element - ${item?.costElementName || ''}`}
              />
            </Column>
          </Column>
        </Row>
        <Row align="center">
          <Column colWidth="100%" colStyle={styles.topBottomTextContainer}>
            <Column colWidth="100%" colStyle={styles.topBoxItemText}>
              <CustomTextNew
                text={`Profit Center - ${item?.profitCenterName || ''}`}
              />
            </Column>
          </Column>
        </Row>
        <Row align="center">
          <Column colWidth="100%" colStyle={styles.topBottomTextContainer}>
            <Column colWidth="100%" colStyle={styles.topBoxItemText}>
              <CustomTextNew text={`Descriptions - ${item?.comments || ''}`} />
            </Column>
          </Column>
        </Row>
        {item?.attachmentLink && (
          <>
            {isPdf(item?.attachmentLink) ? (
              <Row align="center">
                <Column
                  colWidth="100%"
                  colStyle={styles.topBottomTextContainer}>
                  <Column
                    colWidth="100%"
                    colStyle={styles.topBoxItemText}
                    isPressOn={false}
                    onCardPress={() => {
                      navigation.navigate('PDFViewer', {
                        fileId: item?.attachmentLink,
                        fileName: 'Attachment',
                        isExpenseApproval: true,
                      });
                    }}>
                    <CustomTextNew
                      text={'Attachement.pdf'}
                      txtColor={COLORS.blue}
                    />
                  </Column>
                </Column>
              </Row>
            ) : (
              <Row align="center">
                <Column
                  colWidth="100%"
                  colStyle={styles.topBottomTextContainer}>
                  <Column
                    colWidth="100%"
                    colStyle={styles.topBoxItemText}
                    isPressOn={false}
                    onCardPress={() => {
                      setModalShow(true);
                      setDownloadAttachment(item?.attachmentLink);
                    }}>
                    <CustomTextNew
                      text={'Attachement'}
                      txtColor={COLORS.blue}
                    />
                  </Column>
                </Column>
              </Row>
            )}
          </>
        )}
      </Column>
      {/* <Modal
        animationType="fade"
        transparent
        visible={modalShow}
        onRequestClose={() => {
          setModalShow(!modalShow);
        }}>
        <TouchableWithoutFeedback
          onPress={() => {
            setModalShow(!modalShow);
          }}>
          <View style={styles.imgCon}>
            <FastImage
              style={styles.modalImg}
              source={{
                uri: getEprocurementImageURL(downloadAttachment),
              }}
            />
          </View>
        </TouchableWithoutFeedback>
      </Modal> */}
      <Modal
        animationType="fade"
        transparent
        visible={modalShow}
        onRequestClose={() => setModalShow(false)}>
        <View style={styles.imgCon}>
          {/* Background tap to close */}
          <TouchableWithoutFeedback onPress={() => setModalShow(false)}>
            <View style={StyleSheet.absoluteFill} />
          </TouchableWithoutFeedback>

          {/* Image Container */}
          <View style={styles.imageWrapper}>
            <FastImage
              style={styles.modalImg}
              source={{
                uri: getEprocurementImageURL(downloadAttachment),
              }}
              resizeMode={FastImage.resizeMode.contain}
            />
          </View>
        </View>
      </Modal>
    </ContainerNew>
  );
};

export default ExpenseBillDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 0,
    backgroundColor: COLORS.newGray,
    paddingTop: 20,
  },
  ...rqDetailsStyle,
  col: {
    backgroundColor: COLORS.lightPrimary2,
    padding: 10,
    marginBottom: 10,
  },
  // imgCon: {
  //   paddingHorizontal: 15,
  //   paddingVertical: 120,
  //   backgroundColor: 'rgba(0,0,0,0.5)',
  // },
  // modalImg: {
  //   borderRadius: 8,
  //   width: '100%',
  //   height: '100%',
  //   backgroundColor: COLORS.white,
  //   resizeMode: 'contain',
  // },
  imgCon: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },

  imageWrapper: {
    width: '100%',
    height: '80%',
    backgroundColor: COLORS.white,
    borderRadius: 12,
    overflow: 'hidden', // 🔥 mandatory for rounded corners
  },

  modalImg: {
    width: '100%',
    height: '100%',
  },
});
