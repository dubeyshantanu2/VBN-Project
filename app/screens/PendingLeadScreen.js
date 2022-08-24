import React from 'react'
import { StatusBar, Image, Dimensions, SafeAreaView, View, Text } from 'react-native';
import { Logout } from '../store/actions';
import { useDispatch } from 'react-redux';
import colors from '../config/colors';
import { Ionicons } from '@expo/vector-icons';
import { FlatList } from 'react-native-gesture-handler';

const { height, width } = Dimensions.get('window');

const data = [
    {
        name: "Niraj Ramakrishnan",
        id: 1,
        leads: 3
    },
    {
        name: "Chandra Mallick",
        id: 2,
        leads: 2
    },
    {
        name: "Pravin Dhillon",
        id: 3,
        leads: 4
    },
]
const PendingLeadScreen = () => {

    const ItemView = ({ item }) => {
        return (
            <View style={{ flexDirection: "row", paddingVertical: 15, alignItems: "center" }}>
                <Text style={{ fontFamily: "Medium", fontSize: height * 0.016, marginLeft: "4%" }}>{item.id}</Text>
                <View style={{ width: "50%" }}>
                    <Text style={{ fontFamily: "Medium", fontSize: height * 0.016, marginLeft: "2%" }}>{item.name}</Text>
                </View>
                <Text style={{ fontFamily: "Medium", fontSize: height * 0.016, marginLeft: "10%" }}>{item.leads}</Text>
                <Ionicons name={"create-outline"} size={height * 0.02} style={{ marginLeft: "19%" }} color={colors.black} />
            </View>
        )
    }

    const separator = () => {
        return <View style={{ borderColor: colors.lightgrey, borderWidth: 0.5, marginHorizontal: "4%" }} />
    }


    return (

        <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
            <StatusBar backgroundColor={colors.primary} barStyle='light-content' />
            <View style={{
                flexDirection: "row", backgroundColor: colors.lightgrey, paddingVertical: 10
            }}>
                <Text style={{ fontFamily: "SemiBold", fontSize: height * 0.016, marginLeft: "4%" }}>Lead Name</Text>
                <Text style={{ fontFamily: "SemiBold", fontSize: height * 0.016, marginLeft: "36%" }}>No of Lead</Text>
                <Text style={{ fontFamily: "SemiBold", fontSize: height * 0.016, marginLeft: "8%" }}>Action</Text>
            </View>
            <FlatList
                data={data}
                keyExtractor={item => item.id}
                renderItem={ItemView}
                showsVerticalScrollIndicator={false}
                ItemSeparatorComponent={separator}
            />
        </SafeAreaView>
    )
}

export default PendingLeadScreen;
