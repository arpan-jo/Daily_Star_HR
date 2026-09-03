/**
 * @format
 */

import { targetIdForMonth, toRows } from '../src/modules/SaaS-modules/dashboard/employeeDashboard/performance-management/Performance-management-new/kpiRows';

// trimmed GetKpiChartReport?PartName=TargetedKPI response
const infoList: any = [
  {
    bsc: 'Financial',
    dynamicList: [
      {
        objective: 'OBJ342 -  Evaluate the individual effectiveness.',
        kpi: 'KPI619 - % Sales Rep Performance',
        strFrequency: 'Monthly',
        numWeight: 25,
        benchmark: 20,
        numTarget: 50,
        numAchivement: 41.67,
        progress: 83.34,
        arrowText: 'up',
        score: 20.84,
      },
    ],
  },
  {
    bsc: 'Internal Process',
    dynamicList: [
      {
        objective: 'OBJ343 -  Execution of Strategic Initiatives.',
        kpi: 'KPI622 - % Strategic Initiatives Completed Within Budget',
        strFrequency: 'Yearly',
        numWeight: 9,
        benchmark: 9,
        numTarget: 100,
        numAchivement: 0,
        progress: 0,
        arrowText: 'up',
        score: 0,
      },
    ],
  },
  {
    bsc: '',
    dynamicList: [
      {
        objective: null,
        kpi: null,
        strFrequency: null,
        numWeight: 60,
        benchmark: 0,
        numTarget: null,
        numAchivement: 66.67,
        progress: null,
        arrowText: null,
        score: 23.84,
      },
    ],
  },
];

test('maps kpi report to table rows with a total row last', () => {
  const rows = toRows(infoList);

  expect(rows).toHaveLength(3);
  expect(rows[0]).toMatchObject({
    bsc: 'Financial',
    srf: 'Monthly',
    weight: '25',
    benchmark: '20',
    target: '50',
    achievement: '41.67',
    progress: '83.34 %',
    score: '20.84',
    isTotal: false,
  });
  // zero progress must still render, not fall back to blank
  expect(rows[1].progress).toBe('0 %');
  expect(rows[2]).toMatchObject({
    objective: 'Total',
    weight: '60',
    score: '23.84',
    progress: '',
    isTotal: true,
  });
});

test('handles an empty report', () => {
  expect(toRows([])).toEqual([]);
});

describe('targetIdForMonth', () => {
  const monthly = Array.from({ length: 12 }, (_, i) => `${142572 + i}`);
  const quarterly = ['142584', '142585', '142586', '142587'];

  test('monthly ids are ordered from July', () => {
    expect(targetIdForMonth(monthly, 7)).toBe(142572); // Jul
    expect(targetIdForMonth(monthly, 1)).toBe(142578); // Jan
    expect(targetIdForMonth(monthly, 6)).toBe(142583); // Jun, last period
  });

  test('quarterly ids cover three months each', () => {
    expect(targetIdForMonth(quarterly, 7)).toBe(142584); // Jul-Sep
    expect(targetIdForMonth(quarterly, 9)).toBe(142584);
    expect(targetIdForMonth(quarterly, 10)).toBe(142585); // Oct-Dec
    expect(targetIdForMonth(quarterly, 6)).toBe(142587); // Apr-Jun
  });

  test('yearly kpis always hit the single id, empty lists give 0', () => {
    expect(targetIdForMonth(['142588'], 3)).toBe(142588);
    expect(targetIdForMonth([], 3)).toBe(0);
  });
});
