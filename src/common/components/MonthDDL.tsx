import React from 'react';
import {StyleSheet} from 'react-native';
import Column from './Column';
import CustomDropDownNew from './CustomDropDown';

// Common month dropdown list
export const commonMonthDDL = [
  {value: 1, label: 'January'},
  {value: 2, label: 'February'},
  {value: 3, label: 'March'},
  {value: 4, label: 'April'},
  {value: 5, label: 'May'},
  {value: 6, label: 'June'},
  {value: 7, label: 'July'},
  {value: 8, label: 'August'},
  {value: 9, label: 'September'},
  {value: 10, label: 'October'},
  {value: 11, label: 'November'},
  {value: 12, label: 'December'},
];

// Fiscal year months: July is 1 ... June is 12
export const fiscalMonthDDL = [
  ...commonMonthDDL.slice(6),
  ...commonMonthDDL.slice(0, 6),
].map((item, index) => ({label: item.label, value: index + 1}));

// Define the props for the component
interface MonthDDLTypes {
  control: any;
  setValue: any;
  onMonthChange?: (selected: {value: number; label: string}) => void;
  isRequired?: boolean;
  name?: string;
  label?: string;
  placeholder?: string;
}

const MonthDDL: React.FC<MonthDDLTypes> = ({
  control,
  setValue,
  onMonthChange,
  isRequired = false,
  name = 'month',
  label = 'Month',
  placeholder = 'Choose',
}) => {
  return (
    <Column colWidth="100%">
      <CustomDropDownNew
        control={control}
        data={commonMonthDDL}
        name={name}
        label={label}
        placholder={placeholder}
        onChange={(option: {value: number; label: string}) => {
          setValue(name, option);
          onMonthChange?.(option);
        }}
        rules={isRequired}
      />
    </Column>
  );
};

export default MonthDDL;

const _styles = StyleSheet.create({});
