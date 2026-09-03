import dayjs from 'dayjs';

export const _customPreviousDate = (prevDays = 30) => {
  return dayjs().subtract(prevDays, 'day').format('YYYY-MM-DD');
};
