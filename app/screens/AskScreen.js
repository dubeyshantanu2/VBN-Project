import React from 'react'
import { StatusBar, Image, Dimensions, SafeAreaView, Text, TouchableOpacity, StyleSheet } from 'react-native';
import colors from "../config/colors";

const { height, width } = Dimensions.get('window');

const AskScreen = () => {

    return (

        <SafeAreaView style={{ flex: 1, backgroundColor: "#fff", justifyContent: "center" }}>
            <StatusBar backgroundColor={colors.primary} barStyle='light-content' />
            <View style={styles.listTab}>
                <TouchableOpacity>
                    <Text>All</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
}

export default AskScreen;

const styles = StyleSheet.create({
    listTab: {
        flex: 1,
        backgroundColor: "#fff",
        padding: 15
    }
})