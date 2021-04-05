import React, { useEffect, useState } from 'react'
import { Text, View, TouchableOpacity, ScrollView, StatusBar } from 'react-native'
import Icon from 'react-native-vector-icons/Feather'
import styles from './styles'
import { firebase } from '../../firebase/config'
import { Divider, Avatar } from 'react-native-elements'

export default function Stream( props ) {
  const userData = props.extraData

  function addRoom() {
    props.navigation.navigate('Chat', { myData:userData })
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={{ flex: 1, width: '100%' }}>
        <Text>{userData.id}</Text>
      </View>
      <View style={styles.Overlay}>
          <View style={{ flexDirection: 'row'}}>
            <View style={{ position: 'absolute', right: 0, alignSelf:'center' }}>
              <TouchableOpacity onPress={addRoom}>
                <Icon name="plus-circle" size={65} color="orange"/>
              </TouchableOpacity>
            </View>
          </View>
        </View>
    </View>
  )
}