import React, {Component} from 'react';
//import AnimatedLoader from "react-native-animated-loader";
//import * as IntentLauncher from 'expo-intent-launcher';
import {FlatList, Image, Share, ActivityIndicator, ImageBackground, StyleSheet, Text, TouchableOpacity, View, Dimensions} from 'react-native';
import * as SecureStore from 'expo-secure-store';
///import {RadioButton} from 'react-native-paper'
import * as Sharing from 'expo-sharing'
import * as FileSystem from 'expo-file-system';
import Spinner from 'react-native-loading-spinner-overlay';
import Emoji from "react-native-emoji";
import Toast from "react-native-easy-toast";

const headerback = require('../../images/image-8.png');
const menuImg = require('../../assets/menu.png');
const tickets = require('../../assets/downarrow.png');
const downarrow = require('../../assets/downarrow.png');
const gallaryblack = require('../../assets/gallaryblack.png');
const nextgray = require('../../assets/nextgray.png');
const backarrow = require('../../assets/backarrow.png');
const profile = require('../../images/image-9.png');
const messageopenblack = require('../../assets/messageopenblack.png');

const image11 = require('../../images/image-11.png');
const image12 = require('../../images/image-12.png');
const sahre = require('../../assets/sahre.png');
const listimg = require('../../images/image-18.png');
const checkblue = require('../../assets/checkblue.png');
const checkgray = require('../../images/disable-check-1.png');
const getAccessToken = async () => {
    return await SecureStore.getItemAsync('token');
};

const getUserId = async () => {
    return await SecureStore.getItemAsync('id');
};
const deviceWidth = Dimensions.get("window").width;
const deviceHeight =  Dimensions.get("window").height;

export default class DailyInspiration extends Component {

    constructor(props) {
        super(props);
        this.state = {
            data_list: [],
            checked: true,
            accessToken: '',
            itemCount: 0,
            uid: '',
            isSubmitted: false,
            challengeId: this.props.navigation.state.params.challenge_details.challenge_id,
            caterogryId: this.props.navigation.state.params.challenge_details.feature_category_id,
            featureId: 1,
            view2LayoutProps: {
              left: 0,
              top: 0,
              width: 100,
              height: 100,
            },
            showloader: false,
            day: this.props.navigation.state.params.challenge_details.day,
            week: this.props.navigation.state.params.challenge_details.week,
            offSet: 0,
            points: 0,
            offSetLoader: false,
        }
        this.renderRow = this.renderRow.bind(this);
    }

    componentDidMount() {
        getAccessToken().then(token =>
                this.setState({accessToken: token}),
            //this.getDailyInspirationApiData(token)
        );

        getUserId().then(id =>
            this.setState({uid: id}),
        );


        this.getDataObject(this.props.navigation.state.params.DATA);

    }

    getDataObject(dataObject) {
        this.setState({points: dataObject.points});

        setTimeout(() => {
            if (this.state.caterogryId != undefined) {
                this.getDailyInspirationApiData(this.state.caterogryId, this.state.challengeId, this.state.featureId, this.state.day, this.state.uid);
            }
        }, 1000)
    }


    async getDailyInspirationApiData(categoryId, challangeId, featureId, day, uid) {
        // alert(uid)
        this.setState({offSetLoader: true});
        const token_ = await SecureStore.getItemAsync('token');
        const url = global.base_url_live+'v1/api/get-daily-inspiration-all';

        var parameters = {
            token: JSON.parse(token_),
            challenge_id: challangeId,
            category_id: categoryId,
            day: day,
            uid: uid,
            feature_id: featureId,
            page_size: 3,
            data_offset: this.state.offSet
        };
        var token = `Bearer ${JSON.parse(token_)}`;
        // alert(JSON.stringify(parameters));
        fetch(url,
            {
                method: 'POST',
                headers: new Headers({
                    'Content-Type': 'application/json',
                    'Authorization': token,
                }), body: JSON.stringify(parameters),
            })
            .then(async (response) => response.text())
            .then(async (responseText) => {
                    var dataobject = JSON.parse(responseText);
                    console.log('DataObjectGet', dataobject);
                    this.setState({offSetLoader: false});
                    this.setState({itemCount: dataobject.count_records});
                    if (dataobject.count_records == 0) {
                        this.setState({offSetLoader: false});
                    }
                    this.InheritedData(dataobject);
                }
            )
            .catch((error) => {
            })
    }

    setDataList(text) {
        this.setState({data_list: this.state.data_list.concat(text)});

    }


    async  onShare(data) {
      if(data.item.image !== undefined) {
        this.setState({offSetLoader:true});
        var image_source = data.item.image;
        var imgName = image_source.substring(image_source.lastIndexOf("/")+1,image_source.length);
        FileSystem.downloadAsync(
              image_source,
              FileSystem.documentDirectory  + imgName
            )
              .then(async({ uri }) => {
                  this.setState({offSetLoader:false});
                  //let  text = 'Want more buzz around your photos on Insta, Facebook, Twitter, Whatsapp posts?\n\nLet\'s make your stories get more eyeballs..\nVisit Website https://injoyglobal.com/'
                  //text = text.concat('https://injoyglobal.com/')
                  try {
                    const result = await Share.share({
                      //message:text,
                      url: uri,
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
              })
              .catch(error => {
                console.error(error);
              });
      }
      else {
        alert('Image not loaded. Please check Image.');
      }
      };

    InheritedData(data) {
        //  alert('1')
        if (data.status == true) {
            //this.setState({offSetLoader:false});
            this.setDataList(data.daily_insp_all);


        }

    }

    async submitPoints(challangeId, featureId, day, uid, week) {
        // alert(week)
        const token_ = await SecureStore.getItemAsync('token');
        const url = global.base_url_live+'v1/api/submit-daily-inspiration-action';
        var parameters = {
            token: JSON.parse(token_),
            challenge_id: challangeId,
            feature_id: featureId,
            day: day,
            uid: uid,
            week: week
        };

        var token = `Bearer ${JSON.parse(token_)}`;

        console.log(parameters);
        fetch(url,
            {
                method: 'POST',
                headers: new Headers({
                    'Content-Type': 'application/json',
                    'Authorization': token,
                }), body: JSON.stringify(parameters),
            })
            .then(async (response) => response.text())
            .then(async (responseText) => {
                    var dataobject = JSON.parse(responseText);
                    // alert(responseText)
                    if (dataobject.status) {
                        this.setState({isSubmitted: true});
                        this.refs.toast.show(
                            <View style={{flexDirection:'row',alignItems:'center'}}>
                                <Text style={{color:'white',fontSize:12}}>Woohoooo!  </Text>
                                <Emoji name="smile" style={{fontSize: 12,color:'White',backgroundColor:'transparent'}}

                                />
                            </View>
                        )
                    }
                }
            )
            .catch((error) => {
            })


    }

    onLayout(event) {
     const {x, y, height, width} = event.nativeEvent.layout;
     const newHeight = this.state.view2LayoutProps.height + 1;
     const newLayout = {
         height: newHeight ,
         width: width,
         left: x,
         top: y,
       };
     this.setState({ view2LayoutProps: newLayout });
   }


    renderRow(dataHolder, index, length) {

        const data = dataHolder.item.user_actions.enabled_submit;
        const points = dataHolder.item.user_actions.points;
        // console.log(  points)
        const ratio = this.state.view2LayoutProps.width/dataHolder.item.dimensions.width;
        var ViewHeight = dataHolder.item.dimensions.height * ratio;
        var ViewWidth = deviceWidth - 30;

        return (
            <View style={{
                flexDirection: 'column',
                backgroundColor: 'transparent',
                marginHorizontal: 15,
                marginTop: 18,
                marginBottom: 10
            }}>

                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingBottom: 0,
                    backgroundColor: 'transparent'
                }}>


                    <Text style={{fontFamily: 'PoppinsSemiBold', fontSize: 10}}>{dataHolder.item.day}</Text>
                    <TouchableOpacity onPress={() => this.onShare(dataHolder)}>
                      <View style={{backgroundColor: 'transparent', paddingHorizontal: 7, paddingVertical: 6}}>
                        <Image source={sahre} style={{width: 25, height: 25}}>
                        </Image>
                      </View>
                    </TouchableOpacity>


                </View>


                <View style={{height: 1, backgroundColor: 'gray'}}>
                </View>
                {/* 'cover' | 'contain' | 'stretch' | 'repeat' | 'center';*/}
                <View onLayout={(event) => this.onLayout(event)}>
                <Image source={{uri: dataHolder.item.image}} style={{
                    height: ViewHeight,
                    width: '100%',
                    marginTop: 10,
                    borderRadius: 12,
                    resizeMode: 'cover'
                }}>
                </Image>
                </View>


                {data && !this.state.isSubmitted &&
                <View style={{justifyContent: 'center', alignItems: 'center'}}>

                    <TouchableOpacity
                        style={styles.login_button}
                        onPress={() => this.submitPoints(this.state.challengeId, this.state.featureId, this.state.day, this.state.uid, this.state.week)}
                    >
                        <Image source={checkgray} style={{
                            width: 15,
                            height: 15,
                            marginRight: 5,
                            alignItems: 'center',
                            resizeMode: 'contain'
                        }}>
                        </Image>

                        <Text style={{
                            fontSize: 13,
                            color: 'white',
                            fontFamily: 'PoppinsSemiBold'
                        }}> {'Submit ' + this.state.points + ' Points'}</Text>

                    </TouchableOpacity>
                </View>
                }


            </View>
        )

    }


    handeLoadMoreItem = () => {
        if (this.state.itemCount !== 0) {
            var offset = this.state.offSet;
            var addoffset = parseInt(offset + 3);
            this.setState({offSet: addoffset});

            this.getDailyInspirationApiData(this.state.caterogryId, this.state.challengeId, this.state.featureId, this.state.day, this.state.uid)
        }
    }
    // footerComponent = () => {
    //     // const data = this.state.offSetLoader;
    //
    //     if(this.state.offSetLoader)
    //     {
    //     return (
    //           <View style={{backgroundColor: 'transparent', zIndex: 99, position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, justifyContent: 'center', alignItems:'center'}}>
    //               <ActivityIndicator color="#000000" size="large"/>
    //           </View>
    //     )
    //     }
    //
    //
    // }

    headerComponent = () => {
        // const data = this.state.offSetLoader;
        if (this.state.data_list.length !== 0) {
            return (

                <TouchableOpacity style={styles.login_button}>
                    {/* <RadioButton
                value={this.state.checked}
                status={this.state.checked  ? 'checked' : 'unchecked'}

                    //onPress={() =>  this.onCheckBoxPressed() }
                /> */}
                    <Text
                        style={{fontSize: 13, color: 'white', fontFamily: 'PoppinsSemiBold'}}> GRAB 10 POINTS </Text>
                </TouchableOpacity>
            )
        } else {
            return (
                <View></View>
            )
        }


    }

    shiftBack() {
      var obj={'uid': this.state.uid, 'challenge_id': this.state.challengeId, 'week': this.state.week, 'day': this.state.day, 'category_id': this.state.caterogryId}
      this.props.navigation.state.params.onGoBack(obj);
      this.props.navigation.goBack();
    }


    _keyExtractor = (item, index) => item.id + '' + index;


    render() {

        return (
            <View style={styles.container}>
                {/* Header View */}
                <View style={styles.header_view}>
                    <ImageBackground source={headerback} style={styles.header_image}>
                        {/* Header items View */}
                        <View style={styles.header_items}>
                            <TouchableOpacity onPress={() => this.shiftBack()}>
                                <Image source={backarrow} style={styles.menu}>
                                </Image>
                            </TouchableOpacity>
                            <View style={{
                                flexDirection: 'row',
                                marginLeft: 0,
                                alignContent: 'center',
                                justifyContent: 'center', backgroundColor: 'transparent',
                                flex: 1
                            }}>
                                <Text style={{fontFamily: 'PoppinsBold', color: '#fff', fontSize: 18}}>Daily Inspiration
                                </Text>

                            </View>

                            <View style={styles.menu}>
                            </View>
                        </View>
                    </ImageBackground>

                </View>
                {/* Ended Header View */}

                <Toast
                    ref="toast"
                    style={{backgroundColor: '#4AAFE3',borderRadius:90}}
                    position='top'
                    positionValue={100}
                    fadeInDuration={700}
                    fadeOutDuration={900}
                    opacity={0.8}
                    textStyle={{color:'#fff'}}
                />
                <FlatList
                    style={{flex: 1, marginTop: 0}}
                    data={this.state.data_list}
                    renderItem={this.renderRow}
                    keyExtractor={this._keyExtractor}
                    onEndReached={this.handeLoadMoreItem}
                    onEndReachedThreshold={0.5}
                >

                </FlatList>

                {this.state.offSetLoader &&
                    <View style={{backgroundColor: 'transparent', zIndex: 99, position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, justifyContent: 'center', alignItems:'center'}}>
                        <ActivityIndicator color="#000000" size="large"/>
                    </View>
                }


                {/*<AnimatedLoader*/}
                {/*    visible={this.state.offSetLoader}*/}
                {/*    overlayColor="rgba(255,255,255,0.75)"*/}
                {/*    source={require("./../loader/loader.json")}*/}
                {/*    animationStyle={{width: 100, height: 100}}*/}
                {/*    speed={1}*/}
                {/*/>*/}

            </View>
        );


    }


    onCheckBoxPressed() {

        if (this.state.checked) {
            this.setState({checked: false})
        } else {
            this.setState({checked: true})
        }
    }
}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: 'white'
    },
    header_view: {
        height: 90,

    },

    header_items: {
        height: 50,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'transparent',
        marginTop: 35,
    },
    header_image: {
        flex: 1,
        height: 90
    },

    menu: {
        width: 25,
        height: 25,
        marginLeft: 15,


    },
    login_button: {
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        backgroundColor: '#4AAFE3',
        borderWidth: 1,
        //width: '75%',
        paddingVertical: 5,
        paddingHorizontal: 20,
        borderColor: '#4AAFE3', marginHorizontal: 0,
        borderRadius: 25, marginBottom: 5, marginTop: 20
    },


    profile: {
        width: 60,
        height: 60,
    },

    name_view: {

        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
        height: 50,
        width: '92%',
        marginHorizontal: 15,
        backgroundColor: 'white',
        borderColor: 'lightgray',
        borderWidth: 1
    },

    email_view: {

        flexDirection: 'row',
        alignItems: 'center',

        height: 50,
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
    }, loader: {
        marginTop: 5, alignItems: 'center', height: 60
    }
});
