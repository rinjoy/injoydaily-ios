import React from 'react'

import {createStackNavigator} from 'react-navigation-stack';
import {createAppContainer} from 'react-navigation';

import Login from '../source/Login'
import SignUp from '../source/SignUp'
import WalkThrough from '../source/WalkThrough'
import DashBoard from '../source/DashBoard'
import CameraFor from '../source/CameraFor'
import Library from '../source/Library'
import Notifications from '../source/Notifications'
import MyProgress from '../source/MyProgress'
import ContestRules from '../source/ContestRules'
import HowItWorks from '../source/HowItWorks'
import TechSupport from '../source/TechSupport'
import Account from '../source/Account'
import ChangePassword from '../source/ChangePassword'
import Invite from '../source/Invite'
import DailyInspiration from '../source/SeeAll/DailyInspiration'
import Loader from '../source/Loader'
import FaceBook from '../source/FaceBook'
import VideoPlayer from '../source/VideoPlayer'
import TermsConditions from '../source/TermsConditions'
import PrivacyPolicy from '../source/PrivacyPolicy'
import Payment from '../source/Payment'
import PostComments from '../source/SeeAll/PostComments'
import MyPostComments from '../source/SeeAll/MyPostComments'
import AddReply from '../source/SeeAll/AddReply'
import WeaklyVideo from '../source/SeeAll/WeaklyVideo'
import WeekelyVideoSeeAll from '../source/SeeAll/WeekelyVideoSeeAll'
import CheckIt from '../source/SeeAll/CheckIt'
import CheckItSeeAll from '../source/SeeAll/CheckItSeeAll'
import DoComment from '../source/DoComment'
import CoachCorner from '../source/SeeAll/CoachCorner'
import CoachCornerSeeAll from '../source/SeeAll/CoachCornerSeeAll'
import libraryChallenges from '../source/SeeAll/libraryChallenges'
import CoreValues from '../source/SeeAll/CoreValues'
import ShareAWin from '../source/SeeAll/ShareAWin'
import ShareAWinSeeAll from '../source/SeeAll/ShareAWinSeeAll'
import MyShareAWinSeeAll from '../source/SeeAll/MyShareAWinSeeAll'
import LeaderboardSeeAll from '../source/SeeAll/LeaderboardSeeAll'
import LeaderShipSecond from './SeeAll/LeaderShipSecond'
import CoachesSeeAll from './SeeAll/CoachesSeeAll'
import MyProgressSeeAll from './SeeAll/MyProgressSeeAll'
import MyGallery from './SeeAll/MyGallery'
import HowItWorksSeeAll from '../source/SeeAll/HowItWorksSeeAll'
import JeffUpdateSeeAll from '../source/SeeAll/JeffUpdateSeeAll'
import JeffUpdate from '../source/SeeAll/JeffUpdate'
import AddReplyToShareWin from '../source/SeeAll/AddReplyToShareWin'
import LibraryVideoContentSeeAll from '../source/SeeAll/LibraryVideoContentSeeAll'

const NavStack = createStackNavigator({
    SignUp: {screen: SignUp},
    Login: {screen: Login},
    WalkThrough: {screen: WalkThrough},
    DashBoard: {screen: DashBoard},
    Library: {screen: Library},
    Notifications: {screen: Notifications},
    MyProgress: {screen: MyProgress},
    ContestRules: {screen: ContestRules},
    HowItWorks: {screen: HowItWorks},
    TechSupport: {screen: TechSupport},
    Account: {screen: Account},
    ChangePassword: {screen: ChangePassword},
    Invite: {screen: Invite},
    DailyInspiration: {screen: DailyInspiration},
    Loader: {screen: Loader},
    FaceBook: {screen: FaceBook},
    VideoPlayer: {screen: VideoPlayer},
    TermsConditions: {screen: TermsConditions},
    PrivacyPolicy: {screen: PrivacyPolicy},
    PostComments: {screen: PostComments},
    MyPostComments: {screen: MyPostComments},
    AddReply: {screen: AddReply},
    Payment: {screen: Payment},
    WeaklyVideo: {screen: WeaklyVideo},
    WeekelyVideoSeeAll:{screen:WeekelyVideoSeeAll},
    CameraFor: {screen: CameraFor},
    CheckIt: {screen: CheckIt},
    CheckItSeeAll: {screen: CheckItSeeAll},
    DoComment:{screen:DoComment},
    CoachCorner:{screen:CoachCorner},
    CoachCornerSeeAll:{screen:CoachCornerSeeAll},
    CoreValues:{screen:CoreValues},
    ShareAWin:{screen:ShareAWin},
    ShareAWinSeeAll:{screen:ShareAWinSeeAll},
    libraryChallenges:{screen:libraryChallenges},
     HowItWorksSeeAll: {screen: HowItWorksSeeAll},
    LeaderboardSeeAll:{screen:LeaderboardSeeAll},
    LeaderShipSecond: {screen: LeaderShipSecond},
    CoachesSeeAll: {screen: CoachesSeeAll},
    JeffUpdate:{screen:JeffUpdate},
    JeffUpdateSeeAll:{screen:JeffUpdateSeeAll},
    AddReplyToShareWin: {screen: AddReplyToShareWin},
    MyProgressSeeAll: {screen: MyProgressSeeAll},
    MyShareAWinSeeAll: {screen: MyShareAWinSeeAll},
        MyGallery: {screen: MyGallery},
    LibraryVideoContentSeeAll: {screen: LibraryVideoContentSeeAll},
},
{
    headerMode: 'Notfvvhing',
    initialRouteName: 'SignUp',
    defaultNavigationOptions: {
        gesturesEnabled: false,
    },
});

const Drawer = createAppContainer(NavStack);
export default Drawer;
