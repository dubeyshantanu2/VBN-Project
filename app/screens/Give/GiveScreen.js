import React, { useState, useEffect } from 'react'
import { ErrorMessage, Formik } from 'formik';
import * as yup from 'yup';
import { FlatList, Pressable, Alert, Modal, StatusBar, Image, Dimensions, SafeAreaView, View, Text, TouchableOpacity, StyleSheet, TextInput, ScrollView } from 'react-native';
import colors from '../../config/colors';
import ShortButton from '../../components/ShortButton';
import DisabledButton from '../../components/DisabledButton';
import RadioButton from 'react-native-radio-buttons-group';
import CancelButton from '../../components/CancelButton';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { CommonActions } from '@react-navigation/native';
import env from '../../config/env';

const { height } = Dimensions.get('window');

const radioButtonsData = [{
    id: '1', // acts as primary key, should be unique and non-empty string
    label: 'Ask',
    selected: true,
    value: 'ask',

}, {
    id: '2',
    label: 'Give',
    selected: false,
    value: 'give',

}]

const VisitorSchema = yup.object({
    description: yup.string().min(3, 'Description must be at least 3 characters long').required("Description is required"),
})

const GiveScreen = ({ navigation }) => {
    const [name, setName] = useState('')
    const [category, setCategory] = useState('')
    // const [description, setDescription] = useState('')
    const token = useSelector(state => state.AuthReducers.accessToken);
    const user_id = useSelector(state => state.AuthReducers.user_id);
    const [radioButtons, setRadioButtons] = useState(radioButtonsData);

    // console.log(radioButtonsData)

    function onPressRadioButton(radioButtonsArray) {
        setRadioButtons(radioButtonsArray);
    }

    const submit = (values) => {
        // var Descline = '';
        // var lines = description.split("\n");
        // for (var i = 0; i < lines.length; i++) {
        //     Descline += i == 0 ? lines[i].trim() : " " + lines[i].trim();
        // }
        axios({
            method: "POST",
            url: `${env.endpointURL}/asksgives`,
            headers: {
                'Cookie': `jwt=${token}`,
            },
            data: {
                "user_id": user_id,
                "name": name,
                "category": category,
                "description": values.description.replace(/\n/g, " "),
                "record_type": radioButtons.find(obj => obj.selected).value,
            }
        })
            .then(function (res) {
                navigation.dispatch(
                    CommonActions.navigate({
                        name: "OnDoneScreen",
                    })
                )
                console.log(res.data)
            })
            .catch(function (error) {
                console.log("error at Ask/ Give api", error.message)
            })
    }

    return (

        <SafeAreaView style={styles.container}>
            <StatusBar backgroundColor={colors.primary} barStyle='light-content' />
            <Formik
                initialValues={{ description: '' }}
                onSubmit={values => submit(values)}
                validationSchema={VisitorSchema}
            >
                {({ errors, touched, handleChange, handleBlur, handleSubmit, values }) => (
                    <>
                        <ScrollView style={{ width: "100%" }} keyboardDismissMode='on-drag'>
                            <View style={{ marginTop: "2%", marginBottom: "3%", width: "65%", marginLeft: "1%" }}>
                                <RadioButton
                                    radioButtons={radioButtons}
                                    onPress={onPressRadioButton}
                                    containerStyle={{
                                        alignItems: "flex-start",
                                        justifyContent: "space-between"
                                    }}
                                    color="#e10000"
                                    layout="row"
                                />
                            </View>
                            <View style={styles.card}>
                                {/* <Text style={{ fontFamily: "SemiBold" }}>Name*</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter name"
                        keyboardType="default"
                        autoCapitalize="words"
                        returnKeyType="done"
                        selectionColor={colors.selector}
                        textContentType="name"//only ios
                        onChangeText={(text) => setName(text)}
                        clearButtonMode="always" //only on IOS
                    /> */}

                                {/* <Text style={{ fontFamily: "SemiBold", marginTop: "4%" }}>Category*</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter category"
                        keyboardType="default"
                        autoCapitalize="words"
                        returnKeyType="done"
                        selectionColor={colors.selector}
                        textContentType="name"//only ios
                        onChangeText={(text) => setCategory(text)}
                        clearButtonMode="always" //only on IOS
                    /> */}
                                <View style={{ flexDirection: "row", marginTop: "4%" }}>
                                    <Text style={{ fontFamily: "SemiBold" }}>Description</Text>
                                    <Text style={{ fontFamily: "SemiBold", color: colors.danger }}>*</Text>
                                </View>
                                <TextInput
                                    style={styles.textArea}
                                    multiline={true}
                                    numberOfLines={10}
                                    placeholder="Add description"
                                    keyboardType="default"
                                    // autoCapitalize="words"
                                    returnKeyType="done"
                                    selectionColor={colors.selector}
                                    dataDetectorTypes="address" //only ios
                                    onChangeText={handleChange("description")}
                                    onBlur={handleBlur("description")}
                                    value={values.description}
                                    clearButtonMode="always" //only on IOS
                                />
                                <View style={{ marginVertical: "1%" }}>
                                    {
                                        errors.description && touched.description ? (
                                            <Text style={{ color: "red", fontSize: height * 0.015 }}>{errors.description}</Text>
                                        ) :
                                            <View style={{ height: height * 0.015 }} />
                                    }
                                </View>
                            </View>
                        </ScrollView>

                        <View style={{ flexDirection: "row", justifyContent: "space-evenly", width: "100%", marginBottom: "2%" }}>
                            <CancelButton onPress={() => navigation.navigate("PostScreen")} text={"Cancel"} />
                            <ShortButton onPress={handleSubmit} text={"Submit"} />
                        </View>
                    </>
                )}
            </Formik>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1, justifyContent: "space-between", alignItems: "center"
    },
    card: {
        paddingHorizontal: "4%"
    },
    selector: {
        flexDirection: "row", justifyContent: "center", alignItems: "center", marginTop: "2%", width: "100%", height: height * 0.06, backgroundColor: colors.white, borderRadius: 10, borderColor: colors.primary, borderWidth: 1
    },
    footer: {
        width: "100%", justifyContent: "space-evenly", alignItems: "center", flexDirection: "row", marginBottom: "2%"
    },
    input: {
        width: "100%",
        height: 250,
        textAlignVertical: 'top',
        borderWidth: 1,
        borderColor: colors.grey,
        borderRadius: 10,
        marginTop: "2%",
        padding: 10,
        justifyContent: "flex-start",
        paddingVertical: "5%",
    },
    textArea: {
        width: "100%",
        height: 200,
        textAlignVertical: 'top',
        borderWidth: 1,
        borderColor: colors.grey,
        borderRadius: 10,
        marginTop: "2%",
        padding: 10,
        justifyContent: "flex-start",
        paddingVertical: "5%",
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
        height: "80%",
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
        fontFamily: "SemiBold"
    },
    checkbox: {
        margin: 8,
        borderRadius: 3
    },
    input: {
        fontFamily: "SemiBold",
        width: "100%",
        borderWidth: 1,
        borderColor: colors.grey,
        borderRadius: 10,
        marginTop: "2%",
        padding: 10,
    },
})


export default GiveScreen;