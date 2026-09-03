import {useIsFocused, useNavigation, useRoute} from '@react-navigation/native';
import {observer} from 'mobx-react-lite';
import React, {useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {Edge} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {GetTicketDetails} from '../../../../common/api/api';
import ContainerNew from '../../../../common/components/Container';
import CustomHeader from '../../../../common/components/CustomHeader';
import CustomTextNew from '../../../../common/components/CustomText';
import LoadingContainer from '../../../../common/components/Loading';
import NoData from '../../../../common/components/NoData';
import {httpRequest} from '../../../../common/constant/httpRequest';
import useAsyncEffect from '../../../../common/packages/useAsyncEffect/useAsyncEffect';
import {
  ProcessHistory,
  TicketDetails,
} from '../../../../interfaces/issue/issue';

const edges: Edge[] = ['right', 'bottom', 'left'];

const Stepper = ({steperData}: {steperData: ProcessHistory[]}) => {
  return (
    <View style={styles.verticalStepperContainer}>
      {steperData.map((step, index) => (
        <View key={index?.toString()} style={styles.verticalStepWrapper}>
          <View style={styles.dotAndLineWrapper}>
            <Icon
              name={
                step?.isComplete ? 'check-circle' : 'radio-button-unchecked'
              }
              size={20}
              color={step?.isComplete ? '#4CAF50' : '#BDBDBD'}
            />
            {index !== steperData?.length - 1 && (
              <View style={styles.verticalConnector} />
            )}
          </View>
          <View
            style={[
              styles.titleBox,
              {
                borderColor: step?.isComplete ? '#4CAF50' : '#BDBDBD',
                backgroundColor: step?.isComplete ? '#E8F5E9' : '#fff',
              },
            ]}>
            <CustomTextNew
              text={step?.processName}
              style={[
                styles.verticalLabel,
                {color: step?.isComplete ? '#2E7D32' : '#616161'},
              ]}
            />
            <CustomTextNew
              text={step?.responsiblePersonName || 'N/A'}
              style={[
                {color: step?.isComplete ? '#2E7D32' : '#616161', fontSize: 11},
              ]}
            />
          </View>
        </View>
      ))}
    </View>
  );
};
const IssueDetails = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [detailsData, setDetailsData] = useState<TicketDetails>();
  const isFocused = useIsFocused();
  const navigation = useNavigation();

  const route = useRoute();
  //@ts-ignore
  const ticketId = route?.params?.ticketId;

  useAsyncEffect(
    async isMounted => {
      if (!isMounted()) return null;
      getDetailsData();
    },
    [isFocused, ticketId],
  );
  const getDetailsData = async () => {
    const api_params = {
      url: GetTicketDetails,
      data: {ticketId: ticketId},
    };
    const res = await httpRequest(api_params, setIsLoading);
    setDetailsData(res);
  };

  return (
    <ContainerNew
      edges={edges}
      header={<CustomHeader title="Details" onBackPress={navigation.goBack} />}
      style={styles.container}>
      <LoadingContainer isLoading={isLoading} />
      {detailsData && detailsData?.processHistory?.length > 0 ? (
        <Stepper steperData={detailsData?.processHistory} />
      ) : (
        <NoData />
      )}
    </ContainerNew>
  );
};

export default observer(IssueDetails);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 0,
    paddingTop: 16,
  },
  verticalStepperContainer: {
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  verticalStepWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  dotAndLineWrapper: {
    alignItems: 'center',
    marginRight: 12,
  },
  verticalConnector: {
    width: 2,
    height: 32,
    backgroundColor: '#BDBDBD',
    marginTop: 4,
  },
  titleBox: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    maxWidth: '85%',
  },
  verticalLabel: {
    fontSize: 14,
    lineHeight: 18,
  },
});
