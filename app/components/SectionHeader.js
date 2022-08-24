import { StyleSheet, Text, TouchableOpacity, Dimensions, Image, View } from 'react-native'
import React from 'react'
import colors from '../config/colors';
import { Ionicons } from '@expo/vector-icons';

const { height, width } = Dimensions.get('window');

function SectionHeader({ headerText }) {
    return (
        <View style={styles.view}>
            <Text style={styles.text}>{headerText}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    view: {
        marginTop: "2%",
        marginBottom: "2%",
        paddingLeft: "2%",
        paddingTop: "1.5%",
        paddingBottom: "1.5%",
        backgroundColor: colors.lightgrey,
        borderRadius: 4,
        borderColor: colors.red
    },
    text: {
        fontSize: height * 0.015,
        fontFamily: "SemiBold"
    }
})

export default SectionHeader;