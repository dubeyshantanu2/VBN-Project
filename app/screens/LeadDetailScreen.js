import React, { useState, useEffect } from 'react'
import { TouchableOpacity, StatusBar, Modal, View, ActivityIndicator, Image, Dimensions, SafeAreaView, Text, StyleSheet, ScrollView, TextInput } from 'react-native';
import colors from '../config/colors';
import LeadCardDetails from "../components/LeadCardDetails";
import { Transition, Transitioning } from 'react-native-reanimated';
import RadioGroup from 'react-native-radio-buttons-group';
import { Ionicons } from '@expo/vector-icons';
import LeadDetail from "../components/LeadDetail";
import ShortButton from '../components/ShortButton';
import DisabledButton from '../components/DisabledButton';
import CancelButton from '../components/CancelButton';
import axios from 'axios';
import { useSelector } from 'react-redux';
import moment from 'moment';
import { Menu, MenuOptions, MenuOption, MenuTrigger } from 'react-native-popup-menu';
import _ from 'lodash'
import * as Linking from 'expo-linking';
import ModalDropdown from 'react-native-modal-dropdown';
import DatePicker from 'react-native-neat-date-picker';
import Checkbox from 'expo-checkbox';
import env from '../config/env';
import { ButtonGroup } from "@rneui/themed";

const { height, width } = Dimensions.get('window');

const radioButtonsData = [{
  id: '1', // acts as primary key, should be unique and non-empty string
  label: 'Closed with Business Generated',
  value: 'Closed with Business Generated',

}, {
  id: '2',
  label: 'Closed without Business Generated',
  value: 'Closed without Business Generated',

}]

const transition = (
  <Transition.Together>
    <Transition.In type='fade' durationMs={200} />
    <Transition.Change />
    <Transition.Out type='fade' durationMs={200} />
  </Transition.Together>
);

const listTab = [
  {
    status: "Received"
  },
  {
    status: "Given"
  }
]

const leads = [
  {
    option: "Pending Approval"
  },
  {
    option: "Open"
  },
  {
    option: "Closed Won"
  },
  {
    option: "Closed Lost"
  },
]

const LeadDetailScreen = ({ route }) => {
  // console.log("Route.params!!", route.params)
  if (route.params.data) {
    var meetingdate = (moment(route.params.meeting_date).format('YYYY-MM-DD'))
    var lead_date = (moment(route.params.data[0].lead_details.created_at).format('YYYY-MM-DD'))
  }

  const ref = React.useRef();
  const [modalVisible, setModalVisible] = useState(false);
  const [rejectModalVisible, setRejectModalVisible] = useState(false);
  const token = useSelector(state => state.AuthReducers.accessToken);
  const [currentIndex, setCurrentIndex] = useState();
  const [ModalDropdownValue, setModalDropdownValue] = useState(null);
  const [ModalDropdownDescription, setModalDropdownDescription] = useState(null);
  const [ModalThankyouAmount, setModalThankyouAmount] = useState(null);
  const [ModalThankyouDescription, setModalThankyouDescription] = useState(null);
  const [icon, setIcon] = useState(null);
  const [givenPendingLeads, setGivenPendingLeads] = useState([]);
  const [givenOpenLeads, setGivenOpenLeads] = useState([]);
  const [givenClosedWonLeads, setGivenClosedWonLeads] = useState([]);
  const [givenClosedLostLeads, setGivenClosedLostLeads] = useState([]);
  const [recievedPendingLeads, setRecievedPendingLeads] = useState([]);
  const [recievedOpenLeads, setRecievedOpenLeads] = useState([]);
  const [recievedClosedWonLeads, setRecievedClosedWonLeads] = useState([]);
  const [recievedClosedLostLeads, setRecievedClosedLostLeads] = useState([]);
  const [isLoaded, setIsLoaded] = useState(true);
  const [isLoadedCheckBox, setIsLoadedCheckBox] = useState(true);
  const [radioButtonData, setRadioButtonData] = useState();
  const [status, setStatus] = useState('Received');
  const user_id = useSelector(state => state.AuthReducers.user_id);
  const [selector, setSelector] = useState(route.params.data ? `${lead_date}to${meetingdate}` : route.params.selector);
  const [selector1, setSelector1] = useState(0);
  const [LeadName, setLeadName] = useState(null);
  const [LeadPhoneNumber, setLeadPhoneNumber] = useState([]);
  const [LeadEmail, setLeadEmail] = useState(null);
  const [LeadDescription, setLeadDescription] = useState(null);
  const [name, setName] = useState('This Fortnight');
  const [fromDate, setfromDate] = useState('');
  const [toDate, settoDate] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  // const [selector, setSelector] = useState('thisfortnight');
  const [custom, setCustom] = useState('');
  const [username, setUserName] = useState();
  const [phone, setPhone] = useState();
  const [email, setEmail] = useState();
  const [formData, setFormData] = useState([]);
  const [radioButtons, setRadioButtons] = useState(radioButtonsData);

  function onPressRadioButton(radioButtonsArray) {
    setRadioButtons(radioButtonsArray);
  }

  const setStatusFilter = status => {
    setStatus(status)
  }
  const setLeadFilter = option => {
    setOption(option)
  }

  const [
    selectedIndex,
    setSelectedIndex
  ] = React.useState(1);
  const [
    selectedIndexes,
    setSelectedIndexes
  ] = React.useState([]);

  const [option, setOption] = useState(!route.params.data ? 'Pending Approval' : route.params.data.find(obj => obj.lead_details.status == "pending approval") ? 'Pending Approval' :
    route.params.data.find(obj => obj.lead_details.status == "open") ? 'Open' : route.params.data.find(obj => obj.lead_details.status == "closed won") ? 'Closed Won' : 'Closed Lost');

  if (route.params.data) {
    var obj = route.params.data.find(obj => obj.lead_details.status == "pending approval") ? route.params.data.find(obj => obj.lead_details.status == "pending approval") :
      route.params.data.find(obj => obj.lead_details.status == "open") ? route.params.data.find(obj => obj.lead_details.status == "open") :
        route.params.data.find(obj => obj.lead_details.status == "closed won") ? route.params.data.find(obj => obj.lead_details.status == "closed won") :
          route.params.data.find(obj => obj.lead_details.status == "closed lost")
    var IndexForPendnigApproval = obj.lead_details.status == 'pending approval' ? recievedPendingLeads.findIndex((object) => object.find((data) => data.id == obj.lead_details.id)) : -1
    var IndexForOpen = obj.lead_details.status == 'open' ? recievedOpenLeads.findIndex((object) => object.find((data) => data.id == obj.lead_details.id)) : -1
    var IndexForClosedWon = obj.lead_details.status == 'closed won' ? recievedClosedWonLeads.findIndex((object) => object.find((data) => data.id == obj.lead_details.id)) : -1
    var IndexForClosedLost = obj.lead_details.status == 'closed lost' ? recievedClosedLostLeads.findIndex((object) => object.find((data) => data.id == obj.lead_details.id)) : -1
  }

  useEffect(() => {
    axios({
      method: "GET",
      url: `${env.endpointURL}/leads?selector=${selector}`,
      headers: {
        'Cookie': `jwt=${token}`,
      },
    })
      .then(function (res) {
        setGivenPendingLeads(res.data.drillDownGivenData.penidngLeadsArr);
        setGivenOpenLeads(res.data.drillDownGivenData.openLeadsArr);
        setGivenClosedWonLeads(res.data.drillDownGivenData.closedWonLeadsArr);
        setGivenClosedLostLeads(res.data.drillDownGivenData.closedLostLeadsArr);
        setRecievedPendingLeads(res.data.drillDownRecData.penidngLeadsRecArr);
        setRecievedOpenLeads(res.data.drillDownRecData.openLeadsRecArr);
        setRecievedClosedWonLeads(res.data.drillDownRecData.closedWonLeadsRecArr);
        setRecievedClosedLostLeads(res.data.drillDownRecData.closedLostLeadsRecArr);
        setIsLoaded(false);
      })
      .catch(function (error) {
        console.log("error at leads api leaddetails", error.message)
      })

  }, [selector, selector1, route.params]);

  const acknowledgeCreate = (obj, status) => {
    if (!obj) return false
    setIsLoaded(false);
    axios({
      method: "PUT",
      url: `${env.endpointURL}/leads/${obj[0].id}`,
      headers: {
        'Cookie': `jwt=${token}`,
      },
      data: {
        "id": obj[0].id,
        "status": status,
        "thankyou_amount": status == 'open' ? null : ModalThankyouAmount,
        "updated_by": user_id
      }
    })
      .then(function (res) {
        setSelector1(selector1 => ++selector1)
        setIsLoaded(true);
        // console.log("res.data", res.data);
      })
      .catch(function (error) {
        console.log("error at leads api leaddetails", error.message)
      });
  }

  const rejectionSubmit = (obj) => {
    if (!obj) return false
    setIsLoaded(false);
    axios({
      method: "PUT",
      url: `${env.endpointURL}/leads/${obj[0].id}`,
      headers: {
        'Cookie': `jwt=${token}`,
      },
      data: {
        "id": obj[0].id,
        "status": "closed lost",
        "updated_by": user_id,
        "status_reason": ModalDropdownValue == 0 ? 'Not Interested' : ModalDropdownValue == 1 ? 'Did not respond' : 'Not a match to our service',
        "rejection_description": ModalDropdownDescription
      }
    })
      .then(function (res) {
        setSelector1(selector1 => ++selector1)
        setModalDropdownValue(null);
        setModalDropdownDescription(null);
        setIsLoaded(true);
        // console.log("res.data", res.data);
      })
      .catch(function (error) {
        console.log("error at leads api leaddetails", error.message)
      });
  }

  const givenPendingLeadUpdate = (obj) => {
    if (!obj) return false
    let lead_phone = (typeof (LeadPhoneNumber) == 'string' && !LeadPhoneNumber.startsWith('+91')) ? '+91' + LeadPhoneNumber :
      (typeof (LeadPhoneNumber) == 'number' && !JSON.stringify(LeadPhoneNumber).startsWith('+91')) ? '+91' + LeadPhoneNumber : LeadPhoneNumber
    setIsLoaded(false);
    axios({
      method: "PUT",
      url: `${env.endpointURL}/leads/${obj.id}`,
      headers: {
        'Cookie': `jwt=${token}`,
      },
      data: {
        "id": obj.id,
        "updated_by": user_id,
        "lead_name": LeadName ? LeadName : formData.find(x => x.field == "Name" && x.lead_id == obj.id) ?
          formData.find(x => x.field == "Name" && x.lead_id == obj.id).text : null,
        "lead_email": LeadEmail ? LeadEmail : formData.find(x => x.field == "Email" && x.lead_id == obj.id) ?
          formData.find(x => x.field == "Email" && x.lead_id == obj.id).text : null,
        "lead_phone_number": lead_phone ? lead_phone : formData.find(x => x.field == "Phone" && x.lead_id == obj.id) ?
          formData.find(x => x.field == "Phone" && x.lead_id == obj.id).text : null,
        "lead_description": LeadDescription ? LeadDescription : null,
      }
    })
      .then(function (res) {
        setSelector1(selector1 => ++selector1)
        setLeadName(null);
        setLeadPhoneNumber(null);
        setLeadEmail(null);
        setLeadDescription(null);
        setFormData([]);
        setIsLoaded(true);
        // console.log("res.data", res.data);
      })
      .catch(function (error) {
        console.log("error at leads api leaddetails", error.message)
      });
  }

  const thankyouSubmit = (obj) => {
    if (!obj) return false
    axios({
      method: "POST",
      url: `${env.endpointURL}/thankyounotes`,
      headers: {
        'Cookie': `jwt=${token}`,
      },
      data: {
        "thankyou_by_user_id": user_id,
        "lead_id": obj[0].id,
        "thankyou_to_user_id": obj[0].lead_by_user_id,
        "thankyou_amount": ModalThankyouAmount,
        "thankyou_description": ModalThankyouDescription,
      }
    })
      .then(function (res) {
        setSelector1(selector1 => ++selector1)
        setModalThankyouAmount(null);
        setModalThankyouDescription(null);
        // console.log("res.data", res.data);
      })
      .catch(function (error) {
        console.log("error at leads api leaddetails", error.message)
      });
  }
  const currentDate = new Date()
  const NewDate = moment(currentDate, 'DD-MM-YYYY')
  const colorOptions = {
    headerColor: colors.primary,
    backgroundColor: colors.white,
    selectedDateColor: colors.primary
  }

  const openDatePicker = () => {
    setShowDatePicker(true)
  }

  const onCancel = () => {
    setShowDatePicker(false)
  }

  const onConfirm = (output) => {
    const { startDate, startDateString, endDate, endDateString } = output
    setShowDatePicker(false)
    setfromDate(startDateString)
    settoDate(endDateString)
    setCustom(startDateString + 'to' + endDateString)
  }

  useEffect(() => {
    axios({
      method: "GET",
      url: `${env.endpointURL}/users/${user_id}`,
      headers: {
        'Cookie': `jwt=${token}`
      },
    })
      .then(function (res) {
        setUserName(res.data.data.first_name + ' ' + res.data.data.last_name);
        setPhone(res.data.data.mobile)
        setEmail(res.data.data.email)
      })
      .catch(function (error) {
        console.log("error at members profile edit", error.message)
      })
  }, []);

  const collectDataforSelfLead = (index, data_exist, lead_id) => {
    for (let i = 0; i < formData.length; i++) {
      if (formData[i].index == index && formData[i].lead_id == lead_id) {
        delete formData[i]
      }
    }
    if (formData.length == 0 || !data_exist) {
      formData.push({ index: index, field: "Name", text: username, lead_id: lead_id })
      formData.push({ index: index, field: "Email", text: email, lead_id: lead_id })
      formData.push({ index: index, field: "Phone", text: phone, lead_id: lead_id })
      formData.push({ index: index, field: "Description", text: "", lead_id: lead_id })
    }
    setIsLoadedCheckBox(isLoadedCheckBox ? false : true);
    return setFormData(formData.filter(val => val !== undefined));
  }

  const formatter = new Intl.NumberFormat('en-IN', {
    minimumFractionDigits: 0,
  });

  return (
    <SafeAreaView style={{ height: "90%" }}>
      <StatusBar backgroundColor={colors.primary} barStyle='light-content' />
      {isLoaded ? (
        <View style={{ justifyContent: "center", alignItems: "center", height: "100%" }}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <>
          <Menu style={{ justifyContent: "center", alignItems: "center", marginLeft: "60%", marginTop: "2%" }}>
            <MenuTrigger style={{ flexDirection: "row", width: 120, justifyContent: "flex-end", padding: '1%', marginRight: "3%", alignItems: "center" }}>
              <Ionicons name={"calendar-outline"} size={height * 0.017} style={{ marginRight: "3%" }} color={colors.black} />
              <Text style={{ fontFamily: "SemiBold", fontSize: height * 0.016, marginRight: "3%" }}>{name}</Text>
              <Ionicons name={"caret-down-outline"} size={height * 0.017} style={{}} color={colors.black} />
            </MenuTrigger>

            <MenuOptions optionsContainerStyle=
              {{ marginTop: 20, padding: 8, width: height * 0.16 }} >
              <MenuOption value="all" onSelect={(value) => { setSelector(value), setName('All') }} >
                <Text style={{ fontFamily: "SemiBold" }}>All</Text>
              </MenuOption>
              <MenuOption value="thisfortnight" onSelect={(value) => { setSelector(value), setName('This Fortnight') }} >
                <Text style={{ fontFamily: "SemiBold" }}>This Fortnight</Text>
              </MenuOption>
              <MenuOption value="custom" onSelect={(value) => { setSelector(custom), setName('Custom'), openDatePicker() }} >
                <Text style={{ fontFamily: "SemiBold" }}>Custom</Text>
              </MenuOption>
            </MenuOptions>
          </Menu>

          <DatePicker
            isVisible={showDatePicker}
            mode={'range'}
            startDate={new Date(NewDate)}
            endDate={new Date(NewDate) - 1}
            colorOptions={colorOptions}
            onCancel={onCancel}
            onConfirm={onConfirm}
            maxDate={new Date(NewDate)}
          />
          <View style={styles.listTab}>
            {
              !route.params.selector ? null :
                listTab.map(e => (
                  <TouchableOpacity
                    style={[styles.btnTab, status === e.status && styles.btnTabActive]}
                    onPress={() => setStatusFilter(e.status)}>
                    <Text style={[styles.textTab, status === e.status && styles.textTabActive]}>{e.status}</Text>
                  </TouchableOpacity>
                ))
            }
          </View>


          {/* API integration for Button group yet to be done */}
          {/* <ButtonGroup
            buttonStyle={{ width: "100%", height: 20 }}
            buttonContainerStyle={{}}
            buttons={["Received", "Given"]}
            containerStyle={{ borderRadius: 8 }}
            disabled={[3, 4]}
            disabledStyle={{}}
            disabledTextStyle={{}}
            disabledSelectedStyle={{}}
            disabledSelectedTextStyle={{}}
            innerBorderStyle={{}}
            onPress={selectedIdx =>
              setSelectedIndex(selectedIdx)
            }
            // onPress={selectedIdx => setStatusFilter(selectedIdx)}
            selectedButtonStyle={{ backgroundColor: colors.primary }}
            selectedIndex={selectedIndex}
            selectedIndexes={selectedIndexes}
            selectedTextStyle={{ fontFamily: "SemiBold", }}
            textStyle={{ fontFamily: "SemiBold", }}
          /> */}

          <View style={styles.listTab}>
            {
              leads.map(e => (
                <TouchableOpacity
                  style={[styles.btnTab1, option === e.option && styles.btnTabActive]}
                  onPress={() => setLeadFilter(e.option)}>
                  <Text style={[styles.textTab, option === e.option && styles.textTabActive]}>{e.option}</Text>
                </TouchableOpacity>
              ))
            }
          </View>

          {/* <ButtonGroup
            buttonStyle={{ width: "100%", height: 20 }}
            buttonContainerStyle={{}}
            buttons={["Pending Approval", "Open", "Closed", "Closed Won", "Closed Lost"]}
            containerStyle={{ borderRadius: 8 }}
            disabled={[3, 4]}
            disabledStyle={{}}
            disabledTextStyle={{}}
            disabledSelectedStyle={{}}
            disabledSelectedTextStyle={{}}
            innerBorderStyle={{}}
            onPress={selectedIdx =>
              setSelectedIndex(selectedIdx)
            }
            selectedButtonStyle={{ backgroundColor: colors.primary }}
            selectedIndex={selectedIndex}
            selectedIndexes={selectedIndexes}
            selectedTextStyle={{ fontFamily: "SemiBold", fontSize: 10 }}
            textStyle={{ fontFamily: "SemiBold", fontSize: 10 }}
          /> */}

          <View style={{ width: "100%", height: "100%", marginBottom: "2%" }}>
            {
              option === 'Pending Approval' && status === 'Given'
                ?
                <>
                  <Transitioning.View
                    ref={ref}
                    transition={transition}
                    style={{ width: "100%", height: "92%", }}
                  >
                    <ScrollView style={styles.container}>
                      {givenPendingLeads.map((data, index) =>
                        <TouchableOpacity style={{ flexGrow: 1 }} key={index} activeOpacity={0.9}
                          onPress={() => {
                            ref.current.animateNextTransition();
                            setCurrentIndex(index === currentIndex ? null : index);
                            // setIcon(member);
                          }}>
                          <View style={{ flexDirection: "row", height: height * 0.08, borderRadius: 10, borderColor: colors.lightgrey, backgroundColor: colors.grey, borderWidth: 1, justifyContent: "space-between", alignItems: "center", marginVertical: "2%" }}>
                            <View style={{ flexDirection: "row", marginLeft: "3%", alignItems: "center" }}>
                              <Image style={{ height: 50, width: 50, backgroundColor: "#eee", borderRadius: 7 }} source={{ uri: data[0].profile_pic }} />
                              <View style={{ backgroundColor: colors.primary, height: 23, width: 23, borderRadius: 40, left: -15, top: 18, borderWidth: 1.5, borderColor: "white", justifyContent: "center", alignItems: "center" }}>
                                <Text style={{ color: "white", fontSize: height * 0.010 }}>#{data[0].roster_id}</Text>
                              </View>
                              <View style={{ flexDirection: "row", width: "65%", left: -10 }}>
                                <Text style={{ marginLeft: "2%" }} ellipsizeMode='tail' numberOfLines={1}>{data[0].user_name}</Text>
                              </View>
                            </View>

                            <View style={{ flexDirection: "row", marginRight: "2%", left: -40 }}>
                              <View style={{ backgroundColor: colors.white, alignItems: "center", flexDirection: "row", marginRight: "5%", paddingVertical: 3, paddingHorizontal: 20, borderRadius: 5 }}>
                                <Text>{data.length}</Text>
                              </View>
                              {
                                index === currentIndex ? <Ionicons name={"chevron-up-outline"} size={height * 0.03} color={colors.icon} />
                                  : <Ionicons name={"chevron-down-outline"} size={height * 0.03} color={colors.icon} />
                              }
                            </View>
                          </View>
                          {index === currentIndex && (
                            <View style={styles.content}>
                              {data.map((obj, index) =>
                                <>
                                  <TouchableOpacity >
                                    <View style={{ flexDirection: "row", width: "100%", marginTop: "2%" }}>
                                      <Checkbox color={"#00AEF2"} style={{ marginLeft: "74%" }}
                                        value={formData.some(x => x.index === index && x.lead_id == obj.id)}
                                        onValueChange={() => { collectDataforSelfLead(index, formData.some(x => x.index === index && x.lead_id == obj.id), obj.id) }} />
                                      <Text style={{ fontSize: height * 0.017, fontFamily: "Bold", color: "#00AEF2", marginLeft: "2%" }}>Self Lead</Text>
                                    </View>
                                  </TouchableOpacity>
                                  <View style={{
                                    marginTop: "2%", borderRadius: 10, borderWidth: 1, borderColor: colors.lightgrey, paddingVertical: 10, padding: "4%"
                                  }}>
                                    <View style={{ width: "100%", marginTop: "2%" }}>
                                      <Text style={{ fontSize: height * 0.017, fontFamily: "Bold", marginTop: "2%" }}>Enter Name*</Text>
                                      <TextInput selectionColor={colors.selector} placeholder={obj.lead_name} onChangeText={(text) => setLeadName(text)} style={{ fontSize: height * 0.017, marginTop: "1%", borderBottomColor: colors.lightgrey, borderBottomWidth: 1, }}
                                        value={formData.find(x => x.index === index && x.field == "Name" && x.lead_id == obj.id) ?
                                          formData.find(x => x.index === index && x.field == "Name" && x.lead_id == obj.id).text : null} />
                                    </View>
                                    <View style={{ width: "100%", marginTop: "2%" }}>
                                      <View style={{ flexDirection: "row", alignItems: "center" }}>
                                        <Text style={{ fontSize: height * 0.017, fontFamily: "Bold", marginTop: "2%" }}>Phone*</Text>
                                      </View>
                                      <View style={{ flexDirection: "row", alignItems: "center", width: "100%" }}>
                                        <TextInput selectionColor={colors.selector} keyboardType={"number-pad"} maxLength={10} placeholder={obj.lead_phone_number} onChangeText={(text) => setLeadPhoneNumber(text)} style={{ fontSize: height * 0.017, marginTop: "1%", borderBottomColor: colors.lightgrey, borderBottomWidth: 1, width: "100%" }}
                                          value={formData.find(x => x.index === index && x.field == "Phone" && x.lead_id == obj.id) ?
                                            formData.find(x => x.index === index && x.field == "Phone" && x.lead_id == obj.id).text : null} />
                                      </View>
                                    </View>
                                    <View style={{ flexDirection: "row", marginTop: "2%" }}>
                                      <View style={{ width: "100%" }}>
                                        <Text style={{ fontSize: height * 0.017, fontFamily: "Bold", marginTop: "2%" }}>Email (optional)</Text>
                                        <TextInput selectionColor={colors.selector} placeholder={obj.lead_email} onChangeText={(text) => setLeadEmail(text)} style={{ fontSize: height * 0.017, marginTop: "1%", borderBottomColor: colors.lightgrey, borderBottomWidth: 1, }}
                                          value={formData.find(x => x.index === index && x.field == "Email" && x.lead_id == obj.id) ?
                                            formData.find(x => x.index === index && x.field == "Email" && x.lead_id == obj.id).text : null} />
                                      </View>
                                    </View>
                                    <View style={{ flexDirection: "row", marginTop: "2%" }}>
                                      <View style={{ width: "100%" }}>
                                        <Text style={{ fontSize: height * 0.017, fontFamily: "Bold", marginTop: "2%" }}>Description</Text>
                                        <TextInput selectionColor={colors.selector} placeholder={obj.lead_description} onChangeText={(text) => setLeadDescription(text)} multiline={true} style={{ fontSize: height * 0.017, marginTop: "1%", borderBottomColor: colors.lightgrey, borderBottomWidth: 1, }} />
                                      </View>
                                    </View>
                                    <View style={{ marginTop: "2%" }}>
                                      {
                                        (LeadPhoneNumber && LeadName) || (formData.some(x => x.index === index && x.lead_id == obj.id)) ?
                                          <ShortButton onPress={() => givenPendingLeadUpdate(obj)} text={"Save"} />
                                          :
                                          <DisabledButton text={"Save"} />
                                      }
                                    </View>
                                  </View>
                                </>
                              )}
                            </View>
                          )}
                        </TouchableOpacity>
                      )}
                    </ScrollView>
                  </Transitioning.View>
                </>
                :
                option === 'Open' && status === 'Given'
                  ?
                  <>
                    <Transitioning.View
                      ref={ref}
                      transition={transition}
                      style={{ width: "100%", height: "92%", }}
                    >
                      <ScrollView style={styles.container}>
                        {givenOpenLeads.map((data, index) =>
                          <TouchableOpacity style={{ flexGrow: 1 }} key={index} activeOpacity={0.9}
                            onPress={() => {
                              ref.current.animateNextTransition();
                              setCurrentIndex(index === currentIndex ? null : index);
                              // setIcon(member);
                            }}>
                            <View style={{ flexDirection: "row", height: height * 0.08, borderRadius: 10, borderColor: colors.lightgrey, backgroundColor: colors.grey, borderWidth: 1, justifyContent: "space-between", alignItems: "center", marginVertical: "2%" }}>
                              <View style={{ flexDirection: "row", marginLeft: "3%", alignItems: "center" }}>
                                <Image style={{ height: 50, width: 50, backgroundColor: "#eee", borderRadius: 7 }} source={{ uri: data[0].profile_pic }} />
                                <View style={{ backgroundColor: colors.primary, height: 23, width: 23, borderRadius: 40, left: -15, top: 18, borderWidth: 1.5, borderColor: "white", justifyContent: "center", alignItems: "center" }}>
                                  <Text style={{ color: "white", fontSize: height * 0.010 }}>#{data[0].roster_id}</Text>
                                </View>
                                <View style={{ flexDirection: "row", width: "65%", left: -10 }}>
                                  <Text ellipsizeMode='tail' numberOfLines={1} style={{ marginLeft: "2%" }}>{data[0].user_name}</Text>
                                </View>
                              </View>
                              <View style={{ flexDirection: "row", marginRight: "2%", left: -40 }}>
                                <View style={{ backgroundColor: colors.white, alignItems: "center", flexDirection: "row", marginRight: "5%", paddingVertical: 3, paddingHorizontal: 20, borderRadius: 5 }}>
                                  <Text>{data.length}</Text>
                                </View>
                                {
                                  index === currentIndex ? <Ionicons name={"chevron-up-outline"} size={height * 0.03} color={colors.icon} />
                                    : <Ionicons name={"chevron-down-outline"} size={height * 0.03} color={colors.icon} />
                                }
                              </View>
                            </View>
                            {index === currentIndex && (
                              <View style={styles.content}>
                                {data.map((obj, index) =>
                                  <>
                                    <View style={{
                                      marginTop: "2%", borderRadius: 10, borderWidth: 1, borderColor: colors.lightgrey, paddingVertical: 10, padding: "4%"
                                    }}>
                                      <View style={{ width: "100%", marginTop: "2%" }}>
                                        <Text style={{ fontSize: height * 0.017, fontFamily: "Bold", marginTop: "2%" }}>Description</Text>
                                        <Text style={{ fontSize: height * 0.017, fontFamily: "Regular", marginTop: "2%" }}>{obj.lead_description}</Text>
                                      </View>
                                      <View style={{ flexDirection: "row", width: "100%" }}>
                                        <View style={{ width: "65%" }}>
                                          <Text style={{ fontFamily: "Bold" }}>Name</Text>
                                          <Text style={{ fontFamily: "Regular", fontSize: height * 0.017, marginTop: "1%" }}>{obj.lead_name}</Text>
                                        </View>
                                        <View>
                                          <Text style={{ fontFamily: "Bold" }}>Date</Text>
                                          <Text style={{ fontFamily: "Regular", fontSize: height * 0.017, marginTop: "1%" }}>{(moment(obj.created_at).format('DD-MM-YYYY'))}</Text>
                                        </View>
                                      </View>
                                      <View style={{ flexDirection: "row", width: "100%", marginTop: "2%" }}>
                                        <View style={{ width: "65%" }}>
                                          <Text style={{ fontFamily: "Bold" }}>Email</Text>
                                          <Text style={{ fontFamily: "Regular", fontSize: height * 0.017, marginTop: "1%", color: "#58befc" }}>{obj.lead_email}</Text>
                                        </View>
                                        <View>
                                          <Text style={{ fontFamily: "Bold" }}>Phone</Text>
                                          <Text style={{ fontFamily: "Regular", fontSize: height * 0.017, marginTop: "1%", color: "#58befc" }}>{obj.lead_phone_number}</Text>
                                        </View>
                                      </View>
                                    </View>
                                  </>
                                )}
                              </View>
                            )}
                          </TouchableOpacity>
                        )}
                      </ScrollView>
                    </Transitioning.View>
                  </>
                  :
                  option === 'Closed Won' && status === 'Given'
                    ?
                    <Transitioning.View
                      ref={ref}
                      transition={transition}
                      style={{ width: "100%", height: "92%", }}
                    >
                      <ScrollView style={styles.container}>
                        {givenClosedWonLeads.map((data, index) =>
                          <TouchableOpacity style={{ flexGrow: 1 }} key={index} activeOpacity={0.9}
                            onPress={() => {
                              ref.current.animateNextTransition();
                              setCurrentIndex(index === currentIndex ? null : index);
                              // setIcon(member);
                            }}>
                            <View style={{ flexDirection: "row", height: height * 0.08, borderRadius: 10, borderColor: colors.lightgrey, backgroundColor: colors.grey, borderWidth: 1, justifyContent: "flex-start", alignItems: "center", marginVertical: "2%" }}>
                              <View style={{ flexDirection: "row", marginLeft: "3%" }}>
                                <Image style={{ height: 50, width: 50, backgroundColor: "#eee", borderRadius: 7 }} source={{ uri: data[0].profile_pic }} />
                                <View style={{ backgroundColor: colors.primary, height: 23, width: 23, borderRadius: 40, left: -15, top: 30, borderWidth: 1.5, borderColor: "white", justifyContent: "center", alignItems: "center" }}>
                                  <Text style={{ color: "white", fontSize: height * 0.010 }}>#{data[0].roster_id}</Text>
                                </View>
                                <View style={{ flexDirection: "row", left: -10, alignItems: "center", width: "62%" }}>
                                  <Text style={{ marginLeft: "2%" }} ellipsizeMode='tail' numberOfLines={1}>{data[0].user_name}</Text>
                                </View>
                              </View>
                              <View style={{ flexDirection: "row", width: "20%", left: -35 }}>
                                <View style={{ backgroundColor: "green", borderRadius: 5, paddingRight: 10, justifyContent: "flex-start" }}>
                                  <View style={{ backgroundColor: colors.white, alignItems: "center", flexDirection: "row", paddingVertical: 6, paddingHorizontal: 20, borderRadius: 5 }}>
                                    <Text>{data.length}</Text>
                                  </View>
                                </View>
                                {
                                  index === currentIndex ? <Ionicons name={"chevron-up-outline"} size={height * 0.03} color={colors.icon} />
                                    : <Ionicons name={"chevron-down-outline"} size={height * 0.03} color={colors.icon} />
                                }
                              </View>
                            </View>
                            {index === currentIndex && (
                              <View style={styles.content}>
                                {data.map((obj, index) =>
                                  <>
                                    <View style={{
                                      marginTop: "2%", borderRadius: 10, borderWidth: 1, borderColor: colors.lightgrey, paddingVertical: 10, padding: "4%"
                                    }}>
                                      <View style={{ width: "100%", marginTop: "2%" }}>
                                        <Text style={{ fontSize: height * 0.017, fontFamily: "Bold", marginTop: "2%" }}>Description</Text>
                                        <Text style={{ fontSize: height * 0.017, fontFamily: "Regular", marginTop: "2%" }}>{obj.lead_description}</Text>
                                      </View>
                                      <View style={{ flexDirection: "row", width: "100%" }}>
                                        <View style={{ width: "65%" }}>
                                          <Text style={{ fontFamily: "Bold" }}>Name</Text>
                                          <Text style={{ fontFamily: "Regular", fontSize: height * 0.017, marginTop: "1%" }}>{obj.lead_name}</Text>
                                        </View>
                                        <View>
                                          <Text style={{ fontFamily: "Bold" }}>Date</Text>
                                          <Text style={{ fontFamily: "Regular", fontSize: height * 0.017, marginTop: "1%" }}>{(moment(obj.created_at).format('DD-MM-YYYY'))}</Text>
                                        </View>
                                      </View>
                                      <View style={{ flexDirection: "row", width: "100%", marginTop: "2%" }}>
                                        <View style={{ width: "65%" }}>
                                          <Text style={{ fontFamily: "Bold" }}>Email</Text>
                                          <Text style={{ fontFamily: "Regular", fontSize: height * 0.017, marginTop: "1%", color: "#58befc" }}>{obj.lead_email}</Text>
                                        </View>
                                        <View>
                                          <Text style={{ fontFamily: "Bold" }}>Phone</Text>
                                          <Text style={{ fontFamily: "Regular", fontSize: height * 0.017, marginTop: "1%", color: "#58befc" }}>{obj.lead_phone_number}</Text>
                                        </View>
                                      </View>
                                      <View style={{ flexDirection: "row", width: "100%", marginTop: "2%", alignItems: "center" }}>
                                        <Text style={{ fontFamily: "Bold" }}>Thank You Amount: </Text>
                                        <Text style={{ fontFamily: "Regular", fontSize: height * 0.017 }}>{obj.thankyou_amount ? formatter.format(obj.thankyou_amount) + '' + '/-' : null}</Text>
                                      </View>
                                    </View>
                                  </>
                                )}
                              </View>
                            )}
                          </TouchableOpacity>
                        )}
                      </ScrollView>
                    </Transitioning.View>
                    :
                    option === 'Closed Lost' && status === 'Given'
                      ?
                      <Transitioning.View
                        ref={ref}
                        transition={transition}
                        style={{ width: "100%", height: "92%", }}
                      >
                        <ScrollView style={styles.container}>
                          {givenClosedLostLeads.map((data, index) =>
                            <TouchableOpacity style={{ flexGrow: 1 }} key={index} activeOpacity={0.9}
                              onPress={() => {
                                ref.current.animateNextTransition();
                                setCurrentIndex(index === currentIndex ? null : index);
                                // setIcon(member);
                              }}>
                              <View style={{ flexDirection: "row", height: height * 0.08, borderRadius: 10, borderColor: colors.lightgrey, backgroundColor: colors.grey, borderWidth: 1, justifyContent: "flex-start", alignItems: "center", marginVertical: "2%" }}>
                                <View style={{ flexDirection: "row", marginLeft: "3%" }}>
                                  <Image style={{ height: 50, width: 50, backgroundColor: "#eee", borderRadius: 7 }} source={{ uri: data[0].profile_pic }} />
                                  <View style={{ backgroundColor: colors.primary, height: 23, width: 23, borderRadius: 40, left: -15, top: 30, borderWidth: 1.5, borderColor: "white", justifyContent: "center", alignItems: "center" }}>
                                    <Text style={{ color: "white", fontSize: height * 0.010 }}>#{data[0].roster_id}</Text>
                                  </View>
                                  <View style={{ flexDirection: "row", left: -10, alignItems: "center", width: "62%" }}>
                                    <Text style={{ marginLeft: "2%" }} ellipsizeMode='tail' numberOfLines={1}>{data[0].user_name}</Text>
                                  </View>
                                </View>
                                <View style={{ flexDirection: "row", width: "20%", left: -35 }}>
                                  <View style={{ backgroundColor: "red", borderRadius: 5, paddingRight: 10, justifyContent: "flex-start" }}>
                                    <View style={{ backgroundColor: colors.white, alignItems: "center", flexDirection: "row", paddingVertical: 6, paddingHorizontal: 20, borderRadius: 5 }}>
                                      <Text>{data.length}</Text>
                                    </View>
                                  </View>
                                  {
                                    index === currentIndex ? <Ionicons name={"chevron-up-outline"} size={height * 0.03} color={colors.icon} />
                                      : <Ionicons name={"chevron-down-outline"} size={height * 0.03} color={colors.icon} />
                                  }
                                </View>
                              </View>
                              {index === currentIndex && (
                                <View style={styles.content}>
                                  {data.map((obj, index) =>
                                    <>
                                      <View style={{
                                        marginTop: "2%", borderRadius: 10, borderWidth: 1, borderColor: colors.lightgrey, paddingVertical: 10, padding: "4%"
                                      }}>
                                        <View style={{ width: "100%", marginTop: "2%" }}>
                                          <Text style={{ fontSize: height * 0.017, fontFamily: "Bold", marginTop: "2%" }}>Description</Text>
                                          <Text style={{ fontSize: height * 0.017, fontFamily: "Regular", marginTop: "2%" }}>{obj.lead_description}</Text>
                                        </View>
                                        <View style={{ flexDirection: "row", width: "100%" }}>
                                          <View style={{ width: "65%" }}>
                                            <Text style={{ fontFamily: "Bold" }}>Name</Text>
                                            <Text style={{ fontFamily: "Regular", fontSize: height * 0.017, marginTop: "1%" }}>{obj.lead_name}</Text>
                                          </View>
                                          <View>
                                            <Text style={{ fontFamily: "Bold" }}>Date</Text>
                                            <Text style={{ fontFamily: "Regular", fontSize: height * 0.017, marginTop: "1%" }}>{(moment(obj.created_at).format('DD-MM-YYYY'))}</Text>
                                          </View>
                                        </View>
                                        <View style={{ flexDirection: "row", width: "100%", marginTop: "2%" }}>
                                          <View style={{ width: "65%" }}>
                                            <Text style={{ fontFamily: "Bold" }}>Email</Text>
                                            <Text style={{ fontFamily: "Regular", fontSize: height * 0.017, marginTop: "1%", color: "#58befc" }}>{obj.lead_email}</Text>
                                          </View>
                                          <View>
                                            <Text style={{ fontFamily: "Bold" }}>Phone</Text>
                                            <Text style={{ fontFamily: "Regular", fontSize: height * 0.017, marginTop: "1%", color: "#58befc" }}>{obj.lead_phone_number}</Text>
                                          </View>
                                        </View>
                                        <View style={{ flexDirection: "row", width: "100%", marginTop: "2%", alignItems: "center" }}>
                                          <Text style={{ fontFamily: "Bold" }}>Rejection Reason: </Text>
                                          <Text style={{ fontFamily: "Regular", fontSize: height * 0.017 }}>{obj.status_reason}</Text>
                                        </View>
                                      </View>
                                    </>
                                  )}
                                </View>
                              )}
                            </TouchableOpacity>
                          )}
                        </ScrollView>
                      </Transitioning.View>
                      :
                      option === 'Pending Approval' && status === 'Received'
                        ?
                        <>
                          <Transitioning.View
                            ref={ref}
                            transition={transition}
                            style={{ width: "100%", height: "92%", }}
                          >
                            <ScrollView style={styles.container}>
                              {recievedPendingLeads.map((data, index) =>
                                <TouchableOpacity style={{ flexGrow: 1 }} key={index} activeOpacity={0.9}
                                  onPress={() => {
                                    ref.current.animateNextTransition();
                                    setCurrentIndex((index === IndexForPendnigApproval || index === currentIndex) ? null : index);
                                    route.params.data = false;
                                  }}>
                                  <View style={{ flexDirection: "row", height: height * 0.08, borderRadius: 10, borderColor: colors.lightgrey, backgroundColor: colors.grey, borderWidth: 1, justifyContent: "flex-start", alignItems: "center", marginVertical: "2%", }}>
                                    <View style={{ flexDirection: "row", marginLeft: "3%" }}>
                                      <Image style={{ height: 50, width: 50, backgroundColor: "#eee", borderRadius: 7 }} source={{ uri: data[0].profile_pic }} />
                                      <View style={{ backgroundColor: colors.primary, height: 23, width: 23, borderRadius: 40, left: -15, top: 30, borderWidth: 1.5, borderColor: "white", justifyContent: "center", alignItems: "center" }}>
                                        <Text style={{ color: "white", fontSize: height * 0.010 }}>#{data[0].roster_id}</Text>
                                      </View>
                                      <View style={{ flexDirection: "row", left: -10, alignItems: "center", width: "62%" }}>
                                        <Text style={{ marginLeft: "2%" }} ellipsizeMode='tail' numberOfLines={1}>{data[0].user_name}</Text>
                                      </View>
                                    </View>
                                    <View style={{ flexDirection: "row", width: "20%", left: -35 }}>
                                      {/* <View style={{ backgroundColor: "green", borderRadius: 5, paddingRight: 10, justifyContent: "flex-start" }}> */}
                                      <View style={{ backgroundColor: colors.white, alignItems: "center", flexDirection: "row", paddingVertical: 6, paddingHorizontal: 20, borderRadius: 5 }}>
                                        <Text>{data.length}</Text>
                                      </View>
                                      {/* </View> */}
                                      {
                                        (index === IndexForPendnigApproval || index === currentIndex) ? <Ionicons name={"chevron-up-outline"} size={height * 0.03} color={colors.icon} />
                                          : <Ionicons name={"chevron-down-outline"} size={height * 0.03} color={colors.icon} />
                                      }
                                    </View>
                                  </View>
                                  {(index === IndexForPendnigApproval || index === currentIndex) && (
                                    <View style={styles.content}>
                                      {data.map((obj, index) => {
                                        if (radioButtonData && obj != radioButtonData[0]) {
                                          obj.selected = false;
                                        }
                                      }
                                      )}
                                      {data.map((obj, index) =>
                                        <>
                                          <View style={{
                                            marginTop: "2%", borderRadius: 10, borderWidth: 1, borderColor: colors.lightgrey, paddingVertical: 10, padding: "4%"
                                          }}>
                                            <View style={{ flexDirection: "row", alignItems: "flex-start", left: -10 }}>
                                              <RadioGroup
                                                key={obj.id}
                                                radioButtons={[data[index]]}
                                                onPress={obj => setRadioButtonData(obj)}
                                              />
                                              <Text style={{ fontSize: height * 0.017, fontFamily: "Bold", marginTop: "2%" }}>Description</Text>
                                            </View>
                                            <View style={{ marginTop: "2%" }}>
                                              <Text style={{ fontSize: height * 0.017, fontFamily: "Regular", marginTop: "2%" }}>{obj.lead_description}</Text>
                                            </View>
                                            <View style={{ flexDirection: "row", width: "100%", marginTop: "2%" }}>
                                              <View style={{ width: "65%" }}>
                                                <Text style={{ fontFamily: "Bold" }}>Name</Text>
                                                <Text style={{ fontFamily: "Regular", fontSize: height * 0.017, marginTop: "1%" }}>{obj.lead_name}</Text>
                                              </View>
                                              <View>
                                                <Text style={{ fontFamily: "Bold" }}>Date</Text>
                                                <Text style={{ fontFamily: "Regular", fontSize: height * 0.017, marginTop: "1%" }}>{(moment(obj.created_at).format('DD-MM-YYYY'))}</Text>
                                              </View>
                                            </View>
                                            <View style={{ flexDirection: "row", width: "100%", marginTop: "2%", marginBottom: "2%" }}>
                                              <View style={{ width: "65%" }}>
                                                <Text style={{ fontFamily: "Bold" }}>Email</Text>
                                                <Text onPress={() => Linking.openURL(`mailto:${obj.lead_email}`)} style={{ fontFamily: "Regular", fontSize: height * 0.017, marginTop: "1%", color: "#58befc" }}>{obj.lead_email}</Text>
                                              </View>
                                              <View>
                                                <Text style={{ fontFamily: "Bold" }}>Phone</Text>
                                                <Text onPress={() => Linking.openURL(obj.lead_phone_number)} style={{ fontFamily: "Regular", fontSize: height * 0.017, marginTop: "1%", color: "#58befc" }}>{obj.lead_phone_number}</Text>
                                              </View>
                                            </View>
                                          </View>
                                        </>
                                      )}
                                    </View>
                                  )}
                                </TouchableOpacity>
                              )}
                            </ScrollView>
                            <View style={{ width: "100%", justifyContent: "space-evenly", alignItems: "center", flexDirection: "row" }}>
                              <CancelButton onPress={() => setRejectModalVisible(true)} text="Reject" />
                              <ShortButton onPress={() => setModalVisible(true)} text="Acknowledge" />
                            </View>
                          </Transitioning.View>
                          <View style={styles.centeredView}>
                            <Modal
                              animationType="slide"
                              transparent={true}
                              visible={modalVisible}
                              onRequestClose={() => {
                                // Alert.alert("Modal has been closed.");
                                setModalVisible(!modalVisible);
                              }}
                            >
                              <View style={styles.centeredView}>
                                <View style={styles.modalView}>
                                  <Text style={{ fontFamily: "Bold", fontSize: height * 0.025 }}>Confirmation</Text>
                                  <Text style={{ fontFamily: "Bold", fontSize: height * 0.016, marginTop: "4%" }}>Do you want to Acknowledge the Lead?</Text>
                                  <Text style={{ fontFamily: "Medium", fontSize: height * 0.016, marginTop: "4%", color: colors.darkgrey, marginBottom: "8%", textAlign: "center" }}>On clicking OK an Acknowledge will be sent to {radioButtonData ? radioButtonData[0].user_name : null}</Text>
                                  <View style={{ width: "100%", justifyContent: "space-evenly", alignItems: "center", flexDirection: "row" }}>
                                    <CancelButton onPress={() => setModalVisible(!modalVisible)} text="Cancel" />
                                    <ShortButton onPress={() => { setModalVisible(!modalVisible); acknowledgeCreate(radioButtonData, 'open') }} text="OK" />
                                  </View>
                                </View>
                              </View>
                            </Modal>
                          </View>
                          <View style={styles.centeredView}>
                            <Modal
                              animationType="slide"
                              transparent={true}
                              visible={rejectModalVisible}
                              onRequestClose={() => {
                                // Alert.alert("Modal has been closed.");
                                setRejectModalVisible(!rejectModalVisible);
                              }}
                            >
                              <View style={styles.centeredView}>
                                <View style={styles.modalView}>
                                  <Text style={{ fontFamily: "Bold", fontSize: height * 0.025 }}>Rejection Reason</Text>
                                  <TouchableOpacity style={styles.selector}>

                                    <ModalDropdown onSelect={(value) => { setModalDropdownValue(value) }} defaultValue={'Select Any*'} dropdownStyle={{ width: "73%", marginTop: "2%", marginBottom: "-20%" }} style={{ width: "100%", paddingLeft: "1%" }} options={['Not Interested', 'Did not respond', 'Not a match to our service']} />
                                    {/* </Menu> */}
                                  </TouchableOpacity>
                                  <Text style={{ fontFamily: "Bold", fontSize: height * 0.016, marginTop: "4%" }}>Add Description</Text>
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
                                    onChangeText={(text) => setModalDropdownDescription(text)}
                                    clearButtonMode="always" //only on IOS
                                  />
                                  <View style={{ width: "100%", justifyContent: "space-evenly", alignItems: "center", flexDirection: "row" }}>
                                    <CancelButton onPress={() => setRejectModalVisible(!rejectModalVisible)} text="Cancel" />
                                    <ShortButton onPress={() => { setRejectModalVisible(!rejectModalVisible); rejectionSubmit(radioButtonData) }} text="Submit" />
                                  </View>
                                </View>
                              </View>
                            </Modal>
                          </View>
                        </>
                        :
                        option === 'Open' && status === 'Received'
                          ?
                          <>
                            <Transitioning.View
                              ref={ref}
                              transition={transition}
                              style={{ width: "100%", height: "92%", }}
                            >
                              <ScrollView style={styles.container}>
                                {recievedOpenLeads.map((data, index) =>
                                  <TouchableOpacity style={{ flexGrow: 1 }} key={index} activeOpacity={0.9}
                                    onPress={() => {
                                      ref.current.animateNextTransition();
                                      setCurrentIndex((index === IndexForOpen || index === currentIndex) ? null : index);
                                      route.params.data = false;
                                    }}>
                                    <View style={{ flexDirection: "row", height: height * 0.08, borderRadius: 10, borderColor: colors.lightgrey, backgroundColor: colors.grey, borderWidth: 1, justifyContent: "flex-start", alignItems: "center", marginVertical: "2%" }}>
                                      <View style={{ flexDirection: "row", marginLeft: "3%" }}>
                                        <Image style={{ height: 50, width: 50, backgroundColor: "#eee", borderRadius: 7 }} source={{ uri: data[0].profile_pic }} />
                                        <View style={{ backgroundColor: colors.primary, height: 23, width: 23, borderRadius: 40, left: -15, top: 30, borderWidth: 1.5, borderColor: "white", justifyContent: "center", alignItems: "center" }}>
                                          <Text style={{ color: "white", fontSize: height * 0.010 }}>#{data[0].roster_id}</Text>
                                        </View>
                                        <View style={{ flexDirection: "row", left: -10, alignItems: "center", width: "62%" }}>
                                          <Text style={{ marginLeft: "2%" }} ellipsizeMode='tail' numberOfLines={1}>{data[0].user_name}</Text>
                                        </View>
                                      </View>
                                      <View style={{ flexDirection: "row", width: "20%", left: -35 }}>
                                        <View style={{ backgroundColor: colors.white, alignItems: "center", flexDirection: "row", paddingVertical: 6, paddingHorizontal: 20, borderRadius: 5 }}>
                                          <Text>{data.length}</Text>
                                        </View>
                                        {
                                          (index === IndexForOpen || index === currentIndex) ? <Ionicons name={"chevron-up-outline"} size={height * 0.03} color={colors.icon} />
                                            : <Ionicons name={"chevron-down-outline"} size={height * 0.03} color={colors.icon} />
                                        }
                                      </View>
                                    </View>
                                    {(index === IndexForOpen || index === currentIndex) && (
                                      <View style={styles.content}>
                                        {data.map((obj, index) => {
                                          if (radioButtonData && obj != radioButtonData[0]) {
                                            obj.selected = false;
                                          }
                                        }
                                        )}
                                        {data.map((obj, index) =>
                                          <>
                                            <View style={{
                                              marginTop: "2%", borderRadius: 10, borderWidth: 1, borderColor: colors.lightgrey, paddingVertical: 10, padding: "4%"
                                            }}>
                                              <View style={{ flexDirection: "row", alignItems: "flex-start", left: -10 }}>
                                                <RadioGroup
                                                  key={obj.id}
                                                  radioButtons={[data[index]]}
                                                  onPress={obj => setRadioButtonData(obj)}
                                                />
                                                <Text style={{ fontSize: height * 0.017, fontFamily: "Bold", marginTop: "2%" }}>Description</Text>
                                              </View>
                                              <View style={{ marginTop: "2%" }}>
                                                <Text style={{ fontSize: height * 0.017, fontFamily: "Regular", marginTop: "2%" }}>{obj.lead_description}</Text>
                                              </View>
                                              <View style={{ flexDirection: "row", width: "100%", marginTop: "2%" }}>
                                                <View style={{ width: "65%" }}>
                                                  <Text style={{ fontFamily: "Bold" }}>Name</Text>
                                                  <Text style={{ fontFamily: "Regular", fontSize: height * 0.017, marginTop: "1%" }}>{obj.lead_name}</Text>
                                                </View>
                                                <View>
                                                  <Text style={{ fontFamily: "Bold" }}>Date</Text>
                                                  <Text style={{ fontFamily: "Regular", fontSize: height * 0.017, marginTop: "1%" }}>{(moment(obj.created_at).format('DD-MM-YYYY'))}</Text>
                                                </View>
                                              </View>

                                              <View style={{ flexDirection: "row", width: "100%", marginTop: "2%", marginBottom: "2%" }}>
                                                <View style={{ width: "65%" }}>
                                                  <Text style={{ fontFamily: "Bold" }}>Email</Text>
                                                  <Text onPress={() => Linking.openURL(`mailto:${obj.lead_email}`)} style={{ fontFamily: "Regular", fontSize: height * 0.017, marginTop: "1%", color: "#58befc" }}>{obj.lead_email}</Text>
                                                </View>
                                                <View>
                                                  <Text style={{ fontFamily: "Bold" }}>Phone</Text>
                                                  <Text onPress={() => Linking.openURL(obj.lead_phone_number)} style={{ fontFamily: "Regular", fontSize: height * 0.017, marginTop: "1%", color: "#58befc" }}>{obj.lead_phone_number}</Text>
                                                </View>
                                              </View>
                                            </View>
                                          </>
                                        )}
                                      </View>
                                    )}
                                  </TouchableOpacity>
                                )}
                              </ScrollView>
                              <View style={{ width: "100%", justifyContent: "space-evenly", alignItems: "center", flexDirection: "row" }}>
                                <CancelButton onPress={() => setRejectModalVisible(true)} text="Reject" />
                                <ShortButton onPress={() => setModalVisible(true)} text="Closed Lead" />
                              </View>
                            </Transitioning.View>
                            <View style={styles.centeredView}>
                              <Modal
                                animationType="slide"
                                transparent={true}
                                visible={modalVisible}
                                onRequestClose={() => {
                                  // Alert.alert("Modal has been closed.");
                                  setModalVisible(!modalVisible);
                                }}
                              >
                                <View style={styles.centeredView}>
                                  <View style={styles.modalView}>
                                    <View style={{ width: "100%" }}>
                                      <Text style={{ fontFamily: "Bold", fontSize: height * 0.025 }}>Close Lead</Text>
                                      <RadioGroup
                                        radioButtons={radioButtons}
                                        onPress={onPressRadioButton}
                                        containerStyle={{
                                          alignItems: "flex-start", marginTop: "4%", left: -10,
                                        }}
                                        labelStyle={{ fontFamily: "SemiBold" }}
                                      />
                                      <Text style={{ fontFamily: "Bold", fontSize: height * 0.016, marginTop: "4%" }}>Enter Amount*</Text>
                                      <TextInput
                                        style={styles.input}
                                        placeholder="Enter amount"
                                        keyboardType="number-pad"
                                        // autoCapitalize="words"
                                        returnKeyType="done"
                                        selectionColor={colors.selector}
                                        textContentType="amount"//only ios
                                        onChangeText={(text) => setModalThankyouAmount(text)}
                                        clearButtonMode="always" //only on IOS
                                      />
                                      <Text style={{ fontFamily: "Bold", fontSize: height * 0.016, marginTop: "4%" }}>Add Description</Text>
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
                                        onChangeText={(text) => setModalThankyouDescription(text)}
                                        clearButtonMode="always" //only on IOS
                                      />
                                    </View>
                                    <View style={{ width: "100%", justifyContent: "space-evenly", alignItems: "center", flexDirection: "row" }}>
                                      <CancelButton onPress={() => setModalVisible(!modalVisible)} text="Cancel" />
                                      <ShortButton onPress={() => { setModalVisible(!modalVisible); acknowledgeCreate(radioButtonData, 'closed won'); thankyouSubmit(radioButtonData); }} text="Submit" />
                                    </View>
                                  </View>
                                </View>
                              </Modal>

                            </View>
                            <View style={styles.centeredView}>
                              <Modal
                                animationType="slide"
                                transparent={true}
                                visible={rejectModalVisible}
                                onRequestClose={() => {
                                  // Alert.alert("Modal has been closed.");
                                  setRejectModalVisible(!rejectModalVisible);

                                }}
                              >
                                <View style={styles.centeredView}>
                                  <View style={styles.modalView}>
                                    <Text style={{ fontFamily: "Bold", fontSize: height * 0.025 }}>Rejection Reason</Text>
                                    {/* <Text style={{ fontFamily: "Bold", fontSize: height * 0.016, marginTop: "4%" }}>Select Any*</Text> */}
                                    <TouchableOpacity style={styles.selector}>

                                      <ModalDropdown onSelect={(value) => { setModalDropdownValue(value) }} defaultValue={'Select Any*'} dropdownStyle={{ width: "73%", marginTop: "2%", marginBottom: "-20%" }} style={{ width: "100%", paddingLeft: "1%" }} options={['Not Interested', 'Did not respond', 'Not a match to our service']} />
                                    </TouchableOpacity>
                                    <Text style={{ fontFamily: "Bold", fontSize: height * 0.016, marginTop: "4%" }}>Add Description</Text>
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
                                      onChangeText={(text) => setModalDropdownDescription(text)}
                                      clearButtonMode="always" //only on IOS
                                    />
                                    <View style={{ width: "100%", justifyContent: "space-evenly", alignItems: "center", flexDirection: "row" }}>
                                      <CancelButton onPress={() => setRejectModalVisible(!rejectModalVisible)} text="Cancel" />
                                      <ShortButton onPress={() => { setRejectModalVisible(!rejectModalVisible); rejectionSubmit(radioButtonData) }} text="Submit" />
                                    </View>
                                  </View>
                                </View>
                              </Modal>
                            </View>
                          </>
                          :
                          option === 'Closed Won' && status === 'Received'
                            ?
                            <Transitioning.View
                              ref={ref}
                              transition={transition}
                              style={{ width: "100%", height: "92%", }}
                            >
                              <ScrollView style={styles.container}>
                                {recievedClosedWonLeads.map((data, index) =>
                                  <TouchableOpacity style={{ flexGrow: 1 }} key={index} activeOpacity={0.9}
                                    onPress={() => {
                                      ref.current.animateNextTransition();
                                      setCurrentIndex((index === IndexForClosedWon || index === currentIndex) ? null : index);
                                      route.params.data = false;
                                    }}>
                                    <View style={{ flexDirection: "row", height: height * 0.08, borderRadius: 10, borderColor: colors.lightgrey, backgroundColor: colors.grey, borderWidth: 1, justifyContent: "flex-start", alignItems: "center", marginVertical: "2%" }}>
                                      <View style={{ flexDirection: "row", marginLeft: "3%" }}>
                                        <Image style={{ height: 50, width: 50, backgroundColor: "#eee", borderRadius: 7 }} source={{ uri: data[0].profile_pic }} />
                                        <View style={{ backgroundColor: colors.primary, height: 23, width: 23, borderRadius: 40, left: -15, top: 30, borderWidth: 1.5, borderColor: "white", justifyContent: "center", alignItems: "center" }}>
                                          <Text style={{ color: "white", fontSize: height * 0.010 }}>#{data[0].roster_id}</Text>
                                        </View>
                                        <View style={{ flexDirection: "row", left: -10, alignItems: "center", width: "62%" }}>
                                          <Text style={{ marginLeft: "2%" }} ellipsizeMode='tail' numberOfLines={1}>{data[0].user_name}</Text>
                                        </View>
                                      </View>
                                      <View style={{ flexDirection: "row", width: "20%", left: -35 }}>
                                        <View style={{ backgroundColor: "green", borderRadius: 5, paddingRight: 10, justifyContent: "flex-start" }}>
                                          <View style={{ backgroundColor: colors.white, alignItems: "center", flexDirection: "row", paddingVertical: 6, paddingHorizontal: 20, borderRadius: 5 }}>
                                            <Text>{data.length}</Text>
                                          </View>
                                        </View>
                                        {
                                          (index === IndexForClosedWon || index === currentIndex) ? <Ionicons name={"chevron-up-outline"} size={height * 0.03} color={colors.icon} />
                                            : <Ionicons name={"chevron-down-outline"} size={height * 0.03} color={colors.icon} />
                                        }
                                      </View>
                                    </View>
                                    {(index === IndexForClosedWon || index === currentIndex) && (
                                      <View style={styles.content}>
                                        {data.map((obj, index) =>
                                          <>
                                            <View style={{
                                              marginTop: "2%", borderRadius: 10, borderWidth: 1, borderColor: colors.lightgrey, paddingVertical: 10, padding: "4%"
                                            }}>
                                              <View style={{ width: "100%", marginTop: "2%" }}>
                                                <Text style={{ fontSize: height * 0.017, fontFamily: "Bold" }}>Description</Text>
                                                <Text style={{ fontSize: height * 0.017, fontFamily: "Regular", marginTop: "2%" }}>{obj.lead_description}</Text>
                                              </View>
                                              <View style={{ flexDirection: "row", width: "100%" }}>
                                                <View style={{ width: "65%" }}>
                                                  <Text style={{ fontFamily: "Bold" }}>Name</Text>
                                                  <Text style={{ fontFamily: "Regular", fontSize: height * 0.017, marginTop: "1%" }}>{obj.lead_name}</Text>
                                                </View>
                                                <View>
                                                  <Text style={{ fontFamily: "Bold" }}>Date</Text>
                                                  <Text style={{ fontFamily: "Regular", fontSize: height * 0.017, marginTop: "1%" }}>{(moment(obj.created_at).format('DD-MM-YYYY'))}</Text>
                                                </View>
                                              </View>
                                              <View style={{ flexDirection: "row", width: "100%", marginTop: "2%" }}>
                                                <View style={{ width: "65%" }}>
                                                  <Text style={{ fontFamily: "Bold" }}>Email</Text>
                                                  <Text onPress={() => Linking.openURL(`mailto:${obj.lead_email}`)} style={{ fontFamily: "Regular", fontSize: height * 0.017, marginTop: "1%", color: "#58befc" }}>{obj.lead_email}</Text>
                                                </View>
                                                <View>
                                                  <Text style={{ fontFamily: "Bold" }}>Phone</Text>
                                                  <Text onPress={() => Linking.openURL(obj.lead_phone_number)} style={{ fontFamily: "Regular", fontSize: height * 0.017, marginTop: "1%", color: "#58befc" }}>{obj.lead_phone_number}</Text>
                                                </View>
                                              </View>
                                              <View style={{ flexDirection: "row", width: "100%", marginTop: "2%", alignItems: "center" }}>
                                                <Text style={{ fontFamily: "Bold" }}>Thank You Amount: </Text>
                                                <Text style={{ fontFamily: "Regular", fontSize: height * 0.017 }}>{obj.thankyou_amount ? formatter.format(obj.thankyou_amount) + '' + '/-' : null}</Text>
                                              </View>

                                            </View>
                                          </>
                                        )}
                                      </View>
                                    )}
                                  </TouchableOpacity>
                                )}
                              </ScrollView>
                              {/* <View style={{ width: "100%", justifyContent: "space-evenly", alignItems: "center", flexDirection: "row" }}>
                                            <CancelButton onPress text="Reject" />
                                            <ShortButton onPress text="Acknowledge" />
                                        </View> */}
                            </Transitioning.View>
                            :

                            option === 'Closed Lost' && status === 'Received'
                              ?
                              <Transitioning.View
                                ref={ref}
                                transition={transition}
                                style={{ width: "100%", height: "92%", }}
                              >
                                <ScrollView style={styles.container}>

                                  {recievedClosedLostLeads.map((data, index) =>
                                    <TouchableOpacity style={{ flexGrow: 1 }} key={index} activeOpacity={0.9}
                                      onPress={() => {
                                        ref.current.animateNextTransition();
                                        setCurrentIndex((index === IndexForClosedLost || index === currentIndex) ? null : index)
                                        route.params.data = false;
                                      }}>
                                      <View style={{ flexDirection: "row", height: height * 0.08, borderRadius: 10, borderColor: colors.lightgrey, backgroundColor: colors.grey, borderWidth: 1, justifyContent: "flex-start", alignItems: "center", marginVertical: "2%" }}>
                                        <View style={{ flexDirection: "row", marginLeft: "3%" }}>
                                          <Image style={{ height: 50, width: 50, backgroundColor: "#eee", borderRadius: 7 }} source={{ uri: data[0].profile_pic }} />
                                          <View style={{ backgroundColor: colors.primary, height: 23, width: 23, borderRadius: 40, left: -15, top: 30, borderWidth: 1.5, borderColor: "white", justifyContent: "center", alignItems: "center" }}>
                                            <Text style={{ color: "white", fontSize: height * 0.010 }}>#{data[0].roster_id}</Text>
                                          </View>
                                          <View style={{ flexDirection: "row", left: -10, alignItems: "center", width: "62%" }}>
                                            <Text style={{ marginLeft: "2%" }} ellipsizeMode='tail' numberOfLines={1}>{data[0].user_name}</Text>
                                          </View>
                                        </View>
                                        <View style={{ flexDirection: "row", width: "20%", left: -35 }}>
                                          <View style={{ backgroundColor: "red", borderRadius: 5, paddingRight: 10, justifyContent: "flex-start" }}>
                                            <View style={{ backgroundColor: colors.white, alignItems: "center", flexDirection: "row", paddingVertical: 6, paddingHorizontal: 20, borderRadius: 5 }}>
                                              <Text>{data.length}</Text>
                                            </View>
                                          </View>
                                          {
                                            (index === IndexForClosedLost || index === currentIndex) ? <Ionicons name={"chevron-up-outline"} size={height * 0.03} color={colors.icon} />
                                              : <Ionicons name={"chevron-down-outline"} size={height * 0.03} color={colors.icon} />
                                          }
                                        </View>
                                      </View>
                                      {(index === IndexForClosedLost || index === currentIndex) && (
                                        <View style={styles.content}>
                                          {data.map((obj, index) =>
                                            <>
                                              <View style={{
                                                marginTop: "2%", borderRadius: 10, borderWidth: 1, borderColor: colors.lightgrey, paddingVertical: 10, padding: "4%"
                                              }}>
                                                <View style={{ width: "100%" }}>
                                                  <Text style={{ fontSize: height * 0.017, fontFamily: "Bold", marginTop: "2%" }}>Description</Text>
                                                  <Text style={{ fontSize: height * 0.017, fontFamily: "Regular", marginTop: "2%" }}>{obj.lead_description}</Text>

                                                </View>
                                                <View style={{ flexDirection: "row", width: "100%", marginTop: "2%" }}>
                                                  <View style={{ width: "65%" }}>
                                                    <Text style={{ fontFamily: "Bold" }}>Name</Text>
                                                    <Text style={{ fontFamily: "Regular", fontSize: height * 0.017, marginTop: "1%" }}>{obj.lead_name}</Text>
                                                  </View>
                                                  <View>
                                                    <Text style={{ fontFamily: "Bold" }}>Date</Text>
                                                    <Text style={{ fontFamily: "Regular", fontSize: height * 0.017, marginTop: "1%" }}>{(moment(obj.created_at).format('DD-MM-YYYY'))}</Text>
                                                  </View>
                                                </View>
                                                <View style={{ flexDirection: "row", width: "100%", marginTop: "2%" }}>
                                                  <View style={{ width: "65%" }}>
                                                    <Text style={{ fontFamily: "Bold" }}>Email</Text>
                                                    <Text onPress={() => Linking.openURL(`mailto:${obj.lead_email}`)} style={{ fontFamily: "Regular", fontSize: height * 0.017, marginTop: "1%", color: "#58befc" }}>{obj.lead_email}</Text>
                                                  </View>
                                                  <View>
                                                    <Text style={{ fontFamily: "Bold" }}>Phone</Text>
                                                    <Text onPress={() => Linking.openURL(obj.lead_phone_number)} style={{ fontFamily: "Regular", fontSize: height * 0.017, marginTop: "1%", color: "#58befc" }}>{obj.lead_phone_number}</Text>
                                                  </View>
                                                </View>
                                                <View style={{ flexDirection: "row", width: "100%", marginTop: "2%", alignItems: "center" }}>
                                                  <Text style={{ fontFamily: "Bold" }}>Rejection Reason: </Text>
                                                  <Text style={{ fontFamily: "Regular", fontSize: height * 0.017 }}>{obj.status_reason}</Text>
                                                </View>
                                              </View>
                                            </>
                                          )}
                                        </View>
                                      )}
                                    </TouchableOpacity>
                                  )}
                                </ScrollView>
                              </Transitioning.View>
                              :
                              <Transitioning.View
                                ref={ref}
                                transition={transition}
                                style={{ width: "100%", height: "92%", }}
                              >
                              </Transitioning.View>
            }
          </View>
        </>
      )
      }
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  listTab: {
    flexDirection: "row",
    alignSelf: 'center',
    marginBottom: 1,
    width: "100%",
    marginLeft: "8%",
    marginTop: "1%",
    // backgroundColor: "red"
  },
  btnTab: {
    width: width * 0.45,
    flexDirection: "row",
    marginRight: '2%',
    borderWidth: 0.5,
    borderColor: colors.primary,
    padding: 10,
    borderRadius: 5,
    justifyContent: "center",
  },
  btnTab1: {
    // width: width * 0.35,
    flexDirection: "row",
    marginRight: '1%',
    borderWidth: 0.5,
    borderColor: colors.primary,
    paddingVertical: 8,
    paddingHorizontal: 12.5,
    borderRadius: 5,
    justifyContent: "center", marginBottom: 5
  },
  textTab: {
    fontSize: height * 0.013,
    color: colors.black,
    fontFamily: "SemiBold",
    // fontSize: 13,
  },
  btnTabActive: {
    backgroundColor: colors.primary
  },
  textTabActive: {
    color: "#fff"
  },
  itemContainer: {
    flexDirection: 'row',
    paddingVertical: 15,
  },
  textArea: {
    marginBottom: "4%",
    height: 100,
    width: 280,
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: colors.grey,
    borderRadius: 10,
    marginTop: "2%",
    padding: 10,
    justifyContent: "flex-start",
    paddingVertical: "5%",
  },
  container: {
    padding: "4%",
  },
  selector: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: "2%",
    width: "112%",
    height: height * 0.06,
    backgroundColor: colors.lightgrey,
    borderRadius: 10,
    borderColor: colors.grey,
    borderWidth: 1,
    opacity: 0.9, paddingLeft: "2%"
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
    padding: 35,
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
  input: {
    fontFamily: "SemiBold",
    width: 280,
    borderWidth: 1,
    borderColor: colors.grey,
    borderRadius: 10,
    marginTop: "2%",
    padding: 10,
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },

});


export default LeadDetailScreen;
