import { StyleSheet, Text, TouchableOpacity, Dimensions, Image, View } from 'react-native'
import React from 'react'
import colors from '../config/colors';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, NavigationContainer } from '@react-navigation/native';
import { CommonActions } from '@react-navigation/native';
const { height, width } = Dimensions.get('window');

function MemberList({ id, image, firstName, category, lastName, firm_name, rosterId }) {
    const navigation = useNavigation();

    return (
        <TouchableOpacity style={styles.button} onPress={() => navigation.dispatch(
            CommonActions.navigate({
                name: 'ProfileScreen',
                params: {
                    id: id
                },
            })
        )}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", width: "92%" }}>
                <View style={{ flexDirection: "row" }}>
                    {
                        image !== null ?
                            <Image style={{ height: 50, width: 50, backgroundColor: "#eee", borderRadius: 7 }} source={{ uri: image }} />
                            :
                            <Image source={require("../assets/images/profilepicture.png")} style={{ height: 50, width: 50, backgroundColor: "#eee", borderRadius: 7 }} />
                    }
                    <View style={{ backgroundColor: colors.primary, height: 23, width: 23, borderRadius: 40, left: -15, top: 25, borderWidth: 1.5, borderColor: "white", justifyContent: "center", alignItems: "center" }}>
                        <Text style={{ color: "white", fontSize: height * 0.010 }}>#{rosterId}</Text>
                    </View>
                    <View style={{ left: -10, width: "72%" }}>
                        <Text style={styles.text} ellipsizeMode='tail' numberOfLines={1}>{firstName} {lastName}</Text>
                        <Text style={{ fontSize: height * 0.013, color: colors.inactiveTab }} ellipsizeMode='tail' numberOfLines={1}>{category}</Text>
                        <Text style={{ fontSize: height * 0.015, color: colors.inactiveTab }} ellipsizeMode='tail' numberOfLines={1}>{firm_name}</Text>
                    </View>
                    {/* </View> */}
                </View>
            </View>
            <Ionicons name={"chevron-forward-outline"} size={height * 0.03} color={colors.darkgrey} style={{ textAlign: "right" }} />
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    button: {
        backgroundColor: colors.white,
        shadowColor: "#000",
        borderRadius: 5,
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center",
        borderWidth: 1,
        borderColor: colors.grey,
        paddingHorizontal: "4%",
        paddingVertical: "2%",
        marginBottom: "2%",
    },
    text: {
        fontSize: height * 0.016,
        fontFamily: "SemiBold",
    }
})

export default MemberList;