import type React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import FastImage from 'react-native-fast-image';
import MIcon from 'react-native-vector-icons/MaterialIcons';
import {IMAGES} from '../../../../../../common/constant/Index';
import {COLORS} from '../../../../../../common/constant/Themes';
import {date_formater} from '../../../../../../common/services/dateFormater';
import {
  getAttendanceBgStatusColor,
  getAttendanceStatusColor,
} from '../../../../../../common/services/getColor';
import {getImageURL} from '../../../../../../common/services/getImage';
import {timeFormaterToPmAm} from '../../../../../../common/services/timeFormater';
import {_todayDateTime} from '../../../../../../common/services/todayDate';
import {EmployeeAttandanceListViewModelsEntity} from '../../../../../../interfaces/dashboard/supervisorDashboard';

interface EmployeeCardProps {
  item: EmployeeAttandanceListViewModelsEntity;
  index: number;
  onToggleExpand: (index: number) => void;
  showEmployeeCode?: boolean;
}

const EmployeeCard: React.FC<EmployeeCardProps> = ({
  item,
  index,
  onToggleExpand,
  showEmployeeCode = true,
}) => {
  const date = _todayDateTime();

  return (
    <View style={styles.card}>
      <View style={styles.mainCard}>
        <View style={styles.cardHead}>
          <View>
            {item?.employeeProfileUrlId ? (
              <View
                style={[styles.noImageBox, {backgroundColor: COLORS.white}]}>
                <FastImage
                  source={{uri: getImageURL(item?.employeeProfileUrlId)}}
                  style={[styles.noImage, styles.mTop0]}
                />
              </View>
            ) : (
              <View style={styles.noImageBox}>
                <FastImage source={IMAGES.NoImage} style={styles.noImage} />
              </View>
            )}
          </View>

          <View style={styles.cardHeadRight}>
            <Text style={styles.empName}>{item?.employeeName}</Text>
            <Text style={[styles.cmnText, styles.pVertical4]}>
              {item?.designation}
            </Text>
            <Text style={styles.cmnText}>{item?.departmant}</Text>
          </View>
        </View>

        <View>
          {showEmployeeCode && (
            <Text style={styles.empId}>
              [ {item?.employeeCode || item?.employeeId} ]
            </Text>
          )}
          <View
            style={[
              styles.statusBadge,
              {backgroundColor: getAttendanceBgStatusColor(item?.status)},
            ]}>
            <Text
              style={[
                styles.statusText,
                {color: getAttendanceStatusColor(item?.status)},
              ]}>
              {item?.status}
            </Text>
          </View>
          {!item?.isClicked && (
            <TouchableOpacity
              style={styles.moreLessIcon}
              onPress={() => onToggleExpand(index)}>
              <MIcon name="expand-more" size={25} color={COLORS.iconColor} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {item?.isClicked && (
        <ExpandedContent
          item={item}
          date={date}
          onToggleExpand={() => onToggleExpand(index)}
        />
      )}
    </View>
  );
};

interface ExpandedContentProps {
  item: EmployeeAttandanceListViewModelsEntity;
  date: string;
  onToggleExpand: () => void;
}

const ExpandedContent: React.FC<ExpandedContentProps> = ({
  item,
  date,
  onToggleExpand,
}) => (
  <View>
    <View style={styles.bar} />
    <View style={styles.rowSpaceBetween}>
      <View style={styles.timeCard}>
        <View>
          <Text style={styles.dateText}>{date_formater(date as any)}</Text>
          <View style={styles.rowPaddingTop21}>
            <View style={styles.pRight10}>
              <Text style={styles.checkInText}>Check In</Text>
              <Text style={styles.inoutTime}>
                {timeFormaterToPmAm(item?.inTime)}
              </Text>
            </View>
            <MIcon name="north" size={26} color={COLORS.iconColor} />
          </View>
        </View>

        <View>
          <View style={styles.workingHourPart}>
            <Text style={styles.workingHour}>
              {item?.strWorkingHours || '---'}
            </Text>
          </View>
          <View style={styles.timeContainer}>
            <View style={styles.pRight10}>
              <Text style={styles.checkOutText}>Check Out</Text>
              <Text style={styles.inoutTime}>
                {timeFormaterToPmAm(item?.outTime)}
              </Text>
            </View>
            <MIcon name="south" size={26} color={COLORS.iconColor} />
          </View>
        </View>
      </View>
      <TouchableOpacity onPress={onToggleExpand} style={styles.moreLessIcon}>
        <MIcon name="expand-less" size={26} color={COLORS.iconColor} />
      </TouchableOpacity>
    </View>
  </View>
);

const styles = StyleSheet.create({
  card: {
    borderWidth: 0.8,
    marginTop: 8,
    borderColor: COLORS.offDay,
    elevation: 3,
    backgroundColor: COLORS.white,
    shadowColor: COLORS.black,
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.1,
    shadowRadius: 5,
    paddingVertical: 16,
    paddingHorizontal: 10,
    borderRadius: 3,
  },
  mainCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cardHead: {
    flexDirection: 'row',
    width: '78%',
  },
  noImageBox: {
    height: 45,
    width: 45,
    borderRadius: 100,
    overflow: 'hidden',
    backgroundColor: '#DCDCDC',
  },
  noImage: {
    marginTop: 6,
    height: 45,
    width: 45,
    alignSelf: 'center',
  },
  mTop0: {
    marginTop: 0,
  },
  cardHeadRight: {
    marginLeft: 10,
    width: '80%',
  },
  empName: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '500',
    color: COLORS.textNewColor,
  },
  cmnText: {
    fontSize: 14,
    lineHeight: 20,
    color: COLORS.graySubText,
  },
  pVertical4: {
    paddingVertical: 4,
  },
  empId: {
    fontSize: 14,
    lineHeight: 20,
    color: COLORS.textNewColor,
  },
  statusBadge: {
    borderRadius: 100,
    height: 20,
    marginVertical: 5,
  },
  statusText: {
    height: 20,
    borderRadius: 99,
    paddingHorizontal: 8,
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '600',
    lineHeight: 18,
  },
  moreLessIcon: {
    justifyContent: 'flex-end',
    paddingLeft: 10,
    alignSelf: 'flex-end',
  },
  bar: {
    height: 1,
    backgroundColor: COLORS.bar,
    marginVertical: 8,
  },
  rowSpaceBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  timeCard: {
    flexDirection: 'row',
    borderWidth: 1,
    width: '70%',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 4,
    borderColor: COLORS.borderBottom,
    marginVertical: 6,
    marginLeft: 10,
  },
  dateText: {
    fontSize: 12,
    lineHeight: 18,
    color: COLORS.textNewColor,
  },
  rowPaddingTop21: {
    flexDirection: 'row',
    paddingTop: 21,
  },
  pRight10: {
    paddingRight: 10,
  },
  checkInText: {
    fontSize: 12,
    lineHeight: 18,
    color: '#2E90FA',
  },
  workingHourPart: {
    backgroundColor: COLORS.lightGray3,
    borderRadius: 16,
  },
  workingHour: {
    paddingHorizontal: 16,
    paddingVertical: 4,
    fontWeight: '500',
    lineHeight: 18,
    fontSize: 12,
    color: COLORS.textNewColor,
    textAlign: 'center',
  },
  timeContainer: {
    flexDirection: 'row',
    paddingTop: 10,
    alignSelf: 'center',
  },
  checkOutText: {
    fontSize: 12,
    lineHeight: 18,
    color: '#F79009',
  },
  inoutTime: {
    fontSize: 14,
    lineHeight: 20,
    color: COLORS.textNewColor,
    fontWeight: '500',
  },
});

export default EmployeeCard;
