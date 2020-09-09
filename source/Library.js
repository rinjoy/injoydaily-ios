import React from 'react'
import {
    Dimensions,
    Image,
    ImageBackground,
    Linking,
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import {SceneMap, TabBar, TabView} from 'react-native-tab-view';
import * as SecureStore from "expo-secure-store";
import HTML from 'react-native-render-html';
import Spinner from "react-native-loading-spinner-overlay";
import ViewMoreText from "react-native-view-more-text";
const userimage = require('./../assets/5.png');

const headerback = require('./../images/image-8.png');
const eleven = require('./../images/11.png');
const twelve = require('./../images/12.png');
const thirteen = require('./../images/13.png');
const bar = require('./../images/videosInjoyologo.png');
const fourteen = require('./../images/14.png');
const image3 = require('./../images/image-3.png');
const hotspot = require('./../images/hotspot.png');
const itunes = require('./../images/itunes.png');
const playbtn = require('./../images/play-btn1.png');
const injoycirclelogo = require('./../images/newData.png');
const injoycirclelogoBlue = require('./../images/podcastInjoyologo.png');
const arrowfor = require('./../images/arrowfor.png');
const menuImg = require('./../assets/menu.png');
const profile = require('./../images/image-9.png');
const calendar = require('./../assets/calendar.png');
const library = require('./../assets/gallary.png');
const user = require('./../assets/user.png');
const image11 = require('./../images/image-11.png');
const defaultLogo = require('./../images/defaultLogo.png');
const image12 = require('./../images/image-12.png');
const image13 = require('./../images/image-13.png');
const hands = require('./../images/handsblue.png');
const commentblue = require('./../images/commentblue.png');
const cellimage = require('./../images/image-19.png');
const challenge = require('./../images/image-10.png');
const checkblue = require('./../assets/checkblue.png');
const checkgray = require('./../images/checkgray.png');
const nextarrow = require('./../assets/nextarrow.png');


const screenWidth = Math.round(Dimensions.get('window').width);
const screenHeight = Math.round(Dimensions.get('window').height);

const renderTabBar = props => (
    <TabBar
        {...props}

        activeColor='#19bffd'
        inactiveColor='#000000'
        indicatorStyle={{backgroundColor: '#19bffd'}}
        getLabelText={({route}) => route.title}
        labelStyle={{fontFamily: 'PoppinsMedium'}}
        style={{backgroundColor: 'transparent', height: 40}}
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

export default class Library extends React.Component {


    constructor(props) {
        super(props);
        this.state = {
            index: 0,
            routes: [
                {key: 'first', title: 'Coaches'},
                {key: 'second', title: 'Podcasts'},
                {key: 'third', title: 'Bonus'},
            ],
            refreshing: false,
            offSetLoader: false,
            data_list: [],
            podcastdembedUrl: [],
            podcastdescription: '',
            podcastImage: '',
            podcastData: '',
            uid: '',
            dataListPodcast: [],
            datListVideoContent: [],
            havePodcast: false,
            challangeId: '',
            colorArray: ['#f3b01e',
                '#7ac8eb',
                '#f3d118',
                '#82ecd7'],
            backColor: ["#F7D100", "#4AAFE3", "#63BE45", "#FFAE55"]
        }
    }

    componentDidMount() {
        const {index} = this.state;
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

                if (index == 0) {
                    this.getChallanges()
                } else if (index == 1) {
                    this.getPoadCast();
                } else if (index == 2) {
                    this.getVideoContent();
                }
            }, 1000)
        }


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


    colorMap(index) {
        //this.setState({colorArray:50})
        var nums = ['#f3b01e', '#64BD45', '#7ac8eb', '#f3d118', '#82ecd7', '#1BBEFD'];
        // var ranNums = [],
        //     i = nums.length,
        //     j = 0;
        //
        // while (i--) {
        //     j = Math.floor(Math.random() * (i+1));
        //     console.log("J IS =>"+j)
        //     ranNums.push(nums[j]);
        //     var bgColor = nums.splice(j,1);
        //     console.log("BG COLOR ====>"+bgColor);
        // }


        return nums[index];
    }


    async getChallanges() {
        this.setState({offSetLoader: true});
        const token_ = await SecureStore.getItemAsync('token');
        const url = global.base_url_live+'v1/api/get-all-library-coaches';

        var parameters = {
            token: JSON.parse(token_),
            uid: this.state.uid,
            challenge_id: this.state.challangeId
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
                    console.log('dataobject', dataobject);
                    // alert(JSON.stringify(dataobject))
                    if (dataobject.status) {
                        this.InheritedData(dataobject);
                    }

                }
            )
            .catch((error) => {
            })
    }

    async getPoadCast() {
        //alert('getPodcast')
        this.setState({offSetLoader: true})
        const token_ = await SecureStore.getItemAsync('token');
        const url = global.base_url_live+'v1/api/get-library-podcast-all-content';

        var parameters = {
            token: JSON.parse(token_),
            uid: this.state.uid,
            page_size: 200,

        };
        var token = `Bearer ${JSON.parse(token_)}`;
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
                    //  alert(JSON.stringify(dataobject))
                    if (dataobject.status) {
                        var image = dataobject.content.podcast_main_content.image;
                        var description = dataobject.content.podcast_main_content.description;
                        var embedUrl = dataobject.content.podcast_main_content.embed_url;
                        var dataListPodcast = dataobject.content.podcast_all_content;
                        this.setState({podcastImage: image})
                        this.setState({podcastdescription: description})
                        this.setState({podcastdembedUrl: embedUrl})
                        this.setState({dataListPodcast: dataListPodcast})
                        this.setState({offSetLoader: false});

                    } else {
                        this.setState({offSetLoader: false});
                        alert(dataobject.message)
                    }


                }
            )
            .catch((error) => {
            })
    }

    async getVideoContent() {
        //alert('getVudeoCall')
        this.setState({offSetLoader: true})
        const token_ = await SecureStore.getItemAsync('token');
        const url = global.base_url_live+'v1/api/get-all-library-video-tags';

        var parameters = {
            token: JSON.parse(token_),
            uid: this.state.uid,
            challenge_id: this.state.challangeId,
            page_size: 200,

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
                    //console.log('See All', dataobject);
                    if (dataobject.status) {

                        let list = dataobject.content;
                        //alert(JSON.stringify(list))
                        this.setState({datListVideoContent: list})
                        // var image = dataobject.content.podcast_main_content.image;
                        // var description = dataobject.content.podcast_main_content.description;
                        // var embedUrl = dataobject.content.podcast_main_content.embed_url;
                        // var dataListPodcast = dataobject.content.podcast_all_content;
                        // this.setState({podcastImage: image})
                        // this.setState({podcastdescription: description})
                        // this.setState({podcastdembedUrl: embedUrl})
                        // this.setState({dataListPodcast: dataListPodcast})
                        // alert(JSON.stringify(this.state.datListVideoContent))
                        this.setState({offSetLoader: false});

                    } else {
                        this.setState({offSetLoader: false});
                        alert(dataobject.message)
                    }


                }
            )
            .catch((error) => {
            })
    }


    InheritedData(data) {
        if (data.status == true) {
            this.setDataList(data.content);
            this.setState({offSetLoader: false});

        }
    }

    setDataList(text) {
        // alert(text);
        this.setState({data_list: text});
    }


    handleClick = (link) => {
        Linking.canOpenURL(link).then(supported => {
            if (supported) {
                Linking.openURL(link);
            } else {
                alert("Unsupported Url!")
            }

        });
    };

    handleIndexChange = index => {
        this.setState({index});
        if (index == 0) {
            this.getChallanges()
        } else if (index == 1) {
            this.getPoadCast();
        } else if (index == 2) {
            this.getVideoContent();
        }
        //console.log('index', index);
    };

    loaderView = () => {
        return (

            // <Loader loaderVal={this.state.offSetLoaderoffSetLoader}/>
            <View style={{zIndex: 1, backgroundColor: 'transparent'}}>
                <Spinner
                    visible={this.state.offSetLoader}
                    textContent={''}
                    color={'black'}
                />
            </View>
        )
    };


    CoachRoute = () => {
        return (
            <ScrollView
                refreshControl={
                    <RefreshControl
                        refreshing={this.state.refreshing}
                        style={{height: 0, marginTop: 0, backgroundColor: 'transparent'}}
                        onRefresh={() => {
                            // alert('refreshing...')
                            // this.setState({refreshing: true ,offSetLoader:true});
                            this.getChallanges()
//                            this.setState({refreshing:false})
                            // setTimeout(() => this.setState({refreshing: false,offSetLoader:false}), 1000);
                        }}
                        // Android offset for RefreshControl
                        // progressViewOffset={125}
                    />
                }

                style={{flex: 1, backgroundColor: 'transparent', paddingHorizontal: 15}}>
                <View style={{backgroundColor: 'transparent', marginTop: 0, justifyContent: 'center'}}>
                    <ImageBackground resizeMode="contain" style={{height: 90, width: screenWidth - 30}}
                                     source={injoycirclelogo}>


                    </ImageBackground>

                </View>

                {this.renderCoach()}

            </ScrollView>
        )
    }
    poadCastRoute = () => {
        return (

            <ScrollView
                refreshControl={
                    <RefreshControl
                        refreshing={this.state.refreshing}
                        onRefresh={() => {
                            // this.setState({refreshing: true});
                            this.getPoadCast()
                            //setTimeout(() => this.setState({refreshing: false}), 1000);
                        }}
                        // Android offset for RefreshControl
                        progressViewOffset={125}
                    />
                }
                style={{flex: 1, backgroundColor: 'transparent', paddingHorizontal: 15}}>
                <View style={{height: 120, backgroundColor: 'transparent', marginTop: 0, justifyContent: 'center'}}>
                    <ImageBackground resizeMode="contain"
                                     style={[{height: 90, width: screenWidth - 30}, styles.shadowContainer]}
                                     source={injoycirclelogoBlue}>
                    </ImageBackground>
                </View>

                <View style={{marginTop: 0, flexDirection: 'row'}}>
                    <View style={{flex: 0.28}}>
                        <ImageBackground resizeMode="contain" source={{uri: this.state.podcastImage}}
                                         borderRadius={15}
                                         style={[{height: 110, width: 110}, styles.shadowContainer]}>
                        </ImageBackground>
                        <View style={{height: 1, backgroundColor: '#f0f0f0', marginTop: 10}}>

                        </View>
                        <View style={{
                            flexDirection: 'row',
                            marginTop: 18,
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <TouchableOpacity onPress={() => this.handleClick(this.state.podcastdembedUrl[0])}>
                                <Image source={itunes}
                                       style={[{height: 35, width: 35, marginRight: 3}, styles.shadowContainer]}>

                                </Image>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => this.handleClick(this.state.podcastdembedUrl[1])}>
                                <Image source={hotspot}
                                       style={[{height: 35, width: 35, marginLeft: 3}, styles.shadowContainer]}>

                                </Image>
                            </TouchableOpacity>

                        </View>

                    </View>
                    <View style={{flex: 0.7, marginLeft: 10, backgroundColor: 'transparent'}}>
                        {/*<Text style={{marginLeft: 18, fontFamily: 'PoppinsRegular'}}>{this.state.podcastdescription}</Text>*/}


                        <HTML
                            onLinkPress={(event, href)=>{
                              Linking.openURL(href)
                            }}
                            allowFontScaling={false}
                            html={this.state.podcastdescription}
                            imagesMaxWidth={screenWidth - 5}
                            containerStyle={{marginTop: 0, paddingLeft: 15}}
                        />
                    </View>
                </View>
                <Text style={{marginTop: 18, fontFamily: 'PoppinsBold', fontSize: 18}}>Latest Episodes:</Text>
                <View style={{height: 1, backgroundColor: '#f0f0f0', marginTop: 10}}></View>

                <View>
                    {this.renderEpisodes()}
                </View>

            </ScrollView>
        )
    }

    renderEpisodes() {
        return (
            this.state.dataListPodcast.map((item, index) => {
                if (item.description !== undefined) {
                    var result = item.description.replace(/<(.|\n)*?>/g, '');
                    result = result.replace(/\&nbsp;/g, '');
                    result = result.replace(/\&#39;/g, "'");
                    result = result.replace(/\&rsquo;/g, "'");
                    result = result.replace(/\&amp;/g, "&");
                    result = result.replace(/\&quot;/g, '"');
                    result = result.replace(/\&hellip;/g, '...');
                    result = result.replace(/\&rdquo;/g, '"');

                    // alert(result)
                }
                return (
                    <View style={{backgroundColor: 'transparent', marginTop: 0, paddingVertical: 5}}>
                        <View style={{backgroundColor: 'transparent', flexDirection: 'row'}}>
                            <View>
                                {item.image == null &&

                                <ImageBackground source={image3}
                                                 style={{
                                                     resizeMode: 'contain',
                                                     height: 75, width: 75, margin: 2, shadowColor: "#000",
                                                     shadowOffset: {
                                                         width: 0,
                                                         height: 1,
                                                     },
                                                     shadowOpacity: 0.22,
                                                     shadowRadius: 2.22,
                                                     elevation: 6,
                                                 }} borderRadius={75 / 2}>

                                </ImageBackground>

                                }
                                {item.image != null &&

                                <ImageBackground source={{uri: item.image}}
                                                 style={{
                                                     resizeMode: 'contain',
                                                     height: 75, width: 75, margin: 2, shadowColor: "#000",
                                                     shadowOffset: {
                                                         width: 0,
                                                         height: 1,
                                                     },
                                                     shadowOpacity: 0.22,
                                                     shadowRadius: 2.22,
                                                     elevation: 6,
                                                 }} borderRadius={75 / 2}>

                                </ImageBackground>

                                }
                                {/*<Text style={{color:'gray',fontFamily:'PoppinsMedium',fontSize:14,marginTop:5}}>{item.name}</Text>*/}
                            </View>


                            <View style={{
                                backgroundColor: 'transparent',
                                marginLeft: 20,
                                flex: 1,
                                justifyContent: 'center'
                            }}>
                                <Text style={{
                                    color: 'gray',
                                    fontFamily: 'PoppinsRegular',
                                    fontSize: 12
                                }}>{item.created_date}</Text>

                                <Text style={{marginTop: 5, fontFamily: 'PoppinsSemiBold', fontSize: 14}}>
                                    {item.title}</Text>
                                {/*<Image source={arrowfor}*/}
                                {/*       style={{height: 10, width: 10, alignSelf: 'flex-end', marginTop: 3}}></Image>*/}

                            </View>
                        </View>
                        <Text style={{
                            color: 'black',
                            fontFamily: 'PoppinsSemiBold',
                            fontSize: 14,
                            marginTop: 5
                        }}>{item.name}</Text>

                        {/*<Text style={{color: 'gray', fontFamily: 'PoppinsMedium', fontSize: 15, marginTop: 12}}>*/}
                        {/*    {item.description}</Text>*/}
                        {/*<HTML*/}
                        {/*    allowFontScaling={false}*/}
                        {/*    decodeEntities={true}*/}
                        {/*    html={item.description}*/}
                        {/*    // imagesMaxWidth={screenWidth-5}*/}
                        {/*    containerStyle={{marginTop: 3, paddingHorizontal: 0}}*/}
                        {/*/>*/}


                        <ViewMoreText
                            numberOfLines={5}
                            renderViewMore={this.renderViewMore}
                            renderViewLess={this.renderViewLess}
                            textStyle={{textAlign: 'left'}}
                        >
                            {result}
                        </ViewMoreText>

                        <View style={{flexDirection: 'row', marginTop: 10, alignItems: 'center'}}>
                            <TouchableOpacity onPress={() => this.handleClick(item.file_link)}>
                                <ImageBackground source={playbtn} style={[{
                                    width: 70,
                                    height: 23,
                                }, styles.shadowContainer]}></ImageBackground>
                            </TouchableOpacity>
                            {/*<Text style={{*/}
                            {/*    color: 'gray',*/}
                            {/*    fontFamily: 'PoppinsRegular',*/}
                            {/*    fontSize: 12,*/}
                            {/*    marginLeft: 10*/}
                            {/*}}>58 min</Text>*/}

                        </View>
                        <View style={{height: 1, backgroundColor: '#f0f0f0', marginTop: 20}}></View>

                    </View>
                )
            })
        )
    }

    renderCoach() {

    //console.log('this.state.data_list.', this.state.data_list);
        return (
            this.state.data_list.map((item, index) => {
                var nums = ["#FFAE55", "#63BE45", "#4AAFE3", "#F7D100", "#4AAFE3", "#63BE45", "#FFAE55", "#F7D100", "#4AAFE3", "#63BE45", "#FFAE55", "#F7D100", "#4AAFE3", "#63BE45", "#FFAE55", "#F7D100", "#FFAE55", "#63BE45", "#4AAFE3", "#F7D100", "#FFAE55", "#63BE45", "#4AAFE3", "#F7D100", "#4AAFE3", "#63BE45", "#FFAE55", "#F7D100", "#4AAFE3", "#63BE45", "#FFAE55", "#F7D100", "#4AAFE3", "#63BE45", "#FFAE55", "#F7D100", "#FFAE55", "#63BE45", "#4AAFE3", "#F7D100"];
                var bgColor = nums[index];
                return (
                    <TouchableOpacity
                        onPress={() => this.props.navigation.navigate('CoachesSeeAll', {'COACHID': item.coach_id})}
                        style={{
                            height: 81,
                            flex: 1, flexDirection: 'row',
                            backgroundColor: 'white',
                            marginTop: 12, justifyContent: 'center',
                            borderRadius: 42.5,
                            borderColor: bgColor,
                            borderWidth: 2,
                            shadowColor: "#000",
                            shadowOffset: {
                                width: 0,
                                height: 1,
                            },
                            shadowOpacity: 0.22,
                            shadowRadius: 2.22,
                            elevation: 3,
                        }}>
                        <ImageBackground source={{uri: item.image_name}}
                                         style={{
                                             //resizeMode: 'contain',
                                             width: 78, height: 78, marginTop: 0, shadowColor: "#000",
                                             shadowOffset: {
                                                 width: 0,
                                                 height: 1,
                                             },

                                             shadowOpacity: 0.22,
                                             shadowRadius: 2.22,
                                             elevation: 6,
                                         }}
                                         imageStyle={{
                                             backgroundColor: 'transparent',
                                             width: '100%', height: '100%',
                                             resizeMode: "contain",
                                             justifyContent: "flex-start",
                                             alignSelf: "flex-start"
                                         }}
                                         borderRadius={78/2}></ImageBackground>

                        <View style={{flex: 1, backgroundColor: 'transparent', marginLeft: 8, flexDirection: 'row'}}>
                            <View style={{flex: 0.90, marginLeft: 3}}>
                                <Text style={{marginTop: 9, fontSize: 14, fontFamily: 'PoppinsMedium'}}
                                      numberOfLines={2}>{item.name}</Text>
                                <Text style={{marginTop: 3, fontSize: 14, fontFamily: 'PoppinsMedium'}}
                                      numberOfLines={2}>{item.designation}</Text>

                            </View>
                            <View style={{flex: 0.10, justifyContent: 'center', backgroundColor: 'transparent'}}>
                                <Image source={arrowfor} style={{height: 23, width: 15, alignSelf: 'center'}}></Image>
                            </View>
                        </View>


                    </TouchableOpacity>
                )
            })
        )
    }

    VideoRoute = () => {
        return (
            <ScrollView
                refreshControl={
                    <RefreshControl
                        refreshing={this.state.refreshing}
                        style={{height: 0, backgroundColor: 'transparent'}}
                        onRefresh={() => {
                            // alert('refreshing...')
                            //this.setState({refreshing: true});
                            this.getVideoContent()
                            // setTimeout(() => this.setState({refreshing: false}), 1000);
                        }}
                        // Android offset for RefreshControl
                        progressViewOffset={125}
                    />
                }

                style={{flex: 1, backgroundColor: 'transparent', paddingHorizontal: 15}}>
                <View style={{
                    height: 110, backgroundColor: 'transparent', marginTop: 0, paddingVertical: 0,
                    justifyContent: 'center', alignItems: 'center'
                }}>
                    <ImageBackground resizeMode={'contain'}
                                     style={{height: 90, width: '100%', alignSelf: 'center'}} source={bar}>

                    </ImageBackground>

                </View>
                <View style={{marginBottom: 20}}>
                    {this.renderVideo()}
                </View>

            </ScrollView>
        )
    }

    renderVideo() {
        var list = this.state.datListVideoContent
        var challangeId = this.state.challangeId
        //console.log("library item===>" + JSON.stringify(list))

        return (
            list.map((item, index) => {
                //console.log("library item===>"+JSON.stringify(item.image))
                return (
                    <TouchableOpacity
                        onPress={() => this.props.navigation.navigate('LibraryVideoContentSeeAll', {
                            'DATA': {
                                'ITEMID': item.id,
                                'CHID': challangeId,
                                'TITLE': item.name
                            }
                        })}
                        style={{
                            height: 85,
                            flex: 1, flexDirection: 'row',
                            backgroundColor: item.color_code,
                            marginTop: 12, justifyContent: 'center',
                            borderRadius: 29,
                            borderColor: item.color_code,
                            borderWidth: 2,
                            shadowColor: "#000",
                            shadowOffset: {
                                width: 0,
                                height: 1,
                            },
                            shadowOpacity: 0.22,
                            shadowRadius: 5.22,
                            elevation: 3,
                        }}>
                        <ImageBackground source={{uri: item.image}}
                                         style={{
                                             resizeMode: 'contain',
                                             height: 75, width: 75, margin: 2, shadowColor: "#000",
                                             shadowOffset: {
                                                 width: 0,
                                                 height: 1,
                                             },
                                             shadowOpacity: 0.22,
                                             shadowRadius: 2.22,
                                             elevation: 6,
                                         }} borderRadius={75 / 2}></ImageBackground>

                        <View style={{flex: 1, backgroundColor: 'transparent', marginLeft: 8, flexDirection: 'row'}}>
                            <View style={{
                                flex: 0.90,
                                marginLeft: 3,
                                backgroundColor: 'transparent',
                                justifyContent: 'center'
                            }}>

                                <Text style={{marginTop: 0, fontSize: 15, fontFamily: 'PoppinsBold'}}
                                      numberOfLines={2}>{item.name}</Text>

                            </View>
                            <View style={{flex: 0.10, justifyContent: 'center', backgroundColor: 'transparent'}}>
                                <Image source={arrowfor} style={{height: 23, width: 15, alignSelf: 'center'}}></Image>
                            </View>
                        </View>
                    </TouchableOpacity>
                )
            })
        )
    }

    render() {
        return (
            <View style={styles.view_container}>
                {/* Header View */}
                <View style={styles.header_view}>
                    <ImageBackground source={headerback} style={styles.header_image}>
                        <Text
                            style={{
                                fontFamily: 'PoppinsBold',
                                fontSize: 23,
                                marginTop: 43,
                                marginLeft: 8
                            }}> Library </Text>
                    </ImageBackground>

                </View>
                {/* Ended Header View */}
                <TabView navigationState={this.state} style={{backgroundColor: 'white'}}
                         renderScene={SceneMap({
                             first: this.state.offSetLoader ? this.loaderView : this.CoachRoute,
                             second: this.state.offSetLoader ? this.loaderView : this.poadCastRoute,
                             third: this.state.offSetLoader ? this.loaderView : this.VideoRoute
                         })}
                         scrollEnabled
                    // onSwipeStart={()=>alert('swipping...')}
                         tabStyle={{flex: 1}}
                    // onIndexChange={index => this.setState({index})}
                         onIndexChange={index => this.handleIndexChange(index)}
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


const ThirdRoute = () => (
    <View style={[styles.scene, {backgroundColor: 'red'}]}/>
);


const styles = StyleSheet.create({

    view_container: {
        flex: 1,
        backgroundColor: 'white'
    },
    shadowContainer: {
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,
        elevation: 6,
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
    header_image: {
        flex: 1,
        height: 125,

    },

});
