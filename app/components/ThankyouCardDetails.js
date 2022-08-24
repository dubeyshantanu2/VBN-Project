import { StyleSheet, Text, TouchableOpacity, Dimensions, View, Image, ScrollView } from 'react-native'
import React, { useState } from 'react'
import colors from '../config/colors';
import { Transition, Transitioning } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import "intl";
import "intl/locale-data/jsonp/en";

const transition = (
    <Transition.Together>
        <Transition.In type='fade' durationMs={200} />
        <Transition.Change />
        <Transition.Out type='fade' durationMs={200} />
    </Transition.Together>
);
const { height, width } = Dimensions.get('window');

function ThankyouCardDetails({ key, date, amount, status, description, givenTo, receivedFrom, picture, rosterId, tabOpen }) {
    const [thankyouTab, setThankyouTab] = useState(tabOpen == rosterId ? true : false);
    const ref = React.useRef();
    const [currentIndex, setCurrentIndex] = useState();
    var formatter = new Intl.NumberFormat('en-IN', {
        minimumFractionDigits: 0,
    });

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
    return (
        <Transitioning.View
            ref={ref}
            transition={transition}
            style={{ width: "100%" }}
        >
            <ScrollView style={styles.container}>
                <TouchableOpacity style={{ flexGrow: 1 }} key={rosterId} activeOpacity={0.9}
                    onPress={() => {
                        ref.current.animateNextTransition();
                        setCurrentIndex(((thankyouTab && rosterId === tabOpen) || rosterId === currentIndex) ? null : rosterId)
                        setThankyouTab(false);
                    }}>
                    <View style={{
                        flexDirection: "row", height: height * 0.08, borderRadius: 10, borderColor: colors.lightgrey, backgroundColor: colors.grey, borderWidth: 1,
                        justifyContent: "flex-start", alignItems: "center", marginHorizontal: "4%"
                    }}>
                        <View style={{ flexDirection: "row", marginLeft: "3%" }}>
                            {
                                picture !== null ?
                                    <Image source={{ uri: `${picture}` }} style={{ height: 50, width: 50, backgroundColor: "#eee", borderRadius: 7 }} />
                                    :
                                    <Image source={require("../assets/images/profilepicture.png")} style={{ height: 50, width: 50, backgroundColor: "#eee", borderRadius: 7 }} />
                            }
                            <View style={{ backgroundColor: colors.primary, height: 23, width: 23, borderRadius: 40, left: -15, top: 30, borderWidth: 1.5, borderColor: "white", justifyContent: "center", alignItems: "center" }}>
                                <Text style={{ color: "white", fontSize: height * 0.010 }}>#{rosterId}</Text>
                            </View>
                            <View style={{ flexDirection: "row", left: -10, alignItems: "center", width: "62%" }}>
                                <Text style={{ marginLeft: "2%" }} ellipsizeMode='tail' numberOfLines={1}>{givenTo ? givenTo : receivedFrom}</Text>
                            </View>
                        </View>
                        <Text style={{ left: -20 }}>{abbreviate_number(amount)}</Text>
                        {
                            ((thankyouTab && rosterId === tabOpen) || rosterId === currentIndex) ? <Ionicons name={"chevron-up-outline"} size={height * 0.03} color={colors.icon} style={{ left: -20 }} />
                                : <Ionicons name={"chevron-down-outline"} size={height * 0.03} color={colors.icon} style={{ left: -20 }} />
                        }
                    </View>
                    {((thankyouTab && rosterId === tabOpen) || rosterId === currentIndex) && (
                        <View key={key} style={styles.button}>
                            <View style={{ flexDirection: "row", width: "100%", margin: "2%", marginLeft: "4%" }}>
                                <View style={{ width: "60%" }}>
                                    <Text style={{ fontFamily: "Bold", fontSize: height * 0.03 }}>{amount ? formatter.format(amount) + '' + '/-' : null}</Text>
                                    <Text style={{ fontFamily: "SemiBold", fontSize: height * 0.015, color: colors.inactiveTab }}>Amount</Text>
                                </View>
                                <View style={{ flexDirection: "row", alignItems: "baseline" }}>
                                    <Text style={{ fontFamily: "Bold" }}>Date:</Text>
                                    <Text style={{ fontFamily: "Regular", marginLeft: "6%", fontSize: height * 0.015, }}>{date}</Text>
                                </View>
                            </View>

                            <View style={{ flexDirection: "row", width: "100%", margin: "4%" }}>
                                <View style={{ width: "100%" }}>
                                    <Text style={{ fontFamily: "Bold" }}>Description</Text>
                                    <Text style={{ fontFamily: "Regular", fontSize: height * 0.017, marginTop: "1%" }}>{description}</Text>
                                </View>
                            </View>
                        </View>
                    )}
                </TouchableOpacity>
            </ScrollView>
        </Transitioning.View>
    )
}

const styles = StyleSheet.create({
    button: {
        backgroundColor: colors.white,
        borderRadius: 5,
        // padding: 12,
        borderWidth: 1.5,
        borderColor: colors.lightgrey,
        width: "92%",
        margin: "4%"
    },
})

export default ThankyouCardDetails;
