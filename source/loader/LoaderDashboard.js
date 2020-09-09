import React, {Component} from 'react';
import {
    Alert, Image,
    Text,
    View
} from 'react-native';
const unlock = require('./../../images/sun_animation_loader.gif');
import AnimatedLoader from "react-native-animated-loader";

console.disableYellowBox = true;



export default class LoaderDashboard extends Component {
    constructor(props) {
        super(props);


        this.state = {};

    }

    render() {
        return (
            <View style={{backgroundColor: "transparent", zIndex: 99, position: 'absolute', top: 0, bottom: 0, right: 0, left: 0,  flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                <Image source={unlock} style={{width: '100%', height: '100%', marginTop: 0}}/>
            </View>
        )
    }
}
