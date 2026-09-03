/* eslint-disable prettier/prettier */
import {NavigationAction} from '@react-navigation/native';

let _navigator: any;

function setTopLevelNavigator(navigatorRef: any) {
  _navigator = navigatorRef;
}

function navigate(routeName: any, params?: any) {
  _navigator.navigate(routeName, params);
}

function goBack() {
  _navigator.dispatch(NavigationAction.back());
}

export default {
  navigate,
  setTopLevelNavigator,
  goBack,
};
