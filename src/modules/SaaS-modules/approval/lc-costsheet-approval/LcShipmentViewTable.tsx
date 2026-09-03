import React from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import Column from '../../../../common/components/Column';
import CustomInputNew from '../../../../common/components/CustomInput';
import Row from '../../../../common/components/Row';
import {COLORS} from '../../../../common/constant/Themes';

const headers = [
  {title: 'SL', width: 70},
  {title: 'Item Code', width: 100},
  {title: 'Item Name', width: 200},
  {title: 'UOM', width: 100},
  {title: 'HS Code', width: 100},
  {title: 'PO Qty', width: 100},
  {title: 'Added Qty', width: 100},
  {title: 'Shipment Loss Gain Qty', width: 200},
];
export const LcShipmentViewTable = ({
  data,
  control,
  setValue,
  rowOnchangeHandler,
}: any) => {
  return (
    <ScrollView horizontal style={{marginTop: 20}}>
      <View>
        {/* Table Header */}
        <View style={styles.tableHeaderStyle}>
          {headers.map((header: any, index: any) => (
            <View
              key={index}
              style={[styles.tableTitle, {width: header?.width}]}>
              <Text style={styles.commonTxt}>{header.title}</Text>
            </View>
          ))}
        </View>

        {/* Table Rows */}
        {data?.length > 0 ? (
          <>
            {data?.map((item: any, index: any) => (
              <View
                key={index}
                style={{flexDirection: 'row', backgroundColor: '#fff'}}>
                <View style={[styles.tableText, {width: 70}]}>
                  <Text style={styles.tableDataTxt}>{index + 1}</Text>
                </View>
                <View style={[styles.tableText, {width: 100}]}>
                  <Text style={styles.tableDataTxt}>{item?.itemCode}</Text>
                </View>
                <View style={[styles.tableText, {width: 200}]}>
                  <Text style={styles.tableDataTxt}>{item?.itemName}</Text>
                </View>
                <View style={[styles.tableText, {width: 100}]}>
                  <Text style={styles.tableDataTxt}>{item?.uomName}</Text>
                </View>
                <View style={[styles.tableText, {width: 100}]}>
                  <Text style={styles.tableDataTxt}>{item?.hsCode}</Text>
                </View>
                <View style={[styles.tableText, {width: 100}]}>
                  <Text style={styles.tableDataTxt}>{item?.poquantity}</Text>
                </View>
                <View style={[styles.tableText, {width: 100}]}>
                  <Text style={styles.tableDataTxt}>{item?.addedQuantity}</Text>
                </View>
                <View style={[styles.tableText, {width: 200}]}>
                  <Row justify="flex-start">
                    <Column colWidth="100%">
                      <CustomInputNew
                        setValue={setValue}
                        control={control}
                        keyboardType="numeric"
                        name={`numShipmentLossGainQty${index}`}
                        label=""
                        onChange={(e: any) => {
                          setValue(`numShipmentLossGainQty${index}`, e);
                          rowOnchangeHandler(
                            e,
                            index,
                            'numShipmentLossGainQty',
                          );
                        }}
                        rules={{required: false}}
                      />
                    </Column>
                  </Row>
                </View>
              </View>
            ))}
          </>
        ) : (
          <></>
        )}
      </View>
    </ScrollView>
  );
};

export default LcShipmentViewTable;

const styles = StyleSheet.create({
  tableHeaderStyle: {
    backgroundColor: COLORS.whitesmoke,
    marginTop: 5,
    flexDirection: 'row',
  },

  tableTitle: {
    borderWidth: 0.8,
    alignItems: 'center',
    borderColor: '#E5E5E5',
    paddingVertical: 10,
  },
  commonTxt: {
    fontWeight: 'bold',
    color: COLORS.black,
    fontSize: 14,
  },
  tableDate: {
    borderWidth: 0.8,
    alignItems: 'center',
    borderColor: '#E5E5E5',
    paddingVertical: 10,
  },
  tableDataTxt: {
    color: COLORS.graySubText,
    fontSize: 13,
    lineHeight: 20,
  },
  tableText: {
    borderWidth: 0.8,
    alignItems: 'center',
    borderColor: '#E5E5E5',
    paddingVertical: 10,
    paddingHorizontal: 5,
  },
  tableNumber: {
    borderWidth: 0.8,
    alignItems: 'center',
    borderColor: '#E5E5E5',
    paddingVertical: 10,
    paddingHorizontal: 5,
  },
  totalTableDataTxt: {
    color: COLORS.black,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '500',
  },
});
