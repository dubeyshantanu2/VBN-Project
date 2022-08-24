import React, { useState } from 'react';
import { StatusBar, Image, Dimensions, SafeAreaView, Button, View, StyleSheet, Alert, Modal, Text, Pressable } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer, CommonActions } from '@react-navigation/native';
import MyProfileScreen from '../../screens/MyProfileScreen';
import CancelButton from '../../components/CancelButton';
import ShortButton from '../../components/ShortButton';
import ProfileEditScreen from '../../screens/ProfileEditScreen';
import PendingLeadScreen from '../../screens/PendingLeadScreen';
import colors from '../../config/colors';
import { Ionicons } from '@expo/vector-icons';
import * as Linking from 'expo-linking';
import { useDispatch } from 'react-redux';
import { Logout } from '../../store/actions';
import { Menu, MenuOptions, MenuOption, MenuTrigger } from 'react-native-popup-menu';
import { useSelector } from 'react-redux';
import axios from 'axios';
import env from '../../config/env';

const Stack = createNativeStackNavigator();
const { height, width } = Dimensions.get('window');



const ProfileNavigator = ({ navigation }) => {
    const user_id = useSelector(state => state.AuthReducers.user_id);
    const token = useSelector(state => state.AuthReducers.accessToken);
    const dispatch = useDispatch();
    const submit = () => {
        dispatch(Logout())
    }
    const updateUser = () => {
        console.log("new Date()", new Date());
        axios({
            method: "PUT",
            url: `${env.endpointURL}/users/${user_id}`,
            headers: {
                'Cookie': `jwt=${token}`,
            },
            data: {
                "id": user_id,
                "delete_request_status": true,
                "delete_request_date": new Date(),
                "updated_by": user_id
            }
        })
            .then(function (res) {
                console.log("res.data", res.data);
            })
            .catch(function (error) {
                console.log("error at updateUser api in profile navigator", error)
            });
        dispatch(Logout())
    }

    const [modalVisible, setModalVisible] = useState(false);
    // const [modalVisible2, setModalVisible2] = useState(false);
    let fontSize = height * 0.025;
    let paddingHorizontal = 10;


    return (
        <Stack.Navigator
            screenOptions={{
                headerStyle: { backgroundColor: colors.primary },
                headerTintColor: colors.white,
                headerTitleAlign: 'center',
                headerTitleStyle: {
                    fontFamily: 'SemiBold', fontSize, paddingHorizontal
                },
                headerShadowVisible: false, // applied here
                headerBackTitleVisible: false,
            }}
            initialRouteName="ProfileScreen"
        >

            <Stack.Screen
                name="MyProfileScreen"
                component={MyProfileScreen}
                options={{
                    title: "Profile",
                    headerRight: () => (
                        <View style={{ justifyContent: "center", alignItems: "center" }}>
                            <Menu style={{ flexDirection: "row", alignItems: "center" }}>
                                <MenuTrigger style={{}}>
                                    <Ionicons name="ellipsis-vertical-outline" size={26} color={colors.white} style={{ marginLeft: 10 }} />
                                </MenuTrigger>

                                <MenuOptions optionsContainerStyle=
                                    {{ paddingVertical: 8, width: height * 0.25 }} >


                                    {/* Commented the edit profile screen page as per vikram statement */}


                                    {/* <MenuOption value="edit" onSelect={() => { navigation.navigate("ProfileEditScreen") }} >
                                        <View style={{ flexDirection: "row", justifyContent: "flex-start", alignItems: "center" }}>
                                            <Ionicons name="create-outline" size={18} color={colors.primary} style={{ marginHorizontal: 4 }} />
                                            <Text style={{ fontFamily: "Bold" }}>Edit Profile</Text>
                                        </View>
                                    </MenuOption> */}
                                    {/* <MenuOption value="edit" onSelect={() => { navigation.navigate("PendingLeadScreen") }} >
                                        <View style={{ flexDirection: "row", justifyContent: "flex-start", alignItems: "center" }}>
                                            <Ionicons name="alert-circle-outline" size={18} color={colors.primary} style={{ marginHorizontal: 4 }} />
                                            <Text style={{ fontFamily: "Bold" }}>Pending Lead Details</Text>
                                        </View>
                                    </MenuOption> */}
                                    <MenuOption value="help" onSelect={() => Linking.openURL(`mailto:developer.india@navtech.io`)}>
                                        <View style={{ flexDirection: "row", justifyContent: "flex-start", alignItems: "center" }}>
                                            <Ionicons name="information-circle-outline" size={18} color={colors.primary} style={{ marginHorizontal: 4 }} />
                                            <Text style={{ fontFamily: "Bold" }}>Help</Text>
                                        </View>
                                    </MenuOption>
                                    <MenuOption value="help" onSelect={() => setModalVisible(true)}>
                                        <View style={{ flexDirection: "row", justifyContent: "flex-start", alignItems: "center" }}>
                                            <Ionicons name="trash-outline" size={18} color={colors.primary} style={{ marginHorizontal: 4 }} />
                                            <Text style={{ fontFamily: "Bold" }}>Delete My Account</Text>
                                        </View>
                                    </MenuOption>
                                    <MenuOption value="edit" onSelect={submit} >
                                        <View style={{ flexDirection: "row", justifyContent: "flex-start", alignItems: "center" }}>
                                            <Ionicons name="log-out-outline" size={18} color={colors.primary} style={{ marginHorizontal: 4 }} />
                                            <Text style={{ fontFamily: "Bold" }}>Logout</Text>
                                        </View>
                                    </MenuOption>

                                </MenuOptions>
                            </Menu>
                            <View style={styles.centeredView}>
                                <Modal
                                    animationType="fade"
                                    transparent={true}
                                    visible={modalVisible}
                                    onRequestClose={() => {
                                        setModalVisible(!modalVisible);
                                    }}
                                >
                                    <View style={styles.centeredView}>
                                        <View style={styles.modalView}>
                                            <Text style={styles.modalText}>Are you sure you want to delete your account? </Text>
                                            <Text style={styles.modalNoteText}>Note: Your account will be deleted in 2-3 business days and you will get a confirmation email upon deletion.</Text>

                                            <View style={{ width: "100%", justifyContent: "space-evenly", alignItems: "center", flexDirection: "row" }}>
                                                <CancelButton onPress={() => setModalVisible(!modalVisible)} text="No" />
                                                <ShortButton onPress={() => { setModalVisible(!modalVisible); updateUser() }} text="Yes" />
                                            </View>
                                        </View>
                                    </View>
                                </Modal>
                                {/* <Modal
                                    animationType="fade"
                                    transparent={true}
                                    visible={modalVisible2}
                                    onRequestClose={() => {
                                        setModalVisible(!modalVisible2);
                                    }}
                                >
                                    <View style={styles.centeredView}>
                                        <View style={styles.modalView}>
                                            <Text style={styles.modalText}>Your account will be deleted in 3-4 business days, You’ll get an email once it deleted.</Text>

                                            <View style={{ width: "100%", justifyContent: "space-evenly", alignItems: "center", flexDirection: "row" }}>
                                                <CancelButton onPress={() => setModalVisible2(!modalVisible2)} text="Cancel" />
                                                <ShortButton onPress={() => { setModalVisible2(!modalVisible2) }} text="Submit" />
                                            </View>
                                        </View>
                                    </View>
                                </Modal> */}
                            </View>
                        </View >
                    ),

                }
                } />

            {/* Commented the edit profile screen page as per vikram statement */}

            {/* <Stack.Screen
                name="ProfileEditScreen"
                component={ProfileEditScreen}
                options={{
                    title: "Edit",
                    headerLeft: () => (
                        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                            <Ionicons name="chevron-back" size={25} color={colors.white} style={{ marginRight: 20 }} onPress={() => navigation.navigate("MyProfileScreen")} />
                        </View>
                    ),
                }} /> */}

            {/* <Stack.Screen
                name="PendingLeadScreen"
                component={PendingLeadScreen}
                options={{
                    title: "Pending Lead Details",
                    headerLeft: () => (
                        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                            <Ionicons name="chevron-back" size={25} color={colors.white} style={{ marginRight: 20 }} onPress={() => navigation.navigate("MyProfileScreen")} />
                        </View>
                    ),
                }} /> */}

        </Stack.Navigator >
    )
}

const styles = StyleSheet.create({
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
        padding: 35,
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
    button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2
    },
    modalText: {
        marginBottom: 15,
        textAlign: "center",
        fontFamily: "Bold",
        fontSize: height * 0.020
    },
    modalNoteText: {
        marginBottom: 15,
        textAlign: "center",
    }
});

export default ProfileNavigator;