import React, { useEffect, useState } from 'react'
import { Text, View, TextInput, TouchableOpacity, FlatList, Image } from 'react-native'
import styles from './styles'
import { firebase } from '../../firebase/config'

export default function Contact(props) {
  const [email, setEmail] = useState('')
  const [user, setUser] = useState(null)
  const [users, setUsers] = useState(null)
  const userData = props.extraData
  const contactArray = Object.values(userData.contact?userData.contact:['example@example.com','example@example.com'])

  const renderItem = ({ item }) => (
    <View>
      <Text>{item}</Text>
    </View>
  )

  /*useEffect(() => {
    for (const elem of contactArray) {
      const userRef2 = firebase.firestore().collection('users2')
      userRef2
      .doc(elem)
      .get()
      .then(function(document) {
        const userData = document.data()
        setUsers(userData)
      })
      console.log(users,'get')
    }
  })*/

  const addUser = () => {
    const usersRef2 = firebase.firestore().collection('users2')
    usersRef2
    .doc(email)
    .get()
    .then((document) => {
      const userProfile = document.data()
      setUser(userProfile)
    })
    if (user != null) {
      props.navigation.navigate('User', { user: user, myProfile: userData })
    } else {
      alert("The user does not exist")
    }
  }

  return (
    <View style={styles.container}>
      <View style={{ flex: 1, width: '100%' }}>
        <TextInput
          style={styles.input}
          placeholder='Add user by email'
          placeholderTextColor="#aaaaaa"
          onChangeText={(text) => setEmail(text)}
          value={email}
          underlineColorAndroid="transparent"
          autoCapitalize="none"
        />
        <Text>{email}</Text>
        {email?(
          <TouchableOpacity style={styles.button} onPress={addUser}>
            <Text style={styles.buttonText}>Add</Text>
          </TouchableOpacity>)
        :
        (<View style={styles.nonbutton}>
          <Text style={styles.buttonText}>Add</Text>
        </View>)}
        <FlatList
          data={contactArray}
          renderItem={renderItem} 
        />
      </View>
    </View>
  )
}