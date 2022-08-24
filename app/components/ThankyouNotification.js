import { StyleSheet, Text, TouchableOpacity, Dimensions, View, Image } from 'react-native'
import React, { useState, useEffect } from 'react'
import colors from '../config/colors';
import { Ionicons } from '@expo/vector-icons';
const { height, width } = Dimensions.get('window');
import axios from 'axios';
import env from '../config/env';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';

function ThankyouNotification({ thankyou, from, timefrom_now, id, data, notification_id, is_new }) {
    const navigation = useNavigation();
    const token = useSelector(state => state.AuthReducers.accessToken);
    const [userData, setUserData] = useState([]);
    useEffect(() => {
        axios({
            method: "GET",
            url: `${env.endpointURL}/users`,
            headers: {
                'Cookie': `jwt=${token}`,
            },
        })
            .then(function (res) {
                setUserData(res.data);
            })
            .catch(function (error) {
                console.log("error at users api NotificationScreen", error.message)
            })
    }, []);

    const update_notification = (notification_id, is_new) => {
        console.log("in update notifications", notification_id, is_new);
        if (is_new) {
            axios({
                method: "PUT",
                url: `${env.endpointURL}/notifications/${notification_id}`,
                headers: {
                    'Cookie': `jwt=${token}`,
                },
                data: {
                    "id": notification_id,
                    "is_new": false
                }
            })
                .then(function (res) {
                    console.log("res.data", res.data);
                })
                .catch(function (error) {
                    console.log("error at notifications api in thank you notifications page", error.message)
                });
        } else console.log("Notification is_new is false, no need to update it again")
    }

    var invited_by_user = userData.find(user => user.id == from);

    return (
        <TouchableOpacity onPress={() => {
            navigation.navigate('ThankyouDetailScreen', {
                id: id,
                // data: data.filter(data => data.title === 'Thankyou'),
                name: 'All', //hardcoded
                selector: 'all' //hardcoded
            }); update_notification(notification_id, is_new)
        }} style={{
            marginVertical: "4%",
            marginHorizontal: "4%",
        }}>
            <View style={{ flexDirection: "row", }}>
                <Image style={{ height: height * 0.06, width: height * 0.06, backgroundColor: colors.darkgrey, borderRadius: 5 }} source={{ uri: invited_by_user ? invited_by_user.profile_picture : null }} />
                <View style={{ width: "76%", marginLeft: "4%" }}>
                    <Text style={{ fontFamily: "Bold", fontSize: height * 0.018 }}>Thank You Note Received: {thankyou}</Text>
                    <Text style={{ fontFamily: "Bold", fontSize: height * 0.018 }}>From: {invited_by_user ? (invited_by_user.first_name + ' ' + invited_by_user.last_name) : null}</Text>
                    <Text style={{ fontFamily: "Regular", fontSize: height * 0.013 }}>{timefrom_now}</Text>
                </View>
                <View style={{ width: "10%", justifyContent: "center" }}>
                    <Ionicons name={"chevron-forward-outline"} size={height * 0.03} color={colors.darkgrey} style={{}} />
                </View>
            </View>
        </TouchableOpacity>)
}

export default ThankyouNotification;
