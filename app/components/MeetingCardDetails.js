import { StyleSheet, Text, TouchableOpacity, Dimensions, View } from 'react-native'
import React from 'react'
import colors from '../config/colors';
import { Ionicons } from '@expo/vector-icons';
import { NavigationContainer } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import moment from 'moment';

const { height, width } = Dimensions.get('window');

function MeetingCardDetails({ key, meetingName, date, location, start, end, day, item, meeting_date }) {
    const navigation = useNavigation();
    return (
        <TouchableOpacity key={key} style={styles.button} onPress={() => navigation.navigate("MeetingDetailScreen", {
            meeting: item,
        })}>
            <View style={{ flexDirection: "row", width: "100%", alignItems: "center" }}>
                <View style={{ padding: "0.2%", height: height * 0.055, width: height * 0.055, backgroundColor: colors.primary, borderRadius: 5, alignItems: "center" }}>
                    <Text style={{ color: colors.white, fontSize: height * 0.018 }}>{(moment(meeting_date).format('DD'))}</Text>
                    <Text style={{ color: colors.white, fontSize: height * 0.018 }}>{(moment(meeting_date).format('MMM'))}</Text>
                </View>
                <View style={{ width: "75%", marginLeft: "2%", padding: "2%" }}>
                    <Text style={{ fontFamily: "Bold" }}>{location}</Text>

                    <View style={{ flexDirection: "row" }}>
                        <Text style={{ fontFamily: "Regular", fontSize: height * 0.014, marginTop: "1%" }}>{(moment(meeting_date).format('dddd'))},</Text>
                        <Text style={{ fontFamily: "Regular", fontSize: height * 0.014, marginTop: "1%" }}> {start} </Text>
                        <Text style={{ fontFamily: "Regular", fontSize: height * 0.014, marginTop: "1%" }}>{end}</Text>
                    </View>
                </View>
                <View style={{ width: "5%", marginLeft: "2%", justifyContent: "center" }}>
                    <Ionicons name={"chevron-forward-outline"} size={height * 0.03} color={colors.inactiveTab} />
                </View>
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    button: {
        backgroundColor: colors.white,
        borderRadius: 5,
        padding: 5,
        borderWidth: 1.5,
        borderColor: colors.lightgrey,
        width: "92%",
        marginLeft: "4%"
    },
})

export default MeetingCardDetails;
