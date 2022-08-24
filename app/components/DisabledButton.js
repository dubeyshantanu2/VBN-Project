import { StyleSheet, Text, TouchableOpacity, Dimensions, View } from 'react-native'
import React from 'react'
import colors from '../config/colors';

const { height, width } = Dimensions.get('window');

function DisabledButton({ text }) {
    return (
        <View style={styles.button} >
            <Text style={styles.text}>{text}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    button: {
        backgroundColor: colors.inactiveTab,
        borderRadius: 5,
        justifyContent: "center",
        alignItems: "center",
        padding: 12,
        width: "45%",
        borderWidth: 1,
        borderColor: colors.inactiveTab
    },
    text: {
        color: colors.white,
        fontSize: height * 0.017,
        fontFamily: "SemiBold",
    }
})

export default DisabledButton;