import React, { useEffect, useState } from 'react'
import { Text, View, TouchableOpacity, StatusBar, ScrollView, useColorScheme } from 'react-native'
import styles from './styles'
import { firebase } from '../../firebase/config'
import { Restart } from 'fiction-expo-restart'
import { Avatar } from 'react-native-elements'
import { QRCode } from 'react-native-custom-qr-codes-expo'

export default function Profile(props) {
  const userData = props.extraData
  const scheme = useColorScheme()

  const goDetail = () => {
    props.navigation.navigate('Detail', { userData: userData })
  }

  const signOut = () => {
    firebase.auth().signOut()
    Restart()
  }

  const goScan = () => {
    props.navigation.navigate('Scan', { userData: userData })
  }
  
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ScrollView style={{ flex: 1, width: '100%' }}>
        <View style={styles.main}>
          <View style={styles.avatar}>
            <Avatar
              size="xlarge"
              rounded
              title="NI"
              source={{ uri: userData.avatar }}
            />
          </View>
          <Text style={scheme === 'dark' ? styles.darkfield : styles.field}>Name:</Text>
          <Text style={scheme === 'dark' ? styles.darktitle : styles.title}>{userData.fullName}</Text>
          <Text style={scheme === 'dark' ? styles.darkfield : styles.field}>Mail:</Text>
          <Text style={scheme === 'dark' ? styles.darktitle : styles.title}>{userData.email}</Text>
          <TouchableOpacity style={styles.sbutton} onPress={goScan}>
            <Text style={styles.buttonText}>Scan</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={goDetail}>
            <Text style={styles.buttonText}>Edit</Text>
          </TouchableOpacity>
          <View style={styles.footerView}>
            <Text onPress={signOut} style={styles.footerLink}>Sign out</Text>
          </View>
          <View style={styles.qr}>
            <QRCode
              content={userData.email}
              color={scheme === 'dark' ? 'white' : 'black'}
              size={200}
            />
          </View>
        </View>
      </ScrollView>
    </View>
  )
}