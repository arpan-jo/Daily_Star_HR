import {useIsFocused} from '@react-navigation/native';
import React, {useState} from 'react';
import {StyleSheet, Text, TextInput, View} from 'react-native';
import FastImage from 'react-native-fast-image';
import {IMAGES} from '../../../../common/constant/Index';
import {SIZES, COLORS} from '../../../../common/constant/Themes';
import {SalaryRangeDataType} from '../../../../interfaces/dashboard/managementDashboard';
import {
  getSalaryRange,
  getSalaryRangeByEmpId,
} from '../../../../services/SaaS-modules/dashboard/managementDashboard';
import {useRootStore} from '../../../../stores/rootStore';
import MultiSlider from '../../../../common/packages/MultiSlider/MultiSlider';
import useAsyncEffect from '../../../../common/packages/useAsyncEffect/useAsyncEffect';

const RangeSlider = () => {
  const isFocused = useIsFocused();
  const [value, setValue] = useState();
  const {userInfo} = useRootStore();
  const [salaryRangeData, setSalaryRangeData] = useState<SalaryRangeDataType>();
  const [data, setData] = useState();
  const [text, setText] = useState();
  const [text2, setText2] = useState();

  useAsyncEffect(
    async isMounted => {
      if (!isMounted()) {
        return null;
      }
      const res = await getSalaryRange(userInfo?.intAccountId);
      setSalaryRangeData(res);
      if (res) {
        setInputText(res?.fixedMinimumSalary, res?.fixedMaximumSalary);
      }
    },
    [isFocused],
  );

  useAsyncEffect(
    async isMounted => {
      if (!isMounted()) {
        return null;
      }
      const res = await getSalaryRangeByEmpId(
        userInfo?.intAccountId,
        value?.[0],
        value?.[1],
      );
      setSalaryRangeData(res);
      if (res) {
        setInputText(value?.[0], value?.[1]);
      }
    },
    [value?.[0], value?.[1]],
  );

  const setInputText = (min, max) => {
    const modData = [min, max];
    setData(modData);
    setText(min);
    setText2(max);
  };

  const handleOnChangeText = async e => {
    if (Number(e) < salaryRangeData?.fixedMaximumSalary) {
      setText(e);
      const res = await getSalaryRangeByEmpId(
        userInfo?.intAccountId,
        e || salaryRangeData?.fixedMinimumSalary,
        salaryRangeData?.fixedMaximumSalary,
      );
      setSalaryRangeData(res);
      if (res?.fixedMinimumSalary) {
        const modData = [Number(e), salaryRangeData?.fixedMaximumSalary];
        setData(modData);
      }
    } else {
      const res = await getSalaryRangeByEmpId(userInfo?.intAccountId, 0, 0);
      setSalaryRangeData(res);
    }
  };

  return (
    <>
      <View style={styles.main}>
        <View style={styles.head}>
          <FastImage source={IMAGES.SliderImage} style={styles.image} />
          <Text style={styles.totalEmp}>
            {salaryRangeData?.numberOfEmployee}
          </Text>
        </View>
        <MultiSlider
          min={salaryRangeData?.fixedMinimumSalary}
          max={salaryRangeData?.fixedMaximumSalary}
          unselectedStyle={styles.unselectedStyle}
          selectedStyle={styles.selectedStyle}
          sliderLength={SIZES.width / 1.19}
          //@ts-ignore
          values={data}
          step={1}
          minMarkerOverlapDistance={10}
          isMarkersSeparated={true}
          customMarkerLeft={() => <View style={styles.markerStyle} />}
          customMarkerRight={() => <View style={styles.markerStyle} />}
          onValuesChange={e => setValue(e)}
        />
      </View>
      <View style={styles.textPart}>
        <TextInput
          value={text?.toString()}
          style={styles.textInputStyle}
          onChangeText={e => handleOnChangeText(e)}
          keyboardType={'number-pad'}
        />
        <Text>To</Text>
        <TextInput
          value={text2?.toString()}
          style={styles.textInputStyle}
          onChangeText={e => handleOnChangeText(e)}
          keyboardType={'number-pad'}
        />
      </View>
    </>
  );
};

export default RangeSlider;

const styles = StyleSheet.create({
  main: {paddingHorizontal: 16},
  markerStyle: {
    height: 20,
    width: 20,
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: '#0BA5EC',
    borderRadius: 99,
    marginTop: 4,
  },
  selectedStyle: {backgroundColor: '#0BA5EC', height: 4},
  unselectedStyle: {height: 4, backgroundColor: '#DFE1E6'},
  image: {width: 32, height: 32, paddingRight: 8},
  totalEmp: {
    fontSize: 24,
    fontWeight: '600',
    color: COLORS.textNewColor,
    paddingLeft: 8,
  },
  head: {
    flexDirection: 'row',
    alignSelf: 'center',
    paddingTop: 20,
  },
  textInputStyle: {
    borderWidth: 1,
    borderColor: COLORS.borderBottom,
    width: '45%',
    paddingLeft: 10,
    borderRadius: 4,
    fontSize: 16,
    color: COLORS.textNewColor,
    height: 45,
  },
  textPart: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
});
