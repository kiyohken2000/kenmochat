import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import { colors } from 'theme'
import Home from 'scenes/home'
import Profile from 'scenes/profile'
import Details from 'scenes/details'
import Login from '../../../scenes/login'
import Registration from '../../../scenes/registration'

// ------------------------------------
// Constants
// ------------------------------------

const Stack = createStackNavigator()

const navigationProps = {
  headerTintColor: 'white',
  headerStyle: { backgroundColor: colors.darkPurple },
  headerTitleStyle: { fontSize: 18 },
}

// ------------------------------------
// Navigators
// ------------------------------------

export const LoginNavigator = () => (
  <Stack.Navigator
    initialRouteName="Login"
    headerMode="screen"
    screenOptions={navigationProps}
  >
    <Stack.Screen
      name="Login"
      component={Login}
    />
    <Stack.Screen
      name="Registration"
      component={Registration}
    />
    <Stack.Screen name="Home" component={HomeNavigator} options={{ title: '', headerTransparent: true }}/>
  </Stack.Navigator>
)

export const HomeNavigator = () => (
  <Stack.Navigator
    initialRouteName="Home"
    headerMode="screen"
    screenOptions={navigationProps}
  >
    <Stack.Screen
      name="Home"
      component={Home}
    />
    <Stack.Screen
      name="Details"
      component={Details}
    />
  </Stack.Navigator>
)

export const ProfileNavigator = () => (
  <Stack.Navigator
    initialRouteName="Profile"
    headerMode="screen"
    screenOptions={navigationProps}
  >
    <Stack.Screen
      name="Profile"
      component={Profile}
    />
    <Stack.Screen
      name="Details"
      component={Details}
    />
  </Stack.Navigator>
)
