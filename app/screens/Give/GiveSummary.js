import React, { useState, useEffect } from 'react'

import { StatusBar, Image, Dimensions, SafeAreaView, View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import colors from '../../config/colors';
import { Ionicons } from '@expo/vector-icons';
import SplashScreen from "../SplashScreen";
import ShortButton from '../../components/ShortButton';
import CancelButton from '../../components/CancelButton';
import LongButton from '../../components/LongButton';

const { height, width } = Dimensions.get('window');
const GiveScreen = ({ navigation }) => {
    // const [modalVisible, setModalVisible] = useState(false);
    // const [address, setAddress] = useState('')
    return (

        <SafeAreaView style={styles.container}>
            <StatusBar backgroundColor={colors.primary} barStyle='light-content' />
            <ScrollView style={{ width: "100%" }}>
                <View style={{ padding: "4%" }}>


                    <View style={{ flexDirection: "row", width: "100%", alignItems: "center" }}>
                        <Image source={require("../../assets/images/man.jpg")} style={{ height: height * 0.08, width: height * 0.08, borderRadius: 5 }} />
                        <View style={{ marginLeft: "4%" }}>
                            <Text style={{ fontSize: height * 0.02 }}>Niraj Ramakrishnan</Text>
                            <Text style={{ fontSize: height * 0.015, color: colors.inactiveTab }}>Niraj Ramakrishnan</Text>
                        </View>
                        <View style={{ marginLeft: "20%" }}>
                            <Text style={{ fontSize: height * 0.014, marginTop: "50%", color: colors.inactiveTab }}>25 min ago</Text>
                        </View>
                    </View>

                    <View style={{ marginTop: "4%" }}>
                        <Text>Hi,
                            Software Development Leads: Any family looking to buy
                            looking buy Description is the pattern of narrative development
                            that aims to make vivid a place, object, character, or group.
                            Description is one of four rhetorical modes, along with exposition,
                            argumentation, and narration. In practice it would be difficult to
                            write literature that drew on just one of the four basic modes.

                            Thanks
                            Niraj Ramakrishna</Text>
                    </View>
                </View>

            </ScrollView>



        </SafeAreaView>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1, justifyContent: "space-between", alignItems: "center"
    },
    card: {
        backgroundColor: colors.white, padding: "4%"
    },
    selector: {
        flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: "2%", width: "100%", height: height * 0.06, backgroundColor: colors.lightgrey, borderRadius: 10, borderColor: colors.grey, borderWidth: 1
    },
    footer: {
        width: "100%", justifyContent: "space-evenly", alignItems: "center", flexDirection: "row", marginBottom: "2%"
    },
    input: {
        width: "100%",
        borderWidth: 1,
        borderColor: colors.grey,
        borderRadius: 10,
        marginTop: "2%",
        padding: 10,
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22
    },
    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 15,
        width: "85%",
        height: "80%",
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
    button: {
        borderRadius: 20,
        // padding: 10,
        margin: 3,
    },

    textStyle: {
        color: colors.black,
        fontSize: height * 0.022,
        fontFamily: "SemiBold",
        textAlign: "center"
    },
    modalText: {
        marginBottom: 15,
        textAlign: "center",
        fontFamily: "SemiBold"
    },
    checkbox: {
        margin: 8,
        borderRadius: 3
    },
    input: {
        fontFamily: "SemiBold",
        width: "100%",

        borderWidth: 1,
        borderColor: colors.grey,
        borderRadius: 10,
        marginTop: "2%",
        padding: 10,
    },
})


export default GiveScreen;