import notifee, {
    AndroidColor,
    AndroidImportance,
    EventType,
} from '@notifee/react-native';
import messaging from '@react-native-firebase/messaging';
import { AppRegistry, Platform } from 'react-native';
import { enableScreens } from 'react-native-screens';
import App from './App';
import { name as appName } from './app.json';
import navigationServices from './src/services/SaaS-modules/notification/navigationServices';

enableScreens()

messaging().setBackgroundMessageHandler(async remoteMessage => {
    await onDisplayNotification(remoteMessage);
});

async function onDisplayNotification(data) {
    await notifee.incrementBadgeCount();
    // Create a channel (required for Android)
    const channelId = await notifee.createChannel({
        id: `${data?.data?.channelId}`,
        name: `${data?.data?.name}`,
        sound: data?.data?.sound,
        badge: true,
        vibration: true,
        vibrationPattern: [300, 500],
        lights: true,
        lightColor: AndroidColor.RED,
        importance: AndroidImportance.HIGH,
    });

    if (Platform.OS === 'ios') {
        // Display a notification
        await notifee.displayNotification({
            title: data?.data?.title,
            body: data?.data?.body,
            data: {
                data,
            },
            ios: {
                // badgeCount: 1,
                sound: data?.data?.soundIOS,
                foregroundPresentationOptions: {
                    badge: true,
                    sound: true,
                },
            },
        });
    }
    if (Platform.OS === 'android') {
        // Display a notification
        await notifee.displayNotification({
            title: data?.data?.title,
            body: data?.data?.body,
            data: {
                data,
            },
            android: {
                channelId,
                smallIcon: 'ic_notification',
                vibrationPattern: [300, 500],
                pressAction: {
                    id: 'default',
                },
            },
        });
    }
}

notifee.onBackgroundEvent(async ({ type, detail }) => {
    const { notification, pressAction } = detail;
    const data = notification?.data?.data?.data;
    // Check if the user pressed the "Mark as read" action
    if (Platform.OS === 'ios') {
        if (type === EventType.ACTION_PRESS && pressAction.id === 'mark-as-read') {
            // Decrement the count by 1
            await notifee.decrementBadgeCount();

            // Remove the notification
            await notifee.cancelNotification(notification.id);

            const screenMappings = {
                Default: 'NotificationIndex',
                Leave: 'LeaveNewApprovalDetails',
                Movement: 'MovementNewApprovalDetails',
                FoodCorner: 'CafeteriaManageIndex',
            };
            if (data?.routeName && screenMappings[data?.routeName?.trim()]) {
                setTimeout(() => {
                    navigationServices.navigate(screenMappings[data?.routeName?.trim()], {
                        leaveDetails: data,
                    });
                }, 1500);
            }
        }
    } else {
        if (type === EventType.PRESS) {
            const screenMappings = {
                Default: 'NotificationIndex',
                Leave: 'LeaveNewApprovalDetails',
                Movement: 'MovementNewApprovalDetails',
                FoodCorner: 'CafeteriaManageIndex',
            };
            if (data?.routeName && screenMappings[data?.routeName?.trim()]) {
                setTimeout(() => {
                    navigationServices.navigate(screenMappings[data?.routeName?.trim()], {
                        leaveDetails: data,
                    });
                }, 1500);
            }
        }
    }
});

AppRegistry.registerComponent(appName, () => App);
