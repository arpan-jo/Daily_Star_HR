// utils/commonUtils.ts
import {Linking, Platform} from 'react-native';

//
// ☎️ Dial Contact
//
export const dialContact = ({
  phone,
  email,
  toaster,
}: {
  phone?: string;
  email?: string;
  toaster: {
    show: ({
      message,
      type,
    }: {
      message: string;
      type: 'error' | 'success';
    }) => void;
  };
}) => {
  if (phone) {
    const phoneNumber =
      Platform.OS === 'android' ? `tel:${phone}` : `telprompt:${phone}`;
    Linking.openURL(phoneNumber).catch(() =>
      toaster.show({message: 'Unable to open dialer.', type: 'error'}),
    );
  } else if (email) {
    Linking.openURL(`mailto:${email}`).catch(() =>
      toaster.show({message: 'Unable to open mail client.', type: 'error'}),
    );
  } else {
    toaster.show({
      message: 'Phone number and email are both missing.',
      type: 'error',
    });
  }
};

//
// ✅ Toggle Clicked Item in List
//
export const toggleClickByIndex = <T extends {isClicked?: boolean}>(
  data: T[],
  targetIndex: number,
): T[] => {
  return data.map((item, index) => ({
    ...item,
    isClicked: index === targetIndex ? !item.isClicked : false,
  }));
};

//
// 📅 Create MeetMe Message
//
type CreateMeetMeParams = {
  userInfo: any;
  empId: any;
  data: {
    agendaOfMeetMe: string;
    schedule: string;
  };
  reset: () => void;
  refRBSheet?: React.RefObject<any>;
  toaster: {
    show: ({
      message,
      type,
    }: {
      message: string;
      type: 'success' | 'error';
    }) => void;
  };
  createMeetMe: (
    accountId: number,
    employeeId: number,
    displayName: string,
    targetEmpId: number,
    agenda: string,
    schedule: string,
    onSuccess: () => void,
  ) => Promise<boolean>;
};

export const createMeetMeMessage = async ({
  userInfo,
  empId,
  data,
  reset,
  refRBSheet,
  toaster,
  createMeetMe,
}: CreateMeetMeParams) => {
  const dname = `${userInfo?.strDisplayName}, ${userInfo?.strDesignation}, ${userInfo?.strDepartment}`;
  const res = await createMeetMe(
    userInfo?.intAccountId,
    userInfo?.intEmployeeId,
    dname,
    empId,
    data.agendaOfMeetMe,
    data.schedule,
    () => {
      reset();
      refRBSheet?.current?.close?.();
    },
  );
  if (res) {
    toaster.show({message: 'Message sent successfully.', type: 'success'});
  }
};

//
// 🗺️ Open Map Location
//
type OpenMapParams = {
  address?: string;
  toaster: {
    show: ({
      message,
      type,
    }: {
      message: string;
      type: 'error' | 'success';
    }) => void;
  };
};

export const openMapLocation = async ({address, toaster}: OpenMapParams) => {
  if (!address) {
    toaster.show({message: 'No address to show.', type: 'error'});
    return;
  }

  const scheme = Platform.select({
    ios: 'maps:0,0?q=',
    android: 'geo:0,0?q=',
  });

  const url = Platform.select({
    ios: `${scheme}@${address}`,
    android: `${scheme}${address}`,
  });

  try {
    await Linking.openURL(url!);
  } catch (_err) {
    toaster.show({message: 'Failed to open map.', type: 'error'});
  }
};

type CreateBookmarkParams = {
  userInfo: any;
  item: {
    EmployeeId: number;
    isBookmarked: boolean;
  };
  createBookMarked: (
    senderId: number,
    receiverId: number,
    isBookmarked: boolean,
    callback: () => void,
  ) => Promise<any>;
  customCallback: () => void;
  handleResponds: (res: any) => void;
};

export const createBookmarkEntry = async ({
  userInfo,
  item,
  createBookMarked,
  customCallback,
  handleResponds,
}: CreateBookmarkParams) => {
  const res = await createBookMarked(
    userInfo?.intEmployeeId,
    item?.EmployeeId,
    item?.isBookmarked,
    customCallback,
  );
  handleResponds(res);
};
