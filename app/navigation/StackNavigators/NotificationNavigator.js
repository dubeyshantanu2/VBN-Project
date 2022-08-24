import React from 'react';
import { StatusBar, Image, Dimensions, SafeAreaView, Button, View } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer, CommonActions } from '@react-navigation/native';
import NotificationScreen from '../../screens/NotificationScreen';
import LeadDetailScreen from '../../screens/LeadDetailScreen';
import ThankyouDetailScreen from '../../screens/ThankyouDetailScreen';
import TopTabNavigator from '../TopTabNavigator';
import colors from '../../config/colors';
import { Ionicons } from '@expo/vector-icons';
import LeadReceived from '../../screens/LeadReceived';

const Stack = createNativeStackNavigator();
const { height, width } = Dimensions.get('window');

const NatificationNavigator = ({ navigation }) => {


    let fontSize = height * 0.025;
    let paddingHorizontal = 10;


    return (
        <Stack.Navigator
            screenOptions={{
                headerStyle: { backgroundColor: colors.primary },
                headerTintColor: colors.white,
                headerTitleAlign: 'center',
                headerTitleStyle: {
                    fontFamily: 'SemiBold', fontSize, paddingHorizontal
                },
                headerShadowVisible: false, // applied here
                headerBackTitleVisible: false,
            }}
            initialRouteName="NotificationScreen"
        >
            <Stack.Screen
                name="NotificationScreen"
                component={NotificationScreen}
                options={{
                    title: "VBN",
                    // headerRight: () => (
                    //     <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                    //         <Ionicons name="menu" size={28} color={colors.white} style={{ marginLeft: 20 }} onPress={() => navigation.openDrawer()} />
                    //     </View>
                    // ),
                }} />

            <Stack.Screen
                name="TopTabNavigator"
                component={TopTabNavigator}
                options={{
                    title: "Details",
                }} />
            <Stack.Screen
                name="ThankyouDetailScreen"
                component={ThankyouDetailScreen}
                options={{
                    title: "Details",
                }} />

        </Stack.Navigator>
    )
}

export default NatificationNavigator;