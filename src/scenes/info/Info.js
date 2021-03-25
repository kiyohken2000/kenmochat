import React, { useEffect, useState } from 'react'
import { Text, View, Image, TouchableOpacity } from 'react-native'
import styles from './styles'
import { firebase } from '../../firebase/config'

export default function Info({ route, navigation}) {
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

  return (
    <View style={styles.container}>
      <View style={{ flex: 1, width: '100%' }}>
        <Image
          style={styles.logo}
          source={{ uri: userInfo.avatar }}
        />
        <Text style={styles.field}>Name:</Text>
        <Text style={styles.title}>{userInfo.fullName}</Text>
        <Text style={styles.field}>Mail:</Text>
        <Text style={styles.title}>{userInfo.email}</Text>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Talk start</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.remove} onPress={removeContact}>
          <Text style={styles.buttonText}>Remove</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.block}>
          <Text style={styles.buttonText}>Block</Text>
        </TouchableOpacity>
        <View style={styles.footerView}>
        </View>
      </View>
    </View>
  )
}