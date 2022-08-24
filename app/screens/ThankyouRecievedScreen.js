import React from 'react'
import { StatusBar, Image, Dimensions, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
const { height, width } = Dimensions.get('window');
import colors from '../config/colors';
import CancelButton from '../components/CancelButton';
import LongButton from "../components/LongButton";

const ThankyouRecievedScreen = ({ navigation }) => {

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar backgroundColor={colors.primary} barStyle='light-content' />
            <ScrollView style={{ width: "100%", height: "90%" }} showsVerticalScrollIndicator={false}>

                <Text style={{ fontFamily: "Bold" }}>Sent By</Text>
                <Text style={{ marginTop: "2%", fontFamily: "Regular", fontSize: height * 0.018 }}>Niraj Ramakrishnan</Text>

                <Text style={{ fontFamily: "Bold", marginTop: "5%" }}>Name / Organization</Text>
                <Text style={{ marginTop: "2%", fontFamily: "Regular", fontSize: height * 0.018 }}>NAVARATAN TECHNOLOGIES PRIVATE LIMITED</Text>

                <Text style={{ fontFamily: "Bold", marginTop: "5%" }}>Email</Text>
                <Text style={{ marginTop: "2%", fontFamily: "Regular", fontSize: height * 0.018 }}>navaratantechnologies@gmail.com</Text>

                <Text style={{ fontFamily: "Bold", marginTop: "5%" }}>Mobile</Text>
                <Text style={{ marginTop: "2%", fontFamily: "Regular", fontSize: height * 0.018 }}>+91 1234567890</Text>

                <Text style={{ fontFamily: "Bold", marginTop: "5%" }}>Amount</Text>
                <Text style={{ marginTop: "2%", fontFamily: "Regular", fontSize: height * 0.018 }}>10000/-</Text>

                <Text style={{ fontFamily: "Bold", marginTop: "5%" }}>Comment</Text>
                <Text style={{ marginTop: "2%", fontFamily: "Regular", fontSize: height * 0.018 }}>Lorem ipsum dolor sit amet, consetetur sadip scing
                    elitr, sed diam nonumy eirmod tempor invidunt ut
                    labore et dolore magna Lorem ipsum dolor sit amet,
                    consetetur sadips cing elitr, sed diam nonumy eirmod
                    tempor invidunt ut labore et dolore magna.  </Text>

            </ScrollView>
            <View style={styles.footer}>
                <LongButton onPress={() => navigation.navigate("PostScreen")} text="Done" />
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1, padding: "4%", justifyContent: "space-between", alignItems: "center"
    },
    footer: {
        width: "100%", justifyContent: "space-evenly", alignItems: "center", flexDirection: "row"
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
    selector: {
        flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: "2%", width: "100%", height: height * 0.06, backgroundColor: colors.lightgrey, borderRadius: 10, borderColor: colors.grey, borderWidth: 1
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
    modalText: {
        marginBottom: 15,
        textAlign: "center",
        fontFamily: "SemiBold"
    },
})

export default ThankyouRecievedScreen;