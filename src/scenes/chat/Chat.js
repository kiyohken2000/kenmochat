import React, { useEffect, useState, useRef } from 'react'
import { Text, View, Modal, Image, TouchableOpacity, TextInput, StatusBar, useColorScheme, Dimensions, Platform, Button } from 'react-native'
import { GiftedChat, Send, SystemMessage, Bubble, Actions, ActionsProps, InputToolbar } from 'react-native-gifted-chat'
import { FlatList } from "react-native-gesture-handler"
import styles from './styles'
import { IconButton } from 'react-native-paper'
import { firebase } from '../../firebase/config'
import { Divider, Avatar } from 'react-native-elements'
import * as ImagePicker from 'expo-image-picker'
import * as ImageManipulator from 'expo-image-manipulator'
import * as Speech from 'expo-speech'
import * as FileSystem from 'expo-file-system'
import * as MediaLibrary from 'expo-media-library'
import * as Haptics from 'expo-haptics'
import Clipboard from 'expo-clipboard'
import Constants from 'expo-constants'
import Dialog from 'react-native-dialog'
import Icon from 'react-native-vector-icons/Feather'
import BottomSheet from 'reanimated-bottom-sheet'
import { imgur, items } from '../key'
import TypingIndicator from '../typing/Typing'

export default function Chat({route, navigation }) {
  const myProfile = route.params.myProfile
  const talkData = route.params.talkData
  const [messages, setMessages] = useState([])
  const [stamps, setStamps] = useState([])
  const [progress, setProgress] = useState('')
  const [title, setTitle] = useState('')
  const [image, setImage] = useState('')
  const [dialog, setDialog] = useState(false)
  const [selectStamp, setSelectStamp] = useState(false)
  const [talking, setTalking] = useState(false)
  const [isUpload, setUpload] = useState(false)
  const [isOpne, setOpne] = useState(false)
  const scheme = useColorScheme()
  const sheetRef = useRef(null)
  const height = Dimensions.get('window').height
  const [input, setInput] = useState('')

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
    const titleListener = firebase.firestore()
      .collection('THREADS')
      .doc(talkData.id)
      .onSnapshot(function(document) {
        const data = document.data()
        const title = data.name
        setTitle(title)
      })
    return () => titleListener()
  }, []);

  useEffect(() => {
    const stampListener = firebase.firestore()
      .collection('stamp')
      .doc(myProfile.email)
      .onSnapshot(function(document) {
        const data = document.data()
        const d = data.stamp ? data.stamp : ['https://pinepro.ml/static/avatar-780242398e277f267092de9beaa077c9.png']
        const s = d.reverse()
        const stamps = s.concat(items)
        setStamps(stamps)
      })
    return () => stampListener()
  }, []);

  useEffect(() => {
    navigation.addListener('beforeRemove', (e) => {
      setInput('')
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

  async function imgurUpload() {
    try {
      if (Constants.platform.ios) {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
        if (status !== 'granted') {
          alert("Permission is required for use.");
          return;
        }
      }
      const result = await ImagePicker.launchImageLibraryAsync({base64: true});
        if (!result.cancelled) {
          const stampRef = firebase.firestore().collection('stamp').doc(myProfile.email)
          const formdata = new FormData()
          formdata.append("image", result.base64)
          setUpload(true)
          fetch("https://api.imgur.com/3/image/", {
            method: "post",
            headers: {
              Authorization: `Client-ID ${imgur.clientID}`
            },
            body: formdata
          }).then(data => data.json()).then(data => {
            url = data.data.link
            console.log(url)
            stampRef.update({
              stamp: firebase.firestore.FieldValue.arrayUnion(url)
            })
            setUpload(false)
          })
          .catch(error => {
            alert('upload failed')
            setUpload(false)
          })
        }
    } catch (e) {
        console.log('error',e.message);
        alert("The size may be too much.");
    }
  }

  function removeStamp() {
    const stampRef = firebase.firestore().collection('stamp').doc(myProfile.email)
    stampRef.update({
      stamp: firebase.firestore.FieldValue.arrayRemove(image)
    })
    setImage('')
    setSelectStamp(false)
  }

  async function sendImage() {
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
    await messageRef
    .doc(talkData.id)
    .set(
      {
        latestMessage: {
          text: 'Send image.',
          avatar: myProfile.avatar,
          createdAt: new Date().getTime()
        }
      },
      { merge: true }
    );
    setDialog(false)
    setSelectStamp(false)
    sheetRef.current.snapTo(2)
    setOpne(false)
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
    const imageUrl = message.image
    if (!message.image) {
      const options = ['Delete Message', 'Copy Text', 'Speech', 'Cancel'];
      const cancelButtonIndex = options.length - 1;
      context.actionSheet().showActionSheetWithOptions({
        options,
        cancelButtonIndex
      }, (buttonIndex) => {
        switch (buttonIndex) {
          case 0:
            if (message.user.email == myProfile.email) {
              firebase.firestore().collection('THREADS').doc(talkData.id).collection('MESSAGES').doc(message._id).delete()
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
    } else {
      const options = ['Delete Message', 'Save Image', 'Cancel'];
      const cancelButtonIndex = options.length - 1;
      context.actionSheet().showActionSheetWithOptions({
        options,
        cancelButtonIndex
      }, (buttonIndex) => {
        switch (buttonIndex) {
          case 0:
            if (message.user.email == myProfile.email) {
              firebase.firestore().collection('THREADS').doc(talkData.id).collection('MESSAGES').doc(message._id).delete()
            } else {
              alert('You can only delete own messages.')
            }
            break
          case 1:
            downloadImage(imageUrl)
            break
        }
      });
    }
  }

  const downloadImage = ( file ) => {
    FileSystem.downloadAsync(
      file,
      FileSystem.documentDirectory + 'image.png'
    )
    .then( async ( { uri } ) => {
      const { status } = await MediaLibrary.requestPermissionsAsync()
      if( status !== 'granted' ) return
      MediaLibrary.saveToLibraryAsync( uri )
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
    })
    .catch(error => {
      console.log(error)
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error)
    })
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

  function handleInputTextChanged(text) {
    setInput(text)
  }

  function renderFooter() {
    return <TypingIndicator input={input} talkData={talkData} myProfile={myProfile} screen={'THREADS'} />
  }

  function titleUpdate() {
    const talkRef = firebase.firestore().collection('THREADS').doc(talkData.id)
    talkRef.update({ name: title})
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
  }

  function opneSheet() {
    sheetRef.current.snapTo(0)
    setOpne(true)
  }

  function closeSheet() {
    sheetRef.current.snapTo(2)
    setOpne(false)
  }

  const renderContent = () => (
    <View style={scheme === 'dark' ? styles.darkbottomsheatcontainer : styles.bottomsheatcontainer}>
      {Platform.OS != 'ios'?
        isOpne ?
          <Button
            title="Close"
            color="#841584"
            onPress={closeSheet}
          /> :
          <Button
            title="Stamp"
            onPress={opneSheet}
          />
        :null
      }
      <Divider style={styles.divide} />
        <View style={styles.uploadcontainer}>
          {isUpload ?
            <View style={styles.upload}>
              <IconButton icon='progress-upload' size={24} color='#32cd32' style={{ alignSelf: 'center', marginTop: 0, marginBottom: 0 }} />
            </View> :
            <TouchableOpacity style={styles.upload} onPress={imgurUpload}>
              <IconButton icon='cloud-upload-outline' size={24} color='#f0f8ff' style={{ alignSelf: 'center', marginTop: 0, marginBottom: 0 }} />
            </TouchableOpacity>
          }
        </View>
        <FlatList 
          data={stamps}
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
    setSelectStamp(true)
  }

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" />
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
        maxInputLength={300}
        onInputTextChanged={handleInputTextChanged}
        renderInputToolbar={renderInputToolbar}
        renderFooter={renderFooter}
        textInputStyle={scheme === 'dark' ? styles.darktextInputStyle: styles.textInputStyle}
        placeholder='Type your message here...'
      />
      {talking?
      <View style={styles.Overlay}>
        <TouchableOpacity onPress={stop}>
          <Icon name="stop-circle" size={65} color="red"/>
        </TouchableOpacity>
      </View>:null}
      <View style={{marginBottom: Platform.OS === 'ios'?20:40}} />
      <BottomSheet
        ref={sheetRef}
        snapPoints={[height*0.6, 250, Platform.OS === 'ios'?20:40]}
        initialSnap={2}
        borderRadius={20}
        renderContent={renderContent}
        enabledContentGestureInteraction={Platform.OS === 'ios'?true:false}
      />
      <Dialog.Container visible={dialog}>
        <Dialog.Title>Send image?</Dialog.Title>
        <Image
          style={styles.logo}
          source={{uri: image}}
        />
        <Dialog.Button label="OK" bold={true} onPress={() => sendImage()} />
        <Dialog.Button label="Cancel" onPress={() => setDialog(false)} />
      </Dialog.Container>
      <Dialog.Container visible={selectStamp}>
        <Dialog.Title>Send image?</Dialog.Title>
        <Image
          style={styles.logo}
          source={{uri: image}}
        />
        <Dialog.Button label="Send" bold={true} onPress={() => sendImage()} />
        <Dialog.Button label="Remove" onPress={() => removeStamp()} />
        <Dialog.Button label="Cancel" onPress={() => setSelectStamp(false)} />
      </Dialog.Container>
    </View>
  )
}