import React from 'react'
import { StatusBar, Image, Dimensions, SafeAreaView } from 'react-native';

const { height, width } = Dimensions.get('window');

const SplashScreen = () => {

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar backgroundColor="#fff" barStyle='dark-content' />
      <Image source={require("../assets/images/spinner.gif")} style={{ height: height, width: width, resizeMode: 'center', top: -50 }} />
    </SafeAreaView>
  )
}

export default SplashScreen;
