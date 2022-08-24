import React, { useState, useEffect } from 'react';
import { Modal, StatusBar, ScrollView, Image, Dimensions, ActivityIndicator, SafeAreaView, Text, TouchableOpacity, StyleSheet, View, TextInput, Platform } from 'react-native';
import moment from 'moment';
import * as Linking from 'expo-linking';
import axios from 'axios';
import { Ionicons } from '@expo/vector-icons';
import { useSelector } from 'react-redux';
import { Transition, Transitioning } from 'react-native-reanimated';
import { Menu, MenuOptions, MenuOption, MenuTrigger } from 'react-native-popup-menu';
import DatePicker from 'react-native-neat-date-picker';
import LeadButton from '../components/LeadButton';
import colors from '../config/colors';
import env from '../config/env';
import ShortButton from '../components/ShortButton';
import DisabledButton from '../components/DisabledButton';
import Checkbox from 'expo-checkbox';

const transition = (
    <Transition.Together>
        <Transition.In type='fade' durationMs={200} />
        <Transition.Change />
        <Transition.Out type='fade' durationMs={200} />
    </Transition.Together>
);

const { height, width } = Dimensions.get('window');


const LeadGiven = ({ route }) => {

    const token = useSelector(state => state.AuthReducers.accessToken);
    const user_id = useSelector(state => state.AuthReducers.user_id);

    const ref = React.useRef();
    const [modalVisible, setModalVisible] = useState(false);
    const [modalIndexValue, setModalIndexValue] = useState(null);
    const [memberObjectId, setMemberObjectId] = useState(null);
    const [rejectModalVisible, setRejectModalVisible] = useState(false);
    const [currentIndex, setCurrentIndex] = useState();
    const [ModalDropdownValue, setModalDropdownValue] = useState(null);
    const [ModalDropdownDescription, setModalDropdownDescription] = useState(null);
    const [ModalThankyouAmount, setModalThankyouAmount] = useState(null);
    const [ModalThankyouDescription, setModalThankyouDescription] = useState(null);
    // const [givenPendingLeads, setGivenPendingLeads] = useState([]);
    const [givenOpenLeads, setGivenOpenLeads] = useState([]);
    // const [givenClosedLeads, setGivenClosedLeads] = useState([]);
    const [givenClosedWonLeads, setGivenClosedWonLeads] = useState([]);
    const [givenClosedLostLeads, setGivenClosedLostLeads] = useState([]);
    const [isLoaded, setIsLoaded] = useState(true);
    const [isLoadedCheckBox, setIsLoadedCheckBox] = useState(true);
    const [radioButtonData, setRadioButtonData] = useState();
    const [selector, setSelector] = useState(route.params ? route.params.selector : "thisfortnight");
    const [selector1, setSelector1] = useState(0);
    const [LeadName, setLeadName] = useState(null);
    const [LeadPhoneNumber, setLeadPhoneNumber] = useState();
    const [LeadEmail, setLeadEmail] = useState(null);
    const [LeadDescription, setLeadDescription] = useState(null);
    const [name, setName] = useState(route.params ? route.params.name : 'This Fortnight');
    const [fromDate, setfromDate] = useState('');
    const [toDate, settoDate] = useState('');
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [custom, setCustom] = useState('');
    const [username, setUserName] = useState();
    const [phone, setPhone] = useState();
    const [email, setEmail] = useState();
    // const [formData, setFormData] = useState([]);
    // const [pending, setPending] = useState(true);
    const [open, setOpen] = useState(true);
    // const [closed, setClosed] = useState(false);
    const [closedWon, setClosedWon] = useState(false);
    const [closedLost, setClosedLost] = useState(false);
    const [selfLeadEnable, SetSelfLeadEnable] = useState(false);
    const [selfLeadEnableIndex, SetSelfLeadEnableIndex] = useState(null);
    const [onChangeTextIndex, SetOnChangeTextIndex] = useState(null);

    useEffect(() => {
        axios({
            method: "GET",
            url: `${env.endpointURL}/leads?selector=${selector}`,
            headers: {
                'Cookie': `jwt=${token}`,
            },
        })
            .then(function (res) {
                // setGivenPendingLeads(res.data.drillDownGivenData.penidngLeadsArr);
                setGivenOpenLeads(res.data.drillDownGivenData.openLeadsArr);
                // setGivenClosedLeads(res.data.drillDownGivenData.closedLeadsArr);
                setGivenClosedWonLeads(res.data.drillDownGivenData.closedWonLeadsArr);
                setGivenClosedLostLeads(res.data.drillDownGivenData.closedLostLeadsArr);
                setIsLoaded(false);
            })
            .catch(function (error) {
                console.log("error at leads api leaddetails", error.message)
            })

    }, [selector, selector1, route.params]);

    const givenPendingLeadUpdate = (obj) => {
        if (!obj) return false
        let lead_phone = (LeadPhoneNumber && typeof (LeadPhoneNumber) == 'string' && !LeadPhoneNumber.startsWith('+91')) ? '+91' + LeadPhoneNumber :
            (typeof (LeadPhoneNumber) == 'number' && !JSON.stringify(LeadPhoneNumber).startsWith('+91')) ? '+91' + LeadPhoneNumber : LeadPhoneNumber
        setIsLoaded(false);
        axios({
            method: "PUT",
            url: `${env.endpointURL}/leads/${obj.id}`,
            headers: {
                'Cookie': `jwt=${token}`,
            },
            data: {
                "id": obj.id,
                "updated_by": user_id,
                "lead_name": selfLeadEnable ? username : LeadName ? LeadName : obj.lead_name,
                "lead_email": selfLeadEnable ? email : LeadEmail ? LeadEmail : obj.lead_email,
                "lead_phone_number": selfLeadEnable ? phone : lead_phone ? lead_phone : obj.lead_phone_number,
                "lead_description": LeadDescription ? LeadDescription : obj.lead_description,
            }
        })
            .then(function (res) {
                setSelector1(selector1 => ++selector1)
                setLeadName(null);
                setLeadPhoneNumber(null);
                setLeadEmail(null);
                setLeadDescription(null);
                // setFormData([]);
                SetSelfLeadEnable(false);
                SetSelfLeadEnableIndex(null);
                setIsLoaded(true);
                // console.log("res.data", res.data);
            })
            .catch(function (error) {
                console.log("error at leads api leaddetails", error.message)
            });
    }

    const currentDate = new Date()
    const NewDate = moment(currentDate, 'DD-MM-YYYY')

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

    useEffect(() => {
        axios({
            method: "GET",
            url: `${env.endpointURL}/users/${user_id}`,
            headers: {
                'Cookie': `jwt=${token}`
            },
        })
            .then(function (res) {
                setUserName(res.data.data.first_name + ' ' + res.data.data.last_name);
                setPhone(res.data.data.mobile)
                setEmail(res.data.data.email)
            })
            .catch(function (error) {
                console.log("error at members profile edit", error.message)
            })
    }, []);

    // const collectDataforSelfLead = (index, data_exist, lead_id) => {
    //     console.log("index", index, "data_exist", data_exist, "lead_id", lead_id,);
    //     for (let i = 0; i < formData.length; i++) {
    //         if (formData[i].index == index && formData[i].lead_id == lead_id) {
    //             delete formData[i]
    //         }
    //     }
    //     if (formData.length == 0 || !data_exist) {
    //         formData.push({ index: index, field: "Name", text: username, lead_id: lead_id })
    //         formData.push({ index: index, field: "Email", text: email, lead_id: lead_id })
    //         formData.push({ index: index, field: "Phone", text: phone, lead_id: lead_id })
    //         formData.push({ index: index, field: "Description", text: "", lead_id: lead_id })
    //     }
    //     setIsLoadedCheckBox(isLoadedCheckBox ? false : true);
    //     return setFormData(formData.filter(val => val !== undefined));
    // }

    const formatter = new Intl.NumberFormat('en-IN', {
        minimumFractionDigits: 0,
    });

    // const pendingClick = () => {
    //     setPending(true);
    //     setOpen(false);
    //     setClosed(false);
    //     setClosedWon(false);
    //     setClosedLost(false);
    // }

    const openClick = () => {
        // setPending(false);
        setOpen(true);
        // setClosed(false);
        setClosedWon(false);
        setClosedLost(false);
    }

    // const closedClick = () => {
    //     setPending(false);
    //     setOpen(false);
    //     setClosed(true);
    //     setClosedWon(false);
    //     setClosedLost(false);
    // }

    const closedWonClick = () => {
        // setPending(false);
        setOpen(false);
        // setClosed(false);
        setClosedWon(true);
        setClosedLost(false);
    }

    const closedLostClick = () => {
        // setPending(false);
        setOpen(false);
        // setClosed(false);
        setClosedWon(false);
        setClosedLost(true);
    }

    return (
        <>
            {isLoaded ? (
                <View style={{ justifyContent: "center", alignItems: "center", height: "100%" }}>
                    <ActivityIndicator size="large" color={colors.primary} />
                </View>
            ) : (
                <View style={{ flex: 1, paddingVertical: "4%" }}>
                    <View style={{ flexDirection: "row", alignItems: "flex-start", justifyContent: "space-around" }}>
                        {/* <TouchableOpacity onPress={pendingClick}>
                            <LeadButton text={"Pending Approval"} color={"#FFECDD"} icon={"square"} iconColor={"#FEA57F"} selected={pending} />
                        </TouchableOpacity> */}
                        <TouchableOpacity onPress={openClick}>
                            <LeadButton text={"Open"} color={"#ECE8FF"} icon={"folder-open"} iconColor={"#A08CED"} selected={open}
                                count={givenOpenLeads.reduce((count, innerArray) => count + innerArray.length, 0)} />
                        </TouchableOpacity>
                        {/* <TouchableOpacity onPress={closedClick}>
                            <LeadButton text={"Closed"} color={"#D4D4D4"} icon={"close-circle"} iconColor={"#7F7F7F"} selected={closed} />
                        </TouchableOpacity> */}
                        <TouchableOpacity onPress={closedWonClick}>
                            <LeadButton text={"Completed"} color={"#E1F7D1"} icon={"thumbs-up"} iconColor={"#5ABC73"} selected={closedWon}
                                count={givenClosedWonLeads.reduce((count, innerArray) => count + innerArray.length, 0)} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={closedLostClick}>
                            <LeadButton text={"Cancelled"} color={"#FFD8D8"} icon={"thumbs-down"} iconColor={"#FE9292"} selected={closedLost}
                                count={givenClosedLostLeads.reduce((count, innerArray) => count + innerArray.length, 0)} />
                        </TouchableOpacity>
                    </View>
                    <View style={{ width: "100%", borderWidth: .5, marginTop: "2%", borderColor: colors.lightgrey }} />
                    <Menu style={{ justifyContent: "center", alignItems: "center", marginLeft: "60%", marginTop: "1%" }}>
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
                    {
                        open === true
                            ?
                            <>
                                <Transitioning.View
                                    ref={ref}
                                    transition={transition}
                                    style={{ width: "100%", height: "82%", marginTop: "2%" }}
                                >
                                    {givenOpenLeads.length > 0 ?
                                        <ScrollView style={styles.container}>

                                            {givenOpenLeads.map((data, index) =>
                                                <View style={{ flexGrow: 1 }}                                                >
                                                    <TouchableOpacity key={index} activeOpacity={0.9} onPress={() => {
                                                        ref.current.animateNextTransition();
                                                        setCurrentIndex(index === currentIndex ? null : index);
                                                    }} style={{ flexDirection: "row", height: height * 0.08, borderRadius: 10, borderColor: colors.lightgrey, backgroundColor: colors.grey, borderWidth: 1, justifyContent: "space-between", alignItems: "center", marginVertical: "2%" }}>
                                                        <View style={{ flexDirection: "row", marginLeft: "3%", alignItems: "center" }}>
                                                            <Image style={{ height: 50, width: 50, backgroundColor: "#eee", borderRadius: 7 }} source={{ uri: data[0].profile_pic }} />
                                                            <View style={{ backgroundColor: colors.primary, height: 23, width: 23, borderRadius: 40, left: -15, top: 18, borderWidth: 1.5, borderColor: "white", justifyContent: "center", alignItems: "center" }}>
                                                                <Text style={{ color: "white", fontSize: height * 0.010 }}>#{data[0].roster_id}</Text>
                                                            </View>
                                                            <View style={{ flexDirection: "row", width: "65%", left: -10 }}>
                                                                <Text style={{ marginLeft: "2%" }} ellipsizeMode='tail' numberOfLines={1}>{data[0].user_name}</Text>
                                                            </View>
                                                        </View>

                                                        <View style={{ flexDirection: "row", marginRight: "2%", left: -40 }}>
                                                            <View style={{ backgroundColor: colors.white, alignItems: "center", flexDirection: "row", marginRight: "5%", paddingVertical: 3, paddingHorizontal: 20, borderRadius: 5 }}>
                                                                <Text>{data.length}</Text>
                                                            </View>
                                                            {
                                                                index === currentIndex ? <Ionicons name={"chevron-up-outline"} size={height * 0.03} color={colors.icon} />
                                                                    : <Ionicons name={"chevron-down-outline"} size={height * 0.03} color={colors.icon} />
                                                            }
                                                        </View>
                                                    </TouchableOpacity>
                                                    {index === currentIndex && (
                                                        <View style={styles.content}>
                                                            {data.map((obj, index) =>
                                                                <>
                                                                    <View>
                                                                        {Platform.OS === 'ios' ?
                                                                            <TouchableOpacity style={{ flexDirection: "row", width: "100%", marginTop: "2%", marginLeft: "70%", alignItems: "center" }} onPress={() => { setModalVisible(true); setModalIndexValue(index); setMemberObjectId(obj.id) }}>
                                                                                <Ionicons name={"create-outline"} size={height * 0.03} color={"#00AEF2"} />
                                                                                <Text style={{ fontSize: height * 0.017, fontFamily: "Bold", color: "#00AEF2", marginLeft: "1%" }}>Edit Details</Text>
                                                                            </TouchableOpacity> :
                                                                            <TouchableOpacity onPress={() => { SetSelfLeadEnable(selfLeadEnableIndex == index && selfLeadEnable ? false : true); SetSelfLeadEnableIndex(index) }} style={{ flexDirection: "row", width: "100%", marginTop: "2%", marginLeft: "72%", alignItems: "center" }}>
                                                                                <Checkbox color={"#00AEF2"} style={{ marginLeft: " 2.5%" }}
                                                                                    value={selfLeadEnableIndex == index && selfLeadEnable}
                                                                                    onValueChange={() => { SetSelfLeadEnable(selfLeadEnableIndex == index && selfLeadEnable ? false : true); SetSelfLeadEnableIndex(index) }}
                                                                                />
                                                                                <Text style={{ fontSize: height * 0.017, fontFamily: "Bold", color: "#00AEF2", marginLeft: "2%" }}>Self Lead</Text>
                                                                            </TouchableOpacity>
                                                                        }
                                                                    </View>
                                                                    {modalIndexValue == index && memberObjectId == obj.id ?
                                                                        <Modal
                                                                            animationType="fade"
                                                                            transparent={true}
                                                                            visible={modalVisible}
                                                                            onRequestClose={() => {
                                                                                setModalVisible(!modalVisible);
                                                                            }}
                                                                        >
                                                                            {/* {console.log("phone", phone, "LeadPhoneNumber", LeadPhoneNumber, "obj.lead_phone_number", obj.lead_phone_number, "selfLeadEnable", selfLeadEnable)} */}
                                                                            <ScrollView style={styles.centeredView}>
                                                                                <View style={styles.modalView}>
                                                                                    <View style={{ flexDirection: "row", alignItems: "center", width: "100%", justifyContent: "space-between" }}>
                                                                                        <TouchableOpacity onPress={() => SetSelfLeadEnable(selfLeadEnable ? false : true)} style={{ flexDirection: "row", alignItems: "center", marginLeft: "4%" }}>
                                                                                            <Checkbox color={"#00AEF2"} style={{}}
                                                                                                value={selfLeadEnable}
                                                                                                onValueChange={() => SetSelfLeadEnable(selfLeadEnable ? false : true)} />
                                                                                            <Text style={{ fontSize: height * 0.017, fontFamily: "Bold", color: "#00AEF2", marginLeft: "4%" }}>Self Lead</Text>
                                                                                        </TouchableOpacity>
                                                                                        <Ionicons name={"close"} size={height * 0.032} color={colors.darkgrey} style={{ marginLeft: "70%" }} onPress={() => { setModalVisible(false); SetSelfLeadEnable(false) }} />
                                                                                    </View>
                                                                                    <View style={{ width: "100%", marginTop: "4%" }}>
                                                                                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                                                                                            <Text style={{ fontSize: height * 0.017, fontFamily: "Bold", marginTop: "2%" }}>Name</Text>
                                                                                        </View>
                                                                                        <View style={{ flexDirection: "row", alignItems: "center", width: "100%" }}>
                                                                                            <TextInput selectionColor={colors.selector} onChangeText={(text) => { setLeadName(text); SetSelfLeadEnable(false) }} style={{ fontSize: height * 0.017, marginTop: "1%", borderBottomColor: colors.lightgrey, borderBottomWidth: 1, width: "100%" }}
                                                                                                value={selfLeadEnable ? username : LeadName != null ? LeadName : obj.lead_name} />
                                                                                        </View>
                                                                                    </View>

                                                                                    <View style={{ width: "100%", marginTop: "2%" }}>
                                                                                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                                                                                            <Text style={{ fontSize: height * 0.017, fontFamily: "Bold", marginTop: "2%" }}>Phone</Text>
                                                                                        </View>
                                                                                        <View style={{ flexDirection: "row", alignItems: "center", width: "100%" }}>
                                                                                            <TextInput selectionColor={colors.selector} keyboardType={"number-pad"} maxLength={13} onChangeText={(text) => { setLeadPhoneNumber(text); SetSelfLeadEnable(false) }} style={{ fontSize: height * 0.017, marginTop: "1%", borderBottomColor: colors.lightgrey, borderBottomWidth: 1, width: "100%" }}
                                                                                                value={selfLeadEnable ? phone : LeadPhoneNumber != null ? LeadPhoneNumber : obj.lead_phone_number} />
                                                                                        </View>
                                                                                    </View>

                                                                                    <View style={{ flexDirection: "row", marginTop: "2%" }}>
                                                                                        <View style={{ width: "100%" }}>
                                                                                            <Text style={{ fontSize: height * 0.017, fontFamily: "Bold", marginTop: "2%" }}>Email</Text>
                                                                                            <TextInput selectionColor={colors.selector} onChangeText={(text) => { setLeadEmail(text); SetSelfLeadEnable(false) }} style={{ fontSize: height * 0.017, marginTop: "1%", borderBottomColor: colors.lightgrey, borderBottomWidth: 1, }}
                                                                                                value={selfLeadEnable ? email : LeadEmail != null ? LeadEmail : obj.lead_email} />
                                                                                        </View>
                                                                                    </View>

                                                                                    <View style={{ flexDirection: "row", marginTop: "2%" }}>
                                                                                        <View style={{ width: "100%" }}>
                                                                                            <Text style={{ fontSize: height * 0.017, fontFamily: "Bold", marginTop: "2%" }}>Description</Text>
                                                                                            <TextInput selectionColor={colors.selector} onChangeText={(text) => { setLeadDescription(text); SetSelfLeadEnable(false) }} multiline={true}
                                                                                                style={{ fontSize: height * 0.017, marginTop: "1%", borderBottomColor: colors.lightgrey, borderBottomWidth: 1, }}
                                                                                                value={LeadDescription != null ? LeadDescription : obj.lead_description} />
                                                                                        </View>
                                                                                    </View>

                                                                                    <View style={{ marginTop: "4%", width: "100%", }}>
                                                                                        {/* {
                                                                                            ((LeadPhoneNumber != undefined && LeadPhoneNumber.length > 9) || (obj.lead_phone_number != undefined && obj.lead_phone_number.length > 9)) && (LeadName || obj.lead_name) ? */}
                                                                                        <ShortButton onPress={() => { givenPendingLeadUpdate(obj); setModalVisible(false) }} text={"Save"} />
                                                                                        {/* :
                                                                                                <DisabledButton text={"Save"} />
                                                                                        } */}
                                                                                    </View>

                                                                                </View>
                                                                            </ScrollView>
                                                                        </Modal> :
                                                                        <View />
                                                                    }
                                                                    {Platform.OS != 'ios' ?
                                                                        <View style={{
                                                                            marginTop: "2%", borderRadius: 10, borderWidth: 1, borderColor: colors.lightgrey, paddingVertical: 10, padding: "4%"
                                                                        }}>
                                                                            <View style={{ width: "100%", marginTop: "2%" }}>
                                                                                <Text style={{ fontSize: height * 0.017, fontFamily: "Bold", marginTop: "2%" }}>Name</Text>
                                                                                <TextInput selectionColor={colors.selector} onChangeText={(text) => { setLeadName(text); SetOnChangeTextIndex(index); SetSelfLeadEnable(false) }} style={{ fontSize: height * 0.017, marginTop: "1%", borderBottomColor: colors.lightgrey, borderBottomWidth: 1, }}
                                                                                    value={selfLeadEnableIndex == index && selfLeadEnable ? username : LeadName != null && onChangeTextIndex == index ? LeadName : obj.lead_name} />
                                                                            </View>
                                                                            <View style={{ width: "100%", marginTop: "2%" }}>
                                                                                <View style={{ flexDirection: "row", alignItems: "center" }}>
                                                                                    <Text style={{ fontSize: height * 0.017, fontFamily: "Bold", marginTop: "2%" }}>Phone</Text>
                                                                                </View>
                                                                                <View style={{ flexDirection: "row", alignItems: "center", width: "100%" }}>
                                                                                    <TextInput selectionColor={colors.selector} keyboardType={"number-pad"} maxLength={13} onChangeText={(text) => { setLeadPhoneNumber(text); SetOnChangeTextIndex(index); SetSelfLeadEnable(false) }} style={{ fontSize: height * 0.017, marginTop: "1%", borderBottomColor: colors.lightgrey, borderBottomWidth: 1, width: "100%" }}
                                                                                        value={selfLeadEnableIndex == index && selfLeadEnable ? phone : LeadPhoneNumber != null && onChangeTextIndex == index ? LeadPhoneNumber : obj.lead_phone_number} />
                                                                                </View>
                                                                            </View>
                                                                            <View style={{ flexDirection: "row", marginTop: "2%" }}>
                                                                                <View style={{ width: "100%" }}>
                                                                                    <Text style={{ fontSize: height * 0.017, fontFamily: "Bold", marginTop: "2%" }}>Email</Text>
                                                                                    <TextInput selectionColor={colors.selector} onChangeText={(text) => { setLeadEmail(text); SetOnChangeTextIndex(index); SetSelfLeadEnable(false) }} style={{ fontSize: height * 0.017, marginTop: "1%", borderBottomColor: colors.lightgrey, borderBottomWidth: 1, }}
                                                                                        value={selfLeadEnableIndex == index && selfLeadEnable ? email : LeadEmail != null && onChangeTextIndex == index ? LeadEmail : obj.lead_email} />
                                                                                </View>
                                                                            </View>
                                                                            <View style={{ flexDirection: "row", marginTop: "2%" }}>
                                                                                <View style={{ width: "100%" }}>
                                                                                    <Text style={{ fontSize: height * 0.017, fontFamily: "Bold", marginTop: "2%" }}>Description</Text>
                                                                                    <TextInput selectionColor={colors.selector} onChangeText={(text) => { setLeadDescription(text); SetOnChangeTextIndex(index); SetSelfLeadEnable(false) }} multiline={true}
                                                                                        style={{ fontSize: height * 0.017, marginTop: "1%", borderBottomColor: colors.lightgrey, borderBottomWidth: 1, }}
                                                                                        value={LeadDescription != null && onChangeTextIndex == index ? LeadDescription : obj.lead_description} />
                                                                                </View>
                                                                            </View>
                                                                            <View style={{ marginTop: "4%", width: "100%" }}>
                                                                                {/* {
                                                                                    ((LeadPhoneNumber != undefined && LeadPhoneNumber.length > 9) || (obj.lead_phone_number != undefined && obj.lead_phone_number.length > 9)) && (LeadName || obj.lead_name) ? */}
                                                                                <ShortButton onPress={() => givenPendingLeadUpdate(obj)} text={"Save"} />
                                                                                {/* :
                                                                                        <DisabledButton text={"Save"} />
                                                                                } */}
                                                                            </View>
                                                                        </View> :
                                                                        <View style={{
                                                                            marginTop: "2%", borderRadius: 10, borderWidth: 1, borderColor: colors.lightgrey, paddingVertical: 10, padding: "4%"
                                                                        }}>
                                                                            <View style={{ width: "100%", marginTop: "2%" }}>
                                                                                <Text style={{ fontSize: height * 0.017, fontFamily: "Bold", marginTop: "2%" }}>Name: {obj.lead_name}</Text>
                                                                            </View>
                                                                            <View style={{ width: "100%", marginTop: "2%" }}>
                                                                                <View style={{ flexDirection: "row", alignItems: "center" }}>
                                                                                    <Text style={{ fontSize: height * 0.017, fontFamily: "Bold", marginTop: "2%" }}>Phone: {obj.lead_phone_number}</Text>
                                                                                </View>
                                                                                <View style={{ flexDirection: "row", alignItems: "center", width: "100%" }}>
                                                                                </View>
                                                                            </View>
                                                                            <View style={{ flexDirection: "row", marginTop: "2%" }}>
                                                                                <View style={{ width: "100%" }}>
                                                                                    <Text style={{ fontSize: height * 0.017, fontFamily: "Bold", marginTop: "2%" }}>Email: {obj.lead_email}</Text>
                                                                                </View>
                                                                            </View>
                                                                            <View style={{ flexDirection: "row", marginTop: "2%" }}>
                                                                                <View style={{ width: "100%" }}>
                                                                                    <Text style={{ fontSize: height * 0.017, fontFamily: "Bold", marginTop: "2%" }}>Description: {obj.lead_description}</Text>
                                                                                </View>
                                                                            </View>
                                                                        </View>
                                                                    }
                                                                </>
                                                            )}
                                                        </View>
                                                    )}
                                                </View>
                                            )}
                                        </ScrollView>
                                        :
                                        <View style={{ justifyContent: "center", alignItems: "center", flex: 1 }}>
                                            <View style={{ alignItems: "center" }}>
                                                <Ionicons name={"cloud-offline-outline"} size={30} color={colors.primary} />
                                                <Text style={{ fontSize: height * 0.02, fontFamily: "SemiBold", color: colors.grey }}>No Data</Text>
                                            </View>
                                        </View>
                                    }
                                </Transitioning.View>
                            </>
                            :
                            // open === true
                            //     ?
                            //     <>
                            //         <Transitioning.View
                            //             ref={ref}
                            //             transition={transition}
                            //             style={{ width: "100%", height: "83%", }}
                            //         >
                            //             <ScrollView style={styles.container}>
                            //                 {givenOpenLeads.map((data, index) =>
                            //                     <TouchableOpacity style={{ flexGrow: 1 }} key={index} activeOpacity={0.9}
                            //                         onPress={() => {
                            //                             ref.current.animateNextTransition();
                            //                             setCurrentIndex(index === currentIndex ? null : index);
                            //                         }}>
                            //                         <View style={{ flexDirection: "row", height: height * 0.08, borderRadius: 10, borderColor: colors.lightgrey, backgroundColor: colors.grey, borderWidth: 1, justifyContent: "flex-start", alignItems: "center", marginVertical: "2%" }}>
                            //                             <View style={{ flexDirection: "row", marginLeft: "3%" }}>
                            //                                 <Image style={{ height: 50, width: 50, backgroundColor: "#eee", borderRadius: 7 }} source={{ uri: data[0].profile_pic }} />
                            //                                 <View style={{ backgroundColor: colors.primary, height: 23, width: 23, borderRadius: 40, left: -15, top: 30, borderWidth: 1.5, borderColor: "white", justifyContent: "center", alignItems: "center" }}>
                            //                                     <Text style={{ color: "white", fontSize: height * 0.010 }}>#{data[0].roster_id}</Text>
                            //                                 </View>
                            //                                 <View style={{ flexDirection: "row", left: -10, alignItems: "center", width: "62%" }}>
                            //                                     <Text style={{ marginLeft: "2%" }} ellipsizeMode='tail' numberOfLines={1}>{data[0].user_name}</Text>
                            //                                 </View>
                            //                             </View>
                            //                             <View style={{ flexDirection: "row", width: "20%", left: -35 }}>
                            //                                 {/* <View style={{ backgroundColor: "green", borderRadius: 5, paddingRight: 10, justifyContent: "flex-start" }}> */}
                            //                                 <View style={{ backgroundColor: colors.white, alignItems: "center", flexDirection: "row", paddingVertical: 6, paddingHorizontal: 20, borderRadius: 5 }}>
                            //                                     <Text>{data.length}</Text>
                            //                                     {/* </View> */}
                            //                                 </View>
                            //                                 {
                            //                                     index === currentIndex ? <Ionicons name={"chevron-up-outline"} size={height * 0.03} color={colors.icon} />
                            //                                         : <Ionicons name={"chevron-down-outline"} size={height * 0.03} color={colors.icon} />
                            //                                 }
                            //                             </View>
                            //                         </View>
                            //                         {index === currentIndex && (
                            //                             <View style={styles.content}>
                            //                                 {data.map((obj, index) =>
                            //                                     <>
                            //                                         <View style={{
                            //                                             marginTop: "2%", borderRadius: 10, borderWidth: 1, borderColor: colors.lightgrey, paddingVertical: 10, padding: "4%"
                            //                                         }}>
                            //                                             <View style={{ width: "100%", marginTop: "2%" }}>
                            //                                                 <Text style={{ fontSize: height * 0.017, fontFamily: "Bold", marginTop: "2%" }}>Description</Text>
                            //                                                 <Text style={{ fontSize: height * 0.017, fontFamily: "Regular", marginTop: "2%" }}>{obj.lead_description}</Text>
                            //                                             </View>
                            //                                             <View style={{ flexDirection: "row", width: "100%" }}>
                            //                                                 <View style={{ width: "65%" }}>
                            //                                                     <Text style={{ fontFamily: "Bold" }}>Name</Text>
                            //                                                     <Text style={{ fontFamily: "Regular", fontSize: height * 0.017, marginTop: "1%" }}>{obj.lead_name}</Text>
                            //                                                 </View>
                            //                                                 <View>
                            //                                                     <Text style={{ fontFamily: "Bold" }}>Date</Text>
                            //                                                     <Text style={{ fontFamily: "Regular", fontSize: height * 0.017, marginTop: "1%" }}>{(moment(obj.created_at).format('DD-MM-YYYY'))}</Text>
                            //                                                 </View>
                            //                                             </View>
                            //                                             <View style={{ flexDirection: "row", width: "100%", marginTop: "2%" }}>
                            //                                                 <View style={{ width: "65%" }}>
                            //                                                     <Text style={{ fontFamily: "Bold" }}>Email</Text>
                            //                                                     <Text style={{ fontFamily: "Regular", fontSize: height * 0.017, marginTop: "1%", color: "#58befc" }}>{obj.lead_email}</Text>
                            //                                                 </View>
                            //                                                 <View>
                            //                                                     <Text style={{ fontFamily: "Bold" }}>Phone</Text>
                            //                                                     <Text style={{ fontFamily: "Regular", fontSize: height * 0.017, marginTop: "1%", color: "#58befc" }}>{obj.lead_phone_number}</Text>
                            //                                                 </View>
                            //                                             </View>
                            //                                             <View style={{ flexDirection: "row", width: "100%", marginTop: "2%", alignItems: "center" }}>
                            //                                                 <Text style={{ fontFamily: "Bold" }}>Thank You Amount: </Text>
                            //                                                 <Text style={{ fontFamily: "Regular", fontSize: height * 0.017 }}>{obj.thankyou_amount ? formatter.format(obj.thankyou_amount) + '' + '/-' : null}</Text>
                            //                                             </View>
                            //                                         </View>
                            //                                     </>
                            //                                 )}
                            //                             </View>
                            //                         )}
                            //                     </TouchableOpacity>
                            //                 )}
                            //             </ScrollView>
                            //         </Transitioning.View>
                            //     </>
                            //     :
                            // closed === true
                            //     ?
                            //     <>
                            //         <Transitioning.View
                            //             ref={ref}
                            //             transition={transition}
                            //             style={{ width: "100%", height: "83%", }}
                            //         >
                            //             <ScrollView style={styles.container}>
                            //                 {givenClosedLeads.map((data, index) =>
                            //                     <TouchableOpacity style={{ flexGrow: 1 }} key={index} activeOpacity={0.9}
                            //                         onPress={() => {
                            //                             ref.current.animateNextTransition();
                            //                             setCurrentIndex(index === currentIndex ? null : index);
                            //                         }}>
                            //                         <View style={{ flexDirection: "row", height: height * 0.08, borderRadius: 10, borderColor: colors.lightgrey, backgroundColor: colors.grey, borderWidth: 1, justifyContent: "flex-start", alignItems: "center", marginVertical: "2%" }}>
                            //                             <View style={{ flexDirection: "row", marginLeft: "3%" }}>
                            //                                 <Image style={{ height: 50, width: 50, backgroundColor: "#eee", borderRadius: 7 }} source={{ uri: data[0].profile_pic }} />
                            //                                 <View style={{ backgroundColor: colors.primary, height: 23, width: 23, borderRadius: 40, left: -15, top: 30, borderWidth: 1.5, borderColor: "white", justifyContent: "center", alignItems: "center" }}>
                            //                                     <Text style={{ color: "white", fontSize: height * 0.010 }}>#{data[0].roster_id}</Text>
                            //                                 </View>
                            //                                 <View style={{ flexDirection: "row", left: -10, alignItems: "center", width: "62%" }}>
                            //                                     <Text style={{ marginLeft: "2%" }} ellipsizeMode='tail' numberOfLines={1}>{data[0].user_name}</Text>
                            //                                 </View>
                            //                             </View>
                            //                             <View style={{ flexDirection: "row", width: "20%", left: -35 }}>
                            //                                 <View style={{ backgroundColor: "green", borderRadius: 5, paddingRight: 10, justifyContent: "flex-start" }}>
                            //                                     <View style={{ backgroundColor: colors.white, alignItems: "center", flexDirection: "row", paddingVertical: 6, paddingHorizontal: 20, borderRadius: 5 }}>
                            //                                         <Text>{data.length}</Text>
                            //                                     </View>
                            //                                 </View>
                            //                                 {
                            //                                     index === currentIndex ? <Ionicons name={"chevron-up-outline"} size={height * 0.03} color={colors.icon} />
                            //                                         : <Ionicons name={"chevron-down-outline"} size={height * 0.03} color={colors.icon} />
                            //                                 }
                            //                             </View>
                            //                         </View>
                            //                         {index === currentIndex && (
                            //                             <View style={styles.content}>
                            //                                 {data.map((obj, index) =>
                            //                                     <>
                            //                                         <View style={{
                            //                                             marginTop: "2%", borderRadius: 10, borderWidth: 1, borderColor: colors.lightgrey, paddingVertical: 10, padding: "4%"
                            //                                         }}>
                            //                                             <View style={{ width: "100%", marginTop: "2%" }}>
                            //                                                 <Text style={{ fontSize: height * 0.017, fontFamily: "Bold", marginTop: "2%" }}>Description</Text>
                            //                                                 <Text style={{ fontSize: height * 0.017, fontFamily: "Regular", marginTop: "2%" }}>{obj.lead_description}</Text>
                            //                                             </View>
                            //                                             <View style={{ flexDirection: "row", width: "100%" }}>
                            //                                                 <View style={{ width: "65%" }}>
                            //                                                     <Text style={{ fontFamily: "Bold" }}>Name</Text>
                            //                                                     <Text style={{ fontFamily: "Regular", fontSize: height * 0.017, marginTop: "1%" }}>{obj.lead_name}</Text>
                            //                                                 </View>
                            //                                                 <View>
                            //                                                     <Text style={{ fontFamily: "Bold" }}>Date</Text>
                            //                                                     <Text style={{ fontFamily: "Regular", fontSize: height * 0.017, marginTop: "1%" }}>{(moment(obj.created_at).format('DD-MM-YYYY'))}</Text>
                            //                                                 </View>
                            //                                             </View>
                            //                                             <View style={{ flexDirection: "row", width: "100%", marginTop: "2%" }}>
                            //                                                 <View style={{ width: "65%" }}>
                            //                                                     <Text style={{ fontFamily: "Bold" }}>Email</Text>
                            //                                                     <Text style={{ fontFamily: "Regular", fontSize: height * 0.017, marginTop: "1%", color: "#58befc" }}>{obj.lead_email}</Text>
                            //                                                 </View>
                            //                                                 <View>
                            //                                                     <Text style={{ fontFamily: "Bold" }}>Phone</Text>
                            //                                                     <Text style={{ fontFamily: "Regular", fontSize: height * 0.017, marginTop: "1%", color: "#58befc" }}>{obj.lead_phone_number}</Text>
                            //                                                 </View>
                            //                                             </View>
                            //                                             <View style={{ flexDirection: "row", width: "100%", marginTop: "2%", alignItems: "center" }}>
                            //                                                 <Text style={{ fontFamily: "Bold" }}>Thank You Amount: </Text>
                            //                                                 <Text style={{ fontFamily: "Regular", fontSize: height * 0.017 }}>{obj.thankyou_amount ? formatter.format(obj.thankyou_amount) + '' + '/-' : null}</Text>
                            //                                             </View>
                            //                                         </View>
                            //                                     </>
                            //                                 )}
                            //                             </View>
                            //                         )}
                            //                     </TouchableOpacity>
                            //                 )}
                            //             </ScrollView>
                            //         </Transitioning.View>
                            //     </>
                            // :
                            closedWon === true
                                ?
                                <Transitioning.View
                                    ref={ref}
                                    transition={transition}
                                    style={{ width: "100%", height: "82%", marginTop: "2%" }}
                                >
                                    {givenClosedWonLeads.length > 0 ?
                                        <ScrollView style={styles.container}>
                                            {givenClosedWonLeads.map((data, index) =>
                                                <TouchableOpacity style={{ flexGrow: 1 }} key={index} activeOpacity={0.9}
                                                    onPress={() => {
                                                        ref.current.animateNextTransition();
                                                        setCurrentIndex(index === currentIndex ? null : index);
                                                    }}>
                                                    <View style={{ flexDirection: "row", height: height * 0.08, borderRadius: 10, borderColor: colors.lightgrey, backgroundColor: colors.grey, borderWidth: 1, justifyContent: "flex-start", alignItems: "center", marginVertical: "2%" }}>
                                                        <View style={{ flexDirection: "row", marginLeft: "3%" }}>
                                                            <Image style={{ height: 50, width: 50, backgroundColor: "#eee", borderRadius: 7 }} source={{ uri: data[0].profile_pic }} />
                                                            <View style={{ backgroundColor: colors.primary, height: 23, width: 23, borderRadius: 40, left: -15, top: 30, borderWidth: 1.5, borderColor: "white", justifyContent: "center", alignItems: "center" }}>
                                                                <Text style={{ color: "white", fontSize: height * 0.010 }}>#{data[0].roster_id}</Text>
                                                            </View>
                                                            <View style={{ flexDirection: "row", left: -10, alignItems: "center", width: "62%" }}>
                                                                <Text style={{ marginLeft: "2%" }} ellipsizeMode='tail' numberOfLines={1}>{data[0].user_name}</Text>
                                                            </View>
                                                        </View>
                                                        <View style={{ flexDirection: "row", width: "20%", left: -35 }}>
                                                            <View style={{ backgroundColor: "green", borderRadius: 5, paddingRight: 10, justifyContent: "flex-start" }}>
                                                                <View style={{ backgroundColor: colors.white, alignItems: "center", flexDirection: "row", paddingVertical: 7, paddingHorizontal: 20, borderRadius: 5 }}>
                                                                    <Text>{data.length}</Text>
                                                                </View>
                                                            </View>
                                                            {
                                                                index === currentIndex ? <Ionicons name={"chevron-up-outline"} size={height * 0.03} color={colors.icon} />
                                                                    : <Ionicons name={"chevron-down-outline"} size={height * 0.03} color={colors.icon} />
                                                            }
                                                        </View>
                                                    </View>
                                                    {index === currentIndex && (
                                                        <View style={styles.content}>
                                                            {data.map((obj, index) =>
                                                                <>
                                                                    <View style={{
                                                                        marginTop: "2%", borderRadius: 10, borderWidth: 1, borderColor: colors.lightgrey, paddingVertical: 10, padding: "4%"
                                                                    }}>
                                                                        <View style={{ width: "100%", marginTop: "2%" }}>
                                                                            <Text style={{ fontSize: height * 0.017, fontFamily: "Bold" }}>Description</Text>
                                                                            <Text style={{ fontSize: height * 0.017, fontFamily: "Regular", marginTop: "2%" }}>{obj.lead_description}</Text>
                                                                        </View>
                                                                        <View style={{ flexDirection: "row", width: "100%" }}>
                                                                            <View style={{ width: "65%" }}>
                                                                                <Text style={{ fontFamily: "Bold" }}>Name</Text>
                                                                                <Text style={{ fontFamily: "Regular", fontSize: height * 0.017, marginTop: "1%" }}>{obj.lead_name}</Text>
                                                                            </View>
                                                                            <View>
                                                                                <Text style={{ fontFamily: "Bold" }}>Date</Text>
                                                                                <Text style={{ fontFamily: "Regular", fontSize: height * 0.017, marginTop: "1%" }}>{(moment(obj.created_at).format('DD-MM-YYYY'))}</Text>
                                                                            </View>
                                                                        </View>
                                                                        <View style={{ flexDirection: "row", width: "100%", marginTop: "2%" }}>
                                                                            <View style={{ width: "65%" }}>
                                                                                <Text style={{ fontFamily: "Bold" }}>Email</Text>
                                                                                {obj.lead_email ?
                                                                                    <Text onPress={() => Linking.openURL(`mailto:${obj.lead_email}`)} style={{ fontFamily: "Regular", fontSize: height * 0.017, marginTop: "1%", color: "#58befc" }}>{obj.lead_email}</Text>
                                                                                    : <Text style={{ fontFamily: "Regular", fontSize: height * 0.017, marginTop: "1%", color: "#58befc" }}>{obj.lead_email}</Text>
                                                                                }
                                                                            </View>
                                                                            <View>
                                                                                <Text style={{ fontFamily: "Bold" }}>Phone</Text>
                                                                                {obj.lead_phone_number ?
                                                                                    <Text onPress={() => Linking.openURL(`tel:${obj.lead_phone_number}`)} style={{ fontFamily: "Regular", fontSize: height * 0.017, marginTop: "1%", color: "#58befc" }}>{obj.lead_phone_number}</Text>
                                                                                    : <Text style={{ fontFamily: "Regular", fontSize: height * 0.017, marginTop: "1%", color: "#58befc" }}>{obj.lead_phone_number}</Text>
                                                                                }
                                                                            </View>
                                                                        </View>
                                                                        <View style={{ flexDirection: "row", width: "100%", marginTop: "2%", alignItems: "center" }}>
                                                                            <Text style={{ fontFamily: "Bold" }}>Thank You Amount: </Text>
                                                                            <Text style={{ fontFamily: "Regular", fontSize: height * 0.017 }}>{obj.thankyou_amount ? formatter.format(obj.thankyou_amount) + '' + '/-' : null}</Text>
                                                                        </View>

                                                                    </View>
                                                                </>
                                                            )}
                                                        </View>
                                                    )}
                                                </TouchableOpacity>
                                            )}
                                        </ScrollView>
                                        :
                                        <View style={{ justifyContent: "center", alignItems: "center", flex: 1 }}>
                                            <View style={{ alignItems: "center" }}>
                                                <Ionicons name={"cloud-offline-outline"} size={30} color={colors.primary} />
                                                <Text style={{ fontSize: height * 0.02, fontFamily: "SemiBold", color: colors.grey }}>No Data</Text>
                                            </View>
                                        </View>
                                    }
                                </Transitioning.View>
                                :
                                closedLost === true
                                    ?
                                    <Transitioning.View
                                        ref={ref}
                                        transition={transition}
                                        style={{ width: "100%", height: "82%", marginTop: "2%" }}
                                    >
                                        {givenClosedLostLeads.length > 0 ?

                                            <ScrollView style={styles.container}>

                                                {givenClosedLostLeads.map((data, index) =>
                                                    <TouchableOpacity style={{ flexGrow: 1 }} key={index} activeOpacity={0.9}
                                                        onPress={() => {
                                                            ref.current.animateNextTransition();
                                                            setCurrentIndex(index === currentIndex ? null : index)
                                                        }}>
                                                        <View style={{ flexDirection: "row", height: height * 0.08, borderRadius: 10, borderColor: colors.lightgrey, backgroundColor: colors.grey, borderWidth: 1, justifyContent: "flex-start", alignItems: "center", marginVertical: "2%" }}>
                                                            <View style={{ flexDirection: "row", marginLeft: "3%" }}>
                                                                <Image style={{ height: 50, width: 50, backgroundColor: "#eee", borderRadius: 7 }} source={{ uri: data[0].profile_pic }} />
                                                                <View style={{ backgroundColor: colors.primary, height: 23, width: 23, borderRadius: 40, left: -15, top: 30, borderWidth: 1.5, borderColor: "white", justifyContent: "center", alignItems: "center" }}>
                                                                    <Text style={{ color: "white", fontSize: height * 0.010 }}>#{data[0].roster_id}</Text>
                                                                </View>
                                                                <View style={{ flexDirection: "row", left: -10, alignItems: "center", width: "62%" }}>
                                                                    <Text style={{ marginLeft: "2%" }} ellipsizeMode='tail' numberOfLines={1}>{data[0].user_name}</Text>
                                                                </View>
                                                            </View>
                                                            <View style={{ flexDirection: "row", width: "20%", left: -35 }}>
                                                                <View style={{ backgroundColor: colors.primary, borderRadius: 5, paddingRight: 10, justifyContent: "flex-start" }}>
                                                                    <View style={{ backgroundColor: colors.white, alignItems: "center", flexDirection: "row", paddingVertical: 7, paddingHorizontal: 20, borderRadius: 5 }}>
                                                                        <Text>{data.length}</Text>
                                                                    </View>
                                                                </View>
                                                                {
                                                                    index === currentIndex ? <Ionicons name={"chevron-up-outline"} size={height * 0.03} color={colors.icon} />
                                                                        : <Ionicons name={"chevron-down-outline"} size={height * 0.03} color={colors.icon} />
                                                                }
                                                            </View>
                                                        </View>
                                                        {index === currentIndex && (
                                                            <View style={styles.content}>
                                                                {data.map((obj, index) =>
                                                                    <>
                                                                        <View style={{
                                                                            marginTop: "2%", borderRadius: 10, borderWidth: 1, borderColor: colors.lightgrey, paddingVertical: 10, padding: "4%"
                                                                        }}>
                                                                            <View style={{ width: "100%" }}>
                                                                                <Text style={{ fontSize: height * 0.017, fontFamily: "Bold", marginTop: "2%" }}>Description</Text>
                                                                                <Text style={{ fontSize: height * 0.017, fontFamily: "Regular", marginTop: "2%" }}>{obj.lead_description}</Text>

                                                                            </View>
                                                                            <View style={{ flexDirection: "row", width: "100%", marginTop: "2%" }}>
                                                                                <View style={{ width: "65%" }}>
                                                                                    <Text style={{ fontFamily: "Bold" }}>Name</Text>
                                                                                    <Text style={{ fontFamily: "Regular", fontSize: height * 0.017, marginTop: "1%" }}>{obj.lead_name}</Text>
                                                                                </View>
                                                                                <View>
                                                                                    <Text style={{ fontFamily: "Bold" }}>Date</Text>
                                                                                    <Text style={{ fontFamily: "Regular", fontSize: height * 0.017, marginTop: "1%" }}>{(moment(obj.created_at).format('DD-MM-YYYY'))}</Text>
                                                                                </View>
                                                                            </View>
                                                                            <View style={{ flexDirection: "row", width: "100%", marginTop: "2%" }}>
                                                                                <View style={{ width: "65%" }}>
                                                                                    <Text style={{ fontFamily: "Bold" }}>Email</Text>
                                                                                    {obj.lead_email ?
                                                                                        <Text onPress={() => Linking.openURL(`mailto:${obj.lead_email}`)} style={{ fontFamily: "Regular", fontSize: height * 0.017, marginTop: "1%", color: "#58befc" }}>{obj.lead_email}</Text>
                                                                                        : <Text style={{ fontFamily: "Regular", fontSize: height * 0.017, marginTop: "1%", color: "#58befc" }}>{obj.lead_email}</Text>
                                                                                    }
                                                                                </View>
                                                                                <View>
                                                                                    <Text style={{ fontFamily: "Bold" }}>Phone</Text>
                                                                                    {obj.lead_phone_number ?
                                                                                        <Text onPress={() => Linking.openURL(`tel:${obj.lead_phone_number}`)} style={{ fontFamily: "Regular", fontSize: height * 0.017, marginTop: "1%", color: "#58befc" }}>{obj.lead_phone_number}</Text>
                                                                                        : <Text style={{ fontFamily: "Regular", fontSize: height * 0.017, marginTop: "1%", color: "#58befc" }}>{obj.lead_phone_number}</Text>
                                                                                    }
                                                                                </View>
                                                                            </View>
                                                                            <View style={{ flexDirection: "row", width: "100%", marginTop: "2%", alignItems: "center" }}>
                                                                                <Text style={{ fontFamily: "Bold" }}>Rejection Reason: </Text>
                                                                                <Text style={{ fontFamily: "Regular", fontSize: height * 0.017 }}>{obj.status_reason}</Text>
                                                                            </View>
                                                                        </View>
                                                                    </>
                                                                )}
                                                            </View>
                                                        )}
                                                    </TouchableOpacity>
                                                )}
                                            </ScrollView>
                                            :
                                            <View style={{ justifyContent: "center", alignItems: "center", flex: 1 }}>
                                                <View style={{ alignItems: "center" }}>
                                                    <Ionicons name={"cloud-offline-outline"} size={30} color={colors.primary} />
                                                    <Text style={{ fontSize: height * 0.02, fontFamily: "SemiBold", color: colors.grey }}>No Data</Text>
                                                </View>
                                            </View>
                                        }
                                    </Transitioning.View>
                                    :
                                    <></>
                    }
                </View>
            )}
        </>
    )
}

const styles = StyleSheet.create({
    listTab: {
        flexDirection: "row",
        alignSelf: 'center',
        marginBottom: 1,
        width: "100%",
        marginLeft: "8%",
        marginTop: "1%",
        // backgroundColor: "red"
    },
    btnTab: {
        width: width * 0.45,
        flexDirection: "row",
        marginRight: '2%',
        borderWidth: 0.5,
        borderColor: colors.primary,
        padding: 10,
        borderRadius: 5,
        justifyContent: "center",
    },
    btnTab1: {
        // width: width * 0.35,
        flexDirection: "row",
        marginRight: '1%',
        borderWidth: 0.5,
        borderColor: colors.primary,
        paddingVertical: 8,
        paddingHorizontal: 12.5,
        borderRadius: 5,
        justifyContent: "center", marginBottom: 5
    },
    textTab: {
        fontSize: height * 0.013,
        color: colors.black,
        fontFamily: "SemiBold",
        // fontSize: 13,
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
    textArea: {
        marginBottom: "4%",
        height: 100,
        width: 280,
        textAlignVertical: 'top',
        borderWidth: 1,
        borderColor: colors.grey,
        borderRadius: 10,
        marginTop: "2%",
        padding: 10,
        justifyContent: "flex-start",
        paddingVertical: "5%",
    },
    container: {
        paddingHorizontal: "4%",
        paddingVertical: "1%",

    },
    selector: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: "2%",
        width: "112%",
        height: height * 0.06,
        backgroundColor: colors.lightgrey,
        borderRadius: 10,
        borderColor: colors.grey,
        borderWidth: 1,
        opacity: 0.9, paddingLeft: "2%"
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22,
        width: "100%"
    },
    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        paddingHorizontal: 30,
        paddingBottom: 30,
        paddingTop: 20,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        width: "90%",
        top: -100
    },
    input: {
        fontFamily: "SemiBold",
        width: 280,
        borderWidth: 1,
        borderColor: colors.grey,
        borderRadius: 10,
        marginTop: "2%",
        padding: 10,
    },
    textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center"
    },

});

export default LeadGiven;
