import React from 'react';
import {ScrollView, StyleSheet, Text, View, FlatList} from 'react-native';
import {COLORS} from '../constant/Themes';

interface TableHeader {
  title: string;
  width: number;
  dataKey: string;
  renderCell?: (item: any) => React.ReactNode;
}

interface DataTableProps {
  headers: TableHeader[];
  data: any[];
  keyExtractor: string;
  contentStyle?: object;
  // keeps the first column in place while the rest scrolls sideways.
  // rows get a fixed height so both halves stay lined up.
  stickyFirstColumn?: boolean;
  rowHeight?: number;
  // an extra right-hand column rendered as ONE cell spanning every row,
  // e.g. a single action button for the whole table
  mergedColumn?: {title: string; width: number; render: () => React.ReactNode};
}

const CustomDataTable: React.FC<DataTableProps> = ({
  headers,
  data,
  keyExtractor,
  contentStyle,
  stickyFirstColumn = false,
  rowHeight,
  mergedColumn,
}) => {
  const cellHeight = stickyFirstColumn ? rowHeight ?? 90 : rowHeight;

  const renderCellContent = (item: any, header: TableHeader) => {
    if (header?.renderCell) {
      return header.renderCell(item);
    }
    return (
      <Text style={styles.tableDataTxt}>
        {item?.[header?.dataKey]?.toString() ?? ''}
      </Text>
    );
  };

  const renderCells = (item: any, columns: TableHeader[]) =>
    columns.map((header, index) => (
      <View
        key={`${header.dataKey}-${index}`}
        style={[
          styles.cell,
          {width: header.width},
          !!cellHeight && styles.fixedHeightCell,
        ]}
        accessible
        accessibilityLabel={`${header.title}: ${item?.[header.dataKey] ?? ''}`}>
        {renderCellContent(item, header)}
      </View>
    ));

  const renderHeaderCells = (columns: TableHeader[]) =>
    columns.map((header, index) => (
      <View
        key={`header-${index}`}
        style={[styles.headerCell, {width: header.width}]}>
        <Text style={styles.headerText}>{header?.title ?? ''}</Text>
      </View>
    ));

  const renderList = (columns: TableHeader[]) => (
    <FlatList
      data={data}
      renderItem={({item}) => (
        <View style={[styles.row, !!cellHeight && {height: cellHeight}]}>
          {renderCells(item, columns)}
        </View>
      )}
      keyExtractor={item => item?.[keyExtractor]?.toString() ?? ''}
      scrollEnabled={false}
    />
  );

  const emptyState = (
    <View style={styles.emptyState}>
      <Text style={styles.emptyText}>No data available</Text>
    </View>
  );

  if (stickyFirstColumn) {
    const [firstColumn, ...restColumns] = headers;
    return (
      <View style={[styles.container, styles.stickyWrapper, contentStyle]}>
        <View style={styles.stickyColumn}>
          <View style={styles.header}>{renderHeaderCells([firstColumn])}</View>
          {data.length > 0 ? renderList([firstColumn]) : null}
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View>
            <View style={styles.header}>{renderHeaderCells(restColumns)}</View>
            {data.length > 0 ? renderList(restColumns) : emptyState}
          </View>
        </ScrollView>
      </View>
    );
  }

  return (
    <ScrollView
      horizontal
      style={[styles.container, contentStyle]}
      showsHorizontalScrollIndicator={false}>
      {/* row wrapper so the merged column can stretch to the rows' height */}
      <View style={styles.stickyWrapper}>
        <View>
          <View style={styles.header}>{renderHeaderCells(headers)}</View>

          {data.length > 0 ? renderList(headers) : emptyState}
        </View>

        {mergedColumn ? (
          <View style={[styles.mergedColumn, {width: mergedColumn.width}]}>
            <View style={styles.header}>
              <View style={[styles.headerCell, {width: mergedColumn.width}]}>
                <Text style={styles.headerText}>{mergedColumn.title}</Text>
              </View>
            </View>
            <View style={styles.mergedCell}>{mergedColumn.render()}</View>
          </View>
        ) : null}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#E5E5E5', // Outer border around the whole table
  },
  stickyWrapper: {
    flexDirection: 'row',
  },
  mergedColumn: {
    borderLeftWidth: 1,
    borderLeftColor: '#D0D5DD',
    backgroundColor: '#fff',
  },
  mergedCell: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
  },
  stickyColumn: {
    borderRightWidth: 1,
    borderRightColor: '#D0D5DD',
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    backgroundColor: COLORS.whitesmoke,
    borderBottomWidth: 1,
    borderColor: '#E5E5E5',
  },
  headerCell: {
    paddingVertical: 12,
    paddingHorizontal: 8,
    alignItems: 'center',
    borderRightWidth: 1,
    borderRightColor: '#E5E5E5', // Vertical border in header cells
  },
  headerText: {
    fontWeight: '600',
    color: COLORS.black,
    fontSize: 14,
  },
  row: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderColor: '#E5E5E5',
  },
  cell: {
    paddingVertical: 12,
    paddingHorizontal: 8,
    alignItems: 'center',
    minHeight: 40,
    borderRightWidth: 1,
    borderRightColor: '#E5E5E5', // Vertical border in data cells
  },
  fixedHeightCell: {
    justifyContent: 'center',
    overflow: 'hidden',
  },
  tableDataTxt: {
    color: COLORS.graySubText,
    fontSize: 13,
    lineHeight: 18,
  },
  emptyState: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    color: COLORS.graySubText,
    fontSize: 14,
  },
});

export default CustomDataTable;
