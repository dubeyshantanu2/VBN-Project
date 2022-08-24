import { StyleSheet, Text, TouchableOpacity, Dimensions, View } from 'react-native'
import React from 'react'
import colors from '../config/colors';

const { height, width } = Dimensions.get('window');

function CardDetails({ key, name, date, email, phone, givenTo, receivedFrom, status, description }) {

    return (
        <View key={key} style={styles.button}>
            <View style={{ flexDirection: "row", width: "100%" }}>
                <View style={{ width: "65%" }}>
                    <Text style={{ fontFamily: "Bold" }}>Name</Text>
                    <Text style={{ fontFamily: "Regular", fontSize: height * 0.017, marginTop: "1%" }}>{name}</Text>
                </View>
                <View>
                    <Text style={{ fontFamily: "Bold" }}>Date</Text>
                    <Text style={{ fontFamily: "Regular", fontSize: height * 0.017, marginTop: "1%" }}>{date}</Text>
                </View>
            </View>
            <View style={{ flexDirection: "row", width: "100%", marginTop: "2%" }}>
                <View style={{ width: "65%" }}>
                    <Text style={{ fontFamily: "Bold" }}>Email</Text>
                    <Text style={{ fontFamily: "Regular", fontSize: height * 0.017, marginTop: "1%" }}>{email}</Text>
                </View>
                <View>
                    <Text style={{ fontFamily: "Bold" }}>Phone</Text>
                    <Text style={{ fontFamily: "Regular", fontSize: height * 0.017, marginTop: "1%" }}>{phone}</Text>
                </View>
            </View>
            <View style={{ flexDirection: "row", width: "100%", marginTop: "2%" }}>
                <View style={{ width: "65%" }}>
                    <Text style={{ fontFamily: "Bold" }}>Description</Text>
                    <Text style={{ fontFamily: "Regular", fontSize: height * 0.017, marginTop: "1%" }}>{description}</Text>
                </View>
            </View>
            <View style={{ width: "100%", borderWidth: 0.75, marginTop: "4%", borderColor: colors.lightgrey }} />

            <View style={{ marginTop: "4%" }}>
                {status === 'Received' ?
                    <Text style={{ fontFamily: "Bold" }}>Received From</Text> :
                    <Text style={{ fontFamily: "Bold" }}>Given To</Text>
                }
                {status === 'Received' ?
                    <Text style={{ fontFamily: "Regular", fontSize: height * 0.017, marginTop: "1%" }}>{receivedFrom}</Text> :
                    <Text style={{ fontFamily: "Regular", fontSize: height * 0.017, marginTop: "1%" }}>{givenTo}</Text>
                }
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
        width: "92%",
        marginLeft: "4%"
    },
})

export default CardDetails;
