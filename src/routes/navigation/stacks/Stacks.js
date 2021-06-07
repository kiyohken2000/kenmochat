import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import Login from '../../../scenes/login'
import Registration from '../../../scenes/registration'
import Home from '../../../scenes/home'
import Profile from '../../../scenes/profile'
import Detail from '../../../scenes/details'
import Scan from '../../../scenes/scan'
import Contact from '../../../scenes/contact'
import User from '../../../scenes/user'
import Info from '../../../scenes/info'
import Talk from '../../../scenes/talk'
import Participant from '../../../scenes/participant'
import Stream from '../../../scenes/stream'
import Chat from '../../../scenes/chat'

// ------------------------------------
// Constants
// ------------------------------------

const Stack = createStackNavigator()

// ------------------------------------
// Navigators
// ------------------------------------

export const LoginNavigator = (props) => {
  const navigationProps = props.navigationProps
  return (
    <Stack.Navigator headerMode="screen" screenOptions={navigationProps}>
      <Stack.Screen
        name="Login"
        component={Login}
      />
      <Stack.Screen
        name="Registration"
        component={Registration}
      />
    </Stack.Navigator>
  )
}

export const HomeNavigator = (props) => {
  const user = props.user
  const navigationProps = props.navigationProps
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

export const ProfileNavigator = (props) => {
  const user = props.user
  const navigationProps = props.navigationProps
  return (
    <Stack.Navigator headerMode="screen" screenOptions={navigationProps}>
      <Stack.Screen name="Profile">
        {props => <Profile {...props} extraData={user} />}
      </Stack.Screen>
      <Stack.Screen name="Detail">
        {props => <Detail {...props} extraData={user} />}
      </Stack.Screen>
      <Stack.Screen name="Scan">
        {props => <Scan {...props} extraData={user} />}
      </Stack.Screen>
      <Stack.Screen name="User">
        {props => <User {...props} extraData={user} />}
      </Stack.Screen>
    </Stack.Navigator>
  )
}

export const ContactNavigator = (props) => {
  const user = props.user
  const navigationProps = props.navigationProps
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

export const StreamNavigator = (props) => {
  const user = props.user
  const navigationProps = props.navigationProps
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