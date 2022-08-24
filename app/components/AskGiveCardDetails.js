import { StyleSheet, Text, TouchableOpacity, Dimensions, View } from 'react-native'
import React from 'react'
import colors from '../config/colors';

const { height } = Dimensions.get('window');

function AskGiveCardDetails({ keys, ask, date, replies, askedBy, status, ask_give }) {
    return (
        <TouchableOpacity key={keys} style={styles.button}>

            <View style={{ width: "100%", }}>
                <View style={{ flexDirection: "row", width: "100%", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <View style={{}}>
                        <Text style={{ fontFamily: "Bold", fontSize: height * 0.017, }}>Date</Text>
                        <Text style={{ fontFamily: "Regular", fontSize: height * 0.017 }}>{date}</Text>
                    </View>
                    {
                        status === "My Ask/Give" && askedBy ?
                            <View style={{ width: "40%" }}>
                                <Text style={{ fontFamily: "Bold", fontSize: height * 0.017, }}>{ask_give == 'ask' ? 'Asked' : 'Given'} By</Text>
                                <Text style={{ fontFamily: "Regular", fontSize: height * 0.017 }} ellipsizeMode='tail' numberOfLines={1}>{askedBy}</Text>
                            </View> :
                            status != 0 ?
                                <View style={{ width: "40%" }}>
                                    <Text style={{ fontFamily: "Bold", fontSize: height * 0.017, }}>{ask_give == 'ask' ? 'Asked' : 'Given'} By</Text>
                                    <Text style={{ fontFamily: "Regular", fontSize: height * 0.017 }} ellipsizeMode='tail' numberOfLines={1}>{askedBy}</Text>
                                </View> :
                                <View></View>
                    }

                </View>

                <View style={{ width: "100%", marginTop: "4%" }}>
                    <Text style={{ fontFamily: "Bold", fontSize: height * 0.016, }}>{ask_give == 'ask' ? 'Ask' : 'Give'}</Text>
                    <Text style={{ fontFamily: "Regular", fontSize: height * 0.018 }} >{ask}</Text>
                </View>
            </View>

        </TouchableOpacity >
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

export default AskGiveCardDetails;
