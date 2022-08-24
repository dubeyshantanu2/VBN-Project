import React from 'react'
import { StatusBar, View, Image, Dimensions, SafeAreaView, Button, Text } from 'react-native';
import colors from '../config/colors';


import LongButton from "../components/LongButton";


const { height, width } = Dimensions.get('window');

const OnDoneScreen = ({ navigation, route }) => {
    return (

        <SafeAreaView style={{ flex: 1, backgroundColor: "#fff", justifyContent: "space-between", alignItems: "center", }}>
            <StatusBar backgroundColor={colors.primary} barStyle='light-content' />
            <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
                <Image source={require("../assets/animation/Done.gif")} style={{ width: 300, height: 300 }} />
            </View>
            <View style={{ marginBottom: "4%", marginLeft: "8%", width: "100%" }}>
                {route.params ?
                    <LongButton text={"Done"} onPress={() => navigation.navigate("ProfileScreen", { id: route.params.id })} /> :
                    <LongButton text={"Done"} onPress={() => navigation.navigate("PostScreen")} />
                }
            </View>
        </SafeAreaView>
    )
}

export default OnDoneScreen;
