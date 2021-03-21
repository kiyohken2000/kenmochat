import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, View, StatusBar, TouchableOpacity } from 'react-native'
import Button from 'components/Button'
import { colors } from 'theme'
import { firebase } from '../../firebase/config'
import styles from './styles';

export default function Home(props) {
  const userData = props.extraData
  const signOut = () => {
    firebase.auth().signOut();
  }
  return (
    <View style={styles.container}>
      <Text>ID: {userData.id}</Text>
      <Text>Mail: {userData.email}</Text>
      <Text>Name: {userData.fullName}</Text>
      <TouchableOpacity style={styles.button} onPress={signOut}>
        <Text style={styles.buttonText}>Log out</Text>
      </TouchableOpacity>
    </View>
  )
}