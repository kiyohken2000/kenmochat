import React, { useEffect, useState } from 'react'
import { Text, View, StatusBar, TouchableOpacity, ScrollView } from 'react-native'
import styles from './styles'
import { firebase } from '../../firebase/config'
import { Avatar } from 'react-native-elements'

export default function Participant({ route, navigation }) {
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

  const block = () => {
    alert('Added to the block list.')
  }

  const report = () => {
    alert('Report has been sent.')
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ScrollView style={styles.main}>
        <View>
          <View style={styles.avatar}>
            <Avatar
              size="xlarge"
              rounded
              title="NI"
              source={{ uri: userData.avatar }}
            />
          </View>
          <Text style={styles.field}>Name:</Text>
          <Text style={styles.title}>{userData.fullName}</Text>
          <Text style={styles.field}>Mail:</Text>
          <Text style={styles.title}>{userData.email}</Text>
          <TouchableOpacity style={styles.button} onPress={addContact}>
            <Text style={styles.buttonText}>Add Contact</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.block} onPress={block}>
            <Text style={styles.buttonText}>Block</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.report} onPress={report}>
            <Text style={styles.buttonText}>Report</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  )
}