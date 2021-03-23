import React, { useEffect, useState } from 'react'
import { Text, View, StatusBar, TextInput, TouchableOpacity, Image } from 'react-native'
import styles from './styles'
import { firebase } from '../../firebase/config'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

export default function Detail({ route, navigation }) {
  const [fullName, setFullName] = useState('')
  const userData = route.params.userData

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
          <TouchableOpacity>
            <Image
              style={styles.logo}
              source={{ uri: userData.avatar }}
            />
          </TouchableOpacity>
          <Text style={styles.field}>Mail:</Text>
          <Text style={styles.title}>{userData.email}</Text>
          <Text style={styles.field}>Name:</Text>
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
      </KeyboardAwareScrollView>
    </View>
  )
}