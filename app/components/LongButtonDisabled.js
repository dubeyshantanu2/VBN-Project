import { StyleSheet, Text, TouchableOpacity, View, Dimensions } from 'react-native';
import React from 'react';
import colors from "../config/colors";

const { height } = Dimensions.get('window');

function LongButton({ onPress, text }) {
    return (
        <TouchableOpacity style={styles.button} onPress={onPress}>
            <Text style={styles.text}>{text}</Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    button: {
        backgroundColor: colors.lightgrey,
        borderRadius: 5,
        justifyContent: "center",
        alignItems: "center",
        padding: 12,
        width: "92%",
        borderWidth: 1,
        borderColor: colors.lightgrey
    },
    text: {
        color: colors.black,
        fontSize: height * 0.017,
        fontFamily: "SemiBold",
    }
})

export default LongButton;