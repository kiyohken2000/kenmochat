import React from 'react'
import { Text, View, StatusBar } from 'react-native'
import styles from './styles'
import { colors } from 'theme'
import Button from 'components/Button'
import { firebase } from '../../firebase/config'
import { Restart } from 'fiction-expo-restart'

export default function Profile({ route, navigation }) {
  const userData = route.params.userData

  const signOut = () => {
    firebase.auth().signOut()
    Restart()
  }

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" />
      <Text style={styles.title}>Profile</Text>
      <Text>ID: {userData.id}</Text>
      <Text>Mail: {userData.email}</Text>
      <Text>Name: {userData.fullName}</Text>
      <Button
        title="sign out"
        color="white"
        backgroundColor={colors.lightPurple}
        onPress={signOut}
      />
    </View>
  )

}
