import React from 'react'
import { StatusBar, Image, Dimensions, SafeAreaView, Button, Text, View, FlatList, TouchableOpacity } from 'react-native';
import colors from '../config/colors';
const { height, width } = Dimensions.get('window');

import { Ionicons } from '@expo/vector-icons';
import { useSelector } from 'react-redux';

const PostScreen = ({ navigation }) => {
    const token = useSelector(state => state.AuthReducers.accessToken);
    const chapter_id = useSelector(state => state.AuthReducers.chapter_id);

    return (

        <SafeAreaView style={{ flex: 1, backgroundColor: colors.lightgrey, flexDirection: "column-reverse", justifyContent: "flex-start", alignItems: "center" }}>
            <StatusBar backgroundColor={colors.primary} barStyle='light-content' />
            <View style={{
                width: "92%", backgroundColor: "white", borderTopRightRadius: 25, borderTopLeftRadius: 25, shadowOffset: {
                    width: 0,
                    height: 2,
                },
                shadowOpacity: 0.25,
                shadowRadius: 4,
                elevation: 5, justifyContent: "center", paddingVertical: "2%"
            }}>
                <TouchableOpacity onPress={() => navigation.navigate("GiveScreen")} style={{ width: "100%", alignItems: "center", padding: "4%", justifyContent: "center" }}>
                    <Text style={{ color: colors.black, fontFamily: "SemiBold" }}>Asks / Gives</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate("AddVisitorScreen")} style={{ width: "100%", alignItems: "center", padding: "4%", justifyContent: "center" }}>
                    <Text style={{ color: colors.black, fontFamily: "SemiBold" }}>Add Visitors</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate("CreateLeadScreen", { token: token, chapter_id: chapter_id })} style={{ width: "100%", alignItems: "center", padding: "4%", justifyContent: "center" }}>
                    <Text style={{ color: colors.black, fontFamily: "SemiBold" }}>Create Leads</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate("ThankyouScreen")} style={{ width: "100%", alignItems: "center", padding: "4%", justifyContent: "center" }}>
                    <Text style={{ color: colors.black, fontFamily: "SemiBold" }}>Thank You Notes</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
}

export default PostScreen;
