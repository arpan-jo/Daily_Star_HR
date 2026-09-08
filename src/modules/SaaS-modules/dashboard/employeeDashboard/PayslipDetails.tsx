import { useNavigation, useRoute } from '@react-navigation/native';
import axios from 'axios';
import dayjs from 'dayjs';
import React, { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import { Edge } from 'react-native-safe-area-context';
import MIcons from 'react-native-vector-icons/MaterialIcons';
import WebView from 'react-native-webview';
import Column from '../../../../common/components/Column';
import ContainerNew from '../../../../common/components/Container';
import CustomDropDownNew from '../../../../common/components/CustomDropDown';
import CustomHeader from '../../../../common/components/CustomHeader';
import Row from '../../../../common/components/Row';
import { IMAGES } from '../../../../common/constant/Index';
import { COLORS } from '../../../../common/constant/Themes';
import useAsyncEffect from '../../../../common/packages/useAsyncEffect/useAsyncEffect';
import { getEmployeeSalaryPayslipHtml } from '../../../../services/SaaS-modules/dashboard/employeeDashboard';
import { useRootStore } from '../../../../stores/rootStore';

const edges: Edge[] = ['right', 'bottom', 'left'];

type Option = { value: number; label: string };
type PayslipForm = { year: Option; month: Option };
type PayslipRouteParams = { empId?: number } | undefined;

const monthDDL: Option[] = [
  { value: 1, label: 'January' },
  { value: 2, label: 'February' },
  { value: 3, label: 'March' },
  { value: 4, label: 'April' },
  { value: 5, label: 'May' },
  { value: 6, label: 'June' },
  { value: 7, label: 'July' },
  { value: 8, label: 'August' },
  { value: 9, label: 'September' },
  { value: 10, label: 'October' },
  { value: 11, label: 'November' },
  { value: 12, label: 'December' },
];

const YEARS_BACK = 2;

/**
 * The server renders the payslip for a desktop page width. Inject a viewport
 * and a tiny script that zooms the body down so the whole slip fits the phone
 * width; pinch-zoom stays available for reading the small print.
 */
const buildPayslipDocument = (html: string): string => {
  const head =
    '<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=4, user-scalable=yes" />' +
    '<style>html,body{margin:0;padding:0;background:#fff;}body{padding:8px;-webkit-text-size-adjust:100%;}</style>';
  const script =
    '<script>(function(){function fit(){var b=document.body;if(!b){return;}' +
    "b.style.zoom='1';var w=Math.max(document.documentElement.scrollWidth,b.scrollWidth);" +
    'var vw=window.innerWidth;if(w>vw){b.style.zoom=String(vw/w);}}' +
    "window.addEventListener('load',fit);window.addEventListener('resize',fit);fit();})();</script>";

  const withHead = /<head[^>]*>/i.test(html)
    ? html.replace(/<head[^>]*>/i, match => `${match}${head}`)
    : `<!DOCTYPE html><html><head>${head}</head><body>${html}</body></html>`;

  return /<\/body>/i.test(withHead)
    ? withHead.replace(/<\/body>/i, `${script}</body>`)
    : `${withHead}${script}`;
};

const PayslipDetails = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { userInfo } = useRootStore();

  const routeEmpId = (route.params as PayslipRouteParams)?.empId;
  const empId = routeEmpId || userInfo?.intEmployeeId;

  const currentYear = dayjs().year();
  const currentMonthNumber = dayjs().month() + 1;

  const yearDDL = useMemo<Option[]>(
    () =>
      Array.from({ length: YEARS_BACK + 1 }, (_, i) => {
        const year = currentYear - YEARS_BACK + i;
        return { value: year, label: String(year) };
      }),
    [currentYear],
  );

  const { control, setValue, watch } = useForm<PayslipForm>({
    defaultValues: {
      year: { value: currentYear, label: String(currentYear) },
      month: monthDDL[currentMonthNumber - 1],
    },
  });
  const year = watch('year');
  const month = watch('month');

  const [isLoading, setIsLoading] = useState(false);
  const [payslipHtml, setPayslipHtml] = useState('');

  useAsyncEffect(
    async isMounted => {
      if (!empId || !month?.value || !year?.value) {
        return;
      }
      setIsLoading(true);
      setPayslipHtml('');
      const html = await getEmployeeSalaryPayslipHtml(
        empId,
        month.value,
        year.value,
      );
      if (!isMounted()) {
        return;
      }
      setPayslipHtml(html);
      setIsLoading(false);
    },
    [empId, month?.value, year?.value],
  );

  const isEarliest =
    year?.value === yearDDL[0]?.value && month?.value === 1;
  const isLatest =
    year?.value > currentYear ||
    (year?.value === currentYear && month?.value >= currentMonthNumber);

  const previousMonth = () => {
    if (month?.value === 1) {
      setValue('month', monthDDL[11]);
      setValue('year', {
        value: year.value - 1,
        label: String(year.value - 1),
      });
    } else {
      setValue('month', monthDDL[month.value - 2]);
    }
  };

  const nextMonth = () => {
    if (month?.value === 12) {
      setValue('month', monthDDL[0]);
      setValue('year', {
        value: year.value + 1,
        label: String(year.value + 1),
      });
    } else {
      setValue('month', monthDDL[month.value]);
    }
  };

  // Relative assets (e.g. logo) in the report resolve against the API origin.
  const baseUrl = useMemo(() => {
    const match = /^(https?:\/\/[^/]+)/i.exec(axios.defaults.baseURL || '');
    return match?.[1] || undefined;
  }, []);

  const document = useMemo(
    () => (payslipHtml ? buildPayslipDocument(payslipHtml) : ''),
    [payslipHtml],
  );

  return (
    <ContainerNew
      edges={edges}
      isRefresh={false}
      isScrollView={false}
      header={
        <CustomHeader
          headerColor={true}
          onBackPress={navigation?.goBack}
          title="Pay Slip"
        />
      }
      style={styles.container}
    >
      <Row rowStyle={styles.filterRow}>
        <Column colWidth={'48%'}>
          <CustomDropDownNew
            control={control}
            label="Year"
            name="year"
            data={yearDDL}
            onChange={(opt: Option) => setValue('year', opt)}
            placholder="Select Year"
          />
        </Column>
        <Column colWidth={'48%'} colStyle={styles.colGap}>
          <CustomDropDownNew
            control={control}
            label="Month"
            name="month"
            data={monthDDL}
            onChange={(opt: Option) => setValue('month', opt)}
            placholder="Select Month"
          />
        </Column>
      </Row>

      <View style={styles.monthNav}>
        <TouchableOpacity
          disabled={isEarliest}
          onPress={previousMonth}
          style={[styles.navBtn, isEarliest && styles.navBtnDisabled]}
        >
          <MIcons name="arrow-back-ios" size={18} color={COLORS.iconColor} />
        </TouchableOpacity>
        <Text style={styles.monthLabel}>
          {month?.label}, {year?.label}
        </Text>
        <TouchableOpacity
          disabled={isLatest}
          onPress={nextMonth}
          style={[styles.navBtn, isLatest && styles.navBtnDisabled]}
        >
          <MIcons
            name="arrow-forward-ios"
            size={18}
            color={COLORS.iconColor}
          />
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : document ? (
        <WebView
          key={`${empId}-${year?.value}-${month?.value}`}
          originWhitelist={['*']}
          source={{ html: document, baseUrl }}
          style={styles.webview}
          startInLoadingState={true}
          nestedScrollEnabled
          setSupportMultipleWindows={false}
          renderLoading={() => (
            <View style={styles.loader}>
              <ActivityIndicator size="large" color={COLORS.primary} />
            </View>
          )}
        />
      ) : (
        <View style={styles.noDataSec}>
          <FastImage source={IMAGES.NoDataImage} style={styles.noDataImg} />
          <Text style={styles.noDataText}>
            No Payslip found in{' '}
            <Text style={styles.noDataMonth}>
              {month?.label}, {year?.label}
            </Text>
          </Text>
        </View>
      )}
    </ContainerNew>
  );
};

export default PayslipDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 0,
    backgroundColor: COLORS.white,
  },
  filterRow: {
    paddingHorizontal: 16,
    marginTop: 8,
  },
  colGap: {
    marginLeft: 8,
  },
  monthNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  navBtn: {
    padding: 6,
  },
  navBtnDisabled: {
    opacity: 0.3,
  },
  monthLabel: {
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 20,
    color: COLORS.textNewColor,
  },
  webview: {
    flex: 1,
    width: '100%',
    backgroundColor: COLORS.white,
  },
  loader: {
    flex: 1,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.white,
  },
  noDataSec: {
    flex: 1,
    paddingTop: 50,
    alignItems: 'center',
  },
  noDataImg: {
    width: 130,
    height: 90,
  },
  noDataText: {
    textAlign: 'center',
    color: COLORS.textNewColor,
    paddingTop: 10,
    fontSize: 14,
  },
  noDataMonth: {
    fontSize: 14,
    fontWeight: '600',
  },
});
