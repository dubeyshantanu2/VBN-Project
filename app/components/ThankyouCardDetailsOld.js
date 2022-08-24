import { StyleSheet, Text, TouchableOpacity, Dimensions, View, Image } from 'react-native'
import React from 'react'
import colors from '../config/colors';
import "intl";
import "intl/locale-data/jsonp/en";

const { height, width } = Dimensions.get('window');

function ThankyouCardDetails({ key, date, amount, status, description, givenTo, receivedFrom, picture, rosterId }) {
    var formatter = new Intl.NumberFormat('en-IN', {
        minimumFractionDigits: 0,
    });
    return (
        <View key={key} style={styles.button}>
            <View style={{ flexDirection: "row", width: "100%" }}>
                <View style={{ width: "63%" }}>
                    <Text style={{ fontFamily: "Bold", fontSize: height * 0.03 }}>{amount ? formatter.format(amount) + '' + '/-' : null}</Text>
                    <Text style={{ fontFamily: "SemiBold", fontSize: height * 0.015, color: colors.inactiveTab }}>Amount</Text>
                </View>
                <View style={{ flexDirection: "row", alignItems: "baseline" }}>
                    <Text style={{ fontFamily: "Bold" }}>Date:</Text>
                    <Text style={{ fontFamily: "Regular", marginLeft: "6%", fontSize: height * 0.015, }}>{date}</Text>
                </View>
            </View>

            <View style={{ flexDirection: "row", width: "100%", marginTop: "4%" }}>
                <View style={{ width: "100%" }}>
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
                    <View>
                        <View style={{ flexDirection: "row", marginTop: "2%", alignItems: "center", width: '100%' }}>
                            {/* <View style={{ backgroundColor: "red", borderRadius: 5, height: height * 0.05, width: height * 0.05 }} /> */}
                            <Image style={{ height: 50, width: 50, backgroundColor: "#eee", borderRadius: 7 }} source={{ uri: picture }} />
                            <View style={{ backgroundColor: colors.white, height: 27, width: 27, borderRadius: 40, backgroundColor: colors.primary, justifyContent: "center", alignItems: "center", right: 10, top: 15 }}>
                                <Text style={{ color: colors.white, fontSize: height * 0.012 }}>#{rosterId}</Text>
                            </View>
                            <Text ellipsizeMode='tail' numberOfLines={1} style={{ fontFamily: "Regular", fontSize: height * 0.017 }}>{receivedFrom}</Text>
                        </View>
                    </View> :
                    <View>
                        <View style={{ flexDirection: "row", marginTop: "2%", alignItems: "center", width: '100%' }}>
                            <Image style={{ height: 50, width: 50, backgroundColor: "#eee", borderRadius: 7 }} source={{ uri: picture }} />
                            <View style={{ backgroundColor: colors.white, height: 27, width: 27, borderRadius: 40, backgroundColor: colors.primary, justifyContent: "center", alignItems: "center", right: 10, top: 15 }}>
                                <Text style={{ color: colors.white, fontSize: height * 0.012 }}>#{rosterId}</Text>
                            </View>
                            <Text ellipsizeMode='tail' numberOfLines={1} style={{ fontFamily: "Regular", fontSize: height * 0.017 }}>{givenTo}</Text>
                        </View>
                    </View>
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

export default ThankyouCardDetails;
