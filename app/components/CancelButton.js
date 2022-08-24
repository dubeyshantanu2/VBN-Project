import { StyleSheet, Text, TouchableOpacity, Dimensions } from 'react-native'
import React from 'react'
import colors from '../config/colors';

const { height, width } = Dimensions.get('window');

function CancelButton({ onPress, text }) {

    return (
        <TouchableOpacity style={styles.button} onPress={onPress}>
            <Text style={styles.text}>{text}</Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    button: {
        backgroundColor: colors.white,
        borderRadius: 5,
        justifyContent: "center",
        alignItems: "center",
        padding: 12,
        width: "45%",
        borderWidth: 1
    },
    text: {
        color: colors.black,
        fontSize: height * 0.017,
        fontFamily: "SemiBold",
    }
})

export default CancelButton;