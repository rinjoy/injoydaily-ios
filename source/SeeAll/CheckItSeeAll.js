import React, {Component} from 'react';
import {
    FlatList,
    Image,
    ImageBackground,
    Keyboard,
    StyleSheet,
    ActivityIndicator,
    Text,
    KeyboardAvoidingView,
    TextInput,ScrollView,
    TouchableOpacity,
    View
} from 'react-native';
import * as SecureStore from 'expo-secure-store';
import {Dropdown} from 'react-native-material-dropdown';
import {Video} from "expo-av";
import HTML from "react-native-render-html";
import Spinner from "react-native-loading-spinner-overlay";
//import {  Radio  } from 'native-base';
const headerback = require('../../images/image-8.png');
const menuImg = require('../../assets/menu.png');
const whitecheck = require('../../assets/checkwhite.png');

const checkyellow = require('./../../images/checkorange1.png');
const checkgray = require('./../../images/checkgray.png');
const tickets = require('../../assets/downarrow.png');
const downarrow = require('../../assets/downarrow.png');
const gallaryblack = require('../../assets/gallaryblack.png');
const nextgray = require('../../assets/nextgray.png');
const backarrow = require('../../assets/backarrow.png');
const profile = require('../../images/image-9.png');
const messageopenblack = require('../../images/injoycirclelogo.png');


const getAccessToken = async () => {
    return await SecureStore.getItemAsync('token');
};

const getUserId = async () => {
    return await SecureStore.getItemAsync('id');
};


const timeArray = [
    {

        value: 'User',
    }, {

        value: 'Admin',
    }, {

        value: 'Teacher'
    },
];

export default class CheckItSeeAll extends Component {

    constructor(props) {
        super(props);

        this.state = {
            data: true,
            loader: false,
            accessToken: '',
            challengeId: this.props.navigation.state.params.DATA.challenge_id,
            categoryId: this.props.navigation.state.params.DATA.category_id,
            featureId: 7,
            dropDowntext: '',
            day: this.props.navigation.state.params.DATA.day,
            data_list: [],
            offSetLoader: true,
            uid:this.props.navigation.state.params.DATA.uid,
            week: this.props.navigation.state.params.DATA.week,
            hederTitle: '',
            countRecords: 0,
            contentData:[],
            question: '',
            profilePic: null,
            userName: '',
            textInoutHint: '',
            buttonHint: '',
            radioImageFirst:false,
            radioSecondbutton:false,
            countTodayCheckIn:0
            ,commentText:'',
            stickyHeaderIndices: [],
            selectedItemId:null,
        }
        this.renderRow = this.renderRow.bind(this);
        this.renderEmptyContainer = this.renderEmptyContainer.bind(this);
    }


    componentDidMount() {
        getAccessToken().then(token =>
                this.setState({accessToken: token}),
            //this.getDailyInspirationApiData(token)
        );


        getUserId().then(id =>
            this.setState({id: id}),
        );

        this.getDataObject();
    }


    getDataObject() {

        //alert(this.state.day)

        setTimeout(() => {


            if (this.state.challengeId != undefined) {
                if (this.state.day != undefined) {
                    this.getListData();
                }
            }
        }, 1000);
    }


    async  getListData(){
        const token_ = await SecureStore.getItemAsync('token');
        const url = global.base_url_live+'v1/api/get-checkins-all';
        // "challenge_id" : 5,
        //     "page_size" : 3,
        //     "feature_id" : 7,
        //     "data_offset" : 0
        var parameters = {
            challenge_id: this.state.challengeId,
            page_size : 0,
            data_offset : 0,
            feature_id: this.state.featureId,
            uid:this.state.id,
            show_today : 0
            //day: day,
          //  category_id: categoryId
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
                console.log('dataobject', dataobject);
                    this.setState({offSetLoader: false});
                    this.InheritedData(dataobject);
                }
            )
            .catch((error) => {
            })
    }

    InheritedData(data) {
      if(data.status){
        console.log('----00000))))',data.checkins_all);
          this.setState({countRecords: data.count_records});
          this.setState({contentData:data.checkins_all})
          this.setState({profilePic: data.user_details.profile_pic});
          //alert(data.user_details.profile_pic);
          this.setState({userName: data.user_details.username});
      }
    }

    renderEmptyContainer() {
      return(
        <View style={{flex: 1, justifyContent: 'center', backgroundColor: 'transparent', marginTop: 50}}>
            <Text style={{fontFamily: 'PoppinsLight', textAlign: 'center'}}>no content available now.</Text>
        </View>
      )
    }

    renderRow(dataHolder, index) {
        if((dataHolder.header_month == false && dataHolder.header_date == false)) {
        var newDate = dataHolder.content.time.split(',');
        var label  = dataHolder.content.label;
        var comment  = dataHolder.content.comment;
        return (
            <View
                key={index}
                style={{marginTop: 8, backgroundColor: 'white',flex:1,padding:12,flexDirection:'row',borderRadius:6}}>
                <View style={{flex: 0.15, backgroundColor: 'transparent', justifyContent: 'flex-start', alignItems: 'flex-start'}}>
                  {this.state.profilePic == null &&
                  <Image
                      source={profile}
                      style={{width: 45, height: 45, borderRadius: 45/2}}>
                  </Image>
                  }
                  {this.state.profilePic != null &&
                  <Image
                      source={{uri: this.state.profilePic}}
                      style={{width: 45, height: 45, borderRadius: 45/2}}>
                  </Image>
                  }
                </View>
                <View style={{flex: 0.01}}>
                </View>
                <View style={{flex:0.59, backgroundColor: 'transparent'}}>
                    <Text style={{fontSize:13,color:'black',fontFamily:'PoppinsBold',marginRight:5}}>{this.state.userName}</Text>
                    <Text style={{fontSize:12,color:'black',fontFamily:'PoppinsSemiBold',marginRight:5}}>{label}</Text>
                    <Text style={{fontSize:11,color:'gray',fontFamily:'PoppinsLight',marginTop:3,marginRight:5}}>{comment}</Text>
                </View>
                <View style={{flex:0.25,backgroundColor: 'transparent', alignItems:'flex-end', justifyContent:'center'}}>
                    <Text style={{fontSize:11,color:'gray',fontFamily:'PoppinsLight',marginTop:0}}>{newDate[0]}</Text>
                </View>


            </View>
        )
      }
      else if(dataHolder.header_month == true && dataHolder.header_date == false)
      {
        return(
            <View style={{flex: 1, backgroundColor: 'transparent', justifyContent: 'center', alignItems: 'center', marginTop: 0, paddingBottom: 0, marginBottom: -20}}>
              <Text style={{fontFamily: 'PoppinsSemiBold', fontSize: 18}}>{dataHolder.content}</Text>
            </View>
        )
      }
        else if((dataHolder.header_date == true && dataHolder.header_month == false))
        {
          return(
              <View style={{marginTop: 20}}>
              </View>
          )
        }
        else if((dataHolder.header_date == false && dataHolder.header_month == true))
        {
          return(
              <View style={{marginTop: 0}}>
              </View>
          )
        }

    }

    shiftBack() {
      this.props.navigation.goBack();
    }



    render() {
        return (
            <View style={styles.container}>
            <Spinner visible={this.state.offSetLoader} textContent={''} color={'black'}/>
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
                                marginLeft: 10,
                                alignContent: 'center',
                                justifyContent: 'center',
                                width: '70%'
                            }}>
                                <Text style={{fontFamily: 'PoppinsBold', color: '#fff', fontSize: 18}}
                                      numberOfLines={1}> My Check in
                                </Text>
                            </View>

                        </View>
                    </ImageBackground>

                </View>
                {/* Ended Header View */}
                <KeyboardAvoidingView style={{ flex: 1, flexDirection: 'column', justifyContent: 'center',}} enabled   keyboardVerticalOffset={0}>
                <ScrollView style={{flex: 1, paddingHorizontal: 15,backgroundColor:'transparent'}}>

                    <View style={{backgroundColor:'transparent',flex:1,marginTop:7}}>
                        <FlatList
                            style={styles.flatlist}
                            //keyExtractor={this._keyExtractor}
                            //showsHorizontalScrollIndicator={false}
                             showsVerticalScrollIndicator={false}
                            data={this.state.contentData}
                          //  ListFooterComponent={this.footerComponent}
                          //  onEndReached={this.handeLoadMoreItem}
                           // onEndReachedThreshold={0}
                           // pagingEnabled={false}
                          //  extraData={this.state}
                          renderItem={({item, index}) => this.renderRow(item, index)}
                          keyExtractor={(item, index) => index.toString()}
                          ListEmptyComponent={this.renderEmptyContainer}
                          stickyHeaderIndices={this.state.stickyHeaderIndices}/>



                    </View>
                </ScrollView>
                </KeyboardAvoidingView>
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
    radiobuttonContainer:{
        height:20,width:20,borderRadius:20/2,marginLeft:10,
        backgroundColor:'black',borderColor:'white',borderWidth:1,justifyContent:'center',alignItems:'center'
    },radiobuttonImageContainer:{
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
    },
});
