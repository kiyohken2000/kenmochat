import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, View, StatusBar, TouchableOpacity } from 'react-native'
import Button from 'components/Button'
import { colors } from 'theme'
import { firebase } from '../../firebase/config'
import styles from './styles';

export default function Home(props) {
  const userData = props.extraData
  const goProfile = () => {
    // firebase.auth().signOut();
    props.navigation.navigate('Profile', { userData: userData })
  }
  return (
    <View style={styles.container}>
      <Text>ID: {userData.id}</Text>
      <Text>Mail: {userData.email}</Text>
      <Text>Name: {userData.fullName}</Text>
      <TouchableOpacity style={styles.button} onPress={goProfile}>
        <Text style={styles.buttonText}>Go Profile</Text>
      </TouchableOpacity>
    </View>
  )
}