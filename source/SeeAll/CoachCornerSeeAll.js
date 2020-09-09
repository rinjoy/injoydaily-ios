import React, {Component} from 'react';
import {
    ActivityIndicator,
    Dimensions,
    FlatList,
    Image,
    Linking,
    ImageBackground,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
//import {WebView} from 'react-native-webview';
// import { Constants, Video ,ScreenOrientation} from 'expo';
// import VideoPlayer from '@expo/videoplayer';
import {Video} from 'expo-av';
import * as SecureStore from 'expo-secure-store';
import HTML from 'react-native-render-html';
const headerback = require('../../images/image-8.png');
const backarrow = require('../../assets/backarrow.png');
const playButton = require('../../images/play-btn.png');
const screenWidth = Math.round(Dimensions.get('window').width);
const screenHeight = Math.round(Dimensions.get('window').height);

const getAccessToken = async () => {
    return await SecureStore.getItemAsync('token');
};
const getUserId = async () => {
    return await SecureStore.getItemAsync('id');
};
export default class CoachCornerSeeAll extends Component {

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
            isPause: true,
            content: '', weeklyVideo_title: '',
            weeklyVideo_Desc: '',
            feature_name: '',
            button_text: '',
            isDialogVisible: false, itemCount: 0,
            popupQuestion: '',
            reverse: false,
            submitted: [],
            submittedList: [],
            commentOwn: false,

            // directionY: [{scaleY: -1}],
            //directionX: [{scaleX: -1}],

        }
        this.renderRow = this.renderRow.bind(this);
        this.handeLoadMoreItem = this.handeLoadMoreItem.bind(this);

    }


    componentDidMount() {
        getAccessToken().then(token =>
            this.setState({accessToken: token}),
        );

        getUserId().then(id =>
            this.setState({id: id}),
        );

        this.getDataObject(this.props.navigation.state.params.DATA);
    }


    getDataObject(dataObject) {

        this.setState({challengeId: dataObject.challenge_id});
        this.setState({categoryId: dataObject.category_id});
        this.setState({featureId: dataObject.feature_id});
        this.setState({uid: dataObject.uid});
        this.setState({week: dataObject.week});
        setTimeout(() => {
            if (this.state.challengeId != undefined) {
                this.setState({offSetLoader: true});
                this.getAllItemCC(this.state.challengeId, this.state.featureId, this.state.categoryId, this.state.week, this.state.uid);
            }
        }, 1000);

    }


    async getAllItemCC(challangeId, featureId, categoryId, week, uid) {

        const token_ = await SecureStore.getItemAsync('token');
        const url = global.base_url_live+'v1/api/get-coach-corner-all';
        //alert(this.state.offSet);

        var parameters = {
            token: JSON.parse(token_),
            challenge_id: challangeId,
            feature_id: featureId,
            page_size: 2,
            week: week,
            data_offset: this.state.offSet,
            category_id: categoryId,
            uid: uid
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
                    console.log(dataobject);
                    // alert(responseText)
                    this.setState({offSetLoader: false});
                    this.setState({itemCount: dataobject.count_records});
                    this.InheritedData(dataobject);
                }
            )
            .catch((error) => {
            })
    }

    setDataList(text) {
        //alert(JSON.stringify(text))
        if (text.length == 1) {
            //this.setState({reverse: true});


        }
        console.log(text)
        this.setState({data_list: this.state.data_list.concat(text)});

    }

    InheritedData(data) {
        if (data.status == true) {
            this.setDataList(data.coach_corner_all);
        }
    }

    handeLoadMoreItem = () => {
        if (this.state.itemCount !== 0) {
          var increment = parseInt(this.state.offSet) + 2;
            this.setState({offSet: increment});
            this.getAllItemCC(this.state.challengeId, this.state.featureId, this.state.categoryId, this.state.week, this.state.uid);
        }
    }

    footerComponent = () => {
        if (this.state.offSetLoader) {
            return (
                <View style={styles.loader}>
                    <ActivityIndicator size="small"/>
                </View>
            )
        }
        return (<View style={{height: 50}}></View>);


    }

    renderRow(dataHolder) {
         return (
            <View style={{
                marginTop: 20,
                backgroundColor: 'transparent',
                width: '100%'
            }}>
                <Text
                    style={{color: 'gray', marginHorizontal: 15, fontFamily: 'PoppinsBold'}}>{"Week : " + dataHolder.item.week}</Text>
                <View style={{height: 1.5, marginHorizontal: 15, backgroundColor: 'lightgray', marginTop: 1}}>
                </View>
                {/*<TouchableOpacity style={{marginTop: 20}} onPress={() => this.setState({shouldPlay: true})}>*/}
                    <View style={{
                        justifyContent: 'center', alignItems: 'flex-start'
                        , elevation: 8, marginHorizontal: 15, flex: 1, backgroundColor: 'transparent', marginTop: 15, marginBottom: 15,
                    }}>
                        <View style={{
                            width: '45%',
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
                            <Image source={{uri: dataHolder.item.dashboard_image}}
                                   style={{
                                       width: 100, height: 100,
                                       borderRadius: 100/2
                                       , marginTop: 0
                                   }}>
                            </Image>

                            <View style={{backgroundColor: 'transparent', marginLeft: 15,width:'100%'
                                ,alignItems:'flex-start',justifyContent:'flex-start'}}>
                                <Text style={{
                                    fontFamily: 'PoppinsSemiBold',
                                    fontSize: 16,textAlign:'left',
                                    backgroundColor: 'transparent',
                                    marginTop: 5
                                }}>{dataHolder.item.title}</Text>
                                {/*PoppinsLight*/}
                                <Text style={{
                                    fontFamily: 'PoppinsLight', fontSize: 13, backgroundColor: 'transparent',
                                    marginTop: 2,textAlign:'left',
                                }}>{dataHolder.item.designation}</Text>
                            </View>


                        </View>

                    </View>
                {/*</TouchableOpacity>*/}
                <Text style={{marginHorizontal: 15,
                    fontFamily: 'PoppinsSemiBold', fontSize: 16, backgroundColor: 'transparent',
                    marginTop: 10
                }}>{dataHolder.item.question}</Text>

                <TouchableOpacity activeOpacity={1} style={{marginTop: 20}}
                                  onPress={() => this.setState({
                                      shouldPlay: true,
                                      isPause: false
                                  })}>
                {(this.state.isPause && dataHolder.item.video_poster !== null) &&
                  <View style={{justifyContent: 'center', alignItems: 'center', position: 'relative'}}>
                      <Image source={{uri:dataHolder.item.video_poster}}
                             style={{ width: '100%', height: 220 ,borderRadius:6}}
                      ></Image>
                      <View style={{position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center'}}>
                        <Image source={playButton}
                               style={{height: 55, width: 55}}
                        ></Image>
                      </View>
                </View>
                }

                    {!this.state.isPause &&
                    <Video
                        source={{uri: dataHolder.item.video_url}}
                        rate={1.0}
                        volume={1.0}
                        isMuted={false}
                        resizeMode="cover"
                        shouldPlay={this.state.shouldPlay}
                        shouldCorrectPitch={true}
                        useNativeControls={true}
                        paused={this.state.isPause}
                        // onReadyForDisplay={()=>alert('playing...')}
                        //usePoster={true}
                        // onPlaybackStatusUpdate={(status)=>console.log(status)}
                        //posterSource={{url:dataHolder.item.video_poster}}
                        //posterStyle={{ width: '100%', height: 220}}
                        style={{width: '100%', height:  dataHolder.item.video_url == null? 5 :220, borderRadius: 0, marginTop: 10}}
                    />
                    }
                </TouchableOpacity>
                <HTML
                    onLinkPress={(event, href)=>{
                      Linking.openURL(href)
                    }}
                    html={dataHolder.item.description}
                    allowFontScaling={false}
                    imagesMaxWidth={screenWidth}
                    containerStyle={{marginTop: 0, marginHorizontal: 15, backgroundColor: 'transparent'}}
                />
            </View>
        )
    }
    render() {
        return (
            <View style={styles.container}>
                {/* Header View */}
                <View style={styles.header_view}>
                    <ImageBackground source={headerback} style={styles.header_image}>
                        {/* Header items View */}
                        <View style={styles.header_items}>
                            <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
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
                                }}>See All
                                </Text>


                            </View>

                            <View style={styles.menuSEC}>

                                {/* <Image source={dagger}  style={styles.menuSEC}>
                                </Image> */}
                            </View>

                        </View>
                    </ImageBackground>

                </View>
                {/* Ended Header View */}

                <FlatList
                    style={{
                        flex: 1,
                        backgroundColor: 'transparent'
                        ,
                        paddingHorizontal: 0,
                        paddingVertical: -50
                    }}
                    // keyExtractor={this._keyExtractor}
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}
                    data={this.state.data_list}
                    ListFooterComponent={this.footerComponent}
                    onEndReached={this.handeLoadMoreItem}
                    onEndReachedThreshold={0.2}
                    renderItem={this.renderRow}
                />
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
        borderWidth: 1, paddingVertical: 10,
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
        marginTop: 5, alignItems: 'center', height: 60, backgroundColor: "transparent"
    }
});
