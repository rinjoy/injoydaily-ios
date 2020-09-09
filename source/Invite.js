import React, {Component} from 'react';
import {Dimensions, Image, ImageBackground, StyleSheet, Text, Share, Clipboard, Linking, TouchableOpacity, ScrollView,View} from 'react-native';
import Modal from "react-native-modal";
import * as SecureStore from "expo-secure-store";
import Toast, {DURATION} from 'react-native-easy-toast';
import Emoji from "react-native-emoji";
const crossarrow = require('./../images/a-2.png');
const message = require('./../images/message.png');
const emailblue = require('./../images/emailblue.png');
const whatsup = require('./../images/whatsuo.png');
const cropp = require('./../images/cropp.png');
const forwardd = require('./../images/share.png');
const forlogo = require('./../images/forlogo.png');
const headerback = require('./../images/image-8.png')
const sun = require('./../images/sun_animation.gif');
const menuImg = require('./../assets/menu.png')
const tickets = require('./../assets/downarrow.png')
const facebook = require('./../images/fbb.png')
const downarrow = require('./../assets/downarrow.png')
const gallaryblack = require('./../assets/gallaryblack.png')
const nextgray = require('./../assets/nextgray.png')
const backarrow = require('./../assets/backarrow.png')
const profile = require('./../images/image-9.png')
const messageopenblack = require('./../assets/messageopenblack.png')

let facebookParameters = ""
const deviceWidth = Dimensions.get("window").width;
const deviceHeight = Dimensions.get("window").height;
const getUserId = async () => {
    return await SecureStore.getItemAsync('id');
};


export default class Invite extends Component {

    constructor(props) {
        super(props)
        this.state = {
            isVisible: true,
            UID: 0,
            count_shared: 0,
            referral_link: '',
            accessToken: '',
            sharingContent:[
                {
                    url:facebook,
                    title:'Message'
                },
                {
                    url:message,
                    title:'Message'
                },
                {
                    url:emailblue,
                    title:'Message'
                },
                // {
                //     url:whatsup,
                //     title:'Message'
                // },
                //
                // {
                //     url:forwardd,
                //     title:'Message'
                // }
            ]
        }
    }

    componentDidMount() {
        getUserId().then(id =>
            this.setState({UID: id}),
        );
        this.getAccessToken();
    }

    async getAccessToken() {
        var token = await SecureStore.getItemAsync('token');
        this.setState({accessToken: JSON.parse(token)});

        if (this.state.accessToken = !'') {
                this.getInvitationLink();
        }
    }

    async getInvitationLink() {
        // this.setState({offSetLoader:true});
        const token_  =await SecureStore.getItemAsync('token');
        const url = global.base_url_live+'v1/api/generate-referral-link';

        var parameters = {
            uid:this.state.UID,
        };

        var token = `Bearer ${JSON.parse(token_)}`;

        fetch(url,
            {
                method: 'POST',
                headers: new Headers({
                    'Content-Type': 'application/json',
                    'Authorization': token,
                }),body: JSON.stringify(parameters),
            })
            .then(async (response) => response.text())
            .then(async (responseText) => {
                    var dataobject = JSON.parse(responseText);
                    if(dataobject.status) {
                        console.log('dataobject', dataobject);
                        this.setState({count_shared: dataobject.count_shared});
                        this.setState({referral_link: dataobject.referral_link});
                    }
                    else{
                        alert('Something Went Wrong');
                    }
                }
            )
            .catch((error) => {
                alert(' Exception causes' + error)
            })
    }

    shareFacebook = () => {
      let FacebookShareURL = this.state.referral_link;
      //let FacebookShareURL = 'https://aboutreact.com';
      let FacebookShareMessage = 'Install Injoy daily app today with link';
      if(FacebookShareURL != undefined)
      {
          if(facebookParameters.includes("?") == false)
          {
              facebookParameters = facebookParameters+"?u="+encodeURI(FacebookShareURL);
          }else{
              facebookParameters = facebookParameters+"&u="+encodeURI(FacebookShareURL);
          }
      }
      if(FacebookShareMessage != undefined)
      {
          if(facebookParameters.includes("?") == false)
          {
              facebookParameters = facebookParameters+"?quote="+encodeURI(FacebookShareMessage);
          }else{
              facebookParameters = facebookParameters+"&quote="+encodeURI(FacebookShareMessage);
          }
      }
      let url = 'https://www.facebook.com/sharer/sharer.php'+facebookParameters;
      Linking.openURL(url).then((data) => {
        //alert('Facebook Opened');
      }).catch(() => {
        alert('Something went wrong');
      });
    }

    shareMessage = () => {
        var message = 'Install Injoy daily app today with link '+this.state.referral_link;
        Linking.openURL(`sms:&body=`+message);
    }

    shareMail = () => {
        var subject = 'Injoy daily Invitation';
        var message = 'Install Injoy daily app today with link '+this.state.referral_link;
        Linking.openURL('mailto:?subject='+subject+'&body='+message)
    }

    shareWtsapp = () => {
        var message = 'Install Injoy daily app today with link '+this.state.referral_link;
        //Linking.openURL('whatsapp://send?text=hello&phone=xxxxxxxxxxxxx')
        Linking.openURL('whatsapp://send?text='+message)
    }

    shareGlobal = async() => {
        try {
            const result = await Share.share({
                url: this.state.referral_link,
                message:'Install Injoy daily app today with link',
            });
            if (result.action === Share.sharedAction) {
                if (result.activityType) {
                    console.log('Activity Type', result.activityType);
                } else {
                    console.log('Shared');
                }
            } else if (result.action === Share.dismissedAction) {
                console.log('Dismissed');
            }
        } catch (error) {
            alert(error.message);
        }
    }

    copyClipBoard() {
        Clipboard.setString(this.state.referral_link);
        this.refs.toast.show(
            <View style={{alignItems:'center', backgroundColor: '#fff', justifyContent: 'center', width: 70}}>
                <Text style={{color:'black',fontSize:15, fontFamily: 'PoppinsRegular'}}>Copied</Text>
            </View>
        )
    }

    renderSharingContent(){
        return(
            this.state.sharingContent.map((item,index)=>{
                return(
                <TouchableOpacity style={{marginLeft:13, marginRight: 13}} onPress={() =>
                {
                    if(index == 0){
                        this.shareFacebook()
                    }
                    else if(index == 1){
                        this.shareMessage()

                    }
                    else if(index == 2){
                        this.shareMail()
                      //  this.shareWtsapp()
                    }
                    else{
                        this.shareGlobal()
                }

                }}>
                    <Image source={item.url} style={styles.sharingimage}></Image>
                </TouchableOpacity>
                )
            })
        )
    }



    render() {
        return (
            <View style={styles.container}>
                <Modal style={{
                    marginLeft: 0, marginRight: 0, marginBottom: 0,
                    marginTop: 35, borderRadius: 20, borderColor: 'white', borderWidth: 5, backgroundColor: '#fff'
                }} transparent={true} deviceWidth={deviceWidth}
                       deviceHeight={deviceHeight} coverScreen={false} hasBackdrop={false}
                       isVisible={this.state.isVisible}>
                    <ScrollView style={{
                        flex: 1,
                        height: '100%',
                        width: '100%',
                        backgroundColor: 'white',
                        padding: 0, borderRadius: 20,
                        margin: 0
                    }}>
                        <View style={{
                            width: deviceWidth,
                             marginTop: 0, backgroundColor: 'transparent'
                        }}>

                            <View style={{flex: 1, backgroundColor: '#fff', alignItems: 'center', marginTop: 20}}>
                                <Text style={{fontSize: 27, fontFamily: 'PoppinsBold', color: '#626161'}}>Invite
                                    Friends</Text>
                            </View>


                            <View style={{flex: 1, justifyContent: 'center', alignItems: 'flex-end', backgroundColor: 'transparent'}}>

                                <TouchableOpacity
                                    onPress={() => [this.setState({isVisible: false}), this.props.navigation.goBack()]}>
                                    <View style={{
                                        justifyContent: 'flex-end',
                                        paddingTop: 0,
                                        paddingHorizontal: 15,
                                        backgroundColor: 'transparent',
                                        alignItems: 'flex-end'
                                    }}>
                                        <Image source={crossarrow}
                                               style={{width: 18, height: 18, marginRight: 10, marginBottom: 5}}/>
                                    </View>
                                </TouchableOpacity>
                            </View>

                          <View style={{flex: 1, backgroundColor: '#fff', paddingHorizontal: 15, aignItems: 'center'}}>
                                <Text style={{fontSize: 18, fontFamily: 'PoppinsBold', marginTop: 5, textAlign: 'center'}}
                                      numberOfLines={1}>The best way to multiply your</Text>
                                <Text style={{fontSize: 18, fontFamily: 'PoppinsBold', textAlign: 'center'}} numberOfLines={1}>happiness is to share it with others.</Text>
                            </View>

                        </View>

                        <View style={{alignItems: 'center', justifyContent: 'center'}}>
                        <Image source={sun} style={{width: 230, height: 200, marginTop: 0}}/>
                        </View>

                        <Text style={{fontSize: 16, fontFamily: 'PoppinsRegular', marginTop: 0, alignSelf: "center"}}
                              numberOfLines={1}>Who do you know that deserves</Text>
                        <Text style={{fontSize: 16, fontFamily: 'PoppinsRegular', alignSelf: "center"}}
                              numberOfLines={1}>more happiness?</Text>
                        <Text style={{fontSize: 18, fontFamily: 'PoppinsBold', marginTop: 30, alignSelf: "center"}}
                              numberOfLines={1}>Please share today!</Text>
                        <View style={{
                            height: 70,
                            marginTop: 8,
                            backgroundColor: 'transparent',
                            alignItems: 'center',
                            flexDirection: 'row',
                            justifyContent: 'center'
                        }}>

                            {this.renderSharingContent()}

                        </View>


                        <Toast
                            ref="toast"
                            style={{backgroundColor: '#fff',borderRadius:90}}
                            position='bottom'
                            positionValue={75}
                            fadeInDuration={700}
                            fadeOutDuration={900}
                            opacity={0.8}
                            textStyle={{color:'#fff'}}
                        />


                        <TouchableOpacity onPress={()=>this.copyClipBoard()} style={{alignSelf:'center',
                            height: 40, backgroundColor: '#4AAFE3',
                          alignItems:'center',  flexDirection: 'row',
                            width: '55%', borderRadius: 45, marginTop: 25,justifyContent:'center',shadowColor: "#000",
                            shadowOffset: {
                                width: 0,
                                height: 3,
                            },
                            shadowOpacity: 0.27,
                            shadowRadius: 4.65,

                            elevation: 6,
                        }}>
                            {/*<Image source={cropp} style={{height:19,width:19}}></Image>*/}
                             <Text style={{color:'white',fontSize:19 ,fontFamily:'PoppinsSemiBold'}}>Copy Link</Text>
                        </TouchableOpacity>


                        <Image source={forlogo} style={styles.bottomView}></Image>
                    </ScrollView>
                </Modal>
                {/*position: 'absolute', //Here is the trick*/}
                {/*bottom: 0, //Here is the trick*/}

                {/* Header View */}
                {/* <View style={styles.header_view}>
                    <ImageBackground source={headerback} style={styles.header_image}>
                         Header items View
                        <View style={styles.header_items}>
                            <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
                                <Image source={backarrow} style={styles.menu}>
                                </Image>
                            </TouchableOpacity>
                            <View style={{
                                flexDirection: 'row',
                                marginLeft: 10,
                                alignContent: 'center',
                                justifyContent: 'center',
                                width: '70%'
                            }}>
                                <Text style={{fontFamily: 'PoppinsBold', fontSize: 18}}> Invite
                                </Text>
                            </View>

                        </View>
                    </ImageBackground>

                </View>*/}
                {/* Ended Header View */}

                {/*   <View style={{height: 30, alignItems: 'center', flexDirection: 'row', marginLeft: 15, marginTop: 20}}>
                    <Image style={{width: 15, height: 14}} source={messageopenblack}>
                    </Image>
                    <Text style={{fontFamily: 'PoppinsRegular', marginLeft: 5}}> Email a Friend
                    </Text>
                </View>

                <View style={styles.name_view}>
                    <TextInput placeholder='Name' style={{width: '88%', marginLeft: 10}}>
                    </TextInput>
                </View>

                <View style={styles.email_view}>
                    <TextInput placeholder='Email Addreass' style={{width: '78%', marginLeft: 10}}>
                    </TextInput>
                </View>

                <TouchableOpacity style={{
                    borderWidth: 1.5,
                    backgroundColor: 'black',
                    marginHorizontal: 15,
                    height: 45,
                    marginTop: 10,
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 2
                }}>
                    <Text style={{marginLeft: 10, fontFamily: 'PoppinsBold', fontSize: 11, color: 'white'}}>SEND
                        INVITATION </Text>
                </TouchableOpacity>
*/}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    bottomView: {
        width: 120,
        height: 80,alignSelf:'center',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop:35, //Here is the trick
    },
    container: {
        flex: 1,
        backgroundColor: 'transparent'
    },
    header_view: {
        height: 90,

    },

    header_items: {
        height: 50,
        flexDirection: 'row',
        alignItems: 'center',

        marginTop: 40,
    },
    header_image: {
        flex: 1,
        height: 90
    },

    menu: {
        width: 28,
        height: 18,
        marginLeft: 15,


    },
    sharingimage: {
        height: 60, width: 60, marginRight: 7, shadowColor: "#000", resizeMode: 'contain',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.20,
        shadowRadius: 1.41,

        elevation: 2,
    },

    profile: {
        width: 60,
        height: 60,
    },

    name_view: {

        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
        height: 42,
        width: '92%',
        marginHorizontal: 15,
        backgroundColor: 'white',
        borderColor: 'lightgray',
        borderWidth: 1
    },

    email_view: {

        flexDirection: 'row',
        alignItems: 'center',

        height: 42,
        width: '92%',
        marginHorizontal: 15,
        backgroundColor: 'white',
        borderColor: 'lightgray',
        borderWidth: 1,
        marginTop: 8
    },

    image_continer: {
        marginLeft: 8,
        width: 11,
        height: 14
    },
    passwordimage_continer: {
        marginLeft: 12,
        width: 18,
        height: 13
    },
})
