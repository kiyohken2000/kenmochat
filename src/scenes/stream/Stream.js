import React, { useEffect, useState } from 'react'
import { Text, View, TouchableOpacity, ScrollView, StatusBar, useColorScheme } from 'react-native'
import Icon from 'react-native-vector-icons/Feather'
import styles from './styles'
import { firebase } from '../../firebase/config'
import { Divider, Avatar } from 'react-native-elements'

export default function Stream( props ) {
  const userData = props.extraData
  const [threads, setThreads] = useState([]);
  const scheme = useColorScheme()

  const addRoom = () => {
    const talkRef = firebase.firestore().collection('THREADS').doc()
    talkRef.set({ 
      id: talkRef.id,
      name: userData.fullName + ' room',
      latestMessage: {
        text: 'Chat start',
        createdAt: new Date().getTime(),
        avatar: userData.avatar,
      }
     })
    .then(() => {
      talkRef.get().then(doc => {
        // console.log(doc.data())
      })
    })
    // props.navigation.navigate('Chat', { talkID: talkRef.id, myProfile: userData })
  }

  useEffect(() => {
    const chatRef = firebase.firestore().collection('THREADS')
      chatRef
      .orderBy('latestMessage.createdAt', 'desc').limit(50)
      .onSnapshot(querySnapshot => {
        const threads = querySnapshot.docs.map(documentSnapshot => {
          return {
            _id: documentSnapshot.id,
            name: '',
            latestMessage: {
              text: ''
            },
            ...documentSnapshot.data()
          };
        });
        setThreads(threads);
      });
  }, []);

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
            threads.map((talk, i) => {
              return (
                <View key={i} style={styles.item}>
                  <TouchableOpacity onPress={() => props.navigation.navigate('Chat', { talkData: talk, myProfile: userData })}>
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
                        <Text style={scheme === 'dark' ? styles.darktitle : styles.title} numberOfLines={1}>{talk.name}</Text>
                        <Text style={scheme === 'dark' ? styles.darklatestMessage : styles.latestMessage} numberOfLines={1}>{talk.latestMessage.text}</Text>
                        <View style={styles.datecontainer}>
                          {talk.id === 'ABhgiSmURLR0xCtPR5C5'?<Text style={scheme === 'dark' ? styles.darkbot : styles.bot}>🤖bot room🤖</Text>:null}
                          <Text style={scheme === 'dark' ? styles.darklatestDate : styles.latestDate}>{displaytime(talk.latestMessage.createdAt)}</Text>
                        </View>
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