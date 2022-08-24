import React, { useState, useEffect } from 'react'
import { Modal, StatusBar, ScrollView, Image, Dimensions, ActivityIndicator, SafeAreaView, Text, TouchableOpacity, TouchableWithoutFeedback, Keyboard, StyleSheet, View, TextInput } from 'react-native';
import moment from 'moment';
import axios from 'axios';
import { Ionicons } from '@expo/vector-icons';
import { Transition, Transitioning } from 'react-native-reanimated';
import { useSelector } from 'react-redux';
import { Menu, MenuOptions, MenuOption, MenuTrigger } from 'react-native-popup-menu';
import DatePicker from 'react-native-neat-date-picker';
import LeadButton from '../components/LeadButton';
import colors from '../config/colors';
import env from '../config/env';
import ShortButton from '../components/ShortButton';
import DisabledButton from '../components/DisabledButton';
import CancelButton from '../components/CancelButton';
import RadioGroup from 'react-native-radio-buttons-group';
import ModalDropdown from 'react-native-modal-dropdown';
import { useNavigation } from '@react-navigation/native';
import { Formik } from 'formik';
import * as yup from 'yup';
import * as Linking from 'expo-linking';

const radioButtonsData = [{
    id: '1', // acts as primary key, should be unique and non-empty string
    label: 'Closed with Business Generated',
    selected: true,
    value: 'Closed with Business Generated',

}, {
    id: '2',
    label: 'Closed without Business Generated',
    selected: false,
    value: 'Closed without Business Generated',

}]

const transition = (
    <Transition.Together>
        <Transition.In type='fade' durationMs={200} />
        <Transition.Change />
        <Transition.Out type='fade' durationMs={200} />
    </Transition.Together>
);

const { height, width } = Dimensions.get('window');

const LeadReceived = ({ route }) => {
    const token = useSelector(state => state.AuthReducers.accessToken);
    const user_id = useSelector(state => state.AuthReducers.user_id);

    const ref = React.useRef();
    const [modalVisible, setModalVisible] = useState(false);
    const [rejectModalVisible, setRejectModalVisible] = useState(false);
    const [currentIndex, setCurrentIndex] = useState();
    const [ModalDropdownValue, setModalDropdownValue] = useState(null);
    const [ModalDropdownDescription, setModalDropdownDescription] = useState(null);
    const [ModalThankyouAmount, setModalThankyouAmount] = useState(null);
    const [ModalThankyouDescription, setModalThankyouDescription] = useState(null);
    // const [recievedPendingLeads, setRecievedPendingLeads] = useState([]);
    const [recievedOpenLeads, setRecievedOpenLeads] = useState([]);
    // const [recievedClosedLeads, setRecievedClosedLeads] = useState([]);
    const [recievedClosedWonLeads, setRecievedClosedWonLeads] = useState([]);
    const [recievedClosedLostLeads, setRecievedClosedLostLeads] = useState([]);
    const [isLoaded, setIsLoaded] = useState(true);
    const [isLoadedCheckBox, setIsLoadedCheckBox] = useState(true);
    const [radioButtonData, setRadioButtonData] = useState();
    const [status, setStatus] = useState('Received');
    const [selector, setSelector] = useState(route.params ? route.params.selector : "thisfortnight");
    const [selector1, setSelector1] = useState(0);
    const [LeadName, setLeadName] = useState(null);
    const [LeadPhoneNumber, setLeadPhoneNumber] = useState([]);
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
    const [formData, setFormData] = useState([]);
    const [radioButtons, setRadioButtons] = useState(radioButtonsData);
    // const [pending, setPending] = useState(route.params.data == undefined ? true : route.params != undefined && route.params.data != undefined && route.params.data.find(obj => obj.lead_details.status == "pending approval") ? true : false);
    const [open, setOpen] = useState(route.params.data == undefined ? true : route.params != undefined && route.params.data != undefined && route.params.data.find(obj => obj.lead_details.status == "open") ? true : false);
    // const [closed, setClosed] = useState(route.params.data == undefined ? false : route.params != undefined && route.params.data != undefined && route.params.data.find(obj => obj.lead_details.status == "closed") ? true : false);
    const [closedWon, setClosedWon] = useState(route.params.data == undefined ? false : route.params != undefined && route.params.data != undefined && route.params.data.find(obj => obj.lead_details.status == "closed won") ? true : false);
    const [closedLost, setClosedLost] = useState(route.params.data == undefined ? false : route.params != undefined && route.params.data != undefined && route.params.data.find(obj => obj.lead_details.status == "closed lost") ? true : false);
    const [ValidationMessage, setValidationMessage] = useState(false);

    const Schema = yup.object({
        amount: yup.string().required("Amount is required")
    })

    function onPressRadioButton(radioButtonsArray) {
        setIsLoaded(true);
        setRadioButtons(radioButtonsArray);
        setIsLoaded(false);
    }

    if (route.params != undefined && route.params.data != undefined) {
        // var obj = route.params.data.find(obj => obj.lead_details.status == "pending approval") ? route.params.data.find(obj => obj.lead_details.status == "pending approval") :
        //     route.params.data.find(obj => obj.lead_details.status == "open") ? route.params.data.find(obj => obj.lead_details.status == "open") :
        //         route.params.data.find(obj => obj.lead_details.status == "closed") ? route.params.data.find(obj => obj.lead_details.status == "closed") :
        //             route.params.data.find(obj => obj.lead_details.status == "closed won") ? route.params.data.find(obj => obj.lead_details.status == "closed won") :
        //                 route.params.data.find(obj => obj.lead_details.status == "closed lost")
        var obj = route.params.data.find(obj => obj.lead_details.status == "open") ? route.params.data.find(obj => obj.lead_details.status == "open") :
            route.params.data.find(obj => obj.lead_details.status == "closed won") ? route.params.data.find(obj => obj.lead_details.status == "closed won") :
                route.params.data.find(obj => obj.lead_details.status == "closed lost")

        // var IndexForPendnigApproval = obj.lead_details.status == 'pending approval' ? recievedPendingLeads.findIndex((object) => object.find((data) => data.id == obj.lead_details.id)) : -1
        var IndexForOpen = obj.lead_details.status == 'open' ? recievedOpenLeads.findIndex((object) => object.find((data) => data.id == obj.lead_details.id)) : -1
        // var IndexForClosed = obj.lead_details.status == 'closed' ? recievedClosedLeads.findIndex((object) => object.find((data) => data.id == obj.lead_details.id)) : -1
        var IndexForClosedWon = obj.lead_details.status == 'closed won' ? recievedClosedWonLeads.findIndex((object) => object.find((data) => data.id == obj.lead_details.id)) : -1
        var IndexForClosedLost = obj.lead_details.status == 'closed lost' ? recievedClosedLostLeads.findIndex((object) => object.find((data) => data.id == obj.lead_details.id)) : -1
    }

    useEffect(() => {
        axios({
            method: "GET",
            url: `${env.endpointURL}/leads?selector=${selector}`,
            headers: {
                'Cookie': `jwt=${token}`,
            },
        })
            .then(function (res) {
                // setRecievedPendingLeads(res.data.drillDownRecData.penidngLeadsRecArr);
                setRecievedOpenLeads(res.data.drillDownRecData.openLeadsRecArr);
                // setRecievedClosedLeads(res.data.drillDownRecData.closedLeadsRecArr);
                setRecievedClosedWonLeads(res.data.drillDownRecData.closedWonLeadsRecArr);
                setRecievedClosedLostLeads(res.data.drillDownRecData.closedLostLeadsRecArr);
                setIsLoaded(false);
            })
            .catch(function (error) {
                console.log("error at get all leads api in leadReceived", error.message)
            })

    }, [selector, selector1, route.params]);


    const acknowledgeCreate = (obj, status, amount) => {
        if (!obj) return false
        setIsLoaded(false);
        axios({
            method: "PUT",
            url: `${env.endpointURL}/leads/${obj[0].id}`,
            headers: {
                'Cookie': `jwt=${token}`,
            },
            data: {
                "id": obj[0].id,
                "status": status,
                "thankyou_amount": amount,
                "thankyou_description": ModalThankyouDescription,
                "updated_by": user_id
            }
        })
            .then(function (res) {
                setSelector1(selector1 => ++selector1)
                closedWonClick();
                setIsLoaded(true);
                setRadioButtonData();
                // console.log("res.data", res.data);
            })
            .catch(function (error) {
                console.log("error at acknowledgeCreate lead update api in leadReceived", error.message)
            });
    }

    const rejectionSubmit = (obj) => {
        if (!obj) return false
        setIsLoaded(false);
        axios({
            method: "PUT",
            url: `${env.endpointURL}/leads/${obj[0].id}`,
            headers: {
                'Cookie': `jwt=${token}`,
            },
            data: {
                "id": obj[0].id,
                "status": "closed lost",
                "updated_by": user_id,
                "status_reason": ModalDropdownValue == 0 ? 'Not Interested' : ModalDropdownValue == 1 ? 'Did not respond' : 'Not a match to our service',
                "rejection_description": ModalDropdownDescription
            }
        })
            .then(function (res) {
                setSelector1(selector1 => ++selector1)
                setModalDropdownValue(null);
                setModalDropdownDescription(null);
                closedLostClick();
                setRadioButtonData();
                setIsLoaded(true);
                // console.log("res.data", res.data);
            })
            .catch(function (error) {
                console.log("error at rejectionSubmit lead update api in leadReceived", error.message)
            });
    }

    const thankyouSubmit = (obj, amount) => {
        if (!obj) return false
        axios({
            method: "POST",
            url: `${env.endpointURL}/thankyounotes`,
            headers: {
                'Cookie': `jwt=${token}`,
            },
            data: {
                "thankyou_by_user_id": user_id,
                "lead_id": obj[0].id,
                "thankyou_to_user_id": obj[0].lead_by_user_id,
                "thankyou_amount": amount,
                "thankyou_description": ModalThankyouDescription,
            }
        })
            .then(function (res) {
                setSelector1(selector1 => ++selector1)
                setModalThankyouAmount(null);
                setModalThankyouDescription(null);
                setRadioButtonData();
                closedWonClick();
                // console.log("res.data", res.data);
            })
            .catch(function (error) {
                console.log("error at thankyounotes api in leadReceived", error.message)
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
                console.log("error at users api in leadReceived", error.message)
            })
    }, []);

    const collectDataforSelfLead = (index, data_exist, lead_id) => {
        for (let i = 0; i < formData.length; i++) {
            if (formData[i].index == index && formData[i].lead_id == lead_id) {
                delete formData[i]
            }
        }
        if (formData.length == 0 || !data_exist) {
            formData.push({ index: index, field: "Name", text: username, lead_id: lead_id })
            formData.push({ index: index, field: "Email", text: email, lead_id: lead_id })
            formData.push({ index: index, field: "Phone", text: phone, lead_id: lead_id })
            formData.push({ index: index, field: "Description", text: "", lead_id: lead_id })
        }
        setIsLoadedCheckBox(isLoadedCheckBox ? false : true);
        return setFormData(formData.filter(val => val !== undefined));
    }

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

    const cancellationReasonFunctionality = () => {
        if (ModalDropdownValue == null) {
            setValidationMessage(true)
        } else {
            setRejectModalVisible(!rejectModalVisible);
            rejectionSubmit(radioButtonData);
            setValidationMessage(false)
        }
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
                                count={recievedOpenLeads.reduce((count, innerArray) => count + innerArray.length, 0)} />
                        </TouchableOpacity>
                        {/* <TouchableOpacity onPress={closedClick}>
                            <LeadButton text={"Closed"} color={"#D4D4D4"} icon={"close-circle"} iconColor={"#7F7F7F"} selected={closed} />
                        </TouchableOpacity> */}
                        <TouchableOpacity onPress={closedWonClick}>
                            <LeadButton text={"Completed"} color={"#E1F7D1"} icon={"thumbs-up"} iconColor={"#5ABC73"} selected={closedWon}
                                count={recievedClosedWonLeads.reduce((count, innerArray) => count + innerArray.length, 0)} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={closedLostClick}>
                            <LeadButton text={"Cancelled"} color={"#FFD8D8"} icon={"thumbs-down"} iconColor={"#FE9292"} selected={closedLost}
                                count={recievedClosedLostLeads.reduce((count, innerArray) => count + innerArray.length, 0)} />
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
                        // Commanted the code as per shyam statement
                        // pending === true
                        //     ?
                        //     <>
                        //         <Transitioning.View
                        //             ref={ref}
                        //             transition={transition}
                        //             style={{ width: "100%", height: "83%", }}
                        //         >
                        //             <ScrollView style={styles.container}>
                        //                 {recievedPendingLeads.map((data, index) =>
                        //                     <TouchableOpacity style={{ flexGrow: 1 }} key={index} activeOpacity={0.9}
                        //                         onPress={() => {
                        //                             ref.current.animateNextTransition();
                        //                             setCurrentIndex((index === IndexForPendnigApproval || index === currentIndex) ? null : index);
                        //                             route.params = false;
                        //                         }}>
                        //                         <View style={{ flexDirection: "row", height: height * 0.08, borderRadius: 10, borderColor: colors.lightgrey, backgroundColor: colors.grey, borderWidth: 1, justifyContent: "flex-start", alignItems: "center", marginVertical: "2%", }}>
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
                        //                                 </View>
                        //                                 {/* </View> */}
                        //                                 {
                        //                                     (index === IndexForPendnigApproval || index === currentIndex) ?
                        //                                         <Ionicons name={"chevron-up-outline"} size={height * 0.03} color={colors.icon} />
                        //                                         : <Ionicons name={"chevron-down-outline"} size={height * 0.03} color={colors.icon} />
                        //                                 }
                        //                             </View>
                        //                         </View>
                        //                         {(index === IndexForPendnigApproval || index === currentIndex) && (
                        //                             <View style={styles.content}>
                        //                                 {data.map((obj, index) => {
                        //                                     if (radioButtonData && obj != radioButtonData[0]) {
                        //                                         obj.selected = false;
                        //                                     }
                        //                                 }
                        //                                 )}
                        //                                 {data.map((obj, index) =>
                        //                                     <>
                        //                                         <View style={{
                        //                                             marginTop: "2%", borderRadius: 10, borderWidth: 1, borderColor: colors.lightgrey, paddingVertical: 10, padding: "4%"
                        //                                         }}>
                        //                                             <View style={{ flexDirection: "row", alignItems: "flex-start", left: -10 }}>
                        //                                                 <RadioGroup
                        //                                                     key={obj.id}
                        //                                                     radioButtons={[data[index]]}
                        //                                                     onPress={obj => setRadioButtonData(obj)}
                        //                                                 />
                        //                                                 <Text style={{ fontSize: height * 0.017, fontFamily: "Bold", marginTop: "2%" }}>Description</Text>
                        //                                             </View>
                        //                                             <View style={{ marginTop: "2%" }}>
                        //                                                 <Text style={{ fontSize: height * 0.017, fontFamily: "Regular", marginTop: "2%" }}>{obj.lead_description}</Text>
                        //                                             </View>
                        //                                             <View style={{ flexDirection: "row", width: "100%", marginTop: "2%" }}>
                        //                                                 <View style={{ width: "65%" }}>
                        //                                                     <Text style={{ fontFamily: "Bold" }}>Name</Text>
                        //                                                     <Text style={{ fontFamily: "Regular", fontSize: height * 0.017, marginTop: "1%" }}>{obj.lead_name}</Text>
                        //                                                 </View>
                        //                                                 <View>
                        //                                                     <Text style={{ fontFamily: "Bold" }}>Date</Text>
                        //                                                     <Text style={{ fontFamily: "Regular", fontSize: height * 0.017, marginTop: "1%" }}>{(moment(obj.created_at).format('DD-MM-YYYY'))}</Text>
                        //                                                 </View>
                        //                                             </View>
                        //                                             <View style={{ flexDirection: "row", width: "100%", marginTop: "2%", marginBottom: "2%" }}>
                        //                                                 <View style={{ width: "65%" }}>
                        //                                                     <Text style={{ fontFamily: "Bold" }}>Email</Text>
                        //                                                     <Text onPress={() => Linking.openURL(`mailto:${obj.lead_email}`)} style={{ fontFamily: "Regular", fontSize: height * 0.017, marginTop: "1%", color: "#58befc" }}>{obj.lead_email}</Text>
                        //                                                 </View>
                        //                                                 <View>
                        //                                                     <Text style={{ fontFamily: "Bold" }}>Phone</Text>
                        //                                                     <Text onPress={() => Linking.openURL(obj.lead_phone_number)} style={{ fontFamily: "Regular", fontSize: height * 0.017, marginTop: "1%", color: "#58befc" }}>{obj.lead_phone_number}</Text>
                        //                                                 </View>
                        //                                             </View>
                        //                                         </View>
                        //                                     </>
                        //                                 )}
                        //                             </View>
                        //                         )}
                        //                     </TouchableOpacity>
                        //                 )}
                        //             </ScrollView>
                        //             <View style={{ width: "100%", justifyContent: "space-evenly", alignItems: "center", flexDirection: "row" }}>
                        //                 <CancelButton onPress={() => setRejectModalVisible(true)} text="Reject" />
                        //                 <ShortButton onPress={() => setModalVisible(true)} text="Acknowledge" />
                        //             </View>
                        //         </Transitioning.View>
                        //         <View style={styles.centeredView}>
                        //             <Modal
                        //                 animationType="slide"
                        //                 transparent={true}
                        //                 visible={modalVisible}
                        //                 onRequestClose={() => {
                        //                     // Alert.alert("Modal has been closed.");
                        //                     setModalVisible(!modalVisible);
                        //                 }}
                        //             >
                        //                 <View style={styles.centeredView}>
                        //                     <View style={styles.modalView}>
                        //                         <Text style={{ fontFamily: "Bold", fontSize: height * 0.025 }}>Confirmation</Text>
                        //                         <Text style={{ fontFamily: "Bold", fontSize: height * 0.016, marginTop: "4%" }}>Do you want to Acknowledge the Lead?</Text>
                        //                         <Text style={{ fontFamily: "Medium", fontSize: height * 0.016, marginTop: "4%", color: colors.darkgrey, marginBottom: "8%", textAlign: "center" }}>On clicking OK an Acknowledge will be sent to {radioButtonData ? radioButtonData[0].user_name : null}</Text>
                        //                         <View style={{ width: "100%", justifyContent: "space-evenly", alignItems: "center", flexDirection: "row" }}>
                        //                             <CancelButton onPress={() => setModalVisible(!modalVisible)} text="Cancel" />
                        //                             <ShortButton onPress={() => { setModalVisible(!modalVisible); acknowledgeCreate(radioButtonData, 'open') }} text="OK" />
                        //                         </View>
                        //                     </View>
                        //                 </View>
                        //             </Modal>
                        //         </View>
                        //         <View style={styles.centeredView}>
                        //             <Modal
                        //                 animationType="slide"
                        //                 transparent={true}
                        //                 visible={rejectModalVisible}
                        //                 onRequestClose={() => {
                        //                     // Alert.alert("Modal has been closed.");
                        //                     setRejectModalVisible(!rejectModalVisible);
                        //                 }}
                        //             >
                        //                 <View style={styles.centeredView}>
                        //                     <View style={styles.modalView}>
                        //                         <Text style={{ fontFamily: "Bold", fontSize: height * 0.025 }}>Rejection Reason</Text>
                        //                         <TouchableOpacity style={styles.selector}>

                        //                             <ModalDropdown onSelect={(value) => { setModalDropdownValue(value) }} defaultValue={'Select Any*'} dropdownStyle={{ width: "73%", marginTop: "2%", marginBottom: "-20%" }} style={{ width: "100%", paddingLeft: "1%" }} options={['Not Interested', 'Did not respond', 'Not a match to our service']} />
                        //                             {/* </Menu> */}
                        //                         </TouchableOpacity>
                        //                         <Text style={{ fontFamily: "Bold", fontSize: height * 0.016, marginTop: "4%" }}>Add Description</Text>
                        //                         <TextInput
                        //                             style={styles.textArea}
                        //                             multiline={true}
                        //                             numberOfLines={10}
                        //                             placeholder="Add description"
                        //                             keyboardType="default"
                        //                             // autoCapitalize="words"
                        //                             returnKeyType="done"
                        //                             selectionColor={colors.black}
                        //                             dataDetectorTypes="address" //only ios
                        //                             onChangeText={(text) => setModalDropdownDescription(text)}
                        //                             clearButtonMode="always" //only on IOS
                        //                         />
                        //                         <View style={{ width: "100%", justifyContent: "space-evenly", alignItems: "center", flexDirection: "row" }}>
                        //                             <CancelButton onPress={() => setRejectModalVisible(!rejectModalVisible)} text="Cancel" />
                        //                             <ShortButton onPress={() => { setRejectModalVisible(!rejectModalVisible); rejectionSubmit(radioButtonData) }} text="Submit" />
                        //                         </View>
                        //                     </View>
                        //                 </View>
                        //             </Modal>
                        //         </View>
                        //     </>
                        //     :
                        open === true
                            ?
                            <>
                                <Transitioning.View
                                    ref={ref}
                                    transition={transition}
                                    style={{ width: "100%", height: "83%", }}
                                >
                                    {recievedOpenLeads.length > 0 ?
                                        <>
                                            <ScrollView style={styles.container}>
                                                {recievedOpenLeads.map((data, index) =>
                                                    <View style={{ flexGrow: 1 }}
                                                    >
                                                        <TouchableOpacity key={index} activeOpacity={0.9} onPress={() => {
                                                            ref.current.animateNextTransition();
                                                            setCurrentIndex((index === IndexForOpen || index === currentIndex) ? null : index);
                                                            route.params = false;
                                                        }} style={{ flexDirection: "row", height: height * 0.08, borderRadius: 10, borderColor: colors.lightgrey, backgroundColor: colors.grey, borderWidth: 1, justifyContent: "flex-start", alignItems: "center", marginVertical: "2%" }}>
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
                                                                <View style={{ backgroundColor: colors.white, alignItems: "center", flexDirection: "row", paddingVertical: 6, paddingHorizontal: 20, borderRadius: 5 }}>
                                                                    <Text>{data.length}</Text>
                                                                </View>
                                                                {
                                                                    (index === IndexForOpen || index === currentIndex) ?
                                                                        <Ionicons name={"chevron-up-outline"} size={height * 0.03} color={colors.icon} />
                                                                        : <Ionicons name={"chevron-down-outline"} size={height * 0.03} color={colors.icon} />
                                                                }
                                                            </View>
                                                        </TouchableOpacity>
                                                        {(index === IndexForOpen || index === currentIndex) && (
                                                            <View style={styles.content}>
                                                                {data.map((obj, index) => {
                                                                    if (radioButtonData && obj.id == radioButtonData[0].id) {
                                                                        obj.selected = true;
                                                                    } else obj.selected = false;
                                                                }
                                                                )}
                                                                {data.map((obj, index) =>
                                                                    <>
                                                                        <View style={{
                                                                            marginTop: "2%", borderRadius: 10, borderWidth: 1, borderColor: colors.lightgrey, paddingVertical: 10, padding: "4%"
                                                                        }}>
                                                                            <View style={{ flexDirection: "row", alignItems: "flex-start", left: -10 }}>
                                                                                <RadioGroup
                                                                                    key={obj.id}
                                                                                    radioButtons={[data[index]]}
                                                                                    onPress={obj => setRadioButtonData(obj)}
                                                                                />
                                                                                <Text style={{ fontSize: height * 0.017, fontFamily: "Bold", marginTop: "2%" }}>Description</Text>
                                                                            </View>
                                                                            <View style={{ marginTop: "2%" }}>
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

                                                                            <View style={{ flexDirection: "row", width: "100%", marginTop: "2%", marginBottom: "2%" }}>
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
                                                                        </View>
                                                                    </>
                                                                )}
                                                            </View>
                                                        )}
                                                    </View>
                                                )}
                                            </ScrollView>
                                            {radioButtonData ?
                                                <View style={{ width: "100%", justifyContent: "space-evenly", alignItems: "center", flexDirection: "row" }}>
                                                    <CancelButton onPress={() => setRejectModalVisible(true)} text="Cancel" />
                                                    <ShortButton onPress={() => setModalVisible(true)} text="Send Thankyou" />
                                                </View> :
                                                <View />
                                            }
                                        </> :
                                        <View style={{ justifyContent: "center", alignItems: "center", flex: 1 }}>
                                            <View style={{ alignItems: "center" }}>
                                                <Ionicons name={"cloud-offline-outline"} size={30} color={colors.primary} />
                                                <Text style={{ fontSize: height * 0.02, fontFamily: "SemiBold", color: colors.grey }}>No Data</Text>
                                            </View>
                                        </View>
                                    }

                                </Transitioning.View>
                                <View style={styles.centeredView}>
                                    <Modal
                                        animationType="slide"
                                        transparent={true}
                                        visible={modalVisible}
                                        onRequestClose={() => {
                                            // Alert.alert("Modal has been closed.");
                                            setModalVisible(!modalVisible);
                                        }}
                                    >
                                        <Formik
                                            initialValues={{ amount: '' }}
                                            onSubmit={(values) => {
                                                setModalVisible(!modalVisible);
                                                acknowledgeCreate(radioButtonData, 'closed won', values.amount);
                                                thankyouSubmit(radioButtonData, values.amount);
                                            }}
                                            validationSchema={Schema}
                                        >
                                            {({ errors, touched, handleChange, handleBlur, handleSubmit, values }) => (
                                                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                                                    <View style={styles.centeredView}>
                                                        <View style={styles.modalView}>
                                                            <View style={{ width: "100%" }}>
                                                                <View style={{ flexDirection: "row", alignItems: "center" }}>
                                                                    <Text style={{ fontFamily: "Bold", fontSize: height * 0.025 }}>Send Thankyou Note</Text>
                                                                    <Ionicons name={"close-outline"} size={height * 0.03} style={{ marginLeft: "30%", bottom: 15 }} color={colors.icon} onPress={() => setModalVisible(!modalVisible)} />
                                                                </View>
                                                                <Text style={{ fontFamily: "Bold", fontSize: height * 0.016, marginTop: "4%" }}>Enter Amount</Text>
                                                                <TextInput
                                                                    style={styles.input}
                                                                    placeholder="Enter amount"
                                                                    keyboardType="number-pad"
                                                                    // autoCapitalize="words"
                                                                    returnKeyType="done"
                                                                    selectionColor={colors.selector}
                                                                    textContentType="amount"//only ios
                                                                    onChangeText={handleChange("amount")}
                                                                    onBlur={handleBlur("amount")}
                                                                    value={values.amount}
                                                                    clearButtonMode="always" //only on IOS
                                                                />
                                                                <View style={{ marginVertical: "1%" }}>
                                                                    {
                                                                        errors.amount && touched.amount ? (
                                                                            <Text style={{ color: "red", fontSize: height * 0.015 }}>{errors.amount}</Text>

                                                                        ) :
                                                                            <View style={{ height: height * 0.015 }} />
                                                                    }
                                                                </View>
                                                                <Text style={{ fontFamily: "Bold", fontSize: height * 0.016, marginTop: "4%" }}>Add Description</Text>
                                                                <TextInput
                                                                    style={styles.textArea}
                                                                    multiline={true}
                                                                    numberOfLines={10}
                                                                    placeholder="Add description"
                                                                    keyboardType="default"
                                                                    // autoCapitalize="words"
                                                                    returnKeyType="done"
                                                                    selectionColor={colors.selector}
                                                                    dataDetectorTypes="address" //only ios
                                                                    onChangeText={(text) => setModalThankyouDescription(text)}
                                                                    clearButtonMode="always" //only on IOS
                                                                />
                                                            </View>
                                                            <View style={{ width: "100%", justifyContent: "space-evenly", alignItems: "center", flexDirection: "row" }}>
                                                                <CancelButton onPress={() => setModalVisible(!modalVisible)} text="Cancel" />
                                                                <ShortButton onPress={() => { handleSubmit(); }} text="Submit" />
                                                            </View>
                                                        </View>
                                                    </View>
                                                </TouchableWithoutFeedback>
                                            )}
                                        </Formik>
                                    </Modal>

                                </View>
                                <View style={styles.centeredView}>
                                    <Modal
                                        animationType="slide"
                                        transparent={true}
                                        visible={rejectModalVisible}
                                        onRequestClose={() => {
                                            // Alert.alert("Modal has been closed.");
                                            setRejectModalVisible(!rejectModalVisible);

                                        }}
                                    >
                                        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                                            <View style={styles.centeredView}>
                                                <View style={styles.modalView}>
                                                    <View style={{ width: "100%" }}>
                                                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                                                            <Text style={{ fontFamily: "Bold", fontSize: height * 0.025 }}>Cancellation Reason</Text>
                                                            <Ionicons name={"close-outline"} size={height * 0.03} style={{ marginLeft: "35%", bottom: 15 }} color={colors.icon} onPress={() => setRejectModalVisible(!rejectModalVisible)} />
                                                        </View>

                                                        <View style={{ flexDirection: "row", marginTop: "2%" }}>
                                                            <Text style={{ fontFamily: "Bold", fontSize: height * 0.016 }}>Select Reason</Text>
                                                            <Text style={{ fontFamily: "SemiBold", color: colors.danger }}>*</Text>
                                                        </View>
                                                        <TouchableOpacity style={styles.selector}>
                                                            <ModalDropdown onSelect={(value) => { setModalDropdownValue(value); setValidationMessage(false) }} defaultValue={'Select Any'}
                                                                dropdownStyle={{ width: "69%", marginTop: "2%", marginBottom: "-20%" }} style={{ width: "90%", paddingLeft: "1%" }}
                                                                options={['Not Interested', 'Did not respond', 'Not a match to our service']} />
                                                            {/* <Ionicons name={"caret-down-outline"} size={height * 0.03} style={{ marginRight: "2%" }} color={colors.icon} /> */}
                                                        </TouchableOpacity>

                                                        {ModalDropdownValue == null && ValidationMessage ?
                                                            <Text style={{ marginTop: "1%", color: "red", fontSize: height * 0.015 }}>Reason is required</Text>
                                                            : <Text />
                                                        }
                                                        <Text style={{ fontFamily: "Bold", fontSize: height * 0.016, marginTop: "4%" }}>Add Description</Text>
                                                        <TextInput
                                                            // style={styles.textArea}
                                                            style={{
                                                                marginBottom: "4%",
                                                                height: 100,
                                                                width: 305,
                                                                textAlignVertical: 'top',
                                                                borderWidth: 1,
                                                                borderColor: colors.grey,
                                                                borderRadius: 10,
                                                                marginTop: "2%",
                                                                padding: 10,
                                                                justifyContent: "flex-start",
                                                                paddingVertical: "5%",
                                                            }}
                                                            multiline={true}
                                                            numberOfLines={10}
                                                            placeholder="Add description"
                                                            keyboardType="default"
                                                            // autoCapitalize="words"
                                                            returnKeyType="done"
                                                            selectionColor={colors.selector}
                                                            dataDetectorTypes="address" //only ios
                                                            onChangeText={(text) => setModalDropdownDescription(text)}
                                                            clearButtonMode="always" //only on IOS
                                                        />
                                                        <View style={{ width: "100%", justifyContent: "space-evenly", alignItems: "center", flexDirection: "row", marginLeft: "10%" }}>
                                                            <CancelButton onPress={() => setRejectModalVisible(!rejectModalVisible)} text="Cancel" />
                                                            <ShortButton onPress={() => cancellationReasonFunctionality()} text="Submit" />
                                                        </View>
                                                    </View>
                                                </View>
                                            </View>
                                        </TouchableWithoutFeedback>
                                    </Modal>
                                </View>
                            </> :

                            // closed === true
                            //     // option === 'Closed' || closed === true
                            //     ?
                            //     <>
                            //         <Transitioning.View
                            //             ref={ref}
                            //             transition={transition}
                            //             style={{ width: "100%", height: "83%", }}
                            //         >
                            //             <ScrollView style={styles.container}>
                            //                 {recievedClosedLeads.map((data, index) =>
                            //                     <TouchableOpacity style={{ flexGrow: 1 }} key={index} activeOpacity={0.9}
                            //                         onPress={() => {
                            //                             ref.current.animateNextTransition();
                            //                             setCurrentIndex((index === IndexForClosed || index === currentIndex) ? null : index);
                            //                             route.params = false;
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
                            //                                 <View style={{ backgroundColor: colors.white, alignItems: "center", flexDirection: "row", paddingVertical: 6, paddingHorizontal: 20, borderRadius: 5 }}>
                            //                                     <Text>{data.length}</Text>
                            //                                 </View>
                            //                                 {
                            //                                     (index === IndexForClosed || index === currentIndex) ?
                            //                                         <Ionicons name={"chevron-up-outline"} size={height * 0.03} color={colors.icon} />
                            //                                         : <Ionicons name={"chevron-down-outline"} size={height * 0.03} color={colors.icon} />
                            //                                 }
                            //                             </View>
                            //                         </View>
                            //                         {(index === IndexForClosed || index === currentIndex) && (
                            //                             <View style={styles.content}>
                            //                                 {data.map((obj, index) => {
                            //                                     if (radioButtonData && obj != radioButtonData[0]) {
                            //                                         obj.selected = false;
                            //                                     }
                            //                                 }
                            //                                 )}
                            //                                 {data.map((obj, index) =>
                            //                                     <>
                            //                                         <View style={{
                            //                                             marginTop: "2%", borderRadius: 10, borderWidth: 1, borderColor: colors.lightgrey, paddingVertical: 10, padding: "4%"
                            //                                         }}>
                            //                                             <View style={{ flexDirection: "row", alignItems: "flex-start", left: -10 }}>
                            //                                                 <RadioGroup
                            //                                                     key={obj.id}
                            //                                                     radioButtons={[data[index]]}
                            //                                                     onPress={obj => setRadioButtonData(obj)}
                            //                                                 />
                            //                                                 <Text style={{ fontSize: height * 0.017, fontFamily: "Bold", marginTop: "2%" }}>Description</Text>
                            //                                             </View>
                            //                                             <View style={{ marginTop: "2%" }}>
                            //                                                 <Text style={{ fontSize: height * 0.017, fontFamily: "Regular", marginTop: "2%" }}>{obj.lead_description}</Text>
                            //                                             </View>
                            //                                             <View style={{ flexDirection: "row", width: "100%", marginTop: "2%" }}>
                            //                                                 <View style={{ width: "65%" }}>
                            //                                                     <Text style={{ fontFamily: "Bold" }}>Name</Text>
                            //                                                     <Text style={{ fontFamily: "Regular", fontSize: height * 0.017, marginTop: "1%" }}>{obj.lead_name}</Text>
                            //                                                 </View>
                            //                                                 <View>
                            //                                                     <Text style={{ fontFamily: "Bold" }}>Date</Text>
                            //                                                     <Text style={{ fontFamily: "Regular", fontSize: height * 0.017, marginTop: "1%" }}>{(moment(obj.created_at).format('DD-MM-YYYY'))}</Text>
                            //                                                 </View>
                            //                                             </View>

                            //                                             <View style={{ flexDirection: "row", width: "100%", marginTop: "2%", marginBottom: "2%" }}>
                            //                                                 <View style={{ width: "65%" }}>
                            //                                                     <Text style={{ fontFamily: "Bold" }}>Email</Text>
                            //                                                     <Text onPress={() => Linking.openURL(`mailto:${obj.lead_email}`)} style={{ fontFamily: "Regular", fontSize: height * 0.017, marginTop: "1%", color: "#58befc" }}>{obj.lead_email}</Text>
                            //                                                 </View>
                            //                                                 <View>
                            //                                                     <Text style={{ fontFamily: "Bold" }}>Phone</Text>
                            //                                                     <Text onPress={() => Linking.openURL(obj.lead_phone_number)} style={{ fontFamily: "Regular", fontSize: height * 0.017, marginTop: "1%", color: "#58befc" }}>{obj.lead_phone_number}</Text>
                            //                                                 </View>
                            //                                             </View>
                            //                                         </View>
                            //                                     </>
                            //                                 )}
                            //                             </View>
                            //                         )}
                            //                     </TouchableOpacity>
                            //                 )}
                            //             </ScrollView>
                            //             <View style={{ width: "100%", justifyContent: "space-evenly", alignItems: "center", flexDirection: "row" }}>
                            //                 <ShortButton onPress={() => setModalVisible(true)} text="Send Thankyou" />
                            //             </View>
                            //         </Transitioning.View>
                            //         <View style={styles.centeredView}>
                            //             <Modal
                            //                 animationType="slide"
                            //                 transparent={true}
                            //                 visible={modalVisible}
                            //                 onRequestClose={() => {
                            //                     // Alert.alert("Modal has been closed.");
                            //                     setModalVisible(!modalVisible);
                            //                 }}
                            //             >
                            //                 <View style={styles.centeredView}>
                            //                     <View style={styles.modalView}>
                            //                         <View style={{ width: "100%" }}>
                            //                             <Text style={{ fontFamily: "Bold", fontSize: height * 0.025 }}>Send Thankyou Note</Text>
                            //                             <Text style={{ fontFamily: "Bold", fontSize: height * 0.016, marginTop: "4%" }}>Enter Amount*</Text>
                            //                             <TextInput
                            //                                 style={styles.input}
                            //                                 placeholder="Enter amount"
                            //                                 keyboardType="number-pad"
                            //                                 // autoCapitalize="words"
                            //                                 returnKeyType="done"
                            //                                 selectionColor={colors.black}
                            //                                 textContentType="amount"//only ios
                            //                                 onChangeText={(text) => setModalThankyouAmount(text)}
                            //                                 clearButtonMode="always" //only on IOS
                            //                             />
                            //                             <Text style={{ fontFamily: "Bold", fontSize: height * 0.016, marginTop: "4%" }}>Add Description</Text>
                            //                             <TextInput
                            //                                 style={styles.textArea}
                            //                                 multiline={true}
                            //                                 numberOfLines={10}
                            //                                 placeholder="Add description"
                            //                                 keyboardType="default"
                            //                                 // autoCapitalize="words"
                            //                                 returnKeyType="done"
                            //                                 selectionColor={colors.black}
                            //                                 dataDetectorTypes="address" //only ios
                            //                                 onChangeText={(text) => setModalThankyouDescription(text)}
                            //                                 clearButtonMode="always" //only on IOS
                            //                             />
                            //                         </View>
                            //                         <View style={{ width: "100%", justifyContent: "space-evenly", alignItems: "center", flexDirection: "row" }}>
                            //                             <CancelButton onPress={() => setModalVisible(!modalVisible)} text="Cancel" />
                            //                             <ShortButton onPress={() => { setModalVisible(!modalVisible); acknowledgeCreate(radioButtonData, 'closed won'); thankyouSubmit(radioButtonData); }} text="Submit" />
                            //                         </View>
                            //                     </View>
                            //                 </View>
                            //             </Modal>

                            //         </View>

                            //     </>
                            //     :
                            closedWon === true
                                ?
                                <Transitioning.View
                                    ref={ref}
                                    transition={transition}
                                    style={{ width: "100%", height: "83%", }}
                                >
                                    {
                                        recievedClosedWonLeads.length > 0 ?
                                            <ScrollView style={styles.container}>
                                                {recievedClosedWonLeads.map((data, index) =>
                                                    <View style={{ flexGrow: 1 }} >
                                                        <TouchableOpacity key={index} activeOpacity={0.9}
                                                            onPress={() => {
                                                                ref.current.animateNextTransition();
                                                                setCurrentIndex((index === IndexForClosedWon || index === currentIndex) ? null : index);
                                                                route.params = false;
                                                            }} style={{ flexDirection: "row", height: height * 0.08, borderRadius: 10, borderColor: colors.lightgrey, backgroundColor: colors.grey, borderWidth: 1, justifyContent: "flex-start", alignItems: "center", marginVertical: "2%" }}>
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
                                                                    (index === IndexForClosedWon || index === currentIndex) ?
                                                                        <Ionicons name={"chevron-up-outline"} size={height * 0.03} color={colors.icon} />
                                                                        : <Ionicons name={"chevron-down-outline"} size={height * 0.03} color={colors.icon} />
                                                                }
                                                            </View>
                                                        </TouchableOpacity>
                                                        {(index === IndexForClosedWon || index === currentIndex) && (
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
                                :
                                closedLost === true
                                    ?
                                    <Transitioning.View
                                        ref={ref}
                                        transition={transition}
                                        style={{ width: "100%", height: "83%" }}
                                    >

                                        {
                                            recievedClosedLostLeads.length > 0 ?
                                                <ScrollView style={styles.container}>

                                                    {recievedClosedLostLeads.map((data, index) =>
                                                        <TouchableOpacity style={{ flexGrow: 1 }} key={index} activeOpacity={0.9}
                                                            onPress={() => {
                                                                ref.current.animateNextTransition();
                                                                setCurrentIndex((index === IndexForClosedLost || index === currentIndex) ? null : index)
                                                                route.params = false;
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
                                                                        (index === IndexForClosedLost || index === currentIndex) ?
                                                                            <Ionicons name={"chevron-up-outline"} size={height * 0.03} color={colors.icon} />
                                                                            : <Ionicons name={"chevron-down-outline"} size={height * 0.03} color={colors.icon} />
                                                                    }
                                                                </View>
                                                            </View>
                                                            {(index === IndexForClosedLost || index === currentIndex) && (
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
                                                                                    <Text style={{ fontFamily: "Bold" }}>Cancellation Reason: </Text>
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
            )
            }
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

    },
    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        marginBottom: "50%",
        // backgroundColor: "red"
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


export default LeadReceived;
