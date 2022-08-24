import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from '../screens/LoginScreen';
import VerificationScreen from '../screens/VerificationScreen';
import TermsAndCondition from '../screens/TermsAndCondition';
import PrivacyPolicy from '../screens/PrivacyPolicy';

const Stack = createNativeStackNavigator();

const AuthNavigator = () => {
    return (
        <Stack.Navigator screenOptions={{
            headerShown: true,
            headerShadowVisible: false, // applied here
            headerBackTitleVisible: false,
        }}>
            <Stack.Screen name="Login" component={LoginScreen} options={{
                headerShown: false
            }} />
            <Stack.Screen name="Verification" component={VerificationScreen} options={{ headerTitle: " " }} />
            <Stack.Screen name="TermsAndCondition" component={TermsAndCondition} options={{ headerTitle: "Terms & Conditions" }} />
            <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicy} options={{ headerTitle: "Privacy Policy" }} />
        </Stack.Navigator>
    )
}

export default AuthNavigator;