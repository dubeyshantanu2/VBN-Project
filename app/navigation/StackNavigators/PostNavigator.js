import React from 'react';
import { StatusBar, Image, Dimensions, SafeAreaView, Button, View } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer, CommonActions } from '@react-navigation/native';
import PostScreen from '../../screens/PostScreen';
import AddVisitorScreen from "../../screens/AddVisitorScreen";
import CreateLeadScreen from "../../screens/Lead/CreateLeadScreen";
import GiveScreen from "../../screens/Give/GiveScreen";
import GiveSummary from "../../screens/Give/GiveSummary";
import ThankyouScreen from "../../screens/ThankyouScreen";
import AskScreen from "../../screens/AskScreen";
import ThankyouRecievedScreen from "../../screens/ThankyouRecievedScreen";
import AddLead from "../../screens/Lead/AddLead";
import OnDoneScreen from "../../screens/OnDoneScreen";

import colors from '../../config/colors';
import { Ionicons } from '@expo/vector-icons';

import SplashScreen from "../../screens/SplashScreen";

const Stack = createNativeStackNavigator();
const { height, width } = Dimensions.get('window');

const PostNavigator = ({ navigation }) => {


    let fontSize = height * 0.025;
    let paddingHorizontal = 10;

    return (
        <Stack.Navigator
            screenOptions={{
                headerStyle: { backgroundColor: colors.primary },
                headerTintColor: colors.white,
                headerTitleAlign: 'center',
                headerTitleStyle: {
                    fontFamily: 'SemiBold', fontSize: height * 0.022, paddingHorizontal, left: -10
                },
                headerShadowVisible: false, // applied here
                headerBackTitleVisible: false,
            }}
            initialRouteName="PostScreen"
        >
            <Stack.Screen
                name="PostScreen"
                component={PostScreen}
                options={{
                    title: "",
                    // headerRight: () => (
                    //     <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                    //         {/* <Ionicons name="search" size={25} color={colors.white} style={{}} onPress={() => navigation.navigate("SearchScreen")} /> */}
                    //         <Ionicons name="menu" size={28} color={colors.white} style={{ marginLeft: 20 }} onPress={() => navigation.openDrawer()} />
                    //     </View>
                    // ),
                }} />

            <Stack.Screen
                name="CreateLeadScreen"
                component={CreateLeadScreen}
                options={{
                    title: "Create Leads",
                    headerStyle: {
                        backgroundColor: colors.primary,
                    },
                    headerTintColor: colors.white,
                    // headerRight: () => (
                    //     <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                    //         {/* <Ionicons name="search" size={25} color={colors.white} style={{}} onPress={() => navigation.navigate("SearchScreen")} /> */}
                    //         <Ionicons name="menu" size={28} color={colors.white} style={{ marginLeft: 20 }} onPress={() => navigation.openDrawer()} />
                    //     </View>
                    // ),
                }} />

            <Stack.Screen
                name="AddVisitorScreen"
                component={AddVisitorScreen}
                options={{
                    title: "Add Visitors",
                    headerStyle: {
                        backgroundColor: colors.primary,
                    },
                    headerTintColor: colors.white,
                    // headerRight: () => (
                    //     <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                    //         {/* <Ionicons name="search" size={25} color={colors.white} style={{}} onPress={() => navigation.navigate("SearchScreen")} /> */}
                    //         <Ionicons name="menu" size={28} color={colors.white} style={{ marginLeft: 20 }} onPress={() => navigation.openDrawer()} />
                    //     </View>
                    // ),
                }} />

            {/* <Stack.Screen
                    name="AskScreen"
                    component={AskScreen}
                    options={{
                        title: "Asks / Gives",
                        headerRight: () => (
                            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                                <Ionicons name="search" size={25} color={colors.white} style={{}} onPress={() => navigation.navigate("SearchScreen")} />
                                <Ionicons name="menu" size={28} color={colors.white} style={{ marginLeft: 20 }} onPress={() => navigation.openDrawer()} />
                            </View>
                        ),
                    }} /> */}

            <Stack.Screen
                name="GiveScreen"
                component={GiveScreen}
                options={{
                    title: "Asks / Gives",
                    headerStyle: {
                        backgroundColor: colors.primary,
                    },
                    headerTintColor: colors.white,
                    // headerRight: () => (
                    //     <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                    //         {/* <Ionicons name="search" size={25} color={colors.white} style={{}} onPress={() => navigation.navigate("SearchScreen")} /> */}
                    //         <Ionicons name="menu" size={28} color={colors.white} style={{ marginLeft: 20 }} onPress={() => navigation.openDrawer()} />
                    //     </View>
                    // ),
                }} />
            <Stack.Screen
                name="GiveSummary"
                component={GiveSummary}
                options={{
                    title: "Give",
                    headerStyle: {
                        backgroundColor: colors.primary,
                    },
                    headerTintColor: colors.white,
                    // headerRight: () => (
                    //     <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                    //         {/* <Ionicons name="search" size={25} color={colors.white} style={{}} onPress={() => navigation.navigate("SearchScreen")} /> */}
                    //         <Ionicons name="menu" size={28} color={colors.white} style={{ marginLeft: 20 }} onPress={() => navigation.openDrawer()} />
                    //     </View>
                    // ),
                }} />

            <Stack.Screen
                name="ThankyouScreen"
                component={ThankyouScreen}
                options={{
                    title: "Create Thank You Note",

                    headerStyle: {
                        backgroundColor: colors.primary,
                    },
                    headerTintColor: colors.white,
                }} />
            <Stack.Screen
                name="ThankyouRecievedScreen"
                component={ThankyouRecievedScreen}
                options={{
                    title: "Thank You Note Received",
                    headerStyle: {
                        backgroundColor: colors.primary,
                    },
                    headerTintColor: colors.white,
                }} />

            <Stack.Screen
                name="AddLead"
                component={AddLead}
                options={{
                    title: "Create Lead",
                    headerStyle: {
                        backgroundColor: colors.primary,
                    },
                    headerTintColor: colors.white,
                }} />

            <Stack.Screen
                name="OnDoneScreen"
                component={OnDoneScreen}
                options={{
                    title: "",

                    headerStyle: {
                        backgroundColor: colors.primary,
                    },
                    headerTintColor: colors.primary,
                }}
            />


        </Stack.Navigator>
    )
}

export default PostNavigator;