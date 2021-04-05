import React, { useEffect, useState } from 'react'
import { Text, View, Modal, ScrollView, TouchableOpacity, TextInput, StatusBar } from 'react-native'
import { GiftedChat, Send, SystemMessage, Bubble, Actions, ActionsProps } from 'react-native-gifted-chat'
import styles from './styles'
import { IconButton } from 'react-native-paper'
import { firebase } from '../../firebase/config'
import { Divider, Avatar } from 'react-native-elements'
import * as ImagePicker from 'expo-image-picker'
import * as Permissions from 'expo-permissions'
import * as ImageManipulator from 'expo-image-manipulator'
import Constants from 'expo-constants'
import Dialog from 'react-native-dialog'

export default function Chat({route, navigation }) {
  const myProfile = route.params.myProfile
  const talkData = route.params.talkData
  const [messages, setMessages] = useState([])
  const [progress, setProgress] = useState('')
  const [title, setTitle] = useState('')
  const [image, setImage] = useState('')
  const [dialog, setDialog] = useState(false)

  async function handleSend(messages) {
    const text = messages[0].text;
    const messageRef = firebase.firestore().collection('THREADS')
    messageRef
      .doc(talkData.id)
      .collection('MESSAGES')
      .add({
        text,
        createdAt: new Date().getTime(),
        user: {
          _id: myProfile.id,
          email: myProfile.email,
          avatar: myProfile.avatar,
          name: myProfile.fullName,
        }
      });
    await messageRef
      .doc(talkData.id)
      .set(
        {
          latestMessage: {
            text,
            avatar: myProfile.avatar,
            createdAt: new Date().getTime()
          }
        },
        { merge: true }
      );
  }

  useEffect(() => {
    firebase.firestore()
      .collection('THREADS')
      .doc(talkData.id)
      .onSnapshot(function(document) {
        const data = document.data()
        const title = data.name
        setTitle(title)
      })
  }, []);

  useEffect(() => {
    const messagesListener = firebase.firestore()
      .collection('THREADS')
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
            name: '',
            ...firebaseData
          };
          if (!firebaseData.system) {
            data.user = {
              ...firebaseData.user,
              name: firebaseData.user.name
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
          },
          left: {
            backgroundColor: '#e6e6fa'
          }
        }}
        textStyle={{
          right: {
            color: '#fff'
          },
        }}
      />
    );
  }

  async function handlePickImage() {
    try {
      if (Constants.platform.ios) {
        const { status } = await Permissions.askAsync(Permissions.CAMERA);
        if (status !== 'granted') {
          alert("Permission is required for use.");
          return;
        }
      }
      const result = await ImagePicker.launchImageLibraryAsync();
        if (!result.cancelled) {
          const localUri = await fetch(result.uri);
          const localBlob = await localUri.blob();
          const filename = myProfile.id + new Date().getTime()
          const storageRef = firebase.storage().ref().child("images/" + filename);
          const putTask = storageRef.put(localBlob);
          putTask.on('state_changed', (snapshot) => {
            let progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setProgress(parseInt(progress) + '%')
          }, (error) => {
            console.log(error);
            alert("Upload failed.");
          }, () => {
            putTask.snapshot.ref.getDownloadURL().then(downloadURL => {
              setProgress('')
              setImage(downloadURL)
              setDialog(true)
            })
          })
        }
    } catch (e) {
        console.log('error',e.message);
        alert("The size may be too much.");
    }
  }

  function sendImage() {
    const messageRef = firebase.firestore().collection('THREADS')
    messageRef
      .doc(talkData.id)
      .collection('MESSAGES')
      .add({
        text: '',
        image: image,
        createdAt: new Date().getTime(),
        user: {
          _id: myProfile.id,
          email: myProfile.email,
          avatar: myProfile.avatar,
          name: myProfile.fullName,
        }
      });
    setDialog(false)
    setImage('')
  }

  function renderActions(props) {
    return (
      <Actions
        {...props}
        options={{
           ['Send Image']: handlePickImage,
        }}
        icon={() => (
          <View>
            <IconButton icon='image' size={24} color='#808000' style={{ alignSelf: 'center', marginTop: 0 }} />
          </View>
        )}
      />
    )
  }

  function delMessage(context, message) {
    const options = ['Delete Message', 'Cancel'];
    const cancelButtonIndex = options.length - 1;
    context.actionSheet().showActionSheetWithOptions({
      options,
      cancelButtonIndex
    }, (buttonIndex) => {
      switch (buttonIndex) {
        case 0:
          firebase.firestore().collection('THREADS').doc(talkData.id).collection('MESSAGES').doc(message._id).delete()
          break
      }
    });
  }

  function exitTalk() {
    navigation.goBack()
  }

  function showProfile(user) {
    const usersRef2 = firebase.firestore().collection('users2').doc(user.email)
    usersRef2.get().then((doc) => {
      const userProfile = doc.data()
      navigation.navigate('Participant', { user: userProfile, myProfile: myProfile })
    }).catch((error) => {
      console.log("Error getting document:", error);
    });
  }

  function titleUpdate() {
    const talkRef = firebase.firestore().collection('THREADS').doc(talkData.id)
    talkRef.update({ name: title})
  }

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" />
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
        <IconButton icon='check' size={32} color='#006400' alignSelf='flex-end' onPress={titleUpdate} />
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
        onPressAvatar={showProfile}
        renderUsernameOnMessage={true}
        renderActions={renderActions}
        onLongPress={delMessage}
        placeholder='Type your message here...'
      />
      <Dialog.Container visible={dialog}>
        <Dialog.Title>Send image?</Dialog.Title>
        <Dialog.Button label="OK" bold={true} onPress={() => sendImage()} />
        <Dialog.Button label="Cancel" onPress={() => setDialog(false)} />
      </Dialog.Container>
    </View>
  )
}