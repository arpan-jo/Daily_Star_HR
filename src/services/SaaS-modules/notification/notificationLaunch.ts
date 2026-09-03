let openedFromNotification = false;

export const setOpenedFromNotification = (value: boolean) => {
  openedFromNotification = value;
};

export const wasOpenedFromNotification = () => {
  return openedFromNotification;
};
