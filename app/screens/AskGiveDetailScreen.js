import React, { useState, useEffect } from 'react';
import { TouchableOpacity, StatusBar, View, FlatList, Image, Dimensions, SafeAreaView, Button, Text, StyleSheet } from 'react-native';
import colors from '../config/colors';
import AskGiveCardDetails from "../components/AskGiveCardDetails";
import axios from 'axios';
import { useSelector } from 'react-redux';
import moment from 'moment';
import { Menu, MenuOptions, MenuOption, MenuTrigger } from 'react-native-popup-menu';
import { Ionicons } from '@expo/vector-icons';
import DatePicker from 'react-native-neat-date-picker';
import env from '../config/env';
import { ButtonGroup } from '@rneui/themed';

const { height, width } = Dimensions.get('window');

const AskGiveDetailScreen = ({ route }) => {
    const setStatusFilter = status => {
        setStatus(status)
    }
    const [myAsk, setMyAsk] = useState([]);
    const [allAsk, setAllAsk] = useState([]);
    const token = useSelector(state => state.AuthReducers.accessToken);

    const [name, setName] = useState(route.params.name);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [status, setStatus] = useState('My Ask/Give');
    const [custom, setCustom] = useState('');
    const [fromDate, setfromDate] = useState('');
    const [toDate, settoDate] = useState('');
    const [selector, setSelector] = useState(route.params.selector);
    const [selector1, setSelector1] = useState(0);
    const [userData, setUserData] = useState([]);
    const [selectedIndex, setSelectedIndex] = useState(0);

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
        const { startDateString, endDateString } = output
        setShowDatePicker(false)
        setfromDate(startDateString)
        settoDate(endDateString)
        setCustom(startDateString + 'to' + endDateString)
        setSelector(startDateString + 'to' + endDateString)
    }

    const currentDate = new Date()
    const NewDate = moment(currentDate, 'DD-MM-YYYY')
    useEffect(() => {
        axios({
            method: "GET",
            url: `${env.endpointURL}/asksgives?selector=${selector}`,
            headers: {
                'Cookie': `jwt=${token}`,
            },
        })
            .then(function (res) {
                setMyAsk(res.data.myAsks)
                setAllAsk(res.data.allAsks)
            })
            .catch(function (error) {
                console.log("error at asksgives api AskGiveDetailsScreen", error.message)
            })
    }, [selector, selector1]);

    useEffect(() => {
        axios({
            method: "GET",
            url: `${env.endpointURL}/users`,
            headers: {
                'Cookie': `jwt=${token}`,
            },
        })
            .then(function (res) {
                // console.log(res.data[0]);
                setUserData(res.data);
            })
            .catch(function (error) {
                console.log("error at member list api VisitorsDetailsSreen", error.message)
            })
    }, []);

    const ItemView = ({ item }) => {
        if (item.ask) var invited_by_user = userData.find(user => user.id == item.ask.user_id);
        else var invited_by_user = null
        return (
            selectedIndex === 0 ?
                <AskGiveCardDetails ask={item.ask ? item.ask.description : null} date={item.ask ? (moment(item.ask.created_at).format('DD-MM-YYYY')) : null}
                    replies={item.givesCount} status={selectedIndex} ask_give={item.ask.record_type} />
                : <AskGiveCardDetails ask={item.ask ? item.ask.description : null}
                    date={item.ask ? (moment(item.ask.created_at).format('DD-MM-YYYY')) : null} askedBy={invited_by_user ? (invited_by_user.first_name + ' ' + invited_by_user.last_name) : invited_by_user}
                    replies={item.givesCount} status={selectedIndex} ask_give={item.ask.record_type} />
        )
    }
    const separator = () => {
        return <View style={{ borderColor: "white", borderWidth: 6 }} />
    }
    return (
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
                buttons={[`My Asks/Gives (${myAsk.length})`, `All Asks/Gives (${allAsk.length})`,]}
                selectedIndex={selectedIndex}
                containerStyle={{ borderRadius: 8, marginBottom: 10 }}
                onPress={(value) => {
                    setSelectedIndex(value);
                }}
                selectedButtonStyle={{ backgroundColor: colors.primary }}
                textStyle={{ fontFamily: "Bold" }}
            />

            {
                selectedIndex === 0 ?
                    <>

                        <View style={{ width: "100%", height: "95%" }}>
                            {
                                myAsk.length > 0 ?
                                    <FlatList
                                        data={myAsk}
                                        keyExtractor={item => item.id}
                                        renderItem={ItemView}
                                        showsVerticalScrollIndicator={false}
                                        ItemSeparatorComponent={separator}
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
                    </>
                    :
                    <>

                        <View style={{ width: "100%", height: "95%" }}>
                            {
                                allAsk.length > 0 ?
                                    <FlatList
                                        data={allAsk}
                                        keyExtractor={item => item.id}
                                        renderItem={ItemView}
                                        showsVerticalScrollIndicator={false}
                                        ItemSeparatorComponent={separator}
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
                    </>
            }
        </SafeAreaView >
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
        fontSize: height * 0.013,
        color: colors.black,
        fontFamily: "SemiBold",
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

export default AskGiveDetailScreen;
