import React, { useEffect, useState, useRef } from 'react'
import { Text, View, TextInput, TouchableOpacity, ScrollView, Image } from 'react-native'
import styles from './styles'
import { firebase } from '../../firebase/config'

export default function Contact(props) {
  const [email, setEmail] = useState('')
  const [user, setUser] = useState([])
  const [theArray, setTheArray] = useState([]);
  const userData = props.extraData
  const contactArray = Object.values(userData.contact?userData.contact:['example@example.com','example@example.com'])

  useEffect(() => {
    for (const elem of contactArray) {
      const userRef2 = firebase.firestore().collection('users2').doc(elem)
      userRef2.get().then((doc) => {
        if (doc.exists) {
          const data = doc.data()
          setTheArray(oldArray => [...oldArray, data])
        } else {
          null
        }
      })
    }
  },[])

  const addUser = () => {
    const usersRef2 = firebase.firestore().collection('users2').doc(email)
    usersRef2.get().then((doc) => {
      if (doc.exists) {
        const userProfile = doc.data()
        props.navigation.navigate('User', { user: userProfile, myProfile: userData })
      } else {
        alert("The user does not exist")
      }
    }).catch((error) => {
        console.log("Error getting document:", error);
    });
  }

  return (
    <View style={styles.container}>
      <View style={{ flex: 1, width: '100%' }}>
        <ScrollView>
        <TextInput
          style={styles.input}
          placeholder='Add user by email'
          placeholderTextColor="#aaaaaa"
          onChangeText={(text) => setEmail(text)}
          value={email}
          underlineColorAndroid="transparent"
          autoCapitalize="none"
        />
        {email?(
          <TouchableOpacity style={styles.button} onPress={addUser}>
            <Text style={styles.buttonText}>Add</Text>
          </TouchableOpacity>)
        :
        (<View style={styles.nonbutton}>
          <Text style={styles.buttonText}>Add</Text>
        </View>)}
        {
          theArray.map((user, i) => {
            return (
              <View key={i}>
                <Text>{user.id}</Text>
                <Text>{user.fullName}</Text>
                <Text>{user.email}</Text>
              </View>
            )
          })
        }
        </ScrollView>
      </View>
    </View>
  )
}