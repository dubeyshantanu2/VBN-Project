import { StyleSheet, Text, TouchableOpacity, Dimensions, View } from 'react-native'
import React from 'react'
import colors from '../config/colors';

const { height, width } = Dimensions.get('window');

function VisitorCardDetails({ keys, name, date, email, phone, company, meeting, invitedBy }) {
    return (
        <View key={keys} style={styles.button}>
            <View style={{ flexDirection: "row", width: "100%" }}>
                <View style={{ width: "60%" }}>
                    <Text style={{ fontFamily: "Bold" }}>Name</Text>
                    <Text style={{ fontFamily: "Regular", fontSize: height * 0.017, marginTop: "1%" }}>{name}</Text>
                </View>
                <View >
                    <Text style={{ fontFamily: "Bold" }}>Date</Text>
                    <Text style={{ fontFamily: "Regular", fontSize: height * 0.017, marginTop: "1%" }}>{date}</Text>
                </View>
            </View>

            <View style={{ flexDirection: "row", width: "100%", marginTop: "2%" }}>
                <View style={{ width: "60%" }}>
                    <Text style={{ fontFamily: "Bold" }}>Company Name</Text>
                    <Text style={{ fontFamily: "Regular", fontSize: height * 0.017, marginTop: "1%" }}>{company}</Text>
                </View>
                <View style={{ width: "40%", }}>
                    <Text style={{ fontFamily: "Bold" }}>Meeting Name</Text>
                    <Text style={{ fontFamily: "Regular", fontSize: height * 0.017, marginTop: "1%" }}>{meeting}</Text>
                </View>
            </View>

            <View style={{ flexDirection: "row", width: "100%", marginTop: "2%" }}>
                <View style={{ width: "60%" }}>
                    <Text style={{ fontFamily: "Bold" }}>Email</Text>
                    <Text style={{ fontFamily: "Regular", fontSize: height * 0.017, marginTop: "1%" }}>{email}</Text>
                </View>
                <View style={{ width: "40%" }}>
                    <Text style={{ fontFamily: "Bold" }}>Phone</Text>
                    <Text style={{ fontFamily: "Regular", fontSize: height * 0.017, marginTop: "1%" }}>{phone}</Text>
                </View>
            </View>

            <View style={{ width: "100%", borderWidth: 0.75, marginTop: "4%", borderColor: colors.lightgrey }} />

            <View style={{ flexDirection: "row", width: "100%", marginTop: "2%" }}>
                <View style={{ width: "65%" }}>
                    <Text style={{ fontFamily: "Bold" }}>Invited by</Text>
                    <Text style={{ fontFamily: "Regular", fontSize: height * 0.017, marginTop: "1%" }}>{invitedBy}</Text>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    button: {
        backgroundColor: colors.white,
        borderRadius: 5,
        padding: 12,
        borderWidth: 1.5,
        borderColor: colors.lightgrey,
        width: "94%",
        marginLeft: "3%"
    },
})

export default VisitorCardDetails;
