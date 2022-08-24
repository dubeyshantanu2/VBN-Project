
import React, { useState, useEffect } from 'react'
import { View, Image, Dimensions, SafeAreaView, Button, Text, Touchable, TouchableOpacity } from 'react-native';
import colors from '../config/colors';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import env from '../config/env';
import { useSelector } from 'react-redux';
import axios from 'axios';
import moment from 'moment';

const { height, width } = Dimensions.get('window');

const UpcomingMeetingNotification = ({ from, timefrom_now, meeting_name, meeting_date, start_time, end_time, meeting_venue, id, data }) => {
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
                console.log("error at users api upcomingNotificationScreen", error.message)
            })
    }, []);
    var invited_by_user = userData.find(user => user.id == from);

    return (

        <TouchableOpacity onPress={() => navigation.navigate('MeetingDetailScreen', {
            meeting: data.meeting_details,
        })} style={{
            marginVertical: "4%",
            marginHorizontal: "4%",
        }}>
            <View style={{ flexDirection: "row", }}>
                <Image style={{ height: height * 0.06, width: height * 0.06, backgroundColor: colors.darkgrey, borderRadius: 5 }} source={{ uri: invited_by_user ? invited_by_user.profile_picture : null }} />
                <View style={{ width: "76%", marginLeft: "4%" }}>
                    <Text style={{ fontFamily: "Bold", fontSize: height * 0.018 }}>Upcoming Meeting: {meeting_name}</Text>
                    <Text style={{ fontFamily: "Regular", fontSize: height * 0.013 }}>Meeting Date: {moment(meeting_date).format("DD-MM-YYYY")}, Time: {moment(start_time, ["HH.mm"]).format("hh:mm A")} - {moment(end_time, ["HH.mm"]).format("hh:mm A")},</Text>
                    <Text style={{ fontFamily: "Regular", fontSize: height * 0.013 }}>Venue: {meeting_venue}</Text>
                    <Text style={{ fontFamily: "Regular", fontSize: height * 0.013 }}>{timefrom_now}</Text>
                </View>
                <View style={{ width: "10%", justifyContent: "center" }}>
                    <Ionicons name={"chevron-forward-outline"} size={height * 0.03} color={colors.darkgrey} style={{}} />
                </View>
            </View>
        </TouchableOpacity>
    )
}

export default UpcomingMeetingNotification;
