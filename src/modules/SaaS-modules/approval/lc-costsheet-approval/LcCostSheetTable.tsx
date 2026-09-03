import React from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import Row from '../../../../common/components/Row';
import Column from '../../../../common/components/Column';
import CustomTextNew from '../../../../common/components/CustomText';
import {COLORS} from '../../../../common/constant/Themes';

const LandingCostTable = ({data}: any) => {
  // Filter data by section
  const section1 = data.filter((item: any) => item.section === 1);
  const section2 = data.filter((item: any) => item.section === 2);

  // Calculate Totals
  const getTotals = (section: any[]) => {
    const totalBooked = section.reduce(
      (sum, item) => sum + item.numBookedAmount,
      0,
    );
    const totalActual = section.reduce(
      (sum, item) => sum + item.numActualAmount,
      0,
    );
    return {
      totalBooked,
      totalActual,
      variance: totalBooked - totalActual,
    };
  };

  const total1 = getTotals(section1);
  const total2 = getTotals(section2);
  const netLandingCost = total1?.totalBooked - total2?.totalBooked;

  // Row Render
  const renderRow = (item: any, index: number, section: any) => (
    <Row key={index} style={[styles.row, index % 2 === 0 && styles.evenRow]}>
      <Column colWidth="10%">
        <CustomTextNew text={`${item.sl}`} txtSize={13} />
      </Column>
      <Column colWidth="30%">
        <CustomTextNew text={item.strHead} txtSize={13} />
      </Column>
      <Column colWidth="20%">
        <CustomTextNew
          text={
            item?.numBookedAmount > 0 ? item?.numBookedAmount.toFixed(2) : ''
          }
          txtSize={13}
          txtAlign="right"
        />
      </Column>
      <Column colWidth="20%">
        <CustomTextNew
          text={
            section === 'section1'
              ? item?.numActualAmount > 0
                ? item?.numActualAmount.toFixed(2)
                : ''
              : ''
          }
          txtSize={13}
          txtAlign="right"
        />
      </Column>
      <Column colWidth="20%">
        <CustomTextNew
          text={
            section === 'section1'
              ? (item?.numBookedAmount - item?.numActualAmount).toFixed(2)
              : ''
          }
          txtSize={13}
          txtAlign="right"
          txtColor={
            item.numBookedAmount - item.numActualAmount < 0
              ? COLORS.red
              : COLORS.textNewColor
          }
        />
      </Column>
    </Row>
  );

  // Total Row Render
  // Total Row Render with First Two Columns Merged
  const renderTotalRow = (
    label: string,
    booked: number,
    actual?: any,
    variance?: any,
  ) => (
    <Row style={[styles.row, styles.totalRow]}>
      {/* Merged first two columns */}
      <Column colWidth="40%">
        <CustomTextNew text={label} txtWeight="600" />
      </Column>
      {/* Other three columns remain 20% each */}
      <Column colWidth="20%">
        <CustomTextNew
          text={booked ? booked?.toFixed(2) : ''}
          txtWeight="600"
          txtAlign="right"
        />
      </Column>
      <Column colWidth="20%">
        <CustomTextNew
          text={actual ? actual?.toFixed(2) : ''}
          txtWeight="600"
          txtAlign="right"
        />
      </Column>
      <Column colWidth="20%">
        <CustomTextNew
          text={variance ? variance?.toFixed(2) : ''}
          txtWeight="600"
          txtAlign="right"
        />
      </Column>
    </Row>
  );

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      <View style={styles.tableContainer}>
        {/* Header */}
        {/* Header Row */}
        <Row style={[styles.row, styles.headerRow]}>
          <Column colWidth="10%">
            <CustomTextNew text="SL" txtWeight="500" txtColor="#fff" />
          </Column>
          <Column colWidth="30%">
            <CustomTextNew text="Particulars" txtWeight="500" txtColor="#fff" />
          </Column>
          <Column colWidth="20%">
            <CustomTextNew
              text="Estimated Amount (BDT)"
              txtWeight="500"
              txtColor="#fff"
              txtAlign="left"
            />
          </Column>
          <Column colWidth="20%">
            <CustomTextNew
              text="Actual Amount (BDT)"
              txtWeight="500"
              txtColor="#fff"
              txtAlign="right"
            />
          </Column>
          <Column colWidth="20%">
            <CustomTextNew
              text="Variance (BDT)"
              txtWeight="500"
              txtColor="#fff"
              txtAlign="right"
            />
          </Column>
        </Row>

        {/* Section 1 */}
        {section1?.map((item: any, index: any) =>
          renderRow(item, index, 'section1'),
        )}
        {renderTotalRow(
          'Total Cost including VAT and TAX',
          total1?.totalBooked,
          total1?.totalActual,
          total1?.variance,
        )}

        {/* Section 2 */}
        {section2?.map((item: any, index: any) =>
          renderRow(item, index, 'section2'),
        )}
        {renderTotalRow('Total Deduction of VAT and TAX', total2?.totalBooked)}

        {/* Net Landing Cost */}
        <Row style={[styles.row, styles.netLandingRow]}>
          <Column colWidth="40%">
            <CustomTextNew
              text="Net Landing Cost Excluding VAT 
              and TAX"
              txtWeight="700"
            />
          </Column>
          <Column colWidth="20%">
            <CustomTextNew
              text={netLandingCost?.toFixed(2)}
              txtWeight="700"
              txtAlign="right"
            />
          </Column>
        </Row>
      </View>
    </ScrollView>
  );
};

export default LandingCostTable;

const styles = StyleSheet.create({
  tableContainer: {
    flex: 1,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    margin: 12,
    borderRadius: 8,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerRow: {
    backgroundColor: COLORS.primary,
  },
  evenRow: {
    backgroundColor: '#F9F9F9',
  },
  totalRow: {
    backgroundColor: '#E6F4EA',
  },
  netLandingRow: {
    backgroundColor: '#D1ECF1',
  },
});
