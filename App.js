import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { ActivityIndicator, View } from "react-native";
import navigationTheme from './app/navigation/navigationTheme';
import { navigationRef } from "./app/navigation/rootNavigation";
import { Provider, useDispatch, useSelector } from 'react-redux';
import { Init } from './app/store/actions';
import { store } from './app/store';
import AppNavigator from './app/navigation/AppNavigator';
import AuthNavigator from './app/navigation/AuthNavigator';
import { MenuProvider } from 'react-native-popup-menu';
// import { useFonts } from "@use-expo/font";
import { useFonts } from 'expo-font';
// import { AppLoading } from "expo";
import ErrorBoundary from 'react-native-error-boundary'
import { useNavigation } from '@react-navigation/native';
import navigation from "./app/navigation/rootNavigation";
import * as Notifications from 'expo-notifications';
import * as Sentry from 'sentry-expo';
import colors from './app/config/colors';

Sentry.init({
  dsn: 'https://a14cad5c082d4a94873a293ea5d7848d@o1281786.ingest.sentry.io/6488453',
  enableInExpoDevelopment: true,
  debug: true, // If `true`, Sentry will try to print out useful debugging information if something goes wrong with sending the event. Set it to `false` in production
});


const RootNavigation = () => {
  const token = useSelector(state => state.AuthReducers.accessToken);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const timerRef = React.useRef(null);
  const init = async () => {
    await dispatch(Init());
    setLoading(false);
  }

  useEffect(() => {
    timerRef.current = setTimeout(() => {
      init()
    }, 0);
    return () => clearTimeout(timerRef.current);
  }, [])

  const [loaded] = useFonts({
    SemiBold: require("./app/assets/fonts/Mulish-SemiBold.ttf"),
    Regular: require("./app/assets/fonts/Mulish-Regular.ttf"),
    Bold: require("./app/assets/fonts/Mulish-Bold.ttf"),
    Medium: require("./app/assets/fonts/Mulish-Medium.ttf"),
    Light: require("./app/assets/fonts/Mulish-Light.ttf"),
    ExtraBold: require("./app/assets/fonts/Mulish-ExtraBold.ttf"),
  });

  // const [isLoaded] = useFonts(customFonts);

  // if (!loaded) {
  if (!loaded) {
    return null;
  }

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    )
  }
  // }

  return (
    <NavigationContainer theme={navigationTheme} ref={navigationRef}>
      {
        token === null ?
          <AuthNavigator /> : <AppNavigator />
      }
    </NavigationContainer>
  )
}

const CustomFallback = (props: { error: Error, resetError: Function }) => (
  <View>
    <Text>Something happened!</Text>
    <Text>{props.error.toString()}</Text>
    <Button onPress={props.resetError} title={'Try again'} />
  </View>
)


function App() {
  // const navigation = useNavigation();
  const notificationListener = React.useRef();
  const responseListener = React.useRef();

  useEffect(() => {
    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log("addNotificationResponseReceivedListener", response);
      navigation.navigate('NotificationScreen')
    });

    return () => {
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  return (
    // <ErrorBoundary FallbackComponent={CustomFallback}>
    <Provider store={store}>
      <MenuProvider customStyles={{ backdrop: 0 }}>
        <RootNavigation />
      </MenuProvider>
    </Provider>
    // </ErrorBoundary>
  )
}

export default App;
