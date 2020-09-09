import React,{Component} from 'react';
import {View,StyleSheet,Text,Image,ImageBackground,TouchableOpacity,ScrollView,TextInput,FlatList,Switch, AsyncStorage} from 'react-native';
import * as SecureStore from 'expo-secure-store';
const headerback = require('./../images/image-8.png')
const menuImg = require('./../assets/menu.png')
const tickets = require('./../assets/downarrow.png')
const downarrow = require('./../assets/downarrow.png')
const gallaryblack = require('./../assets/gallaryblack.png')
const nextgray = require('./../assets/nextgray.png')
const backarrow = require('./../assets/backarrow.png')
const profile = require('./../images/image-9.png')
const messageopenblack = require('./../assets/messageopenblack.png')
import {Dropdown} from 'react-native-material-dropdown';




const getAccessToken = async () => {
    return await SecureStore.getItemAsync('token');
};

const getUserId = async () => {
    return await SecureStore.getItemAsync('id');
};




const timeArray =[
    {

        value: 'User',
    }, {

        value: 'Admin',
    }, {

        value: 'Teacher'
    },
]

export default class DoComment extends Component {

    constructor(props) {
        super(props)

        this.state={
            data: true,
            loader:false,
            accessToken:'',
            challengeId:'',
            featureId:'',
            day:'',data_list:[],
            hederTitle:'',
            question:'',UID:'',
            textInoutHint:'',
            buttonHint:'',buttonDisable:false,commentText:'',
        }
    }



    componentDidMount(){

     getAccessToken().then(token =>
            this.setState({accessToken:token}),
            //this.getDailyInspirationApiData(token)
        );

        
        getUserId().then(id =>
            this.setState({id: id}),
        );

        
       // const value = await AsyncStorage.getItem('TASKS');

       
      // alert(JSON.stringify(this.props.navigation.state.params.DATA.feature_id));
       const props = this.props.navigation.state.params.DATA;
       const feature_id = props.feature_id;
       const uid = props.uid;
       const challengeId = props.challenge_id;


       this.setState({ challengeId:challengeId});
       this.setState({ featureId:feature_id});
       this.setState({ UID:uid});
          
    }

  
    notDo(){
        return;
    }

      async  doComment(){
            //this.setState({offSetLoader:true});
                if(this.state.commentText != ''){
                    
                    const token_  = await SecureStore.getItemAsync('token');
                    const url = global.base_url_live+'v1/api/app-insert-high-five';
            
                   var parameters = {
                       token: JSON.parse(token_),
                       challenge_id:this.state.challengeId,
                       feature_id:this.state.featureId,
                       type : "c",
                       feature_value:this.state.commentText,
                       uid:this.state.UID  
                    };
                   var token = `Bearer ${JSON.parse(token_)}`;
                 ///  alert(JSON.stringify(parameters));
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
                              // console.log(responseText)
                            //   if(dataobject.count_records == 0){
                            //    //  alert('countis xoe')
                            //       this.setState({offSetLoader:false});
                            //   }
                            
                          //   this.InheritedData(dataobject);
            
            
                          if(dataobject.status){
    
                            this.setState({buttonDisable:true})
                            this.setState({commentText:''})
                          alert("comment is successfull");
                          
                           
                        }
                        }
                       )
                       .catch((error) => {
                       })
                }else{
                    alert('please fill comment section..')
                }
              
           
    }




  




    render() {

        return(
            <View style={styles.container}>  
              {/* Header View */}
              <View style={styles.header_view} >
                    <ImageBackground source={headerback} style={styles.header_image}>
                    {/* Header items View */}
                    <View style={styles.header_items}>
                            <TouchableOpacity onPress={()=> this.props.navigation.goBack()}> 
                                <Image source={backarrow} style={styles.menu}> 
                                </Image>
                            </TouchableOpacity>
                             <View style={{flexDirection:'row',marginLeft:10,alignContent:'center',justifyContent:'center',width:'70%'}}> 
                                 <Text style={{fontFamily:'PoppinsBold',fontSize:18}}> Shout outs & digital high 5s   
                                    </Text>
                             </View>

                    </View>
                    </ImageBackground>

                </View>
                 {/* Ended Header View */}
                
                <View style ={{flex:1,paddingHorizontal:15}}>
                <View style={{alignItems:'center',flexDirection:'row',marginLeft:0,marginTop:20,backgroundColor:'transparent'}}>
                    {/* <Image style={{width:15,height:14}} source = {messageopenblack}> 
                        </Image> */}
                    <Text style={{fontFamily:'PoppinsRegular',marginLeft:0}}numberOfLines={2}>Post your Comment   </Text>

                </View>

                {/* <View style={styles.name_view}>
                     <TextInput placeholder='Name' style={{width:'100%',marginLeft:10}}> 
                        </TextInput>
                </View> */}

                        
{/* 
<TextInput style={styles.email_container} placeholder='Email address'
                                       value={this.state.email}
                                       onChangeText={(text) => this.setState({email: text})}>
                            </TextInput> */}

                <View style={styles.email_view}>
                     <TextInput 
                     placeholder="Write your comment here..." 
                     value={this.state.commentText}
                     onChangeText={(text) => this.setState({commentText: text})}
                     style={{width:'100%',marginLeft:10,marginTop:12}}>
                     
                        </TextInput>
                </View>

                <View style={styles.upload_imageView}>

                         <Image style={{width:45,height:35}} source = {messageopenblack}> 
                         </Image> 
                         <TouchableOpacity style={{borderWidth:1,backgroundColor:'white',borderColor:'black',
                         marginHorizontal:0,height:33,marginTop:0,alignItems:'center',marginLeft:15,
                         justifyContent:'center',borderRadius:2,width:100}}>

                            <Text style={{marginLeft:0,fontFamily:'PoppinsSemiBold',fontSize:11,color:'black'
                            ,alignSelf:'center'}}>UPLOAD IMAGE</Text>
                        </TouchableOpacity>
                </View>

                <TouchableOpacity 
                style={{borderWidth:1.5,backgroundColor:'black',marginHorizontal:0
                ,height:45,marginTop:10,alignItems:'center',justifyContent:'center',borderRadius:2}}
                onPress={()=>this.doComment()}
                >
                            <Text style={{marginLeft:10,fontFamily:'PoppinsBold',fontSize:11,color:'white'}}>POST YOUR COMMENT</Text>
                        </TouchableOpacity>

                </View>
                </View>
                
        );
    
    }
}

const styles = StyleSheet.create ({
    
    container: {
        flex:1,
        backgroundColor:'#f0f0f0'
    },
    header_view: {
        height:90,
       
    },

    header_items: {
        height:50,
        flexDirection:'row',
        alignItems:'center',
        
        marginTop:40,
    },
    header_image: {
        flex:1,
        height:90
    },

    menu: {
        width:28,
        height:18,
        marginLeft:15,
        
        
    },

    profile: {
        width:60,
        height:60,    
    },
    
    name_view: {

        flexDirection:'row',
        alignItems:'center',
        marginTop:10,
        height:42,
        width:'100%',
        marginHorizontal:0,
        backgroundColor:'white',
        borderColor:'lightgray',
        borderWidth:1
},

email_view: {

    flexDirection:'row',
    height:180,alignItems:'flex-start',
    width:'100%',
    marginHorizontal:0,
    backgroundColor:'white',
    borderColor:'lightgray',
    borderWidth:1,
    marginTop:8
},
upload_imageView: {

    flexDirection:'row',
    height:75,alignItems:'center',justifyContent:'center',
    width:'100%',
    marginHorizontal:0,
    backgroundColor:'white',
    borderColor:'lightgray',
    borderWidth:1,
    marginTop:8
},
    image_continer: {
        marginLeft:8,
        width:11,
        height:14
    },
    passwordimage_continer: {
        marginLeft:12,
        width:18,
        height:13
    },
})