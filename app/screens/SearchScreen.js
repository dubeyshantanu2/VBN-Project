import React, { useState, useEffect } from "react";
import { View, StyleSheet, FlatList, TextInput, Dimensions, Alert, Modal, Pressable, Text } from "react-native";
import colors from "../config/colors";
import { Ionicons } from '@expo/vector-icons';
import axios from "axios";
import RadioGroup from 'react-native-radio-buttons-group';
import MemberList from '../components/MemberList';
import ShortButton from '../components/ShortButton';
import CancelButton from '../components/CancelButton';
import { useSelector } from 'react-redux';
import env from '../config/env';

const { height } = Dimensions.get('window');

const Search = () => {
    const token = useSelector(state => state.AuthReducers.accessToken);
    const chapter_id = useSelector(state => state.AuthReducers.chapter_id);

    const [radioButtons, setRadioButtons] = useState([])
    const [selectedRadioButton, setSelectedRadioButton] = useState(null)
    const [filterdData, setfilterdData] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [messageModalVisible, setMessageModalVisible] = useState(false);
    const [searchText, setSearchText] = useState(null);
    const [isLoaded, setIsLoaded] = useState(true);

    const fetchPosts = (searchText) => {
        setIsLoaded(isLoaded ? false : true);
        // we are taking default chapter id:1
        axios.get(`${env.endpointURL}/users/search?keyword=${searchText}&chapter_id=${selectedRadioButton ? selectedRadioButton.id : 1}`, {
            headers: {
                'Cookie': `jwt=${token}`,
            },
        })
            .then((response) => {
                setMessageModalVisible(searchText && response.data.result.length == 0 ? true : false);
                setfilterdData(searchText ? response.data.result : null);
                setIsLoaded(isLoaded ? false : true);
            }).catch((error) => {
                setIsLoaded(isLoaded ? false : true);
                console.log(error);
            })
    }

    useEffect(() => {
        axios.get(`${env.endpointURL}/chapters`, {
            headers: {
                'Cookie': `jwt=${token}`,
            },
        })
            .then((response) => {
                response.data.forEach((d, i) => {
                    response.data[i].label = response.data[i].name
                    if (response.data[i].id == chapter_id) {
                        response.data[i].selected = true
                        setSelectedRadioButton(response.data[i]);
                    }
                })
                setRadioButtons(response.data)
            }).catch((error) => {
                console.log(error);
            })
    }, [])

    function onPressRadioButton(radioButtonsArray) {
        let selectedRadio = radioButtonsArray.find(obj => obj.selected)
        setSelectedRadioButton(selectedRadio);
    }

    return (
        <View style={styles.center}>
            <View style={{ flexDirection: "row", alignItems: "center", width: "100%", marginVertical: "3%", }}>
                <View style={styles.textInputStyle}>
                    <Ionicons name="search" size={height * 0.03} color={colors.darkgrey} style={{ paddingRight: 10 }} />
                    <TextInput
                        style={{ flex: 1 }}
                        placeholder="Search"
                        underlineColorAndroid="transparent"
                        onChangeText={(text) => { fetchPosts(text); setSearchText(text) }}
                        selectionColor={colors.selector}
                    />
                </View>
                <Ionicons name="options-outline" size={height * 0.04} color={colors.darkgrey} style={{ paddingLeft: 5 }} onPress={() => setModalVisible(true)} />
                <View style={styles.centeredView}>
                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible={modalVisible}
                        onRequestClose={() => {
                            setModalVisible(!modalVisible);
                        }}
                    >
                        <View style={styles.centeredView}>
                            <View style={styles.modalView}>
                                <View>
                                    <RadioGroup
                                        radioButtons={radioButtons}
                                        onPress={onPressRadioButton}
                                        containerStyle={{
                                            alignItems: "flex-start"
                                        }}
                                    />
                                </View>

                                <View style={{ flexDirection: "row", justifyContent: "space-evenly", width: "100%", marginTop: 15, }}>
                                    <CancelButton text={"Cancel"} onPress={() => { setModalVisible(!modalVisible); }} />
                                    <ShortButton text={"Select"} onPress={() => { setModalVisible(!modalVisible); fetchPosts(searchText); }} />
                                </View>
                            </View>
                        </View>
                    </Modal>

                </View>
                <View style={styles.centeredView}>
                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible={messageModalVisible}
                        onRequestClose={() => {
                            // Alert.alert("Modal has been closed.");
                            setMessageModalVisible(!messageModalVisible);
                        }}
                    >
                        <View style={styles.centeredView}>
                            <View style={styles.modalView}>

                                <Text>No Users Found In The <Text style={{ color: colors.primary }}>{selectedRadioButton ? selectedRadioButton.name : 'Selected'}</Text> Chapter, Do You Want To Search In Another Chapter ?</Text>

                                <View style={{ flexDirection: "row", justifyContent: "space-evenly", width: "100%", marginTop: 15, }}>
                                    <CancelButton text={"No"} onPress={() => { setMessageModalVisible(!messageModalVisible); }} />
                                    <ShortButton text={"Yes"} onPress={() => { setMessageModalVisible(!messageModalVisible); setModalVisible(true) }} />
                                </View>
                            </View>
                        </View>
                    </Modal>

                </View>
            </View>

            <FlatList
                data={filterdData}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) =>
                    <MemberList image={item.profile_picture}
                        firstName={item.first_name} lastName={item.last_name} category={item.category}
                        firm_name={item.firm_name} id={item.id} rosterId={item.roster_id} />}
            />

        </View>
    );
}
const styles = StyleSheet.create({
    center: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        paddingHorizontal: "4%"
    },
    itemStyle: {
        padding: 15
    },
    textInputStyle: {
        justifyContent: "flex-start",
        flexDirection: "row",
        alignItems: "center",
        textAlign: "center",
        height: 40,
        width: "90%",
        borderRadius: 8,
        paddingLeft: 10,

        borderColor: "#009688",
        backgroundColor: colors.lightgrey,
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
    },
    modalView: {
        alignItems: "flex-start",
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        top: -200
    },
    button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2,
    },
    buttonClose: {
        backgroundColor: '#2196F3',
    },
    textStyle: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    modalText: {
        marginBottom: 15,
        textAlign: 'center',
    },
    selectedButton: {
        paddingHorizontal: 15,
        paddingVertical: 10,
        marginRight: 10,
        borderRadius: 20,
        alignItems: "center",
        justifyContent: "center"
    },
    unselectedButton: {
        paddingHorizontal: 15,
        paddingVertical: 10,
        marginRight: 10,
        backgroundColor: colors.grey,
        borderRadius: 20,
        alignItems: "center",
        justifyContent: "center"
    },
});

export default Search;