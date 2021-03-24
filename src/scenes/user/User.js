import React, { useEffect, useState } from 'react'
import { Text, View, Image, TouchableOpacity } from 'react-native'
import styles from './styles'
import { firebase } from '../../firebase/config'

export default function User({ route, navigation}) {
  const userData = route.params.user
  const myProfile = route.params.myProfile

  const addContact = () => {
    const userRef2 = firebase.firestore().collection('users2').doc(myProfile.email)
    const userRef = firebase.firestore().collection('users').doc(myProfile.id)
    userRef2.update({
      contact: firebase.firestore.FieldValue.arrayUnion(userData.email)
    })
    userRef.update({
      contact: firebase.firestore.FieldValue.arrayUnion(userData.email)
    })
    navigation.goBack()
  }

  return (
    <View style={styles.container}>
      <View style={{ flex: 1, width: '100%' }}>
        <Image
          style={styles.logo}
          source={{ uri: userData.avatar }}
        />
        <Text style={styles.field}>Name:</Text>
        <Text style={styles.title}>{userData.fullName}</Text>
        <Text style={styles.field}>Mail:</Text>
        <Text style={styles.title}>{userData.email}</Text>
        <TouchableOpacity style={styles.button} onPress={addContact}>
          <Text style={styles.buttonText}>Add Contact</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.block}>
          <Text style={styles.buttonText}>Block</Text>
        </TouchableOpacity>
        <View style={styles.footerView}>
          <Text>{myProfile.email}</Text>
          <Text>{myProfile.id}</Text>
        </View>
      </View>
    </View>
  )
}