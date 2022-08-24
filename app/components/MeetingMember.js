import { StyleSheet, Text, TouchableOpacity, Dimensions, Image, View } from 'react-native'
import React from 'react'
import colors from '../config/colors';
import { Ionicons } from '@expo/vector-icons';

const { height, width } = Dimensions.get('window');

function MeetingMember({ onPress, image, firstName, category, lastName, firm_name }) {
    return (
        <TouchableOpacity style={styles.button} onPress={onPress}>
            <View style={{ flexDirection: "row", }}>
                <Image style={{ height: 50, width: 50, backgroundColor: "#eee", marginLeft: "2%", borderRadius: 7 }} source={image} />
                <View>
                    <Text style={styles.text}>{firstName} {lastName}</Text>
                    <Text style={{ fontSize: height * 0.013, marginLeft: "6%", color: colors.inactiveTab }}>{category}</Text>
                    <Text style={{ fontSize: height * 0.016, marginLeft: "6%", color: colors.inactiveTab }}>{firm_name}</Text>
                </View>
            </View>

            <Ionicons name={"chevron-forward-outline"} size={height * 0.03} color={colors.darkgrey} style={{ marginRight: "5%" }} />

        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    button: {
        width: height * 0.38,
        height: height * 0.1,
        backgroundColor: colors.white,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    text: {
        marginLeft: "6%",
        fontSize: height * 0.02,
        fontFamily: "SemiBold",
    }
})

export default MeetingMember;