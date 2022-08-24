import React, { useState, useEffect, useCallback } from 'react'
import { StatusBar, View, Image, FlatList, Dimensions, SafeAreaView, Button, ActivityIndicator, Text, TouchableWithoutFeedback, RefreshControl } from 'react-native';
import colors from '../config/colors';
import { Ionicons } from '@expo/vector-icons';
import { ScrollView } from 'react-native-gesture-handler';
import LeadsNotification from '../components/LeadsNotification';
import ThankyouNotification from '../components/ThankyouNotification';
import UpcomingMeetingNotification from '../components/UpcomingMeetingNotification';
import { useSelector } from 'react-redux';
import axios from 'axios';
import env from '../config/env';

const { height } = Dimensions.get('window');
const wait = (timeout) => {
    return new Promise(resolve => setTimeout(resolve, timeout));
}
const NotificationScreen = () => {
    const token = useSelector(state => state.AuthReducers.accessToken);
    const [notificationData, setNotificationData] = useState();
    const [notificationEntireData, setNotificationEntireData] = useState();
    const [refreshing, setRefreshing] = useState(false);
    const [viewselector, setViewselector] = useState('');
    const [viewselector1, setSelector1] = useState(0);
    const [isLoaded, setIsLoaded] = useState(true);
    const onRefresh = useCallback(() => {
        setRefreshing(true);
        setSelector1(viewselector1 => ++viewselector1)
        wait(1000).then(() => setRefreshing(false));
    }, []);

    useEffect(() => {
        axios({
            method: "GET",
            url: `${env.endpointURL}/notifications`,
            headers: {
                'Cookie': `jwt=${token}`,
            },
        })
            .then(function (res) {
                var merged = [];
                res.data.forEach(function (item) {
                    if (item.title === 'Lead') {
                        var idx;
                        var found = merged.some(function (el, i) {
                            idx = (el.from === item.from && el.count === item.count && el.title == item.title) ? i : null;
                            return el.from === item.from && el.count === item.count && el.title == item.title;
                        });
                        if (!found) {
                            merged.push(item);
                        } else if (idx !== null) {
                            for (k in Object.keys(item)) {
                                if (item.hasOwnProperty(k)) {
                                    merged[idx][k] = item[k];
                                }
                            }
                        }
                    } else {
                        merged.push(item);
                    }
                });
                setNotificationData(merged)
                setNotificationEntireData(res.data)
                setIsLoaded(false);
            })
            .catch(function (error) {
                console.log("error at notifications api NotificationScreen", error.message)
            })

    }, [viewselector, viewselector1]);

    const separator = () => {
        return <View style={{ borderColor: colors.lightgrey, borderWidth: 0.75, width: "90%", marginLeft: "5%" }} />
    }

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <ScrollView
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                    />
                }
            >
                <StatusBar backgroundColor={colors.primary} barStyle='light-content' />
                <View style={{ height: "100%", width: "100%", justifyContent: "flex-start" }}>

                    {isLoaded ? (
                        <View style={{}}>
                            <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: "100%" }} />
                        </View>
                    ) : (
                        <>
                            {
                                notificationData.length > 0 ?
                                    <FlatList
                                        data={notificationData}
                                        renderItem={({ item }) =>
                                            item.title === 'Lead' ?
                                                <LeadsNotification
                                                    from={item.from}
                                                    timefrom_now={item.timefrom_now}
                                                    id={item.id}
                                                    count={item.count}
                                                    leads={item.count}
                                                    data={notificationEntireData}
                                                    meeting_id={item.lead_details.meeting_id}
                                                    notification_id={item.notification_id}
                                                    is_new={item.is_new} /> :
                                                item.title === 'Thankyou' ?
                                                    <ThankyouNotification
                                                        from={item.from}
                                                        thankyou={item.amount}
                                                        timefrom_now={item.timefrom_now}
                                                        id={item.id}
                                                        data={notificationData}
                                                        notification_id={item.notification_id}
                                                        is_new={item.is_new} /> : <></>
                                            // commented based on Vikram statement that we are not going to send upcoming meeting notification for every user
                                            // <UpcomingMeetingNotification
                                            //     from={item.from}
                                            //     timefrom_now={item.timefrom_now}
                                            //     meeting_name={item.meeting_details.meeting_name}
                                            //     meeting_date={item.meeting_details.meeting_date}
                                            //     start_time={item.meeting_details.start_time}
                                            //     end_time={item.meeting_details.end_time}
                                            //     meeting_venue={item.meeting_details.meeting_venue}
                                            //     id={item.id}
                                            //     data={item} />
                                        }
                                        keyExtractor={item => item.id}
                                        ItemSeparatorComponent={separator}
                                        initialNumToRender="100"
                                    />
                                    :
                                    <View style={{ justifyContent: "center", alignItems: "center", marginTop: "80%" }}>

                                        <Ionicons name={"notifications-off-outline"} size={25} color={colors.primary} />
                                        <Text style={{ fontSize: height * 0.018, fontFamily: "SemiBold", color: colors.grey }}>No Notifications</Text>

                                    </View>
                            }
                        </>
                    )}
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}
export default NotificationScreen;
