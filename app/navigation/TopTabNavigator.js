import * as React from 'react';
import { Text, View } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import LeadGiven from "../screens/LeadGiven";
import LeadReceived from "../screens/LeadReceived";
import { useRoute } from '@react-navigation/native';

const TabTop = createMaterialTopTabNavigator();

function TopTabNavigator() {
    const route = useRoute()
    return (
        <TabTop.Navigator >
            <TabTop.Screen name="Received" unmountOnBlur={true} component={LeadReceived} options={{ unmountOnBlur: true }} initialParams={route.params} />
            <TabTop.Screen name="Given" component={LeadGiven} initialParams={route.params} />
        </TabTop.Navigator>
    )
}

export default TopTabNavigator;
