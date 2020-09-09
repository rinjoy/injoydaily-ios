import React from 'react'
import {Dimensions, Image, ImageBackground, ScrollView, Linking, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {SceneMap, TabBar, TabView} from 'react-native-tab-view';
import * as SecureStore from "expo-secure-store";
import Loader from "../loader/Loader";
import {Video} from 'expo-av';
import HTML from "react-native-render-html";
import ViewMoreText from 'react-native-view-more-text';
const playButton = require('../../images/play-btn.png');
const arrowfor = require('../../images/arrowfor.png');

const headerback = require('../../images/image-8.png');
const menuImg = require('../../assets/menu.png');
const one = require('../../assets/1.png');
const two = require('../../assets/2.png');
const three = require('../../assets/3.png');
const four = require('../../assets/4.png');
const five = require('../../assets/5.png');

const whatsup = require('../../images/whatsuo.png');

const profile = require('../../images/image-9.png');
const calendar = require('../../assets/calendar.png');
const library = require('../../assets/gallary.png');
const user = require('../../assets/user.png');
const backarrow = require('../../images/backarrow.png');
const image11 = require('../../images/image-11.png');
const orangearrow = require('../../images/orangearrow.png');
const defaultLogo = require('../../images/defaultLogo.png');
const image12 = require('../../images/image-12.png');
const image13 = require('../../images/image-13.png');
const hands = require('../../images/handsblue.png');
const commentblue = require('../../images/commentblue.png');
const cellimage = require('../../images/image-19.png');
const challenge = require('../../images/image-10.png');
const checkblue = require('../../assets/checkblue.png');
const checkgray = require('../../images/checkgray.png');
const nextarrow = require('../../assets/nextarrow.png');



const screenWidth = Math.round(Dimensions.get('window').width);
const screenHeight = Math.round(Dimensions.get('window').height);


const renderTabBar = props => (
    <TabBar
        {...props}

        activeColor='#19bffd'
        inactiveColor='#000000'
        indicatorStyle={{backgroundColor: '#19bffd'}}
        getLabelText={({route}) => route.title}
        labelStyle={{fontFamily: 'PoppinsMedium', fontSize: 17}}
        style={{backgroundColor: 'transparent', height: 50}}
    />
);


const getAccessToken = async () => {
    return await SecureStore.getItemAsync('token');
};

const getUserId = async () => {
    return await SecureStore.getItemAsync('id');
};

const getChallangeId = async () => {
    return await SecureStore.getItemAsync('USERCHALLANGEIDNEW');

}

export default class CoachesSeeAll extends React.Component {


    constructor(props) {
        super(props);
        this.state = {
            index: 0,
            routes: [
                {key: 'first', title: 'Coach Profile'},
                {key: 'second', title: "Coach's Corner"},

            ],
            offSetLoader: false,
            uid: '',
            accessToken: '',
            challangeId: '',
            coachId: '',
            shouldPlay: false,
            isPause: true,
            coachCorner: [],
            coachProfile: '',
            coachName: '',
            coachDesc: '',
            coachDesignation: '',
            questionAnswer:[],
            secondRouteContent:false
        }
        this.renderQuestionAnswers = this.renderQuestionAnswers.bind(this);
    }

    componentDidMount() {
        //alert(JSON.stringify(this.props.navigation.state.params.COACHID))
        this.setState({coachId: this.props.navigation.state.params.COACHID})
        getAccessToken().then(token =>
                this.setState({accessToken: token}),
            // this.getDailyInspirationApiData(token)
        );

        getUserId().then(uid =>
            this.setState({uid: uid})
        )
        getChallangeId().then(id =>
            this.setState({challangeId: id}),
        )

        if (this.state.uid != undefined) {
            setTimeout(() => {
                this.setState({offSetLoader: true});
                this.getChallanges();
            }, 1000)
        }


    }


    async getChallanges() {
        //alert(this.state.coachId)
        const token_ = await SecureStore.getItemAsync('token');
        const url = global.base_url_live+'v1/api/get-library-coach-profile-content';
        //alert(this.state.uid);
        var parameters = {
            token: JSON.parse(token_),
            "uid": this.state.uid,
            "challenge_id": this.state.challangeId,
            "coach_id": this.state.coachId
        };
        var token = `Bearer ${JSON.parse(token_)}`;
        // alert(JSON.stringify(parameters));
        fetch(url,
            {
                method: 'POST',
                headers: new Headers({
                    'Content-Type': 'application/json',
                    'Authorization': token,
                }), body: JSON.stringify(parameters)
            })
            .then(async (response) => response.text())
            .then(async (responseText) => {
                    var dataobject = JSON.parse(responseText);
                    console.log('See All', dataobject);

                    //alert(JSON.stringify(responseText))
                    if (dataobject.status) {
                        // this.setState({})
                        this.InheritedData(dataobject);

                    }


                }
            )
            .catch((error) => {
            })
    }

    InheritedData(data) {
        if (data.status == true) {
            //alert('ji')
         //   console.log("ALL DATA=>" + JSON.stringify(data))
            this.setCoachCorner(data.content.coach_profile, data.content.coach_corner_content);
            //this.setCoachCorner(data.content.coach_corner_content);
           // console.log("DATA IN INHERITED DATA==>"+JSON.stringify(data.content.coach_corner_content))
        }
    }


    setCoachCorner(text, text1) {
       // console.log('text1 type is ==>'+typeof text1+"   value is ==>"+text1)
        this.setState({coachProfile: text.image_name})
        this.setState({coachName: text.name})
        this.setState({coachDesc: text.description})
        this.setState({coachDesignation: text.designation})

        if (text1 == null || text1 == 'null') {
            this.setState({secondRouteContent: true,offSetLoader: false});
              // alert("null");

        } else {
            //alert('not null')
            this.setState({secondRouteContent: false,
                //description1: text1.description1,
                //coachCornerDesignation:text1.designation,description2: text1.description2,
                 coachCorner: text1,
                //coachCornerName: text1.name,
                //questionAnswer:text1.question_description
                 })
        }
        this.setState({offSetLoader: false});
    }

    loaderView = () => {
        return (

            <Loader loaderVal={this.state.offSetLoader}/>
        )
    };

    renderViewMore(onPress){
      return(
        <Text onPress={onPress}>View more</Text>
      )
    }
    renderViewLess(onPress){
      return(
        <Text onPress={onPress}>View less</Text>
      )
    }

    FirstRoute = () => {
        // const {coachProfile} = this.state;
        // if (coachProfile != undefined)
        // console.log("DATA ", this.state.coachName)

        return (<View style={{flex: 1}}>
                <ScrollView style={{flex: 1, backgroundColor: "white", marginTop: 0, paddingHorizontal: 15}}>
                    <View style={{alignItems: 'center'}}>

                        <ImageBackground source={{uri: this.state.coachProfile}}
                                         style={{height: 100, width: 100, marginTop: 13}} borderRadius={100 / 2}>

                        </ImageBackground>


                    </View>
                    {/*<View style={{height:1,backgroundColor:'#d3d3d3',marginTop:13}}></View>*/}
                    <View style={{backgroundColor: 'transparent'}}>
                        <Text style={{fontFamily: 'PoppinsBold', marginTop: 25, fontSize: 18, alignSelf: 'center'}}>
                            {this.state.coachName}</Text>

                        <Text style={{
                            fontFamily: 'PoppinsRegular', marginTop: 5, fontSize: 16,
                            alignSelf: 'center'
                        }}>{this.state.coachDesignation}</Text>
                        {/*<Text style={{fontFamily: 'PoppinsSemiBold', marginTop: 15, fontSize: 16, alignSelf: 'center'}}>*/}
                        {/*    {this.state.coachDesc}</Text>*/}
                              <HTML
                                  allowFontScaling={false}
                                  onLinkPress={(event, href)=>{
                                    Linking.openURL(href)
                                  }}
                                  html={this.state.coachDesc}
                                  imagesMaxWidth={screenWidth}
                                  containerStyle={{marginTop: 6, paddingHorizontal: 0}}
                              />
                    </View>

                    {/*<Image source={arrowfor} style={{*/}
                    {/*    marginTop: 200, height: 25, width: 25,*/}
                    {/*    transform: [{rotate: '90deg'}], alignSelf: 'center'*/}
                    {/*}}></Image>*/}

                </ScrollView>
                {/*<View style={{*/}
                {/*    height: 60,*/}
                {/*    marginTop: 0,*/}
                {/*    backgroundColor: 'transparent',*/}
                {/*    alignItems: 'center',*/}
                {/*    flexDirection: 'row',*/}
                {/*    justifyContent: 'center'*/}
                {/*}}>*/}


                {/*        <Image source={whatsup} style={styles.sharingimage}></Image>*/}
                {/*        <Image source={whatsup} style={styles.sharingimage}></Image>*/}
                {/*        <Image source={whatsup} style={styles.sharingimage}></Image>*/}


                {/*</View>*/}
            </View>

        )
    }

    SecondRoute = () => {
       // console.log("SECONDROUTECONTENT============>>>>"+this.state.secondRouteContent)
        return  !this.state.secondRouteContent ? (
            <ScrollView style={{flex: 1, backgroundColor: "white", marginTop: 0, paddingHorizontal: 15}}>
                <View style={{alignItems: 'center'}}>

                    <ImageBackground source={{uri: this.state.coachProfile}}
                                     style={{height: 100, width: 100, marginTop: 13}} borderRadius={100 / 2}>

                    </ImageBackground>

                </View>

                {/*<View style={{height: 1, backgroundColor: '#d3d3d3', marginTop: 13}}></View>*/}
                <View style={{backgroundColor: 'transparent'}}>
                    {
                        this.renderQuestionAnswers()
                    }


                    {/*<Image source={arrowfor} style={{*/}
                    {/*    marginTop: 180,*/}
                    {/*    height: 25,*/}
                    {/*    width: 25,*/}
                    {/*    transform: [{rotate: '90deg'}],*/}
                    {/*    alignSelf: 'center'*/}
                    {/*}}></Image>*/}

                </View>

            </ScrollView>
            ) : this.noContentFound()
    }


    renderQuestionAnswers(){
        return(
            this.state.coachCorner.map((item,rowMap)=>{
                console.log('GETETETETTETE', item);
                return(
                    <View style={{marginTop:15}}>
                    {(item.video !== '' && item.video !== null) &&
                    <View>
                    <TouchableOpacity activeOpacity={1}
                     style={{marginTop: 10}}
                                      onPress={() => this.setState({
                                          shouldPlay: true,
                                          isPause: false
                                      })}>



                        {!this.state.isPause &&
                          <View style={{justifyContent: 'center', alignItems: 'center', position: 'relative'}}>
                              <Image source={{uri: item.video_poster}}
                                     style={{ width: '100%', height: 220 ,borderRadius:6}}
                              ></Image>
                              <View style={{position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center'}}>
                                <Image source={playButton}
                                       style={{height: 55, width: 55}}
                                ></Image>
                              </View>
                        </View>
                        }

                        {this.state.isPause &&
                        <Video
                            source={{uri: item.video}}
                            rate={1.0}
                            volume={1.0}
                            mute={false}
                            ref={videoplayer => {
                                this.videoPlayer = videoplayer
                            }}
                            resizeMode="stretch"
                            //onTouchStart={() => alert('start')}
                            isLooping={false}
                            shouldPlay={this.state.shouldPlay} activeOpacity={1}
                            //  shouldCorrectPitch={true}
                            useNativeControls={true}
                            paused={this.state.isPause}
                            //onMagicTap={()=>alert('ff')}
                            //paused={this.state.shouldPlay[index]}
                            //  onPlaybackStatusUpdate={(isPlaying ,isBuffering ) =>console.log(isPlaying.isPlaying)}
                            // onPlaybackStatusUpdate={()=>alert("playing")}
                            // onReadyForDisplay={()=>alert('playing...')}
                            //usePoster={true}
                            // onPlaybackStatusUpdate={(status)=>console.log(status)}
                            //posterSource={{url: dataHolder.item.video_poster}}
                            //posterStyle={{width: '100%', height: 220, resizeMode: 'stretch'}}
                            style={{width: '100%', height: 220, borderRadius: 6, marginTop: 10}}
                        />
                        }
                    </TouchableOpacity>
                    </View>
                    }

                        <Text style={{fontFamily: 'PoppinsBold', marginTop: 15, fontSize: 16}}>
                            {item.question_description[0].question}</Text>

                        {/*<Text style={{fontFamily: 'PoppinsLight', marginTop: 15, fontSize: 14}}>*/}
                        {/*    {item.description}</Text>*/}
                        <HTML
                            allowFontScaling={false}
                            onLinkPress={(event, href)=>{
                              Linking.openURL(href)
                            }}
                            html={item.question_description[0].description}
                            imagesMaxWidth={screenWidth}
                            containerStyle={{marginTop: 0, paddingHorizontal: 0}}
                        />

                    </View>


            )
            })
        )
    }
    noContentFound(){
        return(
             <View style={{flex:1 ,backgroundColor:'white',alignItems:'center',justifyContent:'center'}}>
               <Text style={{fontSize:15,fontFamily:'PoppinsRegular'}}>No Content Found.</Text>
             </View>
        )

    }

    render() {
        return (
            <View style={styles.view_container}>
                {/* Header View */}
                <View style={styles.header_view}>
                    <View style={styles.header_image}>
                        {/* Header items View */}
                        {/*<View style={styles.header_items}>*/}
                            <ImageBackground source={headerback} style={styles.header_image}>
                                <View style={styles.header_items}>
                                    <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
                                        <Image source={backarrow} style={styles.menu}>
                                        </Image>
                                    </TouchableOpacity>
                                    <View style={{
                                        flexDirection: 'row',
                                        marginLeft: 0,
                                        alignContent: 'flex-start',
                                        justifyContent: 'flex-start', backgroundColor: 'transparent',
                                        flex: 1
                                    }}>

                                        <Text style={{fontFamily: 'PoppinsBold',color:'white', marginLeft: 20, fontSize: 18}}>Coaches
                                        </Text>

                                    </View>

                                    <View style={styles.menu}>
                                    </View>
                                </View>
                            </ImageBackground>

                        {/*</View>*/}
                    </View>

                </View>
                {/* Ended Header View */}
                <TabView navigationState={this.state} style={{
                    backgroundColor:
                        'white', marginTop: 0, marginHorizontal: 0,
                }}
                         renderScene={SceneMap({
                             first: !this.state.offSetLoader ? this.FirstRoute : this.loaderView,
                             second: !this.state.offSetLoader ? this.SecondRoute : this.loaderView,
                         })}
                         tabStyle={{flex: 1, backgroundColor: 'red'}}
                         onIndexChange={index => this.setState({index})}
                         renderTabBar={renderTabBar}
                         initialLayout={{width: Dimensions.get('window').width}}
                />
                {/* started Tab Bar */}
                <View style={styles.tabbar_view}>
                    {/* <View style={{flex:1,height:10,backgroundColor:'red',width:50}}>
               </View> */}
                    <View style={styles.tabbar_inner_view}>
                        <View style={styles.tabbar_inner_view2}>
                            <View
                                style={{flexDirection: 'column', justifyContent: 'center', width: 60, marginLeft: -15}}>
                                <TouchableOpacity style={{alignItems: 'center', marginTop: 15}}
                                                  onPress={() => this.props.navigation.navigate('DashBoard')}>
                                    <Image source={calendar} style={{width: 24, height: 24, resizeMode: 'contain'}}>
                                    </Image>

                                    <View style={{
                                        width: 35,
                                        marginLeft: -2,
                                        backgroundColor: 'white',
                                        height: 5,
                                        marginTop: 10
                                    }}>
                                    </View>
                                    <Text style={{
                                        marginBottom: 2,
                                        fontFamily: 'PoppinsRegular',
                                        fontSize: 13,
                                        marginTop: -15
                                    }}>
                                        Today </Text>

                                </TouchableOpacity>
                            </View>

                            <View style={{
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',

                                marginLeft: 10
                            }}>
                                <TouchableOpacity style={{alignItems: 'center', marginTop: 5}}
                                                  onPress={() => this.props.navigation.navigate('Library')}>
                                    <Image source={library} style={{width: 24, height: 24, resizeMode: 'contain'}}>
                                    </Image>
                                    <View style={{
                                        width: 37,
                                        marginLeft: -4,
                                        backgroundColor: '#84d3fd',
                                        height: 5,
                                        marginTop: 12
                                    }}>
                                    </View>
                                    <Text style={{
                                        marginBottom: 2,
                                        fontFamily: 'PoppinsRegular',
                                        fontSize: 13,
                                        marginTop: -18
                                    }}>
                                        Library </Text>
                                </TouchableOpacity>
                            </View>

                            <View style={{
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',

                                marginRight: -15
                            }}>
                                <TouchableOpacity style={{alignItems: 'center', marginTop: 5}}
                                                  onPress={() => this.props.navigation.navigate('MyProgress')}>
                                    <Image source={user} style={{width: 24, height: 24, resizeMode: 'contain',}}>
                                    </Image>
                                    <Text style={{marginBottom: 2, fontFamily: 'PoppinsRegular', fontSize: 13}}>
                                        My Progress </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>

                </View>
                {/* Ended Tab Bar */}

            </View>

        )
    }

}


const styles = StyleSheet.create({

    view_container: {
        flex: 1,
        backgroundColor: 'white'
    },
    header_view: {
        height: 90,
    },

    tabbar_view: {

        flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-around', height: 65,
        elevation: 3,
        shadowColor: "#000000",
        shadowOpacity: 0.5,
        shadowRadius: 2,
        shadowOffset: {
            height: 1,
            width: 1,
        }
    },

    tabbar_inner_view: {

        flexDirection: 'row',
        backgroundColor: 'white',
        alignItems: 'baseline',
        justifyContent: 'space-around',
        height: 63,
        marginTop: 1,
        flex: 1,
        elevation: 5,
        shadowColor: "#000000",
        shadowOpacity: 0.5,
        shadowRadius: 2,
        shadowOffset: {
            height: 1,
            width: 1,
        }
    },
    sharingimage: {
        height: 42, width: 42, marginRight: 7, shadowColor: "#000", resizeMode: 'contain',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.20,
        shadowRadius: 1.41,

        elevation: 2,
    },
    tabbar_inner_view2: {

        flexDirection: 'row',
        backgroundColor: 'white',
        alignItems: 'baseline',
        justifyContent: 'space-around',
        height: 62,
        marginTop: 1,
        flex: 1,
        elevation: 5,
        shadowColor: "#000000",
        shadowOpacity: 0.5,
        shadowRadius: 2,
        shadowOffset: {
            height: 1,
            width: 1,
        }
    },

    grid_itemsview: {
        width: '44%',
        borderRadius: 10,
        marginLeft: 15,
        marginVertical: 13,
        backgroundColor: 'white',
        elevation: 3,
        shadowColor: "#000000",
        shadowOpacity: 0.5,
        shadowRadius: 2,
        shadowOffset: {
            height: 1,
            width: 1,
        }
    },

    chalenge_profile: {
        flex: 1,
        height: 200,
        width: '100%',
        // resizeMode:'cover' ,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10
    },

    challenge_view: {
        // flex:1,
        height: 200,
        marginTop: 8,
        marginBottom: 8,
        marginHorizontal: 15,
        borderRadius: 10,
        backgroundColor: 'white',

        elevation: 3,
        shadowColor: "#000000",
        shadowOpacity: 0.8,
        shadowRadius: 2,
        shadowOffset: {
            height: 1,
            width: 1
        }
    },
    menu: {
      width: 25,
      height: 25,
      marginLeft: 15,
    },
    header_image: {
        flex: 1,
        height: 90
    },
    header_items: {
        height: 50,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'transparent',
        marginTop: 35,
    },
});
