import React, { useEffect, useState } from 'react'
import { Text, View, TouchableOpacity, ScrollView, StatusBar, useColorScheme } from 'react-native'
import Icon from 'react-native-vector-icons/Feather'
import styles from './styles'
import { firebase } from '../../firebase/config'
import { Divider, Avatar } from 'react-native-elements'
import { staticRoom } from './static'
import Dialog from "react-native-dialog"

export default function Stream( props ) {
  const userData = props.extraData
  const [threads, setThreads] = useState([]);
  const [staticArray, setStatic] = useState([])
  const [visible, setVisible] = useState(false)
  const scheme = useColorScheme()

  const addRoom = () => {
    const talkRef = firebase.firestore().collection('THREADS').doc()
    talkRef.set({ 
      id: talkRef.id,
      name: userData.fullName,
      latestMessage: {
        text: 'Chat start',
        createdAt: new Date().getTime(),
        avatar: userData.avatar,
      }
     })
    .then(() => {
      talkRef.get().then(doc => {
        // console.log(doc.data())
        setVisible(false)
      })
    })
  }

  const handleDialog = () => {
    setVisible(!visible)
  }

  useEffect(() => {
    const chatRef = firebase.firestore().collection('THREADS')
      chatRef
      .orderBy('latestMessage.createdAt', 'desc').limit(15)
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

  useEffect(() => {
    for ( const elem of staticRoom ) {
      staticRef = firebase.firestore().collection('THREADS')
      .doc(elem)
      .onSnapshot(function(document) {
        const data = document.data()
        setStatic(oldArray => [...oldArray, data])
      })
    }
  }, []);

  const mArray = threads.concat(staticArray)
  var chatArray = mArray.filter(function(v1,i1,a1){ 
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
            chatArray.map((talk, i) => {
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
                          {talk.id === 'Dj04ExLoykNI2sbmOVeW' ?
                            (<Text style={scheme === 'dark' ? styles.darkbot : styles.bot}>🤖bot room🤖</Text>) :
                            talk.id === 'o65qDbjlphSbs281TDX3' ?
                            (<Text style={scheme === 'dark' ? styles.darkbot : styles.bot}>👁‍🗨Russian👁‍🗨</Text>) :
                            talk.id === 'T5XMlAahT3dWwHfxFnqH' ?
                            (<Text style={scheme === 'dark' ? styles.darkbot : styles.bot}>🔄Korean🔄</Text>) :
                            talk.id === 'zBVTu3ZWHN69NEuBfU0P' ?
                            (<Text style={scheme === 'dark' ? styles.darkbot : styles.bot}>安倍晋三公式✅</Text>) :
                            talk.id === 'gUDLMznsSGu1ga9kHYa7' ?
                            (<Text style={scheme === 'dark' ? styles.darkbot : styles.bot}>☑News from the Developer</Text>) :
                            null
                          }
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
            <TouchableOpacity onPress={() => handleDialog()}>
              <Icon name="plus-circle" size={65} color="orange"/>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <Dialog.Container visible={visible}>
        <Dialog.Title>Create Room?</Dialog.Title>
          <Dialog.Description>
            Do you want to create a chat room?
          </Dialog.Description>
          <Dialog.Button label="Cancel" onPress={() => handleDialog()} />
          <Dialog.Button label="Create" onPress={() => addRoom()}  />
      </Dialog.Container>
    </View>
  )
}