//api for storing access token will be done here
import axios from 'axios';
import { Alert, Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import env from '../config/env';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';

export const Init = () => {
    return async dispatch => {
        let token = await AsyncStorage.getItem('token');
        let user_id = await AsyncStorage.getItem('user_id');
        let first_name = await AsyncStorage.getItem('first_name')
        let last_name = await AsyncStorage.getItem('last_name')
        let firm_name = await AsyncStorage.getItem('firm_name')
        let profile_picture = await AsyncStorage.getItem('profile_picture')
        let email = await AsyncStorage.getItem('email')
        let mobile = await AsyncStorage.getItem('mobile')
        let category = await AsyncStorage.getItem('category')
        let address = await AsyncStorage.getItem('address')
        let memberSince = await AsyncStorage.getItem('memberSince')
        let website = await AsyncStorage.getItem('website')
        let chapter_id = await AsyncStorage.getItem('chapter_id')

        if (token !== null) {
            dispatch({
                type: 'LOGIN',
                payload: token,
                payloaduser_id: user_id,
                payloadfirst_name: first_name,
                payloadlast_name: last_name,
                payloadfirm_name: firm_name,
                payloadprofile_picture: profile_picture,
                payloademail: email,
                payloadmobile: mobile,
                payloadcategory: category,
                payloadaddress: address,
                payloadmemberSince: memberSince,
                payloaduser_id: user_id,
                payloadwebsite: website,
                payloadchapter_id: chapter_id,
            })
        }
    }
}

export const Login = (otp, details) => {


    return async dispatch => {
        let token = null;
        let user_id = null;
        let first_name = null;
        let last_name = null;
        let firm_name = null;
        let profile_picture = null;
        let email = null;
        let mobile = null;
        let category = null;
        let address = null;
        let memberSince = null;
        let website = null;
        let chapter_id = null;
        // let pushToken = null;
        // let tokenId = null;
        // let tokenType = null;
        // try {
        if (Device.isDevice && Platform.OS !== 'android') {
            const { status: existingStatus } = await Notifications.getPermissionsAsync();
            let finalStatus = existingStatus;
            if (existingStatus !== 'granted') {
                const { status } = await Notifications.requestPermissionsAsync();
                finalStatus = status;
            }
            // if (finalStatus !== 'granted') {
            // }
        }
        const pushToken = (await Notifications.getDevicePushTokenAsync());
        const tokenId = pushToken ? pushToken.data : null
        const tokenType = pushToken ? pushToken.type : null

        // if (Platform.OS === 'android') {
        //     console.log("inside", Platform)
        //     Notifications.setNotificationChannelAsync('default', {
        //         name: 'default',
        //         importance: Notifications.AndroidImportance.MAX,
        //         vibrationPattern: [0, 250, 250, 250],
        //         lightColor: '#FF231F7C',
        //     });
        // }
        // } catch (error) {
        // }

        axios({
            method: "post",
            url: `${env.endpointURL}/otp/verify`,
            data: {
                userOtp: otp,
                encryptedString: details,
                deviceToken: tokenId,
                deviceType: tokenType,
            },
            headers: {
                'accept': '*/*',
                'Content-Type': 'application/json',
            }
        })
            .then(function (res) {
                token = res.data.data.jwt_access_token;
                user_id = res.data.data.user_info.id;
                first_name = res.data.data.user_info.first_name;
                last_name = res.data.data.user_info.last_name;
                firm_name = res.data.data.user_info.firm_name;
                profile_picture = res.data.data.user_info.profile_picture;
                email = res.data.data.user_info.email;
                mobile = res.data.data.user_info.mobile;
                category = res.data.data.user_info.category;
                address = res.data.data.user_info.address;
                memberSince = res.data.data.user_info.memberSince;
                user_id = res.data.data.user_info.id;
                website = res.data.data.user_info.website;
                chapter_id = res.data.data.user_info.chapter_id;

                AsyncStorage.setItem('token', token);
                AsyncStorage.setItem('user_id', JSON.stringify(user_id));
                AsyncStorage.setItem('first_name', first_name);
                AsyncStorage.setItem('last_name', last_name);
                AsyncStorage.setItem('firm_name', firm_name);
                AsyncStorage.setItem('profile_picture', profile_picture ? profile_picture : '');
                AsyncStorage.setItem('email', email);
                AsyncStorage.setItem('mobile', mobile);
                AsyncStorage.setItem('category', category ? category : '');
                AsyncStorage.setItem('address', address ? address : '');
                AsyncStorage.setItem('memberSince', memberSince);
                AsyncStorage.setItem('website', website ? website : '');
                AsyncStorage.setItem('chapter_id', JSON.stringify(chapter_id));

                dispatch({
                    type: "LOGIN",
                    payload: token,
                    payloaduser_id: user_id,
                    payloadfirst_name: first_name,
                    payloadlast_name: last_name,
                    payloadfirm_name: firm_name,
                    payloadprofile_picture: profile_picture,
                    payloademail: email,
                    payloadmobile: mobile,
                    payloadcategory: category,
                    payloadaddress: address,
                    payloadmemberSince: memberSince,
                    payloaduser_id: user_id,
                    payloadwebsite: website,
                    payloadchapter_id: chapter_id,
                })
            })
            .catch(function (error) {
                console.log("error", error)
                Alert.alert(
                    "Alert",
                    "Enter valid OTP",
                    [
                        { text: "OK", onPress: () => console.log("OK Pressed") }
                    ]
                );
            })
    }
}

export const Logout = () => {
    return async dispatch => {
        await AsyncStorage.clear();
        dispatch({
            type: 'LOGOUT'
        })
    }
}
