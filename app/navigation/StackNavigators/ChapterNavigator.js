import React from 'react';
import { StatusBar, Image, Dimensions, SafeAreaView, Button, View } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer, CommonActions } from '@react-navigation/native';
import ChapterScreen from '../../screens/ChapterScreen';
import MembersListScreen from '../../screens/MembersListScreen';
import SplashScreen from "../../screens/SplashScreen";
import ProfileScreen from "../../screens/ProfileScreen";

import colors from '../../config/colors';
import { Ionicons } from '@expo/vector-icons';

const Stack = createNativeStackNavigator();
const { height, width } = Dimensions.get('window');

const ChapterNavigator = ({ navigation }) => {




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
                // headerForceInset: { top: 'never', bottom: 'never' },
            }}
            initialRouteName="MembersListScreen"
        >
            <Stack.Screen
                name="ChapterScreen"
                component={ChapterScreen}
                options={{
                    title: "Chapters",
                    headerRight: () => (
                        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                            {/* <Ionicons name="search" size={25} color={colors.white} style={{}} onPress={() => navigation.navigate("SearchScreen")} /> */}
                            <Ionicons name="menu" size={28} color={colors.white} style={{ marginLeft: 20 }} onPress={() => navigation.openDrawer()} />
                        </View>
                    ),
                }} />
            <Stack.Screen
                name="MembersListScreen"
                component={MembersListScreen}
                options={{
                    title: "Members",
                    // headerRight: () => (
                    //     <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>

                    //         <Ionicons name="menu" size={28} color={colors.white} style={{ marginLeft: 20 }} onPress={() => navigation.openDrawer()} />
                    //     </View>
                    // ),
                }} />

            <Stack.Screen
                name="ProfileScreen"
                component={ProfileScreen}
                options={{
                    title: "Members Profile",
                    // headerRight: () => (
                    //     <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>

                    //         <Ionicons name="menu" size={28} color={colors.white} style={{ marginLeft: 20 }} onPress={() => navigation.openDrawer()} />
                    //     </View>
                    // ),
                }} />

        </Stack.Navigator>
    )
}

export default ChapterNavigator;