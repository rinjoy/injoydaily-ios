
import React,{Component} from 'react';
import {View,StyleSheet,Text,Image,ImageBackground,TouchableOpacity,ScrollView} from 'react-native';
import { Video } from 'expo-av';

import SideMenu from 'react-native-side-menu';
import ContentView from './ContentView';

import { TextInput } from 'react-native-gesture-handler';
const backarrow = require('./../assets/backarrow.png')

const headerback = require('./../images/image-8.png')
const menuImg = require('./../assets/menu.png')
const tickets = require('./../assets/tickets.png')


export default class VideoPlayer extends Component {

    constructor(props) {
        super(props)

        this.state = {
        video_url: this.props.navigation.state.params.video_url,
        isOpen: false,
            selectedItem: 'DashBoard',
          };
      
          this.toggle = this.toggle.bind(this);
      
        }
      
        toggle() {
          this.setState({
              
            isOpen: !this.state.isOpen,
          });
        }
      
        updateMenuState(isOpen) {
          this.setState({ isOpen });
        }
      
        onMenuItemSelected = item =>
          this.setState({
            isOpen: false,
            selectedItem: this.props.navigation.navigate(item),
          });

    render() {

        return(

            <View style={styles.container}>  
              {/* Header View */}
              <View style={styles.header_view} >
                  <ImageBackground source={headerback} style={styles.header_image}>
                  <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
                      <Image source={backarrow} style={styles.menu}>
                      </Image>
                  </TouchableOpacity>
                  </ImageBackground>
             </View>
                 {/* Ended Header View */}
                <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                    <Video source={{ uri: this.state.video_url}}
                           rate={1.0}
                           volume={1.0}
                           mute={false}
                           ref={videoplayer => {
                               this.videoPlayer = videoplayer
                           }}
                           resizeMode="contain"
                           shouldPlay
                           useNativeControls={true}
                           style={{ width: '100%', height: '100%' }}
                    />
                </View>

            
            
            </View>
        );
    
    }
}

const styles = StyleSheet.create ({
    
    container: {
        flex:1,
        backgroundColor:'white'

    },
    header_view: {
        height:90,
        justifyContent:'center',
        backgroundColor:'#84d3fd'

    },

    header_items: {
        height:50,
        flexDirection:'row',
        alignItems:'center',
        
        marginTop:40,
    },
    header_image: {
        flex:1,
        height:90,
        justifyContent:'flex-end',
        marginBottom: 10,
    },

    menu: {
        width:38,
        height:26,
        marginLeft:0,
        marginTop: 10,
        backgroundColor: 'transparent'
        
    },
})