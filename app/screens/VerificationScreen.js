import React, { useState } from 'react'
import { StatusBar, Alert, Dimensions, View, Text, Keyboard, StyleSheet, TouchableWithoutFeedback, ImageBackground, TouchableOpacity } from 'react-native';
import { Login } from '../store/actions';
import { useDispatch } from 'react-redux';
import colors from '../config/colors';
import axios from 'axios';
import env from '../config/env';
import {
    CodeField,
    Cursor,
    useBlurOnFulfill,
    useClearByFocusCell,
} from 'react-native-confirmation-code-field';

const { height, width } = Dimensions.get('window');

export default function VerificationScreen({ route }) {

    const [value, setValue] = useState('');
    const details = route.params.details;

    const [encryptedString, setencryptedString] = useState('');
    const CELL_COUNT = 6;
    const ref = useBlurOnFulfill({ value, cellCount: CELL_COUNT });
    const [props, getCellOnLayoutHandler] = useClearByFocusCell({
        value,
        setValue,
    });

    const dispatch = useDispatch();

    const submit = () => {
        encryptedString ? dispatch(Login(value, encryptedString)) : dispatch(Login(value, details))
    }

    const resendOTP = () => {
        axios({
            method: "post",
            url: `${env.endpointURL}/otp/generate`,
            data: {
                mobile: route.params.mobileNumber,
            },
            headers: {
                'accept': '*/*',
                'Content-Type': 'application/json',
            }
        })
            .then(function (res) {
                Alert.alert(
                    "Alert",
                    `New OTP sent on ${route.params.mobileNumber}`,
                    [
                        { text: "OK", onPress: () => console.log("OK Pressed") }
                    ]
                );
                setencryptedString(res.data[0].details)
            })
            .catch(function (error) {
                console.log("error at login screen", error)
            })
    }

    return (
        <TouchableWithoutFeedback onPress={() => {
            Keyboard.dismiss();
        }}>
            <ImageBackground source={require("../assets/images/Splash–3.png")} resizeMode="cover" style={styles.image}>
                <StatusBar barStyle='dark-content' backgroundColor={"white"} />
                <View style={{ marginTop: "70%" }}>
                    <Text style={{ fontSize: height * 0.03, fontFamily: "ExtraBold" }}>OTP Verification</Text>
                    <Text style={{ fontSize: height * 0.015, marginTop: "1%", fontFamily: "Regular" }}>Enter the OTP you recieved to</Text>
                </View>
                <Text style={{ fontSize: height * 0.022, marginTop: "4%", fontFamily: "ExtraBold", color: '#000' }}>+91 {route.params.mobile}</Text>
                <CodeField
                    ref={ref}
                    {...props}
                    value={value}
                    onChangeText={setValue}
                    cellCount={CELL_COUNT}
                    rootStyle={styles.codeFieldRoot}
                    keyboardType="number-pad"
                    textContentType="oneTimeCode"
                    renderCell={({ index, symbol, isFocused }) => (
                        <Text
                            key={index}
                            style={[styles.cell, isFocused && styles.focusCell]}
                            onLayout={getCellOnLayoutHandler(index)}>
                            {symbol || (isFocused ? <Cursor /> : null)}
                        </Text>
                    )}
                />
                <View style={{ flexDirection: "row", justifyContent: "flex-end", alignItems: "center", marginTop: "3%", width: "100%" }}>
                    <Text style={{ fontSize: height * 0.015, fontFamily: "Regular" }}>Didn't recieve the OTP?</Text>
                    <TouchableOpacity onPress={resendOTP}>
                        <Text style={{ fontSize: height * 0.015, color: "#0090C8", fontFamily: "Regular" }}>  RESEND OTP</Text>
                    </TouchableOpacity>
                </View>
                {
                    value.length !== 6
                        ?
                        <TouchableOpacity disabled >
                            <View style={{ marginTop: "5%", justifyContent: "center", alignItems: "center", backgroundColor: colors.grey, padding: "5%", borderRadius: 10 }}>
                                <Text style={{ fontFamily: "ExtraBold", fontSize: height * 0.02, color: colors.black }}>Login</Text>
                            </View>
                        </TouchableOpacity>
                        :
                        <TouchableOpacity onPress={submit}>
                            <View style={{ marginTop: "5%", justifyContent: "center", alignItems: "center", backgroundColor: colors.primary, padding: "5%", borderRadius: 10 }}>
                                <Text style={{ fontFamily: "ExtraBold", fontSize: height * 0.02, color: colors.white }}>Login</Text>
                            </View>
                        </TouchableOpacity>
                }
            </ImageBackground>
        </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({
    codeFieldRoot: { marginTop: "4%", width: "100%" },
    cell: {
        width: height * 0.053,
        height: height * 0.06,
        fontSize: height * 0.045,
        borderWidth: 1,
        borderRadius: 7,
        backgroundColor: colors.grey,
        borderColor: '#ddd',
        justifyContent: 'center',
        textAlign: 'center',
    },
    focusCell: {
        borderColor: colors.darkgrey,
    },
    image: {
        flex: 1,
        paddingHorizontal: "4%",
        position: 'absolute',
        left: 0,
        top: Platform.OS === 'ios' ? 0 : -50,
        width: width,
        height: height,
    },
})