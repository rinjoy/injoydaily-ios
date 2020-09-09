import React, {Component} from 'react';
import {
    ActivityIndicator,
    FlatList,
    Image,
    ImageBackground,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import * as SecureStore from 'expo-secure-store';
import {Video} from 'expo-av';

const headerback = require('../../images/image-8.png');
const menuImg = require('../../assets/menu.png');
const whitecheck = require('../../assets/checkwhite.png');
const backarrow = require('../../assets/backarrow.png');


const getAccessToken = async () => {
    return await SecureStore.getItemAsync('token');
};

const getUserId = async () => {
    return await SecureStore.getItemAsync('id');
};


export default class JeffUpdateSeeAll extends Component {

    constructor(props) {
        super(props);

        this.state = {
            data: true,
            loader: false,
            accessToken: '',
            challengeId: '',
            categoryId: '',
            shouldPlay: false,
            isPause: true,
            featureId: 13,
            itemCount: 0,
            offSet: 0,
            day: '',
            data_list: [],
            uid: '',
            week: '',
            totalItemCounts: 0,
            offSetLoader: false,
            gotItems: false
        }
        this.renderRow = this.renderRow.bind(this);
    }

    componentDidMount() {
        getAccessToken().then(token =>
                this.setState({accessToken: token}),
            //this.getDailyInspirationApiData(token)
        );


        getUserId().then(id =>
            this.setState({id: id}),
        );

        this.getDataObject(this.props.navigation.state.params.DATA);
    }


    getDataObject(dataObject) {

        this.setState({challengeId: dataObject.challenge_id});
        this.setState({categoryId: dataObject.category_id});
        this.setState({uid: this.state.id});
        //alert(this.state.day)

        setTimeout(() => {
            if (this.state.challengeId != undefined) {
                if (this.state.day != undefined) {
                    this.setState({offSetLoader: true});
                    this.getAllDew(this.state.challengeId, this.state.categoryId, this.state.featureId, this.state.id);
                }
            }
        }, 1000);
    }

    async getAllDew(challangeId, featureCategoryId, featureId, uid) {
        const token_ = await SecureStore.getItemAsync('token');
        const url = global.base_url_live+'v1/api/get-jeff-updates-inactive-content-see-all';


        var parameters = {
            challenge_id: challangeId,
            category_id: featureCategoryId,
            feature_id: featureId,
            uid: uid
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
                    console.log('dataobject--->', dataobject);
                     this.setState({offSetLoader: false});
                    this.setState({itemCount: dataobject.jeff_updates.length});
                    var itemslength =  dataobject.jeff_updates.length;
                    this.setItemEmptyOrNot(itemslength)
                     this.InheritedData(dataobject);
                }
            )
            .catch((error) => {
            })
    }

    InheritedData(data) {
        if (data.status == true) {
            var list = data.jeff_updates;
            this.setState({data_list: this.state.data_list.concat(list)})
        }
    }

    setItemEmptyOrNot(itemslength) {
        if (itemslength == 0) {
            this.setState({totalItemCounts: dataobject.count_records, gotItems: true});
        }
    }

    renderRow(dataHolder) {
        //console.log(dataHolder)
        return (

            <View>
                <View style={{
                    margin: 2, marginTop: 10,
                    backgroundColor: 'transparent', padding: 5
                }}>
                    <View style={{flex: 1, backgroundColor: 'transparent', flexDirection: 'row'}}>
                        <Image source={{uri: dataHolder.item.dashboard_image}}
                               style={{height: 50, width: 50, marginLeft: 6, borderRadius: 50 / 2, marginTop: 5}}/>
                        <View style={{
                            backgroundColor: "transparent",
                            flex: 1,
                            height: '100%',
                            marginLeft: 10,
                            marginRight: 10,
                            marginTop: 5,
                            padding: 1
                        }}>

                            <View style={{
                                backgroundColor: 'transparent',
                                alignItems: "flex-start",
                                //flexDirection: 'row',
                                //justifyContent: 'space-between'
                            }}>
                                <Text style={{fontFamily: 'PoppinsBold'}}>{dataHolder.item.title}</Text>
                                <Text style={{
                                    fontFamily: 'PoppinsRegular',
                                    color: 'black',
                                    fontSize: 12
                                }}>{dataHolder.item.description}</Text>
                            </View>

                        </View>

                    </View>

                    <View style={{flex: 1, marginTop: 12}}>
                    {(dataHolder.item.file_type == 'v' && dataHolder.item.file !== null) &&
                          <Video
                              source={{uri: dataHolder.item.file}}
                              rate={1.0}
                              volume={1.0}
                              isMuted={false}
                              ref={videoplayer => {
                                  this.videoPlayer = videoplayer
                              }}
                              resizeMode="stretch"
                              //onTouchStart={() => alert('start')}
                              isLooping={false}
                              shouldPlay={this.state.shouldPlay}
                              //  shouldCorrectPitch={true}
                              useNativeControls={true}
                              paused={this.state.isPause}
                              //onMagicTap={()=>alert('ff')}
                              //paused={this.state.shouldPlay[index]}
                              //  onPlaybackStatusUpdate={(isPlaying ,isBuffering ) =>console.log(isPlaying.isPlaying)}
                              // onPlaybackStatusUpdate={()=>alert("playing")}
                              // onReadyForDisplay={()=>alert('playing...')}
                              // usePoster={true}
                              // onPlaybackStatusUpdate={(status)=>console.log(status)}
                              posterSource={{url: dataHolder.item.video_poster}}
                              posterStyle={{width: '100%', height: 220, resizeMode: 'stretch'}}
                              style={{width: '100%', height: 220, borderRadius: 6, marginTop: 20}}
                          />
                    }
                    </View>

                </View>
                <View style={{height: 1, backgroundColor: 'rgba(54,69,79,0.35)', marginTop: 10}}></View>
            </View>


        )

    }

    handeLoadMoreItem = () => {
        if (this.state.itemCount !== 0) {
            this.setState({offSet: this.state.offSet + 10});
            this.getAllDew(this.state.challengeId, this.state.featureId, this.state.day, this.state.week, this.state.uid);

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
        return (<View style={{height: 20}}></View>);
    }

    renderNoItemView() {

        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
            <Text>No data found</Text>
        </View>
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
                                marginLeft: 10,
                                alignContent: 'center',
                                justifyContent: 'center',
                                width: '70%'
                            }}>
                                <Text style={{fontFamily: 'PoppinsBold', color: '#fff', fontSize: 18}}
                                      numberOfLines={1}>See All
                                </Text>
                            </View>

                        </View>
                    </ImageBackground>

                </View>
                {/* Ended Header View */}

                <View style={{flex: 1, paddingHorizontal: 15, backgroundColor: 'white'}}>
                    {(this.state.totalItemCounts == 0 && this.state.gotItems) &&
                    this.renderNoItemView()
                    }
                    <FlatList
                        style={styles.flatlist}
                        //  keyExtractor={this._keyExtractor}
                        //showsHorizontalScrollIndicator={false}
                        showsVerticalScrollIndicator={false}
                        data={this.state.data_list}
                        ListFooterComponent={this.footerComponent}
                        //onEndReached={this.handeLoadMoreItem}
                        //onEndReachedThreshold={100}
                        pagingEnabled={false}
                        extraData={this.state}
                        renderItem={this.renderRow}/>


                </View>
            </View>

        );

    }

}
    const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: '#f0f0f0'
    },

    flatlist: {
        flex: 1, backgroundColor: 'transparent'
        , paddingHorizontal: 0, paddingVertical: 0
    },
    radiobuttonContainer: {
        height: 20, width: 20, borderRadius: 20 / 2, marginLeft: 0,
        backgroundColor: 'black', borderColor: 'white', borderWidth: 1, justifyContent: 'center', alignItems: 'center'
    }, radiobuttonImageContainer: {
        height: 20, width: 20, alignItems: 'center', justifyContent: 'center'
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
        width: 25,
        height: 25,
        marginLeft: 15,


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
        marginTop: 5, alignItems: 'center', height: 60, backgroundColor: "transparent"
    }
});
