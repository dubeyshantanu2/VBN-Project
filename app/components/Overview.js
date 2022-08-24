import { StyleSheet, TouchableOpacity, Dimensions, View, Text, Image } from 'react-native'
import React from 'react'
import colors from '../config/colors';
import { Ionicons } from '@expo/vector-icons';
const { height, width } = Dimensions.get('window');

function Overview({ onPress, title, leadGiven, leadRecieved, increment, decrement }) {
    return (
        <View style={{ width: "47%", justifyContent: "space-between", alignItems: "center", borderRadius: 4, borderWidth: 1.5, borderColor: colors.grey, backgroundColor: "#f9f8f8" }}>
            <View style={{ flexDirection: "row", alignItems: "center", width: "100%", justifyContent: "space-between", marginTop: "4%" }}>
                <Text style={{ marginLeft: "4%", marginTop: "2%", fontSize: height * 0.013, color: colors.primary, fontFamily: "Bold" }}>{title}</Text>
                <Ionicons name={"chevron-forward-outline"} size={height * 0.02} style={{ marginRight: "4%" }} color={colors.primary} />
            </View>
            <View style={{ flexDirection: "row", width: "100%", justifyContent: "space-between", alignItems: "center", }}>
                <View style={{ width: "50%", height: "100%", alignItems: "center" }}>
                    <Text style={{ fontSize: height * 0.015, fontFamily: "SemiBold" }}>Given</Text>
                    <Text style={{ fontSize: height * 0.022, fontFamily: "Bold", marginTop: "5%" }}>{leadGiven}</Text>
                    <View style={{ flexDirection: "row", alignItems: "center", marginTop: "2%" }}>
                        <Ionicons name={"caret-up-outline"} size={height * 0.02} style={{ marginRight: "4%" }} color={"green"} />
                        <Text style={{ fontFamily: "Regular", color: "green", fontSize: height * 0.015 }}>{increment}</Text>
                    </View>
                </View>
                <View style={{ width: "50%", height: "100%", alignItems: "center" }}>
                    <Text style={{ fontSize: height * 0.015, fontFamily: "SemiBold" }}>Received</Text>
                    <Text style={{ fontSize: height * 0.022, fontFamily: "Bold", marginTop: "5%" }}>{leadRecieved}</Text>
                    <View style={{ flexDirection: "row", alignItems: "center", marginTop: "2%" }}>
                        <Ionicons name={"caret-down-outline"} size={height * 0.02} style={{ marginRight: "4%" }} color={"red"} />
                        <Text style={{ fontFamily: "Regular", color: "red", fontSize: height * 0.015 }}>{decrement}</Text>
                    </View>
                </View>
            </View>
            <Image source={require("../assets/images/Path3.png")} style={{ width: "100%", resizeMode: "stretch" }} />
        </View>
    )
}

const styles = StyleSheet.create({
    button: {
        backgroundColor: colors.white,
        borderRadius: 5,
        justifyContent: "center",
        alignItems: "center",
        padding: 12,
        width: "45%",
        borderWidth: 1
    },
    text: {
        color: colors.black,
        fontSize: height * 0.017,
        fontFamily: "SemiBold",
    }
})

export default Overview;