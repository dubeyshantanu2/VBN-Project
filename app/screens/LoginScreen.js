import React, { useState } from 'react'
import { StatusBar, Platform, Alert, Dimensions, ScrollView, View, Text, Keyboard, TextInput, StyleSheet, ImageBackground, TouchableWithoutFeedback, TouchableOpacity } from 'react-native';
import { CommonActions } from '@react-navigation/native';
import axios from 'axios';
import colors from '../config/colors';
import env from '../config/env';

const { height, width } = Dimensions.get('window');

export default function LoginScreen({ navigation }) {

    const code = "+91";
    const [mobile, setMobile] = useState('');
    const submit = () => {
        var mobileNumber = code.concat(mobile);
        axios({
            method: "post",
            url: `${env.endpointURL}/otp/generate`,
            data: {
                mobile: mobileNumber,
            },
            headers: {
                'accept': '*/*',
                'Content-Type': 'application/json',
            }
        })
            .then(function (res) {
                navigation.dispatch(
                    CommonActions.navigate({
                        name: 'Verification',
                        params: {
                            details: res.data[0].details,
                            mobile: mobile,
                            mobileNumber: mobileNumber,

                        },
                    })
                );
            })
            .catch(function (error) {
                // console.log(error.response.data.message)
                Alert.alert(
                    "Alert",
                    `${error.response.data.message}`,
                    [
                        { text: "OK", onPress: () => console.log("OK Pressed") }
                    ]
                );
            })
    }

    return (
        <TouchableWithoutFeedback onPress={() => {
            Keyboard.dismiss();
        }}>

            <ImageBackground source={require("../assets/images/Splash–3.png")} resizeMode="cover" style={styles.image}>
                <ScrollView>
                    <StatusBar barStyle='dark-content' backgroundColor={"white"} />

                    <View style={{ width: "100%", marginTop: "70%" }}>
                        <Text style={{ fontSize: height * 0.03, fontFamily: "ExtraBold" }}>Login</Text>
                        <Text style={{ fontSize: height * 0.015, marginTop: "1%", fontFamily: "Regular" }}>Enter phone number to proceed</Text>
                    </View>

                    <View style={{
                        height: height * 0.06, marginTop: "5%", backgroundColor: colors.white, justifyContent: "space-between", alignItems: "center", flexDirection: "row"
                    }}>

                        <View style={{ width: "12%", justifyContent: "center", alignItems: "center", backgroundColor: colors.white, }}>
                            <Text style={{ fontSize: height * 0.02, fontFamily: "Regular" }}>+91</Text>
                        </View>

                        <View style={{ borderWidth: 1, borderColor: colors.lightgrey, height: "100%" }} />

                        <TextInput
                            keyboardType='number-pad'
                            maxLength={10}
                            value={mobile}
                            onChangeText={(text) => {
                                if (text.length == 10) { Keyboard.dismiss(); }
                                setMobile(text)
                            }}
                            style={{ fontSize: height * 0.02, backgroundColor: colors.white, width: "85%", marginLeft: "2%", fontFamily: "Regular" }}
                            placeholder="Enter Number"
                            returnKeyType='done'
                            textContentType='telephoneNumber'
                            keyboardAppearance='default'
                            enablesReturnKeyAutomatically
                            selectionColor={colors.selector}
                        />
                    </View>
                    <View style={{ borderWidth: 0.5, borderColor: colors.lightgrey, width: "100%" }} />
                    <Text style={{ fontSize: height * 0.015, marginTop: "4%", fontFamily: "Regular", color: colors.darkgrey, marginLeft: "8%" }}>
                        A 6 digit OTP will be sent to verify your phone number.
                    </Text>
                    {
                        mobile.length !== 10
                            ?
                            <TouchableWithoutFeedback disabled>
                                <View style={{ marginTop: "8%", width: "100%", justifyContent: "center", alignItems: "center", backgroundColor: colors.grey, padding: "5%", borderRadius: 10 }}>
                                    <Text style={{ fontFamily: "ExtraBold", fontSize: height * 0.02, color: colors.black }}>Next</Text>
                                </View>
                            </TouchableWithoutFeedback>
                            :
                            <TouchableWithoutFeedback onPress={submit} >
                                <View style={{ marginTop: "8%", width: "100%", justifyContent: "center", alignItems: "center", backgroundColor: colors.primary, padding: "5%", borderRadius: 10 }}>
                                    <Text style={{ fontFamily: "ExtraBold", fontSize: height * 0.02, color: colors.white }}>Next</Text>
                                </View>
                            </TouchableWithoutFeedback>
                    }
                    <View style={{ flexDirection: "row", marginLeft: "7%" }}>
                        <Text style={{ fontSize: height * 0.012, marginTop: "3%", }}>By logging in, you agree to our </Text>
                        <TouchableOpacity style={{ marginTop: "3%", }} onPress={() => { navigation.navigate("TermsAndCondition") }}>
                            <Text style={{ fontSize: height * 0.012, color: colors.secondary }}>Terms & Condition </Text>
                        </TouchableOpacity>
                        <Text style={{ fontSize: height * 0.012, marginTop: "3%" }}>and </Text>
                        <TouchableOpacity style={{ marginTop: "2.5%", }} onPress={() => { navigation.navigate("PrivacyPolicy") }}>
                            <Text style={{ fontSize: height * 0.012, marginTop: "2.5%", color: colors.secondary }}>Privacy Policy</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </ImageBackground>
        </TouchableWithoutFeedback>
    )
}

const styles = StyleSheet.create({
    image: {
        flex: 1,
        paddingHorizontal: "4%",
        position: 'absolute',
        left: 0,
        top: Platform.OS === 'ios' ? 50 : 0,
        width: width,
        height: height,
    },
})