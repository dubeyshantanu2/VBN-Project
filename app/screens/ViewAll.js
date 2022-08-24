import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { View, StatusBar, Image, Dimensions, SafeAreaView, Text, ScrollView, RefreshControl } from 'react-native';
import OverViewtwo from '../components/OverViewtwo';
import colors from '../config/colors';
import { useSelector } from 'react-redux';
import { Menu, MenuOptions, MenuOption, MenuTrigger } from 'react-native-popup-menu';
import { Ionicons } from '@expo/vector-icons';
import DatePicker from 'react-native-neat-date-picker';
import { useNavigation } from '@react-navigation/native';
import moment from 'moment';
import env from '../config/env';

const { height } = Dimensions.get('window');

const wait = (timeout) => {
    return new Promise(resolve => setTimeout(resolve, timeout));
}
const ViewAll = ({ route }) => {
    const selector = route.params.selector;
    const name = route.params.name;
    const selectedDate = route.params.selectedDate;
    const noMeeting = route.params.noMeeting;

    const navigation = useNavigation();

    const token = useSelector(state => state.AuthReducers.accessToken);

    const [givenLeads, setGivenLeads] = useState([]);
    const [recievedLeads, setRecievedLeads] = useState([]);

    const [allAsk, setAllAsk] = useState([]);
    const [myAsk, setMyAsk] = useState([]);

    const [givenThankyou, setGivenThankyou] = useState([]);
    const [recievedthankyou, setRecievedthankyou] = useState([]);

    const [myVisitor, setMyVisitor] = useState([]);
    const [allVisitor, setAllVisitor] = useState([]);

    const [leadGivenCountDiff, setLeadGivenCountDiff] = useState([]);
    const [leadReceivedCountDiff, setLeadReceivedCountDiff] = useState([]);

    const [thankyouGivenCountDiff, setThankyouGivenCountDiff] = useState([]);
    const [thankyouReceivedCountDiff, setThankyouReceivedCountDiff] = useState([]);

    const [visitorGivenCountDiff, setVisitorGivenCountDiff] = useState([]);
    const [visitorReceivedCountDiff, setVisitorReceivedCountDiff] = useState([]);

    const [askGivenCountDiff, setAskGivenCountDiff] = useState([]);
    const [askReceivedCountDiff, setAskReceivedCountDiff] = useState([]);

    const [viewname, setViewname] = useState(name);
    const [viewselector, setViewselector] = useState(selector);

    const [showDatePicker, setShowDatePicker] = useState(false);
    const [custom, setCustom] = useState(selectedDate);
    const [fromDate, setfromDate] = useState('');
    const [toDate, settoDate] = useState('');
    {/*const [currentDate, setCurrentDate] = useState('');*/ }
    const currentDate = new Date()
    const [refreshing, setRefreshing] = useState(false);
    const [viewselector1, setSelector1] = useState(0);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        setSelector1(viewselector1 => ++viewselector1)
        wait(1000).then(() => setRefreshing(false));
    }, []);


    useEffect(() => {
        axios({
            method: "GET",
            url: `${env.endpointURL}/leads?selector=${viewselector}`,
            headers: {
                'Cookie': `jwt=${token}`,
            },
        })
            .then(function (res) {
                setGivenLeads(res.data.givenLeadsCount);
                setRecievedLeads(res.data.receivedLeadsCount);
                if (res.data.graphData) {
                    setLeadGivenCountDiff(res.data.graphData.givenCountDiff);
                    setLeadReceivedCountDiff(res.data.graphData.receivedCountDiff);
                } else {
                    setLeadGivenCountDiff(0);
                    setLeadReceivedCountDiff(0);
                }
            })
            .catch(function (error) {
                console.log("error at leads api Viewall", error.message)
            })

    }, [viewselector, viewselector1]);

    useEffect(() => {
        axios({
            method: "GET",
            url: `${env.endpointURL}/asksgives?selector=${viewselector}`,
            headers: {
                'Cookie': `jwt=${token}`,
            },
        })
            .then(function (res) {
                setAllAsk(res.data.allAsksCount)
                setMyAsk(res.data.myAsksCount)
                if (res.data.graphData) {
                    setAskGivenCountDiff(res.data.graphData.givenCountDiff);
                    setAskReceivedCountDiff(res.data.graphData.receivedCountDiff);
                } else {
                    setAskGivenCountDiff(0);
                    setAskReceivedCountDiff(0);
                }
            })
            .catch(function (error) {
                console.log("error at asksgives api Viewall", error.message)
            })
    }, [viewselector, viewselector1]);

    useEffect(() => {
        axios({
            method: "GET",
            url: `${env.endpointURL}/thankyounotes?selector=${viewselector}`,
            headers: {
                'Cookie': `jwt=${token}`,
            },
        })
            .then(function (res) {
                setGivenThankyou(res.data.givenReferral);
                setRecievedthankyou(res.data.receivedReferral);
                if (res.data.graphData) {
                    setThankyouGivenCountDiff(res.data.graphData.givenCountDiff);
                    setThankyouReceivedCountDiff(res.data.graphData.receivedCountDiff);
                } else {
                    setThankyouGivenCountDiff(0);
                    setThankyouReceivedCountDiff(0);
                }
            })
            .catch(function (error) {
                console.log("error at thankyounotes api Viewall", error.message)
            })

    }, [viewselector, viewselector1]);

    useEffect(() => {
        axios({
            method: "GET",
            url: `${env.endpointURL}/visitors?selector=${viewselector}`,
            headers: {
                'Cookie': `jwt=${token}`,
            },
        })
            .then(function (res) {
                setMyVisitor(res.data.myVisitorsCount);
                setAllVisitor(res.data.allVisitorsCount);
                if (res.data.graphData) {
                    setVisitorGivenCountDiff(res.data.graphData.givenCountDiff);
                    setVisitorReceivedCountDiff(res.data.graphData.receivedCountDiff);
                } else {
                    setVisitorGivenCountDiff(0);
                    setVisitorReceivedCountDiff(0);
                }
            })
            .catch(function (error) {
                console.log("error at visitors api Viewall", error.message)
            })
    }, [viewselector, viewselector1]);


    const openDatePicker = () => {
        setShowDatePicker(true)
    }

    const onCancel = () => {
        setShowDatePicker(false)
    }


    const onConfirm = (output) => {
        const { startDate, startDateString, endDate, endDateString } = output
        setShowDatePicker(false)
        setCustom(startDateString + 'to' + endDateString)
        setViewselector(startDateString + 'to' + endDateString)
    }

    const colorOptions = {
        headerColor: colors.primary,
        backgroundColor: colors.white,
        selectedDateColor: colors.primary,
        changeYearModalColor: colors.primary,
        weekDaysColor: colors.primary,
        selectedDateBackgroundColor: colors.primary,
        confirmButtonColor: colors.primary,
    }


    const NewDate = moment(currentDate, 'DD-MM-YYYY')

    return (
        <SafeAreaView style={{ flex: 1, paddingHorizontal: "5%" }}>
            <StatusBar backgroundColor={colors.primary} barStyle='light-content' />
            <ScrollView
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}

                    />
                }
            >
                <View style={{ width: "100%", marginTop: "2%", justifyContent: "flex-end", flexDirection: "row", alignItems: "center" }}>
                    <View style={{ height: 20, width: "30%", flexDirection: "row", justifyContent: "flex-end" }}>
                        <Menu style={{ flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
                            <MenuTrigger style={{ paddingHorizontal: '2%', width: 120, flexDirection: "row", justifyContent: "flex-end", alignItems: "center" }}>
                                <Ionicons name={"calendar-outline"} size={height * 0.017} style={{ marginRight: "5%" }} color={colors.black} />
                                <Text style={{ fontFamily: "SemiBold", fontSize: height * 0.016, textAlign: "center" }}>{viewname}</Text>
                                <Ionicons name={"caret-down-outline"} size={height * 0.017} style={{ marginRight: "0.5%", marginLeft: "2%" }} color={colors.black} />
                            </MenuTrigger>

                            <MenuOptions optionsContainerStyle=
                                {{ marginTop: 20, padding: "8%", width: height * 0.16 }} >
                                <MenuOption value="all" onSelect={(value) => { setViewselector(value), setViewname("All") }}>
                                    <Text style={{ fontFamily: "SemiBold" }}>All</Text>
                                </MenuOption>
                                {!noMeeting ?
                                    <MenuOption value="thisfortnight" onSelect={(value) => { setViewselector(value), setViewname('This Fortnight') }} >
                                        <Text style={{ fontFamily: "SemiBold" }}>This Fortnight</Text>
                                    </MenuOption> :
                                    <MenuOption />
                                }
                                <MenuOption value="custom" onSelect={(value) => { setViewselector(custom), setViewname("Custom"), openDatePicker() }} >
                                    <Text style={{ fontFamily: "SemiBold" }}>Custom</Text>
                                </MenuOption>
                            </MenuOptions>

                        </Menu>

                        <DatePicker
                            isVisible={showDatePicker}
                            mode={'range'}
                            colorOptions={colorOptions}
                            onCancel={onCancel}
                            onConfirm={onConfirm}
                            maxDate={new Date(NewDate)}
                        />

                    </View>
                </View>
                <View style={{ flexDirection: "row", justifyContent: "space-around", paddingTop: "5%" }}>
                    {leadGivenCountDiff >= 0 && leadReceivedCountDiff >= 0 ? <OverViewtwo title={"LEADS"} leadGiven={givenLeads} leadRecieved={recievedLeads} increment={leadGivenCountDiff} incrementRec={leadReceivedCountDiff} name={viewname} selector={viewselector} selectedDate={custom} fromDate={fromDate} toDate={toDate} />
                        : leadGivenCountDiff >= 0 && leadReceivedCountDiff <= 0 ? <OverViewtwo title={"LEADS"} leadGiven={givenLeads} leadRecieved={recievedLeads} increment={leadGivenCountDiff} decrementRec={leadReceivedCountDiff} name={viewname} selector={viewselector} selectedDate={custom} fromDate={fromDate} toDate={toDate} />
                            : leadGivenCountDiff <= 0 && leadReceivedCountDiff >= 0 ? <OverViewtwo title={"LEADS"} leadGiven={givenLeads} leadRecieved={recievedLeads} decrement={leadGivenCountDiff} incrementRec={leadReceivedCountDiff} name={viewname} selector={viewselector} selectedDate={custom} fromDate={fromDate} toDate={toDate} />
                                : <OverViewtwo title={"LEADS"} leadGiven={givenLeads} leadRecieved={recievedLeads} decrement={leadGivenCountDiff} incrementRec={leadReceivedCountDiff} name={viewname} selector={viewselector} selectedDate={custom} fromDate={fromDate} toDate={toDate} />
                    }
                    {thankyouGivenCountDiff >= 0 && thankyouReceivedCountDiff >= 0 ? <OverViewtwo title={"THANK YOU NOTES"} leadGiven={givenThankyou} leadRecieved={recievedthankyou} increment={thankyouGivenCountDiff} incrementRec={thankyouReceivedCountDiff} name={viewname} selector={viewselector} selectedDate={custom} fromDate={fromDate} toDate={toDate} />
                        : thankyouGivenCountDiff >= 0 && thankyouReceivedCountDiff <= 0 ? <OverViewtwo title={"THANK YOU NOTES"} leadGiven={givenThankyou} leadRecieved={recievedthankyou} increment={thankyouGivenCountDiff} decrementRec={thankyouReceivedCountDiff} name={viewname} selector={viewselector} selectedDate={custom} fromDate={fromDate} toDate={toDate} />
                            : thankyouGivenCountDiff <= 0 && thankyouReceivedCountDiff >= 0 ? <OverViewtwo title={"THANK YOU NOTES"} leadGiven={givenThankyou} leadRecieved={recievedthankyou} decrement={thankyouGivenCountDiff} incrementRec={thankyouReceivedCountDiff} name={viewname} selector={viewselector} selectedDate={custom} fromDate={fromDate} toDate={toDate} />
                                : <OverViewtwo title={"THANK YOU NOTES"} leadGiven={givenThankyou} leadRecieved={recievedthankyou} decrement={thankyouGivenCountDiff} incrementRec={thankyouReceivedCountDiff} name={viewname} selector={viewselector} selectedDate={custom} fromDate={fromDate} toDate={toDate} />
                    }
                </View>

                <View style={{ flexDirection: "row", justifyContent: "space-around", marginTop: "4%" }}>
                    {askGivenCountDiff >= 0 && askReceivedCountDiff >= 0 ? <OverViewtwo title={"ASKS / GIVES"} leadGiven={myAsk} leadRecieved={allAsk} increment={askGivenCountDiff} incrementRec={askReceivedCountDiff} text1={"My"} text2={"All"} name={viewname} selector={viewselector} selectedDate={custom} fromDate={fromDate} toDate={toDate} />
                        : askGivenCountDiff >= 0 && askReceivedCountDiff <= 0 ? <OverViewtwo title={"ASKS / GIVES"} leadGiven={myAsk} leadRecieved={allAsk} increment={askGivenCountDiff} decrementRec={askReceivedCountDiff} text1={"My"} text2={"All"} name={viewname} selector={viewselector} selectedDate={custom} fromDate={fromDate} toDate={toDate} />
                            : askGivenCountDiff <= 0 && askReceivedCountDiff >= 0 ? <OverViewtwo title={"ASKS / GIVES"} leadGiven={myAsk} leadRecieved={allAsk} decrement={askGivenCountDiff} incrementRec={askReceivedCountDiff} text1={"My"} text2={"All"} name={viewname} selector={viewselector} selectedDate={custom} fromDate={fromDate} toDate={toDate} />
                                : <OverViewtwo title={"ASKS / GIVES"} leadGiven={myAsk} leadRecieved={allAsk} decrement={askGivenCountDiff} decrementRec={askReceivedCountDiff} text1={"My"} text2={"All"} name={viewname} selector={viewselector} selectedDate={custom} fromDate={fromDate} toDate={toDate} />
                    }
                    {visitorGivenCountDiff >= 0 && visitorReceivedCountDiff >= 0 ? <OverViewtwo title={"VISITORS"} leadGiven={myVisitor} leadRecieved={allVisitor} increment={visitorGivenCountDiff} incrementRec={visitorReceivedCountDiff} text1={"My Visitors"} text2={"All Visitors"} name={viewname} selector={viewselector} selectedDate={custom} fromDate={fromDate} toDate={toDate} />
                        : visitorGivenCountDiff >= 0 && visitorReceivedCountDiff <= 0 ? <OverViewtwo title={"VISITORS"} leadGiven={myVisitor} leadRecieved={allVisitor} increment={visitorGivenCountDiff} decrementRec={visitorReceivedCountDiff} text1={"My Visitors"} text2={"All Visitors"} name={viewname} selector={viewselector} selectedDate={custom} fromDate={fromDate} toDate={toDate} />
                            : visitorGivenCountDiff <= 0 && visitorReceivedCountDiff >= 0 ? <OverViewtwo title={"VISITORS"} leadGiven={myVisitor} leadRecieved={allVisitor} decrement={visitorGivenCountDiff} incrementRec={visitorReceivedCountDiff} text1={"My Visitors"} text2={"All Visitors"} name={viewname} selector={viewselector} selectedDate={custom} fromDate={fromDate} toDate={toDate} />
                                : <OverViewtwo title={"VISITORS"} leadGiven={myVisitor} leadRecieved={allVisitor} decrement={visitorGivenCountDiff} decrementRec={visitorReceivedCountDiff} text1={"My Visitors"} text2={"All Visitors"} name={viewname} selector={viewselector} selectedDate={custom} fromDate={fromDate} toDate={toDate} />
                    }

                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default ViewAll;