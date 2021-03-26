import React, { useEffect, useState } from 'react'
import { Text, View } from 'react-native'
import styles from './styles';

export default function Talk({ route, navigation }) {
  const talkID = route.params.talkID
  const myProfile = route.params.myProfile
  return (
    <View style={styles.root}>
      <Text style={styles.title}>Talk screen</Text>
      <Text>my Name: {myProfile.fullName}</Text>
      <Text>talkID: {talkID}</Text>
    </View>
  )
}