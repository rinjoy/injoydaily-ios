import React, {Component} from 'react';
import {
    ActivityIndicator,
    Dimensions,
    Image,
    ImageBackground,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import {Video} from 'expo-av'
import * as SecureStore from 'expo-secure-store';
import HTML from 'react-native-render-html';
import Spinner from "react-native-loading-spinner-overlay";

const checkyellow = require('./../../images/checkyellow.png');
const headerback = require('../../images/image-8.png');
const backarrow = require('../../assets/backarrow.png');
const screenWidth = Math.round(Dimensions.get('window').width);
const screenHeight = Math.round(Dimensions.get('window').height);

const getAccessToken = async () => {
    return await SecureStore.getItemAsync('token');
};

const getUserId = async () => {
    return await SecureStore.getItemAsync('id');
};

export default class CoachCorner extends Component {

    constructor(props) {
        super(props);
        this.state = {
            accessToken: '',
            challengeId: '',
            featureId: '',
            categoryId: '',
            day: '',
            week: '',
            uid: '',
            commentText: '',
            offSet: 0,
            offSetLoader: false,
            data_list: [],
            inFullscreen: false,
            shouldPlay: false,
            content: '', weeklyVideo_title: '',
            weeklyVideo_Desc: '',
            feature_name: '',
            button_text: '',
            isDialogVisible: false, itemCount: 0,
            popupQuestion: '',
            reverse: false,
            submitted: [],
            dataHolder: '',
            submittedList: [],
            commentOwn: false,
            actionStatus:false
            // directionY: [{scaleY: -1}],
            //directionX: [{scaleX: -1}],

        }
    }


    componentDidMount() {
        getAccessToken().then(token =>
            this.setState({accessToken: token}),
        );

        getUserId().then(id =>
            this.setState({id: id}),
        );

        // alert(JSON.stringify(this.props));
        this.getDataObject(this.props.navigation.state.params.DATA);
    }


    getDataObject(dataObject) {
        this.setState({challengeId: dataObject.challenge_id});
        this.setState({categoryId: dataObject.coach_corner_category.category_id});
        this.setState({featureId: dataObject.feature_id});
        this.setState({uid: dataObject.uid});
        this.setState({week: dataObject.week});
        this.setState({day: dataObject.day});
        this.setState({feature_name: dataObject.feature_name});
        this.setState({popupQuestion: dataObject.coach_corner_category.question});
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
                    this.setState({offSetLoader: false});
                    this.setState({actionStatus:dataobject.coach_corner_current.user_actions.action_status})
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
                        alert('Submitted successfully');
                        this.shiftBack();



                    }
                }
            )
            .catch((error) => {
            })


    }

    navigateToAll(challangeId, categoryId, featureId, week, uid ) {
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
      var obj={'day':this.state.day, 'week':this.state.week, 'challengeId':this.state.challengeId, 'uid': this.state.uid}
      this.props.navigation.state.params.onGoBack(obj);
      this.props.navigation.goBack();
    }

    render() {
        var AllData = this.state.dataHolder;
        var week = AllData.week;
        var description = AllData.description;
        var dashboard_image = AllData.dashboard_image;
        var video_poster = AllData.video_poster;
        var question = AllData.question;
        var index = AllData.index;
        var video_url = AllData.video_url;
        //console.log(this.state.actionStatus)
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
                                <Text style={{
                                    fontFamily: 'PoppinsBold',
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

                <ScrollView style={{flex: 1 ,paddingHorizontal:15}}>
                    <View style={{
                        marginTop: 20,
                        backgroundColor: 'transparent',
                        width: '100%'
                    }}>

                        <Text
                            style={{color: 'gray', fontFamily: 'PoppinsBold'}}>{"Week : " + week}</Text>
                        <View style={{height: 1.5, backgroundColor: 'lightgray', marginTop: 1}}>

                        </View>
                        {/*<TouchableOpacity style={{marginTop: 20}} onPress={() => this.setState({shouldPlay: true})}>*/}

                        <View style={{
                            justifyContent: 'center', alignItems: 'center'
                            , elevation: 8, flex: 1, backgroundColor: 'white', height: 155, marginTop: 15
                        }}>

                            <View style={{
                                width: '45%',
                                height: 155,
                                justifyContent: 'center',
                                alignItems: 'center',
                                shadowColor: "#000000",
                                shadowOpacity: 0.3,
                                shadowRadius: 2,
                                shadowOffset: {
                                    height: 1,
                                    width: 1
                                }
                            }}>
                                <Image source={{uri: dashboard_image}}
                                       style={{
                                           width: '95%', height: 150,
                                           borderRadius: 6,
                                           alignItems: 'center',
                                           justifyContent: 'center'
                                           , marginTop: 0
                                       }}>
                                </Image>
                            </View>

                        </View>


                        {/*</TouchableOpacity>*/}

                        <Text style={{
                            fontFamily: 'PoppinsSemiBold', fontSize: 16, backgroundColor: 'transparent',
                            marginTop: 10
                        }}>{question}</Text>

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
                            style={{width: '100%', height: 220, borderRadius: 6, marginTop: 10}}
                        />

                        <HTML
                            html={description}
                            imagesMaxWidth={screenWidth}
                            containerStyle={{marginTop: 0, backgroundColor: 'transparent'}}
                        />




                        {!this.state.actionStatus && !this.state.commentOwn &&
                        <TouchableOpacity
                            style={styles.login_button}
                            onPress={() =>
                                this.submitPoints(this.state.challengeId, this.state.featureId, this.state.categoryId, this.state.week, this.state.uid, index)}
                        >
                            <Text
                                style={{fontSize: 13, color: 'white', fontFamily: 'PoppinsSemiBold',padding:2}}>
                                {question}</Text>
                        </TouchableOpacity>
                        }


                        <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: 15}}>
                            <TouchableOpacity
                                style={styles.loader}
                                onPress={() => this.navigateToAll(this.state.challengeId, this.state.categoryId, this.state.featureId, this.state.week, this.state.uid)}>
                                <Text style={{fontSize: 16, color: 'white', fontFamily: 'PoppinsSemiBold'}}>See All</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={{height:100}}></View>

                    </View>


                </ScrollView>

            </View>
        );


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
    backTextWhite: {
        color: '#FFF', fontSize: 10, fontFamily: 'PoppinsSemiBold'
    },
    login_button: {
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        backgroundColor: 'black',
        borderWidth: 1,paddingVertical:13,
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
        width: 23,
        height: 16,
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
        marginTop: 32,borderRadius:5,
        alignItems: 'center',
        height: 45,
        backgroundColor: "black",
        width: '50%',
        justifyContent: 'center'
    }
});
