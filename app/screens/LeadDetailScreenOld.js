import React, { useState, useEffect } from 'react'
import { TouchableOpacity, StatusBar, View, FlatList, Image, Dimensions, SafeAreaView, Button, Text, StyleSheet } from 'react-native';
import colors from '../config/colors';
import LeadCardDetails from "../components/LeadCardDetails";
import axios from 'axios';
import { useSelector } from 'react-redux';
import moment from 'moment';
import env from '../config/env';

const { height, width } = Dimensions.get('window');

const listTab = [
  {
    status: "Received"
  },
  {
    status: "Given"
  }
]

const LeadDetailScreen = ({ route }) => {
  const token = useSelector(state => state.AuthReducers.accessToken);
  const [status, setStatus] = useState('Received');
  const [givenLeads, setGivenLeads] = useState([]);
  const [recievedLeads, setRecievedLeads] = useState([]);
  const [userData, setUserData] = useState([]);
  const [leadsNotif, setLeadsNotif] = useState(route.params.data);
  const setStatusFilter = status => {
    setStatus(status)
  }
  useEffect(() => {
    axios({
      method: "GET",
      url: `${env.endpointURL}/leads?selector=${route.params.selector}`,
      headers: {
        'Cookie': `jwt=${token}`,
      },
    })
      .then(function (res) {
        setGivenLeads(res.data.givenLeads);
        setRecievedLeads(res.data.receivedLeads);
      })
      .catch(function (error) {
        console.log("error at leads api leaddetails", error.message)
      })

  }, []);

  /*todo: remove chapter users hardcoding and use the chapter of the logged in user */
  useEffect(() => {
    axios({
      method: "GET",
      url: `${env.endpointURL}/users`,
      headers: {
        'Cookie': `jwt=${token}`,
      },
    })
      .then(function (res) {
        // console.log(res.data[0]);
        setUserData(res.data);
      })
      .catch(function (error) {
        console.log("error at member list api leaddetails", error.message)
      })
  }, []);;

  const ItemView = ({ item, index }) => {
    if (!route.params.selector) {
      var noti = item
      item = item.lead_details
    }
    var given_to_user = userData.find(user => user.id == item.lead_to_user_id);
    var received_from_user = userData.find(user => user.id == item.lead_by_user_id);
    if (!route.params.selector) var received_from = userData.find(user => user.id == noti.from);
    // console.log(received_from_user ? received_from_user.full_name : null, "!!");
    return (
      !route.params.selector ?
        <LeadCardDetails key={index} name={item.lead_name} date={(moment(item.created_at).format('YYYY-MM-DD'))} email={item.lead_email} phone={item.lead_phone_number} receivedFrom={received_from ? (received_from.first_name + ' ' + received_from.last_name) : null} status={status} description={item.lead_description} /> :
        status === 'Received' ?
          <LeadCardDetails key={index} name={item.lead_name} date={(moment(item.created_at).format('YYYY-MM-DD'))} email={item.lead_email} phone={item.lead_phone_number} receivedFrom={received_from_user ? (received_from_user.first_name + ' ' + received_from_user.last_name) : null} status={status} description={item.lead_description} />
          : <LeadCardDetails key={index} name={item.lead_name} date={(moment(item.created_at).format('YYYY-MM-DD'))} email={item.lead_email} phone={item.lead_phone_number} givenTo={given_to_user ? (given_to_user.first_name + ' ' + given_to_user.last_name) : null} status={status} description={item.lead_description} />
    )
  }

  const separator = () => {
    return <View style={{ borderColor: "white", borderWidth: 6 }} />
  }

  if (!route.params.selector)
    var data_noti = leadsNotif.filter(data => data.from === route.params.from && data.count == route.params.count)

  return (
    <SafeAreaView style={{ height: "90%" }}>
      <StatusBar backgroundColor={colors.primary} barStyle='light-content' />
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
      <View style={{ width: "100%", height: "100%" }}>
        <FlatList
          data={!route.params.selector ? data_noti : status === 'Received' ? recievedLeads : givenLeads}
          keyExtractor={item => item.id}
          renderItem={ItemView}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={separator}
          initialNumToRender={100}
        />
      </View>
    </SafeAreaView>
  )
}
const styles = StyleSheet.create({
  listTab: {
    flexDirection: "row",
    alignSelf: 'center',
    marginBottom: 20,
    width: "100%",
    marginLeft: "8%",
    marginTop: "4%"
  },
  btnTab: {
    width: width * 0.46,
    flexDirection: "row",
    borderWidth: 0.5,
    borderColor: colors.primary,
    padding: 10,
    borderRadius: 5,
    justifyContent: "center",
  },
  textTab: {
    fontSize: 13,
    color: colors.black
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
});
export default LeadDetailScreen;
