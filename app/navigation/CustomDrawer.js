import { View, Text, ImageBackground, Image, Dimensions, TouchableWithoutFeedback } from 'react-native'
import React, { useState, useEffect } from 'react'
import axios from 'axios';
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer'
import colors from '../config/colors';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { Logout } from '../store/actions';

import { Ionicons } from '@expo/vector-icons';

import SplashScreen from "../screens/SplashScreen";

const { height, width } = Dimensions.get('window');


export default function CustomDrawer(props) {


    const first_name = useSelector(state => state.AuthReducers.first_name);
    const last_name = useSelector(state => state.AuthReducers.last_name);
    // const firm_name = useSelector(state => state.AuthReducers.firm_name);
    const profile_picture = useSelector(state => state.AuthReducers.profile_picture);
    const user_id = useSelector(state => state.AuthReducers.user_id);
    const [firm_name, setComapny] = useState();
    const dispatch = useDispatch();
    const submit = () => {
        dispatch(Logout())
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
                setComapny(res.data.data.firm_name);
            })
            .catch(function (error) {
                console.log("error at members profile edit", error.message)
            })
    }, []);


    return (
        <View style={{ flex: 1 }}>
            <DrawerContentScrollView
                {...props}
                contentContainerStyle={{ backgroundColor: colors.primary }}>
                <ImageBackground source={require('../assets/images/Header.png')} style={{ padding: 20 }}>
                    <Image source={{ uri: `${profile_picture}` }} style={{ height: 80, width: 80, borderRadius: 40, marginBottom: 10 }} />
                    <Text style={{ color: "#fff", fontSize: 18, fontFamily: "SemiBold" }}>{first_name} {last_name}</Text>
                    <Text style={{ color: "#fff", fontSize: 12, fontFamily: "Regular" }}>{firm_name}</Text>
                </ImageBackground>
                <View style={{ flex: 1, backgroundColor: "#fff", paddingTop: 10 }}>
                    <DrawerItemList {...props} />
                </View>
            </DrawerContentScrollView>
            <View style={{ padding: 20, borderTopWidth: 1, borderTopColor: '#ccc' }}>
                <TouchableWithoutFeedback onPress={submit} style={{ paddingVertical: 15 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Ionicons name="exit-outline" size={22} />
                        <Text style={{
                            fontSize: 15,
                            fontFamily: "Bold",
                            marginLeft: 5,
                        }}>Logout</Text>
                    </View>
                </TouchableWithoutFeedback>
            </View>
        </View>
    )
}


