import React, { useEffect, useState } from 'react'
import { Text, View, StatusBar, TextInput, TouchableOpacity } from 'react-native'
import styles from './styles'
import { colors } from 'theme'
import Button from 'components/Button'
import { firebase } from '../../firebase/config'
import { Restart } from 'fiction-expo-restart'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

export default function Detail({ route, navigation }) {
  const [fullName, setFullName] = useState('')
  const userData = route.params.userData

  const signOut = () => {
    firebase.auth().signOut()
    Restart()
  }

  const profileUpdate = () => {
    const data = {
      id: userData.id,
      email: userData.email,
      fullName: fullName,
    }
    const userRef = firebase.firestore().collection('users').doc(userData.id)
    userRef.update(data)
  }

  return (
    <View style={styles.container}>
      <KeyboardAwareScrollView
        style={{ flex: 1, width: '100%' }}
        keyboardShouldPersistTaps="always">
        <StatusBar barStyle="light-content" />
        <View style={styles.root}>
          <Text style={styles.title}>Mail: {userData.email}</Text>
        </View>
        <TextInput
          style={styles.input}
          placeholder={userData.fullName}
          placeholderTextColor="#aaaaaa"
          onChangeText={(text) => setFullName(text)}
          value={fullName}
          underlineColorAndroid="transparent"
          autoCapitalize="none"
        />
        <TouchableOpacity style={styles.button} onPress={profileUpdate}>
          <Text style={styles.buttonText}>Update</Text>
        </TouchableOpacity>
        <View style={styles.footerView}>
          <Text onPress={signOut} style={styles.footerLink}>Sign out</Text>
        </View>
      </KeyboardAwareScrollView>
    </View>
  )
}