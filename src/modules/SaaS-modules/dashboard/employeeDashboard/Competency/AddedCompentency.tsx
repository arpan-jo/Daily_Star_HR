import {useIsFocused, useNavigation} from '@react-navigation/native';
import React from 'react';
import {StyleSheet} from 'react-native';
import {Edge} from 'react-native-safe-area-context';
import ContainerNew from '../../../../../common/components/Container';
import CustomHeader from '../../../../../common/components/CustomHeader';
import CustomTextNew from '../../../../../common/components/CustomText';
import useAsyncEffect from '../../../../../common/packages/useAsyncEffect/useAsyncEffect';
const edges: Edge[] = ['right', 'bottom', 'left'];

const AddedCompentency = () => {
  const isFocused = useIsFocused();
  const navigation = useNavigation();

  useAsyncEffect(
    async isMounted => {
      if (!isMounted()) {
        return null;
      }
    },
    [isFocused],
  );
  return (
    <ContainerNew
      edges={edges}
      header={
        <CustomHeader
          title="Added Competency"
          onBackPress={navigation.goBack}
        />
      }
      style={styles.container}>
      <CustomTextNew text="Added Competency" />
    </ContainerNew>
  );
};

export default AddedCompentency;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 0,
  },
});
