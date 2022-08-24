import React, { useState, useEffect } from 'react';
import { TouchableOpacity, StatusBar, View, FlatList, Dimensions, SafeAreaView, Text, StyleSheet } from 'react-native';
import colors from '../config/colors';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import moment from 'moment';
import MeetingCardDetails from '../components/MeetingCardDetails';
import env from '../config/env';

const { height, width } = Dimensions.get('window');

const listTab = [
    {
        status: "Upcoming"
    },
    {
        status: "Past"
    }
]

const ViewDetails = ({ route }) => {
    const [status, setStatus] = useState('Upcoming');
    const navigation = useNavigation();
    const setStatusFilter = status => {
        setStatus(status)
    }
    const token = useSelector(state => state.AuthReducers.accessToken);
    const [upcomingMeeting, setUpcomingMeeting] = useState([]);
    const [pastMeeting, setPastMeeting] = useState([]);


    useEffect(() => {
        axios({
            method: "GET",
            url: `${env.endpointURL}/meetings`,
            headers: {
                'Cookie': `jwt=${token}`,
            },
        })
            .then(function (res) {
                var upcoming_meetings = [];
                var past_meetings = [];
                for (var i = 0; i < res.data.length; i++) {
                    if (res.data[i].status == 'upcoming') {
                        upcoming_meetings.push(res.data[i]);
                    }
                    if (res.data[i].status == 'past') {
                        past_meetings.push(res.data[i]);
                    }
                }
                setUpcomingMeeting(sortByDateUpcoming(upcoming_meetings))
                setPastMeeting(sortByDate(past_meetings))
            })
            .catch(function (error) {
                console.log("error at meeting api in viewDetails", error.message)
            })
    }, []);

    const sortByDate = (array) => {
        const sorter = (a, b) => {
            return new Date(b.meeting_date).getTime() - new Date(a.meeting_date).getTime();
        }
        return array.sort(sorter);
    }

    const sortByDateUpcoming = (array) => {
        const sorter = (a, b) => {
            return new Date(a.meeting_date).getTime() - new Date(b.meeting_date).getTime();
        }
        return array.sort(sorter);
    }

    const ItemView = ({ item }) => {
        return (
            status === 'Upcoming' ?
                <MeetingCardDetails
                    meetingName={item.meeting_name}
                    location={item.meeting_venue}
                    start={moment(item.start_time, ["HH.mm"]).format("hh:mm A")}
                    end={moment(item.end_time, ["HH.mm"]).format("hh:mm A")}
                    meeting_date={item.meeting_date}
                    // date={(moment(item.meeting_date).format('DD'))}
                    item={item}
                /> :
                <MeetingCardDetails
                    meetingName={item.meeting_name}
                    location={item.meeting_venue}
                    start={moment(item.start_time, ["HH.mm"]).format("hh:mm A")}
                    end={moment(item.end_time, ["HH.mm"]).format("hh:mm A")}
                    meeting_date={item.meeting_date}
                    // date={(moment(item.meeting_date).format('DD'))}
                    item={item}
                />
        )
    }

    const separator = () => {
        return <View style={{ borderColor: "white", borderWidth: 6 }} />
    }

    return (
        <SafeAreaView style={{ height: "90%" }}>
            <StatusBar backgroundColor={colors.primary} barStyle='light-content' />
            <View style={styles.listTab}>
                {
                    listTab.map(e => (
                        <TouchableOpacity
                            style={[styles.btnTab, status === e.status && styles.btnTabActive]}
                            onPress={() => setStatusFilter(e.status)}>
                            <Text style={[styles.textTab, status === e.status && styles.textTabActive]}>{e.status}</Text>
                        </TouchableOpacity>
                    ))
                }
            </View>

            <View style={{ width: "100%", height: "100%" }}>
                <FlatList
                    data={status === 'Upcoming' ? upcomingMeeting : pastMeeting}
                    keyExtractor={item => item.id}
                    renderItem={ItemView}
                    showsVerticalScrollIndicator={false}
                    ItemSeparatorComponent={separator}
                />
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    listTab: {
        flexDirection: "row",
        alignSelf: 'center',
        marginBottom: 20,
        width: "100%",
        marginLeft: "8%",
        marginTop: "4%"
    },
    btnTab: {
        width: width * 0.45,
        flexDirection: "row",
        borderWidth: 0.5,
        marginRight: '2%',
        borderColor: colors.primary,
        padding: 10,
        borderRadius: 5,
        justifyContent: "center",
    },
    textTab: {
        fontSize: 10,
        color: colors.black
    },
    btnTabActive: {
        backgroundColor: colors.primary
    },
    textTabActive: {
        color: "#fff"
    },
    itemContainer: {
        flexDirection: 'row',
        paddingVertical: 15,
    },
});

export default ViewDetails;
