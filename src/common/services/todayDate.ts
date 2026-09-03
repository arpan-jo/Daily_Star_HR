const getLastDayOfMonth = () => {
  let today = new Date();
  return new Date(today.getFullYear(), today.getMonth(), 0).getDate();
};

const getFirstDayOfMonth = () => {
  let today = new Date();
  const day = new Date(today.getFullYear(), today.getMonth(), 1).getDate();

  if (day < 9) {
    return `0${day}`;
  } else {
    return day;
  }
};

export const _todayDate = () => {
  let today = new Date();
  const todayDate =
    today.getFullYear() +
    '-' +
    ('0' + (today.getMonth() + 1)).slice(-2) +
    '-' +
    ('0' + today.getDate()).slice(-2);
  return todayDate;
};

export const _todayDateTime = () => {
  let todayDate = new Date(new Date().setHours(new Date().getHours() + 6));

  return todayDate;
};

export const _firstDateOfMonth = () => {
  let today = new Date();
  const todayDate =
    today.getFullYear() +
    '-' +
    ('0' + (today.getMonth() + 1)).slice(-2) +
    '-' +
    getFirstDayOfMonth();
  return todayDate;
};

export const _lastDateOfMonth = () => {
  let today = new Date();
  const todayDate =
    today.getFullYear() +
    '-' +
    ('0' + (today.getMonth() + 1)).slice(-2) +
    '-' +
    getLastDayOfMonth();
  return todayDate;
};

export const dateFormater = (date: any) => {
  let today = new Date(date);
  const todayDate =
    today.getFullYear() +
    '-' +
    ('0' + (today.getMonth() + 1)).slice(-2) +
    '-' +
    ('0' + today.getDate()).slice(-2);
  if (date) {
    return todayDate;
  } else {
    return '';
  }
};
