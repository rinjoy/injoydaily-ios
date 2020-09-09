import React, {Component} from 'react';
import {
    Alert, Image,
    Text,
    View
} from 'react-native';
const unlock = require('./../../images/sun_animation_loader.gif');
import AnimatedLoader from "react-native-animated-loader";

console.disableYellowBox = true;



export default class Loader extends Component {
    constructor(props) {
        super(props);


        this.state = {};

    }

    render() {
        return (
          <AnimatedLoader
              visible={true}
              overlayColor="rgba(255,255,255,0.75)"
              source={require("./loader.json")}
              animationStyle={{width: 100, height: 100}}
              speed={1}
          />)
        }

//     render()
// {
// return (
//     <View style={{backgroundColor: "transparent", position: 'absolute', top: 0, bottom: 0, right: 0, left: 0,  flex: 1, justifyContent: 'center', alignItems: 'center'}}>
//         <Image source={unlock} style={{width: '100%', height: '100%', marginTop: 0}}/>
//     </View>
// )
// }
}
//render()
//{
// return (
//     <View style={{backgroundColor: "rgba(255,255,255,0.75)", position: 'absolute', top: 0, bottom: 0, right: 0, left: 0,  flex: 1, justifyContent: 'center', alignItems: 'center'}}>
//         <Image source={unlock} style={{width: 200, height: 200, marginTop: 0}}/>
//     </View>
// )
//}