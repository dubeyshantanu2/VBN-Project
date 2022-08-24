import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import colors from '../config/colors';
import { Ionicons } from '@expo/vector-icons';


const NewPostButton = () => {


    return (
        <>
            <TouchableOpacity >
                <View style={styles.container}>
                    <Ionicons name="add-circle" color={colors.white} size={30} />
                </View>
            </TouchableOpacity>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: colors.primary,
        borderRadius: 40,
        borderColor: colors.white,
        borderWidth: 5,
        height: 60,
        width: 60,
        bottom: 15,
    }
})

export default NewPostButton;