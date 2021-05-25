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
import Stream from '../../scenes/stream'
import Chat from '../../scenes/chat'
import * as Notifications from 'expo-notifications'
import { useColorScheme } from 'react-native'
import { DefaultTheme, DarkTheme } from '@react-navigation/native'
// import DrawerNavigator from './drawer'
import {decode, encode} from 'base-64'
if (!global.btoa) { global.btoa = encode }
if (!global.atob) { global.atob = decode }

const Stack = createStackNavigator()
const Tab = createBottomTabNavigator()

export default function App() {
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(null)
  const scheme = useColorScheme()

  const navigationProps = {
    headerTintColor: 'white',
    headerStyle: { 
      backgroundColor: scheme === 'dark' ? colors.dark : colors.darkPurple
    },
    headerTitleStyle: { fontSize: 18 },
  }

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

   (async () => {
    const { status: existingStatus } = await Notifications.getPermissionsAsync()
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      return;
    }
    const token = await Notifications.getExpoPushTokenAsync();
    await firebase.firestore().collection("tokens").doc(user.email).set({ token: token.data, email: user.email })
  })();

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

  const StreamNavigator = () => {
    return (
      <Stack.Navigator headerMode="screen" screenOptions={navigationProps}>
        <Stack.Screen name="Stream">
          {props => <Stream {...props} extraData={user} />}
        </Stack.Screen>
        <Stack.Screen name="Chat">
          {props => <Chat {...props} extraData={user} />}
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
            case 'Stream':
            return (
              <FontIcon
                name="stream"
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
      <Tab.Screen name="Stream" component={StreamNavigator} />
    </Tab.Navigator>
  )

  return(
    <NavigationContainer theme={scheme === 'dark' ? DarkTheme : DefaultTheme}>
      { user ? (
        <TabNavigator/>
        ) : (
        <LoginNavigator/>
      )}
    </NavigationContainer>
  )
}
