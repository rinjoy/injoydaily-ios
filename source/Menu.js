
  
import React,{Component} from 'react';
import {View,Text,StyleSheet,FlatList,Dimensions,StatusBar, Image,TextInput,TouchableOpacity,ScrollView,ImageBackground,RefreshControl,Animated} from 'react-native';
import { Card } from "react-native-elements";

import SideMenu from 'react-native-side-menu';
import ContentView from './ContentView';


const HEADER_MAX_HEIGHT = 125;
const HEADER_MIN_HEIGHT = Platform.OS === 'ios' ? 20 : 20;
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

export default class Menu extends Component {
  constructor(props) {
    super(props);

    this.state = {
    };

    this.toggle = this.toggle.bind(this);

  }


          render() {
              
                  const menu = <ContentView onItemSelected={this.onMenuItemSelected} />;

                  return (
                    <View style={styles.fill}>

                    <SideMenu
                    menu={menu}
                  isOpen={this.state.isOpen}
                  onChange={isOpen => this.updaupdateMenuStateteMenuState(isOpen)}>

                    </SideMenu>
                    </View>

    );
  }
}

const styles = StyleSheet.create({
  fill: {
    flex: 1,
    backgroundColor:'white'
    
  },

})
