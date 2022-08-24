import React, { useState, useEffect } from 'react'
import { StatusBar, Image, Modal, TouchableOpacity, Dimensions, SafeAreaView, StyleSheet, View, Text, TextInput, ScrollView } from 'react-native';

const { height, width } = Dimensions.get('window');
import colors from '../config/colors';
import { Ionicons } from '@expo/vector-icons';
import ShortButton from '../components/ShortButton';
import CancelButton from '../components/CancelButton';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { CommonActions } from '@react-navigation/native';
import env from '../config/env';

const ProfileEditScreen = ({ navigation }) => {
    // const profile_picture = useSelector(state => state.AuthReducers.profile_picture);
    const user_id = useSelector(state => state.AuthReducers.user_id);
    const token = useSelector(state => state.AuthReducers.accessToken);
    const [name, setName] = useState('')
    const [mobile, setMobile] = useState('')
    const [email, setEmail] = useState('')
    const [profile_picture, setProfilePicture] = useState('')
    const [company, setComapny] = useState('')
    const [address, setAddress] = useState('')
    const [keywords, setKeywords] = useState();
    const [category, setCategory] = useState();
    const [website, setWebsite] = useState();

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
                setEmail(res.data.data.email);
                setProfilePicture(res.data.data.profile_picture);
                setMobile(res.data.data.mobile ? res.data.data.mobile.replace(/(\d{2})/, '$1 ') : null);
                setComapny(res.data.data.firm_name);
                setAddress(res.data.data.address)
                setKeywords(res.data.data.keywords)
                setCategory(res.data.data.category)
                setWebsite(res.data.data.website)
            })
            .catch(function (error) {
                console.log("error at members profile edit", error.message)
            })
    }, []);

    const submit = () => {
        axios({
            method: "PUT",
            url: `${env.endpointURL}/users/${user_id}`,
            headers: {
                'Cookie': `jwt=${token}`
            },
            data: {
                "id": user_id,
                "email": email,
                "address": address,
                // "profile_picture": "enter base 64",
                "updated_by": user_id,
                "keywords": keywords
            }
        })
            .then(function (res) {
                console.log("res.data", res.data);
                navigation.dispatch(
                    CommonActions.navigate({
                        name: "MyProfileScreen",
                        params: {
                            refresh: 0
                        },
                    })
                );
            })
            .catch(function (error) {
                console.log("error at members profile edit", error.message)
            })
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar backgroundColor={colors.primary} barStyle='light-content' />
            <ScrollView style={{ width: "100%", height: "90%" }} showsVerticalScrollIndicator={false}>

                <View style={{ marginLeft: width * 0.30, paddingTop: "2%" }}>
                    <Image source={{ uri: `${profile_picture}` }} style={{ height: height * 0.15, width: height * 0.15, borderRadius: 100 }} />
                    {/* <Ionicons name={"camera"} size={height * 0.04} color={colors.primary} style={{ left: "30%", bottom: "15%" }} /> */}
                </View>

                <Text style={{ fontFamily: "SemiBold", paddingTop: "2%" }}>Name</Text>
                <TextInput
                    style={styles.input}
                    placeholder={name}
                    autoCapitalize="words"
                    autoComplete="name" //only android
                    keyboardType="default"
                    returnKeyType="done"
                    selectionColor={colors.selector}
                    textContentType="name" //only ios
                    onChangeText={(text) => setName(text)}
                    clearButtonMode="always" //only on IOS
                    // value={name}
                    editable={false}
                />

                <Text style={{ fontFamily: "SemiBold", marginTop: "2%" }}>Mobile</Text>
                <TextInput
                    style={styles.input}
                    placeholder={mobile}
                    keyboardType="number-pad"
                    returnKeyType="done"
                    selectionColor={colors.selector}
                    textContentType="telephoneNumber"//only ios
                    onChangeText={(text) => setMobile(text)}
                    clearButtonMode="always" //only on IOS
                    // value={mobile}
                    editable={false}
                />

                <Text style={{ fontFamily: "SemiBold", marginTop: "2%" }}>Email Address</Text>
                <TextInput
                    style={styles.input}
                    // placeholder={email}
                    placeholderTextColor="#000"
                    keyboardType="email-address"
                    returnKeyType="done"
                    selectionColor={colors.selector}
                    textContentType="emailAddress"//only ios
                    onChangeText={(text) => setEmail(text)}
                    clearButtonMode="always" //only on IOS
                    value={email}
                    editable={true}
                />

                <Text style={{ fontFamily: "SemiBold", marginTop: "2%" }}>Organization Name</Text>
                <TextInput
                    style={styles.input}
                    placeholder={company}
                    keyboardType="default"
                    autoCapitalize="words"
                    returnKeyType="done"
                    selectionColor={colors.selector}
                    dataDetectorTypes="address" //only ios
                    onChangeText={(text) => setComapny(text)}
                    textContentType="addressCityAndState"//only ios
                    clearButtonMode="always" //only on IOS
                    // value={company}
                    editable={false}
                />

                <Text style={{ fontFamily: "SemiBold", marginTop: "2%" }}>Category</Text>
                <TextInput
                    style={styles.input}
                    placeholder={category}
                    keyboardType="default"
                    autoCapitalize="words"
                    returnKeyType="done"
                    selectionColor={colors.selector}
                    dataDetectorTypes="address" //only ios
                    onChangeText={(text) => setCategory(text)}
                    textContentType="addressCityAndState"//only ios
                    clearButtonMode="always" //only on IOS
                    // value={category}
                    editable={false}
                />

                <Text style={{ fontFamily: "SemiBold", marginTop: "2%" }}>Address</Text>
                <TextInput
                    style={styles.input}
                    // placeholder={address}
                    keyboardType="default"
                    autoCapitalize="words"
                    returnKeyType="done"
                    selectionColor={colors.selector}
                    dataDetectorTypes="address" //only ios
                    onChangeText={(text) => setAddress(text)}
                    textContentType="addressCityAndState"//only ios
                    clearButtonMode="always" //only on IOS
                    value={address}
                    editable={true}
                />

                <Text style={{ fontFamily: "SemiBold", marginTop: "2%" }}>Website</Text>
                <TextInput
                    style={styles.input}
                    placeholder={website}
                    keyboardType="default"
                    autoCapitalize="words"
                    returnKeyType="done"
                    selectionColor={colors.selector}
                    dataDetectorTypes="address" //only ios
                    onChangeText={(text) => setWebsite(text)}
                    textContentType="addressCityAndState"//only ios
                    clearButtonMode="always" //only on IOS
                    // value={website}
                    editable={false}
                />

                <Text style={{ fontFamily: "SemiBold", marginTop: "2%" }}>Keywords</Text>
                <TextInput
                    style={styles.input}
                    // placeholder={keywords}
                    keyboardType="default"
                    autoCapitalize="words"
                    returnKeyType="done"
                    selectionColor={colors.selector}
                    dataDetectorTypes="address" //only ios
                    onChangeText={(text) => setKeywords(text)}
                    textContentType="addressCityAndState"//only ios
                    clearButtonMode="always" //only on IOS
                    value={keywords}
                    editable={true}
                />
            </ScrollView>

            <View style={styles.footer}>
                <CancelButton onPress={() => navigation.navigate("MyProfileScreen", { refresh: 0 })} text="Cancel" />
                <ShortButton onPress={() => submit()} text="Save" />
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1, margin: "4%", padding: "4%", justifyContent: "space-between", alignItems: "center"
    },
    footer: {
        width: "100%", justifyContent: "space-evenly", alignItems: "center", flexDirection: "row"
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
    selector: {
        flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: "2%", width: "100%", height: height * 0.06, backgroundColor: colors.lightgrey, borderRadius: 10, borderColor: colors.grey, borderWidth: 1
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
        height: "80%",
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
    modalText: {
        marginBottom: 15,
        textAlign: "center",
        fontFamily: "SemiBold"
    },
})

export default ProfileEditScreen;