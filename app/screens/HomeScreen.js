import React, { useState, useEffect, useCallback, } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { StatusBar, TouchableOpacity, StyleSheet, Logbox, Image, Dimensions, SafeAreaView, Button, View, Text, ImageBackground, FlatList, ScrollView, Modal, Alert, RefreshControl, ActivityIndicator } from 'react-native';
import { CommonActions } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import colors from '../config/colors';
import env from '../config/env';
import DatePicker from 'react-native-neat-date-picker';
import { Menu, MenuOptions, MenuOption, MenuTrigger } from 'react-native-popup-menu';
import { Ionicons } from '@expo/vector-icons';
import Constants from "expo-constants";
import OverViewtwo from '../components/OverViewtwo';
import moment from 'moment';
import { forEach } from 'lodash';
import MemberList from '../components/MemberList';
import { LogBox } from 'react-native';

const { height } = Dimensions.get('window');
const version = Constants.manifest.version
const buildNumber = Constants.manifest.ios.buildNumber
const versionCode = Constants.manifest.android.versionCode
// console.log("version", version);
// console.log("buildNumber", buildNumber);
// console.log("versionCode", versionCode);

const wait = (timeout) => {
  return new Promise(resolve => setTimeout(resolve, timeout));
}

const HomeScreen = () => {
  const token = useSelector(state => state.AuthReducers.accessToken);
  const first_name = useSelector(state => state.AuthReducers.first_name);
  const last_name = useSelector(state => state.AuthReducers.last_name);
  const profile_picture = useSelector(state => state.AuthReducers.profile_picture);
  const memberSince = useSelector(state => state.AuthReducers.memberSince);
  const user_id = useSelector(state => state.AuthReducers.user_id);

  const [refreshing, setRefreshing] = useState(false);
  const [firm_name, setComapny] = useState('');
  const [givenThankyou, setGivenThankyou] = useState([]);
  const [recievedthankyou, setRecievedthankyou] = useState([]);
  const [givenLeads, setGivenLeads] = useState([]);
  const [recievedLeads, setRecievedLeads] = useState([]);
  const [venue, setVenue] = useState([]);
  const [meeting, setMeeting] = useState([]);
  const [presenter1, setPresenter1] = useState([]);
  const [presenter2, setPresenter2] = useState([]);
  const [firstname1, setFirstName1] = useState([]);
  const [lastname1, setLastName1] = useState([]);
  const [firm1, setFirm1] = useState([]);
  const [pic1, setPic1] = useState();
  const [category1, setCategory1] = useState([]);
  const [firstname2, setFirstName2] = useState([]);
  const [lastname2, setLastName2] = useState([]);
  const [firm2, setFirm2] = useState([]);
  const [pic2, setPic2] = useState();
  const [isLoaded, setIsLoaded] = useState(true);
  const [category2, setCategory2] = useState([]);
  const [meeting_start_time, setMeetingStartTime] = useState([]);
  const [meeting_end_time, setMeetingEndTime] = useState([]);
  const [meeting_date, setMeetingDate] = useState([]);
  const [totalLeads, setTotalLeads] = useState([]);
  const [totalThankyou, setTotalThankyou] = useState([]);
  const [totalVisitor, setTotalVisitor] = useState([]);
  const [meeting_day, setMeetingDay] = useState([]);
  const [leadGivenCountDiff, setLeadGivenCountDiff] = useState([]);
  const [leadReceivedCountDiff, setLeadReceivedCountDiff] = useState([]);
  const [thankyouGivenCountDiff, setThankyouGivenCountDiff] = useState([]);
  const [thankyouReceivedCountDiff, setThankyouReceivedCountDiff] = useState([]);
  const [selector, setSelector] = useState('thisfortnight');
  const [selector1, setSelector1] = useState(0);
  const [noMeeting, SetNomeeting] = useState(false);
  const [upcomingMeeting, setUpcomingMeeting] = useState();

  const [name, setName] = useState('This Fortnight');

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [custom, setCustom] = useState('');
  const [custom2, setCustom2] = useState('');
  const [fromDate, setfromDate] = useState('');
  // console.log(fromDate)
  const [toDate, settoDate] = useState('');
  const [presenters, setPresenters] = useState();
  // const startDate = '2022-04-07';
  // const endDate = '2022-04-11';

  useEffect(() => {
    LogBox.ignoreLogs(["VirtualizedLists should never be nested"])
  }, [])

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setSelector1(selector1 => ++selector1)
    wait(1000).then(() => setRefreshing(false));
  }, []);

  useEffect(() => {
    axios({
      method: "GET",
      url: `${env.endpointURL}/users/${user_id}`,
      headers: {
        'Cookie': `jwt=${token}`
      },
    })
      .then(function (res) {
        setComapny(res.data.data.firm_name);
      })
      .catch(function (error) {
        console.log("error at members profile edit", error.message)
      })
  }, []);

  useEffect(() => {
    axios({
      method: "PUT",
      url: `${env.endpointURL}/users/${user_id}`,
      headers: {
        'Cookie': `jwt=${token}`
      },
      data: {
        "id": user_id,
        "version": version,
        "version_code": versionCode,
        "build_number": buildNumber
      }
    })
      .then(function (res) {
        // console.log("res", res.data);
      })
      .catch(function (error) {
        console.log("error at update user api", error.message)
      })
  }, []);

  useEffect(() => {
    axios({
      method: "GET",
      url: `${env.endpointURL}/leads?selector=${selector}`,
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
        console.log("error at leads api Homescreen", error.message)
      })

  }, [selector, selector1, custom]);

  useEffect(() => {
    axios({
      method: "GET",
      url: `${env.endpointURL}/thankyounotes?selector=${selector}`,
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
        console.log("error at thankyounotes api Homescreen", error.message)
      })

  }, [selector, selector1, custom]);

  useEffect(() => {
    axios({
      method: "GET",
      url: `${env.endpointURL}/meetings`,
      headers: {
        'Cookie': `jwt=${token}`,
      },
    })
      .then(function (res) {
        var i;
        var meetings = [];
        for (i = 0; i < res.data.length; i++) {
          if (res.data[i].status == 'upcoming') {
            meetings.push(res.data[i]);
          }
        }
        if (meetings.length != 0) {
          var result = check_upcoming_meeting(meetings);
          function check_upcoming_meeting(meets) {
            let latest = meets.reduce(function (pre, cur) {
              return Date.parse(pre.meeting_date) > Date.parse(cur.meeting_date) ? cur : pre;
            });
            return latest;
          }
          setUpcomingMeeting(result);
          setPresenter1(result.presenter_1)
          setPresenter2(result.presenter_2)
          setVenue(result.meeting_venue)
          setMeeting(result.meeting_name)
          setMeetingStartTime(moment(result.start_time, ["HH.mm"]).format("hh:mm A"))
          setMeetingEndTime(moment(result.end_time, ["HH.mm"]).format("hh:mm A"))
          setMeetingDate(result.meeting_date)
          setMeetingDay(moment(result.meeting_date).format('dddd'))
          setTotalLeads(result.leadsCount)
          setTotalThankyou(result.thankyouCount)
          setTotalVisitor(result.visitorsCount)
          setIsLoaded(false);
          SetNomeeting(false);
          var presentersData = [];

          let URLs = [
            `${env.endpointURL}/users/${result.presenter_1}`,
            `${env.endpointURL}/users/${result.presenter_2}`
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
        } else {
          SetNomeeting(true);
          setSelector('all');
          setName('All');
          setPresenters(null);
          setIsLoaded(false);
        }
      })
      .catch(function (error) {
        console.log("error at meeting api Homescreen", error.message)
      })

  }, [selector, selector1, custom]);

  const openDatePicker = () => {
    setShowDatePicker(true)
  }

  const onCancel = () => {
    setShowDatePicker(false)
  }

  const onConfirm = (output) => {
    setIsLoaded(true);
    const { startDate, startDateString, endDate, endDateString } = output
    setfromDate(startDateString)
    settoDate(endDateString)
    setCustom(startDateString + 'to' + endDateString)
    setCustom2(moment(startDateString).format('DD/MM') + ' to ' + moment(endDateString).format('DD/MM'))
    setShowDatePicker(false)
    setSelector(startDateString + 'to' + endDateString)
    setIsLoaded(false);
  }

  const navigation = useNavigation();
  const colorOptions = {
    headerColor: colors.primary,
    backgroundColor: colors.white,
    selectedDateColor: colors.primary,
    changeYearModalColor: colors.primary,
    weekDaysColor: colors.primary,
    selectedDateBackgroundColor: colors.primary,
    confirmButtonColor: colors.primary,
  }

  const currentDate = new Date()
  const NewDate = moment(currentDate, 'DD-MM-YYYY')
  return (

    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFCFC" }}>
      <StatusBar backgroundColor={colors.primary} barStyle='light-content' />
      {isLoaded ? (
        <View style={{ justifyContent: "center", alignItems: "center", height: "100%" }}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false} refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
        >
          <View style={styles.container}>
            <ImageBackground
              style={styles.coverImage}
            >
              <View style={{ height: "70%", width: "92%", justifyContent: "flex-start", alignItems: "center", flexDirection: "row" }}>
                {
                  profile_picture !== null ?
                    <Image source={{ uri: `${profile_picture}` }} style={{ height: height * 0.12, width: height * 0.12, borderRadius: 50 }} />
                    :
                    <Image source={require("../assets/images/profilepicture.png")} style={{ height: height * 0.12, width: height * 0.12, borderRadius: 50 }} />
                }
                <View style={{ marginLeft: "5%", width: "65%" }}>
                  <Text ellipsizeMode='tail' numberOfLines={1} style={{ fontSize: height * 0.025, fontFamily: 'SemiBold', color: colors.white }}>{first_name} {last_name}</Text>
                  <Text ellipsizeMode='tail' numberOfLines={1} style={{ fontSize: height * 0.015, fontFamily: 'Regular', color: colors.white }}>{firm_name}</Text>
                  {/* <Text ellipsizeMode='tail' numberOfLines={1} style={{ fontSize: height * 0.015, fontFamily: 'Regular', color: colors.white }}>(Member Since {memberSince})</Text> */}
                </View>
              </View>
            </ImageBackground>

            {/* graphs */}
            <View style={{
              width: "92%", backgroundColor: "white", borderRadius: 10, top: -10, borderColor: "#000", padding: "1%", shadowColor: '#000',
              shadowOffset: {
                width: 0,
                height: 2,
              },
              shadowOpacity: 0.25,
              shadowRadius: 2,
              elevation: 2,
              alignItems: "center"
            }}>
              <View style={{ flexDirection: "row", marginTop: "2%", justifyContent: "space-between", width: "100%", marginBottom: "2.5%" }}>

                <Text style={{ fontFamily: "Bold", marginLeft: "4%", fontSize: height * 0.03 }}>Overview</Text>

                <Menu style={{ justifyContent: "center", alignItems: "center" }}>
                  <MenuTrigger style={{ flexDirection: "row", width: 120, justifyContent: "flex-end", padding: '1%', marginRight: "3%", alignItems: "center" }}>
                    <Ionicons name={"calendar-outline"} size={height * 0.017} style={{ marginRight: "3%" }} color={colors.black} />
                    {
                      custom !== null && name === 'Custom' ?
                        < Text style={{ fontFamily: "SemiBold", fontSize: height * 0.015, }}>{custom2}</Text>
                        :
                        <Text style={{ fontFamily: "SemiBold", fontSize: height * 0.015, marginRight: "3%" }}>{name}</Text>
                    }
                    <Ionicons name={"caret-down-outline"} size={height * 0.017} style={{}} color={colors.black} />
                  </MenuTrigger>

                  <MenuOptions optionsContainerStyle=
                    {{ marginTop: 20, padding: 8, width: height * 0.16 }} >
                    <MenuOption value="all" onSelect={(value) => { setSelector(value), setName('All') }} >
                      <Text style={{ fontFamily: "SemiBold" }}>All</Text>
                    </MenuOption>
                    {!noMeeting ?
                      <MenuOption value="thisfortnight" onSelect={(value) => { setSelector(value), setName('This Fortnight') }} >
                        <Text style={{ fontFamily: "SemiBold" }}>This Fortnight</Text>
                      </MenuOption> :
                      <MenuOption />
                    }
                    <MenuOption value="custom" onSelect={(value) => { setSelector(custom), setName('Custom'), openDatePicker() }} >
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

              <View style={{ flexDirection: "row", width: "100%", marginTop: "2%", justifyContent: "space-evenly" }}>
                {
                  leadGivenCountDiff >= 0 && leadReceivedCountDiff >= 0 ? <OverViewtwo title={"LEADS"} leadGiven={givenLeads} leadRecieved={recievedLeads} increment={leadGivenCountDiff} incrementRec={leadReceivedCountDiff} name={name} selector={selector} selectedDate={custom} fromDate={fromDate} toDate={toDate} />
                    : leadGivenCountDiff >= 0 && leadReceivedCountDiff <= 0 ? <OverViewtwo title={"LEADS"} leadGiven={givenLeads} leadRecieved={recievedLeads} increment={leadGivenCountDiff} decrementRec={leadReceivedCountDiff} name={name} selector={selector} selectedDate={custom} fromDate={fromDate} toDate={toDate} />
                      : leadGivenCountDiff <= 0 && leadReceivedCountDiff >= 0 ? <OverViewtwo title={"LEADS"} leadGiven={givenLeads} leadRecieved={recievedLeads} decrement={leadGivenCountDiff} incrementRec={leadReceivedCountDiff} name={name} selector={selector} selectedDate={custom} fromDate={fromDate} toDate={toDate} />
                        : <OverViewtwo title={"LEADS"} leadGiven={givenLeads} leadRecieved={recievedLeads} decrement={leadGivenCountDiff} incrementRec={leadReceivedCountDiff} name={name} selector={selector} selectedDate={custom} fromDate={fromDate} toDate={toDate} />
                }
                {
                  thankyouGivenCountDiff >= 0 && thankyouReceivedCountDiff >= 0 ? <OverViewtwo title={"THANK YOU NOTES"} leadGiven={givenThankyou} leadRecieved={recievedthankyou} increment={thankyouGivenCountDiff} incrementRec={thankyouReceivedCountDiff} name={name} selector={selector} fromDate={fromDate} toDate={toDate} />
                    : thankyouGivenCountDiff >= 0 && thankyouReceivedCountDiff <= 0 ? <OverViewtwo title={"THANK YOU NOTES"} leadGiven={givenThankyou} leadRecieved={recievedthankyou} increment={thankyouGivenCountDiff} decrementRec={thankyouReceivedCountDiff} name={name} selector={selector} fromDate={fromDate} toDate={toDate} />
                      : thankyouGivenCountDiff <= 0 && thankyouReceivedCountDiff >= 0 ? <OverViewtwo title={"THANK YOU NOTES"} leadGiven={givenThankyou} leadRecieved={recievedthankyou} decrement={thankyouGivenCountDiff} incrementRec={thankyouReceivedCountDiff} name={name} selector={selector} fromDate={fromDate} toDate={toDate} />
                        : <OverViewtwo title={"THANK YOU NOTES"} leadGiven={givenThankyou} leadRecieved={recievedthankyou} decrement={thankyouGivenCountDiff} incrementRec={thankyouReceivedCountDiff} name={name} selector={selector} fromDate={fromDate} toDate={toDate} />
                }
              </View>

              <TouchableOpacity onPress={() => navigation.navigate("ViewAll", {
                selector: selector,
                selectedDate: custom,
                name: name,
                noMeeting: noMeeting
              })}
                style={{ paddingHorizontal: 15, paddingVertical: 6, backgroundColor: colors.primary, borderRadius: 5, justifyContent: "center", alignItems: "center", marginVertical: "4%", marginLeft: "72%" }}>
                <Text style={{ fontFamily: "SemiBold", fontSize: height * 0.012, color: colors.white }}>View More</Text>
              </TouchableOpacity>
            </View>

            {/* Upcoming Meetings */}

            <View style={{
              width: "92%", backgroundColor: "white", borderRadius: 10, borderColor: "#000", shadowColor: '#000',
              shadowOffset: {
                width: 0,
                height: 2,
              },
              shadowOpacity: 0.25,
              shadowRadius: 2,
              elevation: 2,
              marginBottom: "4%"
            }}>

              <View style={{
                flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: "4%",
                marginVertical: "4%"
              }}>
                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
                  {/* <Ionicons name={"calendar-outline"} size={height * 0.02} color={colors.darkgrey} /> */}
                  {presenters !== null && moment().format('DD-MM-YYYY') === moment(meeting_date).format('DD-MM-YYYY') ?
                    <Text style={{ fontFamily: "Bold", marginLeft: "2%", fontSize: height * 0.028 }}>Today's Meeting</Text> :
                    <Text style={{ fontFamily: "Bold", marginLeft: "2%", fontSize: height * 0.028 }}>Upcoming Meeting</Text>}
                </View>
              </View>
              {
                presenters != undefined && presenters.length != 0
                  ?
                  <>
                    <TouchableOpacity onPress={() => navigation.navigate("MeetingDetailScreen", { meeting: upcomingMeeting })} style={{
                      width: "92%", backgroundColor: colors.white, shadowColor: '#000',
                      borderRadius: 5, marginLeft: "4%", marginTop: "1%", borderColor: colors.grey, borderWidth: 0.5,
                      flexDirection: "row", alignItems: "center"
                    }}>
                      <View style={styles.datePill}>
                        <Text style={{ fontFamily: "Bold", fontSize: height * 0.035, color: colors.white }}>{moment(meeting_date).format("D")}</Text>
                        <Text style={{ fontFamily: "Bold", fontSize: height * 0.02, marginTop: "4%", color: colors.white }}>{moment(meeting_date).format("MMM")}</Text>
                        <Text style={{ fontFamily: "Bold", fontSize: height * 0.02, marginTop: "5%", color: colors.white }}>{moment(meeting_date).format("YYYY")}</Text>
                      </View>
                      <View style={{ padding: '5%', paddingBottom: '5%', paddingLeft: '2%', paddingRight: "2%", width: "60%" }}>
                        <Text style={{ fontFamily: "Medium", fontSize: height * 0.017 }} ellipsizeMode='tail' numberOfLines={1}>{venue}</Text>
                        <Text style={{ fontFamily: "Light", fontSize: height * 0.015, paddingTop: "2%" }}>
                          {meeting_day}, {meeting_start_time} - {meeting_end_time}
                        </Text>
                      </View>
                      <Ionicons name={"arrow-forward-circle-outline"} style={{ fontSize: height * 0.04, color: colors.primary, paddingRight: "2%" }} />
                    </TouchableOpacity>
                    <View style={{
                      marginBottom: "4%", marginTop: "3%", marginLeft: "4%", backgroundColor: "white", width: "92%", borderRadius: 5, borderColor: colors.grey, borderWidth: 0.5
                    }}>
                      <View style={{ flexDirection: "row", marginTop: "4%", marginLeft: "2%", alignItems: "center", marginBottom: "1%" }}>
                        <Ionicons name={"document-text-outline"} size={height * 0.02} color={colors.darkgrey} />
                        <Text style={{ fontFamily: "Bold", marginLeft: "2%" }}>8 Minute Presenters</Text>
                      </View>



                      <View style={{ marginLeft: "2%", marginRight: "2%", marginTop: "2%" }}>
                        <FlatList
                          scrollEnabled={false}
                          data={presenters}
                          renderItem={({ item }) =>
                            <MemberList image={item.profile_picture}
                              firstName={item.first_name} lastName={item.last_name} category={item.category}
                              firm_name={item.firm_name} id={item.id} rosterId={item.roster_id} />}
                          keyExtractor={item => item.id}
                        />
                        {/* {
                          presenters.map((item) => <MemberList image={item.profile_picture}
                            firstName={item.first_name} lastName={item.last_name} category={item.category}
                            firm_name={item.firm_name} id={item.id} rosterId={item.roster_id} />)
                        } */}
                      </View>
                    </View>
                  </>
                  :
                  <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", width: "92%" }}>
                    <View style={{ alignItems: "center", marginVertical: "30%" }}>
                      <Image source={require("../assets/images/home.png")} style={{ width: height * 0.05, height: height * 0.05 }} />
                      <Text style={{ fontSize: height * 0.015, fontFamily: "SemiBold", color: colors.grey }}>No upcoming meetings</Text>
                    </View>
                  </View>
              }

            </View>
          </View>
        </ScrollView>
      )
      }
    </SafeAreaView >
  )
}

const styles = StyleSheet.create({
  datePill: {
    borderRadius: 6,
    backgroundColor: colors.primary,
    padding: '2%',
    margin: '2%',
    paddingBottom: '2%',
    alignItems: "center",
    width: '25%',
    color: colors.white
  },
  container: {
    flex: 1,
    backgroundColor: "#FFFCFC",
    justifyContent: "flex-start",
    alignItems: "center"
  },
  coverImage: {
    height: height * 0.18,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.primary,
    borderBottomEndRadius: 20,
    borderBottomLeftRadius: 20,
  },
  button: {
    width: height * 0.38,
    height: height * 0.1,
    backgroundColor: colors.white,
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  text: {
    marginLeft: "6%",
    fontSize: height * 0.016,
    fontFamily: "SemiBold",
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
    height: "50%",
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
});

export default HomeScreen;
