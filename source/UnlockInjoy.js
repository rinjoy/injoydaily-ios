import React from 'react';
import {Dimensions, Image, Text, StyleSheet, ImageBackground, TouchableOpacity, View, StatusBar} from 'react-native';
import {Camera} from 'expo-camera';

const headerback = require('./../images/image-8.png');
const menuImg = require('./../assets/menu.png');
const tickets = require('./../assets/downarrow.png');
const downarrow = require('./../assets/downarrow.png');
const gallaryblack = require('./../assets/gallaryblack.png');
const nextgray = require('./../assets/nextgray.png');
import ModalPremium from './modals/ModalPremium';
import Modal from 'react-native-modal';
const backg = require('./../images/bg_popup.png');
const cameraicon = require('./../assets/iconcamera.png');
const backarrow = require('./../assets/backarrow.png');
const leftBackArrow = require('./../assets/leftArrow.png');
const profile = require('./../images/image-9.png');
const star = require('./../images/star.png');
const crossarrow = require('./../images/close.png');
const star_sun = require('./../images/sun-2.png');
const messageopenblack = require('./../assets/messageopenblack.png');
import ModalUpdateShoutOut from './modals/ModalUpdateShoutOut';

const deviceWidth = Math.round(Dimensions.get('window').width);
const deviceHeight = Math.round(Dimensions.get('window').height);

export default class UnlockInjoy extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
          premiumModal: false,
        }
        this.premium = this.premium.bind(this);
    }


    componentDidMount() {


    }

    premium() {
      this.setState({premiumModal: !this.state.premiumModal})
    }


    render() {

        return (
          <View>
          <Modal style={{marginLeft: 10, marginRight: 10, marginBottom: 0, marginTop: StatusBar.currentHeight}} transparent={true} deviceWidth={deviceWidth}
         deviceHeight={deviceHeight} coverScreen={true} hasBackdrop = {false} isVisible={this.state.premiumModal} >

         <View style={{flex: 1, height:'100%' , width: '100%', backgroundColor: 'white', padding: 0, margin: 0}}>
             <TouchableOpacity
                 style={{zIndex:99,backgroundColor:'transparent', width: 20, height: 25,left:-15,right:0,bottom:0,top:30,alignItems:'center',alignSelf:'flex-end'}}
                 onPress={this.premium}>
                 <View style={{justifyContent: 'flex-end', paddingTop: 10, paddingRight: 15, backgroundColor: 'transparent', alignItems: 'flex-end'}}>
                     <Image source={crossarrow} style={{width: 12, height: 12, marginLeft: 0}}/>
                 </View>
             </TouchableOpacity>
         <ImageBackground resizeMode= 'contain' source={backg} style={{flex: 1, height: '100%', width: '100%'}}>
           <View style={{padding: 0}}>

                 <ModalPremium
                 closeModal={this.premium}
                 nav={this.props.nav}/>
           </View>
          </ImageBackground>
         </View>
         </Modal>

            <View style={styles.unlock_style}>

            <TouchableOpacity onPress={this.premium}>
            <View>
            <View style={{marginTop: 10, marginBottom: 10, justifyContent: 'center', alignItems: 'center'}}>
                <Text style={{fontSize: 18, fontFamily: 'PoppinsBold'}}>Unlock Injoy Premium</Text>
                {/*<Text style={{fontSize: 18, fontFamily: 'PoppinsBold'}}>Free for 7 Days!</Text>*/}
            </View>

            <View style={{backgroundColor: '#fff', borderRadius: 10, marginBottom: 15, marginTop: 12, marginLeft: 15, marginRight: 15, padding: 15}}>

              <View style={{flexDirection: 'row', flex: 1, marginTop: 10}}>
                  <View style={{flex: 0.16, justifyContent: 'center', alignItems: 'flex-start'}}>
                    <Image source={star} style={{height: 30, width: 30}}>
                    </Image>
                  </View>
                  <View style={{flex: 0.84}}>
                    <Text style={{fontFamily: 'PoppinsSemiBold'}}>Get Aceess to the world's most sought after coaches</Text>
                  </View>
              </View>

              <View style={{flexDirection: 'row', flex: 1, marginTop: 25}}>
                  <View style={{flex: 0.16, justifyContent: 'center', alignItems: 'flex-start'}}>
                      <Image source={star} style={{height: 30, width: 30}}>
                      </Image>
                  </View>
                  <View style={{flex: 0.84}}>
                    <Text style={{fontFamily: 'PoppinsSemiBold'}}>Join 30 days Challenges designed to make positive change a fun game</Text>
                  </View>
              </View>

              <View style={{flexDirection: 'row', flex: 1, marginTop: 25, marginBottom: 10}}>
                  <View style={{flex: 0.16, justifyContent: 'center', alignItems: 'flex-start'}}>
                      <Image source={star} style={{height: 30, width: 30}}>
                      </Image>
                  </View>
                  <View style={{flex: 0.84}}>
                    <Text style={{fontFamily: 'PoppinsSemiBold'}}>Get curated content handpicked to help you be your best</Text>
                  </View>
              </View>

              <View style={{backgroundColor: '#7BD1FD', borderRadius: 25, flexDirection: 'row', paddingVertical: 10,  marginTop: 15, marginBottom: 5, justifyContent: 'center', alignItems: 'center'}}>
                <Text style={{fontSize: 17, fontFamily: 'PoppinsBold'}}>Unlock Injoy Premium</Text>
                <Image source={star_sun}
                       style={{height: 20, width: 20, marginLeft: 8}}/>
              </View>
              </View>
            </View>
            </TouchableOpacity>
            </View>



            </View>
        )
            ;

    }
}


const styles = StyleSheet.create({
    unlock_style: {
      borderRadius: 25,
      marginLeft: 15,
      marginTop: 5,
      marginRight: 15,
      backgroundColor: '#7BD1FD',
      marginBottom: 20,
      elevation: 3,
      shadowColor: "#000000",
      shadowOpacity: 0.5,
      shadowRadius: 2,
      shadowOffset: {
          height: 1,
          width: 1,
      }
    },

    container: {
        flex: 1,

    },

    sheader_view: {
        height: 90,

    }, header_view: {
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
        marginLeft: 15, backgroundColor: 'transparent'


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
        width: '100%',
        marginHorizontal: 0,
        backgroundColor: 'white',
        borderColor: 'lightgray',
        borderWidth: 1
    },

    email_view: {

        flexDirection: 'row',
        height: 180, alignItems: 'flex-start',
        width: '100%',
        marginHorizontal: 0,
        backgroundColor: 'white',
        borderColor: 'lightgray',
        borderWidth: 1,
        marginTop: 8
    },
    upload_imageView: {

        flexDirection: 'row',
        height: 75, alignItems: 'center', justifyContent: 'center',
        width: '100%',
        marginHorizontal: 0,
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
});
