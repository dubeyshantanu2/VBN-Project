import React from 'react'
import { StatusBar, Image, Dimensions, SafeAreaView, Button, Text } from 'react-native';
import { Logout } from '../store/actions';
import { useDispatch } from 'react-redux';
import colors from '../config/colors';

const { height, width } = Dimensions.get('window');

const ChatScreen = () => {
    const dispatch = useDispatch();
    const submit = () => {
        dispatch(Logout())
    }
    return (

        <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
            <StatusBar backgroundColor={colors.primary} barStyle='dark-content' />
            <Text>This is chat page</Text>
            {/* <Image source={require("../assets/VBNlogo.png")} style={{ height: height, width: width, resizeMode: 'center' }} /> */}
            <Button title="Logout" onPress={submit} />
        </SafeAreaView>
    )
}

export default ChatScreen;
