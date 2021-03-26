import React, { useEffect, useState } from 'react'
import { Text, View, Image, TouchableOpacity } from 'react-native'
import styles from './styles'
import { firebase } from '../../firebase/config'

export default function Info({ route, navigation }) {
  const userInfo = route.params.userInfo
  const myProfile = route.params.myProfile

  const removeContact = () => {
    const userRef2 = firebase.firestore().collection('users2').doc(myProfile.email)
    const userRef = firebase.firestore().collection('users').doc(myProfile.id)
    userRef2.update({
      contact: firebase.firestore.FieldValue.arrayRemove(userInfo.email)
    })
    userRef.update({
      contact: firebase.firestore.FieldValue.arrayRemove(userInfo.email)
    })
    navigation.goBack()
  }

  const talkStart = () => {
    const talkRef = firebase.firestore().collection('talk').doc()
    talkRef.set({ id: talkRef.id, name:userInfo.fullName })
    .then(() => {
      talkRef.get().then(doc => {
        console.log(doc.data())
      })
    })
    const userRef1 = firebase.firestore().collection('users2').doc(myProfile.email)
    const userRef2 = firebase.firestore().collection('users2').doc(userInfo.email)
    const userRef3 = firebase.firestore().collection('users').doc(myProfile.id)
    const userRef4 = firebase.firestore().collection('users').doc(userInfo.id)
    userRef1.update({
      talk: firebase.firestore.FieldValue.arrayUnion(talkRef.id)
    })
    userRef2.update({
      talk: firebase.firestore.FieldValue.arrayUnion(talkRef.id)
    })
    userRef3.update({
      talk: firebase.firestore.FieldValue.arrayUnion(talkRef.id)
    })
    userRef4.update({
      talk: firebase.firestore.FieldValue.arrayUnion(talkRef.id)
    })
    navigation.navigate('Home', { talkID: talkRef.id, myProfile: myProfile, newTalk: talkRef.id, userInfo: userInfo })
  }

  return (
    <View style={styles.container}>
      <View style={styles.main}>
        <Image
          style={styles.logo}
          source={{ uri: userInfo.avatar }}
        />
        <Text style={styles.field}>Name:</Text>
        <Text style={styles.title}>{userInfo.fullName}</Text>
        <Text style={styles.field}>Mail:</Text>
        <Text style={styles.title}>{userInfo.email}</Text>
        <TouchableOpacity style={styles.button} onPress={talkStart}>
          <Text style={styles.buttonText}>Talk start</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.remove} onPress={removeContact}>
          <Text style={styles.buttonText}>Remove</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.block}>
          <Text style={styles.buttonText}>Block</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.report}>
          <Text style={styles.buttonText}>Report</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}