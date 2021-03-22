import React from 'react'
import { Text, View, StatusBar } from 'react-native'
import styles from './styles'

export default function Details(props) {
  const userData = props.extraData
  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" />
      <Text style={styles.title}>Detail screen</Text>
      <Text>ID: {userData.id}</Text>
      <Text>Mail: {userData.email}</Text>
      <Text>Name: {userData.fullName}</Text>
    </View>
  )
}
