import React, { useEffect, useState } from 'react'
import { Text, View, TouchableOpacity, Image } from 'react-native'
import styles from './styles'
import { firebase } from '../../firebase/config'
import { Restart } from 'fiction-expo-restart'

export default function Profile(props) {
  const userData = props.extraData

  const goDetail = () => {
    props.navigation.navigate('Detail', { userData: userData })
  }

  const signOut = () => {
    firebase.auth().signOut()
    Restart()
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
        <TouchableOpacity style={styles.button} onPress={goDetail}>
          <Text style={styles.buttonText}>Edit</Text>
        </TouchableOpacity>
        <View style={styles.footerView}>
          <Text onPress={signOut} style={styles.footerLink}>Sign out</Text>
        </View>
      </View>
    </View>
  )
}