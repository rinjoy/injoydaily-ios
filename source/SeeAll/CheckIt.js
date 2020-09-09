import React, {Component} from 'react';
import {
    FlatList,
    Image,
    ImageBackground,
    Keyboard,
    StyleSheet,
    Text,
    ActivityIndicator,
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
import Toast from "react-native-easy-toast";
import Emoji from "react-native-emoji";
//import {  Radio  } from 'native-base';
const headerback = require('../../images/image-8.png');
const menuImg = require('../../assets/menu.png');
const whitecheck = require('../../assets/checkwhite.png');

const checkyellow = require('../../images/checkblue.png');
const checkgray = require('../../images/disable-check-1.png');
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

export default class CheckIt extends Component {

    constructor(props) {
        super(props);

        this.state = {
            data: true,
            loader: false,
            accessToken: '',
            challengeId: this.props.navigation.state.params.challenge_details.challenge_id,
            categoryId: this.props.navigation.state.params.challenge_details.feature_category_id,
            featureId: 7,
            dropDowntext: '',
            offSetLoader: true,
            day: this.props.navigation.state.params.challenge_details.day,
            points: this.props.navigation.state.params.basic_details.points,
            data_list: [],
            uid:'',
            week: this.props.navigation.state.params.challenge_details.week,
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
            selectedItemId:null,
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
        this.getListData();
        this.getDataObject();
    }


    async getDataObject(dataObject) {

        //alert(this.state.day)

        setTimeout(() => {


            if (this.state.challengeId != undefined) {
                // this.setState({offSetLoader:true});
                // alert(this.state.day)
                if (this.state.day != undefined) {
                    // alert(this.state.day)
                    this.getDailyInspirationApiData();
                }
            }
        }, 1000);
    }

    async getDailyInspirationApiData() {
        const token_ = await SecureStore.getItemAsync('token');
        const url = global.base_url_live+'v1/api/get-checkin-yourself-content-current';
        var parameters = {
            challenge_id: this.state.challengeId,
            feature_id: this.state.featureId,
            day: this.state.day,
            category_id: this.state.categoryId
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
                   // alert(JSON.stringify(responseText))
                    //this.setState = ({data_list: dataobject})
                    // Alert.alert('injoy' ,JSON.stringify(dataobject),[{text: 'Ok', onPress: () => this.setState({showloader: false})}])
                    this.InheritedData(dataobject);
                }
            )
            .catch((error) => {
            })
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
            show_today : 1
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
                    this.setState({offSetLoader: false});
                    console.log('dataobject', dataobject);
                     //alert(JSON.stringify(responseText))
                     if(dataobject.status){

                         this.setState({countRecords: dataobject.count_records});
                         this.setState({contentData:dataobject.checkins_all});
                         this.setState({profilePic: dataobject.user_details.profile_pic});
                         this.setState({userName: dataobject.user_details.username});
                     }
                }
            )
            .catch((error) => {
            })
    }

    InheritedData(data) {
      //console.log('Recovered Data', data.checkin_yourself_current.checkin_content.drop_down_text);
        //  alert('1').
        if (data.status == true) {
            this.setState({question:''});
            this.setDataList(data.checkin_yourself_current.checkin_content.labels);
            this.setState({hederTitle: data.checkin_yourself_current.feature_name});
            this.setState({countTodayCheckIn: data.checkin_yourself_current.count_today_checkins});
            this.setState({question: data.checkin_yourself_current.checkin_content.question});
            this.setState({textInoutHint: data.checkin_yourself_current.checkin_content.placeholder_text});
            this.setState({buttonHint: data.checkin_yourself_current.button_text});
            this.setState({dropDowntext: data.checkin_yourself_current.checkin_content.drop_down_text});

            // alert(data.checkin_yourself_current.checkin_content.placeholder_text);
            this.checkIn(this.state.countTodayCheckIn)


        }
    }

    checkIn(checkInCount){
        if (checkInCount == 1){
            this.setState({radioImageFirst:true});
        }else if (checkInCount == 2){
            this.setState({radioImageFirst:true,radioSecondbutton:true});
        }
    }

    setDataList(text) {
        this.setState({data_list: text});
        //alert(this.state.data_list);
    }

    async submitData(){

        if( this.state.selectedItemId == null){
            alert('please select any lable...');
        }
        else if(this.state.commentText == '') {
            alert('please fill the comment..')
        } else{

            const token_ = await SecureStore.getItemAsync('token');
            const url = global.base_url_live+'v1/api/submit-checkin-yourself-action';

            var parameters = {
              challenge_id: this.state.challengeId,
              feature_id: this.state.featureId,
              week: this.state.week,
              uid: this.state.id,
              comment:this.state.commentText,
              label_id:this.state.selectedItemId
            };

            var token = `Bearer ${JSON.parse(token_)}`;
            //alert(JSON.stringify(parameters));


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
                      //  alert(JSON.stringify(responseText));
                        this.checkSuccessOrNot(dataobject);


                    }
                )
                .catch((error) => {
                })
        }

    }

    checkSuccessOrNot(dataObject){
        if(dataObject.status){
            this.setState({commentText:'',selectedItemId:null});
            this.setState({dropDowntext: ''});
            //this.setState({dropDowntext: 'Today I connected with:'});
            this.getListData();
            this.getDataObject();
            this.refs.toast.show(
                <View style={{flexDirection:'row',alignItems:'center'}}>
                    <Text style={{color:'white',fontSize:12}}>Yes!  </Text>
                    <Emoji name="muscle" style={{fontSize: 12,color:'White',backgroundColor:'transparent'}}
                    />

                </View>)


        }else{
            alert('failed')
        }


    }

    renderRow(dataHolder, index) {
        if((dataHolder.header_month == false && dataHolder.header_date == false)) {
          var newDate = dataHolder.content.time.split(',');
          var label  = dataHolder.content.label;
          var comment  = dataHolder.content.comment;
          var name = this.state.userName;
          var profPic = this.state.profilePic;
          return (
              <View
                  key={index}
                  style={{marginTop: 8, backgroundColor: 'white',flex:1,padding:12,flexDirection:'row',borderRadius:6}}>
                  <View style={{flex: 0.18, backgroundColor: 'transparent', justifyContent: 'flex-start', alignItems: 'flex-start'}}>
                    {profPic == null &&
                    <Image
                        source={profile}
                        style={{width: 50, height: 50, borderRadius: 50/2}}>
                    </Image>
                    }
                    {profPic != null &&
                    <Image
                        source={{uri: profPic}}
                        style={{width: 50, height: 50, borderRadius: 50/2}}>
                    </Image>
                    }
                  </View>
                  <View style={{flex:0.60}}>
                      <Text style={{fontSize:13,color:'black',fontFamily:'PoppinsBold',marginRight:5}}>{name}</Text>
                      <Text style={{fontSize:12,color:'black',fontFamily:'PoppinsSemiBold',marginRight:5}}>{label}</Text>
                      <Text style={{fontSize:13,color:'gray',fontFamily:'PoppinsLight',marginTop:3,marginRight:5}}>{comment}</Text>
                  </View>
                  <View style={{flex:0.22,alignItems:'flex-end', justifyContent:'center'}}>
                      <Text style={{fontSize:12,color:'gray',fontFamily:'PoppinsLight',marginTop:0}}>{newDate[0]}</Text>
                  </View>


              </View>
          )
        }
        else{
          return (
            <View></View>
          )
        }

    }

    shiftBack() {
      var obj={'day':this.state.day, 'week':this.state.week, 'challengeId':this.state.challengeId, 'uid': this.state.id}
      this.props.navigation.state.params.onGoBack(obj);
      this.props.navigation.goBack();
    }

    navigateToAll(challangeId, categoryId, featureId, week, uid, day) {
      Keyboard.dismiss();
        //alert(categoryId)
        var parameters = {
            //  token: JSON.parse(token_),
            challenge_id: challangeId,
            category_id: categoryId,
            feature_id: featureId,
            week: week,
            day: day,
            uid: uid
        };

        this.props.navigation.navigate('CheckItSeeAll', {DATA: parameters});
    }

    textInputFocused () {
      this.scrollView.scrollTo(50);
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
                                      numberOfLines={1}> {this.state.hederTitle == "" ? '-' : this.state.hederTitle}
                                </Text>
                            </View>

                        </View>
                    </ImageBackground>


                </View>
                {/* Ended Header View */}
                <Toast
                    ref="toast"
                    style={{backgroundColor: '#4AAFE3',borderRadius:90}}
                    position='top'
                    positionValue={130}
                    fadeInDuration={700}
                    fadeOutDuration={900}
                    opacity={0.8}
                    textStyle={{color:'#fff'}}
                />
                <KeyboardAvoidingView style={{ flex: 1,  flexDirection: 'column', justifyContent: 'center',}} behavior='padding' enabled   keyboardVerticalOffset={0}>
                <ScrollView keyboardShouldPersistTaps={'handled'} ref={ref => {this.scrollView = ref}} style={{flex: 1, paddingHorizontal: 15, backgroundColor:'transparent'}}>
                    <View style={{
                        alignItems: 'center',
                        flexDirection: 'row',
                        marginLeft: 0,
                        marginTop: 20,

                        flexDirection: 'row',
                        backgroundColor: 'transparent'
                    }}>
                        <View style={{flex: 0.14}}>
                          <Image style={{width:50,height:50}} source = {messageopenblack}>
                          </Image>
                        </View>
                        <View style={{flex: 0.86}}>
                        <Text style={{fontFamily: 'PoppinsRegular', marginLeft: 10, marginRight: 0}}
                              numberOfLines={2}>{this.state.question}</Text>
                        </View>

                    </View>

                    {/* <View style={styles.name_view}>
                     <TextInput placeholder='Name' style={{width:'100%',marginLeft:10}}>
                        </TextInput>
                </View> */}


                    <View style={{
                        backgroundColor: 'white',
                        paddingLeft: 10,
                        height: 45,
                        borderRadius: 3, marginTop: 10

                    }}>


                        <Dropdown
                            borderBottomColor={'gray'}
                            containerStyle={{bottom: 20, color: 'gray'}}
                            data={this.state.data_list}
                            fontSize={14}
                            onChangeText={(value, index, data) =>[this.setState({selectedItemId:data[index].id})]}
                            itemTextStyle={{color: 'gray'}}
                            value={this.state.dropDowntext == "" ? "-" : this.state.dropDowntext}
                            inputContainerStyle={{borderBottomWidth: 0, color: 'gray'}}
                          //  onChangeText={selectedItem => [console.log("get data is ==>", selectedItem)]}
                        />


                    </View>


                    <View style={styles.email_view}>
                        <TextInput
                            placeholder={this.state.textInoutHint == ""?'-':this.state.textInoutHint}
                            value={this.state.commentText}
                            onFocus={this.textInputFocused.bind(this)}
                            onChangeText={(text) => this.setState({commentText: text})}
                            style={{width:"100%",paddingHorizontal:10,textAlignVertical:'top',backgroundColor:'transparent',height:'100%',paddingVertical:10}}
                            numberOfLines={8}
                            multiline={true}>

                        </TextInput>
                    </View>

                    <View style={{justifyContent: 'center', backgroundColor: 'transparent', flex: 1, flexDirection: 'row', alignItems: 'center'}}>
                    <View style={{flex: 0.2, backgroundColor: 'transparent'}}>
                    </View>
                    <View style={{flex: 0.6, justifyContent: 'center', backgroundColor: 'transparent', alignItems: 'center'}}>
                    <TouchableOpacity style={{
                        backgroundColor: '#4AAFE3',
                        paddingVertical: 8,
                        paddingHorizontal: 25,
                        marginTop: 10,
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: 25,
                        flexDirection:'row'
                    }}
                    onPress={()=>[Keyboard.dismiss(),
            this.submitData()]}
                    >
                    {this.state.countTodayCheckIn == 0 &&
                      <View style={{flexDirection: 'row'}}>
                            <Image source={checkgray}
                                   style={{width: 18, height: 18}}>
                            </Image>
                            <Image source={checkgray}
                                   style={{width: 18, height: 18, marginLeft: 3}}>
                            </Image>
                      </View>
                    }
                    {this.state.countTodayCheckIn == 1 &&
                      <View style={{flexDirection: 'row'}}>
                            <Image source={checkyellow}
                                   style={{width: 18, height: 18}}>
                            </Image>
                            <Image source={checkgray}
                                   style={{width: 18, height: 18, marginLeft: 3}}>
                            </Image>
                      </View>
                    }
                    {this.state.countTodayCheckIn >= 2 &&
                      <View style={{flexDirection: 'row'}}>
                            <Image source={checkyellow}
                                   style={{width: 18, height: 18}}>
                            </Image>
                            <Image source={checkyellow}
                                   style={{width: 18, height: 18, marginLeft: 3}}>
                            </Image>
                      </View>
                    }

                        <Text style={{
                            marginLeft: 10,
                            fontFamily: 'PoppinsBold',
                            fontSize: 12,
                            color: 'white'
                        }}>SUBMIT {this.state.points} POINTS</Text>
                    </TouchableOpacity>
                </View>

                <View style={{flex: 0.2, justifyContent: 'center', alignItems: 'flex-end', backgroundColor: 'transparent'}}>
                        <View style={{alignItems: 'center', justifyContent: 'center', marginTop: 10}}>
                            <TouchableOpacity
                                style={{borderRadius: 5,
                                  alignItems: 'center',
                                  width: '100%',
                                  justifyContent: 'center'}}
                                onPress={() => this.navigateToAll(this.state.challengeId, this.state.categoryId, this.state.featureId, this.state.week, this.state.id, this.state.day)}>
                                <Text style={{fontSize: 15, color: 'black', borderBottomWidth: 1, fontFamily: 'PoppinsRegular'}}>See All ></Text>
                            </TouchableOpacity>
                        </View>
                </View>

                    </View>
                    <View style={{backgroundColor:'transparent',flex:1,marginTop:15}}>

                    {this.state.userName !== '' &&
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
                          keyExtractor={(item, index) => index.toString()}/>

                      }

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
            , paddingHorizontal: 0, paddingVertical: 15
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
