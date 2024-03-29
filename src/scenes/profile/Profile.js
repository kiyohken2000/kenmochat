import React, { useEffect, useState } from 'react'
import { Text, View, TouchableOpacity, StatusBar, ScrollView, useColorScheme } from 'react-native'
import styles from './styles'
import { firebase } from '../../firebase/config'
import { Restart } from '../../components/reload/reload'
import { Avatar } from 'react-native-elements'
import QRCode from "react-native-qrcode-svg";
import Dialog from "react-native-dialog"
import Spinner from 'react-native-loading-spinner-overlay'

export default function Profile(props) {
  const userData = props.extraData
  const scheme = useColorScheme()
  const [visible, setVisible] = useState(false)
  const [spinner, setSpinner] = useState(false)

  const goDetail = () => {
    props.navigation.navigate('Detail', { userData: userData })
  }

  const signOut = () => {
    firebase.auth().signOut()
    Restart()
  }

  const showDialog = () => {
    setVisible(true)
  }

  const handleCancel = () => {
    setVisible(false)
  }

  const accountDelete = async () => {
    setSpinner(true)
    const collectionRef = firebase.firestore()
    await collectionRef.collection('tokens').doc(userData.email).delete()
    await collectionRef.collection('users').doc(userData.id).delete()
    await collectionRef.collection('users2').doc(userData.email).delete()
    const user = firebase.auth().currentUser
    user.delete().then(function() {
      setSpinner(false)
      firebase.auth().signOut()
    }).catch(function(error) {
      setSpinner(false)
      console.log(error)
    });
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
          <TouchableOpacity style={styles.deletebutton} onPress={showDialog}>
            <Text style={styles.buttonText}>Account delete</Text>
          </TouchableOpacity>
          <View style={styles.footerView}>
            <Text onPress={signOut} style={styles.footerLink}>Sign out</Text>
          </View>
          <View style={styles.qr}>
            <QRCode
              value={userData.email}
              color={scheme === 'dark' ? 'black' : 'white'}
              backgroundColor={scheme === 'dark' ? 'white': 'black'}
              size={200}
            />
          </View>
        </View>
      </ScrollView>
      <Dialog.Container visible={visible}>
        <Dialog.Title>Account delete</Dialog.Title>
        <Dialog.Description>
         アカウントを削除しますか？取り消せません
        </Dialog.Description>
        <Dialog.Button label="Cancel" onPress={handleCancel} />
        <Dialog.Button label="Delete" onPress={accountDelete}  />
      </Dialog.Container>
      <Spinner
        visible={spinner}
        textStyle={{ color: "#fff" }}
        overlayColor="rgba(0,0,0,0.5)"
      />
    </View>
  )
}