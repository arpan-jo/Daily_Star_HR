import {HubConnectionBuilder, LogLevel} from '@microsoft/signalr';
import useAsyncEffect from '../common/packages/useAsyncEffect/useAsyncEffect';

export const useSignalRNotification = (
  userInfo: any,
  isFocused: boolean,
  setNorificationCounter: (cb: (prev: number) => number) => void,
  importantApiCall?: () => void,
) => {
  const appName = `sendTo_people_desk_saas_${userInfo?.intAccountId}_${userInfo?.intEmployeeId}`;
  useAsyncEffect(
    async isMounted => {
      if (!isMounted()) return null;

      const connection = new HubConnectionBuilder()
        .withUrl('https://signal.peopledesk.io/NotificationHub')
        .withAutomaticReconnect()
        .configureLogging(LogLevel.None)
        .build();

      if (connection) {
        connection
          .start()
          .then(() => {
            connection.on(appName, (count: number) => {
              setNorificationCounter(prev => prev + count);
            });
          })
          .catch((error: any) => {
            console.log('SignalR connection error:', error);
          });
      }

      if (importantApiCall) {
        importantApiCall();
      }
    },
    [isFocused],
  );
};
