import React, { useState, useEffect } from 'react'
import { StatusBar, Image, Modal, TouchableOpacity, Dimensions, SafeAreaView, StyleSheet, View, Text, TextInput, ScrollView, SectionList, ActivityIndicator } from 'react-native';
import { Formik } from 'formik';
import * as yup from 'yup';
import colors from '../config/colors';
import { Ionicons } from '@expo/vector-icons';
import ShortButton from '../components/ShortButton';
import DisabledButton from '../components/DisabledButton';
import CancelButton from '../components/CancelButton';
import { useSelector } from 'react-redux';
import RadioGroup from 'react-native-radio-buttons-group';
import MemberList from '../components/MemberList';
import axios from 'axios';
import SplashScreen from "../screens/SplashScreen";
import { CommonActions } from '@react-navigation/native';
import { map, upperCase, groupBy, filter, isEqual, size, forEach } from 'lodash';
import moment from 'moment';
import env from '../config/env';

const { height, width } = Dimensions.get('window');

const radioButtonsData = [
  {
    id: "2",
    option: "niraj ramakrishnan",
    date: "12-02-2022"
  },
]


const ThankyouScreen = ({ navigation, route }) => {
  const [current, setCurrent] = useState("test");
  const token = useSelector(state => state.AuthReducers.accessToken);
  const [name, setName] = useState('')
  const [mobile, setMobile] = useState('')
  const [email, setEmail] = useState('')
  const [amount, setAmount] = useState('')
  const [description, setDescription] = useState('')
  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisibleLead, setModalVisibleLead] = useState(false);
  const [userData, setUserData] = useState();
  const [userDataIcon, setUserDataIcon] = useState(false);
  const [originalData, setOriginalData] = useState();
  const [isLoaded, setIsLoaded] = useState(true);
  const [selected, Selected] = useState();
  const [userInDropDown, setUserDropDown] = useState(!route.params ? null : route.params.userData);
  const [leadInDropDown, setLeadDropDown] = useState();
  const user_id = useSelector(state => state.AuthReducers.user_id);
  const [search, setSearch] = useState('');
  const [radioButtons, setRadioButtons] = useState(radioButtonsData)
  const [recievedOpenLeads, setRecievedOpenLeads] = useState();
  const [userLeads, setUserLeads] = useState();
  const chapter_id = useSelector(state => state.AuthReducers.chapter_id);
  const [ValidationMessage, setValidationMessage] = useState(false);
  const [leadValidationMessage, setLeadValidationMessage] = useState(false);

  const getUserData = () => {
    axios({
      method: "GET",
      url: `${env.endpointURL}/users/chapterUsers/${chapter_id}`,
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
        setUserData(groupedDataList);
        setOriginalData(groupedDataList);
      })
      .catch(function (error) {
        console.log("error at chapter users API in ThankyouScreen memberscreen", error.message)
      })
  };


  useEffect(() => {
    getUserData();
    if (route.params && route.params.userData) {
      getUserLeads(route.params.userData)
    }
  }, []);

  const searchFilter = (search) => {
    if (search) {
      axios.get(`${env.endpointURL}/users/search?keyword=${search}`, {
        headers: {
          'Cookie': `jwt=${token}`,
        },
      })
        .then((res) => {
          if (search && res.data.result.length == 0) {
            setUserData()
            setUserDataIcon(true)
          } else {
            let groupedData = groupBy(res.data.result, (x) => {
              return (upperCase(x.first_name.charAt(0)));
            });
            let groupedDataList = map(groupedData, (v, k) => {
              return { "title": k, "data": v }
            });
            setUserData(groupedDataList);
            setUserDataIcon(false)
          }
        }).catch((error) => {
          console.log(error);
        })
    } else {
      // setUserData(originalData);
      getUserData();
      setUserDataIcon(false)
    }
    setSearch(search);
  }

  const VisitorSchema = yup.object({
    // description: yup.string().required("Description is required"),
    amount: yup.number().required("Amount is required"),
  })


  const submit = (values) => {
    // var Descline = '';
    // var lines = description.split("\n"); //multiLines contains your text
    // for (var i = 0; i < lines.length; i++) {
    //   Descline += i == 0 ? lines[i].trim() : " " + lines[i].trim();
    // }
    axios({
      method: "POST",
      url: `${env.endpointURL}/thankyounotes`,
      headers: {
        'Cookie': `jwt=${token}`,
      },
      data: {
        "thankyou_by_user_id": user_id,
        "thankyou_to_user_id": userInDropDown.id,
        "thankyou_amount": values.amount,
        "thankyou_description": values.description,
        "lead_id": leadInDropDown ? leadInDropDown.id : null
      }
    })
      .then(function (res) {
        console.log(res.data, route.params);
        if (leadInDropDown) changeLeadStatus(leadInDropDown, values.amount)
        route.params && route.params.userData ?
          navigation.dispatch(
            CommonActions.navigate({
              name: "OnDoneScreen",
              params: {
                id: route.params.userData.id
              },
            })
          ) :
          navigation.dispatch(
            CommonActions.navigate({
              name: "OnDoneScreen",
            })
          )
      })
      .catch(function (error) {
        console.log("error at Add visitor screen", error)
      })
  }

  const changeLeadStatus = (obj, amount) => {
    axios({
      method: "PUT",
      url: `${env.endpointURL}/leads/${obj.id}`,
      headers: {
        'Cookie': `jwt=${token}`,
      },
      data: {
        "id": obj.id,
        "status": "closed won",
        "updated_by": user_id,
        "thankyou_amount": amount
      }
    })
      .then(function (res) {
        console.log("res.data for lead", res.data);
      })
      .catch(function (error) {
        console.log("error at leads api leaddetails", error.message)
      });
  }

  const getUserLeads = (userData) => {
    axios({
      method: "GET",
      url: `${env.endpointURL}/leads?to_user=${user_id}&from_user=${userData.id}`,
      headers: {
        'Cookie': `jwt=${token}`,
      },
    })
      .then(function (res) {
        setUserLeads(res.data);
        setIsLoaded(false);
      })
      .catch(function (error) {
        console.log("error at leads api leaddetails", error.message)
      })

  };
  // console.log("!!", recievedOpenLeads, "!!");
  const onChecked = (userData) => {
    setUserDropDown(userData);
    getUserLeads(userData)
  }
  const functionCombined = (userData) => {
    onChecked(userData);
    setModalVisible(false);
    setValidationMessage(false);
  }

  const saveSelectedLead = (lead) => {
    setLeadDropDown(lead);
    setModalVisibleLead(false);
  }

  const renderUserData = () => {
    if (userDataIcon || !userData) {
      return (
        <View style={{ justifyContent: "center", alignItems: "center", marginTop: "80%" }}>
          <Ionicons name={"people-outline"} size={25} color={colors.primary} />
          <Text style={{ fontSize: height * 0.018, fontFamily: "SemiBold", color: colors.grey }}>No results found</Text>
        </View>
      )
    }
    // else if (isLoaded && !userData) {
    //   return (
    //     <View style={{ justifyContent: "center", alignItems: "center", height: "100%" }}>
    //       <ActivityIndicator size="large" color={colors.primary} />
    //     </View>
    //   );
    // }
    else {
      return userData.map((item, key) => {
        return item.data.map((item, key) => {
          return (
            <View style={{ flexDirection: "row", alignItems: "center", width: "100%" }}>
              <TouchableOpacity key={key} onPress={() => { functionCombined(item) }} style={{ flexDirection: "row", marginTop: "2%", alignItems: "center", width: "100%" }}>
                <View style={{ flexDirection: "row", alignItems: "center", marginLeft: "4%" }}>
                  {
                    item.profile_picture !== null ?
                      <Image style={{ height: 50, width: 50, backgroundColor: "#eee", borderRadius: 7 }} source={{ uri: item.profile_picture }} />
                      :
                      <Image source={require("../assets/images/profilepicture.png")} style={{ height: 50, width: 50, backgroundColor: "#eee", borderRadius: 7 }} />
                  }
                  <View style={{ backgroundColor: colors.primary, height: 23, width: 23, borderRadius: 40, left: -15, top: 18, borderWidth: 1.5, borderColor: "white", justifyContent: "center", alignItems: "center" }}>
                    <Text style={{ color: "white", fontSize: height * 0.010 }}>#{item.roster_id}</Text>
                  </View>
                  <View style={{ left: -10, width: "72%" }}>
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

  // if (!userData) {
  //   return <SplashScreen />;
  // } else {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={colors.primary} barStyle='light-content' />
      <Formik
        initialValues={{ amount: '', description: '' }}
        onSubmit={values => submit(values)}
        validationSchema={VisitorSchema}
      >
        {({ errors, touched, handleChange, handleBlur, handleSubmit, values }) => (
          <>
            <ScrollView style={{ width: "92%", height: "90%" }} keyboardDismissMode='on-drag' showsVerticalScrollIndicator={false} >

              <View style={{ flexDirection: "row", }}>
                <Text style={{ fontFamily: "SemiBold", }}>Select Member</Text>
                <Text style={{ fontFamily: "SemiBold", color: colors.danger }}>*</Text>
              </View>

              <TouchableOpacity style={styles.selector} onPress={() => route.params ? setModalVisible(false) : setModalVisible(true)} >
                {userInDropDown ?
                  <View style={{ flexDirection: "row", alignItems: "center", width: "90%" }}>
                    <Image style={{ marginLeft: "4%", height: 45, width: 45, backgroundColor: "#eee", borderRadius: 7 }} source={{ uri: userInDropDown.profile_picture }} />
                    <View style={{ backgroundColor: colors.primary, height: 23, width: 23, borderRadius: 40, left: -15, top: 15, borderWidth: 1.5, borderColor: "white", justifyContent: "center", alignItems: "center" }}>
                      <Text style={{ color: "white", fontSize: height * 0.010 }}>#{userInDropDown.roster_id}</Text>
                    </View>
                    <Text style={{ fontFamily: "Regular" }} ellipsizeMode='tail' numberOfLines={1}>{userInDropDown.first_name + ' ' + userInDropDown.last_name}</Text>
                  </View>
                  :
                  <>
                    <Text style={{ marginLeft: "4%", fontFamily: "Regular" }}>Select Member</Text>
                    <Ionicons name={"chevron-down-outline"} size={height * 0.03} color={colors.icon} style={{ marginRight: "2%" }} />
                  </>
                }

              </TouchableOpacity>
              {ValidationMessage && !userInDropDown ?
                <Text style={{ marginTop: "1%", color: "red", fontSize: height * 0.015 }}>Member selection is required</Text>
                : <Text />
              }
              <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                  setModalVisible(!modalVisible);
                }}>

                <View style={styles.centeredView}>
                  <View style={styles.modalView}>
                    <View style={{ flexDirection: "row", justifyContent: "center" }}>
                      <Text style={styles.modalText}>Select the member</Text>
                      <TouchableOpacity onPress={() => { setModalVisible(false); setValidationMessage(userInDropDown ? false : true) }}>
                        <Ionicons name={"close-outline"} size={height * 0.03} color={colors.icon} style={{ marginRight: "1%" }} />
                      </TouchableOpacity>
                    </View>

                    <View style={styles.textInputStyle}>
                      <Ionicons name="search" size={height * 0.03} color={colors.darkgrey} style={{ paddingRight: 10 }} />
                      <TextInput
                        style={{ flex: 1 }}
                        value={search}
                        placeholder="Search"
                        selectionColor={colors.selector}
                        onChangeText={(text) => searchFilter(text)}
                      />
                    </View>

                    <ScrollView>
                      {renderUserData()}
                    </ScrollView>

                  </View>
                </View>
              </Modal>

              {userInDropDown ?
                <Text style={{ fontFamily: "SemiBold", marginTop: "2%" }}>Select Lead:</Text> :
                <Text style={{ fontFamily: "SemiBold", marginTop: "2%", color: colors.lightgrey }}>Select Lead</Text>}

              <TouchableOpacity style={styles.selector} onPress={() => { userInDropDown ? setModalVisibleLead(true) : setModalVisible(false); setLeadValidationMessage(userInDropDown ? false : true) }} >
                {leadInDropDown ? <Text style={{ marginLeft: "4%", fontFamily: "Regular" }}>{leadInDropDown.lead_name}</Text>
                  :
                  <Text style={{ marginLeft: "4%", fontFamily: "Regular" }}>Select Lead</Text>
                }
                <Ionicons name={"chevron-down-outline"} size={height * 0.03} color={colors.icon} style={{ marginRight: "2%" }} />
              </TouchableOpacity>
              {leadValidationMessage && !userInDropDown ?
                <Text style={{ marginTop: "1%", color: "red", fontSize: height * 0.015 }}>Member must be selected</Text>
                : <Text />
              }

              <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisibleLead}
                onRequestClose={() => {
                  setModalVisibleLead(!modalVisibleLead);
                }}>

                <View style={styles.centeredView}>
                  <View style={styles.modalViewLead}>

                    <View style={{ flexDirection: "row", justifyContent: "center" }}>
                      <Text style={styles.modalText}>Select leads</Text>
                      <TouchableOpacity onPress={() => setModalVisibleLead(false)}>
                        <Ionicons name={"close-outline"} size={height * 0.03} color={colors.icon} style={{ marginRight: "1%" }} />
                      </TouchableOpacity>
                    </View>

                    <ScrollView style={{ width: "100%" }}>
                      {!userLeads ? (
                        <View style={{ justifyContent: "center", alignItems: "center", height: "100%" }}>
                          <ActivityIndicator size="large" color={colors.primary} />
                        </View>
                      ) : (
                        userLeads.length > 0 ?
                          userLeads.map((obj, key) =>
                            <TouchableOpacity key={key} onPress={() => { saveSelectedLead(obj) }}>
                              {/* {console.log("jkl", userLeads)} */}
                              {/* leadInDropDown == obj ? */}

                              <View style={[leadInDropDown == obj ? styles.selected : styles.unselected]}>
                                {/* <RadioGroup
                                    // key={obj.id}
                                    radioButtons={radioButtonsData}
                                  // onPress={obj => setRadioButtonData(obj)}
                                  /> */}
                                <View style={{ width: "66%", marginLeft: "4%" }}>
                                  <Text style={{ fontFamily: "Bold", fontSize: height * 0.016 }} ellipsizeMode='tail' numberOfLines={1}>{obj.lead_name}</Text>
                                  {/* <Text style={{ fontFamily: "Regular", fontSize: height * 0.017, marginTop: "1%" }}></Text> */}
                                </View>
                                <View >
                                  <Text style={{ fontFamily: "Bold", fontSize: height * 0.016 }}>{(moment(obj.created_at).format('DD-MM-YYYY'))}</Text>
                                  {/* <Text style={{ fontFamily: "Regular", fontSize: height * 0.017, marginTop: "1%" }}></Text> */}
                                </View>
                              </View>
                              {/* </View> */}

                              <View style={{ width: "100%", borderWidth: 0.75, marginVertical: "2%", borderColor: colors.lightgrey }} />
                              {/* </View> */}
                            </TouchableOpacity>
                          ) : <Text style={{ fontFamily: "Bold", fontSize: height * 0.028, textAlign: "center" }}>No Open Leads</Text>
                      )}
                    </ScrollView>

                  </View>
                </View>
              </Modal>

              <View style={{ flexDirection: "row", marginTop: "2%" }}>
                <Text style={{ fontFamily: "SemiBold" }}>Amount</Text>
                <Text style={{ fontFamily: "SemiBold", color: colors.danger }}>*</Text>
              </View>

              <TextInput
                style={styles.input}
                placeholder="Enter amount"
                keyboardType="number-pad"
                autoCapitalize="words"
                returnKeyType="done"
                selectionColor={colors.selector}
                textContentType="amount"//only ios
                onChangeText={handleChange("amount")}
                onBlur={handleBlur("amount")}
                value={values.amount}
                clearButtonMode="always" //only on IOS
              />
              <View style={{ marginVertical: "1%" }}>
                {
                  errors.amount && touched.amount ? (
                    <Text style={{ color: "red", fontSize: height * 0.015 }}>{errors.amount}</Text>
                  ) :
                    <View style={{ height: height * 0.015 }} />
                }
              </View>

              <Text style={{ fontFamily: "SemiBold", }}>Description</Text>
              <TextInput
                style={styles.textArea}
                multiline={true}
                placeholder="Enter comment"
                keyboardType="default"
                returnKeyType="done"
                selectionColor={colors.selector}
                // dataDetectorTypes="description" //only ios
                onChangeText={handleChange("description")}
                onBlur={handleBlur("description")}
                value={values.description}
                textContentType="addressCityAndState"//only ios
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
            </ScrollView>

            <View style={styles.footer}>
              <CancelButton onPress={() => navigation.navigate("PostScreen")} text="Cancel" />
              <ShortButton onPress={() => { handleSubmit(); setValidationMessage(userInDropDown ? false : true) }} text="Submit" color={colors.primary} />
            </View>
          </>
        )}
      </Formik>
    </SafeAreaView>
  )
  // }
}

const styles = StyleSheet.create({
  container: {
    flex: 1, paddingVertical: "4%", justifyContent: "space-between", alignItems: "center"
  },
  footer: {
    width: "100%", justifyContent: "space-evenly", alignItems: "center", flexDirection: "row"
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
  selector: {
    flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: "2%", width: "100%", height: height * 0.07, backgroundColor: colors.lightgrey, borderRadius: 10, borderColor: colors.grey, borderWidth: 1
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
  modalViewLead: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 15,
    width: "85%",
    // height: "75%",
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
  modalText: {
    marginBottom: 15,
    textAlign: "center",
    fontFamily: "SemiBold",
    width: "90%",
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
  unselected: {
    flexDirection: "row",
    height: 30,
    alignItems: "center"
  },
  selected: {
    flexDirection: "row",
    height: 30,
    alignItems: "center",
    backgroundColor: colors.lightgrey,
    borderRadius: 5,
  }
})

export default ThankyouScreen;
