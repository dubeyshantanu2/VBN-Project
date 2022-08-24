import React, { useState, useEffect, useCallback } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Image, Dimensions, ActivityIndicator, RefreshControl, SafeAreaView, FlatList, Button, View, Text, ImageBackground, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSelector } from 'react-redux';
import colors from '../config/colors';
import * as Linking from 'expo-linking';
import axios from 'axios';
import env from '../config/env';

const { height } = Dimensions.get('window');

const wait = (timeout) => {
    return new Promise(resolve => setTimeout(resolve, timeout));
}

const MyProfileScreen = ({ route }) => {
    const [refreshing, setRefreshing] = useState(false);
    const [isLoaded, setIsLoaded] = useState(true);
    const user_id = useSelector(state => state.AuthReducers.user_id);
    const token = useSelector(state => state.AuthReducers.accessToken);
    const [selector1, setSelector1] = useState(0);
    const [first_name, setfirst_name] = useState([]);
    const [last_name, setlast_name] = useState([]);
    const [email, setemail] = useState([]);
    const [profile_picture, setprofile_picture] = useState([]);
    const [mobile, setmobile] = useState([]);
    const [firm_name, setfirm_name] = useState([]);
    const [category, setcategory] = useState([]);
    const [website, setwebsite] = useState([]);
    const [address, setaddress] = useState([]);
    const [memberSince, setmemberSince] = useState([]);
    const [rosterid, setrosterid] = useState([]);
    const [keywords, setKeywords] = useState([]);
    const [firmLogo, setFirmLogo] = useState();
    const [total, setTotal] = useState();
    const [present, setPresent] = useState();
    const [absent, setAbsent] = useState();
    const [substitute, setSubstitute] = useState();

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
                // setRefresh(refresh => ++refresh)
                setfirst_name(res.data.data.first_name);
                setlast_name(res.data.data.last_name);
                setemail(res.data.data.email);
                setprofile_picture(res.data.data.profile_picture);
                setmobile(res.data.data.mobile ? res.data.data.mobile.replace(/(\d{2})/, '$1 ') : null);
                setfirm_name(res.data.data.firm_name);
                setcategory(res.data.data.category);
                setwebsite(res.data.data.website);
                setaddress(res.data.data.address);
                setmemberSince(res.data.data.memberSince);
                setrosterid(res.data.data.roster_id);
                setKeywords(res.data.data.keywords ? (res.data.data.keywords).split(',') : []);
                setFirmLogo(res.data.data.firm_logo);
                setTotal(res.data.data.total);
                setPresent(res.data.data.present);
                setAbsent(res.data.data.absent);
                setSubstitute(res.data.data.substitute);
                setIsLoaded(false);
            })
            .catch(function (error) {
                console.log("error at members profile edit", error.message)
            })
    }, [route.params, selector1]);

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFCFC" }}>
            <StatusBar style="light" />
            {isLoaded ? (
                <View style={{ justifyContent: "center", alignItems: "center", height: "100%" }}>
                    <ActivityIndicator size="large" color={colors.primary} />
                </View>
            ) : (
                <ScrollView style={styles.container} refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                    />
                } >

                    <ImageBackground
                        style={styles.coverImage}
                    // source={require("../assets/images/Header.png")}
                    >
                        <View style={{ height: "70%", width: "92%", alignItems: "center" }}>
                            {
                                profile_picture !== null ?
                                    <Image source={{ uri: `${profile_picture}` !== "" ? `${profile_picture}` : undefined }} style={{ height: height * 0.1, width: height * 0.1, borderRadius: 50, top: -25 }} />
                                    :
                                    <Image source={require("../assets/images/profilepicture.png")} style={{ height: height * 0.1, width: height * 0.1, borderRadius: 50, top: -25 }} />
                            }
                            <View style={{ backgroundColor: colors.white, height: 27, width: 27, borderRadius: 40, borderWidth: 1.5, borderColor: colors.primary, justifyContent: "center", alignItems: "center", top: -45, right: -25 }}>
                                <Text style={{ color: colors.primary, fontSize: height * 0.012 }}>#{rosterid}</Text>
                            </View>
                            <View style={{ marginLeft: "5%", alignItems: "center" }}>
                                <Text ellipsizeMode='tail' numberOfLines={1} style={{ fontSize: height * 0.023, fontFamily: 'SemiBold', color: colors.white, top: -height * 0.05 }}>{first_name} {last_name}</Text>
                                {/* <Text style={{ fontSize: height * 0.015, fontFamily: 'Regular', color: colors.white, top: -height * 0.05 }}>(Member Since {memberSince})</Text> */}
                                {firm_name ?
                                    <Text style={{ textAlign: "center", fontSize: height * 0.015, fontFamily: 'Regular', color: colors.white, top: -height * 0.05 }}>{firm_name}</Text>
                                    : <Text></Text>
                                }
                            </View>
                        </View>
                    </ImageBackground>
                    <View style={{ marginLeft: "4%", height: height * 0.08, width: "92%", top: -height * 0.04, flexDirection: "row" }}>
                        {firmLogo ?
                            <Image source={{ uri: `${firmLogo}` !== "" ? `${firmLogo}` : undefined }} style={{ height: height * 0.08, width: height * 0.08, backgroundColor: 'white', borderRadius: 8, borderWidth: 1.5, borderColor: colors.primary, resizeMode: "center" }} />
                            : <Image />
                        }
                    </View>

                    <View style={{ width: "96%", justifyContent: "center", paddingLeft: "2%", paddingTop: "1%", top: -height * 0.03 }}>

                        <View style={{ flexDirection: "row", justifyContent: "flex-start", alignItems: "center", padding: "2%" }}>
                            <Ionicons name="call" size={height * 0.03} color={colors.primary} />
                            <View style={{ flexDirection: "column", marginLeft: "4%" }}>
                                <Text style={{ fontFamily: 'Regular', fontSize: height * 0.015, color: colors.primary }}>Phone Number</Text>
                                <Text style={{ fontFamily: 'Bold', fontSize: height * 0.018, marginTop: "2%", color: "#000" }}>{mobile}</Text>
                            </View>
                        </View>

                        {
                            email ?
                                <View style={{ flexDirection: "row", justifyContent: "flex-start", alignItems: "center", padding: "2%" }}>
                                    <Ionicons name="mail" size={height * 0.03} color={colors.primary} />
                                    <View style={{ flexDirection: "column", marginLeft: "4%" }}>
                                        <Text style={{ fontFamily: 'Regular', fontSize: height * 0.015, color: colors.primary }}>Email</Text>
                                        <Text style={{ fontFamily: 'Bold', fontSize: height * 0.018, marginTop: "2%", color: "#00AEF2" }}
                                            onPress={() => Linking.openURL(`mailto:${email}`)}
                                        >{email}</Text>
                                    </View>
                                </View>
                                :
                                <View />
                        }

                        {
                            firm_name ?
                                <View style={{ flexDirection: "row", justifyContent: "flex-start", alignItems: "center", padding: "2%" }}>
                                    <Ionicons name="briefcase" size={height * 0.03} color={colors.primary} />
                                    <View style={{ flexDirection: "column", marginLeft: "4%" }}>
                                        <Text style={{ fontFamily: 'Regular', fontSize: height * 0.015, color: colors.primary }}>Organization Name</Text>
                                        <Text style={{ fontFamily: 'Bold', fontSize: height * 0.018, marginTop: "2%" }}>{firm_name}</Text>
                                    </View>
                                </View>
                                : <View />
                        }

                        {
                            category ?
                                <View style={{ flexDirection: "row", justifyContent: "flex-start", alignItems: "center", padding: "2%" }}>
                                    <Ionicons name="grid" size={height * 0.03} color={colors.primary} />
                                    <View style={{ flexDirection: "column", marginLeft: "4%" }}>
                                        <Text style={{ fontFamily: 'Regular', fontSize: height * 0.015, color: colors.primary }}>Category</Text>
                                        <Text style={{ fontFamily: 'Bold', fontSize: height * 0.018, marginTop: "2%" }}>{category}</Text>
                                    </View>
                                </View>
                                :
                                <View />
                        }

                        {
                            address ?
                                <View style={{ flexDirection: "row", justifyContent: "flex-start", alignItems: "center", padding: "2%" }}>
                                    <Ionicons name="location" size={height * 0.03} color={colors.primary} />
                                    <View style={{ flexDirection: "column", marginLeft: "4%" }}>
                                        <Text style={{ fontFamily: 'Regular', fontSize: height * 0.015, color: colors.primary }}>Address</Text>
                                        <Text style={{ fontFamily: 'Bold', fontSize: height * 0.018, marginTop: "2%" }}>{address}</Text>
                                    </View>
                                </View> :
                                <View />
                        }

                        {
                            website ?
                                <View style={{ flexDirection: "row", justifyContent: "flex-start", alignItems: "center", padding: "2%" }}>
                                    <Ionicons name="globe-outline" size={height * 0.03} color={colors.primary} onPress={() => Linking.openURL(website)} />
                                    <View style={{ flexDirection: "column", marginLeft: "4%" }}>
                                        <Text style={{ fontFamily: 'Regular', fontSize: height * 0.015, color: colors.primary }}>Website</Text>
                                        <Text style={{ fontFamily: 'Bold', fontSize: height * 0.018, marginTop: "2%", color: "#00AEF2", marginTop: "2%" }} onPress={() => Linking.openURL(website)} >{website}</Text>
                                    </View>
                                </View> :
                                <View />
                        }
                        <View style={{ flexDirection: "row", justifyContent: "flex-start", alignItems: "center", padding: "2%" }}>
                            <Ionicons name="calendar" size={height * 0.03} color={colors.primary} />
                            <Text style={{ fontFamily: 'Regular', fontSize: height * 0.015, color: colors.primary, marginLeft: "4%" }}>Attendance</Text>
                        </View>
                        <View style={{ flexDirection: "row", width: "85%", justifyContent: "space-between", backgroundColor: colors.lightgrey, paddingVertical: "3%", marginLeft: "12.5%" }}>
                            <View style={{ width: "35%", alignItems: "center" }}>
                                <Text style={{ fontFamily: "SemiBold", fontSize: height * 0.014 }}>Total Attendance</Text>
                                <Text style={{ fontFamily: "Bold", fontSize: height * 0.016, marginTop: "2%", color: colors.primary }}>{total}</Text>
                            </View>
                            <View style={{ width: "20%", alignItems: "center", }}>
                                <Text style={{ fontFamily: "SemiBold", fontSize: height * 0.014 }}>Present</Text>
                                <Text style={{ fontFamily: "Bold", fontSize: height * 0.016, marginTop: "2%", color: colors.primary }}>{present}</Text>
                            </View>
                            <View style={{ width: "20%", alignItems: "center" }}>
                                <Text style={{ fontFamily: "SemiBold", fontSize: height * 0.014 }}>Absent</Text>
                                <Text style={{ fontFamily: "Bold", fontSize: height * 0.016, marginTop: "2%", color: colors.primary }}>{absent}</Text>
                            </View>
                            <View style={{ width: "25%", alignItems: "center" }}>
                                <Text style={{ fontFamily: "SemiBold", fontSize: height * 0.014 }}>Substitute</Text>
                                <Text style={{ fontFamily: "Bold", fontSize: height * 0.016, marginTop: "2%", color: colors.primary }}>{substitute}</Text>
                            </View>
                        </View>
                        {keywords.length > 0 ?
                            <View style={{ flexDirection: "row", justifyContent: "flex-start", alignItems: "center", padding: "2%" }}>
                                <Ionicons name="key" size={height * 0.03} color={colors.primary} />
                                <View style={{ flexDirection: "column", marginLeft: "4%" }}>
                                    <Text style={{ fontFamily: 'Regular', fontSize: height * 0.015, marginTop: "2%", color: colors.primary, marginBottom: "1%" }}>Keywords</Text>
                                    <FlatList
                                        data={keywords}
                                        renderItem={({ item }) => {
                                            return (
                                                <View style={{ backgroundColor: "#ffccc7", paddingHorizontal: 10, paddingVertical: 5, borderRadius: 5, marginRight: 5, marginBottom: 5 }}>
                                                    <Text style={{ fontSize: height * 0.015, color: colors.primary, fontFamily: "SemiBold" }}>{item}</Text>
                                                </View>
                                            )
                                        }}
                                        keyExtractor={item => item.id}
                                        columnWrapperStyle={{ flexWrap: 'wrap' }}
                                        numColumns={5}
                                        scrollEventThrottle={1900}
                                    // contentContainerStyle={{
                                    //     flexDirection: 'row',
                                    //     flexWrap: 'wrap'//Needed for wrapping for the items
                                    // }}
                                    />
                                </View>
                            </View> :
                            <View />}
                    </View>
                </ScrollView>
            )}
        </SafeAreaView>
    )
}
// }


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FFFCFC",
        // justifyContent: "flex-start",
        // alignItems: "center"
        // paddingHorizontal: "4%"
    },
    coverImage: {
        height: height * 0.22,
        width: "100%",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: colors.primary,
    },
    slide: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: 'white',
        marginTop: "4%"
    },
    text: {
        color: colors.primary,
        fontSize: height * 0.03,
        fontFamily: "SemiBold"
    }
});

export default MyProfileScreen;
