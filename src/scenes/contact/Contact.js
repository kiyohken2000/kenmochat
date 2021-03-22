import React, { useEffect, useState } from 'react'
import { Text, View } from 'react-native'
import styles from './styles';

export default function Contact(props) {
  const userData = props.extraData
  return (
    <View style={styles.root}>
      <Text style={styles.title}>Contact list</Text>
      <Text>ID: {userData.id}</Text>
      <Text>Mail: {userData.email}</Text>
      <Text>Name: {userData.fullName}</Text>
    </View>
  )
}