import React, { useEffect, useState } from 'react'
import { Text, View, TouchableOpacity, ScrollView, StatusBar } from 'react-native'
import styles from './styles'
import { firebase } from '../../firebase/config'
import { Divider, Avatar } from 'react-native-elements'

export default function Home(props) {
  const [theArray, setTheArray] = useState([])
  const [value, setValue] = useState('initial')
  const userData = props.extraData
  const talkArray = Object.values(userData.talk?userData.talk:['5U9jbKELiLAO7ZQEYt0K'])

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

  var talks = theArray.filter(function(v1,i1,a1){ 
    return (a1.findIndex(function(v2){ 
      return (v1.id===v2.id) 
    }) === i1);
  });

  function displaytime(timestamp) {
     const time = new Date(timestamp).toISOString().substr(0, 10)
     return time
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={{ flex: 1, width: '100%' }}>
        <ScrollView>
          {
            talks.map((talk, i) => {
              return (
                <View key={i} style={styles.item}>
                  <TouchableOpacity onPress={() => props.navigation.navigate('Talk', { talkData: talk, myProfile: userData })}>
                    <View style={{flexDirection: 'row'}}>
                      <View style={styles.avatar}>
                        <Avatar
                          size="medium"
                          rounded
                          title="NI"
                          source={{ uri: talk.latestMessage.avatar }}
                        />
                      </View>
                      <View style={{ flex: 1, width: '100%' }}>
                        <Text style={styles.title}>{talk.name}</Text>
                        <Text style={styles.latestMessage}>{talk.latestMessage.text}</Text>
                        <Text style={styles.latestDate}>{displaytime(talk.latestMessage.createdAt)}</Text>
                      </View>
                    </View>
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