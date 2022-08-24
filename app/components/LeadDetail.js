import React, { useState, useEffect } from 'react'
import { FlatList, Pressable, Alert, Modal, StatusBar, ScrollView, Image, Dimensions, SafeAreaView, View, Text, TouchableOpacity, StyleSheet } from 'react-native';

import colors from '../config/colors';
import { Ionicons } from '@expo/vector-icons';
import { Transition, Transitioning } from 'react-native-reanimated';
import LongButton from './LongButton';
import axios from 'axios';
import { useSelector } from 'react-redux';
import Checkbox from 'expo-checkbox';

const { height, width } = Dimensions.get('window');

const transition = (
    <Transition.Together>
        <Transition.In type='fade' durationMs={200} />
        <Transition.Change />
        <Transition.Out type='fade' durationMs={200} />
    </Transition.Together>
);

const LeadDetail = ({ route, navigation, data }) => {

    const token = useSelector(state => state.AuthReducers.accessToken);
    const user_id = useSelector(state => state.AuthReducers.user_id);

    const [currentIndex, setCurrentIndex] = useState(null);
    const ref = React.useRef();
    const [icon, setIcon] = useState(null);

    const [collapsed, setCollapsed] = useState(true);
    const [collapsed1, setCollapsed1] = useState(true);
    const [name, setName] = useState(true);
    const [phone, setPhone] = useState(true);
    const [email, setEmail] = useState(true);
    const [description, setDescription] = useState(true);
    const [formData, setFormData] = useState([]);

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <StatusBar backgroundColor={colors.primary} barStyle='light-content' />
            <Transitioning.View
                ref={ref}
                transition={transition}
                style={{ width: "100%", height: "92%", }}
            >
                <ScrollView style={styles.container}>
                    {data.map(({ name, leads }, index) => {
                        <TouchableOpacity
                            key={leads}
                            onPress={() => {
                                ref.current.animateNextTransition();
                                setCurrentIndex(index === currentIndex ? null : index);
                            }}
                            style={{ flexGrow: 1 }}
                            activeOpacity={0.9}>

                            <View style={{ flexDirection: "row", height: height * 0.075, borderRadius: 10, borderColor: colors.lightgrey, backgroundColor: colors.grey, borderWidth: 1, justifyContent: "space-between", alignItems: "center", marginVertical: "2%" }}>

                                <View style={{ flexDirection: "row", marginLeft: "4%" }}>
                                    <Text>{index + 1}</Text>
                                    <Text style={{ marginLeft: "2%" }}>{name}</Text>
                                </View>

                                <View style={{ flexDirection: "row", marginRight: "2%" }}>
                                    <View style={{ backgroundColor: colors.white, alignItems: "center", flexDirection: "row", marginRight: "5%", paddingVertical: 3, paddingHorizontal: 20, borderRadius: 5 }}>
                                        <Text>{leads}</Text>
                                    </View>
                                    {
                                        currentIndex != null ? <Ionicons name={"chevron-up-outline"} size={height * 0.03} color={colors.icon} />
                                            : <Ionicons name={"chevron-down-outline"} size={height * 0.03} color={colors.icon} />
                                    }
                                </View>

                            </View>
                            {index === currentIndex && (
                                <View style={styles.content}>
                                    {[...Array(member.number_of_leads)].map((row, index) => (
                                        <>
                                            // leave the card styling for now, once the api is done ill add styling in below section.
                                            <Text style={{ fontFamily: "Bold", marginTop: "2%" }}>Lead {index + 1}</Text>
                                            <View style={{
                                                marginTop: "2%", borderRadius: 10, borderWidth: 1, borderColor: colors.lightgrey, paddingVertical: 10,
                                            }}>
                                                <Text style={{ fontSize: height * 0.015, marginTop: "2%", marginLeft: "4%", fontFamily: "SemiBold" }}>Name</Text>
                                                <Text style={{ fontSize: height * 0.015, marginTop: "2%", marginLeft: "4%", fontFamily: "SemiBold" }} >{name}</Text>
                                                <Text style={{ fontSize: height * 0.015, marginTop: "2%", marginLeft: "4%", fontFamily: "SemiBold" }}>Date</Text>
                                                <Text style={{ fontSize: height * 0.015, marginTop: "2%", marginLeft: "4%", fontFamily: "SemiBold" }} >{date}</Text>
                                                <Text style={{ fontSize: height * 0.015, marginTop: "2%", marginLeft: "4%", fontFamily: "SemiBold" }}>Email</Text>
                                                <Text style={{ fontSize: height * 0.015, marginTop: "2%", marginLeft: "4%", fontFamily: "SemiBold" }} >{email}</Text>
                                                <Text style={{ fontSize: height * 0.015, marginTop: "2%", marginLeft: "4%", fontFamily: "SemiBold" }}>Phone</Text>
                                                <Text style={{ fontSize: height * 0.015, marginTop: "2%", marginLeft: "4%", fontFamily: "SemiBold" }} >{phone}</Text>
                                                <Text style={{ fontSize: height * 0.015, marginTop: "2%", marginLeft: "4%", fontFamily: "SemiBold" }}>Description</Text>
                                                <Text style={{ fontSize: height * 0.015, marginTop: "2%", marginLeft: "4%", fontFamily: "SemiBold" }} >{description}</Text>
                                                <Text style={{ fontSize: height * 0.015, marginTop: "2%", marginLeft: "4%", fontFamily: "SemiBold" }}>Given To/ Received from</Text>
                                                <Text style={{ fontSize: height * 0.015, marginTop: "2%", marginLeft: "4%", fontFamily: "SemiBold" }} >{givenTo}</Text>

                                            </View>
                                        </>
                                    ))}
                                </View>
                            )}
                        </TouchableOpacity>
                    })}
                </ScrollView>
            </Transitioning.View>


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


export default LeadDetail;
