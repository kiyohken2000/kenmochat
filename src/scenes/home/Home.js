import React, { useEffect, useState } from 'react'
import { Text, View, TouchableOpacity, ScrollView } from 'react-native'
import styles from './styles'
import { firebase } from '../../firebase/config'
import { Divider } from 'react-native-elements'

export default function Home(props) {
  const [theArray, setTheArray] = useState([])
  const [value, setValue] = useState('initial')
  const userData = props.extraData
  const talkArray = Object.values(userData.talk?userData.talk:['example'])

  useEffect(() => {
    setTheArray([])
    for (const elem of talkArray) {
      const userRef2 = firebase.firestore().collection('talk').doc(elem)
      userRef2.get().then((doc) => {
        if (doc.exists) {
          userRef2
          .onSnapshot(function(document) {
            const data = document.data()
            setTheArray(oldArray => [...oldArray, data])
            console.log('got this', data)
          })
        } else {
          null
        }
      })
    }
  },[])

  theArray.sort(function(a, b) {
    if (a.latestMessage.createdAt > b.latestMessage.createdAt) {
      return -1;
    } else {
      return 1;
    }
  })

  return (
    <View style={styles.container}>
      <View style={{ flex: 1, width: '100%' }}>
        <ScrollView>
          {
            theArray.map((talk, i) => {
              return (
                <View key={i} style={styles.item}>
                  <TouchableOpacity onPress={() => props.navigation.navigate('Talk', { talkData: talk, myProfile: userData })}>
                    <Text style={styles.title}>{talk.name}</Text>
                    <Text style={styles.field}>{talk.latestMessage.text}</Text>
                    <Text style={styles.field}>{talk.latestMessage.createdAt}</Text>
                  </TouchableOpacity>
                  <Divider />
                </View>
              )
            })
          }
        </ScrollView>
      </View>
    </View>
  )
}