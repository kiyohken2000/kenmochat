import React, { useEffect, useState } from 'react'
import { Text, View, TouchableOpacity, ScrollView } from 'react-native'
import styles from './styles'
import { firebase } from '../../firebase/config'
import { Divider } from 'react-native-elements'

export default function Home(props) {
  const [theArray, setTheArray] = useState([])
  const userData = props.extraData
  const talkArray = Object.values(userData.talk?userData.talk:['example'])

  useEffect(() => {
    for (const elem of talkArray) {
      const userRef2 = firebase.firestore().collection('talk').doc(elem)
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