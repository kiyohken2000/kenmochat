import 'react-native-gesture-handler';
import React, { useEffect, useState } from 'react'
import { firebase } from '../../firebase/config'
import { colors } from 'theme'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import FontIcon from 'react-native-vector-icons/FontAwesome5'
import Login from '../../scenes/login'
import Registration from '../../scenes/registration'
import Home from '../../scenes/home'
import Profile from '../../scenes/profile'
import Detail from '../../scenes/details'
import Contact from '../../scenes/contact'
import User from '../../scenes/user'
import Info from '../../scenes/info'
import Talk from '../../scenes/talk'
import Participant from '../../scenes/participant'
import * as Notifications from 'expo-notifications'
import * as Permissions from "expo-permissions"
// import DrawerNavigator from './drawer'
import {decode, encode} from 'base-64'
if (!global.btoa) { global.btoa = encode }
if (!global.atob) { global.atob = decode }

const Stack = createStackNavigator()
const Tab = createBottomTabNavigator()

const navigationProps = {
  headerTintColor: 'white',
  headerStyle: { backgroundColor: colors.darkPurple },
  headerTitleStyle: { fontSize: 18 },
}

export default function App() {
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(null)

  registerForPushNotificationsAsync = async () => {

    // 実機であるかどうかをチェック
     if (Constants.isDevice) {
       const { status: existingStatus } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
       let finalStatus = existingStatus;
       if (existingStatus !== 'granted') {
         const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
         finalStatus = status;
       }
   
     // 通知が許可されているかどうかをチェック
       if (finalStatus !== 'granted') {
         alert('Failed to get push token for push notification!');
         return;
       }
   
       // デバイストークンを取得
       const token = (await Notifications.getExpoPushTokenAsync()).data;
       console.log(token);
       this.setState({ expoPushToken: token });
     } else {
       alert('Must use physical device for Push Notifications');
     }
   
   // 端末がAndroidである場合は次の設定を行う
     if (Platform.OS === 'android') {
       Notifications.setNotificationChannelAsync('default', {
         name: 'default',
         importance: Notifications.AndroidImportance.MAX,
         vibrationPattern: [0, 250, 250, 250],
         lightColor: '#FF231F7C',
       });
     }
   };

   (async () => {
    const { status: existingStatus } = await Permissions.getAsync(
      Permissions.NOTIFICATIONS
    );
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      return;
    }
    const token = await Notifications.getExpoPushTokenAsync();
    console.log("token!!!", token);
  })();

  useEffect(() => {
    const usersRef = firebase.firestore().collection('users');
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        usersRef
          .doc(user.uid)
          .onSnapshot(function(document) {
            const userData = document.data()
            setLoading(false)
            setUser(userData)
          })
      } else {
        setLoading(false)
      }
    });
  }, []);

  if (loading) {
    return (
      <></>
    )
  }

  const HomeNavigator = () => {
    return (
      <Stack.Navigator headerMode="screen" screenOptions={navigationProps}>
        <Stack.Screen name="Home">
          {props => <Home {...props} extraData={user} />}
        </Stack.Screen>
        <Stack.Screen name="Talk">
          {props => <Talk {...props} extraData={user} />}
        </Stack.Screen>
        <Stack.Screen name="Participant">
          {props => <Participant {...props} extraData={user} />}
        </Stack.Screen>
      </Stack.Navigator>
    )
  }

  const ProfileNavigator = () => {
    return (
      <Stack.Navigator headerMode="screen" screenOptions={navigationProps}>
        <Stack.Screen name="Profile">
          {props => <Profile {...props} extraData={user} />}
        </Stack.Screen>
        <Stack.Screen name="Detail">
          {props => <Detail {...props} extraData={user} />}
        </Stack.Screen>
      </Stack.Navigator>
    )
  }

  const ContactNavigator = () => {
    return (
      <Stack.Navigator headerMode="screen" screenOptions={navigationProps}>
        <Stack.Screen name="Contact">
          {props => <Contact {...props} extraData={user} />}
        </Stack.Screen>
        <Stack.Screen name="User">
          {props => <User {...props} extraData={user} />}
        </Stack.Screen>
        <Stack.Screen name="Info">
          {props => <Info {...props} extraData={user} />}
        </Stack.Screen>
      </Stack.Navigator>
    )
  }

  const LoginNavigator = () => {
    return (
      <Stack.Navigator headerMode="screen" screenOptions={navigationProps}>
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Registration" component={Registration} />
      </Stack.Navigator>
    )
  }

  const TabNavigator = () => (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused }) => {
          switch (route.name) {
            case 'Home':
              return (
                <FontIcon
                  name="home"
                  color={focused ? colors.lightPurple : colors.gray}
                  size={20}
                  solid
                />
              )
            case 'Contact':
              return (
                <FontIcon
                  name="address-book"
                  color={focused ? colors.lightPurple : colors.gray}
                  size={20}
                  solid
                />
              )
            case 'Profile':
            return (
              <FontIcon
                name="user"
                color={focused ? colors.lightPurple : colors.gray}
                size={20}
                solid
              />
            )
            default:
              return <View />
          }
        },
      })}
      tabBarOptions={{
        activeTintColor: colors.lightPurple,
        inactiveTintColor: colors.gray,
      }}
      initialRouteName="Home"
      swipeEnabled={false}
    >
      <Tab.Screen name="Home" component={HomeNavigator} />
      <Tab.Screen name="Contact" component={ContactNavigator} />
      <Tab.Screen name="Profile" component={ProfileNavigator} />
    </Tab.Navigator>
  )

  return(
    <NavigationContainer>
      { user ? (
        <TabNavigator/>
        ) : (
        <LoginNavigator/>
      )}
    </NavigationContainer>
  )
}
