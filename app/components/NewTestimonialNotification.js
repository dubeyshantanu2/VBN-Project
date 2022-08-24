import React, { useState, useEffect } from 'react'
import { StatusBar, Image, Dimensions, SafeAreaView, Button, Text, Touchable, TouchableOpacity } from 'react-native';
import colors from '../config/colors';
import { Ionicons } from '@expo/vector-icons';

const { height, width } = Dimensions.get('window');

const NewTestimonialNotification = () => {
    return (
        <TouchableOpacity>
            <View style={{ flexDirection: "row", }}>
                <Image style={{ height: height * 0.06, width: height * 0.06, backgroundColor: colors.darkgrey, borderRadius: 5 }} source={{ uri: invited_by_user ? invited_by_user.profile_picture : null }} />
                <View style={{ width: "76%", marginLeft: "4%" }}>
                    <Text style={{ fontFamily: "Bold", fontSize: height * 0.018 }}>New Testimonial</Text>
                    <Text style={{ fontFamily: "Bold", fontSize: height * 0.018 }}>Posted By: Kranthi Kumar</Text>
                    <Text style={{ fontFamily: "Regular", fontSize: height * 0.013 }}> eyfd yiqw wgw fgweuk kfwk gfwk fkwue wfgw fqi ;rqugf qfuw fgq orywq pqqr gq wugfdbudqk qog bfceq iyu</Text>
                </View>
                <View style={{ width: "10%", justifyContent: "center" }}>
                    <Ionicons name={"chevron-forward-outline"} size={height * 0.03} color={colors.darkgrey} style={{}} />
                </View>
            </View>
        </TouchableOpacity>
    )
}

export default NewTestimonialNotification;
