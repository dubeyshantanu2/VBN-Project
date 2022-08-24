import React, { useState, useEffect } from 'react';
import { TouchableOpacity, StatusBar, View, FlatList, Image, Dimensions, SafeAreaView, ActivityIndicator, Button, Text, StyleSheet } from 'react-native';
import colors from '../config/colors';
import ThankyouCardDetails from "../components/ThankyouCardDetails";
import axios from 'axios';
import { Menu, MenuOptions, MenuOption, MenuTrigger } from 'react-native-popup-menu';
import { useSelector } from 'react-redux';
import moment from 'moment';
import { Ionicons } from '@expo/vector-icons';
import DatePicker from 'react-native-neat-date-picker';
import env from '../config/env';
import { ButtonGroup } from '@rneui/themed';

const { height, width } = Dimensions.get('window');

const ThankyouDetailScreen = ({ route }) => {
    const token = useSelector(state => state.AuthReducers.accessToken);
    const [name, setName] = useState(route.params.name);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [status, setStatus] = useState('Received');
    const [givenThankyou, setGivenThankyou] = useState([]);
    const [recievedthankyou, setRecievedthankyou] = useState([]);
    const [selector, setSelector] = useState(route.params.selector);
    const [selector1, setSelector1] = useState(0);
    const [userData, setUserData] = useState([]);
    const [selectedIndex, setSelectedIndex] = useState(0);

    const [custom, setCustom] = useState('');
    const [fromDate, setfromDate] = useState('');
    const [toDate, settoDate] = useState('');
    // const [thankyouNotif, setThankyouNotif] = useState(route.params && route.params.data ? route.params.data : null);
    const [isLoaded, setIsLoaded] = useState(true);
    const setStatusFilter = status => {
        setStatus(status)
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

    const openDatePicker = () => {
        setShowDatePicker(true)
    }

    const onCancel = () => {
        setShowDatePicker(false)
    }

    const onConfirm = (output) => {
        const { startDate, startDateString, endDate, endDateString } = output
        setShowDatePicker(false)
        setfromDate(startDateString)
        settoDate(endDateString)
        setCustom(startDateString + 'to' + endDateString)
        setSelector(startDateString + 'to' + endDateString)
    }

    const currentDate = new Date()
    const NewDate = moment(currentDate, 'DD-MM-YYYY')
    useEffect(() => {
        setIsLoaded(true)
        axios({
            method: "GET",
            url: `${env.endpointURL}/thankyounotes?selector=${selector}`,
            headers: {
                'Cookie': `jwt=${token}`,
            },
        })
            .then(function (res) {
                // console.log("res", res.data);
                setGivenThankyou(res.data.givenThankyouNotes);
                setRecievedthankyou(res.data.receivedThankyouNotes);
                setIsLoaded(false);
            })
            .catch(function (error) {
                console.log("error at thankyounotes api ThankyouDetailsscreen", error.message)
            })
    }, [selector, selector1]);

    // useEffect(() => {
    //     setIsLoaded(true)
    //     axios({
    //         method: "GET",
    //         url: `${env.endpointURL}/users`,
    //         headers: {
    //             'Cookie': `jwt=${token}`,
    //         },
    //     })
    //         .then(function (res) {
    //             // console.log(res.data[0]);
    //             setUserData(res.data);
    //             setIsLoaded(false);
    //         })
    //         .catch(function (error) {
    //             console.log("error at member list api ThankyouDetailsscreen", error.message)
    //         })
    // }, [selector]);

    const ItemView = ({ item }) => {
        // if (!route.params.selector) {
        //     var noti = item
        //     item = item.thankyou_details
        // }
        // var given_to_user = userData.find(user => user.id == item.thankyou_to_user_id);
        // var received_from_user = userData.find(user => user.id == item.thankyou_by_user_id);
        // console.log("given", given_to_user);
        // console.log("recive", received_from_user);
        // if (!route.params.selector) var received_from = userData.find(user => user.id == noti.from);
        return (
            // !route.params.selector ?
            //     <ThankyouCardDetails amount={item.thankyou_amount} date={(moment(item.created_at).format('DD-MM-YYYY'))} description={item.thankyou_description} receivedFrom={received_from ? (received_from.first_name + ' ' + received_from.last_name) : null}
            //         status={status} picture={received_from ? received_from.profile_picture : null} rosterId={received_from ? received_from.roster_id : null} />
            //     :
            <SafeAreaView>
                <StatusBar backgroundColor={colors.primary} barStyle='light-content' />
                {isLoaded ? (
                    <View style={{ justifyContent: "center", alignItems: "center", height: "100%" }}>
                        <ActivityIndicator size="large" color={colors.primary} />
                    </View>
                ) : (
                    selectedIndex == 0 ?
                        <ThankyouCardDetails amount={item.thankyou_amount} date={(moment(item.created_at).format('DD-MM-YYYY'))} description={item.thankyou_description} receivedFrom={item.user_name}
                            status={status} picture={item.profile_pic} rosterId={item.roster_id} tabOpen={route.params.id && route.params.id == item.id ? item.roster_id : null} />
                        : <ThankyouCardDetails amount={item.thankyou_amount} date={(moment(item.created_at).format('DD-MM-YYYY'))} description={item.thankyou_description} givenTo={item.user_name}
                            status={status} picture={item.profile_pic} rosterId={item.roster_id} tabOpen={route.params.id && route.params.id == item.id ? item.roster_id : null} />
                )
                }
            </SafeAreaView>
        )
    }

    const separator = () => {
        return <View style={{ borderColor: "white", borderWidth: 6 }} />
    }
    // console.log("route.params", route.params, thankyouNotif);
    // if (route.params && route.params.data) {
    //     var data_noti = (route.params.data && thankyouNotif) ? thankyouNotif.filter(data => data.id === route.params.id) : null
    // }
    return (
        <>
            {isLoaded ? (
                <View style={{ justifyContent: "center", alignItems: "center", height: "100%" }}>
                    <ActivityIndicator size="large" color={colors.primary} />
                </View>
            ) : (
                <SafeAreaView style={{ height: "90%" }}>
                    <StatusBar backgroundColor={colors.primary} barStyle='light-content' />
                    <Menu style={{ justifyContent: "center", alignItems: "center", marginLeft: "60%", marginTop: "2%" }}>
                        <MenuTrigger style={{ flexDirection: "row", width: 120, justifyContent: "flex-end", padding: '1%', marginRight: "3%", alignItems: "center" }}>
                            <Ionicons name={"calendar-outline"} size={height * 0.017} style={{ marginRight: "3%" }} color={colors.black} />
                            <Text style={{ fontFamily: "SemiBold", fontSize: height * 0.016, marginRight: "3%" }}>{name}</Text>
                            <Ionicons name={"caret-down-outline"} size={height * 0.017} style={{}} color={colors.black} />
                        </MenuTrigger>

                        <MenuOptions optionsContainerStyle=
                            {{ marginTop: 20, padding: 8, width: height * 0.16 }} >
                            <MenuOption value="all" onSelect={(value) => { setSelector(value), setName('All') }} >
                                <Text style={{ fontFamily: "SemiBold" }}>All</Text>
                            </MenuOption>
                            <MenuOption value="thisfortnight" onSelect={(value) => { setSelector(value), setName('This Fortnight') }} >
                                <Text style={{ fontFamily: "SemiBold" }}>This Fortnight</Text>
                            </MenuOption>
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
                    <ButtonGroup
                        buttons={['Received', 'Given',]}
                        selectedIndex={selectedIndex}
                        containerStyle={{ borderRadius: 8, marginBottom: 10 }}
                        onPress={(value) => {
                            setSelectedIndex(value);
                        }}
                        selectedButtonStyle={{ backgroundColor: colors.primary }}
                        textStyle={{ fontFamily: "Bold" }}
                    />
                    <View style={{ width: "100%", height: "94%" }}>
                        {
                            recievedthankyou.length > 0 && selectedIndex == 0 ?
                                <FlatList
                                    data={recievedthankyou}
                                    keyExtractor={item => item.id}
                                    renderItem={ItemView}
                                    showsVerticalScrollIndicator={false}
                                    ItemSeparatorComponent={separator}
                                    initialNumToRender={100}
                                /> :
                                givenThankyou.length > 0 && selectedIndex == 1 ?
                                    <FlatList
                                        data={givenThankyou}
                                        keyExtractor={item => item.id}
                                        renderItem={ItemView}
                                        showsVerticalScrollIndicator={false}
                                        ItemSeparatorComponent={separator}
                                        initialNumToRender={100}
                                    />
                                    :
                                    <View style={{ justifyContent: "center", alignItems: "center", flex: 1 }}>
                                        <View style={{ alignItems: "center" }}>
                                            <Ionicons name={"cloud-offline-outline"} size={30} color={colors.primary} />
                                            <Text style={{ fontSize: height * 0.02, fontFamily: "SemiBold", color: colors.grey }}>No Data</Text>
                                        </View>
                                    </View>
                        }

                    </View>
                </SafeAreaView>
            )
            }
        </>
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
        borderColor: colors.primary,
        padding: 10,
        borderRadius: 5,
        justifyContent: "center",
        marginRight: "2%"
    },
    textTab: {
        fontSize: 13,
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
export default ThankyouDetailScreen;
