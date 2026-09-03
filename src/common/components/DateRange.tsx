import React from 'react';
import {StyleSheet} from 'react-native';
import Column from './Column';
import CustomDatePickerNew from './CustomDatePicker';
import Row from './Row';

interface Props {
  // setValue: (name: string, value: any) => void;
  setValue: any;
  control: any;
  fromDate?: string;
  labelFromDate?: string;
  labelToDate?: string;
  toDate?: string;
  isOneRow?: boolean;
  minFromDate?: string;
  maxFromDate?: string;
  minToDate?: string;
  maxToDate?: string;
  fromDateOnChange?: (options: String) => void;
  toDateOnChange?: (options: String) => void;

  watch?: any;
  getValues?: any;
}

const DateRange = ({
  control,
  setValue,
  fromDate,
  labelFromDate,
  toDate,
  labelToDate,
  isOneRow,
  minFromDate,
  maxFromDate,
  minToDate,
  maxToDate,
  fromDateOnChange,
  toDateOnChange,
  watch: _watch,
  getValues: _getValues,
}: Props) => {
  return (
    <Column colWidth={'100%'}>
      <Row
        rowWidth="100%"
        direction={isOneRow ? 'row' : 'column'}
        justify="space-between">
        <Column colWidth={isOneRow ? '48%' : '100%'}>
          <CustomDatePickerNew
            name={fromDate || 'fromDate'}
            label={labelFromDate || 'From Date'}
            control={control}
            rules={{required: true}}
            minimumDate={minFromDate}
            maximumDate={maxFromDate}
            setValue={setValue}
            onChange={(date: string) => {
              setValue(fromDate || 'fromDate', date);
              fromDateOnChange && fromDateOnChange(date);
            }}
          />
        </Column>

        <Column
          colWidth={isOneRow ? '48%' : '100%'}
          colStyle={{paddingTop: isOneRow ? 0 : 6}}>
          <CustomDatePickerNew
            name={toDate || 'toDate'}
            label={labelToDate || 'To Date'}
            control={control}
            minimumDate={minToDate}
            maximumDate={maxToDate}
            rules={{required: true}}
            setValue={setValue}
            onChange={(date: string) => {
              setValue(toDate || 'toDate', date);
              toDateOnChange && toDateOnChange(date);
            }}
          />
        </Column>
      </Row>
    </Column>
  );
};

export default DateRange;

const _styles = StyleSheet.create({});
