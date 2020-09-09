import React, {Component} from 'react';
import {Dimensions, Image, ImageBackground, ScrollView, StyleSheet, Text, TouchableOpacity, View,Animated} from 'react-native';
import {Video} from 'expo-av'
import * as SecureStore from 'expo-secure-store';
import Spinner from "react-native-loading-spinner-overlay";
import ReadMore from 'react-native-read-more-text';
import HTML from 'react-native-render-html'
import { WebView } from 'react-native-webview';
import Emoji from "react-native-emoji";
import Toast from "react-native-easy-toast";
import ViewMoreText from "react-native-view-more-text";
//added on july/3/2020
const playButton = require('../../images/play-btn.png');
const headerback = require('../../images/image-8.png');
const backarrow = require('../../assets/backarrow.png');
const screenWidth = Math.round(Dimensions.get('window').width);
const screenHeight = Math.round(Dimensions.get('window').height);


const checkyellow = require('../../images/checkblue.png');
const checkgray = require('../../images/disable-check-1.png');


const HEADER_MAX_HEIGHT = 200;// set the initial height
const HEADER_MIN_HEIGHT = 60;// set the height on scroll
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;
const getAccessToken = async () => {
    return await SecureStore.getItemAsync('token');
};

const htmlContent = `
<h1>This HTML snippet is now rendered with native components !</h1>
<h2>Enjoy a webview-free and blazing fast application</h2>
<h2>Enjoy, This is a test 1</h2>
<h2>Enjoy, This is a test 2</h2>
<h2>Enjoy, This is a test 3</h2>
<em style="textAlign: center;">Look at how happy this native cat is</em>`;


const getUserId = async () => {
    return await SecureStore.getItemAsync('id');
};

export default class CoachCorner extends Component {

    constructor(props) {
        super(props);
        this.state = {
            scrollY: new Animated.Value(0),
            accessToken: '',
            challengeId: this.props.navigation.state.params.challenge_details.challenge_id,
            featureId: 4,
            categoryId: this.props.navigation.state.params.challenge_details.feature_category_id,
            day: this.props.navigation.state.params.challenge_details.day,
            week: this.props.navigation.state.params.challenge_details.week,
            uid: '',
            commentText: '',
            offSet: 0,
            offSetLoader: false,
            data_list: [],
            inFullscreen: false,
            shouldPlay: false,
            isPause: true,
            content: '', weeklyVideo_title: '',
            weeklyVideo_Desc: '',
            feature_name: this.props.navigation.state.params.challenge_details.feature_name,
            points: this.props.navigation.state.params.challenge_details.points,
            button_text: '',
            isDialogVisible: false, itemCount: 0,
            popupQuestion: '',
            reverse: false,
            submitted: [],
            dataHolder: '',
            submittedList: [],
            commentOwn: false,
            actionStatus: false
            // directionY: [{scaleY: -1}],
            //directionX: [{scaleX: -1}],

        }
    }


    componentDidMount() {
        getAccessToken().then(token =>
            this.setState({accessToken: token}),
        );

        getUserId().then(id =>
            this.setState({uid: id}),
        );

        // alert(JSON.stringify(this.props));
        this.getDataObject(this.props.navigation.state.params.DATA);
    }


    getDataObject(dataObject) {
        setTimeout(() => {
            if (this.state.challengeId != undefined) {
                this.setState({offSetLoader: true});
                this.getDailyInspirationApiData(this.state.challengeId, this.state.featureId, this.state.categoryId, this.state.week, this.state.uid, this.state.day);
            }
        }, 1000);

    }


    async getDailyInspirationApiData(challangeId, featureId, categoryId, week, uid, day) {
        const token_ = await SecureStore.getItemAsync('token');
        const url = global.base_url_live+'v1/api/get-coach-corner-content-latest';
        var parameters = {
            token: JSON.parse(token_),
            challenge_id: challangeId,
            feature_id: featureId,
            week: week,
            category_id: categoryId,
            uid: uid,
            day: day
        };
        var token = `Bearer ${JSON.parse(token_)}`;
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
                    //console.log(dataobject);
                    this.setState({offSetLoader: false});
                    this.setState({actionStatus: dataobject.coach_corner_current.user_actions.action_status})
                    this.InheritedData(dataobject);
                }
            )
            .catch((error) => {
            })
    }


    setDataList(text) {
        this.setState({dataHolder: text});
    }


    InheritedData(data) {
        this.setDataList(data.coach_corner_current);
    }

    async submitPoints(challangeId, featureId, categoryId, week, uid, index) {

        const token_ = await SecureStore.getItemAsync('token');
        const url = global.base_url_live+'v1/api/submit-coach-corner-action';
        var parameters = {
            token: JSON.parse(token_),
            challenge_id: challangeId,
            feature_id: featureId,
            week: week,
            uid: uid,
            index: index,
            category_id: categoryId
        };
        var token = `Bearer ${JSON.parse(token_)}`;
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
                    //alert(responseText)
                    if (dataobject.status) {
                        //this.props.navigation.navigate('DashBoard');
                        // alert('success')
                        this.setState({commentOwn: true});
                        this.setState({actionStatus: true});
                        this.refs.toast.show(
                            <View style={{flexDirection:'row',alignItems:'center'}}>
                                <Text style={{color:'white',fontSize:12}}>There it is!  </Text>
                                <Emoji name="clap" style={{fontSize: 12,color:'White',backgroundColor:'transparent'}}
                                />

                            </View>)
                    }
                }
            )
            .catch((error) => {
            })


    }

    navigateToAll(challangeId, categoryId, featureId, week, uid) {
        var parameters = {
            //  token: JSON.parse(token_),
            challenge_id: challangeId,
            category_id: categoryId,
            feature_id: featureId,
            week: week,
            uid: uid,
        };

        this.props.navigation.navigate('CoachCornerSeeAll', {DATA: parameters});
    }

    shiftBack() {
        var obj = {
            'day': this.state.day,
            'week': this.state.week,
            'challengeId': this.state.challengeId,
            'uid': this.state.uid
        }
        this.props.navigation.state.params.onGoBack(obj);
        this.props.navigation.goBack();
    }

    _renderTruncatedFooter = (handlePress) => {
        return (
            <Text style={{color: '#4AAFE3', marginTop: 0}} onPress={handlePress}>
                Read more
            </Text>
        );
    }

    _renderRevealedFooter = (handlePress) => {
        return (
            <Text style={{color: '#4AAFE3', marginTop: 0}} onPress={handlePress}>
                Show less
            </Text>
        );
    }

    renderViewMore(onPress) {
        return (
            <Text style={{marginTop: 0, marginLeft: 0, fontSize: 15, color: '#4AAFE3'}} onPress={(event)=>{
                onPress();
            }}>Read more</Text>
        )
    }

    renderViewLess(onPress) {
        return (
            <Text style={{marginTop: 0, marginLeft: 0, fontSize: 15, color: '#4AAFE3'}} onPress={onPress}>Show less</Text>
        )
    }

    render() {
        var AllData = this.state.dataHolder;
        var week = AllData.week;
        var description = AllData.description;

        if (description !== undefined) {
            var result = description.replace(/<(.|\n)*?>/g, '');
            result = result.replace(/\&nbsp;/g, '');
            result = result.replace(/\&#39;/g, "'");
            result = result.replace(/\&rsquo;/g, "'");
            result = result.replace(/\&amp;/g, "&");
            result = result.replace(/\&quot;/g, '"');
            result = result.replace(/\&hellip;/g, '...');
            result = result.replace(/\&rdquo;/g, '"');

           // alert(result)
        }


        var title = AllData.title;
        var designation = AllData.designation;
        var dashboard_image = AllData.dashboard_image;
        var video_poster = AllData.video_poster;
        //var video_poster = null;
        var question = AllData.question;
        var index = AllData.index;
        var video_url = AllData.video_url;
        //var video_url = null;
        if (week == 'Week 1-one') {
            var flexxx = 1;
            var alignnn = 'center';
        } else {
            var flexxx = 0.76;
            var alignnn = 'flex-end';
        }
        //console.log(this.state.actionStatus)

        const headerHeight = this.state.scrollY.interpolate({
            inputRange: [0, HEADER_SCROLL_DISTANCE],
            outputRange: [HEADER_MAX_HEIGHT,HEADER_MIN_HEIGHT],
            extrapolate: 'clamp',
        });


        return (
            <View style={styles.container}>
                {/* Header View */}
                <Toast
                    ref="toast"
                    style={{backgroundColor: '#4AAFE3',borderRadius:90}}
                    position='bottom'
                    positionValue={110}
                    fadeInDuration={500}
                    fadeOutDuration={900}
                    opacity={0.8}
                    textStyle={{color:'#fff'}}
                />
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
                                <Text style={{
                                    fontFamily: 'PoppinsBold',
                                    color: '#fff',
                                    fontSize: 18
                                }}>{this.state.feature_name == "" ? '-' : this.state.feature_name}
                                </Text>
                            </View>

                            <View style={styles.menuSEC}></View>

                        </View>
                    </ImageBackground>

                </View>
                <Spinner
                    visible={this.state.offSetLoader}
                    textContent={''} color={'black'}/>

                <ScrollView style={{
                    marginTop: 0,
                    height: screenHeight - 100,
                    backgroundColor: 'transparent',
                    width: '100%'
                }}
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={{paddingVertical: 20}}


                >

                    {/*<Text*/}
                    {/*    style={{*/}
                    {/*        color: 'gray',*/}
                    {/*        marginHorizontal: 15,*/}
                    {/*        fontFamily: 'PoppinsBold'*/}
                    {/*    }}>{"Week : " + week}</Text>*/}
                    {/*<View style={{height: 1.5, marginHorizontal: 15, backgroundColor: 'lightgray', marginTop: 1}}>*/}

                    {/*</View>*/}
                    {/*<TouchableOpacity style={{marginTop: 20}} onPress={() => this.setState({shouldPlay: true})}>*/}

                    <View style={{
                        justifyContent: 'center', alignItems: 'center', marginHorizontal: 0
                        , backgroundColor: 'transparent', marginTop: 0
                    }}>

                        <View style={{
                            width: '100%',
                            backgroundColor: 'transparent',
                            flexDirection: 'row',
                            shadowColor: "#000000",
                            shadowOpacity: 0.3,
                            shadowRadius: 2,
                            shadowOffset: {
                                height: 1,
                                width: 1
                            }
                        }}>


                            <View style={{
                                backgroundColor: 'transparent', marginLeft: 0, width: '100%'
                                , alignItems: 'center', justifyContent: 'flex-start'
                            }}>
                                <Image source={{uri: dashboard_image}}
                                       style={{
                                           width: 100, height: 100,
                                           borderRadius: 100 / 2
                                           , marginTop: 0
                                       }}>
                                </Image>
                                <View style={{marginBottom: 0, marginHorizontal: 15}}>
                                    <Text style={{
                                        fontFamily: 'PoppinsSemiBold',
                                        fontSize: 16, textAlign: 'center',
                                        backgroundColor: 'transparent',
                                        marginTop: 5
                                    }}>{title}</Text>
                                    {/*PoppinsLight*/}
                                    <Text style={{
                                        fontFamily: 'PoppinsLight', fontSize: 13, backgroundColor: 'transparent',
                                        marginTop: 2, textAlign: 'center',
                                    }}>{designation}</Text>
                                </View>

                            </View>


                        </View>


                    </View>


                    {/*</TouchableOpacity>*/}

                    <Text style={{
                        textAlign: 'left',
                        fontFamily: 'PoppinsSemiBold',
                        marginHorizontal: 15,
                        fontSize: 15,
                        backgroundColor: 'transparent',
                        marginTop: 10
                    }}>{question}</Text>


                    <TouchableOpacity activeOpacity={1} style={{marginTop: 10}}
                                      onPress={() => this.setState({
                                          shouldPlay: true,
                                          isPause: false
                                      })}>
                        {(this.state.isPause && video_poster !== null && video_poster !== '') &&
                        <View style={{justifyContent: 'center', alignItems: 'center', position: 'relative'}}>
                            <Image source={{uri: video_poster}}
                                   style={{width: '100%', height: 220, borderRadius: 6}}
                            ></Image>
                            <View style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                justifyContent: 'center',
                                alignItems: 'center'
                            }}>{this.state.dataHolder !== '' &&
                                <Image source={playButton}
                                       style={{height: 55, width: 55}}
                                ></Image>
                            }

                            </View>
                        </View>
                        }

                        {!this.state.isPause &&
                        <Video
                            source={{uri: video_url}}
                            rate={1.0}
                            volume={1.0}
                            isMuted={false}
                            resizeMode="cover"
                            shouldPlay={this.state.shouldPlay}
                            shouldCorrectPitch={true}
                            useNativeControls={true}
                            // onReadyForDisplay={()=>alert('playing...')}
                            //usePoster={true}
                            // onPlaybackStatusUpdate={(status)=>console.log(status)}
                            //posterSource={{url:dataHolder.item.video_poster}}
                            //posterStyle={{ width: '100%', height: 220}}
                            style={{width: '100%', height: video_url == null ? 5 : 220, marginTop: 10}}
                        />
                        }
                    </TouchableOpacity>


                    <View style={{marginTop: 10, backgroundColor: 'transparent'}}>
                        <ScrollView>

                            {/*<ViewMoreText*/}
                            {/*    style={{backgroundColor: 'yellow'}}*/}
                            {/*    numberOfLines={2}*/}
                            {/*    imagesMaxWidth={screenWidth}*/}
                            {/*    renderViewMore={this.renderViewMore}*/}
                            {/*    renderViewLess={this.renderViewLess}*/}
                            {/*    textStyle={{textAlign: 'center'}}>*/}
                            {/*    <HTML*/}
                            {/*        html={`<p>${description}</p>`}*/}
                            {/*        allowFontScaling={true}*/}
                            {/*      //  tagsStyles={instructionsStyleDescription}*/}
                            {/*        renderers={{*/}
                            {/*            p: (_, children) => <Text numberOfLines={5}>{children}</Text>,*/}
                            {/*        }}*/}
                            {/*    />*/}
                            {/*</ViewMoreText>*/}
                            {/*<HTML*/}
                            {/*    html={`<p>${description}</p>`}*/}
                            {/*    allowFontScaling={false}*/}
                            {/*    imagesMaxWidth={screenWidth}*/}
                            {/*    containerStyle={{marginTop: 0, marginHorizontal: 15, backgroundColor: 'transparent'}}*/}
                            {/*        renderers={{*/}
                            {/*            p: (_, children) => <Text numberOfLines={5}>{children}</Text>,*/}
                            {/*        }}*/}
                            {/*    */}
                            {/*/>*/}
                            <View style={{backgroundColor: 'transparent', marginLeft: 15, marginRight: 15}}>
                                {description !== undefined &&
                                <ViewMoreText
                                    numberOfLines={5}
                                    renderViewMore={this.renderViewMore}
                                    renderViewLess={this.renderViewLess}
                                    textStyle={{textAlign: 'left'}}
                                >

                                    {result}
                                </ViewMoreText>
                                }

                            </View>


                            {/*<HTML*/}
                            {/*html={description}*/}
                            {/*allowFontScaling={false}*/}
                            {/*renderers={{*/}
                            {/*    p: (_, children, convertedCSSStyles, { allowFontScaling, key }) => {*/}
                            {/*        return (*/}
                            {/*            <Text numberOfLines={3} allowFontScaling={allowFontScaling} key={0} style={convertedCSSStyles}>{ children }</Text>*/}
                            {/*        );*/}
                            {/*    // }*/}
                            {/*}}*/}
                            {/*textProps={{ textBreakStrategy: "simple" }}*/}
                            {/*imagesMaxWidth={screenWidth}*/}
                            {/*containerStyle={{marginTop: 0, marginHorizontal: 15, backgroundColor: 'transparent'}}></HTML>*/}


                            {/*<ReadMore*/}
                            {/*    style={{backgroundColor: 'yellow'}}*/}
                            {/*    numberOfLines={4}*/}
                            {/*    imagesMaxWidth={screenWidth}*/}
                            {/*    renderViewMore={this.renderViewMore}*/}
                            {/*    renderViewLess={this.renderViewLess}*/}
                            {/*    textStyle={{textAlign: 'left'}}>*/}
                            {/*    {result}*/}
                            {/*</ReadMore>*/}


                            {this.state.dataHolder !== '' &&
                            <View style={{
                                marginHorizontal: 15,
                                marginTop: 10,
                                backgroundColor: 'transparent',
                                flexDirection: 'row'
                            }}>
                                <View style={{
                                    flex: flexxx,
                                    justifyContent: 'center',
                                    backgroundColor: 'transparent',
                                    alignItems: alignnn
                                }}>

                                    <TouchableOpacity
                                        style={{
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            backgroundColor: '#4AAFE3',
                                            borderWidth: 1, paddingVertical: 8,
                                            flexDirection: 'row',
                                            paddingHorizontal: 25,
                                            borderColor: 'lightgray', marginHorizontal: 0,
                                            borderRadius: 25, marginBottom: 0, marginTop: 0
                                        }}
                                        onPress={() =>
                                            this.submitPoints(this.state.challengeId, this.state.featureId, this.state.categoryId, this.state.week, this.state.uid, index)}
                                    >

                                        {this.state.actionStatus &&
                                        <Image source={checkyellow}
                                               style={{width: 18, height: 18, marginLeft: 0, marginTop: 0}}>
                                        </Image>
                                        }
                                        {!this.state.actionStatus &&
                                        <Image source={checkgray}
                                               style={{width: 18, height: 18, marginLeft: 0, marginTop: 0}}>
                                        </Image>
                                        }
                                        <Text
                                            style={{
                                                fontSize: 13,
                                                color: 'white',
                                                marginLeft: 7,
                                                fontFamily: 'PoppinsSemiBold',
                                                paddingVertical: 0
                                            }}>
                                            Submit {this.state.points} Points</Text>
                                    </TouchableOpacity>
                                </View>

                                {week !== 'Week 1-one' &&
                                <View style={{
                                    flex: 0.24,
                                    justifyContent: 'center',
                                    alignItems: 'flex-end',
                                    backgroundColor: 'transparent'
                                }}>

                                    <View style={{alignItems: 'center', justifyContent: 'center', marginTop: 0}}>
                                        <TouchableOpacity
                                            style={{
                                                borderRadius: 5,
                                                alignItems: 'center',
                                                width: '100%',
                                                justifyContent: 'center'
                                            }}
                                            onPress={() => this.navigateToAll(this.state.challengeId, this.state.categoryId, this.state.featureId, this.state.week, this.state.uid)}>
                                            <Text style={{
                                                fontSize: 16,
                                                color: 'black',
                                                borderBottomWidth: 1,
                                                fontFamily: 'PoppinsRegular'
                                            }}>See All ></Text>
                                        </TouchableOpacity>
                                    </View>

                                </View>

                                }
                            </View>
                          }

                        </ScrollView>
                    </View>


                </ScrollView>
            </View>
        );


    }

}


const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: 'white',
        paddingBottom: 0,
    },
    header_view: {
        height: 90,

    },
    backTextWhite: {
        color: '#FFF', fontSize: 10, fontFamily: 'PoppinsSemiBold'
    },
    login_button: {
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        backgroundColor: 'black',
        borderWidth: 1, paddingVertical: 13,
        borderColor: 'lightgray', marginHorizontal: 0,
        borderRadius: 5, marginBottom: 5, marginTop: 20
    },

    header_items: {
        height: 50,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'transparent',
        marginTop: 35,
    },
    backRightBtn: {
        alignItems: 'center',
        bottom: 0,
        justifyContent: 'center',
        position: 'absolute',
        top: 0,
        width: 75, borderBottomLeftRadius: 5, borderTopLeftRadius: 5
    },
    backRightBtn222: {
        alignItems: 'center',
        bottom: 0,
        justifyContent: 'center',
        position: 'absolute',
        top: 0,
        width: 65,
    },
    column: {
        flexDirection: 'column', justifyContent: 'center', alignItems: 'center'
    },
    trash: {
        height: 65,
        width: 65, backgroundColor: 'yellow'
    },

    backRightBtnLeft: {
        backgroundColor: '#fcce85',
        right: 130,
    },

    backRightBtnRight: {
        backgroundColor: '#5cc9bd',
        right: 70,
    }, backRightBtnRightnew: {
        backgroundColor: '#eb6c63',
        right: 5,
    },
    header_image: {
        flex: 1,
        height: 90
    },
    rowBack: {
        marginTop: 13, marginBottom: 4,
        alignItems: 'center',
        backgroundColor: 'white',
        flex: 1,
        flexDirection: 'row',


    },

    menu: {
        width: 25,
        height: 25,
        marginLeft: 15,


    }, hiddenImages: {
        width: 18,
        height: 18,
    },
    menuSEC: {
        width: 5,
        height: 18, marginRight: 15

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
        flex: 1, borderRadius: 15,
        marginHorizontal: 0,
        backgroundColor: 'white',
        borderColor: 'white',
        borderWidth: 1, margin: 10,
        marginTop: 0
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
    loader: {
        marginTop: 32, borderRadius: 5,
        alignItems: 'center',
        height: 45,
        backgroundColor: "black",
        width: '50%',
        justifyContent: 'center'
    }
});
