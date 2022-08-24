import React, { Component } from 'react'
import { Dimensions, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import colors from '../config/colors';

const isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }) => {
    const paddingToBottom = 20;
    return layoutMeasurement.height + contentOffset.y >=
        contentSize.height - paddingToBottom;
};
class PrivacyPolicy extends Component {

    state = {
        accepted: false
    }

    render() {
        const { navigation } = this.props;
        return (
            <View style={styles.container}>
                <ScrollView
                    style={styles.tcContainer}
                    onScroll={({ nativeEvent }) => {
                        if (isCloseToBottom(nativeEvent)) {
                            this.setState({
                                accepted: true
                            })
                        }
                    }}
                >
                    <Text style={styles.tcP}>As a leading member of the Vysya community we seek your help, support and assistance for developing the three business networks into large entities which can help all the members of the Vysya community whichever part of the world they are in. All of us need to pool in our efforts and energies and build this massive networking enterprise that can knit our community together.</Text>
                    <Text style={styles.tcP}>In this section, we want to help inform you about:</Text>
                    <Text style={styles.tcL}>{'\u2022'} What information we collect</Text>
                    <Text style={styles.tcL}>{'\u2022'} What we do with your information</Text>
                    <Text style={styles.tcL}>{'\u2022'} How you can control and manage your data within our platform</Text>
                    <Text style={styles.tcL}>{'\u2022'} Steps we take to ensure your data remains safe and private</Text>
                    <Text style={styles.tcL}>{'\u2022'} How to delete your account and all personal information from our servers</Text>
                    <Text style={styles.tcB}>What information we collect</Text>
                    <Text style={styles.tcP}>Account information: your name, email address, mailing address, mobile number, organization, website and keywords.</Text>
                    <Text style={styles.tcP}>Additional information: In order to make our services more useful to you, we collect certain additional information. This information may include: internet protocol address ("IP address"), browser type, domain names, access times, operating system, and page and/or feature interactions.</Text>
                    <Text style={styles.tcP}>We may also collect information about your device, including your device type, manufacturer, model, and operating system, your device ID; and the version of your app.</Text>
                    <Text style={styles.tcP}>We need access to other information from your mobile device like contacts, camera, microphone access and file manager access.</Text>
                    <Text style={styles.tcP}>We also use cookies and navigational data such as Uniform Resource Locators (URLs) to gather information regarding the date and time of your visit and the information for which you searched and which you viewed. Cookies are small files that a site or its services provider transfers to your computer's hard drive through your web browser if you so allow. This enables the sites or service provider to recognize your browser and capture and remember certain information. We use cookies to understand and save your preferences for future visits and compile aggregate data about our site traffic.</Text>
                    <Text style={styles.tcB}>EU Considerations</Text>
                    <Text style={styles.tcP}>Some of the data we collect, including but not limited to your activity data, is subject to the European Union’s General Data Protection Regulation (GDPR) and thus requires we ask for your explicit consent. At any time you may withdraw your consent from your account settings, unpair a connected 3rd party registration to a device or tracking service and/or delete your account and associated data.</Text>
                    <Text style={styles.tcP}>We do not collect any information from anyone under 13 years of age. Our website, products and services are all directed to people who are at least 13 years old or older.</Text>
                    <Text style={styles.tcB}>What we do with your information</Text>
                    <Text style={styles.tcP}>The information we collect from you may be used in one or more of the following ways: to personalize your experience.</Text>
                    <Text style={styles.tcB}>Sharing of Information</Text>
                    <Text style={styles.tcP}>By uploading a photo, you are consenting to VBN's use in the VBN directory.</Text>
                    <Text style={styles.tcP}>We do not sell, trade, or otherwise transfer to outside parties your personally identifiable information. This does not include trusted third parties who assist us in operating our website and app, conducting our business, or servicing you, so long as those parties agree to keep this information confidential with at least the same degree of care that we use ourselves to maintain your informations' privacy.</Text>
                    <Text style={styles.tcP}>We may disclose your personal information to: (a) comply with relevant laws, regulatory requirements and to respond to lawful requests, court orders, and legal process; (b) to protect and defend the rights or property of ours or third parties, including enforcing agreements, policies, and terms of use; (c) in an emergency, including to protect the safety of our employees or any person; or (d) in connection with investigating and preventing fraud.</Text>
                    <Text style={styles.tcB}>How you can control and manage your data within our platform</Text>
                    <Text style={styles.tcP}>You may send requests about personal information via email to developer.india@navtech.io. For help making changes of data from the platform, please email via our "Help" section in the app.</Text>
                    <Text style={styles.tcB}>Deleting Information and Accounts</Text>
                    <Text style={styles.tcP}>You may request that your account be deleted by using the Help link in profile page. Once deleted, your data, including your account, leads and historical data cannot be reinstated.</Text>
                    <Text style={styles.tcB}>Steps we take to ensure your data remains safe and private</Text>
                    <Text style={styles.tcP}>We offer the use of a secure server. All supplied information is transmitted via Secure Socket Layer (SSL) technology.</Text>
                    <Text style={styles.tcP}>Although we have taken steps to protect your personal information, you should know that neither we nor any company can fully eliminate security risks. If a breach of your data is detected, we will notify you as soon as possible of our awareness of the breach or otherwise as required by law.</Text>
                    <Text style={styles.tcB}>Terms of Service</Text>
                    <Text style={styles.tcP}>Please also visit our Terms of Service section establishing the use, disclaimers, and limitations of liability governing the use of our website.</Text>
                    <Text style={styles.tcB}>Your Consent</Text>
                    <Text style={styles.tcP}>By using our site, you consent to our privacy policy.</Text>
                    <Text style={styles.tcB}>Contact Us</Text>
                    <Text style={styles.tcP}>Should you have any questions or concerns regarding this privacy policy, please contact us at developer.india@navtech.io</Text>
                    <Text style={styles.tcB}>Privacy Policy Updates</Text>
                    <Text style={styles.tcP}>This Privacy Policy may be updated from time to time. When we do, we will change the last updated date below to let you know we made a change.</Text>
                </ScrollView>

                <TouchableOpacity disabled={!this.state.accepted} onPress={() => { this.props.navigation.navigate("Login") }} style={this.state.accepted ? styles.button : styles.buttonDisabled}><Text style={styles.buttonLabel}>Accept</Text></TouchableOpacity>
            </View>
        );
    }
}

const { width, height } = Dimensions.get('window');

const styles = {
    container: {
        marginTop: 20,
        marginLeft: 10,
        marginRight: 10
    },
    title: {
        fontSize: 22,
        alignSelf: 'center'
    },
    tcP: {
        marginTop: 10,
        marginBottom: 10,
        fontSize: 12
    },
    tcB: {
        marginTop: 10,
        marginBottom: 10,
        fontSize: 12,
        fontWeight: "bold"
    },
    tcP: {
        marginTop: 10,
        fontSize: 12
    },
    tcL: {
        marginLeft: 10,
        marginTop: 10,
        marginBottom: 10,
        fontSize: 12
    },
    tcContainer: {
        marginTop: 15,
        marginBottom: 15,
        height: height * .7
    },

    button: {
        backgroundColor: colors.primary,
        borderRadius: 5,
        padding: 10
    },

    buttonDisabled: {
        backgroundColor: '#999',
        borderRadius: 5,
        padding: 10
    },

    buttonLabel: {
        fontSize: 14,
        color: '#FFF',
        alignSelf: 'center'
    }
}

export default PrivacyPolicy;
