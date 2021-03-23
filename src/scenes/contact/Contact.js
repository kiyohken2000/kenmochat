import React, { useEffect, useState } from 'react'
import { Text, View, TextInput, TouchableOpacity, FlatList, Image } from 'react-native'
import styles from './styles'
import { firebase } from '../../firebase/config'

export default function Contact(props) {
  const [email, setEmail] = useState('')
  const [user, setUser] = useState(null)
  const userData = props.extraData
  const contactArray = Object.values(userData.contact)

  const renderItem = ({ item }) => (
    <View>
      <Text>{item.id}</Text>
      <Text>{item.email}</Text>
      <Text>{item.fullName}</Text>
      <Image
        style={styles.logo}
        source={{ uri: item.avatar }}
      />
    </View>
  )

  const addUser = () => {
    const usersRef = firebase.firestore().collection('users')
    usersRef
    .where("email", "==", email)
    .get()
    .then(documentSnapshot => {
      if (documentSnapshot.exists) {
        console.log('Document retrieved successfully.');
      }
    })
    if (user != null) {
      props.navigation.navigate('User', { user: user})
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
        <TouchableOpacity style={styles.button} onPress={addUser}>
          <Text style={styles.buttonText}>Add</Text>
        </TouchableOpacity>
        <FlatList
          data={contactArray}
          renderItem={renderItem} 
        />
      </View>
    </View>
  )
}