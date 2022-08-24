import React, { useEffect, useState } from 'react'
import { StatusBar, Image, Dimensions, SafeAreaView, Button, Text, StyleSheet, View, TextInput, TouchableWithoutFeedback } from 'react-native';
import { useSelector } from 'react-redux';
import axios from 'axios';
import colors from '../config/colors';
import { Ionicons } from '@expo/vector-icons';
import env from '../config/env';

const { height, width } = Dimensions.get('window');

const ChapterScreen = ({ navigation }) => {

    const token = useSelector(state => state.AuthReducers.accessToken);
    const [search, setSearch] = useState('');
    const [name, setName] = useState("");

    useEffect(() => {
        axios({
            method: "GET",
            url: `${env.endpointURL}/chapters`,
            headers: {
                'Cookie': `jwt=${token}`,
            },
        })
            .then(function (res) {
            })
            .catch(function (error) {
                console.log("error at Chapters api", error.message)
            })
    }, []);

    return (
        <SafeAreaView style={styles.center}>
            <StatusBar backgroundColor={colors.primary} barStyle='light-content' />
            <View style={{ flexDirection: "row", width: "100%", marginTop: "2%", justifyContent: "space-between", width: "92%" }}>
                <Text style={{ fontFamily: "Bold", paddingLeft: 10, fontSize: height * 0.016 }}>Chapter Name</Text>
                <View style={{ flexDirection: "row", width: "40%" }}>
                    <View style={{}}>
                        <Text style={{ fontFamily: "Bold", fontSize: height * 0.0155 }}>Launch </Text>
                        <Text style={{ fontFamily: "Bold", fontSize: height * 0.0155 }}>Date </Text>
                    </View>
                    <View style={{ marginLeft: "20%" }}>
                        <Text style={{ fontFamily: "Bold", fontSize: height * 0.0155 }}>View </Text>
                        <Text style={{ fontFamily: "Bold", fontSize: height * 0.0155 }}>Members </Text>
                    </View>
                </View>
            </View>

            <View style={styles.viewStyle}>
                <Text style={{ fontFamily: "SemiBold", fontSize: height * 0.015 }}>1</Text>
                <Text style={{ marginLeft: "3%", fontFamily: "SemiBold" }}>VBN Hyderabad</Text>
                <Text style={{ marginLeft: "20%", fontFamily: "SemiBold", fontSize: height * 0.0145 }}>25-02-2022</Text>
                <TouchableWithoutFeedback onPress={() => {
                    navigation.navigate('MembersListScreen', {
                        id: 1,
                    });
                }}>
                    <Text style={{ marginLeft: "5%", fontFamily: "SemiBold", fontSize: height * 0.015, color: colors.primary }}>View</Text>
                </TouchableWithoutFeedback>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    center: {
        flex: 1,
        justifyContent: "flex-start",
        alignItems: "center",
        textAlign: "center",
    },
    textInputStyle: {
        marginTop: "3%",
        justifyContent: "flex-start",
        flexDirection: "row",
        alignItems: "center",
        textAlign: "center",
        height: 40,
        width: "92%",
        borderRadius: 10,
        paddingLeft: 20,
        margin: 5,
        borderColor: "#009688",
        backgroundColor: colors.lightgrey,
    },
    viewStyle: {
        marginTop: "2%",
        justifyContent: "flex-start",
        flexDirection: "row",
        alignItems: "center",
        textAlign: "center",
        height: 50,
        width: "92%",
        borderRadius: 10,
        paddingLeft: 10,
        margin: 5,
        backgroundColor: colors.white,
        borderColor: colors.grey,
        borderWidth: 0.5,
    },
})

export default ChapterScreen;
