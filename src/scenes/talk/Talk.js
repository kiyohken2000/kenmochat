import React, { useEffect, useState, useRef } from 'react'
import { Text, View, Modal, ScrollView, TouchableOpacity, TextInput, Image, useColorScheme, FlatList } from 'react-native'
import styles from './styles'
import { GiftedChat, Send, SystemMessage, Bubble, Actions, ActionsProps, InputToolbar } from 'react-native-gifted-chat'
import { firebase } from '../../firebase/config'
import { IconButton } from 'react-native-paper'
import { Divider, Avatar } from 'react-native-elements'
import * as ImagePicker from 'expo-image-picker'
import * as ImageManipulator from 'expo-image-manipulator'
import Clipboard from 'expo-clipboard'
import Constants from 'expo-constants'
import * as Speech from 'expo-speech'
import Dialog from 'react-native-dialog'
import Icon from 'react-native-vector-icons/Feather'
import BottomSheet from 'reanimated-bottom-sheet'
import { imgur, items } from '../key'

export default function Talk({ route, navigation }) {
  const talkData = route.params.talkData
  const myProfile = route.params.myProfile
  const [messages, setMessages] = useState([])
  const [modal, setToggle] = useState(false)
  const [title, setTitle] = useState(talkData.name)
  const [theArray, setTheArray] = useState([])
  const [progress, setProgress] = useState('')
  const [image, setImage] = useState('')
  const [dialog, setDialog] = useState(false)
  const [talking, setTalking] = useState(false)
  const contactArray = Object.values(myProfile.contact?myProfile.contact:['example@example.com'])
  const scheme = useColorScheme()
  const sheetRef = useRef(null)

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
            createdAt: new Date().getTime(),
            email: myProfile.email
          }
        },
        { merge: true }
      );
  }

  useEffect(() => {
    const titleListener = firebase.firestore()
      .collection('talk')
      .doc(talkData.id)
      .onSnapshot(function(document) {
        const data = document.data()
        const title = data.name
        setTitle(title)
      })
    return () => titleListener()
  }, []);

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
            backgroundColor: scheme === 'dark' ? '#262626':'#e6e6fa'
          }
        }}
        textStyle={{
          left: {
            color: scheme === 'dark' ? 'white':'#000000'
          },
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
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
        if (status !== 'granted') {
          alert("Permission is required for use.");
          return;
        }
      }
      const result = await ImagePicker.launchImageLibraryAsync();
        if (!result.cancelled) {
          const actions = [];
          actions.push({ resize: { width: 350 } });
          const manipulatorResult = await ImageManipulator.manipulateAsync(
            result.uri,
            actions,
            {
              compress: 0.1,
            },
          );
          const localUri = await fetch(manipulatorResult.uri);
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
    const messageRef = firebase.firestore().collection('talk')
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

  function renderInputToolbar(props) {
    return (
      <InputToolbar {...props} containerStyle={scheme === 'dark' ? styles.darkinputToolbar : styles.inputToolbar}/>
    )
  }

  function delMessage(context, message) {
    const options = ['Delete Message', 'Copy Text', 'Speech', 'Cancel'];
    const cancelButtonIndex = options.length - 1;
    context.actionSheet().showActionSheetWithOptions({
      options,
      cancelButtonIndex
    }, (buttonIndex) => {
      switch (buttonIndex) {
        case 0:
          if (message.user.email == myProfile.email) {
            firebase.firestore().collection('talk').doc(talkData.id).collection('MESSAGES').doc(message._id).delete()
          } else {
            alert('You can only delete own messages.')
          }
          break
        case 1:
          const text = message.text
          Clipboard.setString(text)
          break
        case 2:
          const script = message.text
          speak(script)
          break
      }
    });
  }

  function speak(txt) {
    const thingToSay = txt
    Speech.speak(thingToSay,
      {
        language: "ja",
        onStart: setTalking(true),
        onDone: () => {done()}
      })
  }

  function stop() {
    Speech.stop()
    setTalking(false)
  }

  function done() {
    setTalking(false)
  }

  function exitTalk() {
    const userRef2 = firebase.firestore().collection('users2').doc(myProfile.email)
    const userRef = firebase.firestore().collection('users').doc(myProfile.id)
    const talkRef = firebase.firestore().collection('talk').doc(talkData.id)
    userRef2.update({
      talk: firebase.firestore.FieldValue.arrayRemove(talkData.id)
    })
    userRef.update({
      talk: firebase.firestore.FieldValue.arrayRemove(talkData.id)
    })
    talkRef.update({
      members: firebase.firestore.FieldValue.arrayRemove(myProfile.email)
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

  function showProfile(user) {
    const usersRef2 = firebase.firestore().collection('users2').doc(user.email)
    usersRef2.get().then((doc) => {
      const userProfile = doc.data()
      navigation.navigate('Participant', { user: userProfile, myProfile: myProfile })
    }).catch((error) => {
      console.log("Error getting document:", error);
    });
  }

  function addUser(invUser) {
    const userRef2 = firebase.firestore().collection('users2').doc(invUser.email)
    const userRef1 = firebase.firestore().collection('users').doc(invUser.id)
    const talkRef = firebase.firestore().collection('talk').doc(talkData.id)
    userRef2.update({
      talk: firebase.firestore.FieldValue.arrayUnion(talkData.id)
    })
    userRef1.update({
      talk: firebase.firestore.FieldValue.arrayUnion(talkData.id)
    })
    talkRef.update({
      members: firebase.firestore.FieldValue.arrayUnion(invUser.email)
    })
    setToggle(false)
  }

  function titleUpdate() {
    const talkRef = firebase.firestore().collection('talk').doc(talkData.id)
    talkRef.update({ name: title})
  }

  theArray.sort(function(a, b) {
    if (a.email < b.email) {
      return -1;
    } else {
      return 1;
    }
  })

  const renderContent = () => (
    <View style={scheme === 'dark' ? styles.darkbottomsheatcontainer : styles.bottomsheatcontainer}>
      <Divider style={styles.divide} />
        <FlatList 
          data={items}
          keyExtractor={(item, index) => index.toString()}
          numColumns={3}
          renderItem={({item}) => (
            <TouchableOpacity onPress={() => {select(item)}}>
              <Image
                source={{ uri: item }}
                style={styles.imageStyle}
              />
            </TouchableOpacity>
          )}
        />
    </View>
  )

  function select(url) {
    console.log(url)
    setImage(url)
    setDialog(true)
    sheetRef.current.snapTo(1)
  }

  return (
    <View style={styles.root}>
      <View style={styles.header}>
        <View style={styles.headertext}>
          <TextInput
            style={scheme === 'dark' ? styles.darktitle : styles.title}
            placeholderTextColor="black"
            onChangeText={(text) => setTitle(text)}
            value={title}
            underlineColorAndroid="transparent"
            autoCapitalize="none"
          />
        </View>
        <IconButton icon='check' size={32} color='#006400' alignSelf='flex-end' onPress={titleUpdate} />
        <IconButton icon='account-multiple-plus-outline' size={32} color='#ff1493' alignSelf='flex-end' onPress={openModal} />
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
        renderInputToolbar={renderInputToolbar}
        textInputStyle={scheme === 'dark' ? styles.darktextInputStyle: styles.textInputStyle}
        placeholder='Type your message here...'
      />
      {talking?
        <View style={styles.Overlay}>
          <TouchableOpacity onPress={stop}>
            <Icon name="stop-circle" size={65} color="red"/>
          </TouchableOpacity>
        </View>:null}
        <View style={{marginBottom: 20}} />
        <BottomSheet
          ref={sheetRef}
          snapPoints={[450, 20]}
          initialSnap={1}
          borderRadius={10}
          renderContent={renderContent}
        />
      <Modal
        visible={modal}
        transparent={false}
        animationType={"slide" || "fade"}
        presentationStyle={"fullScreen" || "pageSheet" || "formSheet" || "overFullScreen"}
      >
        <View style={scheme === 'dark' ? styles.darkmodalcontainer : styles.modalcontainer}>
          <View style={{ flex: 1, width: '100%' }}>
            <View style={styles.modaltitle}>
              <Text style={scheme === 'dark' ? styles.darktitle : styles.title}>Tap to invite users</Text>
            </View>
            <Divider />
            <ScrollView>
              {
                theArray.map((user, i) => {
                  return (
                    <View key={i} style={styles.item}>
                      <TouchableOpacity onPress={() => addUser(user)}>
                        <View style={{flexDirection: 'row'}}>
                          <View style={styles.avatar}>
                            <Avatar
                              size="medium"
                              rounded
                              title="NI"
                              source={{ uri: user.avatar }}
                            />
                          </View>
                          <View style={styles.userinfo}>
                            <Text style={scheme === 'dark' ? styles.darktitle : styles.title}>{user.fullName}</Text>
                            <Text style={scheme === 'dark' ? styles.darkfield : styles.field}>{user.email}</Text>
                          </View>
                        </View>
                      </TouchableOpacity>
                      <Divider />
                    </View>
                  )
                })
              }
            </ScrollView>
            <View style={styles.footerContainer}>
              <TouchableOpacity style={styles.button} onPress={() => setToggle(false)}>
                <Text style={styles.buttonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <Dialog.Container visible={dialog}>
        <Dialog.Title>Send image?</Dialog.Title>
        <Image
          style={styles.logo}
          source={{uri: image}}
        />
        <Dialog.Button label="OK" bold={true} onPress={() => sendImage()} />
        <Dialog.Button label="Cancel" onPress={() => setDialog(false)} />
      </Dialog.Container>
    </View>
  )
}