import React from 'react';
import { View, Dimensions, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from '../config/colors';

const { height } = Dimensions.get('window');
function LeadButton({ text, color, icon, iconColor, onPress, selected, count }) {
    return (
        <View style={{ height: height * 0.095, width: height * 0.12, alignItems: "center", }} onPress>
            <View style={{ height: height * 0.057, width: height * 0.057, backgroundColor: color, borderRadius: 40, alignItems: "center", justifyContent: "center" }}>
                <Ionicons name={icon} size={height * 0.03} style={{ marginRight: "4%", left: 1, color: iconColor }} />
            </View>
            <Text style={{ fontFamily: selected ? "Bold" : "SemiBold", fontSize: height * 0.0135, marginTop: "10%", textAlign: "center", color: selected ? colors.black : colors.grey }}>{text} ({count})</Text>
        </View>
    );
}

export default LeadButton;
