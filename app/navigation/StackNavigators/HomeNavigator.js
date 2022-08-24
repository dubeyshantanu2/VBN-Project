import React from 'react';
import { StatusBar, Image, Dimensions, SafeAreaView, Button, View } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer, CommonActions } from '@react-navigation/native';

import HomeScreen from '../../screens/HomeScreen';
// import SearchScreen from "../../screens/SearchScreen";
import ViewAll from '../../screens/ViewAll';
import colors from '../../config/colors';
import { Ionicons } from '@expo/vector-icons';
import ProfileScreen from "../../screens/ProfileScreen";
import LeadDetailScreen from '../../screens/LeadDetailScreen';
import LeadReceived from '../../screens/LeadReceived';
import LeadDetailScreenOld from '../../screens/LeadDetailScreenOld';
import ThankyouDetailScreen from '../../screens/ThankyouDetailScreen';
import VisitorDetailScreen from "../../screens/VisitorDetailScreen";
import AskGiveDetailScreen from '../../screens/AskGiveDetailScreen';
import ViewDetails from '../../screens/ViewDetails';
import MeetingDetailScreen from '../../screens/MeetingDetailScreen';
import CreateLeadScreen from "../../screens/Lead/CreateLeadScreen";
import AddLead from "../../screens/Lead/AddLead";
import OnDoneScreen from "../../screens/OnDoneScreen";
import PostScreen from '../../screens/PostScreen';
import ThankyouScreen from "../../screens/ThankyouScreen";
import TopTabNavigator from "../TopTabNavigator";

const Stack = createNativeStackNavigator();
const { height, width } = Dimensions.get('window');
const HomeNavigator = ({ navigation }) => {
    let fontSize = height * 0.025;
    let paddingHorizontal = 10;
    return (
        <Stack.Navigator
            screenOptions={{
                headerStyle: {
                    backgroundColor: colors.primary,
                },
                headerTitleAlign: 'center',
                headerShadowVisible: false, // applied here
                headerBackTitleVisible: false,
                headerTintColor: colors.white,
                headerTitleStyle: {
                    fontFamily: 'SemiBold', fontSize, paddingHorizontal
                },
                cardStyle: { opacity: 1 }
            }}
            initialRouteName="HomeScreen"
        >
            <Stack.Screen
                name="HomeScreen"
                component={HomeScreen}
                options={{
                    title: "VBN",
                    //Commented Global Search as per shyam statement 0n 12-05-2022
                    // headerRight: () => (
                    //     <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                    //         <Ionicons name="search" size={25} color={colors.white} style={{}} onPress={() => navigation.navigate("SearchScreen")} />
                    //         {/* <Ionicons name="menu" size={28} color={colors.white} style={{ marginLeft: 20 }} onPress={() => navigation.openDrawer()} /> */}
                    //     </View>
                    // ),
                }} />
            <Stack.Screen
                name="ViewAll"
                component={ViewAll}
                options={{
                    title: "View More",
                }} />
            {/* <Stack.Screen
                name="SearchScreen"
                component={SearchScreen}
                options={{
                    title: "Search",
                    headerLeft: () => (
                        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                            <Ionicons name="chevron-back" size={25} color={colors.white} style={{ marginRight: 20 }} onPress={() => navigation.dispatch(CommonActions.goBack())} />
                        </View>
                    ),
                }} /> */}
            <Stack.Screen
                name="ProfileScreen"
                component={ProfileScreen}
                options={{
                    title: "Members Profile",
                }} />
            <Stack.Screen
                name="LeadDetailScreen"
                component={TopTabNavigator}
                options={{
                    title: "Details",
                    // headerLeft: () => (
                    //     <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                    //         <Ionicons name="chevron-back" size={25} color={colors.white} style={{ marginRight: 20 }} onPress={() => navigation.dispatch(CommonActions.goBack())} />
                    //     </View>
                    // ),
                }} />
            <Stack.Screen
                name="LeadReceived"
                component={LeadReceived}
                options={{
                    title: "Details",
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
                    headerLeft: () => (
                        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                            <Ionicons name="chevron-back" size={25} color={colors.white} style={{ marginRight: 20 }} onPress={() => navigation.dispatch(CommonActions.goBack())} />
                        </View>
                    ),
                }} />
            <Stack.Screen
                name="AskGiveDetailScreen"
                component={AskGiveDetailScreen}
                options={{
                    title: "Details",
                }} />
            <Stack.Screen
                name="VisitorDetailScreen"
                component={VisitorDetailScreen}
                options={{
                    title: "Details",
                    headerStyle: {
                        backgroundColor: colors.primary,
                    },
                    headerTintColor: colors.white,
                }} />
            <Stack.Screen
                name="ViewDetails"
                component={ViewDetails}
                options={{
                    title: "Meetings",
                    headerStyle: {
                        backgroundColor: colors.primary,
                    },
                    headerTintColor: colors.white,
                }} />
            <Stack.Screen
                name="MeetingDetailScreen"
                component={MeetingDetailScreen}
                options={{
                    title: "",
                    headerStyle: {
                        backgroundColor: colors.primary,
                    },
                    headerTintColor: colors.white,
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
                name="ThankyouScreen"
                component={ThankyouScreen}
                options={{
                    title: "Create Thank You Note",

                    headerStyle: {
                        backgroundColor: colors.primary,
                    },
                    headerTintColor: colors.white,
                }} />

        </Stack.Navigator>
    )
}
export default HomeNavigator;