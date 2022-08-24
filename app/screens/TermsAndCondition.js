import React, { Component } from 'react';
import { View, Text, ScrollView, Dimensions, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import colors from '../config/colors';


const isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }) => {
    const paddingToBottom = 20;
    return layoutMeasurement.height + contentOffset.y >=
        contentSize.height - paddingToBottom;
};

class TermsAndConditions extends Component {

    state = {
        accepted: false
    }

    render() {
        const { navigation } = this.props;
        return (
            <View style={styles.container}>
                {/* <Text style={styles.title}>Terms and conditions</Text> */}
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
                    <Text style={styles.tcP}>These VBN Terms of Service ("Terms'') apply to your access and use of the VBN platform and service. These Terms are an agreement between you and VBN whose business address is VBN, Hyderabad. Violation of these Terms may, in VBN's sole discretion, result in suspension or termination of your account and you may no longer be permitted to use the VBN Service.</Text>
                    <Text style={styles.tcP}>You must accept these Terms in order to create an account and access or use the "VBN Service" including software, application, website, APIs and services.</Text>
                    <Text style={styles.tcP}>Persons under the age of 18 are not permitted to access or use the VBN Service unless their parent or legal guardian has provided explicit consent in accordance with applicable law. Our website, products and services are all directed to people who are at least 18 years old.</Text>
                    <Text style={styles.tcL}>{'\u2022'} Upon acceptance by VBN of this Agreement, and for as long as you choose to utilize the VBN services, VBN will provide you access to the Business Network which can help you in expanding your business. If you are dissatisfied with the VBN Services for any reason, your sole remedy is to terminate this Agreement. The VBN Services are personal to you and may not be transferred or assigned.</Text>
                    <Text style={styles.tcL}>{'\u2022'} By accessing or using the VBN Services, you agree that we can collect, store and process your information in accordance with our Privacy Policy.</Text>
                    <Text style={styles.tcL}>{'\u2022'} If you sign up for the VBN membership, you will be subject to membership fees.</Text>
                    <Text style={styles.tcL}>{'\u2022'} Termination. You may terminate this Agreement for any reason by sending a request to developer.india@navtech.io via the Profile page of the VBN app. Thereafter, you will not be subject to any further access to VBN app. VBN reserves the right at any time to terminate this Agreement for your failure to comply with this Agreement, or failure to comply with any of the Rules and Regulations adopted by VBN, or for conduct VBN determines to be improper or contrary to the best interests of VBN.</Text>
                    <Text style={styles.tcL}>{'\u2022'} Conduct Standards. You may not post violent, nude, partially nude, discriminatory, illegal, pornographic, obscene, infringing, hateful or sexually suggestive photos or content on the VBN app. You may not sell, transfer, assign or license your account or account rights, and you are responsible for keeping your phone number and OTP secure. You cannot create an account for anyone else. You cannot solicit, collect or use anyone else's account or login credentials. You cannot defame, stalk, bully, abuse, harass, threaten, impersonate or intimidate any person or entity. Do not use the VBN Service for any illegal or unauthorized purposes. You must also comply with all applicable laws, rules and governmental regulations (whether federal, state, local or otherwise) when using the VBN Service. You are responsible for your conduct on the VBN Service and any content or materials (including, without limitation, data, text, files, information, images, photos, profiles, audio and video clips, sounds and links) you submit, post or display. You are prohibited from changing, modifying, altering or adapting the VBN Service or any other website to imply an association with the VBN Service. You must not disrupt or interfere with the VBN Service or any servers or networks associated with the Service.</Text>
                    <Text style={styles.tcL}>{'\u2022'} Third-Party Services. The VBN Service may display or permit linking or other access to or use of third-party content, promotions, websites, apps, services and resources (collectively "Third-Party Services'') that are not under VBN's control. We provide these links only as a convenience and are not responsible for the products, services, or other content that are available from Third-Party Services. You acknowledge that any Third-Party Services that you use in connection with the VBN Service are not part of the VBN Service and are not controlled by VBN, and you take sole responsibility and assume all risk arising from your interaction with or use of any Third-Party Services. You also acknowledge that these Terms and the VBN Privacy Policy does not apply to any Third-Party Services. You are responsible for reading and understanding the terms and conditions and privacy policy that applies to your use of any Third-Party Services.</Text>
                    <Text style={styles.tcL}>{'\u2022'} VBN Service changes. VBN may change or discontinue, temporarily or permanently, any feature or component of the VBN Service at any time without notice. VBN is not liable to you or to any third-party for any modification, suspension, or discontinuance of any feature or component of the VBN Service. We reserve the right to determine the timing and content of software updates, which may be automatically downloaded and installed by VBN applications without prior notice to you.</Text>
                    <Text style={styles.tcL}>{'\u2022'} Governing Law and Severability. This Agreement shall be governed and interpreted in accordance with Indian law. If for any reason a court of competent jurisdiction finds any provision of this Agreement, or portion thereof, to be unenforceable, that provision of the Agreement shall be enforced to the maximum extent permissible so as to effect the intent of the parties, and the remainder of this Agreement shall continue in full force and effect.</Text>
                    <Text style={styles.tcL}>{'\u2022'} Complete Agreement; Non-Waiver. This Agreement (as defined above) constitutes the entire agreement between the parties. This Agreement supersedes and replaces any and all prior or contemporaneous understandings or agreements, written or oral, regarding such subject matter. This Agreement can only be amended by specific written amendments signed by both parties. Any failure by either party to require strict performance by the other of any provision of this Agreement shall not constitute a waiver of such provision or thereafter affect the parties full rights to require strict performance.</Text>
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

export default TermsAndConditions;