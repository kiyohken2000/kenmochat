import React, { useEffect, useState } from 'react'
import { Text, View, TouchableOpacity, ScrollView, StatusBar } from 'react-native'
import styles from './styles'
import { firebase } from '../../firebase/config'
import { Divider, Avatar } from 'react-native-elements'

export default function Chat({route, navigation }) {
  const myData = route.params.myData

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={{ flex: 1, width: '100%' }}>
        <Text>{myData.id}</Text>
        <Text>{myData.fullName}</Text>
      </View>
    </View>
  )
}