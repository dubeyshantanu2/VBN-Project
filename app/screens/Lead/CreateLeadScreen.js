import React, { useState, useEffect, Component } from 'react'
import Checkbox from 'expo-checkbox';
import { FlatList, Pressable, Alert, Modal, ScrollView, StatusBar, Image, Dimensions, SafeAreaView, View, Text, TouchableOpacity, StyleSheet, TextInput, ActivityIndicator } from 'react-native';
import colors from '../../config/colors';
import { Ionicons } from '@expo/vector-icons';
import ShortButton from '../../components/ShortButton';
import LongButton from '../../components/LongButton';
import LongButtonDisabled from '../../components/LongButtonDisabled';
import CancelButton from '../../components/CancelButton';
import axios from "axios";
import { map, upperCase, groupBy, filter, isEqual, size, forEach } from 'lodash';
import Counter from "react-native-counters";
import env from '../../config/env';

const { height } = Dimensions.get('window');
export default class CreateLeadScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            checkedMember: [],
            modalVisible: false,
            ValidationMessage: false,
            selected: [],
            selectedMembers: [],
            search: [],
            original: [],
            filterdData: [],
        };

    }
    componentDidMount() {
        this.UserList();
        this.UserData();
    }

    searchFilter(search) {
        this.state.checkedMember = this.state.checkedMember.filter((v, i, a) => a.indexOf(v) === i);
        if (search) {
            axios.get(`${env.endpointURL}/users/search?keyword=${search}`, {
                headers: {
                    'Cookie': `jwt=${this.props.route.params.token}`,
                },
            })
                .then((res) => {
                    if (search && res.data.result.length == 0) {
                        this.setState({ data: [] })
                    } else {
                        let groupedData = groupBy(res.data.result, (x) => {
                            let value_exist = this.state.checkedMember.find((obj) => obj.id == x.id)
                            if (value_exist) {
                                x.checked = true;
                                x.number_of_leads = value_exist.number_of_leads
                            }
                            upperCase(x.first_name.charAt(0));
                            return;
                        });
                        let groupedDataList = map(groupedData, (v, k) => {
                            return { "title": k, "data": v }
                        });
                        this.setState({ data: groupedDataList })
                    }
                }).catch((error) => {
                    console.log(error);
                })
        } else {
            // this.setState({ data: dataArr })
            this.UserList();
        }
        this.setState({ search: search })
    }

    UserList() {
        axios.get(`${env.endpointURL}/users/chapterUsers/${this.props.route.params.chapter_id}`, {
            headers: {
                'Cookie': `jwt=${this.props.route.params.token}`,
            },
        }).then((res) => {
            let groupedData = groupBy(res.data, (x) => {
                let value_exist = this.state.checkedMember.find((obj) => obj.id == x.id)
                if (value_exist) {
                    x.checked = true;
                    x.number_of_leads = value_exist.number_of_leads
                }
                upperCase(x.first_name.charAt(0));
                return;
            });
            let groupedDataList = map(groupedData, (v, k) => {
                return { "title": k, "data": v }
            });
            this.setState({ data: groupedDataList })
            this.setState({ original: groupedDataList })
        }).catch(function (error) {
            console.log("error at users API in create lead screen", error.message)
        })
    }

    setModalVisible = (visible) => {
        this.setState({ modalVisible: visible });
    }

    setValidationMessage = (visible) => {
        this.setState({ ValidationMessage: visible });
    }

    onChecked(id) {
        const data = this.state.data
        for (let i = 0; i < data.length; i++) {
            for (let j = 0; j < data[i].data.length; j++) {
                const index = data[i].data.findIndex(x => x.id === id);
                if (index != -1) {
                    if (data[i].data[index].checked === true) {
                        data[i].data[index].checked = false
                        data[i].data[index].number_of_leads = 0
                        this.onSelected(0, data[i].data[index]);
                        this.state.checkedMember = this.state.checkedMember.filter((value) => value.id != id);
                        return this.setState({ data: data })
                    } else {
                        data[i].data[index].checked = true
                        data[i].data[index].number_of_leads = 1
                        this.onSelected(1, data[i].data[index]);
                        this.state.checkedMember.push(data[i].data[index]);
                        return this.setState({ data: data })
                    }
                }
            }
        }
    }

    onChange(member, number, type) {
        this.onSelected(number, member);
    }

    renderUserData() {
        // console.log("this.state.data", this.state.data);
        if (this.state.data.length == 0) {
            return (
                <View style={{ justifyContent: "center", alignItems: "center", marginTop: "80%" }}>
                    <Ionicons name={"people-outline"} size={25} color={colors.primary} />
                    <Text style={{ fontSize: height * 0.018, fontFamily: "SemiBold", color: colors.grey }}>No results found</Text>
                </View>
            )
        } else {
            return this.state.data.map((item, key) => {
                return item.data.map((item, key) => {
                    return (
                        <View style={{ flexDirection: "row", alignItems: "center", width: "100%" }}>
                            <TouchableOpacity key={item.id} onPress={() => { this.onChecked(item.id) }} style={{ flexDirection: "row", marginTop: "2%", alignItems: "center", width: "100%" }}>
                                <Checkbox value={item.checked} onValueChange={() => { this.onChecked(item.id) }} color={colors.primary} />
                                <View style={{ flexDirection: "row", alignItems: "center", marginLeft: "4%" }}>
                                    <Image style={{ height: 50, width: 50, backgroundColor: "#eee", borderRadius: 7 }} source={{ uri: item.profile_picture }} />
                                    <View style={{ backgroundColor: colors.primary, height: 23, width: 23, borderRadius: 40, left: -15, top: 18, borderWidth: 1.5, borderColor: "white", justifyContent: "center", alignItems: "center" }}>
                                        <Text style={{ color: "white", fontSize: height * 0.010 }}>#{item.roster_id}</Text>
                                    </View>
                                    <View style={{ left: -10, paddingVertical: "2%", width: "68%" }}>
                                        {/* <View style={{ flexDirection: "row" }}> */}
                                        {/* <Text style={{ fontFamily: "SemiBold", fontSize: height * 0.015, fontFamily: "SemiBold" }}>{item.id}.</Text> */}
                                        <Text style={{ fontFamily: "SemiBold", fontSize: height * 0.015, fontFamily: "SemiBold" }} ellipsizeMode='tail' numberOfLines={1}>{item.first_name + ' ' + item.last_name}</Text>
                                        <Text style={{ fontFamily: "SemiBold", fontSize: height * 0.012, color: colors.inactiveTab }} ellipsizeMode='tail' numberOfLines={1}>{item.category}</Text>
                                        <Text style={{ fontFamily: "SemiBold", fontSize: height * 0.014, color: colors.inactiveTab }} ellipsizeMode='tail' numberOfLines={1}>{item.firm_name}</Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        </View>
                    )
                })
            })
        }
    }

    renderUserList() {
        return this.state.selected.sort((a, b) => a.first_name !== b.first_name ? a.first_name < b.first_name ? -1 : 1 : 0).map((item, key) => {
            return (
                <View key={item.id} style={{ flexDirection: "row", alignItems: "center", width: "100%", paddingHorizontal: "4%" }}>
                    <View onPress={() => { this.onChecked(item.id) }} style={{ flexDirection: "row", marginTop: "2%", alignItems: "center", width: "100%", height: 60, borderWidth: 1.5, borderRadius: 10, borderColor: colors.grey, }}>
                        <View style={{ flexDirection: "row", alignItems: "center", marginLeft: "2%", padding: "2%", justifyContent: "space-between", width: "100%" }}>
                            <View style={{ flexDirection: "row", alignItems: "center", width: "55%" }}>
                                <Image source={{ uri: item.profile_picture }} style={{ borderRadius: 5, height: 35, width: 35 }} />
                                {/* <Text ellipsizeMode='tail' numberOfLines={1} style={{ marginLeft: "4%", fontFamily: "SemiBold", fontSize: height * 0.015, fontFamily: "SemiBold" }}>{item.full_name}</Text> */}
                                <Text style={{ fontFamily: "SemiBold", fontSize: height * 0.015, fontFamily: "SemiBold", marginLeft: "4%" }} ellipsizeMode='tail' numberOfLines={1}>{item.first_name + ' ' + item.last_name}</Text>
                            </View>
                            <View style={{ flexDirection: "row", marginRight: 10 }}>
                                <Counter start={1} min={1} max={10} onChange={this.onChange.bind(this, item)} countTextStyle={{ color: 'black' }} buttonStyle={{ borderColor: colors.primary }} buttonTextStyle={{ color: colors.primary }} />
                            </View>
                        </View>
                    </View>
                </View>
            )
        })
    }

    onSelected(value, member) {
        const selectedMembers = this.state.selectedMembers
        member.number_of_leads = value
        const member_exist = selectedMembers.find(x => x.id === member.id);
        if (!member_exist) selectedMembers.push(member)
        else {
            const newState = selectedMembers.map(member =>
                member.id === member_exist.id ? { ...member, number_of_leads: value } : member
            );
        }
        this.setState(selectedMembers)
    }

    onCheckedMembers(value, member) {
        const checkedMembers = this.state.checkedMember
        member.number_of_leads = value
        const member_exist = checkedMembers.find(x => x.id === member.id);
        if (!member_exist) checkedMembers.push(member)
        else {
            const newState = checkedMembers.map(member =>
                member.id === member_exist.id ? { ...member, checked: value } : member
            );
        }
        this.setState({ checkedMember: checkedMembers })
    }

    getSelectedUsers(button) {
        if (button == 'close') {
            var data = this.state.data
            for (let i = 0; i < data.length; i++) {
                for (let j = 0; j < data[i].data.length; j++) {
                    if (this.state.selected.find(x => x.id === data[i].data[j].id)) {
                        data[i].data[j].checked = true;
                        this.onCheckedMembers(true, data[i].data[j]);
                    } else {
                        data[i].data[j].checked = false;
                        this.onCheckedMembers(false, data[i].data[j]);
                    }
                }
            }
            this.setState({ data: data })
        } else {
            var data = this.state.data
            var Selected = this.state.checkedMember
            for (let i = 0; i < data.length; i++) {
                // var checks = data[i].data.map((t) => t.checked)
                // for (let j = 0; j < checks.length; j++) {
                //     if (checks[j] == true) {
                //         Selected.push(data[i].data[j])
                for (let j = 0; j < data[i].data.length; j++) {
                    if (data[i].data[j].checked) {
                        let value_exist = this.state.checkedMember.find((obj) => obj.id == data[i].data[j].id)
                        console.log("value", value_exist);
                        if (!value_exist) {
                            Selected.push(data[i].data[j])
                        }
                    }
                }
            }
            this.state.selected = Selected.filter((v, i, a) => a.indexOf(v) === i);
        }
        this.setValidationMessage(this.state.selected.length == 0 ? true : false)
    }

    UserData() {
        // if (this.props.route.params.userData) {
        //     var data = this.state.data
        //     for (let i = 0; i < data.length; i++) {
        //         for (let j = 0; j < data[i].data.length; j++) {
        //             const index = data[i].data.findIndex(x => x.id === this.props.route.params.userData.id);
        //             if (index != -1) {
        //                 if (data[i].data[index].checked === true) {
        //                     data[i].data[index].checked = false
        //                     return this.setState({ data: data })
        //                 } else {
        //                     data[i].data[index].checked = true
        //                     return this.setState({ data: data })
        //                 }
        //             }
        //         }
        //     }
        if (this.props.route.params.userData) {
            var array = [];
            var data = this.props.route.params.userData
            // console.log("userData123", data);
            data.checked = true
            data.full_name = data.first_name + ' ' + data.last_name
            data.isChecked = false
            data.number_of_leads = 1
            data.memberPage = true
            array.push(data);
            this.state.selected = array;
            // console.log("this.state", this.state.selected);
        }
    }

    render() {
        const { modalVisible } = this.state;
        return (
            <SafeAreaView style={styles.container} >
                <StatusBar backgroundColor={colors.primary} barStyle='light-content' />
                <View style={{ width: "100%" }}>
                    {this.props.route.params.userData ?
                        <View></View> :
                        <View style={styles.card}>
                            <View style={{ flexDirection: "row", marginTop: "2%" }}>
                                <Text style={{ fontFamily: "SemiBold" }}>Select Members</Text>
                                <Text style={{ fontFamily: "SemiBold", color: colors.danger }}>*</Text>
                            </View>
                            <TouchableOpacity style={styles.selector} onPress={() => this.setModalVisible(true)} >
                                <Text style={{ marginLeft: "4%", fontFamily: "Regular" }}>Select Members</Text>
                                <Ionicons name={"chevron-down-outline"} size={height * 0.03} color={colors.icon} style={{ marginRight: "2%" }} />
                            </TouchableOpacity>
                            {this.state.ValidationMessage ?
                                <Text style={{ marginTop: "2%", color: colors.danger, fontFamily: "Regular", }}>Member selection is required</Text>
                                : <Text />
                            }
                            <Modal
                                animationType="slide"
                                transparent={true}
                                visible={modalVisible}
                                onRequestClose={() => {
                                    this.setModalVisible(!modalVisible);
                                }}
                            >
                                <View style={styles.centeredView}>
                                    <View style={styles.modalView}>
                                        <View style={{ flexDirection: "row", justifyContent: "center" }}>
                                            <Text style={styles.modalText}>Select the members</Text>
                                            <TouchableOpacity onPress={() => { this.getSelectedUsers('close'); this.setModalVisible(false) }}>
                                                <Ionicons name={"close-outline"} size={height * 0.03} color={colors.icon} style={{ marginRight: "1%" }} />
                                            </TouchableOpacity>
                                        </View>

                                        <View style={styles.textInputStyle}>
                                            <Ionicons name="search" size={height * 0.03} color={colors.darkgrey} style={{ paddingRight: 10 }} />
                                            <TextInput
                                                style={{ flex: 1 }}
                                                value={this.state.search.toString()}
                                                placeholder="Search"
                                                selectionColor={colors.selector}
                                                underlineColorAndroid="transparent"
                                                onChangeText={(text) => this.searchFilter(text)}
                                            />
                                        </View>
                                        {/* {
                                        this.state.filterdData.length > 0 ?
                                            <FlatList
                                                data={this.state.filterdData}
                                                keyExtractor={(item) => item.id}
                                                renderItem={({ item }) =>
                                                    <MemberList image={item.profile_picture}
                                                        firstName={item.first_name} lastName={item.last_name} category={item.category}
                                                        firm_name={item.firm_name} id={item.id} rosterId={item.roster_id} />}
                                            />
                                            : */}
                                        <ScrollView>
                                            {this.renderUserData()}
                                        </ScrollView>


                                        <View style={{ flexDirection: "row", justifyContent: "space-evenly", width: "100%", marginTop: 15, }}>
                                            <CancelButton onPress={() => { this.getSelectedUsers('close'); this.setModalVisible(false) }} text={"Close"} />
                                            <ShortButton text={"Add"} onPress={() => { this.getSelectedUsers('add'); this.setModalVisible(false) }} />
                                        </View>

                                    </View>
                                </View>
                            </Modal>
                        </View>
                    }
                </View>

                <ScrollView>
                    {this.renderUserList()}
                </ScrollView>

                <View style={{ width: "100%", justifyContent: "center", alignItems: "center", marginBottom: "4%" }}>
                    {
                        this.state.selected.length > 0 ?
                            <LongButton text={"Next"} onPress={() => this.props.navigation.navigate("AddLead", {
                                selectedMembers: this.state.selected,
                            })} /> :
                            <LongButtonDisabled text={"Next"} onPress={() => this.setValidationMessage(this.state.selected.length > 0 ? false : true)} />
                    }
                </View>
            </SafeAreaView>
        )
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1, justifyContent: "space-between", alignItems: "center",
    },
    card: {
        backgroundColor: colors.white, paddingHorizontal: "4%", marginTop: "2%"
    },
    selector: {
        flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: "2%", width: "100%", height: height * 0.06, backgroundColor: colors.lightgrey, borderRadius: 10, borderColor: colors.grey, borderWidth: 1
    },
    footer: {
        width: "100%", justifyContent: "space-evenly", alignItems: "center", flexDirection: "row", marginBottom: "2%"
    },
    input: {
        width: "100%",
        borderWidth: 1,
        borderColor: colors.grey,
        borderRadius: 10,
        marginTop: "2%",
        padding: 10,
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22
    },
    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 15,
        width: "85%",
        height: "75%",
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
    button: {
        borderRadius: 20,
        margin: 3,
    },

    textStyle: {
        color: colors.black,
        fontSize: height * 0.022,
        fontFamily: "SemiBold",
        textAlign: "center"
    },
    modalText: {
        marginBottom: 15,
        textAlign: "center",
        fontFamily: "SemiBold",
        width: "90%",
    },
    checkbox: {
        margin: 8,
        borderRadius: 3
    },
    textInputStyle: {
        justifyContent: "flex-start",
        flexDirection: "row",
        alignItems: "center",
        textAlign: "center",
        height: 40,
        borderRadius: 4,
        paddingLeft: 10,
        // margin: "2%",
        marginBottom: "0%",
        borderColor: "#009688",
        backgroundColor: colors.lightgrey,
    },
})
