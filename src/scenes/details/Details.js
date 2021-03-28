import React, { useEffect, useState } from 'react'
import { Text, View, StatusBar, TextInput, TouchableOpacity, Image } from 'react-native'
import styles from './styles'
import { firebase } from '../../firebase/config'
import { Avatar } from 'react-native-elements'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import * as ImagePicker from 'expo-image-picker'
import * as Permissions from 'expo-permissions'
import * as ImageManipulator from 'expo-image-manipulator'
import Constants from 'expo-constants'

export default function Detail({ route, navigation }) {
  const [fullName, setFullName] = useState('')
  const [progress, setProgress] = useState('')
  const [avatar, setAvatar] = useState('https://firebasestorage.googleapis.com/v0/b/kenmochat.appspot.com/o/avatar%2Ficon.png?alt=media&token=8af3fe41-ad46-45a3-ab5e-7594a98a7c84')
  const userData = route.params.userData

  useEffect(() => {
    setAvatar(userData.avatar)
    setFullName(userData.fullName)
  },[])

  const ImageChoiceAndUpload = async () => {
    try {
      if (Constants.platform.ios) {
        const { status } = await Permissions.askAsync(Permissions.CAMERA);
        if (status !== 'granted') {
          alert("Permission is required for use.");
          return;
        }
      }
      const result = await ImagePicker.launchImageLibraryAsync();
        if (!result.cancelled) {
          const localUri = await fetch(result.uri);
          const localBlob = await localUri.blob();
          const filename = userData.id + new Date().getTime()
          const storageRef = firebase.storage().ref().child("avatar/" + filename);
          const putTask = storageRef.put(localBlob);
          putTask.on('state_changed', (snapshot) => {
            let progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setProgress(parseInt(progress) + '%')
          }, (error) => {
            console.log(error);
            alert("Upload failed.");
          }, () => {
            putTask.snapshot.ref.getDownloadURL().then(downloadURL => {
              setProgress('')
              setAvatar(downloadURL)
            })
          })
        }
    } catch (e) {
        console.log('error',e.message);
        alert("The size may be too much.");
    }
  }

  const profileUpdate = () => {
    const data = {
      id: userData.id,
      email: userData.email,
      fullName: fullName,
      avatar: avatar,
    }
    const userRef2 = firebase.firestore().collection('users2').doc(userData.email)
    userRef2.update(data)
    const userRef = firebase.firestore().collection('users').doc(userData.id)
    userRef.update(data)
    navigation.goBack()
  }

  return (
    <View style={styles.container}>
      <KeyboardAwareScrollView
        style={{ flex: 1, width: '100%' }}
        keyboardShouldPersistTaps="always">
        <StatusBar barStyle="light-content" />
          <View style={styles.avatar}>
            <Avatar
              size="xlarge"
              rounded
              title="NI"
              onPress={ImageChoiceAndUpload}
              source={{ uri: avatar }}
            />
          </View>
          <Text style={{ alignSelf: 'center' }}>{progress}</Text>
          <Text style={styles.field}>Name:</Text>
          <TextInput
            style={styles.input}
            placeholder={fullName}
            placeholderTextColor="#aaaaaa"
            onChangeText={(text) => setFullName(text)}
            value={fullName}
            underlineColorAndroid="transparent"
            autoCapitalize="none"
          />
          <Text style={styles.field}>Mail:</Text>
          <Text style={styles.title}>{userData.email}</Text>
          <TouchableOpacity style={styles.button} onPress={profileUpdate}>
            <Text style={styles.buttonText}>Update</Text>
          </TouchableOpacity>
      </KeyboardAwareScrollView>
    </View>
  )
}