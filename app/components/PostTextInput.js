import { StyleSheet, Text, View, TextInput } from 'react-native';
import React, { useState } from 'react';
import colors from "../config/colors";

export default function PostTextInput({ ...otherProps }) {
    const [description, setDescription] = useState('')
    return (
        <TextInput
            {...otherProps}
            style={styles.input}
            multiline={true}
            // placeholder="Enter description"
            onChangeText={(text) => setDescription(text)}
            selectionColor={colors.selector}
            clearButtonMode="always" //only on IOS
        />
    )
}

const styles = StyleSheet.create({
    input: {
        width: "100%",
        borderWidth: 1,
        borderColor: colors.grey,
        borderRadius: 10,
        marginTop: "2%",
        padding: 10,
    },
})