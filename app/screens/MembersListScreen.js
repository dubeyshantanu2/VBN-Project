import React, { useState, useEffect } from 'react'
import { StatusBar, Dimensions, Modal, SafeAreaView, Text, StyleSheet, View, TextInput, SectionList, ActivityIndicator, TouchableOpacity } from 'react-native';
import colors from '../config/colors';
import { Ionicons } from '@expo/vector-icons';
import MemberSearchCard from '../components/MemberSearchCard';
import SectionHeader from '../components/SectionHeader';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { map, upperCase, groupBy, filter, isEqual, size, forEach } from 'lodash';
import env from '../config/env';
import RadioGroup from 'react-native-radio-buttons-group';
import ShortButton from '../components/ShortButton';
import CancelButton from '../components/CancelButton';

const { height, width } = Dimensions.get('window');

const MembersListScreen = ({ route }) => {
    const [userData, setUserData] = useState();
    const [originalData, setOriginalData] = useState();
    const [isLoaded, setIsLoaded] = useState(true);
    const [count, setCount] = useState();
    const [search, setSearch] = useState('');
    const token = useSelector(state => state.AuthReducers.accessToken);
    const [modalVisible, setModalVisible] = useState(false);
    const [radioButtons, setRadioButtons] = useState([]);
    const [messageModalVisible, setMessageModalVisible] = useState(false);
    const [selectedRadioButton, setSelectedRadioButton] = useState(null)
    const [previousSelectedRadioButton, setPreviousSelectedRadioButton] = useState(null)
    const [defaultRadioButton, setDefaultedRadioButton] = useState(null)
    const [searchText, setSearchText] = useState(null);
    const [refresh, setRefresh] = useState(0);
    const chapter_id = useSelector(state => state.AuthReducers.chapter_id);

    /*todo: search by full name and using contains instead of first_name*/
    // Old Search filter
    // const searchFilter = (text) => {
    //     if (text) {
    //         let filteredData = []
    //         forEach(originalData, (x) => {
    //             if (isEqual(upperCase(text.charAt(0)), x.title)) {
    //                 const result = {
    //                     "title": x.title,
    //                     "data": filter(x.data, (dataItem) => {
    //                         if (dataItem.first_name.indexOf(upperCase(text)) > -1) { return dataItem; }
    //                     })
    //                 }
    //                 if (size(result.data) > 0) { filteredData.push(result) }
    //             }
    //         })
    //         setUserData(filteredData);
    //     } else {
    //         setUserData(originalData);
    //     }
    //     setSearch(text);
    // }
    // const searchFilter = (search) => {
    //     if (search) {
    //         axios.get(`${env.endpointURL}/users/search?keyword=${search}`, {
    //             headers: {
    //                 'Cookie': `jwt=${token}`,
    //             },
    //         })
    //             .then((res) => {
    //                 let groupedData = groupBy(res.data.result, (x) => {
    //                     return (upperCase(x.first_name.charAt(0)));
    //                 });
    //                 let groupedDataList = map(groupedData, (v, k) => {
    //                     return { "title": k, "data": v }
    //                 });
    //                 setUserData(groupedDataList);
    //             }).catch((error) => {
    //                 console.log(error);
    //             })
    //     } else {
    //         setUserData(originalData);
    //     }
    //     setSearch(search);
    // }

    // Modified code based on shyam's statement
    const fetchPosts = (searchText) => {
        if (searchText) {
            axios.get(`${env.endpointURL}/users/search?keyword=${searchText}&chapter_id=${selectedRadioButton ? selectedRadioButton.id : chapter_id}`, {
                headers: {
                    'Cookie': `jwt=${token}`,
                },
            })
                .then((response) => {
                    if (searchText && response.data.result.length == 0) {
                        setUserData()
                    } else {
                        // setMessageModalVisible(searchText && response.data.result.length == 0 ? true : false);
                        let groupedData = groupBy(response.data.result, (x) => {
                            return (upperCase(x.first_name.charAt(0)));
                        });
                        let groupedDataList = map(groupedData, (v, k) => {
                            return { "title": k, "data": v }
                        });
                        setUserData(groupedDataList);
                    }
                }).catch((error) => {
                    console.log(error);
                })
            setIsLoaded(false);
        } else {
            getUserData();
            //     defaultRadioButton.selected = true
            //     radioButtons.forEach(item => {
            //         if (item.id === defaultRadioButton.id) item.selected = true
            //         else item.selected = false;
            //     });
            //     setIsLoaded(true);
            //     let selectedRadio = radioButtons.find(obj => obj.selected)
            //     setSelectedRadioButton(selectedRadio);
            //     setUserData(originalData);
            //     setIsLoaded(false);
        }
        setSearch(searchText);
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
                        setPreviousSelectedRadioButton(response.data[i])
                        setDefaultedRadioButton(response.data[i]);
                    }
                })
                setRadioButtons(response.data)
            }).catch((error) => {
                console.log(error);
            })
    }, [refresh])

    const getUserData = () => {
        setIsLoaded(true);
        axios({
            method: "GET",
            url: `${env.endpointURL}/users/chapterUsers/${selectedRadioButton ? selectedRadioButton.id : chapter_id}`,
            headers: {
                'Cookie': `jwt=${token}`,
            },
        })
            .then(function (res) {
                let groupedData = groupBy(res.data, (x) => {
                    return (upperCase(x.first_name.charAt(0)));
                });
                let groupedDataList = map(groupedData, (v, k) => {
                    return { "title": k, "data": v }
                });
                setCount(res.data.length)
                setUserData(groupedDataList);
                setOriginalData(groupedDataList);
                setIsLoaded(false);
            })
            .catch(function (error) {
                setIsLoaded(false);
                console.log("error at member list api memberscreen", error.message)
            })
    };

    useEffect(() => {
        getUserData();
    }, [refresh]);

    const separator = () => {
        return <View style={{ borderColor: "white", borderWidth: 3 }} />
    }

    function onPressRadioButton(radioButtonsArray) {
        setIsLoaded(true);
        let selectedRadio = radioButtonsArray.find(obj => obj.selected)
        setSelectedRadioButton(selectedRadio);
        setIsLoaded(false);
    }

    function setRadioButtonPreviousState() {
        radioButtons.forEach((d, i) => {
            if (radioButtons[i].id == previousSelectedRadioButton.id) {
                radioButtons[i].selected = true
            } else radioButtons[i].selected = false
            setSelectedRadioButton(radioButtons[i]);
        })
        setSelectedRadioButton(radioButtons.find(obj => obj.selected));
    }

    return (
        <SafeAreaView style={styles.center}>
            <StatusBar backgroundColor={colors.primary} barStyle='light-content' />
            {isLoaded ? (
                <View style={{ justifyContent: "center", alignItems: "center", height: "100%" }}>
                    <ActivityIndicator size="large" color={colors.primary} />
                </View>
            ) : (
                <>
                    {/* <View style={styles.textInputStyle}>
                        <Ionicons name="search" size={height * 0.03} color={colors.darkgrey} style={{ paddingRight: 10 }} />
                        <TextInput
                            style={{ flex: 1 }}
                            value={search}
                            placeholder="Search"
                            underlineColorAndroid="transparent"
                            onChangeText={(text) => searchFilter(text)}
                        />
                    </View>
                    <View style={{ marginTop: "1%" }} /> */}
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
                                            <CancelButton text={"Cancel"} onPress={() => { setModalVisible(!modalVisible); setRadioButtonPreviousState() }} />
                                            <ShortButton text={"Select"} onPress={() => { setModalVisible(!modalVisible); searchText ? fetchPosts(searchText) : getUserData(); setPreviousSelectedRadioButton(selectedRadioButton) }} />
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

                                        <Text>No Members found in <Text style={{ color: colors.primary }}>{selectedRadioButton ? selectedRadioButton.name : 'Selected'}</Text>, Do you want to search in other Chapters ?</Text>

                                        <View style={{ flexDirection: "row", justifyContent: "space-evenly", width: "100%", marginTop: 15, }}>
                                            <CancelButton text={"No"} onPress={() => { setMessageModalVisible(!messageModalVisible); }} />
                                            <ShortButton text={"Yes"} onPress={() => { setMessageModalVisible(!messageModalVisible); setModalVisible(true) }} />
                                        </View>
                                    </View>
                                </View>
                            </Modal>

                        </View>
                    </View>
                    {userData ?
                        <SectionList
                            sections={userData}
                            keyExtractor={(item, index) => {
                                return item.id
                            }}
                            renderItem={({ item }) => {
                                return (
                                    <MemberSearchCard image={item.profile_picture} firstName={item.first_name} lastName={item.last_name}
                                        category={item.category} firm_name={item.firm_name} id={item.id} rosterId={item.roster_id} total={item.total}
                                        present={item.present} absent={item.absent} substitute={item.substitute} />
                                )
                            }}
                            renderSectionHeader={({ section: { title } }) => (
                                <SectionHeader headerText={title} />
                            )}
                            ItemSeparatorComponent={separator}
                            initialNumToRender="100"
                        /> :
                        <View style={{ justifyContent: "center", alignItems: "center", marginTop: "60%" }}>
                            <Ionicons name={"people-outline"} size={25} color={colors.primary} />
                            <Text style={{ fontSize: height * 0.018, fontFamily: "SemiBold", color: colors.grey }}>No results found</Text>
                        </View>
                    }
                </>
            )}
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    center: {
        flex: 1,
        justifyContent: "flex-start",
        alignItems: "center",
        textAlign: "center",
        marginHorizontal: "4%",
    },
    textInputStyle: {
        justifyContent: "flex-start",
        flexDirection: "row",
        alignItems: "center",
        textAlign: "center",
        height: 40,
        borderRadius: 8,
        paddingLeft: 10,
        borderColor: "#009688",
        backgroundColor: colors.lightgrey,
        width: "90%",
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
})

export default MembersListScreen;
