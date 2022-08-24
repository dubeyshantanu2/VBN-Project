
import React, { useState, useEffect } from 'react'
import { StatusBar, Image, Dimensions, StyleSheet, TouchableOpacity, SafeAreaView, Button, Text, View, FlatList, ScrollView } from 'react-native';
import colors from '../config/colors';
import { Transition, Transitioning } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import MemberList from '../components/MemberList';
import AskGiveCardDetails from "../components/AskGiveCardDetails";
import moment from 'moment';
import env from '../config/env';
import { useSelector } from 'react-redux';
import axios from 'axios';
import LeadCardDetails from "../components/LeadCardDetails";
import ThankyouCardDetails from "../components/ThankyouCardDetails";
import VisitorCardDetails from "../components/VisitorCardDetails";
import { forEach } from 'lodash';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import TabBar from 'react-native-underline-tabbar';
import { ButtonGroup } from '@rneui/themed';

const { height, width } = Dimensions.get('window');

const transition = (
    <Transition.Together>
        <Transition.In type='fade' durationMs={200} />
        <Transition.Change />
        <Transition.Out type='fade' durationMs={200} />
    </Transition.Together>
);

const MeetingDetailScreen = ({ route }) => {
    const meeting = route.params.meeting
    const token = useSelector(state => state.AuthReducers.accessToken);
    const first_name = useSelector(state => state.AuthReducers.first_name);
    const last_name = useSelector(state => state.AuthReducers.last_name);
    const user_id = useSelector(state => state.AuthReducers.user_id);
    const [givenLeads, setGivenLeads] = useState([]);
    const [recievedLeads, setRecievedLeads] = useState([]);
    const [givenThankyou, setGivenThankyou] = useState([]);
    const [recievedthankyou, setRecievedthankyou] = useState([]);
    const [myAsk, setMyAsk] = useState([]);
    const [allAsk, setAllAsk] = useState([]);
    const [myVisitor, setMyVisitor] = useState([]);
    const [allVisitor, setAllVisitor] = useState([]);
    const [userData, setUserData] = useState([]);
    const [presenters, setPresenters] = useState();
    const [GivenLeadsCount, setGivenLeadsCount] = useState(null);
    const [ThankyouAmount, setThankyouAmount] = useState();
    const [VisitorsCount, setVisitorsCount] = useState();
    const [RatingsCount, setRatingsCount] = useState();
    const [AsksCount, setAsksCount] = useState();
    const [GivesCount, setGivesCount] = useState();
    const [refresh, setRefresh] = useState(0);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [visitorStatus, setVisitorStatus] = useState(0);
    const [askgiveStatus, setAskgiveStatus] = useState(0);

    // const ref = React.useRef();
    const [currentIndex, setCurrentIndex] = useState(null);
    const [icon, setIcon] = useState(null);
    const [status, setStatus] = useState('Details');
    const setStatusFilter = status => {
        setStatus(status)
    }
    // const [askgiveStatus, setOption] = useState('My Ask/Give');
    // const setOptionFilter = askgiveStatus => {
    //     setOption(askgiveStatus)
    // }

    const [leadStatus, setleadStatus] = useState('Received');
    const LeadStatus = leadStatus => {
        setleadStatus(leadStatus)
    }

    const [thankStatus, setthankStatus] = useState('Received');
    const ThankStatus = thankStatus => {
        setthankStatus(thankStatus)
    }

    // const [visitorStatus, setvisitorStatus] = useState('My Visitors');
    // const VisitorStatus = visitorStatus => {
    //     setvisitorStatus(visitorStatus)
    // }

    useEffect(() => {
        axios({
            method: "GET",
            url: `${env.endpointURL}/meetings/${meeting.id}`,
            headers: {
                'Cookie': `jwt=${token}`,
            },
        })
            .then(function (res) {
                // setRefresh(refrsh => ++refrsh)
                setGivenLeadsCount(res.data.leadsCount);
                setThankyouAmount(res.data.thankyouAmount);
                setVisitorsCount(res.data.visitors.allVisitorsCount);
                setRatingsCount(res.data.ratingsCount);
                setAsksCount(res.data.asksCount);
                setGivesCount(res.data.givesCount);
                setGivenLeads(res.data.leads.filter(data => data.lead_by_user_id == user_id));
                setRecievedLeads(res.data.leads.filter(data => data.lead_to_user_id == user_id))
                setGivenThankyou(res.data.thankyou.filter(data => data.thankyou_by_user_id == user_id));
                setRecievedthankyou(res.data.thankyou.filter(data => data.thankyou_to_user_id == user_id));
                setMyAsk(res.data.asksgives.myAsks)
                setAllAsk(res.data.asksgives.allAsks)
                setMyVisitor(res.data.visitors.myVisitors);
                setAllVisitor(res.data.visitors.allVisitors);

                var presentersData = [];

                let URLs = [
                    `${env.endpointURL}/users/${res.data.presenter_1}`,
                    `${env.endpointURL}/users/${res.data.presenter_2}`
                ]

                function getPresentersData(URLs) {
                    return Promise.all(URLs.map(fetchData));
                }

                function fetchData(URL) {
                    return axios
                        .get(URL, {
                            headers: {
                                'Cookie': `jwt=${token}`,
                            }
                        })
                        .then((response) => {
                            return {
                                success: true,
                                data: response.data.data
                            };
                        })
                        .catch((error) => {
                            return { success: false };
                        });
                }

                getPresentersData(URLs).then((values) => {
                    forEach(values, function (result) {
                        if (result.success) {
                            presentersData.push(result.data)
                        }
                    })
                    setPresenters(presentersData)
                }).catch((e) => {
                    console.log(e)
                })
            })
            .catch(function (error) {
                console.log("error at leads api in meetingdetails screen", error.message)
            })

    }, [refresh]);

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
                console.log("error at member list api leaddetails", error.message)
            })
    }, [refresh]);

    const ItemView = ({ item }) => {
        if (item.ask) var invited_by_user = userData.find(user => user.id == item.ask.user_id);
        else var invited_by_user = null
        // console.log("item!!", item);
        return (
            selectedIndex === 0 ?
                <AskGiveCardDetails ask={item.ask ? item.ask.description : null} date={item.ask ? (moment(item.ask.created_at).format('DD-MM-YYYY')) : null}
                    replies={item.givesCount} status={askgiveStatus} ask_give={item.ask.record_type} />
                : <AskGiveCardDetails ask={item.ask ? item.ask.description : null} date={item.ask ? (moment(item.ask.created_at).format('DD-MM-YYYY')) : null}
                    askedBy={invited_by_user ? (invited_by_user.first_name + ' ' + invited_by_user.last_name) : invited_by_user}
                    replies={item.givesCount} status={askgiveStatus} ask_give={item.ask.record_type} />
        )
    }

    // const aksGiveItemView = ({ item, index }) => {
    //     if (item.ask) var invited_by_user = userData.find(user => user.id == item.ask.user_id);
    //     else var invited_by_user = null
    //     return (
    //         askgiveStatus === 'My Ask/Give' ?
    //             <AskGiveCardDetails keys={index} ask={item.ask ? item.ask.description : null}
    //                 date={item.ask ? (moment(item.ask.created_at).format('YYYY-MM-DD')) : null} replies={item.givesCount}
    //                 status={askgiveStatus} ask_give={item.ask.record_type} />
    //             : <AskGiveCardDetails keys={index} ask={item.ask ? item.ask.description : null}
    //                 date={item.ask ? (moment(item.ask.created_at).format('YYYY-MM-DD')) : null}
    //                 askedBy={invited_by_user ? (invited_by_user.first_name + ' ' + invited_by_user.last_name) : invited_by_user}
    //                 replies={item.givesCount} status={askgiveStatus} ask_give={item.ask.record_type} />
    //     )
    // }

    // const ItemView = ({ item, index }) => {
    //     var given_to_user = userData.find(user => user.id == item.lead_to_user_id);
    //     var received_from_user = userData.find(user => user.id == item.lead_by_user_id);
    //     // var thank_given_to_user = userData.find(user => user.id == item.thankyou_to_user_id);
    //     // var thank_received_from_user = userData.find(user => user.id == item.thankyou_by_user_id);

    //     return (
    //         leadStatus === 'Received' ?
    //             <LeadCardDetails key={index} name={item.lead_name} date={(moment(item.created_at).format('YYYY-MM-DD'))} email={item.lead_email} phone={item.lead_phone_number} receivedFrom={received_from_user ? (received_from_user.first_name + ' ' + received_from_user.last_name) : null} status={leadStatus} description={item.lead_description} />
    //             : <LeadCardDetails key={index} name={item.lead_name} date={(moment(item.created_at).format('YYYY-MM-DD'))} email={item.lead_email} phone={item.lead_phone_number} givenTo={given_to_user ? (given_to_user.first_name + ' ' + given_to_user.last_name) : null} status={leadStatus} description={item.lead_description} />
    //     )
    // }

    // const ItemViewThankyou = ({ item, index }) => {
    //     var thank_given_to_user = userData.find(user => user.id == item.thankyou_to_user_id);
    //     var thank_received_from_user = userData.find(user => user.id == item.thankyou_by_user_id);
    //     return (
    //         thankStatus === 'Received' ?
    //             <ThankyouCardDetails key={index} amount={item.thankyou_amount} date={(moment(item.created_at).format('YYYY-MM-DD'))} description={item.thankyou_description} receivedFrom={thank_received_from_user ? (thank_received_from_user.first_name + ' ' + thank_received_from_user.last_name) : null}
    //                 status={thankStatus} picture={thank_received_from_user ? thank_received_from_user.profile_picture : null} rosterId={thank_received_from_user ? thank_received_from_user.roster_id : null} />
    //             : <ThankyouCardDetails key={index} amount={item.thankyou_amount} date={(moment(item.created_at).format('YYYY-MM-DD'))} description={item.thankyou_description} givenTo={thank_given_to_user ? (thank_given_to_user.first_name + ' ' + thank_given_to_user.last_name) : null}
    //                 status={thankStatus} picture={thank_given_to_user ? thank_given_to_user.profile_picture : null} rosterId={thank_given_to_user ? thank_given_to_user.roster_id : null} />
    //     )
    // }
    const visitorItemView = ({ item, index }) => {
        var invited_by_user = userData.find(user => user.id == item.invited_by_user_id);
        return (
            visitorStatus === 'My Visitors' ?
                <VisitorCardDetails keys={index} name={item.name} date={(moment(item.created_at).format('YYYY-MM-DD'))} company={item.company_name} phone={item.mobile} meeting={meeting.meeting_name} email={item.email} invitedBy={first_name + ' ' + last_name} />
                : <VisitorCardDetails keys={index} name={item.name} date={(moment(item.created_at).format('YYYY-MM-DD'))} company={item.company_name} phone={item.mobile} meeting={meeting.meeting_name} email={item.email} invitedBy={invited_by_user ? (invited_by_user.first_name + ' ' + invited_by_user.last_name) : null} />
        )
    }
    const separator = () => {
        return <View style={{ borderColor: "white", borderWidth: 6 }} />
    }

    function abbreviate_number(num) {
        if (num >= 10000000) {
            return (num / 10000000).toFixed(1).replace(/\.0$/, '') + 'Cr';
        }
        if (num >= 100000) {
            return (num / 100000).toFixed(1).replace(/\.0$/, '') + 'L';
        }
        if (num >= 1000) {
            return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
        }
        if (num < 0) {
            if (num.toString().length === 4) return num;
            if (num.toString().length === 5 || num.toString().length === 6) return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
            if (num.toString().length === 7 || num.toString().length === 8) return (num / 100000).toFixed(1).replace(/\.0$/, '') + 'L';
            if (num.toString().length >= 9) return (num / 10000000).toFixed(1).replace(/\.0$/, '') + 'Cr';
        }
        return num;
    }
    return (

        <SafeAreaView style={{ flex: 1, backgroundColor: colors.primary }}>
            <StatusBar backgroundColor={colors.primary} barStyle='light-content' />
            <View style={{ justifyContent: "flex-start", alignItems: "center" }}>
                <View style={{ width: "100%", height: 100, flexDirection: "row", alignItems: "center" }}>
                    <View style={{ height: "90%", width: "15%", backgroundColor: "white", borderRadius: 15, marginLeft: "10%", justifyContent: "flex-start", alignItems: "center" }}>
                        <Text style={{ fontSize: height * 0.028, marginTop: "20%", fontFamily: "Bold" }}>{moment(meeting.meeting_date).format("D")}</Text>
                        <Text style={{ fontSize: height * 0.016, fontFamily: "SemiBold", marginTop: "2%" }}>{moment(meeting.meeting_date).format("MMM")}</Text>
                        <Text style={{ fontSize: height * 0.016, fontFamily: "SemiBold", marginTop: "2%" }}>{moment(meeting.meeting_date).format("YYYY")}</Text>
                    </View>
                    <View style={{ height: "100%", width: "70%", marginLeft: "4%", alignItems: "flex-start", justifyContent: "center" }}>
                        <Text style={{ fontSize: height * 0.023, fontFamily: "Medium", color: colors.white }}>{meeting.meeting_venue}</Text>
                        <Text style={{ fontSize: height * 0.016, fontFamily: "Medium", color: colors.white }}>{moment(meeting.meeting_date).format('dddd')}, {moment(meeting.start_time, ["HH.mm"]).format("hh:mm A")} - {moment(meeting.end_time, ["HH.mm"]).format("hh:mm A")}</Text>
                    </View>
                </View>

                <View style={{ backgroundColor: colors.white, width: "100%", height: "100%", marginTop: "4%", borderTopLeftRadius: 25, borderTopRightRadius: 25 }}>

                    <ButtonGroup
                        buttons={['Details', `Visitors (${allVisitor.length})`, `Asks/Gives (${allAsk.length})`]}
                        selectedIndex={selectedIndex}
                        containerStyle={{ borderRadius: 8, marginTop: 20 }}
                        onPress={(value) => {
                            setSelectedIndex(value);
                        }}
                        selectedButtonStyle={{ backgroundColor: colors.primary }}
                        textStyle={{ fontFamily: "Bold" }}
                    />

                    {
                        selectedIndex === 0
                            ?
                            <>
                                <View style={{ height: "62%", width }}>
                                    <View style={{ width: "100%", height: 30, backgroundColor: colors.lightgrey, marginTop: "2%", justifyContent: "center" }}>
                                        <Text style={{ fontSize: height * 0.015, fontFamily: "Bold", marginLeft: "4%" }}>Meeting Summary</Text>
                                    </View>
                                    <View style={{ width: "92%", margin: "4%", }}>
                                        <View style={{ flexDirection: "row", width: "100%", justifyContent: "space-between" }}>
                                            <View style={{ borderRadius: 5, width: width * 0.285, height: height * 0.08, backgroundColor: colors.lightgrey }}>
                                                <Text style={{ fontFamily: "Bold", fontSize: height * 0.013, marginLeft: "10%", marginTop: "8%" }}>Leads</Text>
                                                <Text style={{ fontFamily: "Bold", fontSize: height * 0.022, marginLeft: "10%", marginTop: "8%" }}>{GivenLeadsCount}</Text>
                                            </View>
                                            <View style={{ marginLeft: "4%", borderRadius: 5, width: width * 0.285, height: height * 0.08, backgroundColor: colors.lightgrey }}>
                                                <Text style={{ fontFamily: "Bold", fontSize: height * 0.013, marginLeft: "10%", marginTop: "8%" }}>Thank You Note</Text>
                                                <Text style={{ fontFamily: "Bold", fontSize: height * 0.022, marginLeft: "10%", marginTop: "8%" }}>{abbreviate_number(ThankyouAmount)}</Text>
                                            </View>
                                            <View style={{ marginLeft: "4%", borderRadius: 5, width: width * 0.285, height: height * 0.08, backgroundColor: colors.lightgrey }}>
                                                <Text style={{ fontFamily: "Bold", fontSize: height * 0.013, marginLeft: "10%", marginTop: "8%" }}>Visitors</Text>
                                                <Text style={{ fontFamily: "Bold", fontSize: height * 0.022, marginLeft: "10%", marginTop: "8%" }}>{VisitorsCount}</Text>
                                            </View>
                                        </View>
                                        <View style={{ flexDirection: "row", width: "100%", justifyContent: "space-between", marginTop: "4%" }}>
                                            <View style={{ borderRadius: 5, width: width * 0.285, height: height * 0.08, backgroundColor: colors.lightgrey }}>
                                                <Text style={{ fontFamily: "Bold", fontSize: height * 0.013, marginLeft: "10%", marginTop: "8%" }}>Asks</Text>
                                                <Text style={{ fontFamily: "Bold", fontSize: height * 0.022, marginLeft: "10%", marginTop: "8%" }}>{AsksCount}</Text>
                                            </View>
                                            <View style={{ marginLeft: "4%", borderRadius: 5, width: width * 0.285, height: height * 0.08, backgroundColor: colors.lightgrey }}>
                                                <Text style={{ fontFamily: "Bold", fontSize: height * 0.013, marginLeft: "10%", marginTop: "8%" }}>Gives</Text>
                                                <Text style={{ fontFamily: "Bold", fontSize: height * 0.022, marginLeft: "10%", marginTop: "8%" }}>{GivesCount}</Text>
                                            </View>
                                            <View style={{ marginLeft: "4%", borderRadius: 5, width: width * 0.285, height: height * 0.08, backgroundColor: colors.lightgrey }}>
                                                <Text style={{ fontFamily: "Bold", fontSize: height * 0.013, marginLeft: "10%", marginTop: "8%" }}>Attendees</Text>
                                                <Text style={{ fontFamily: "Bold", fontSize: height * 0.022, marginLeft: "10%", marginTop: "8%" }}>{RatingsCount}</Text>
                                            </View>
                                        </View>
                                    </View>
                                    <View style={{ width: "100%", height: 30, backgroundColor: colors.lightgrey, justifyContent: "center" }}>
                                        <Text style={{ fontSize: height * 0.015, fontFamily: "Bold", marginLeft: "4%" }}>8 Minute Presenters</Text>
                                    </View>
                                    {
                                        presenters != undefined && presenters.length != 0
                                            ?
                                            <>
                                                <View style={{ marginLeft: "2%", marginRight: "2%", marginTop: "2%" }}>
                                                    <FlatList
                                                        data={presenters}
                                                        renderItem={({ item }) =>
                                                            <MemberList image={item.profile_picture}
                                                                firstName={item.first_name} lastName={item.last_name} category={item.category}
                                                                firm_name={item.firm_name} id={item.id} rosterId={item.roster_id} />}
                                                        keyExtractor={item => item.id}
                                                    />
                                                </View>
                                            </>
                                            :
                                            <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", width: "92%" }}>
                                                <View style={{ alignItems: "center", marginVertical: "30%" }}>
                                                    <Ionicons name={"cloud-offline-outline"} size={20} color={colors.primary} />
                                                    <Text style={{ fontSize: height * 0.015, fontFamily: "SemiBold", color: colors.grey }}>No Presenters</Text>
                                                </View>
                                            </View>
                                    }
                                </View>

                            </>
                            // commented Leads Thankyounotes code as per shyam's statement on 12th May
                            // :
                            // status === 'Leads'
                            //     ?
                            //     <>
                            //         <View style={styles.listTab}>
                            //             {
                            //                 leads.map(e => (
                            //                     <TouchableOpacity
                            //                         style={[styles.btnTabLead, leadStatus === e.leadStatus && styles.btnTabActive]}
                            //                         onPress={() => LeadStatus(e.leadStatus)}>
                            //                         <Text style={[styles.textTab, leadStatus === e.leadStatus && styles.textTabActive]}>{e.leadStatus}</Text>
                            //                     </TouchableOpacity>
                            //                 ))
                            //             }
                            //         </View>
                            //         {leadStatus == 'Received' && recievedLeads.length !== 0 ?
                            //             <FlatList
                            //                 data={recievedLeads}
                            //                 keyExtractor={item => item.id}
                            //                 renderItem={ItemView}
                            //                 showsVerticalScrollIndicator={false}
                            //                 ItemSeparatorComponent={separator}
                            //                 initialNumToRender={10}
                            //             /> :
                            //             leadStatus == 'Given' && givenLeads.length !== 0 ?
                            //                 <FlatList
                            //                     data={givenLeads}
                            //                     keyExtractor={item => item.id}
                            //                     renderItem={ItemView}
                            //                     showsVerticalScrollIndicator={false}
                            //                     ItemSeparatorComponent={separator}
                            //                     initialNumToRender={10}
                            //                 />
                            //                 :
                            //                 <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", width: "92%" }}>
                            //                     <View style={{ alignItems: "center", marginVertical: "30%" }}>
                            //                         <Ionicons name={"cloud-offline-outline"} size={40} color={colors.primary} />
                            //                         <Text style={{ fontSize: height * 0.015, fontFamily: "SemiBold", color: colors.grey }}>No Data Found</Text>
                            //                     </View>
                            //                 </View>
                            //         }
                            //     </>
                            :
                            selectedIndex === 1
                                ?
                                <>
                                    <ButtonGroup
                                        buttons={[`My Visitors (${myVisitor.length})`, `All Visitors  (${allVisitor.length})`]}
                                        selectedIndex={visitorStatus}
                                        containerStyle={{ borderRadius: 8, height: 35 }}
                                        onPress={(value) => {
                                            setVisitorStatus(value);
                                        }}
                                        selectedButtonStyle={{ backgroundColor: colors.primary }}
                                        textStyle={{ fontFamily: "Bold", fontSize: height * 0.015 }}
                                    />

                                    {
                                        visitorStatus === 0 ?
                                            <>
                                                <View style={{ width: "100%", height: "53%" }}>
                                                    {
                                                        myVisitor.length !== 0 ?
                                                            <FlatList
                                                                data={myVisitor}
                                                                keyExtractor={item => item.id}
                                                                renderItem={visitorItemView}
                                                                showsVerticalScrollIndicator={false}
                                                                ItemSeparatorComponent={separator}
                                                                initialNumToRender={10}
                                                            />
                                                            :
                                                            <View style={{ justifyContent: "center", alignItems: "center", width: "100%" }}>
                                                                <View style={{ alignItems: "center", marginTop: "50%" }}>
                                                                    <Ionicons name={"cloud-offline-outline"} size={40} color={colors.primary} />
                                                                    <Text style={{ fontSize: height * 0.015, fontFamily: "SemiBold", color: colors.grey }}>No Data Found</Text>
                                                                </View>
                                                            </View>
                                                    }
                                                </View>
                                            </>
                                            :
                                            <>
                                                <View style={{ width: "100%", height: "53%" }}>
                                                    {
                                                        allVisitor.length !== 0 ?
                                                            <FlatList
                                                                data={allVisitor}
                                                                keyExtractor={item => item.id}
                                                                renderItem={visitorItemView}
                                                                showsVerticalScrollIndicator={false}
                                                                ItemSeparatorComponent={separator}
                                                                initialNumToRender={10}
                                                            />
                                                            :
                                                            <View style={{ justifyContent: "center", alignItems: "center", width: "100%" }}>
                                                                <View style={{ alignItems: "center", marginTop: "50%" }}>
                                                                    <Ionicons name={"cloud-offline-outline"} size={40} color={colors.primary} />
                                                                    <Text style={{ fontSize: height * 0.015, fontFamily: "SemiBold", color: colors.grey }}>No Data Found</Text>
                                                                </View>
                                                            </View>
                                                    }
                                                </View>
                                            </>
                                    }
                                </>
                                :
                                <>
                                    <ButtonGroup
                                        buttons={[`My Asks/Gives (${myAsk.length})`, `All Asks/Gives (${allAsk.length})`]}
                                        selectedIndex={askgiveStatus}
                                        containerStyle={{ borderRadius: 8, height: 35 }}
                                        onPress={(value) => {
                                            setAskgiveStatus(value);
                                        }}
                                        selectedButtonStyle={{ backgroundColor: colors.primary }}
                                        textStyle={{ fontFamily: "Bold", fontSize: height * 0.015 }}
                                    />

                                    {
                                        askgiveStatus === 0 ?
                                            <>
                                                <View style={{ width: "100%", height: "53%" }}>
                                                    {
                                                        myAsk.length > 0 ?
                                                            <FlatList
                                                                data={myAsk}
                                                                keyExtractor={(item) => item.id}
                                                                renderItem={ItemView}
                                                                showsVerticalScrollIndicator={false}
                                                                ItemSeparatorComponent={separator}
                                                            />
                                                            :
                                                            <View style={{ justifyContent: "center", alignItems: "center", width: "100%" }}>
                                                                <View style={{ alignItems: "center", marginTop: "50%" }}>
                                                                    <Ionicons name={"cloud-offline-outline"} size={40} color={colors.primary} />
                                                                    <Text style={{ fontSize: height * 0.015, fontFamily: "SemiBold", color: colors.grey }}>No Data Found</Text>
                                                                </View>
                                                            </View>
                                                    }
                                                </View>
                                            </>
                                            :
                                            <>
                                                <View style={{ width: "100%", height: "53%" }}>
                                                    {
                                                        allAsk.length > 0 ?
                                                            <FlatList
                                                                data={allAsk}
                                                                keyExtractor={(item) => item.id}
                                                                renderItem={ItemView}
                                                                showsVerticalScrollIndicator={false}
                                                                ItemSeparatorComponent={separator}
                                                            />
                                                            :
                                                            <View style={{ justifyContent: "center", alignItems: "center", width: "100%" }}>
                                                                <View style={{ alignItems: "center", marginTop: "50%" }}>
                                                                    <Ionicons name={"cloud-offline-outline"} size={40} color={colors.primary} />
                                                                    <Text style={{ fontSize: height * 0.015, fontFamily: "SemiBold", color: colors.grey }}>No Data Found</Text>
                                                                </View>
                                                            </View>
                                                    }
                                                </View>
                                            </>
                                    }

                                </>

                    }

                </View>
            </View>
        </SafeAreaView>
    )
}


const styles = StyleSheet.create({
    listTab: {
        flexDirection: "row",
        // width: "94%",
        marginTop: "5%",
        marginLeft: "1%",
    },
    btnTab: {
        width: width * 0.28,
        height: height * 0.035,
        flexDirection: "row",
        borderRadius: 5,
        borderWidth: 0.5,
        borderColor: colors.primary,
        alignItems: "center",
        justifyContent: "center",
        marginRight: "2%",
        marginLeft: "2%"
    },
    btnTabLead: {
        width: width * 0.45,
        height: height * 0.035,
        flexDirection: "row",
        borderRadius: 5,
        alignItems: "center",
        justifyContent: "center",
        marginLeft: "2%",
        marginBottom: "2%",
        borderColor: colors.primary,
        borderWidth: 0.5,
    },
    btnTab1: {
        width: width * 0.45,
        height: height * 0.035,
        flexDirection: "row",
        borderRadius: 5,
        alignItems: "center",
        borderColor: colors.primary,
        borderWidth: 0.5,
        justifyContent: "center",
        marginLeft: "4%"
    },
    textTab: {
        fontSize: height * 0.013,
        color: colors.black,
        fontFamily: "SemiBold"
    },
    btnTabActive: {
        backgroundColor: colors.primary,
    },
    textTabActive: {
        color: "#fff"
    },
    itemContainer: {
        flexDirection: 'row',
        paddingVertical: 10,
    },
    container: {
        padding: "4%",
    },
});

export default MeetingDetailScreen;
