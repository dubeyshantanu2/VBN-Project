import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar, Image, Dimensions, SafeAreaView, Button } from 'react-native';

import HomeNavigator from "./StackNavigators/HomeNavigator";
import ChapterNavigator from "./StackNavigators/ChapterNavigator";
import PostNavigator from "./StackNavigators/PostNavigator";
import NotificationNavigator from "./StackNavigators/NotificationNavigator";
import ProfileNavigator from "./StackNavigators/ProfileNavigator";

import colors from '../config/colors';
import { Ionicons } from '@expo/vector-icons';
import NewPostButton from './NewPostButton';

const { height, width } = Dimensions.get('window');
const Tab = createBottomTabNavigator();

const AppNavigator = () => {

    return (
        <Tab.Navigator
            screenOptions={{
                tabBarStyle: [{
                    borderTopLeftRadius: 20,
                    borderTopRightRadius: 20,
                }],
                headerShown: false,
                tabBarActiveBackgroundColor: colors.white,
                tabBarActiveTintColor: colors.primary,
                tabBarInactiveTintColor: colors.inactiveTab,
                tabBarHideOnKeyboard: true
            }}
        >

            <Tab.Screen name="HomeTab" component={HomeNavigator}
                options={{
                    tabBarLabel: 'Home',
                    tabBarIcon: ({ size, color }) => (
                        <Ionicons name="home" size={size} color={color} />
                    ),
                }}
            />

            <Tab.Screen name="Chapter" component={ChapterNavigator}
                options={{
                    tabBarLabel: 'Members',
                    tabBarIcon: ({ size, color }) => (
                        <Ionicons name="people" size={size} color={color} />
                    ),
                }}
            />


            <Tab.Screen name="Post" component={PostNavigator}
                options={{
                    tabBarLabel: '',
                    tabBarIcon: ({ size, color }) => (
                        <Ionicons name="add-circle" size={30} color={color} style={{ marginTop: "7%" }} />
                    ),
                }} />


            <Tab.Screen name="Notification" component={NotificationNavigator}
                options={{
                    tabBarLabel: 'Notifications',
                    tabBarIcon: ({ size, color }) => (
                        <Ionicons name="notifications" size={size} color={color} />
                    ),
                    unmountOnBlur: true
                }} />

            <Tab.Screen name="Profile" component={ProfileNavigator}
                options={{
                    tabBarLabel: 'Profile',
                    tabBarIcon: ({ size, color }) => (
                        <Ionicons name="person-sharp" size={size} color={color} />
                    ),
                }} />

        </Tab.Navigator>
    )
}

export default AppNavigator;
