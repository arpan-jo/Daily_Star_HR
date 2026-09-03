import axios from 'axios';

export const uploadFileMultipartForMeeting = async (
  accountId: any,
  empId: any,
  buId: any,
  formData: any,
  setIsLoading: any,
) => {
  try {
    const file = {
      uri: formData?.uri,
      name: formData?.fileName,
      type: formData?.type,
    };
    let formDat = new FormData();
    formDat?.append('files', file);
    setIsLoading(true);
    const data = await axios.post(
      `/Document/UploadFile?accountId=${accountId}&tableReferrence=PolicyUpload&documentTypeId=13&businessUnitId=${buId}&createdBy=${empId}`,
      formDat,
      {headers: {'Content-Type': 'multipart/form-data'}},
    );
    setIsLoading(false);
    return data?.data?.[0];
  } catch (_error) {
    setIsLoading(false);
  }
};

export const createMeetingAgenda = async (payload: any, setIsLoading: any) => {
  try {
    setIsLoading(true);
    const data = await axios.post('/Meeting/MeetingCreateAndEdit', payload);
    setIsLoading(false);
    return data?.data;
  } catch (_error) {
    setIsLoading(false);
  }
};

export const createMeetingSatisfaction = async (
  meetingId: null | number | undefined,
  attId: number | null | undefined,
  levelId: null | number | undefined,
  text: string,
  setIsLoading: any,
) => {
  try {
    setIsLoading(true);
    const data = await axios.post(
      `/Meeting/SubmitMeetingSatisfaction?meetingId=${meetingId}&attendeeId=${attId}&level=${levelId}&message=${text}`,
    );
    setIsLoading(false);
    return data?.data;
  } catch (_error) {
    setIsLoading(false);
  }
};

export const getContactLandingForMeeting = async (
  accId: null | number | undefined,
  buId: number | null | undefined,
  setIsLoading: any,
  searchText: string,
  empId: null | number | undefined,
) => {
  try {
    setIsLoading(true);
    const res = await axios.get(
      `/Employee/PeopleDeskAllLanding?TableName=CultureEmployeeContactInfo&AccountId=${accId}&BusinessUnitId=${buId}&SearchText=${searchText}&EmpId=${empId}`,
    );
    setIsLoading(false);
    return res?.data;
  } catch (_error) {
    setIsLoading(false);
  }
};
export const getSatifaction = async (
  meetingId: null | number | undefined,
  empId: null | number | undefined,
  setIsLoading: any,
) => {
  try {
    setIsLoading(true);
    const res = await axios.get(
      `/Meeting/GetMeetingSatisfaction?meetingId=${meetingId}&employeeId=${empId}`,
    );
    setIsLoading(false);
    return res?.data;
  } catch (_error) {
    setIsLoading(false);
  }
};

export const getMeetingLanding = async (
  empId: null | number | undefined,
  setIsLoading: any,
) => {
  try {
    setIsLoading(true);
    const res = await axios.get(
      `/Meeting/GetMeetingAgendaDashboard?employeeId=${empId}`,
    );
    setIsLoading(false);
    return res?.data;
  } catch (_error) {
    setIsLoading(false);
  }
};

export const getMeetingAgendaDetails = async (
  meetingId: null | number | undefined,
  setIsLoading: any,
) => {
  try {
    setIsLoading(true);
    const res = await axios.get(
      `/Meeting/GetMeetingAgendaDetails?meetingId=${meetingId}`,
    );
    setIsLoading(false);
    return res?.data;
  } catch (_error) {
    setIsLoading(false);
  }
};

export const getMeetingAgendaTopBoard = async (
  empId: null | number | undefined,
  setIsLoading: any,
) => {
  try {
    setIsLoading(true);
    const res = await axios.get(
      `/Meeting/GetMeetingAgendaTopBoard?employeeId=${empId}`,
    );
    setIsLoading(false);
    return res?.data;
  } catch (_error) {
    setIsLoading(false);
  }
};

export const getMeetingTasklist = async (
  meetingId: null | number | undefined,
  empId: null | number | undefined,
  setIsLoading: any,
) => {
  try {
    setIsLoading(true);
    const res = await axios.get(
      `/Meeting/GetAllTaskListDetails?meetingId=${meetingId}&employeeId=${empId}`,
    );

    setIsLoading(false);
    return res?.data;
  } catch (_error) {
    setIsLoading(false);
  }
};

export const createMeetingTask = async (payload: any, setIsLoading: any) => {
  try {
    setIsLoading(true);
    const data = await axios.post(
      '/Meeting/MeetingTasksCreateAndEdit',
      payload,
    );
    setIsLoading(false);
    return data?.data;
  } catch (_error) {
    setIsLoading(false);
  }
};

export const createCheckUncheckTask = async (
  typeId: null | number | undefined,
  id: null | number | undefined,
  status: null | string | undefined,
  pressed: null | boolean | undefined,
  empId: null | number | undefined,
  setIsLoading: any,
) => {
  try {
    setIsLoading(true);
    const data = await axios.post(
      `/Meeting/MeetingTaksToDoStatusUpdate?typeId=${typeId}&id=${id}&status=${status}&isPressed=${pressed}&actionBy=${empId}`,
    );
    setIsLoading(false);
    return data?.data;
  } catch (_error) {
    setIsLoading(false);
  }
};

export const getMeetingStatus = async (
  meetingId: null | number | undefined,
) => {
  try {
    const res = await axios.get(
      `/Meeting/GetMeetingRunningDuration?meetingId=${meetingId}`,
    );
    return res?.data;
  } catch (_error) {}
};

export const getMeetingDiscussion = async (
  meetingId: null | number | undefined,
) => {
  try {
    const res = await axios.get(
      `Meeting/GetMeetingDiscussion?meetingId=${meetingId}`,
    );
    return res?.data;
  } catch (_error) {}
};

export const toDoUpdate = async (
  typeId: null | number | undefined,
  agendaId: null | number | undefined,
  status: null | string | undefined,
  isPressed: null | boolean | undefined,
  empId: null | number | undefined,
) => {
  try {
    const res = await axios.post(
      `/Meeting/MeetingTaksToDoStatusUpdate?typeId=${typeId}&id=${agendaId}&status=${status}&isPressed=${isPressed}&actionBy=${empId}`,
    );
    return res?.data;
  } catch (_error) {}
};

export const createMeetingAttendance = async (
  meetingId: null | number | undefined,
  empId: null | number | undefined,
  lat: string | null | undefined,
  lng: string | null | undefined,
  setIsLoading: any,
) => {
  try {
    setIsLoading(true);
    const data = await axios.post(
      `/Meeting/MeetingAttendeeAttendence?meetingId=${meetingId}&employeeId=${empId}&latitude=${lat}&longitude=${lng}`,
    );
    setIsLoading(false);
    return data?.data;
  } catch (_error) {
    setIsLoading(false);
  }
};

export const createMeetingDiscussion = async (
  payload: any,
  setIsLoading: any,
) => {
  try {
    setIsLoading(true);
    const data = await axios.post('/Meeting/MeetingDiscussionCreate', payload);
    setIsLoading(false);
    return data?.data;
  } catch (_error) {
    setIsLoading(false);
  }
};
export const getMeetingTaskDetails = async (
  meetingId: null | number | undefined,
  taskId: null | number | undefined,
  setIsLoading: any,
) => {
  try {
    setIsLoading(true);
    const res = await axios.get(
      `/Meeting/GetTaskDetailsByTaskId?meetingId=${meetingId}&taskId=${taskId}`,
    );
    setIsLoading(false);
    return res?.data;
  } catch (_error) {
    setIsLoading(false);
  }
};

export const createToDoUrgency = async (payload: any, setIsLoading: any) => {
  try {
    setIsLoading(true);
    const data = await axios.post('/Meeting/EditMeetingToDo', payload);
    setIsLoading(false);
    return data?.data;
  } catch (_error) {
    setIsLoading(false);
  }
};

export const createToDoMaster = async (payload: any, setIsLoading: any) => {
  try {
    setIsLoading(true);
    const data = await axios.post('/Employee/CreateToDo', payload);
    setIsLoading(false);
    return data?.data;
  } catch (_error) {
    setIsLoading(false);
  }
};

export const getToDoMasterJdDDL = async (setIsLoading: any) => {
  try {
    setIsLoading(true);
    const res = await axios.get(
      '/PeopleDeskDDL/PeopleDeskAllDDL?DDLType=JDTypeForToDoCreate&AccountId=1',
    );
    setIsLoading(false);
    return res?.data;
  } catch (_error) {
    setIsLoading(false);
  }
};

export const getToDoMasterProjectDDL = async (setIsLoading: any) => {
  try {
    setIsLoading(true);
    const res = await axios.get(
      '/PeopleDeskDDL/PeopleDeskAllDDL?DDLType=ProjectForToDoCreate&AccountId=1',
    );
    console.log('res========>', JSON.stringify(res, null, 2));
    setIsLoading(false);
    return res?.data;
  } catch (_error) {
    setIsLoading(false);
  }
};

export const deleteEditCompleteToDoMaster = async (
  payload: any,
  setIsLoading: any,
) => {
  try {
    setIsLoading(true);
    const data = await axios.put('/Employee/EditCompleteDeleteToDo', payload);
    setIsLoading(false);
    return data?.data;
  } catch (_error) {
    setIsLoading(false);
  }
};

export const getFollowingMeetingListDDL = async (
  empId: null | number | undefined,
  setIsLoading: any,
) => {
  try {
    setIsLoading(true);
    const res = await axios.get(
      `/Meeting/GetFollowingMeetingList?employeeId=${empId}`,
    );
    setIsLoading(false);
    return res?.data;
  } catch (_error) {
    setIsLoading(false);
  }
};

export const handRiseHandle = async (
  empId: null | number | undefined,
  meetingId: null | number | undefined,
  typeId: null | number | undefined,
  status: null | boolean | undefined,
  id: null | number | undefined,
  setIsLoading: any,
) => {
  try {
    setIsLoading(true);
    const res = await axios.post(
      `/Meeting/CreateHandRaised?employeeId=${empId}&meetingId=${meetingId}&typeId=${typeId}&status=${status}&id=${id}`,
    );
    setIsLoading(false);
    return res?.data;
  } catch (_error) {
    setIsLoading(false);
  }
};

export const meetingAcceptenc = async (
  empId: null | number | undefined,
  meetingId: null | number | undefined,
  acceptance: null | string | undefined,
  declineReason: null | string | undefined,
  reset: null | boolean | undefined,
  setIsLoading: any,
) => {
  try {
    setIsLoading(true);
    const res = await axios.post(
      `/Meeting/CreateMeetingAcceptenceByAttendee?meetingId=${meetingId}&employeeId=${empId}&acceptance=${acceptance}&reason=${declineReason}&isReset=${reset}`,
    );
    setIsLoading(false);
    return res?.data;
  } catch (_error) {
    setIsLoading(false);
  }
};
export const meetingAgendaAcceptenc = async (
  empId: null | number | undefined,
  agendaId: null | number | undefined,
  status: null | string | undefined,
  setIsLoading: any,
) => {
  try {
    setIsLoading(true);
    const res = await axios.post(
      `/Meeting/MeetingTaksToDoStatusUpdate?typeId=3&id=${agendaId}&status=${status}&isPressed=true&actionBy=${empId}`,
    );
    setIsLoading(false);
    return res?.data;
  } catch (_error) {
    setIsLoading(false);
  }
};

export const CreateAndEditMeetingAgenda = async (
  payload: any,
  setIsLoading: any,
  setIsDisabled: any,
) => {
  try {
    setIsLoading(true);
    setIsDisabled(true);
    const res = await axios.post(
      '/Meeting/CreateAndEditMeetingAgenda',
      payload,
    );
    setIsLoading(false);
    setIsDisabled(false);
    return res?.data;
  } catch (_error) {
    setIsDisabled(false);
    setIsLoading(false);
  }
};
