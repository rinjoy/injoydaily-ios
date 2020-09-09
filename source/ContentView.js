import React from 'react';
import PropTypes from 'prop-types';
import { Dimensions, StyleSheet, ScrollView, View, Image,Text,Alert} from 'react-native';

const window = Dimensions.get('window');
const profile = require('./../images/image-9.png')
const dashboard = require('./../assets/rectboxes.png')
const settingsgray = require('./../assets/settingsgray.png')
const cupgray = require('./../assets/cupgray.png')
const iicongay = require('./../assets/iicongay.png')
const usergray = require('./../assets/usergray.png')
const mesageopengray = require('./../assets/mesageopengray.png')
const logout = require('./../assets/logout.png');
const terms = require('./../assets/Terms.png');
const privacy = require('./../assets/Privacy.png');

Menu.propTypes = {
    onItemSelected: PropTypes.func.isRequired,
    userProfile :PropTypes.string,
    userName :PropTypes.string,
};




export default function Menu({ onItemSelected ,userProfile,userName}) {
///alert(JSON.stringify(userName));
  return (
    <ScrollView scrollsToTop={false} style={styles.menu}>
          <View style={styles.avatarContainer}>

                <View style={{marginLeft:12}}>

                    {userProfile == null &&
                    <Image style={styles.avatar} source={ profile }/>
                    }
                    {userProfile != null &&
                    <Image style={styles.avatar} source={ {uri:userProfile} }/>
                    }
                    <Text style={{color:'#84d3fd',fontFamily:'PoppinsSemiBold',marginTop:12,marginLeft:-5}}> Welcome </Text>
                    <Text style={{fontFamily:'PoppinsBold',fontSize:16,marginLeft:-5}}> {userName}</Text>
                </View>

            <View style={{flexDirection:'row',width:'65%',alignItems:'center',marginTop:20,marginLeft:10}}>
                <Image source={dashboard} style={{width:12,height:12}}>
                </Image>
                <Text
                    onPress={() => onItemSelected('DashBoard')}
                    style={{marginLeft:20,height:30,marginTop:10,fontFamily:'PoppinsRegular',fontSize:13}}> DashBoard
                </Text>
            </View>

            <View style={{flexDirection:'row',width:'65%',alignItems:'center',marginLeft:10}}>
                <Image source={settingsgray} style={{width:12,height:12}}>
                </Image>
                <Text
                    onPress={() => onItemSelected('HowItWorks')}
                    style={{marginLeft:20,height:30,marginTop:10,fontFamily:'PoppinsRegular',fontSize:13,color:'gray'}}> How It Works
                </Text>
            </View>


            <View style={{flexDirection:'row',width:'65%',alignItems:'center',marginLeft:10}}>
                <Image source={cupgray} style={{width:12,height:12}}>
                </Image>
                <Text
                    onPress={() => onItemSelected('ContestRules')}
                    style={{marginLeft:20,height:30,marginTop:10,fontFamily:'PoppinsRegular',fontSize:13,color:'gray'}}> Contest Rules
                </Text>
            </View>


            <View style={{flexDirection:'row',width:'65%',alignItems:'center',marginLeft:10}}>
                <Image source={iicongay} style={{width:12,height:12}}>
                </Image>
                <Text
                    onPress={() => onItemSelected('TechSupport')}
                    style={{marginLeft:20,height:30,marginTop:10,fontFamily:'PoppinsRegular',fontSize:13,color:'gray'}}> Tech Support
                </Text>
            </View>

            <View style={{flexDirection:'row',width:'65%',alignItems:'center',marginLeft:10}}>
                <Image source={usergray} style={{width:12,height:12}}>
                </Image>
                <Text
                    onPress={() => onItemSelected('Account')}
                    style={{marginLeft:20,height:30,marginTop:10,fontFamily:'PoppinsRegular',fontSize:13,color:'gray'}}> My Account
                </Text>
            </View>

            <View style={{flexDirection:'row',width:'65%',alignItems:'center',marginLeft:10}}>
                <Image source={mesageopengray} style={{width:12,height:12}}>
                </Image>
                <Text
                    onPress={() => onItemSelected('Invite')}
                    style={{marginLeft:20,height:30,marginTop:10,fontFamily:'PoppinsRegular',fontSize:13,color:'gray'}}> Invite
                </Text>
            </View>

              <View style={{flexDirection:'row',width:'65%',alignItems:'center',marginLeft:10}}>
                  <Image source={terms} style={{width:14,height:11}}>
                  </Image>
                  <Text
                      onPress={() => onItemSelected('TermsConditions')}
                      style={{marginLeft:20,height:30,marginTop:10,fontFamily:'PoppinsRegular',fontSize:13,color:'gray'}}> Terms & Conditions
                  </Text>
              </View>

              <View style={{flexDirection:'row',width:'65%',alignItems:'center',marginLeft:10}}>
                  <Image source={privacy} style={{width:14,height:11}}>
                  </Image>
                  <Text
                      onPress={() => onItemSelected('PrivacyPolicy')}
                      style={{marginLeft:20,height:30,marginTop:10,fontFamily:'PoppinsRegular',fontSize:13,color:'gray'}}> Privacy Policy
                  </Text>
              </View>

            <View style={{flexDirection:'row',width:'65%',alignItems:'center',marginLeft:10}}>
                <Image source={logout} style={{width:14,height:11}}>
                </Image>
                <Text
                    onPress={() => Alert.alert('Are you sure you want to log out?' ,'',[{text: 'Cancel', onPress: () => onItemSelected('')}, {text: 'Yes', onPress: () => onItemSelected('logout'),style: 'destructive'}])}
                    style={{marginLeft:20,height:30,marginTop:10,fontFamily:'PoppinsRegular',fontSize:13,color:'gray'}}> Log Out
                </Text>
            </View>

        </View>
    </ScrollView>

  );


}


const styles = StyleSheet.create({
    menu: {
        flex: 1,
        width: window.width,
        height: window.height,
        backgroundColor: 'white',
        padding: 5,
    },

    avatarContainer: {
        marginBottom: 20,
        marginTop: 50,
    },

    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        flex: 1,
    },
});

