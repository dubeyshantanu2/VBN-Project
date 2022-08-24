import React from 'react';
import { StatusBar, Image, Dimensions, SafeAreaView, Button, View } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer, CommonActions } from '@react-navigation/native';
import ChatScreen from '../../screens/ChatScreen';

import colors from '../../config/colors';
import { Ionicons } from '@expo/vector-icons';


const Stack = createNativeStackNavigator();
const { height, width } = Dimensions.get('window');

const ChatNavigator = ({ navigation }) => {


    let fontSize = height * 0.025;
    let paddingHorizontal = 10;

    return (
        <Stack.Navigator
            screenOptions={{
                headerStyle: { backgroundColor: colors.primary },
                headerTintColor: colors.white,
                headerTitleStyle: {
                    fontFamily: 'SemiBold', fontSize, paddingHorizontal
                },
                headerShadowVisible: false, // applied here
                headerBackTitleVisible: false,
            }}
            initialRouteName="ChatScreen"
        >
            <Stack.Screen
                name="ChatScreen"
                component={ChatScreen}
                options={{
                    title: "VBN",
                    headerRight: () => (
                        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                            {/* <Ionicons name="search" size={25} color={colors.white} style={{}} onPress={() => navigation.navigate("SearchScreen")} /> */}
                            <Ionicons name="menu" size={28} color={colors.white} style={{ marginLeft: 20 }} onPress={() => navigation.openDrawer()} />
                        </View>
                    ),
                }} />

        </Stack.Navigator>
    )
}

export default ChatNavigator;