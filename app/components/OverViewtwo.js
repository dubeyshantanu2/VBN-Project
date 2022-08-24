import { StyleSheet, TouchableOpacity, Dimensions, View, Text, Image } from 'react-native'
import React from 'react'
import colors from '../config/colors';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
const { height, width } = Dimensions.get('window');

function OverViewtwo({ onPress, title, leadGiven, leadRecieved, increment, decrement, incrementRec, decrementRec, text1, text2, name, selector, selectedDate, fromDate, toDate }) {
    const navigation = useNavigation();
    function abbreviate_number(num) {
        if (num >= 10000000) {
            return (num / 10000000).toFixed(1).replace(/\.0$/, '') + 'Cr';
        }
        if (num >= 100000) {
            return (num / 100000).toFixed(1).replace(/\.0$/, '') + 'L';
        }
        if (num >= 1000) {
            return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
        }
        if (num < 0) {
            if (num.toString().length === 4) return num;
            if (num.toString().length === 5 || num.toString().length === 6) return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
            if (num.toString().length === 7 || num.toString().length === 8) return (num / 100000).toFixed(1).replace(/\.0$/, '') + 'L';
            if (num.toString().length >= 9) return (num / 10000000).toFixed(1).replace(/\.0$/, '') + 'Cr';
        }
        return num;
    }
    if (text1)
        var renderPage = text1 == "My Visitors" ? "VisitorDetailScreen" : "AskGiveDetailScreen"
    else
        var renderPage = title == "LEADS" ? "LeadDetailScreen" : "ThankyouDetailScreen"
    return (
        <TouchableOpacity
            onPress={() => navigation.navigate(renderPage, {
                name: name,
                selector: selector,
                selectedDate: selectedDate,
                fromDate: fromDate,
                toDate: toDate,
            })}
            style={{ width: "47%", alignItems: "center", borderRadius: 4, borderWidth: 0.75, borderColor: colors.grey, backgroundColor: "#f9f8f8", padding: 5 }}>

            <View style={{ flexDirection: "row", alignItems: "center", width: "100%", justifyContent: "space-between" }}>
                <Text style={{ marginLeft: "4%", fontSize: height * 0.013, color: colors.black, fontFamily: "Bold" }}>{title}</Text>
                <Ionicons name={"chevron-forward-outline"} size={height * 0.02} style={{ marginRight: "2%" }} color={colors.darkgrey} />
            </View>

            <View style={{ flexDirection: "row", width: "100%", justifyContent: "space-around", paddingVertical: "4%" }}>
                <View style={{ alignItems: "center" }}>
                    {text2 != undefined ?
                        <Text style={{ fontSize: height * 0.013, fontFamily: "SemiBold" }}>{text2}</Text> :
                        <Text style={{ fontSize: height * 0.015, fontFamily: "SemiBold" }}>Received</Text>
                    }
                    <Text style={{
                        fontSize: height * 0.022, fontFamily: "Bold", marginTop: "5%"
                    }}>{title == "THANK YOU NOTES" ? abbreviate_number(leadRecieved) : leadRecieved}</Text>
                    {selector === 'thisfortnight' ?
                        <View style={{ flexDirection: "row", marginTop: "5%", alignItems: "center", justifyContent: "center", width: 50 }}>
                            {
                                (incrementRec != undefined && incrementRec != 0) ?
                                    <Ionicons name={"caret-up-outline"} size={height * 0.02} style={{}} color={"green"} /> :
                                    (decrementRec != undefined && decrementRec != 0) ?
                                        <Ionicons name={"caret-down-outline"} size={height * 0.02} style={{}} color={"red"} /> :
                                        <Image source={require("../assets/images/rect.png")} style={{ width: 10, height: 10, marginRight: "4%" }} />
                            }
                            {(incrementRec != undefined && incrementRec != 0) ?
                                <Text style={{ fontFamily: "Regular", color: "green", fontSize: height * 0.013 }}>{title == "THANK YOU NOTES" ? abbreviate_number(incrementRec) : incrementRec}</Text> :
                                (decrementRec != undefined && decrementRec != 0) ?
                                    <Text style={{ fontFamily: "Regular", color: "red", fontSize: height * 0.013 }}>{title == "THANK YOU NOTES" ? abbreviate_number(decrementRec) : decrementRec}</Text> :
                                    (incrementRec != undefined && incrementRec == 0) ?
                                        <Text style={{ fontFamily: "Regular", color: "orange", fontSize: height * 0.013 }}>{title == "THANK YOU NOTES" ? abbreviate_number(incrementRec) : incrementRec}</Text> :
                                        <Text style={{ fontFamily: "Regular", color: "orange", fontSize: height * 0.013 }}>{title == "THANK YOU NOTES" ? abbreviate_number(decrementRec) : decrementRec}</Text>
                            }
                        </View> :
                        <View>
                            <Text style={{ fontSize: height * 0.02, marginTop: "8%" }}></Text>
                        </View>
                    }
                </View>
                <View style={{ alignItems: "center" }}>
                    {text1 != undefined ?
                        <Text style={{ fontSize: height * 0.013, fontFamily: "SemiBold" }}>{text1}</Text> :
                        <Text style={{ fontSize: height * 0.015, fontFamily: "SemiBold" }}>Given</Text>
                    }
                    <Text style={{ fontSize: height * 0.022, fontFamily: "Bold", marginLeft: "8%", marginTop: "5%" }}>{title == "THANK YOU NOTES" ? abbreviate_number(leadGiven) : leadGiven}</Text>
                    {selector === 'thisfortnight' ?
                        <View style={{ flexDirection: "row", marginTop: "5%", alignItems: "center", justifyContent: "center", width: 50 }}>
                            {
                                (increment != undefined && increment != 0) ?
                                    <Ionicons name={"caret-up-outline"} size={height * 0.02} style={{}} color={"green"} /> :
                                    (decrement != undefined && decrement != 0) ?
                                        <Ionicons name={"caret-down-outline"} size={height * 0.02} style={{}} color={"red"} /> :
                                        <Image source={require("../assets/images/rect.png")} style={{ width: 10, height: 10, marginRight: "4%" }} />
                            }
                            {
                                (increment != undefined && increment != 0) ?
                                    <Text style={{ fontFamily: "Regular", color: "green", fontSize: height * 0.013 }}>{title == "THANK YOU NOTES" ? abbreviate_number(increment) : increment}</Text> :
                                    (decrement != undefined && decrement != 0) ?
                                        <Text style={{ fontFamily: "Regular", color: "red", fontSize: height * 0.013 }}>{title == "THANK YOU NOTES" ? abbreviate_number(decrement) : decrement}</Text> :
                                        (increment != undefined && increment == 0) ?
                                            <Text style={{ fontFamily: "Regular", color: "orange", fontSize: height * 0.013 }}>{title == "THANK YOU NOTES" ? abbreviate_number(increment) : increment}</Text> :
                                            <Text style={{ fontFamily: "Regular", color: "orange", fontSize: height * 0.013 }}>{title == "THANK YOU NOTES" ? abbreviate_number(decrement) : decrement}</Text>
                            }
                        </View> :
                        <View style={{ marginTop: "5%" }} />
                    }
                </View>

            </View>

        </TouchableOpacity>
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

export default OverViewtwo;