import React, { useState, useEffect } from 'react'
import { FlatList, Pressable, Alert, Modal, StatusBar, ScrollView, Image, Dimensions, SafeAreaView, View, Text, TouchableOpacity, StyleSheet, TextInput } from 'react-native';
import RadioGroup from 'react-native-radio-buttons-group';
import colors from '../../config/colors';
import { Ionicons } from '@expo/vector-icons';
import { Transition, Transitioning } from 'react-native-reanimated';
import LongButton from '../../components/LongButton';
import axios from 'axios';
import { useSelector } from 'react-redux';
import Checkbox from 'expo-checkbox';
import ShortButton from '../../components/ShortButton';
import CancelButton from '../../components/CancelButton';
import { CommonActions } from '@react-navigation/native';
import env from '../../config/env';

const { height, width } = Dimensions.get('window');

const radioButtonsData = [{
    id: '1', // acts as primary key, should be unique and non-empty string
    label: 'Ask',
    value: 'ask',
    // selected: true,
}, {
    id: '2',
    label: 'Give',
    value: 'give',
    // selected: false,
}]

const transition = (
    <Transition.Together>
        <Transition.In type='fade' durationMs={200} />
        <Transition.Change />
        <Transition.Out type='fade' durationMs={200} />
    </Transition.Together>
);

const AddLead = ({ route, navigation }) => {
    const token = useSelector(state => state.AuthReducers.accessToken);
    const user_id = useSelector(state => state.AuthReducers.user_id);
    const [firstLeadTabOpen, setFirstLeadTabOpen] = useState(route.params.selectedMembers[0] ? route.params.selectedMembers[0].id : 0);
    const [currentIndex, setCurrentIndex] = useState(null);
    const [icon, setIcon] = useState(null);
    // console.log("current", setCurrentIndex)
    const ref = React.useRef();
    const [radioButtons, setRadioButtons] = useState(radioButtonsData);
    const [collapsed, setCollapsed] = useState(true);
    const [collapsed1, setCollapsed1] = useState(true);
    const [name, setName] = useState();
    const [phone, setPhone] = useState();
    const [email, setEmail] = useState();
    const [description, setDescription] = useState(true);
    const [isLoaded, setIsLoaded] = useState(true);
    const [formData, setFormData] = useState([]);

    function onPressRadioButton(radioButtonsArray) {
        setRadioButtons(radioButtonsArray);
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
                setName(res.data.data.first_name + ' ' + res.data.data.last_name);
                setPhone(res.data.data.mobile)
                setEmail(res.data.data.email)
            })
            .catch(function (error) {
                console.log("error at members profile edit", error.message)
            })
    }, []);

    const submit = () => {
        // console.log("form data", formData);
        let selectedmemberIdsLeads = []
        for (var member of route.params.selectedMembers) {
            selectedmemberIdsLeads.push({ id: member.id, number_of_leads: member.number_of_leads })
        }
        const lead_to_users = [];
        const number_of_leads = [];
        for (var form of formData) {
            if (!(lead_to_users.includes(form.member_id)))
                lead_to_users.push(form.member_id);
            if (!(number_of_leads.includes(form.index)))
                number_of_leads.push(form.index);
        }
        // console.log("leads", lead_to_users, number_of_leads);
        for (var membercheck of selectedmemberIdsLeads) {
            const found = lead_to_users.some(el => el === membercheck.id);
            if (!found) lead_to_users.push(membercheck.id);
        }
        let object = []
        for (var lead_to_user of lead_to_users) {
            for (var lead of number_of_leads) {
                if (formData.find(x => x.index === lead && x.member_id == lead_to_user)) {
                    object.push({
                        "lead_by_user_id": user_id,
                        "lead_to_user_id": lead_to_user,
                        "lead_name": formData.find(x => x.index === lead && x.field == "Name" && x.member_id == lead_to_user) ? formData.find(x => x.index === lead && x.field == "Name" && x.member_id == lead_to_user).text : '',
                        "lead_email": formData.find(x => x.index === lead && x.field == "Email" && x.member_id == lead_to_user) ? formData.find(x => x.index === lead && x.field == "Email" && x.member_id == lead_to_user).text : '',
                        "lead_phone_number": formData.find(x => x.index === lead && x.field == "Phone" && x.member_id == lead_to_user) ? formData.find(x => x.index === lead && x.field == "Phone" && x.member_id == lead_to_user).text : '',
                        "lead_description": formData.find(x => x.index === lead && x.field == "Description" && x.member_id == lead_to_user) ? formData.find(x => x.index === lead && x.field == "Description" && x.member_id == lead_to_user).text : ''
                    })
                }
            }
        }
        for (var memberleads of selectedmemberIdsLeads) {
            var findobj = object.filter(abc => abc.lead_to_user_id === memberleads.id)
            let diff = memberleads.number_of_leads - findobj.length
            if (diff > 0) {
                // console.log("diff", diff, findobj, memberleads.id, memberleads.number_of_leads);
                for (var i = 0; i < diff; i++) {
                    object.push({
                        "lead_by_user_id": user_id,
                        "lead_to_user_id": memberleads.id
                    })
                }
            }
        }
        // console.log("@@@@", object);
        axios({
            method: "POST",
            url: `${env.endpointURL}/leads`,
            headers: {
                'Cookie': `jwt=${token}`,
            },
            data: object
        })
            .then(function (res) {
                route.params.selectedMembers[0].memberPage ?
                    navigation.dispatch(
                        CommonActions.navigate({
                            name: "OnDoneScreen",
                            params: {
                                id: route.params.selectedMembers[0].id

                            },
                        })
                    ) :
                    navigation.dispatch(
                        CommonActions.navigate({
                            name: "OnDoneScreen",
                        })
                    )
            })
            .catch(function (error) {
                console.log("error at Add visitor screen", error)
            })
    }

    const collectData = (index, field, text, member_id) => {
        if (typeof text == 'object') return;
        for (let i = 0; i < formData.length; i++) {
            if (formData[i].index === index && formData[i].field === field && formData[i].member_id === member_id) {
                formData[i].text = text
                setFormData(formData);
                return setIsLoaded(isLoaded ? false : true);
            }
        }
        formData.push({ index: index, field: field, text: text, member_id: member_id })
        setFormData(formData);
        return setIsLoaded(isLoaded ? false : true);
    }

    const collectDataforSelfLead = (index, data_exist, member_id) => {
        for (let i = 0; i < formData.length; i++) {
            if (formData[i].index == index && formData[i].member_id == member_id) {
                delete formData[i]
            }
        }
        if (formData.length == 0 || !data_exist) {
            formData.push({ index: index, field: "Name", text: name, member_id: member_id })
            formData.push({ index: index, field: "Email", text: email, member_id: member_id })
            formData.push({ index: index, field: "Phone", text: phone, member_id: member_id })
            formData.push({ index: index, field: "Description", text: "", member_id: member_id })
        }
        setIsLoaded(isLoaded ? false : true);
        return setFormData(formData.filter(val => val !== undefined));
    }

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <StatusBar backgroundColor={colors.primary} barStyle='light-content' />
            <Transitioning.View
                ref={ref}
                transition={transition}
                style={{ width: "100%", height: "92%", }}
            >
                <ScrollView style={styles.container}>
                    {route.params.selectedMembers.map((member, index) =>
                        <View style={{ flexGrow: 1 }}>
                            <TouchableOpacity key={member} activeOpacity={0.9} onPress={() => {
                                ref.current.animateNextTransition();
                                setCurrentIndex((firstLeadTabOpen == member.id || index === currentIndex) ? null : index);
                                setFirstLeadTabOpen(false)
                            }} style={{ flexDirection: "row", paddingVertical: "3%", borderRadius: 10, borderColor: colors.lightgrey, backgroundColor: colors.grey, borderWidth: 1, justifyContent: "space-between", alignItems: "center", marginVertical: "2%" }}>

                                <View style={{ flexDirection: "row", marginLeft: "4%", alignItems: "center" }}>
                                    {/* <Text>{index + 1}</Text> */}
                                    <Image style={{ height: 50, width: 50, backgroundColor: "#eee", borderRadius: 7 }} source={{ uri: member.profile_picture }} />
                                    <View style={{ backgroundColor: colors.primary, height: 23, width: 23, borderRadius: 40, left: -15, top: 18, borderWidth: 1.5, borderColor: "white", justifyContent: "center", alignItems: "center" }}>
                                        <Text style={{ color: "white", fontSize: height * 0.010 }}>#{member.roster_id}</Text>
                                    </View>
                                    <View style={{ left: -8, paddingVertical: "2%", width: "60%" }}>
                                        <Text ellipsizeMode='tail' numberOfLines={1}>{member.first_name + ' ' + member.last_name}</Text>
                                    </View>
                                </View>

                                <View style={{ flexDirection: "row", marginRight: "2%", left: -30 }}>
                                    <View style={{ backgroundColor: colors.white, alignItems: "center", flexDirection: "row", marginRight: "5%", paddingVertical: 3, paddingHorizontal: 20, borderRadius: 5 }}>
                                        <Text>{member.number_of_leads}</Text>
                                    </View>
                                    {
                                        (firstLeadTabOpen == member.id || index === currentIndex) ? <Ionicons name={"chevron-up-outline"} size={height * 0.03} color={colors.icon} />
                                            : <Ionicons name={"chevron-down-outline"} size={height * 0.03} color={colors.icon} />
                                    }
                                </View>

                            </TouchableOpacity>

                            {(firstLeadTabOpen == member.id || index === currentIndex) && (
                                <View style={styles.content}>
                                    {[...Array(member.number_of_leads)].map((row, index) => (
                                        <>
                                            <View style={{ flexDirection: "row", alignItems: "center", marginTop: "2%", justifyContent: "space-between" }}>
                                                <Text style={{ fontFamily: "Bold" }}>Lead {index + 1}</Text>
                                                {/* <RadioGroup
                                                    radioButtons={radioButtons}
                                                    onPress={onPressRadioButton}
                                                // containerStyle={{
                                                //     backgroundColor: colors.primary,
                                                //     color: colors.primary
                                                // }}
                                                /> */}
                                                <TouchableOpacity onPress={() => { collectDataforSelfLead(index, formData.some(x => x.index === index && x.member_id == member.id), member.id) }}>
                                                    <View style={{ flexDirection: "row", width: "100%", alignItems: "center" }}>
                                                        <Checkbox value={formData.find(x => x.index === index && x.field == "Name" && x.member_id == member.id) &&
                                                            formData.find(x => x.index === index && x.field == "Email" && x.member_id == member.id) &&
                                                            formData.find(x => x.index === index && x.field == "Phone" && x.member_id == member.id) &&
                                                            formData.find(x => x.index === index && x.field == "Name" && x.member_id == member.id).text == name &&
                                                            formData.find(x => x.index === index && x.field == "Email" && x.member_id == member.id).text == email &&
                                                            formData.find(x => x.index === index && x.field == "Phone" && x.member_id == member.id).text == phone}
                                                            onValueChange={() => { collectDataforSelfLead(index, formData.some(x => x.index === index && x.member_id == member.id), member.id) }} color={"#00AEF2"} />
                                                        <Text style={{ fontSize: height * 0.015, fontFamily: "Bold", color: "#00AEF2", marginLeft: "4%" }}>Self Lead</Text>
                                                    </View>
                                                </TouchableOpacity>
                                            </View>
                                            <View style={{
                                                marginTop: "2%", borderRadius: 10, borderWidth: 1, borderColor: colors.lightgrey, paddingVertical: 10,
                                            }}>

                                                <View style={{ width: "100%", marginTop: "2%" }}>
                                                    <Text style={{ fontSize: height * 0.015, marginBottom: "4%", marginLeft: "4%", fontFamily: "SemiBold" }}>Enter Name</Text>
                                                    <TextInput selectionColor={colors.selector} onChangeText={(text) => collectData(index, 'Name', text, member.id)} onFocus={(text) => collectData(index, 'Name', text, member.id)}
                                                        style={{ borderBottomWidth: 1, marginHorizontal: 12, borderColor: colors.grey }}
                                                        value={formData.find(x => x.index === index && x.field == "Name" && x.member_id == member.id) ?
                                                            formData.find(x => x.index === index && x.field == "Name" && x.member_id == member.id).text : null} />
                                                </View>

                                                <View style={{ width: "100%", marginTop: "2%", }}>
                                                    <Text style={{ fontSize: height * 0.015, marginBottom: "4%", marginLeft: "4%", fontFamily: "SemiBold" }}>Phone</Text>
                                                    <TextInput maxLength={13} selectionColor={colors.selector} onChangeText={(text) => collectData(index, 'Phone', text, member.id)} keyboardType="number-pad"
                                                        style={{ borderBottomWidth: 1, marginHorizontal: 12, borderColor: colors.grey }}
                                                        value={formData.find(x => x.index === index && x.field == "Phone" && x.member_id == member.id) ?
                                                            formData.find(x => x.index === index && x.field == "Phone" && x.member_id == member.id).text : null} />
                                                </View>

                                                <View style={{ width: "100%", marginTop: "2%", }}>
                                                    <Text style={{ fontSize: height * 0.015, marginBottom: "4%", marginLeft: "4%", fontFamily: "SemiBold" }}>Email</Text>
                                                    <TextInput selectionColor={colors.selector} onChangeText={(text) => collectData(index, 'Email', text, member.id)}
                                                        style={{ borderBottomWidth: 1, marginHorizontal: 12, borderColor: colors.grey }}
                                                        value={formData.find(x => x.index === index && x.field == "Email" && x.member_id == member.id) ?
                                                            formData.find(x => x.index === index && x.field == "Email" && x.member_id == member.id).text : null} />
                                                </View>

                                                <View style={{ width: "100%", marginTop: "2%", }}>
                                                    <Text style={{ fontSize: height * 0.015, marginBottom: "4%", marginLeft: "4%", fontFamily: "SemiBold" }}>Description</Text>
                                                    <TextInput
                                                        style={styles.input}
                                                        multiline={true}
                                                        keyboardType="default"
                                                        returnKeyType="done"
                                                        selectionColor={colors.selector}
                                                        dataDetectorTypes="address" //only ios
                                                        onChangeText={(text) => collectData(index, 'Description', text, member.id)}
                                                        textContentType="addressCityAndState"//only ios
                                                        clearButtonMode="always" //only on IOS
                                                        value={formData.find(x => x.index === index && x.field == "Description" && x.member_id == member.id) ?
                                                            formData.find(x => x.index === index && x.field == "Description" && x.member_id == member.id).text : null} />
                                                </View>

                                            </View>
                                        </>
                                    ))}
                                </View>
                            )}
                        </View>
                    )}
                </ScrollView>
            </Transitioning.View>
            <View style={{ width: "100%", marginLeft: "4%" }}>
                <LongButton onPress={submit} text={"Submit"} />
            </View>
        </SafeAreaView>
    )
}


const styles = StyleSheet.create({
    container: {
        padding: "4%",
    },
    card: {
        backgroundColor: colors.white, padding: "4%"
    },
    selector: {
        flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: "2%", width: "100%", height: height * 0.06, backgroundColor: colors.lightgrey, borderRadius: 10, borderColor: colors.grey, borderWidth: 1
    },
    footer: {
        width: "100%", justifyContent: "space-evenly", alignItems: "center", flexDirection: "row"
    },
    input: {
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
        marginTop: 22
    },

    button: {
        borderRadius: 20,
        // padding: 10,
        margin: 3,
    },

    textStyle: {
        color: colors.black,
        fontSize: height * 0.022,
        fontFamily: "SemiBold",
        textAlign: "center"
    },
    modalText: {
        marginBottom: 15,
        textAlign: "center",
        fontFamily: "SemiBold"
    },
    checkbox: {
        margin: 8,
        borderRadius: 3
    },
    content: {
        paddingVertical: "2%",
        justifyContent: "flex-start"
    },
    input: {
        borderBottomWidth: 1,
        fontFamily: "SemiBold",
        borderColor: colors.grey,
        marginHorizontal: 12,
        marginTop: "2%",
        padding: 10,
    },
})

export default AddLead;
