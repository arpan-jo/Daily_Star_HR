import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity} from 'react-native';
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import {Edge} from 'react-native-safe-area-context';
import {useNavigation, useRoute} from '@react-navigation/native';
import {Modal} from 'react-native';
import {TouchableWithoutFeedback} from 'react-native';
import FastImage from 'react-native-fast-image';
import ContainerNew from '../../../../common/components/Container';
import CustomHeader from '../../../../common/components/CustomHeader';
import {date_formater} from '../../../../common/services/dateFormater';
import {getImageURL} from '../../../../common/services/getImage';
import {COLORS} from '../../../../common/constant/Themes';
import {erpiBOSURL} from '../../../../../App';
import {useRootStore} from '../../../../stores/rootStore';
import {CreateCustomerPreAssessmentApproval} from '../../../../common/api/api';
import {httpRequest} from '../../../../common/constant/httpRequest';
import {useToast} from '../../../../common/components/CustomToast';
import LoadingContainer from '../../../../common/components/Loading';

const edges: Edge[] = ['right', 'bottom', 'left'];

export const CommonInfoCard = ({title, children}: any) => (
  <View style={styles.card}>
    <Text style={styles.cardTitle}>{title}</Text>
    <View style={styles.divider} />
    {children}
  </View>
);

export const InfoRow = ({label, value}: any) => (
  <View style={styles.infoRow}>
    <Text style={styles.label}>{label}</Text>
    <Text style={styles.value}>{value || '-'}</Text>
  </View>
);

export const DocumentItem = ({name, onView}: any) => (
  <View style={styles.docRow}>
    <MCIcon name="file-document" size={22} color="#0077CC" />
    <Text style={styles.docLabel}>{name}</Text>

    <TouchableOpacity style={styles.viewBtn} onPress={onView}>
      <Text style={styles.viewText}>View</Text>
    </TouchableOpacity>
  </View>
);

const CustomerPreAssessmentApprovalDetails = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [isShowModal, setIsShowModal] = useState(false);
  const [attachmentId, setAttachmentId] = useState(null);
  const {userInfo} = useRootStore();
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();
  //@ts-ignore
  const details = route.params?.details;
  //@ts-ignore
  const approvalStatus = route.params?.approvalStatus;

  const approvalAPI = async (isApproved: any) => {
    // https://localhost:44318/partner/CustomerPreAssesment/CreateCustomerPreAssessmentApproval
    const params = {
      url: CreateCustomerPreAssessmentApproval,
      data: {
        intAssessmentId: details?.intAssessmentId,
        intActionBy: userInfo?.intUserId,
        strApprovedBy: 'Supervisor',
        isApproved: isApproved,
      },
      method: 'POST',
      baseURL: erpiBOSURL,
      isConsole: true,
    };
    const res = await httpRequest(params, setIsLoading);

    if (
      res?.statuscode === 200 ||
      res?.statusCode === 200 ||
      res?.StatusCode === 200 ||
      res?.data?.statusCode === 200 ||
      res?.data?.StatusCode === 200
    ) {
      toast.show({
        type: 'success',
        message: isApproved
          ? 'Assessment approved successfully'
          : 'Assessment rejected successfully',
      });
      navigation.goBack();
    } else {
      toast.show({
        type: 'error',
        message:
          res?.data?.message ||
          res?.data?.Message ||
          res?.message ||
          'Action failed. Please try again.',
      });
    }
  };

  return (
    <ContainerNew
      edges={edges}
      isBottomDoubleButton={approvalStatus === 'Pending'}
      firstBtnTxt="Reject"
      secondBtnTxt="Approve"
      firstBtmBtnPress={() => {
        approvalAPI(false);
      }}
      secondBtmBtnPress={() => {
        approvalAPI(true);
      }}
      firstBtnStyle={{
        backgroundColor: COLORS.redish,
      }}
      header={
        <CustomHeader
          title="Customer Pre-Assessment Details"
          onBackPress={navigation.goBack}
        />
      }
      style={styles.container}>
      {isLoading && <LoadingContainer isLoading={isLoading} />}
      <CommonInfoCard title="Customer Information">
        <InfoRow label="Customer Name" value={details?.strCustomerName} />
        <InfoRow label="Mobile Number" value={details?.strMobileNumber} />
        <InfoRow label="Address" value={details?.strCustomerAddress} />
        <InfoRow label="Division" value={details?.divisionName} />
        <InfoRow label="District" value={details?.districtName} />
        <InfoRow label="Thana" value={details?.thanaName} />
        <InfoRow
          label="Assessment Date"
          value={
            details?.dteAssessmentDate
              ? date_formater(details?.dteAssessmentDate)
              : '-'
          }
        />
      </CommonInfoCard>

      {/* BUSINESS DETAILS */}
      <CommonInfoCard title="Business Details">
        <InfoRow label="Business Unit" value={details?.strBusinessUnitName} />
        <InfoRow
          label="Distributor Experience Years"
          value={details?.decDistributorExperienceYears}
        />
        <InfoRow
          label="Distributor Experience Years Score"
          value={details?.numDistributorExperienceYearsScore}
        />
        <InfoRow label="Manpower" value={details?.intManpowerCount} />
        <InfoRow label="Manpower Score" value={details?.numManpowerScore} />

        <InfoRow
          label="Godown Capacity (sqft)"
          value={details?.intGodownCapacitySqFt}
        />
        <InfoRow
          label="Godown Capacity Score"
          value={details?.numGodownCapacityScore}
        />
        <InfoRow
          label="Monthly Collection"
          value={details?.decMonthCollectionAmount}
        />
        <InfoRow
          label="Monthly Collection Score"
          value={details?.numMonthCollectionAmountScore}
        />
        <InfoRow label="Retailers" value={details?.intRetailerCount} />
        <InfoRow label="Retailers Score" value={details?.numRetailerScore} />
        <InfoRow label="Contractors" value={details?.intContractorCount} />
        <InfoRow
          label="Contractors Score"
          value={details?.numContractorScore}
        />
        <InfoRow label="Govt Projects" value={details?.intGovtProjectCount} />
        <InfoRow
          label="Govt Projects Score"
          value={details?.numGovtProjectScore}
        />
        <InfoRow
          label="Total Coverage Percent"
          value={details?.decTotalCoveragePercent + '%'}
        />
        <InfoRow label="Coverage Score" value={details?.numCoverageScore} />
      </CommonInfoCard>

      {/* ASSESSMENT PARAMETERS */}
      <CommonInfoCard title="Assessment Parameters">
        <InfoRow
          label="Bank Solvency Completed"
          value={details?.isBankSolvencyComplete ? 'Yes' : 'No'}
        />
        <InfoRow
          label="Bank Solvency Score"
          value={details?.numBankSolvencyScore}
        />
        <InfoRow
          label="Exclusive Customer"
          value={details?.isExclusiveCustomer ? 'Yes' : 'No'}
        />
        <InfoRow
          label="Exclusive Customer Score"
          value={details?.numExclusiveCustomerScore}
        />

        <InfoRow
          label="Relative in Company"
          value={details?.isRelativeInCompany ? 'Yes' : 'No'}
        />
        <InfoRow label="Relative Score" value={details?.numRelativeScore} />
        <InfoRow
          label="Knowledge of Market"
          value={details?.strKnowledgeOfMarket}
        />
        <InfoRow
          label="Knowledge of Market Score"
          value={details?.numKnowledgeOfMarketScore}
        />
        <InfoRow label="Local Influence" value={details?.strLocalInfluence} />
        <InfoRow
          label="Local Influence Score"
          value={details?.numLocalInfluenceScore}
        />
        <InfoRow
          label="Safety Measures"
          value={details?.isSafetyMeasures ? 'Yes' : 'No'}
        />
        <InfoRow
          label="Safety Measures Score"
          value={details?.numSafetyMeasuresScore}
        />
        <InfoRow
          label="Internet Facility"
          value={details?.isInternetFacility ? 'Yes' : 'No'}
        />

        <InfoRow
          label="Internet Facility Score"
          value={details?.numInternetFacilityScore}
        />
        <InfoRow
          label="Own Transport"
          value={details?.isOwnTransport ? 'Yes' : 'No'}
        />
        <InfoRow
          label="Own Transport Score"
          value={details?.numOwnTransportScore}
        />
        <InfoRow
          label="Grand Total Score"
          value={details?.numGrandTotalScore}
        />
        <InfoRow label="Grade" value={details?.strGrade} />
      </CommonInfoCard>

      {/* RELATIVE DETAILS */}
      {details?.isRelativeInCompany && (
        <CommonInfoCard title="ARL Reference Details">
          <InfoRow label="Employee Name" value={details?.strRelativeName} />
          <InfoRow label="Business Unit" value={details?.strRelativeUnit} />
          <InfoRow
            label="Designation"
            value={details?.strRelativeDesignation}
          />
          <InfoRow label="Employee ID" value={details?.strRelativeEmployeeId} />
        </CommonInfoCard>
      )}

      {/* DOCUMENTS */}
      <CommonInfoCard title="Uploaded Documents">
        <InfoRow label="Documents Score" value={details?.numDocumentScore} />
        {details?.attachmentList?.map((doc: any, index: any) => (
          <DocumentItem
            key={index}
            name={doc?.strDocumentTypeName}
            //   url={doc?.strAttachment}
            onView={() => {
              setAttachmentId(doc?.strAttachment);
              setIsShowModal(true);
            }}
          />
        ))}
      </CommonInfoCard>

      {/* REMARKS */}
      <CommonInfoCard title="Remarks">
        <Text style={styles.remarksText}>
          {details?.strRemarks || 'No remarks added.'}
        </Text>
      </CommonInfoCard>
      {/* </ScrollView> */}

      <Modal
        animationType="fade"
        transparent
        visible={isShowModal}
        onRequestClose={() => {
          setIsShowModal(!isShowModal);
        }}>
        <TouchableWithoutFeedback
          onPress={() => {
            setIsShowModal(!isShowModal);
          }}>
          <View style={styles.imgCon}>
            <FastImage
              style={styles.modalImg}
              source={{
                uri: getImageURL(attachmentId),
              }}
            />
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </ContainerNew>
  );
};

export default CustomerPreAssessmentApprovalDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //  paddingHorizontal: 8,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 14,
    shadowColor: '#0002',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 6,
    color: COLORS.black,
  },
  divider: {
    height: 1,
    backgroundColor: '#ddd',
    marginBottom: 6,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  label: {
    fontSize: 14,
    color: '#444',
  },
  value: {
    fontSize: 14,
    fontWeight: '600',
    maxWidth: '60%',
    textAlign: 'right',
    color: COLORS.textNewColor,
  },
  docRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  docLabel: {
    flex: 1,
    marginLeft: 10,
    fontSize: 14,
    color: COLORS.textNewColor,
  },
  viewBtn: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    backgroundColor: '#0077CC',
    borderRadius: 6,
  },
  viewText: {
    color: '#fff',
    fontSize: 12,
  },
  remarksText: {
    fontSize: 14,
    color: '#444',
    paddingVertical: 4,
  },
  btnRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 20,
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
