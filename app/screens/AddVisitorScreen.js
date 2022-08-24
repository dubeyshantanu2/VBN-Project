import React, { useState, useEffect } from 'react'
import { StatusBar, Image, Dimensions, Button, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, FlatList, SafeAreaView, StyleSheet, View, Text, TextInput, ScrollView, TouchableOpacity, Modal, Pressable, Alert } from 'react-native';
import axios from 'axios';
// import * as Contacts from 'expo-contacts';
import { Formik } from 'formik';
import * as yup from 'yup';
import colors from '../config/colors';
import { Ionicons, AntDesign } from '@expo/vector-icons';
import ShortButton from '../components/ShortButton';
import CancelButton from '../components/CancelButton';
import DisabledButton from '../components/DisabledButton';
import { useSelector } from 'react-redux';
import { CommonActions } from '@react-navigation/native';
import moment from 'moment';
const { height, width } = Dimensions.get('window');

import {
    Menu,
    MenuOptions,
    MenuOption,
    MenuTrigger,
} from 'react-native-popup-menu';
import env from '../config/env';

const AddVisitorScreen = ({ navigation }) => {

    const token = useSelector(state => state.AuthReducers.accessToken);
    const first_name = useSelector(state => state.AuthReducers.first_name);
    const last_name = useSelector(state => state.AuthReducers.last_name);
    const user_id = useSelector(state => state.AuthReducers.user_id);
    // const [name, setName] = useState('')
    // const [mobile, setMobile] = useState('')
    // const [email, setEmail] = useState('')
    const [emailValidError, setEmailValidError] = useState('');
    // const [organization, setOrganisation] = useState('')
    const [meeting, setMeeting] = useState([])
    // console.log(meeting[0].meeting_date)
    const [meeting_name, setMeetingName] = useState('')
    const [meeting_id, setMeetingId] = useState('')
    const [contacts, setContacts] = useState([])
    const [modalVisible, setModalVisible] = useState(false);
    const [ValidationMessage, setValidationMessage] = useState(false);

    const VisitorSchema = yup.object({
        name: yup.string().required("Name is required"),
        email: yup.string().email('Enter a valid email').required("Email is required"),
        mobile: yup.string().min(10)
            .required("Mobile number is required")
            .matches(
                /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/,
                "Mobile number is not valid"
            ),
        organization: yup.string().required("Organization is required"),
    })

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
                setMeeting(meetings)
            })
    }, [])

    // useEffect(() => {
    //     (async () => {
    //         const { status } = await Contacts.requestPermissionsAsync();
    //         if (status === 'granted') {
    //             const { data } = await Contacts.getContactsAsync({
    //                 fields: [Contacts.Fields.PhoneNumbers],
    //             });

    //             if (data.length > 0) {
    //                 setContacts(data)
    //             }
    //         }
    //     })();
    // }, []);

    const submit = (values) => {
        axios({
            method: "POST",
            url: `${env.endpointURL}/visitors`,
            headers: {
                'Cookie': `jwt=${token}`,
            },
            data: {
                name: values.name,
                company_name: values.organization,
                mobile: values.mobile,
                email: values.email,
                meeting_id: meeting_id,
                // venue: addrress,
                invited_by_user_id: user_id,
            }
        })
            .then(function (res) {
                console.log(res)
                navigation.dispatch(
                    CommonActions.navigate({
                        name: "OnDoneScreen",
                    })
                );
            })
            .catch(function (error) {
                console.log("error at Add visitor screen", error)
            })
    }

    return (

        <SafeAreaView style={styles.container}>
            <StatusBar backgroundColor={colors.primary} barStyle='light-content' />
            <Formik
                initialValues={{ name: '', email: '', mobile: '', organization: '' }}
                onSubmit={(values) => {
                    if (meeting_id) submit(values);
                }}
                validationSchema={VisitorSchema}
            >
                {({ errors, touched, handleChange, handleBlur, handleSubmit, values }) => (
                    <>
                        <ScrollView style={{ height: "120%", width: "92%" }} showsVerticalScrollIndicator={false} keyboardDismissMode='on-drag'>
                            <View style={{ flexDirection: "row" }}>
                                <Text style={{ fontFamily: "SemiBold" }}>Name</Text>
                                <Text style={{ fontFamily: "SemiBold", color: colors.danger }}>*</Text>
                            </View>
                            <TextInput
                                style={styles.input}
                                placeholder="Enter Name"
                                autoCapitalize="words"
                                selectionColor={colors.selector}
                                autoComplete="name" //only android
                                keyboardType="default"
                                returnKeyType="done"
                                textContentType="name" //only ios
                                onChangeText={handleChange("name")}
                                onBlur={handleBlur("name")}
                                value={values.name}
                                clearButtonMode="always" //only on IOS
                            />
                            <View style={{ marginVertical: "1%" }}>
                                {
                                    errors.name && touched.name ? (
                                        <Text style={{ color: "red", fontSize: height * 0.015 }}>{errors.name}</Text>

                                    ) :
                                        <View style={{ height: height * 0.015 }} />
                                }
                            </View>

                            <View style={{ flexDirection: "row" }}>
                                <Text style={{ fontFamily: "SemiBold" }}>Email Address</Text>
                                <Text style={{ fontFamily: "SemiBold", color: colors.danger }}>*</Text>
                            </View>
                            <TextInput
                                style={styles.input}
                                placeholder="Enter email address"
                                autoCorrect={false}
                                autoCapitalize="none"
                                keyboardType="email-address"
                                returnKeyType="done"
                                selectionColor={colors.selector}
                                textContentType="emailAddress"//only ios
                                onChangeText={handleChange("email")}
                                onBlur={handleBlur("email")}
                                value={values.email}
                                clearButtonMode="always" //only on IOS
                            />

                            <View style={{ marginVertical: "1%" }}>
                                {
                                    errors.email && touched.email ? (
                                        <Text style={{ color: "red", fontSize: height * 0.015 }}>{errors.email}</Text>

                                    ) :
                                        <View style={{ height: height * 0.015 }} />
                                }
                            </View>

                            <View style={{ flexDirection: "row", width: "100%", justifyContent: "space-between", alignItems: "center" }}>
                                <View style={{ flexDirection: "row" }}>
                                    <Text style={{ fontFamily: "SemiBold" }}>Mobile</Text>
                                    <Text style={{ fontFamily: "SemiBold", color: colors.danger }}>*</Text>
                                </View>
                                <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
                                    {/* <TouchableOpacity style={{ flexDirection: "row", alignItems: "center" }} onPress={() => setModalVisible(true)}>
                            <AntDesign name={"contacts"} size={height * 0.02} style={{ marginRight: "2%" }} color={"#00AEF2"} />
                            <Text style={{ fontFamily: "SemiBold", marginTop: "4%", fontSize: height * 0.015, color: "#00AEF2" }}> Add Contact</Text>
                        </TouchableOpacity> */}
                                </View>
                            </View>

                            <TextInput
                                style={styles.input}
                                placeholder="Enter mobile number"
                                keyboardType="number-pad"
                                returnKeyType="done"
                                selectionColor={colors.selector}
                                textContentType="telephoneNumber"//only ios
                                onChangeText={handleChange("mobile")}
                                onBlur={handleBlur("mobile")}
                                clearButtonMode="always" //only on IOS
                                maxLength={10}
                            />

                            <View style={{ marginVertical: "1%" }}>
                                {
                                    errors.mobile && touched.mobile ? (
                                        <Text style={{ color: "red", fontSize: height * 0.015 }}>{errors.mobile}</Text>

                                    ) :
                                        <View style={{ height: height * 0.015 }} />
                                }
                            </View>

                            <View style={{ flexDirection: "row" }}>
                                <Text style={{ fontFamily: "SemiBold" }}>Organization Name</Text>
                                <Text style={{ fontFamily: "SemiBold", color: colors.danger }}>*</Text>
                            </View>
                            <TextInput
                                style={styles.input}
                                placeholder="Enter organization name"
                                keyboardType="default"
                                autoCapitalize="words"
                                returnKeyType="done"
                                selectionColor={colors.selector}
                                onChangeText={handleChange("organization")}
                                onBlur={handleBlur("organization")}
                                clearButtonMode="always" //only on IOS
                                value={values.organization}
                            />

                            <View style={{ marginVertical: "1%" }}>
                                {
                                    errors.organization && touched.organization ? (
                                        <Text style={{ color: "red", fontSize: height * 0.015 }}>{errors.organization}</Text>

                                    ) :
                                        <View style={{ height: height * 0.015 }} />
                                }
                            </View>

                            {/* <View style={styles.centeredView}>
                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible={modalVisible}
                        onRequestClose={() => {
                            setModalVisible(!modalVisible);
                        }}>
                        <View style={styles.centeredView}>
                            <View style={styles.modalView}>
                                <Text style={styles.modalText}>Contact List</Text>
                                <View style={styles.container}>
                                    <FlatList
                                        data={contacts}
                                        renderItem={({ item }) => {
                                            return (
                                                <Text>{`${item.name} (${item.phoneNumbers ? item.phoneNumbers[0].number : ''})`}</Text>
                                            )
                                        }}
                                    />
                                </View>
                                <Pressable
                                    style={[styles.button, styles.buttonClose]}
                                    onPress={() => setModalVisible(!modalVisible)}
                                >
                                    <Text style={styles.textStyle}>Okay</Text>
                                </Pressable>
                            </View>
                        </View>
                    </Modal>

                </View> */}


                            {/* <View style={{ flexDirection: "row", marginTop: "2%" }}>
                    <Text style={{ fontFamily: "SemiBold" }}>Email Addrress</Text>
                    <Text style={{ fontFamily: "SemiBold", color: colors.danger }}>*</Text>
                </View>
                <TextInput
                    style={styles.input}
                    placeholder="Enter email address"
                    value={email}
                    autoCorrect={false}
                    autoCapitalize="none"
                    keyboardType="email-address"
                    returnKeyType="done"
                    selectionColor={colors.selector}
                    textContentType="emailAddress"//only ios
                    onChangeText={value => {
                        setEmail(value);
                        handleValidEmail(value);
                    }}
                    clearButtonMode="always" //only on IOS
                /> */}
                            {/* {emailValidError ? <Text style={{ marginVertical: "2%", color: "red" }}>{emailValidError}</Text> : null} */}


                            <View style={{ flexDirection: "row" }}>
                                <Text style={{ fontFamily: "SemiBold" }}>Select Upcoming Meeting</Text>
                                <Text style={{ fontFamily: "SemiBold", color: colors.danger }}>*</Text>
                            </View>
                            <TouchableOpacity style={styles.selector} onPress={() => setModalVisible(true)}>
                                {/* <Menu>
                        <MenuTrigger style={{ flexDirection: "row", justifyContent: "space-between", width: "80%", height: "100%", alignItems: "center" }}>
                            {meeting_name ? <Text style={{ marginLeft: "4%", fontFamily: "Regular" }}>{meeting_name}</Text> : <Text style={{ marginLeft: "4%", fontFamily: "Regular" }}>Select Meeting</Text>}
                            <Ionicons name={"caret-down-outline"} size={height * 0.03} style={{ marginRight: "2%" }} color={colors.icon} />
                        </MenuTrigger>
                        <MenuOptions optionsContainerStyle={{ width: "92%", marginTop: "10%", backgroundColor: colors.lightgrey }}>
                            {meeting.map((name, index) =>
                                <MenuOption value={name.meeting_name} onSelect={(value) => { setMeetingName(value, name), setMeetingId(name.id) }} key={index}>
                                    <Text style={{ fontFamily: "SemiBold" }}>{name.meeting_name}</Text>
                                </MenuOption>
                            )}
                        </MenuOptions>
                    </Menu> */}
                                {meeting_name ? <Text style={{ marginLeft: "4%", fontFamily: "Regular" }}>{meeting_name}</Text> : <Text style={{ marginLeft: "4%", fontFamily: "Regular" }}>Select Meeting</Text>}

                                <Modal
                                    animationType="slide"
                                    transparent={true}
                                    visible={modalVisible}
                                    onRequestClose={() => {
                                        setModalVisible(!modalVisible);
                                    }}>
                                    <View style={{
                                        flex: 1,
                                        justifyContent: "center",
                                        alignItems: "center"
                                    }}>
                                        <View style={styles.modalView}>
                                            <View style={{ width: "100%", flexDirection: "row", alignItems: "center", marginBottom: "2%" }}>
                                                <Text style={styles.modalText}>Select Upcoming Meeting</Text>
                                                <Ionicons name={"close"} size={height * 0.032} color={colors.darkgrey} style={{ marginLeft: "15%" }} onPress={() => { setModalVisible(false) }} />
                                            </View>
                                            <ScrollView style={{ width: "100%" }} >
                                                {meeting.map((name, index) =>
                                                    <MenuOption value={name.meeting_venue} onSelect={(value) => { setMeetingName(value, name), setModalVisible(!modalVisible), setMeetingId(name.id); setValidationMessage(false) }} key={index}  >
                                                        <View style={{
                                                            width: " 100%", flexDirection: "row", alignItems: "center", borderWidth: 1, borderColor: colors.grey, padding: "2%",
                                                            shadowColor: "#000",
                                                            borderRadius: 5,
                                                        }}>
                                                            <View style={{ borderRadius: 5, backgroundColor: colors.primary, height: height * 0.06, width: height * 0.06, marginHorizontal: "2%", justifyContent: "center", alignItems: "center" }}>
                                                                <Text style={{ color: "white", fontFamily: "SemiBold" }}>{moment(name.meeting_date).format("D")}</Text>
                                                                <Text style={{ color: "white", fontFamily: "SemiBold" }}>{moment(name.meeting_date).format("MMM")}</Text>
                                                            </View>

                                                            <View style={{ marginLeft: "2%" }}>
                                                                <Text style={{ fontFamily: "SemiBold" }}>{name.meeting_venue}</Text>
                                                                <View style={{ flexDirection: "row", }}>
                                                                    <Text style={{ fontFamily: "Regular", fontSize: height * 0.015 }}>{moment(name.meeting_date).format('dddd')}, </Text>
                                                                    <Text style={{ fontFamily: "Regular", fontSize: height * 0.015 }}>{moment(name.start_time, ["HH.mm"]).format("hh:mm A")} - {moment(name.end_time, ["HH.mm"]).format("hh:mm A")}</Text>
                                                                </View>
                                                            </View>

                                                        </View>
                                                    </MenuOption>
                                                )}
                                            </ScrollView>
                                        </View>
                                    </View>
                                </Modal>

                                <Ionicons name={"caret-down-outline"} size={height * 0.03} style={{ marginRight: "2%" }} color={colors.icon} />
                            </TouchableOpacity>
                            {ValidationMessage ?
                                <Text style={{ marginTop: "1%", color: "red", fontSize: height * 0.015 }}>Meeting selection is required</Text>
                                : <Text />
                            }
                        </ScrollView>

                        <View style={styles.footer}>
                            <CancelButton onPress={() => navigation.navigate("PostScreen")} text="Cancel" />
                            <ShortButton onPress={() => { handleSubmit(); setValidationMessage(meeting_id ? false : true) }} text="Invite" />
                        </View>
                    </>
                )}
            </Formik>
        </SafeAreaView>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1, paddingVertical: "4%", justifyContent: "space-between", alignItems: "center"
    },
    footer: {
        width: "100%", justifyContent: "space-evenly", alignItems: "center", flexDirection: "row"
    },
    selector: {
        flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: "2%", width: "100%", height: height * 0.06, backgroundColor: colors.lightgrey, borderRadius: 10, borderColor: colors.grey, borderWidth: 1, opacity: 0.9
    },
    input: {
        fontFamily: "SemiBold",
        width: "100%",
        borderWidth: 1,
        borderColor: colors.grey,
        borderRadius: 10,
        marginTop: "2%",
        padding: 10,
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    modalView: {
        marginHorizontal: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 20,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        top: "24%",
        width: "90%",
        height: 300,
    },
    button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2
    },
    buttonOpen: {
        backgroundColor: "#F194FF",
    },
    buttonClose: {
        backgroundColor: "#2196F3",
    },
    textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center"
    },
    modalText: {
        textAlign: "center",
        fontFamily: "SemiBold",
        marginLeft: "20%"
    }
})

export default AddVisitorScreen;