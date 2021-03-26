import React, { useEffect, useState } from 'react'
import { Text, View, Modal, ScrollView, TouchableOpacity, TextInput } from 'react-native'
import styles from './styles'
import { GiftedChat, Send, SystemMessage, Bubble } from 'react-native-gifted-chat'
import { firebase } from '../../firebase/config'
import { IconButton } from 'react-native-paper'
import { Divider } from 'react-native-elements'

export default function Talk({ route, navigation }) {
  const talkData = route.params.talkData
  const myProfile = route.params.myProfile
  const [messages, setMessages] = useState([])
  const [modal, setToggle] = useState(false)
  const [title, setTitle] = useState(talkData.name)
  const [theArray, setTheArray] = useState([])
  const contactArray = Object.values(myProfile.contact?myProfile.contact:['example@example.com'])

  async function handleSend(messages) {
    const text = messages[0].text;
    const messageRef = firebase.firestore().collection('talk')
    messageRef
      .doc(talkData.id)
      .collection('MESSAGES')
      .add({
        text,
        createdAt: new Date().getTime(),
        user: {
          _id: myProfile.id,
          email: myProfile.email
        }
      });
    await messageRef
      .doc(talkData.id)
      .set(
        {
          latestMessage: {
            text,
            createdAt: new Date().getTime()
          }
        },
        { merge: true }
      );
  }

  useEffect(() => {
    const messagesListener = firebase.firestore()
      .collection('talk')
      .doc(talkData.id)
      .collection('MESSAGES')
      .orderBy('createdAt', 'desc')
      .onSnapshot(querySnapshot => {
        const messages = querySnapshot.docs.map(doc => {
          const firebaseData = doc.data();
          const data = {
            _id: doc.id,
            text: '',
            createdAt: new Date().getTime(),
            ...firebaseData
          };

          if (!firebaseData.system) {
            data.user = {
              ...firebaseData.user,
              name: firebaseData.user.email
            };
          }
          return data;
        });

        setMessages(messages);
      });
    // Stop listening for updates whenever the component unmounts
    return () => messagesListener();
  }, []);

  function renderSend(props) {
    return (
      <Send {...props}>
        <View style={styles.sendingContainer}>
          <IconButton icon='send-circle' size={32} color='#6646ee' />
        </View>
      </Send>
    );
  }

  function renderSystemMessage(props) {
    return (
      <SystemMessage
        {...props}
        wrapperStyle={styles.systemMessageWrapper}
        textStyle={styles.systemMessageText}
      />
    );
  }

  function renderBubble(props) {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: '#6646ee'
          }
        }}
        textStyle={{
          right: {
            color: '#fff'
          }
        }}
      />
    );
  }

  function exitTalk() {
    const userRef2 = firebase.firestore().collection('users2').doc(myProfile.email)
    const userRef = firebase.firestore().collection('users').doc(myProfile.id)
    userRef2.update({
      talk: firebase.firestore.FieldValue.arrayRemove(talkData.id)
    })
    userRef.update({
      talk: firebase.firestore.FieldValue.arrayRemove(talkData.id)
    })
    navigation.goBack()
  }

  function openModal() {
    setTheArray([])
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
    setToggle(true)
  }

  function addUser(invUser) {
    const userRef2 = firebase.firestore().collection('users2').doc(invUser.email)
    const userRef1 = firebase.firestore().collection('users').doc(invUser.id)
    userRef2.update({
      talk: firebase.firestore.FieldValue.arrayUnion(talkData.id)
    })
    userRef1.update({
      talk: firebase.firestore.FieldValue.arrayUnion(talkData.id)
    })
    setToggle(false)
  }

  function titleUpdate() {
    const talkRef = firebase.firestore().collection('talk').doc(talkData.id)
    talkRef.update({ name: title})
  }

  return (
    <View style={styles.root}>
      <View style={styles.header}>
        <View style={styles.headertext}>
          <TextInput
            style={styles.title}
            placeholderTextColor="black"
            onChangeText={(text) => setTitle(text)}
            value={title}
            underlineColorAndroid="transparent"
            autoCapitalize="none"
          />
        </View>
        <IconButton icon='check' size={32} color='#006400'alignSelf='flex-end' onPress={titleUpdate} />
        <IconButton icon='account-multiple-plus-outline' size={32} color='#ff1493'alignSelf='flex-end' onPress={openModal} />
        <IconButton icon='exit-to-app' size={32} color='#2f4f4f'alignSelf='flex-end' onPress={exitTalk} />
      </View>
      <Divider/>
      <GiftedChat
        messages={messages}
        onSend={newMessage => handleSend(newMessage)}
        user={{ _id: myProfile.id }}
        renderSend={renderSend}
        alwaysShowSend
        renderSystemMessage={renderSystemMessage}
        renderBubble={renderBubble}
        placeholder='Type your message here...'
      />
      <Modal
        visible={modal}
        transparent={true}
        animationType={"slide" || "fade"}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.footerLink} onPress={() => setToggle(false)}>Close</Text>
            <ScrollView>
              {
                theArray.map((user, i) => {
                  return (
                      <View key={i} style={styles.modalcontent}>
                        <TouchableOpacity onPress={() => addUser(user)}>
                          <Text style={styles.title}>{user.fullName}</Text>
                          <Text style={styles.field}>{user.email}</Text>
                        </TouchableOpacity>
                        <Divider />
                      </View>
                  )
                })
              }
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  )
}